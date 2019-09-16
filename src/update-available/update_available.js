const { ipcRenderer } = require('electron');

function downloadUpdate() {
  ipcRenderer.send('do-download');
}

module.exports.downloadUpdate = downloadUpdate;
