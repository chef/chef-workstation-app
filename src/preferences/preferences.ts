import { ipcRenderer } from 'electron';
import AppConfig from '../app-config/app-config';
import Workstation = require('../helpers/chef_workstation.js');

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
    case 'startup': {
      if (checkbox.checked) {
        Workstation.enableAppAtStartup();
      } else {
        Workstation.disableAppAtStartup();
      }
      break;
    }
    case 'software_updates': {
      AppConfig.setUpdatesEnable(checkbox.checked);
      // setup or clear the update interval
      if (checkbox.checked) {
        ipcRenderer.send('do-update-check', {
          // user did not say 'check for updates right now'
          // only that auto-checks should get turned on. Marking
          // user request as false ensurs we don't show popups or errors
          // in a weird place/time (pref dialog)
          UserRequest: false,
          DisplayUpdateNotAvailableDialog: false
        });
        ipcRenderer.send('setup-update-interval');
      } else {
        ipcRenderer.send('clear-update-interval');
      }
      break;
    }
  }

  updateDialog();
}

function updateDialog() {
  var startupCheckbox = (<HTMLInputElement>document.getElementById('startup'));
  startupCheckbox.checked = Workstation.isAppRunningAtStartup();

  var updatesCheckbox = (<HTMLInputElement>document.getElementById('software_updates'));
  updatesCheckbox.disabled = !AppConfig.canControlUpdates();
  updatesCheckbox.checked = AppConfig.areUpdatesEnabled();

  var telemetryCheckbox = (<HTMLInputElement>document.getElementById('telemetry'));
  telemetryCheckbox.disabled = !AppConfig.canUpdateTelemetry();
  telemetryCheckbox.checked = AppConfig.isTelemetryEnabled();
}

module.exports.updateDialog = updateDialog;
module.exports.toggleSetting = toggleSetting;
module.exports.switchTab = switchTab;
module.exports.uninstall = uninstall;
