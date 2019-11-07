const { BrowserWindow, BrowserView } = require('electron');
const path = require('path');

let preferencesDialog = null;

function thing() {
    browserWindow = new BrowserWindow({ width: 1200, height: 600 });
    let browserView1 = new BrowserView({ webPreferences: { nodeIntegration: false }});
    let browserView2 = new BrowserView({ webPreferences: { nodeIntegration: false }});
    browserWindow.addBrowserView(browserView1);
    browserWindow.addBrowserView(browserView2);
    browserView1.setBounds({ x: 0, y: 0, width: 600, height: 600 });
    browserView2.setBounds({ x: 600, y: 0, width: 600, height: 600 });
    browserView1.webContents.loadURL('https://chef-server-acceptance.chef.co');
    browserView2.webContents.loadURL('https://www.google.com');
    browserWindow.on('closed', function () { browserWindow = null; });
}

function open() {
  if (preferencesDialog == null) {
    const preferencesPath = path.join('file://', __dirname, 'preferences.html');
    preferencesDialog = new BrowserWindow({
      titleBarStyle: 'customButtonsOnHover',
      show: false,
      alwaysOnTop: true,
      width: 500,
      height: 380,
      resizable: false,
      minimizable: true,
      maximizable: false,
      webPreferences: {
        nodeIntegration: true
      }
    });
    preferencesDialog.loadURL(preferencesPath);
    preferencesDialog.once('ready-to-show', () => {
      preferencesDialog.show();
    });
    preferencesDialog.on('closed', () => {
      preferencesDialog = null;
    });
  } else {
    preferencesDialog.show();
  }
}

module.exports.open = open;


