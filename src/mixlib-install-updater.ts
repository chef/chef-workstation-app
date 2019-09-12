import * as EventEmitter from 'events';

const isVersionGreaterThan = require('semver').gt;
const request = require('request');
const util = require('util'); // formatting
const workstation = require('./chef_workstation.js');

export class MixlibInstallUpdater {
  public emitter: EventEmitter;

  private platformInfo = null;

  readonly OMNITRUCK_URL = "https://omnitruck.chef.io/%s/chef-workstation/metadata/?p=%s&pv=%s&v=%s&m=%s&prerelease=false&nightlies=false";

  constructor() {
    this.emitter = new EventEmitter();
    this.platformInfo = workstation.getPlatformInfo();
  }

  public checkForUpdates(currentVersion) {
    this.emitter.emit('start-update-check');
    let _channel = workstation.getUpdateChannel();
    console.log(workstation.getUpdateChannel());

    if (this.platformInfo == null) {
      // To actually check for an update while developing, turn off development mode
      this.emitter.emit('update-not-available');
      this.emitter.emit('end-update-check');
      return;
    }

    let url = util.format(this.OMNITRUCK_URL,
      _channel,
      this.platformInfo.platform,
      this.platformInfo.platform_version,
      "latest",
      this.platformInfo.kernel_machine);
    console.log(url);
    request(url, { json: true }, (err, res, body) => {
      if (err)  {
        this.emitter.emit('error', err) ;
        this.emitter.emit('end-update-check');
        return;
      }
      console.log(body);
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

      if (isVersionGreaterThan(body.version, currentVersion)) {
        this.emitter.emit('update-available', body);
      } else {
        this.emitter.emit('update-not-available');
      }
      this.emitter.emit('end-update-check');
    });
  }

}
