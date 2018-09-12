const { remote, shell }  = require('electron');
const is = require('electron-is');
const updateAvailableWindow = remote.getCurrentWindow();
const updateInfo = updateAvailableWindow.updateInfo;

function closeDialog() {
  window.close();
}

function downloadUpdate() {
  // TODO: there has to be a better way.
  // https://github.com/chef/chef-workstation-tray/releases/download/v0.0.2/chef-workstation-0.0.2.dmg
  var dl_url = 'https://github.com/chef/chef-workstation-tray/releases/download/'
  if (is.osx()) {
    dl_url = dl_url.concat('v', updateInfo.version, '/chef-workstation-', updateInfo.version, '.dmg'); //force dmg.
  } else {
    dl_url = dl_url.concat('v', updateInfo.version, '/', updateInfo.files[0].url);
  }
  shell.openExternal(dl_url);
  updateAvailableWindow.close();
}