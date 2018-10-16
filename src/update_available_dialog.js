const { BrowserWindow } = require('electron');
const path = require('path');

let updateAvailableDialog = null;

function open(updateInfo, workstationVersion) {
  if (updateAvailableDialog == null) {
    const updateAvailablePath = path.join('file://', __dirname, 'update_available.html');
    updateAvailableDialog = new BrowserWindow({
      title: '',
      show: false,
      alwaysOnTop: true,
      width: 433,
      height: 145,
      resizable: false,
      minimizable: false,
      maximizable: false,
      alwaysOnTop: true
    });
    updateAvailableDialog.openDevTools({mode:'undocked'});
    updateAvailableDialog.loadURL(updateAvailablePath);
    updateAvailableDialog.once('ready-to-show', () => {
      updateAvailableDialog.show();
    });
    updateAvailableDialog.on('closed', () => {
      updateAvailableDialog = null;
    });
    workstationInfo = require('./chef_workstation.js');
    updateAvailableDialog.updateInfo = updateInfo;
    updateAvailableDialog.workstationVersion = workstationVersion;
  }
}

module.exports.open = open;
