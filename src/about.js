const {BrowserWindow} = require('electron')
const path = require('path')

const width = process.platform === 'darwin' ? 510 : 530;
const height = process.platform === 'darwin' ? 325 : 330;

let aboutWindow = null;

function open() {
  if (aboutWindow == null) {
    const aboutPath = path.join('file://', __dirname, 'about.html');
    aboutWindow = new BrowserWindow({
      show: false,
      width: width,
      height: height,
      resizable: false,
      minimizable: false,
      maximizable: false
    });
    aboutWindow.loadURL(aboutPath);
    aboutWindow.once('ready-to-show', () => {
      aboutWindow.show()
    });
    aboutWindow.on('closed', () => {
      aboutWindow = null;
    });
  } else {
    // Bring to front if open.
    aboutWindow.focus();
  }
}

module.exports.open = open;
