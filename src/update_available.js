const { remote, shell }  = require('electron');
const updateAvailableWindow = remote.getCurrentWindow();
const updateInfo = updateAvailableWindow.updateInfo;
const workstation = require('./chef_workstation.js');

function getWorkstationVersion() {
  return workstation.getVersion();
}

function getUpdatesChannel() {
  return workstation.getUpdatesChannel();
}

function closeDialog() {
  window.close();
}

function downloadUpdate() {
  let result = shell.openExternal(updateInfo.url);

  console.log("Attempted to open URL: " + updateInfo.url + ". Result: " + result);
  updateAvailableWindow.close();
}
