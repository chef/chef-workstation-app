const { ipcRenderer } = require('electron');

function switchTab(tab) {
  ipcRenderer.send('switch-preferences-tab', tab);
  updateDialog(tab);
}

function updateDialog(tab) {
  // there must be anly one selected tab
  selectedDiv = document.getElementsByClassName("selected")[0];

  // remove the selected class and add it to the new tab
  selectedDiv.classList.remove("selected");
  document.getElementById(tab).classList.add("selected");

  // capitalize the first letter and update the title of the dialog
  const upper = tab.charAt(0).toUpperCase() + tab.substring(1);
  document.getElementById("window-title").textContent = upper;
}

function uninstall() {
  console.log("to-be-implemented");
}

module.exports.switchTab = switchTab;
module.exports.uninstall = uninstall;
