const { ipcRenderer, shell, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const https = require('https');

const workstation = require('../helpers/chef_workstation.js');
const helpers = require('../helpers/helpers.js');
const appConfig = require("../app-config/app-config.js");

// We open all these links in the users default browser (or what they have setup by default to open HTML).
// We purposefully decided to open it in the system browser since we eventually want most of these to be
// links to documentation on the Chef website. The license should always display from local source.
// When users do not have internet access, we will open a local file in an Electron window.
async function openLicense() {
  licensePath = path.join('file://', helpers.ExternalAssetsDir(), 'html/license.html');
  await shell.openExternal(licensePath)
}

async function openReleaseNotes() {
  let cwVersion = workstation.getVersion();
  remoteReleaseNotes = `https://docs.chef.io/release_notes_workstation/?v=${cwVersion}`
  https.get(remoteReleaseNotes, function(res) {
    shell.openExternal(remoteReleaseNotes);
  }).on('error', function(e){
    localReleaseNotes = new BrowserWindow({show: false});
    localReleaseNotes.removeMenu();
    localReleaseNotes.loadURL(path.join('file://', helpers.ExternalAssetsDir(), 'html/release_notes.html'));
    localReleaseNotes.once('ready-to-show', () => {
      localReleaseNotes.show()
    });
  });
}

async function openPatents() {
  shell.openExternal('https://www.chef.io/patents');
}

let packageDetails = null;

function openPackageDetails() {
  if (packageDetails == null) {
    packageDetails = new BrowserWindow({
      width: 530,
      height: 330,
      resizable: false,
      minimizable: false,
      maximizable: false,
      show: false,
      webPreferences: {
        nodeIntegration: true
      }
    });
    packageDetails.removeMenu();
    packageDetails.loadURL(path.join('file://', helpers.SrcDir(), 'about-dialog', 'package_details.html'));
    packageDetails.once('ready-to-show', () => {
      packageDetails.show()
    });
    packageDetails.on('closed', () => {
      packageDetails = null;
    });
  } else {
    packageDetails.show();
  }
}

function getSwitchToChannel() {
   let channel = appConfig.default.getUpdateChannel();
   if (channel == 'stable') {
     return 'current';
   } else {
     return 'stable';
   }
}

function toggleUpdatesChannel() {
  appConfig.default.setUpdateChannel(getSwitchToChannel());
  updateDialog();
  // TODO @afiune Enforce the type TriggerUpdateSettings here when we move to typescript
  // why? because javascript can't do the enforcement
  ipcRenderer.send('do-update-check', { UserRequest: true, DisplayUpdateNotAvailableDialog: false});
}

function updateDialog() {
  document.getElementById('update-channel-btn').disabled = !appConfig.default.canUpdateChannel();
  document.getElementById('update-channel-btn').textContent = 'Switch to ' + getSwitchToChannel() + ' channel';
  document.getElementById('update-channel').innerHTML = '<strong>Release</strong> ' + appConfig.default.getUpdateChannel();
}

module.exports.getSwitchToChannel = getSwitchToChannel;
module.exports.updateDialog = updateDialog;
module.exports.openLicense = openLicense;
module.exports.openReleaseNotes = openReleaseNotes;
module.exports.openPatents = openPatents;
module.exports.openPackageDetails = openPackageDetails;
module.exports.toggleUpdatesChannel = toggleUpdatesChannel;
