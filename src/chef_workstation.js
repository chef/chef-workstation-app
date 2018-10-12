'use strict';
/*
 * Module to interact with the installed version of Chef Workstation
 * (of which this app is a component)
 */

const os = require('os')
const path = require('path');
const fs = require('fs');
const TOML = require('@iarna/toml')

const CWS_REG_NODE = 'HKLM\\SOFTWARE\\Chef\\Chef Workstation';
const CWS_REG_KEY_BIN_DIR = "BinDir";
const CWS_REG_KEY_INSTALL_DIR = "InstallDir";
const is = require('electron-is');
const isDev = require('electron-is-dev');
const { execFileSync } = require('child_process');

const registryCache = {};

const userConfigFile = path.join(os.homedir(), '/.chef-workstation/config.toml');
let userConfigCache = null;

function syncGetRegistryValue(baseKey, key, type = "REG_SZ") {
  var cacheKey = baseKey+key+type;
  var value = registryCache[cacheKey];
  if (value == undefined) {
    var value = execFileSync('reg', ['query', baseKey, '/v', key]);
    // Assumes a single value/single line for this key.
    var re = new RegExp(type + "\\s*(.+)", "g");
    var matchInfo = re.exec(value.toString());
    if (matchInfo == null) {
      throw("Missing registry key " + baseKey + "\\" + key);
    }
    value = matchInfo[1].trim();
    registryCache[cacheKey] = value;
  };
  return value;
}

function getVersion() {
  let manifestPath = null;
  if (isDev) {
    return "development";
  } else if (is.windows()) {
    manifestPath = syncGetRegistryValue(CWS_REG_NODE, CWS_REG_KEY_INSTALL_DIR) + "version-manifest.json";
  } else {
    manifestPath = "/opt/chef-workstation/version-manifest.json";
  }
  const manifest = require(manifestPath);
  return manifest.build_version;
}

function getPathToChefBinary(binBaseName) {
  let result = null;
  if (isDev) {
    return result;
  } else if (is.windows()) {
    result = syncGetRegistryValue(CWS_REG_NODE, CWS_REG_KEY_BIN_DIR) + binBaseName + ".bat"
  } else {
    result = "/opt/chef-workstation/bin/" + binBaseName;
  }
  return result;
}

function getPlatformInfo() {
  const ohai_args = [ 'os', 'platform', 'platform_family', 'platform_version', 'kernel/machine' ];
  return queryOhai(ohai_args);
};

function queryOhai(attributes) {
  let result = {}
  let fixed = []
  var path;

  var path = getPathToChefBinary("ohai");
  if (path == null) {
    return null;
  }
  var ohai = execFileSync(path, attributes);

  // convert output from:
  // "["
  // "  'result1'"
  // ]"
  // ["
  //   'result2'"
  // ]"
  // to
  // ['result1', 'result2']
  //
  // Note that this will only work for simple keys that can be mapped to
  // top-level values.  We don't have need for nested keys right now,
  // and will need to revisit this if /when we do.
  var splitChar = is.windows() ? "\r\n" : "\n";
  ohai.toString().split(splitChar).forEach((item) => {
    if (item != '[' && item != ']' && item != '') {
      fixed.push(item.replace(/["']/g, '').trim());
    }
  })

  attributes.forEach((key, index) => {
    result[key.replace("/", "_")] = fixed[index]
  });
  return result;
};

// Config functions
function getUserConfig() {
  if (userConfigCache == null) {
    try {
      userConfigCache = TOML.parse(fs.readFileSync(userConfigFile));
    } catch(error) {
      userConfigCache = {};
    }
  }
  return userConfigCache;
}

function areUpdatesEnabled() {
  let userConfig = getUserConfig();
  if (userConfig.updates == undefined || userConfig.updates.enable == undefined) {
    return true
  } else {
    return userConfig.updates.enable;
  }
}

function getUpdateIntervalMinutes() {
  let userConfig = getUserConfig();
  if (userConfig.updates == undefined || userConfig.updates.interval_minutes == undefined) {
    return 60*8; // Every 8 hours.
  } else {
    return userConfig.updates.interval_minutes;
  }
}

function getUpdateChannel() {
  let userConfig = getUserConfig();
  if (userConfig.updates == undefined || userConfig.updates.channel == undefined) {
    return 'stable';
  } else {
    return userConfig.updates.channel;
  }
}

module.exports.getVersion = getVersion;
module.exports.getPlatformInfo = getPlatformInfo;

// Config functions
module.exports.areUpdatesEnabled = areUpdatesEnabled;
module.exports.getUpdateIntervalMinutes = getUpdateIntervalMinutes;
module.exports.getUpdateChannel = getUpdateChannel;
