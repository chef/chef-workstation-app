const { BrowserWindow, BrowserView } = require('electron');
const path = require('path');

let preferencesDialog = null;

function open() {
  if (preferencesDialog == null) {
    const preferencesPath = path.join('file://', __dirname, 'preferences.html');
    preferencesDialog = new BrowserWindow({
      titleBarStyle: 'customButtonsOnHover',
      show: false,
      alwaysOnTop: true,
      width: 500,
      height: 380,
      resizable: false,
      minimizable: true,
      maximizable: false,
      webPreferences: {
        nodeIntegration: true
      }
    });
    preferencesDialog.loadURL(preferencesPath);
    preferencesDialog.once('ready-to-show', () => {
      preferencesDialog.show();
    });
    preferencesDialog.on('closed', () => {
      preferencesDialog = null;
    });
  } else {
    preferencesDialog.show();
  }
}

module.exports.open = open;
