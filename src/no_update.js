const { remote }  = require('electron');
const noUpdateWindow = remote.getCurrentWindow();
const workstation = require('./chef_workstation.js');

function getWorkstationVersion() {
  return workstation.getVersion();
}

function getUpdatesChannel() {
  return workstation.getUpdatesChannel();
}

function closeDialog() {
  noUpdateWindow.close();
}
