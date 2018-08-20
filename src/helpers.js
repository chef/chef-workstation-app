const package = require('../package.json');

function getProductName() {
  return package.productName;
}

function getAppVersion() {
  return package.version;
}

function getReleaseChannel() {
  return 'Stable';
}

module.exports.getProductName = getProductName;
module.exports.getAppVersion = getAppVersion;
module.exports.getReleaseChannel = getReleaseChannel;
