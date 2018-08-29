const { BrowserWindow } = require('electron');
const path = require('path');

const width = process.platform === 'darwin' ? 510 : 530;
const height = process.platform === 'darwin' ? 325 : 330;

let aboutDialog = null;

function open() {
  if (aboutDialog == null) {
    const aboutPath = path.join('file://', __dirname, 'about.html');
    aboutDialog = new BrowserWindow({
      show: false,
      width: width,
      height: height,
      resizable: false,
      minimizable: false,
      maximizable: false
    });
    aboutDialog.loadURL(aboutPath);
    aboutDialog.once('ready-to-show', () => {
      aboutDialog.show()
    });
    aboutDialog.on('closed', () => {
      aboutDialog = null;
    });
  } else {
    // Bring to front if open.
    aboutDialog.focus();
  }
}

module.exports.open = open;
