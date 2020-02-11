import path = require('path');
import os = require('os');
import fs = require('fs');
import TOML = require('@iarna/toml');

// Abstraction of the Chef Workstation config.toml file
interface Config {
  telemetry?: {
    enable?: boolean;
    dev?: boolean;
  };
  updates?: {
    channel?: string;
    enable?: boolean;
    interval_minutes?: number;
  };
  features?: Map<string, boolean>;
};

class AppConfig {
  private defaultIntervalMinutes = 60*8; // Every 8 hours.
  private workstationDir = path.join(os.homedir(), '.chef-workstation');
  private userConfigFile = path.join(this.workstationDir, 'config.toml');
  private appConfigFile = path.join(this.workstationDir, '.app-managed-config.toml');

  constructor() {}

  // returns a all the feature flags from the user config
  private getAllUserFeatures(): Map<string, boolean> {
    let userConfig = this.getUserConfig();
    if (userConfig.features == undefined) {
      return new Map();
    }
    return userConfig.features;
  }

  // returns a all the feature flags from the application config
  private getAllAppFeatures(): Map<string, boolean> {
    let appConfig = this.getAppConfig();
    if (appConfig.features == undefined) {
      return new Map();
    }
    return appConfig.features;
  }

  // returns the user config, which is what the config.toml file says
  public getUserConfig(): Config {
    try {
      // @afiune Check for the file before reading it
      return TOML.parse(fs.readFileSync(this.userConfigFile, "utf8"));
    } catch(error) {
      // TODO @afiune Error handling in Electron: Open an error window?
      return {};
    }
  }

  // returns the application config, which is what the .app-managed-config.toml file says.
  // this is the config that the app controls and it gets merged witht he user config
  public getAppConfig(): Config {
    try {
      return TOML.parse(fs.readFileSync(this.appConfigFile, "utf8")) as Config;
    } catch(error) {
      return {};
    }
  }

  // saves the application config to disk
  public saveAppConfig(appConfig) {
    try {
      if (!fs.existsSync(this.workstationDir)) {
        fs.mkdirSync(this.workstationDir);
      }
      fs.writeFileSync(this.appConfigFile, TOML.stringify(appConfig));
    } catch(error) {
      // Something went wrong can't persist values so when user restarts
      // they'll be back to defaults.
      // TODO @afiune Error handling in Electron: Open an error window?
      console.log(error);
    }
  }

  // returns whether the automatic updates are enabled or not (default: true)
  public areUpdatesEnabled() {
    let userConfig = this.getUserConfig();

    if (userConfig.updates == undefined || userConfig.updates.enable == undefined) {
      let appConfig = this.getAppConfig();
      if (appConfig.updates == undefined || appConfig.updates.enable == undefined) {
        return true;
      }
      return appConfig.updates.enable;
    }

    return userConfig.updates.enable;
  }

  // returns the list of all the feature flags, the function first looks for all
  // the features configured at the application config then, it uses the user
  // config to overwrite them
  public getAllFeatureFlags(): Map<string, boolean> {
    // get all features from the application config
    var allFeatures = this.getAllAppFeatures();

    // get all features from the users config and overwrite the app config
    for (const [key, value] of Object.entries(this.getAllUserFeatures())) {
      allFeatures[key] = value;
    }

    return allFeatures;
  }

  // returns a single feature flag
  public getFeatureFlag(key: string): boolean {
    let features = this.getAllFeatureFlags();
    if (features == undefined || features[key] == undefined) {
      return false
    }
    return features[key];
  }

  // returns the interval to check for updates in minutes (default: 480)
  public getUpdateIntervalMinutes() {
    let userConfig = this.getUserConfig();
    if (userConfig.updates == undefined || userConfig.updates.interval_minutes == undefined) {
      return this.defaultIntervalMinutes; // every 8 hours
    }
    return userConfig.updates.interval_minutes;
  }

