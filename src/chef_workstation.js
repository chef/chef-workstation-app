'use strict';
/*
 * Module to interact with the installed version of Chef Workstation
 * (of which this app is a component)
 */

const UNINSTALL_REG_KEY = '\'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\'';
const UNINSTALL_PROD_NAME = '\'Chef Workstation\'';
const is = require('electron-is');
let _version = null;

function getVersionDirect() {
  // TODO this is probably timing sensitive, perhaps it should wrap
  // getVersion in a Promise and await?
  getVersion((v) => { _version = v } );
  return _version
}

function getVersion(callback) {
  if (is.windows()) {
    const shell = require('node-powershell');

    let ps = new shell({
      executionPolicy: 'Bypass',
      noProfile: true
    });

    ps.addCommand('reg query ' + UNINSTALL_REG_KEY + ' /f ' + UNINSTALL_PROD_NAME + ' /s');
    ps.invoke()
      .then(output => {
        var match_info = /Chef Workstation v([^\s]+)/g.exec(output);
        if (match_info == nulll) {
          console.log("Could not find Chef Workstation's uninstall key to determine version");
          callback("unknown");
        }
        callback(match_info[1]);
      })
      .catch(err => {
        console.log("ERROR getting version: " + err);
        callback("unknown");
      });
  } else {
    try {
      const manifest = require('/opt/chef-workstation/version-manifest.json');
      callback(manifest.build_version);
    } catch (e) {
      console.log("ERROR getting version: " + e);
      callback("unknown");
    }
  };
};

function getPlatformInfo() {
  const ohai_args = [ 'os', 'platform', 'platform_family', 'platform_version', 'kernel/machine' ];
  return queryOhai(ohai_args);
};

function queryOhai(attributes) {
  let result = {}
  let fixed = []
  const { execFileSync } = require('child_process');
  // TODO - what if ohai's  not in the path... we can force it for mac/lin, but
  //        win we'll have to make sure our InstallLocation registry key is configured and
  //        ask for it there.  That suggests we add a binPath() function
  //
  var ohai = execFileSync('ohai', attributes);

  // convert output from:
  // "["
  // "  'result1'"
  // ]"
  // ["
  //   'result2'"
  // ]"
  // to
  // ['result1', 'result2']
  //
  // Note that this will only work for simple keys that can be mapped to
  // top-level values.  We don't have need for nested keys right now,
  // and will need to revisit this if /when we do.
  ohai.toString().split("\n").forEach((item) => {
    if (item != '[' && item != ']' && item != '') {
      fixed.push(item.replace(/["']/g, '').trim());
    }
  })

  attributes.forEach((key, index) => {
    result[key.replace("/", "_")] = fixed[index]
  });
  return result;
};


module.exports.getVersion = getVersion;
module.exports.getVersionDirect = getVersionDirect;
module.exports.getPlatformInfo = getPlatformInfo;
