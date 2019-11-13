import { ipcRenderer } from 'electron';

function switchTab(tab: string) {
  ipcRenderer.send('switch-preferences-tab', tab);
  updateMenuBar(tab);
}

function updateMenuBar(tab: string) {
  // there must be anly one selected tab
  let selectedDiv = document.getElementsByClassName("selected")[0];

  // remove the selected class and add it to the new tab
  selectedDiv.classList.remove("selected");
  document.getElementById(tab).classList.add("selected");

  // capitalize the first letter and update the title of the dialog
  const upper = tab.charAt(0).toUpperCase() + tab.substring(1);
  document.getElementById("window-title").textContent = upper;
}

// TODO @afiune implement this functionality
function uninstall() {
  console.log("to-be-implemented");
}

// TODO @afiune implement this functionality
function toggleSetting(checkbox: HTMLInputElement) {
  console.log(checkbox.id, checkbox.checked);
  updateContentDialog();
}

// TODO @afiune implement this functionality
function updateContentDialog() {
  // our checkboxes ids from the preferences dialog:
  // => [startup, chef_updates, telemetry, notfication_updates]
  console.log('updating dialog');
}

module.exports.updateContentDialog = updateContentDialog;
module.exports.toggleSetting = toggleSetting;
module.exports.switchTab = switchTab;
module.exports.uninstall = uninstall;
