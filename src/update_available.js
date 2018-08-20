const { remote, shell }  = require('electron');
const updateInfo = remote.getCurrentWindow().updateInfo;

function init() {
  const downloadBtn = document.getElementById('downloadBtn');
  const closeBtn = document.getElementById('closeBtn');
  closeBtn.addEventListener('click', function (event) {
    var window = remote.getCurrentWindow();
    window.close();
  })

  downloadBtn.addEventListener('click', function (event) {
    // TODO: there has to be a better way.
    // https://github.com/chef/chef-workstation-tray/releases/download/v0.0.2/chef-workstation-0.0.2.dmg
    var dl_url = 'https://github.com/chef/chef-workstation-tray/releases/download/'
    dl_url = dl_url.concat('v', updateInfo.version, '/', updateInfo.files[0].url);
    shell.openExternal(dl_url);
    var window = remote.getCurrentWindow();
    window.close();
  })
}

window.addEventListener("load", init, false);
