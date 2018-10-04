const { remote, shell }  = require('electron');
const is = require('electron-is');
const updateAvailableWindow = remote.getCurrentWindow();
const updateInfo = updateAvailableWindow.updateInfo;
const workstationVersion = updateAvailableWindow.workstationVersion;

function closeDialog() {
  window.close();
}

function downloadUpdate() {
  let result = shell.openExternal(updateInfo.url);

  console.log("Attempted to open URL: " + updateInfo.url + ". Result: " + result);
  updateAvailableWindow.close();
}
