const { shell, BrowserWindow } = require('electron');
const path = require('path');
const workstation = require('./chef_workstation.js');
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

// We open all these links in the users default browser (or what they have setup by default to open HTML).
// We purposefully decided to open it in the system browser instead of a build in Electron window because
// we eventually want most of these to be links to documentation on the Chef website. The license should
// always display from local source but we also want these 3 links to all behave similarly.
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

function getWorkstationVersion() {
  return workstation.getVersion();
}

function getUpdatesChannel() {
  return workstation.getUpdatesChannel();
}

function toggleUpdatesChannel() {
  const { app } = require('electron').remote;
  let currentChannel = workstation.getUpdatesChannel();
  workstation.toggleUpdatesChannel();
  document.getElementById('update-channel-btn').textContent = 'Switch to ' + currentChannel + ' channel';
  document.getElementById('update-channel').innerHTML = '<strong>Release</strong>' + getUpdatesChannel();
  app.emit('do-update-check', true);
}

function isUpdatesDisabled() {
  return !workstation.isUpdatesEnabled();
}

module.exports.open = open;
