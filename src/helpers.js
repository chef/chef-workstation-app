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

/**
 * Returns the path to the root directory of this application.
 *
 * @return {string} root directory path
 */
function RootDir() {
  return path.resolve(path.join(__dirname, ".."))
}

/**
 * Returns the path to the src/ directory of this applications.
 *
 * @return {string} the src/ directory path
 */
function SrcDir(dir) {
  return path.resolve(path.join(RootDir()), "src")
}

/**
 * Returns the Resources/ directory path outside the 'app.asar' archive.
 * Use this helper to access Resources listed in the 'externalResources'
 * section of the 'electro-builder.yml'
 *
 * @return {string} path to the Resources/ directory
 */
function ExternalResourcesDir(dir) {
  if (isDev) {
    return path.resolve(path.join(__dirname, ".."))
  } else {
    return path.resolve(path.join(__dirname, "../.."))
  }
}

/**
 * Returns the assets/ directory path outside the 'app.asar' archive.
 *
 * @return {string} path to the assets/ directory
 */
function ExternalAssetsDir() {
  return path.resolve(path.join(ExternalResourcesDir(), "assets"))
}

module.exports.SrcDir = SrcDir;
module.exports.RootDir = RootDir;
module.exports.ExternalResourcesDir = ExternalResourcesDir;
module.exports.ExternalAssetsDir = ExternalAssetsDir;
module.exports.getProductName = getProductName;
module.exports.getDisplayName = getDisplayName;
module.exports.getReleaseChannel = getReleaseChannel;
