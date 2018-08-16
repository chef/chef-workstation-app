const electron = require('electron');
const path = require('path');
const remote = electron.remote;
const closeBtn = document.getElementById('closeBtn');

closeBtn.addEventListener('click', function (event) {
  var window = remote.getCurrentWindow();
  window.close();
})
