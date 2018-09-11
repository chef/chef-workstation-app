'use strict';
/*
 * Module to interact with the installed version of Chef Workstation (of which this app is a component)
 */

const is = require('electron-is');

function getVersion(callback) {
  if (is.windows()) {
    const shell = require('node-powershell');

    let ps = new shell({
      executionPolicy: 'Bypass',
      noProfile: true
    });

    ps.addCommand('reg query \'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\' /f \'Chef Workstation\' /s');
    ps.invoke()
    .then(output => {
      var match_info = /Chef Workstation v([^\s]+)/g.exec(output);
      if (match_info == null) callback("unknown");
      // TODO what if the query returns info from multiple installed versions?
      // TODO what if the regex match starts failing? (we change the name, for example)
      callback(match_info[1]);
    })
    .catch(err => {
      callback("unknown");
    });
  } else {
    try {
      const manifest = require('/opt/chef-workstation/version-manifest.json');
      callback(manifest.build_version);
    } catch (e) {
      callback("unknown");
    }
  };
};

module.exports.getVersion = getVersion;
