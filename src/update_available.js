const app = require('electron').remote.app;

function closeDialog() {
  window.close();
}

function downloadUpdate() {
  app.emit('do-download');
  updateAvailableWindow.close();
}
