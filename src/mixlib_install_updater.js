const events = require('events');
const request = require('request');
const util = require('util'); // formatting

function MixlibInstallUpdater() {
  events.EventEmitter.call(this);
}

function checkForUpdates(currentVersion) {
  this.emit('start-update-check');
  let base_url = "https://omnitruck.chef.io/%s/chef-workstation/metadata/?p=%s&pv=%s&v=%s&m=%s&prerelease=false&nightlies=false";
  let url = util.format(base_url, "stable", "ubuntu", "16.04", "latest", "x86_64");
  request(url, { json: true }, (err, res, body) => {
    if (err )  {
      this.emit('update-check-error', error) ;
      return;
    }
    // because you can get bad response codes without seeing 'err' populated.
    if (res.statusCode != 200) {
      this.emit('update-check-error', body) ;
      return;
    }
    if (currentVersion != body.version) {
      this.emit('update-available', body)
    } else {
      this.emit('update-not-available')
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
