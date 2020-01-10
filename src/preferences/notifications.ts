import { ipcRenderer } from 'electron';
import AppConfig from '../app-config/app-config';

function toggleSetting(checkbox: HTMLInputElement) {
  switch(checkbox.id) {
    case 'software_updates': {
      AppConfig.setUpdatesEnable(checkbox.checked);
      // if a user turns off software updates, then we won't do a UserRequest
      // so that we don't display an update after they said they don't want any
      ipcRenderer.send('do-update-check', {
        UserRequest: checkbox.checked,
        DisplayUpdateNotAvailableDialog: false
      });
      break;
    }
  }

  updateDialog();
}

function updateDialog() {
  var updatesCheckbox = (<HTMLInputElement>document.getElementById('software_updates'));
  updatesCheckbox.disabled = !AppConfig.canControlUpdates();
  updatesCheckbox.checked = AppConfig.areUpdatesEnabled();
}

module.exports.updateDialog = updateDialog;
module.exports.toggleSetting = toggleSetting;
