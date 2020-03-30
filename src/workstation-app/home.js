const { BrowserWindow } = require('electron');
const path = require('path');

const width = process.platform === 'darwin' ? 510 : 530;
const height = process.platform === 'darwin' ? 325 : 330;

let wksAppHome = null;

function open() {
  if (wksAppHome == null) {
    let homePath = path.join('file://', __dirname, 'home.html');
    wksAppHome = new BrowserWindow({
      // TODO: Be sure to add the Icon for each window
      show: false,
      width: width,
      height: height,
      resizable: false,
      minimizable: true,
      maximizable: false,
      webPreferences: {
        nodeIntegration: true
      }
    });
    wksAppHome.removeMenu();
    wksAppHome.loadURL(homePath);
    wksAppHome.once('ready-to-show', () => {
      wksAppHome.show()
    });
    wksAppHome.on('closed', () => {
      wksAppHome = null;
    });
  } else {
    wksAppHome.show();
  }
}

module.exports.open = open;
