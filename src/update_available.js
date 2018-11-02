const { ipcRenderer } = require('electron');

function closeDialog() {
  window.close();
}

function downloadUpdate() {
  ipcRenderer.send('do-download');
  closeDialog();
}
