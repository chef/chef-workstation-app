import AppConfig from '../app-config/app-config';

function featureFlagEnabled(key: string): boolean {
  return AppConfig.getFeatureFlag(key);
}

function checkboxClick(feat: string) {
  var checkbox = (<HTMLInputElement>document.getElementById(feat)).checked;
  console.log(feat, "now:", checkbox);
}

function loadFeatureFlags() {
  var features = AppConfig.getAllFeatureFlags();

  for (const [key, value] of Object.entries(features)) {
    var checkbox = (<HTMLInputElement>document.getElementById(key));

    if (checkbox != undefined) {
      checkbox.checked = value;
    }
  }
}

module.exports.checkboxClick = checkboxClick;
module.exports.loadFeatureFlags = loadFeatureFlags;
module.exports.featureFlagEnabled = featureFlagEnabled;
