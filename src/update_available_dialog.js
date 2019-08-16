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
      width: 450,
      height: 145,
      resizable: false,
      minimizable: false,
      maximizable: false,
      alwaysOnTop: true,
      webPreferences: {
        nodeIntegration: true,
        // We need to supply the available version to the browser window so it can
        // communicate this information to the user via the UI. Randomly passings
        // args to a window does not seem great but otherwise we need the window
        // to make the same query we have already made.
        additionalArguments: [updateInfo.version]
      }
    });
    updateAvailableDialog.loadURL(updateAvailablePath);
    updateAvailableDialog.once('ready-to-show', () => {
      updateAvailableDialog.show();
    });
    updateAvailableDialog.on('closed', () => {
      updateAvailableDialog = null;
    });
  }
}

module.exports.open = open;
