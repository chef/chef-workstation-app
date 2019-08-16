const { ipcRenderer, shell } = require('electron');
const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path');
const helpers = require('./helpers.js');
const https = require('https');
// This is some magic to get the same module as the one loaded in the main process
// so that our caches are the same.
const workstation = require('electron').remote.require('./chef_workstation.js');

// We open all these links in the users default browser (or what they have setup by default to open HTML).
// We purposefully decided to open it in the system browser since we eventually want most of these to be
// links to documentation on the Chef website. The license should always display from local source.
// When users do not have internet access, we will open a local file in an Electron window.
function openLicense() {
  licensePath = path.join('file://', helpers.ExternalAssetsDir(), 'html/license.html');
  shell.openExternal(licensePath)
}

function openReleaseNotes() {
  let cwVersion = workstation.getVersion();
  if (cwVersion == "development") {
    devReleaseNotes = path.join('file://', helpers.ExternalAssetsDir(), 'html/development_release_notes.html');
    shell.openExternal(devReleaseNotes);
  } else {
    // This displays raw markdown now but we will update it to display rendered markdown
    // once we have a location for that
    remoteReleaseNotes = `https://packages.chef.io/release-notes/stable/chef-workstation/${cwVersion}.md`
    https.get(remoteReleaseNotes, function(res) {
      shell.openExternal(remoteReleaseNotes);
    }).on('error', function(e){
      localReleaseNotes = new BrowserWindow({show: false});
      localReleaseNotes.loadURL(path.join('file://', helpers.ExternalAssetsDir(), 'html/release_notes.html'));
      localReleaseNotes.once('ready-to-show', () => {
        localReleaseNotes.show()
      });
    });
  }
}

function openPackageDetails() {
  packageDetails = new BrowserWindow({
    width: 530,
    height: 330,
    show: false
  });
  packageDetails.loadURL(path.join('file://', helpers.SrcDir(), 'package_details.html'));
  packageDetails.once('ready-to-show', () => {
    packageDetails.show()
  });
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
