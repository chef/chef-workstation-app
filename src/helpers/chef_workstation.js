'use strict';
/*
 * Module to interact with the installed version of Chef Workstation
 * (of which this app is a component)
 */

const { app } = require('electron');
const path = require('path');
const fs = require('fs');

const MACOS_PLIST = 'io.chef.chef-workstation.app.plist';
const MACOS_LAUNCHER = 'chef_workstation_app_launcher';
const CWS_REG_NODE = 'HKLM\\SOFTWARE\\Chef\\Chef Workstation';
const CWS_REG_KEY_BIN_DIR = "BinDir";
const CWS_REG_KEY_INSTALL_DIR = "InstallDir";
const is = require('electron-is');
const { execFileSync } = require('child_process');

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

// Verify if the Tray App is configured to run at startup
function isAppRunningAtStartup() {
  if (is.windows()) {
    console.log('isAppRunningAtStartup(): not implemented');
    return null;
  } else {
    var plist = getUserHome() + '/Library/LaunchAgents/' + MACOS_PLIST;
    return fs.existsSync(plist);
  }
};

// Returns the user's home directory
function getUserHome() {
  return process.env[is.windows() ? 'USERPROFILE' : 'HOME'];
};

// Disables the Tray App to run at startup
function disableAppAtStartup() {
  if (!isAppRunningAtStartup()) {
    return;
  }

  var path = getPathToChefBinary(MACOS_LAUNCHER);
  if (path == null) {
    // TODO @afiune Error handling in Electron: Open an error window?
    console.log('Unable to find the ' + MACOS_LAUNCHER);
    return;
  }

  try {
    execFileSync(path, ['startup', 'disable']);
  } catch(error) {
    // TODO @afiune Error handling in Electron: Open an error window?
    console.log('Unable to remove the Chef Workstation App at startup');
    console.log(error);
  }
}

// Enables the Tray App to run at startup
function enableAppAtStartup() {
  if (isAppRunningAtStartup()) {
    return;
  }

  var path = getPathToChefBinary(MACOS_LAUNCHER);
  if (path == null) {
    // TODO @afiune Error handling in Electron: Open an error window?
    console.log('Unable to find the ' + MACOS_LAUNCHER);
    return;
  }

  try {
    execFileSync(path, ['startup', 'enable']);
  } catch(error) {
    // TODO @afiune Error handling in Electron: Open an error window?
    console.log('Unable to configure the Chef Workstation App at startup');
    console.log(error);
  }
};

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

module.exports.getInstallDir = getInstallDir;
module.exports.getVersion = getVersion;
module.exports.getPlatformInfo = getPlatformInfo;
module.exports.enableAppAtStartup = enableAppAtStartup;
module.exports.disableAppAtStartup = disableAppAtStartup;
module.exports.isAppRunningAtStartup = isAppRunningAtStartup;
module.exports.getInstalledGemVersion = getInstalledGemVersion;
