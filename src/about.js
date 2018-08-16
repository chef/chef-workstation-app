const {BrowserWindow} = require('electron')
const path = require('path')

let aboutWindow = null;

function open() {
  if (aboutWindow == null) {
    const aboutPath = path.join('file://', __dirname, 'about.html');
    aboutWindow = new BrowserWindow({
      show: false,
      width: 510,
      height: 325,
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
