const { BrowserWindow } = require('electron');
const path = require('path');

let noUpdateDialog = null;

function open() {
  if (noUpdateDialog == null) {
    const noUpdatePath = path.join('file://', __dirname, 'no_update.html');
    noUpdateDialog = new BrowserWindow({
      title: '',
      show: false,
      alwaysOnTop: true,
      width: 420,
      height: 145,
      resizable: false,
      minimizable: false,
      maximizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    noUpdateDialog.removeMenu();
    noUpdateDialog.loadURL(noUpdatePath);
    noUpdateDialog.once('ready-to-show', () => {
      noUpdateDialog.show();
    });
    noUpdateDialog.on('closed', () => {
      noUpdateDialog = null;
    });
  } else {
    noUpdateDialog.show();
  }
}

module.exports.open = open;
