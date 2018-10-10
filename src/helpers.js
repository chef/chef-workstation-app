const package = require('../package.json');
var isDev = require('electron-is-dev');

function getProductName() {
  return package.productName;
}

function getDisplayName() {
  return package.displayName;
}

function getAppVersion() {
  return package.version;
}

function getReleaseChannel() {
  return 'Stable';
}

function getResourcesPath() {
  if (isDev) {
    return path.join(__dirname, '../');
  } else {
    return process.resourcesPath;
  }
}

module.exports.getProductName = getProductName;
module.exports.getDisplayName = getDisplayName;
module.exports.getAppVersion = getAppVersion;
module.exports.getReleaseChannel = getReleaseChannel;
module.exports.getResourcesPath = getResourcesPath;
