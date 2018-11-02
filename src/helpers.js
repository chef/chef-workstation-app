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

module.exports.getProductName = getProductName;
module.exports.getDisplayName = getDisplayName;
module.exports.getReleaseChannel = getReleaseChannel;
