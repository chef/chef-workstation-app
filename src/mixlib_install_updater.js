const events = require('events');
const isVersionGreaterThan = require('semver').gt;
const request = require('request');
const util = require('util'); // formatting
const workstation = require('./chef_workstation.js');
const OMNITRUCK_URL = "https://omnitruck.chef.io/%s/chef-workstation/metadata/?p=%s&pv=%s&v=%s&m=%s&prerelease=false&nightlies=false";
let _platformInfo = null;

function MixlibInstallUpdater() {
  events.EventEmitter.call(this);
}

function checkForUpdates(currentVersion) {
  this.emit('start-update-check');
  let _channel = workstation.getUpdateChannel();
  if (_platformInfo == null) {
    _platformInfo = workstation.getPlatformInfo();

    if (_platformInfo == null || currentVersion == "development") {
      this.emit('update-not-available');
      this.emit('end-update-check');
      return;
    }
  }

  let url = util.format(OMNITRUCK_URL, _channel, _platformInfo.platform, _platformInfo.platform_version
    , "latest", _platformInfo.kernel_machine);
  request(url, { json: true }, (err, res, body) => {
    if (err)  {
      this.emit('error', err) ;
      this.emit('end-update-check');
      return;
    }
    // because you can get bad response codes without seeing 'err' populated:
    if (res.statusCode != 200) {
      if (res.statusCode == 404) {
        this.emit('error', "Could not find Chef Workstation information for the current platform '" + _platformInfo.platform + "' on chef.io")
      } else {
        this.emit('error', body || "Error looking up product information: " + res.statusCode)
      }
      this.emit('end-update-check');
      return;
    }

    if (isVersionGreaterThan(body.version, currentVersion)) {
      this.emit('update-available', body);
    } else {
      this.emit('update-not-available');
    }
    this.emit('end-update-check');
  });
}

// MixlibInstallUpdater is an EventEmitter.
MixlibInstallUpdater.prototype.__proto__ = events.EventEmitter.prototype;

// Expose Public MixlibInstallUpdater instance funcitons.
MixlibInstallUpdater.prototype.checkForUpdates = checkForUpdates;

// MixlibInstallUpdater Singleton
let _mixlibInstallUpdater = null;

// Define a property so we can access the singlton.
Object.defineProperty(exports, "mixlibInstallUpdater", {
  enumerable: true,
  get: () => {
    if (_mixlibInstallUpdater == null) {
      _mixlibInstallUpdater = new MixlibInstallUpdater();
    }
    return _mixlibInstallUpdater;
  }
})
