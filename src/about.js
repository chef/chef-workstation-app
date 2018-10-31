const { shell } = require('electron');
const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path');
const helpers = require('./helpers.js');
const https = require('https');
// This is some magic to get the same module as the one loaded in the main process
// so that our caches are the same.
const workstation = require('electron').remote.require('./src/chef_workstation.js');

// We open all these links in the users default browser (or what they have setup by default to open HTML).
// We purposefully decided to open it in the system browser instead of a build in Electron window because
// we eventually want most of these to be links to documentation on the Chef website. The license should
// always display from local source but we also want these 3 links to all behave similarly.
function openLicense() {
  licensePath = path.join('file://', helpers.getResourcesPath(), 'assets/html/license.html');
  shell.openExternal(licensePath)
}

// If we do not have external internet connectivity to the hosted release notes point people
// at the ones included into the package.
function openReleaseNotes() {
  let cwVersion = workstation.getVersion();
  let notesPath = `https://packages.chef.io/release-notes/stable/chef-workstation/${cwVersion}.md`
  if (cwVersion == "development") {
    shell.openExternal(notesPath);
  } else {
    // This displays raw markdown now but we will update it to display rendered markdown
    // once we have a location for that
    https.get(notesPath, function(res) {
      shell.openExternal(notesPath);
    }).on('error', function(e){
      releaseNotes = new BrowserWindow({show: false});
      releaseNotes.loadURL(path.join('file://', __dirname, "./release_notes.html"));
      releaseNotes.once('ready-to-show', () => {
        releaseNotes.show()
      });
    });
  }
}

function openPackageDetails() {
  detailsPath = path.join('file://', helpers.getResourcesPath(), 'assets/html/package_details.html');
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
  const app = require('electron').remote.app;
  app.emit('do-update-check', true, false);
}

function updateDialog() {
  document.getElementById('update-channel-btn').disabled = !(workstation.areUpdatesEnabled() && workstation.canUpdateChannel());
  document.getElementById('update-channel-btn').textContent = 'Switch to ' + getSwitchToChannel() + ' channel';
  document.getElementById('update-channel').innerHTML = '<strong>Release</strong> ' + workstation.getUpdateChannel();
}
