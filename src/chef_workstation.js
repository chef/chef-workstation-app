'use strict';
/*
 * Module to interact with the installed version of Chef Workstation
 * (of which this app is a component)
 */

const { app } = require('electron');
const os = require('os')
const path = require('path');
const fs = require('fs');
const TOML = require('@iarna/toml')

const CWS_REG_NODE = 'HKLM\\SOFTWARE\\Chef\\Chef Workstation';
const CWS_REG_KEY_BIN_DIR = "BinDir";
const CWS_REG_KEY_INSTALL_DIR = "InstallDir";
const is = require('electron-is');
const { execFileSync } = require('child_process');

const registryCache = {};

const ws_dir = path.join(os.homedir(), '/.chef-workstation');
const userConfigFile = path.join(ws_dir, '/config.toml');
const appConfigFile = path.join(ws_dir, '/.app-managed-config.toml');
let userConfigCache = null;
let appConfigCache = null;
let loadedAppConfig = null;

let userConfigFileWatcher = null;

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

// Return the directory Chef Workstation is installed to
function getInstallDir() {
  if (is.windows()) {
    return syncGetRegistryValue(CWS_REG_NODE, CWS_REG_KEY_INSTALL_DIR);
  }
  return "/opt/chef-workstation";
}

/**
 * Return the installed version of Chef Workstation. If Chef Workstation
 * cannot be found the return a dummy development version.
 *
 * @return {(string|null)} The installed version
 */
function getVersion() {
  let manifestPath = path.join(getInstallDir(), "version-manifest.json");
  try {
    const manifest = require(manifestPath);
    return manifest.build_version;
  } catch(error) {
    if (error.code == "MODULE_NOT_FOUND") {
      return "0.0.0-dev";
    } else {
      throw error;
    }
  }
}

/**
 * Return the gem version installed by Chef Workstation. If Chef Workstation
 * cannot be found then return a dummy development version.
 *
 * @param {string} Gem name [example: chef-cli]
 * @return {(string|null)} The installed gem version
 */
function getInstalledGemVersion(gemName) {
  let gemManifestPath = path.join(getInstallDir(), "gem-version-manifest.json");
  try {
    const gemManifest = require(gemManifestPath);
    return gemManifest[gemName]
  } catch(error) {
    if (error.code == "MODULE_NOT_FOUND") {
      return "0.0.0-dev"
    } else {
      throw error;
    }
  }
}

/**
 * Return the path to a Chef Workstation binary if it can be found. If
 * it cannot be found return null.
 *
 * @return {(string|null)} The path to the binary
 */
function getPathToChefBinary(binBaseName) {
  let path = null;
  if (is.windows()) {
    path = syncGetRegistryValue(CWS_REG_NODE, CWS_REG_KEY_BIN_DIR) + binBaseName + ".bat"
  } else {
    path = "/opt/chef-workstation/bin/" + binBaseName;
  }
  if (fs.existsSync(path)) {
    return path;
  }
  return null;
}

/**
 * Return platform information
 *
 * @return {Object} Object containing platform information
 */
function getPlatformInfo() {
  const ohai_args = [ 'os', 'platform', 'platform_family', 'platform_version', 'kernel/machine' ];
  return queryOhai(ohai_args);
};

/**
 * Return system information queried with Ohai. Returns null if it cannot
 * find the ohai binary to query.
 *
 * @param {string[]} List of attributes to query
 * @return {(Object|null)} Object containing keys specified in attributes
 */
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

function getAppConfig() {
  if (loadedAppConfig == null && appConfigCache == null) {
    try {
      loadedAppConfig = TOML.parse(fs.readFileSync(appConfigFile));
      appConfigCache = loadedAppConfig;
    } catch(error) {
      appConfigCache = {};
    }
  }
  return appConfigCache;
}

function saveAppConfig() {
  if ((loadedAppConfig != null && appConfigCache != null) || (loadedAppConfig == null && appConfigCache != {})) {
    try {
      if (!fs.existsSync(ws_dir)) {
        fs.mkdirSync(ws_dir);
      }
      fs.writeFileSync(appConfigFile, TOML.stringify(appConfigCache));
    } catch(error) {
      // Something went wrong can't persist values so when user restarts they'll be back to defaults.
    }
    loadedAppConfig = appConfigCache;
  }
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
    let appConfig = getAppConfig();
    if (appConfig.updates == undefined || appConfig.updates.channel == undefined) {
      return 'stable';
    } else {
      return appConfig.updates.channel;
    }
  } else {
    return userConfig.updates.channel;
  }
}

function canUpdateChannel() {
  let userConfig = getUserConfig();
  if (userConfig.updates == undefined || userConfig.updates.channel == undefined) {
    return true;
  } else {
    return false;
  }
}

function setUpdateChannel(channel) {
  let appConfig = getAppConfig();
  if (appConfig == null) {
    appConfig = {};
  }
  if (appConfig.updates == undefined) {
    appConfig.updates = { 'channel': channel };
  } else {
    appConfig.updates.channel = channel;
  }
  saveAppConfig();
}

module.exports.getInstallDir = getInstallDir;
module.exports.getVersion = getVersion;
module.exports.getPlatformInfo = getPlatformInfo;
module.exports.getInstalledGemVersion = getInstalledGemVersion;

// Config functions
module.exports.areUpdatesEnabled = areUpdatesEnabled;
module.exports.canUpdateChannel = canUpdateChannel;
module.exports.getUpdateIntervalMinutes = getUpdateIntervalMinutes;
module.exports.getUpdateChannel = getUpdateChannel;
module.exports.setUpdateChannel = setUpdateChannel;
