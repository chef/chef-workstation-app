const { BrowserWindow } = require('electron');
const path = require('path');

const width = process.platform === 'darwin' ? 500 : 530;
const height = process.platform === 'darwin' ? 330 : 330;

let settingDialog = null;

function open() {
  if (settingDialog == null) {
    let settingPath = path.join('file://', __dirname, 'setting.html');
    settingDialog = new BrowserWindow({
      show: false,
      width: width,
      height: height,
      resizable: false,
      minimizable: false,
      maximizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    });
    settingDialog.removeMenu();
    settingDialog.loadURL(settingPath);
    settingDialog.once('ready-to-show', () => {
      settingDialog.show()
    });
    settingDialog.on('closed', () => {
      settingDialog = null;
    });
  } else {
    settingDialog.show();
  }
}

module.exports.open = open;
