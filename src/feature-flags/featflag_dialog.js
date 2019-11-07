const { BrowserWindow } = require('electron');
const path = require('path');

let featflagDialog = null;

function open() {
  if (featflagDialog == null) {
    const featflagPath = path.join('file://', __dirname, 'featflag.html');
    featflagDialog = new BrowserWindow({
      title: '',
      show: false,
      alwaysOnTop: true,
      width: 470,
      height: 280,
      resizable: true,
      minimizable: false,
      maximizable: false,
      webPreferences: {
        nodeIntegration: true
      }
    });
    featflagDialog.removeMenu();
    featflagDialog.loadURL(featflagPath);
    featflagDialog.once('ready-to-show', () => {
      featflagDialog.show();
    });
    featflagDialog.on('closed', () => {
      featflagDialog = null;
    });
  } else {
    featflagDialog.show();
  }
}

module.exports.open = open;

