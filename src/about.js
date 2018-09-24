const { shell, BrowserWindow } = require('electron');
const path = require('path');
const helpers = require('./helpers.js');

const width = process.platform === 'darwin' ? 510 : 530;
const height = process.platform === 'darwin' ? 325 : 330;

let aboutDialog = null;

function open() {
  if (aboutDialog == null) {
    let aboutPath = path.join('file://', __dirname, 'about.html');
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


function openLicense() {
  licensePath = path.join('file://', helpers.getResourcesPath(), 'assets/html/license.html');
  shell.openExternal(licensePath)
}

function openReleaseNotes() {
  notesPath = path.join('file://', helpers.getResourcesPath(), 'assets/html/release_notes.html');
  shell.openExternal(notesPath)
}

function openPackageDetails() {
  detailsPath = path.join('file://', helpers.getResourcesPath(), 'assets/html/package_details.html');
  shell.openExternal(detailsPath)
}

module.exports.open = open;
