import { ipcRenderer } from 'electron';
import AppConfig from '../app-config/app-config';

function switchTab(tab: string) {
  ipcRenderer.send('switch-preferences-tab', tab);
  updateMenuBar(tab);
}

function updateMenuBar(tab: string) {
  // there must be anly one selected tab
  let selectedDiv = document.getElementsByClassName('selected')[0];

  // remove the selected class and add it to the new tab
  selectedDiv.classList.remove('selected');
  document.getElementById(tab).classList.add('selected');

  // capitalize the first letter and update the title of the dialog
  const upper = tab.charAt(0).toUpperCase() + tab.substring(1);
  document.getElementById('window-title').textContent = upper;
}

// TODO @afiune implement this functionality
function uninstall() {
  console.log('to-be-implemented');
}

function toggleSetting(checkbox: HTMLInputElement) {
  switch(checkbox.id) {
    case 'telemetry': {
      AppConfig.setTelemetryEnable(checkbox.checked);
      break;
    }
  }

  updateContentDialog();
}

function updateContentDialog() {
  var telemetryCheckbox = (<HTMLInputElement>document.getElementById('telemetry'));
  telemetryCheckbox.disabled = !AppConfig.canUpdateTelemetry();
  telemetryCheckbox.checked = AppConfig.isTelemetryEnabled();
}

module.exports.updateContentDialog = updateContentDialog;
module.exports.toggleSetting = toggleSetting;
module.exports.switchTab = switchTab;
module.exports.uninstall = uninstall;
