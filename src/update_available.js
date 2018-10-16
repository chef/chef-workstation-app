const { remote, shell }  = require('electron');
const updateAvailableWindow = remote.getCurrentWindow();
const updateInfo = updateAvailableWindow.updateInfo;

function closeDialog() {
  window.close();
}

function downloadUpdate() {
  let result = shell.openExternal(updateInfo.url);

  console.log("Attempted to open URL: " + updateInfo.url + ". Result: " + result);
  updateAvailableWindow.close();
}
