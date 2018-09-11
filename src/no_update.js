const { remote }  = require('electron');
const noUpdateWindow = remote.getCurrentWindow();

function closeDialog() {
  noUpdateWindow.close();
}
