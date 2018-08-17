const package = require('../package.json')

function getAppName() {
  return package.productName
}

function getAppVersion() {
  return package.version
}

function getReleaseChannel() {
  return 'Stable'
}
