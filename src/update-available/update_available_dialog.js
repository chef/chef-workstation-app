const { BrowserWindow } = require('electron');
const path = require('path');

let updateAvailableDialog = null;

function open(updateInfo) {
  if (updateAvailableDialog == null) {
    const updateAvailablePath = path.join('file://', __dirname, 'update_available.html');
    updateAvailableDialog = new BrowserWindow({
      title: '',
      show: false,
      alwaysOnTop: true,
      width: 430,
      height: 150,
      resizable: false,
      minimizable: false,
      maximizable: false,
      alwaysOnTop: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        // We need to supply the available version to the browser window so it can
        // communicate this information to the user via the UI. Randomly passings
        // args to a window does not seem great but otherwise we need the window
        // to make the same query we have already made.
        additionalArguments: [updateInfo.version]
      }
    });
    updateAvailableDialog.removeMenu();
    updateAvailableDialog.loadURL(updateAvailablePath);
    updateAvailableDialog.once('ready-to-show', () => {
      updateAvailableDialog.show();
    });
    updateAvailableDialog.on('closed', () => {
      updateAvailableDialog = null;
    });
  } else {
    updateAvailableDialog.show();
  }
}

module.exports.open = open;
