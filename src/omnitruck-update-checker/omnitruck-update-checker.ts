import * as EventEmitter from 'events';

import semver = require('semver');
import request = require('request');
import util = require('util'); // formatting
import workstation = require('../helpers/chef_workstation.js');

export class OmnitruckUpdateChecker {
  private emitter: EventEmitter;

  private platformInfo = null;

  readonly OMNITRUCK_URL = "https://omnitruck.chef.io/%s/chef-workstation/metadata/?p=%s&pv=%s&v=%s&m=%s&prerelease=false&nightlies=false";

  constructor() {
    this.emitter = new EventEmitter();
    this.platformInfo = workstation.getPlatformInfo();
  }

  public on(eventName: string, listener: (...args: any[]) => void): EventEmitter {
   return this.emitter.on(eventName, listener);
  }

  public checkForUpdates(currentVersion: string, updateChannel: string) {
    this.emitter.emit('start-update-check');

    if (this.platformInfo == null) {
      // To actually check for an update while developing, turn off development mode
      this.emitter.emit('update-not-available');
      this.emitter.emit('end-update-check');
      return;
    }

    let url = util.format(this.OMNITRUCK_URL,
      updateChannel,
      this.platformInfo.platform,
      this.platformInfo.platform_version,
      "latest",
      this.platformInfo.kernel_machine);

    let options = {
      url: url,
      headers: {
        'User-Agent': 'chef-workstation-app / ' + currentVersion
      },
      json: true
    };

    request(options, (err, res, body) => {
      if (err)  {
        this.emitter.emit('error', err) ;
        this.emitter.emit('end-update-check');
        return;
      }

      // because you can get bad response codes without seeing 'err' populated:
      if (res.statusCode != 200) {
        if (res.statusCode == 404) {
          this.emitter.emit('error', "Could not find Chef Workstation information for the current platform '" + this.platformInfo.platform + "' on chef.io")
        } else {
          this.emitter.emit('error', body || "Error looking up product information: " + res.statusCode)
        }
        this.emitter.emit('end-update-check');
        return;
      }

      if (semver.gt(body.version, currentVersion)) {
        this.emitter.emit('update-available', body);
      } else {
        this.emitter.emit('update-not-available');
      }
      this.emitter.emit('end-update-check');
    });
  }

}
