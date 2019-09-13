import path = require('path');
import os = require('os');
import fs = require('fs');
import TOML = require('@iarna/toml');

interface Config {
  updates?: {
    channel?: string;
    enable?: boolean;
    interval_minutes?: number;
  };
};

class AppConfig {
  private workstationDir = path.join(os.homedir(), '.chef-workstation');
  private userConfigFile = path.join(this.workstationDir, 'config.toml');
  private appConfigFile = path.join(this.workstationDir, '.app-managed-config.toml');

  constructor() {}

  public getUserConfig(): Config {
    try {
      // @afiune Check for the file before reading it
      return TOML.parse(fs.readFileSync(this.userConfigFile, "utf8"));
    } catch(error) {
      // TODO @afiune Error handling in Electron: Open an error window?
      return {};
    }
  }

  public getAppConfig(): Config {
    try {
      return TOML.parse(fs.readFileSync(this.appConfigFile, "utf8")) as Config;
    } catch(error) {
      return {};
    }
  }

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

  public areUpdatesEnabled() {
    let userConfig = this.getUserConfig();
    if (userConfig.updates == undefined || userConfig.updates.enable == undefined) {
      return true
    }
    return userConfig.updates.enable;
  }

  public getUpdateIntervalMinutes() {
    let userConfig = this.getUserConfig();
    if (userConfig.updates == undefined || userConfig.updates.interval_minutes == undefined) {
      return 60*8; // Every 8 hours.
    }
    return userConfig.updates.interval_minutes;
  }

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

  public canUpdateChannel() {
    let userConfig = this.getUserConfig();

    if (userConfig.updates == undefined || userConfig.updates.channel == undefined) {
      return true;
    }

    return false;
  }

  public setUpdateChannel(channel) {
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
