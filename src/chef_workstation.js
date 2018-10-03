'use strict';
/*
 * Module to interact with the installed version of Chef Workstation
 * (of which this app is a component)
 */

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

function getVersion() {
  let manifestPath = null;
  if (is.windows()) {
    manifestPath = syncGetRegistryValue(CWS_REG_NODE, CWS_REG_KEY_INSTALL_DIR) + "version-manifest.json";
  } else {
    manifestPath = "/opt/chef-workstation/version-manifest.json"
  }
  const manifest = require(manifestPath);
  return manifest.build_version
}

function getPathToChefBinary(binBaseName) {
  let result = null;
  if (is.windows()) {
    result = syncGetRegistryValue(CWS_REG_NODE, CWS_REG_KEY_BIN_DIR) + binBaseName + ".bat"
  } else {
    result = "/opt/chef-workstation/bin/" + binBaseName;
  }
  return result
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


module.exports.getVersion = getVersion;
module.exports.getPlatformInfo = getPlatformInfo;
