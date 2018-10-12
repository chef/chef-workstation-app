'use strict';
/*
 * Module to interact with the installed version of Chef Workstation
 * (of which this app is a component)
 */

const CWS_REG_NODE = 'HKLM\\SOFTWARE\\Chef\\Chef Workstation';
const CWS_REG_KEY_BIN_DIR = "BinDir";
const CWS_REG_KEY_INSTALL_DIR = "InstallDir";
const is = require('electron-is');
const isDev = require('electron-is-dev');
const { execFileSync } = require('child_process');
const os = require('os')
const path = require('path');
const fs = require('fs');
const TOML = require('@iarna/toml')

const registryCache = {};

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

function readConfigFile() {
  let configFile = path.join(os.homedir() + '/.chef-workstation/config.toml');
  try {
    return TOML.parse(fs.readFileSync(configFile));
  } catch(error) {
    return {};
  }
}

function getUpdatesChannel() {
  let configToml = readConfigFile();
  if (configToml.updates == undefined || configToml.updates.channel == undefined) {
    return 'stable'
  } else {
    return configToml.updates.channel;
  }
}

function isUpdatesEnabled() {
  let configToml = readConfigFile();
  if (configToml.updates == undefined || configToml.updates.enable == undefined) {
    return true
  } else {
    return configToml.updates.enable;
  }
}

function toggleUpdatesChannel() {
  let configFile = path.join(os.homedir() + '/.chef-workstation/config.toml');
  let currentChannel = getUpdatesChannel();
  let configToml = readConfigFile();
  if (currentChannel == 'stable') {
    if (configToml.updates == undefined) {
      configToml.updates = { 'channel': 'current'}
    }
    configToml.updates.channel = 'current';
  } else {
    if (configToml.updates != undefined) {
      configToml.updates.channel = 'stable';
    }
  }
  fs.writeFileSync(configFile, TOML.stringify(configToml));
}

module.exports.getVersion = getVersion;
module.exports.getPlatformInfo = getPlatformInfo;

// config functions
module.exports.getUpdatesChannel = getUpdatesChannel;
module.exports.toggleUpdatesChannel = toggleUpdatesChannel;
module.exports.isUpdatesEnabled = isUpdatesEnabled;