  // returns the channel to look for updates (default: stable)
  public getUpdateChannel() {
    let userConfig = this.getUserConfig();

    if (userConfig.updates == undefined || userConfig.updates.channel == undefined) {
      let appConfig = this.getAppConfig();
      if (appConfig.updates == undefined || appConfig.updates.channel == undefined) {
        return 'stable';
      }
      return appConfig.updates.channel;
    }

    return userConfig.updates.channel;
  }

  // verify if the Tray app can update the channel (default: true)
  //
  // config example:
  // ```
  // [updates]
  // channel = 'current'
  // ```
  public canUpdateChannel() {
    let userConfig = this.getUserConfig();

    if (userConfig.updates == undefined || userConfig.updates.channel == undefined) {
      return true;
    }

    return false;
  }

  // verify if the Tray app can control the automatic updates settings (default: true)
  //
  // config example:
  // ```
  // [updates]
  // enable = false
  // ```
  public canControlUpdates() {
    let userConfig = this.getUserConfig();

    if (userConfig.updates == undefined || userConfig.updates.enable == undefined) {
      return true;
    }

    return false;
  }

  // detect wheater or not the Tray should update a feature flag, that is, if the user
  // has already configured a feature inside the config.toml, the Tray shouldn't being
  // able to modify it
  public canUpdateFeature(feat: string): boolean {
    let userConfig = this.getUserConfig();

    if (userConfig.features == undefined || userConfig.features[feat] == undefined) {
      return true;
    }

    return false;
  }

  // checks if telemetry is configured inside the config.toml, if so, they
  // Tray App can't update it
  //
  // config example:
  // ```
  // [telemetry]
  // enable=true
  // ```
  public canUpdateTelemetry() {
    let userConfig = this.getUserConfig();

    if (userConfig.telemetry == undefined || userConfig.telemetry.enable == undefined) {
      return true;
    }

    return false;
  }

  // checks if telemetry is enabled or disabled, default: desabled
  public isTelemetryEnabled() {
    let userConfig = this.getUserConfig();

    if (userConfig.telemetry == undefined || userConfig.telemetry.enable == undefined) {
      let appConfig = this.getAppConfig();
      if (appConfig.telemetry == undefined || appConfig.telemetry.enable == undefined) {
        return true;
      }
      return appConfig.telemetry.enable;
    }

    return userConfig.telemetry.enable;
  }


  // saves the state of a single feature flag inside the application config
  public setFeatureFlag(feat: string, value: boolean) {
    let appConfig = this.getAppConfig();

    if (appConfig.features == undefined) {
      appConfig.features = new Map<string, boolean>();
    }

    if (value) {
      appConfig.features[feat] = true;
    } else {
      appConfig.features[feat] = null;
    }

    this.saveAppConfig(appConfig);
  }

  // enables or disables telemetry
  public setTelemetryEnable(state: boolean) {
    let appConfig = this.getAppConfig();

    if (appConfig.telemetry == undefined) {
      appConfig.telemetry = { 'enable': state };
    } else {
      appConfig.telemetry.enable = state;
    }

    this.saveAppConfig(appConfig);
  }

  // enables or disables automatic updates
  public setUpdatesEnable(state: boolean) {
    let appConfig = this.getAppConfig();

    if (appConfig.updates == undefined) {
      appConfig.updates = { 'enable': state };
    } else {
      appConfig.updates.enable = state;
    }

    this.saveAppConfig(appConfig);
  }

  // configures the channel to look for updates
  public setUpdateChannel(channel: string) {
    let appConfig = this.getAppConfig();

    if (appConfig.updates == undefined) {
      appConfig.updates = { 'channel': channel };
    } else {
      appConfig.updates.channel = channel;
    }

    this.saveAppConfig(appConfig);
  }
}

// This will make this class a singleton so that the only way we can use it
// is by importing the frozen instance of the AppConfig class
const instance = new AppConfig();
Object.freeze(instance);
export default instance;
