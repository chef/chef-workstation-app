const path = require('path');
const isDev = require('electron-is-dev');
const package_json = require('../package.json');

function getProductName() {
  return package_json.productName;
}

function getDisplayName() {
  return package_json.displayName;
}

function getReleaseChannel() {
  return 'Stable';
}

function getRootDir() {
  if (isDev) {
    return path.resolve(path.join("."))
  } else {
    return path.resolve(path.join(__dirname, "../.."))
  }
}

function getAssetsDir() {
  return path.resolve(path.join(getRootDir(), "assets"))
}

module.exports.getRootDir = getRootDir;
module.exports.getAssetsDir = getAssetsDir;
module.exports.getProductName = getProductName;
module.exports.getDisplayName = getDisplayName;
module.exports.getReleaseChannel = getReleaseChannel;
