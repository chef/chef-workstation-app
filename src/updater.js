const { dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const WSTray = require('./ws_tray');
const noUpdateDialog = require('./no_update_dialog.js');
const updateAvailableDialog = require('./update_available_dialog.js');

// Pointer to menuItem so we can manage it's state.
let updateMenuItem = null;
// If menu is clicked on we'll set the event. Used to decide about showing dialog.
let updateEvent = null;

autoUpdater.autoDownload = false;

autoUpdater.on('error', (error) => {
  // TODO: This needs ux for a better user experience.
  dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString());
  // Re-enable menuItem since something went wrong while checking.
  updateMenuItem.enabled = true;
})

autoUpdater.on('update-available', (updateInfo) => {
  updateAvailableDialog.open(updateInfo);
  updateMenuItem.enabled = true;
  WSTray.instance().displayNotification(true);
})

autoUpdater.on('update-not-available', () => {
  // Open dialog if check was triggered from menuItem.
  if (updateEvent) {
    noUpdateDialog.open();
  }
  updateMenuItem.enabled = true;
  // Only display the notification. Changing the menu text is a lot of work
  // and will be done in the next re-factor.
  WSTray.instance().displayNotification(false);
})

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(log_message);
})

autoUpdater.on('update-downloaded', () => {
  console.log('update-downloaded');
  // autoUpdater.quitAndInstall();
})

// export this to MenuItem click callback
function checkForUpdates(menuItem, focusedWindow, event) {
  updateMenuItem = menuItem;
  updateEvent = event;
  updateMenuItem.enabled = false;
  autoUpdater.checkForUpdates();
}
module.exports.checkForUpdates = checkForUpdates;
