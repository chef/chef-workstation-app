const { ipcRenderer, shell } = require('electron');
const path = require('path');
const helpers = require('./helpers.js');
// This is some magic to get the same module as the one loaded in the main process
// so that our caches are the same.
const workstation = require('electron').remote.require('./chef_workstation.js');

// We open all these links in the users default browser (or what they have setup by default to open HTML).
// We purposefully decided to open it in the system browser instead of a build in Electron window because
// we eventually want most of these to be links to documentation on the Chef website. The license should
// always display from local source but we also want these 3 links to all behave similarly.
function openLicense() {
  licensePath = path.join('file://', __dirname, '../assets/html/license.html');
  shell.openExternal(licensePath)
}

function openReleaseNotes() {
  notesPath = path.join('file://', __dirname, '../assets/html/release_notes.html');
  shell.openExternal(notesPath)
}

function openPackageDetails() {
  detailsPath = path.join('file://', __dirname, '../assets/html/package_details.html');
  shell.openExternal(detailsPath)
}

function getSwitchToChannel() {
   let channel = workstation.getUpdateChannel();
   if (channel == 'stable') {
     return 'current';
   } else {
     return 'stable';
   }
}

function toggleUpdatesChannel() {
  workstation.setUpdateChannel(getSwitchToChannel());
  updateDialog();
  ipcRenderer.send('do-update-check', true, false);
}

function updateDialog() {
  document.getElementById('update-channel-btn').disabled = !(workstation.areUpdatesEnabled() && workstation.canUpdateChannel());
  document.getElementById('update-channel-btn').textContent = 'Switch to ' + getSwitchToChannel() + ' channel';
  document.getElementById('update-channel').innerHTML = '<strong>Release</strong> ' + workstation.getUpdateChannel();
}