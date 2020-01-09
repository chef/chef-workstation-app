import AppConfig from '../app-config/app-config';

function showLegalDisclosure() {
  var legalButton = (<HTMLInputElement>document.getElementById('legal_disclosure'));
  if (legalButton.style.opacity == '1') {
    legalButton.style.opacity = '0';
  } else {
    legalButton.style.opacity = '1';
  }
}

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
module.exports.showLegalDisclosure = showLegalDisclosure;
