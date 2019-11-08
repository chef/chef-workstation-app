import AppConfig from '../app-config/app-config';

function toggleFeatureFlag(checkbox: HTMLInputElement) {
  AppConfig.setFeatureFlag(checkbox.id, checkbox.checked);
  updateDialog();
}

function updateDialog() {
  var features = AppConfig.getAllFeatureFlags();

  for (const [key, value] of Object.entries(features)) {
    var checkbox = (<HTMLInputElement>document.getElementById(key));

    if (checkbox != undefined) {
      checkbox.checked = value;

      // can the feature flag be updated from the Workstation App?
      if (AppConfig.canUpdateFeature(key)) {
        checkbox.disabled = false;
      } else {
        checkbox.disabled = true;
      }
    }
  }
}

module.exports.updateDialog = updateDialog;
module.exports.toggleFeatureFlag = toggleFeatureFlag;
