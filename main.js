'use strict';

const { app, BrowserWindow, Menu, dialog } = require('electron');
const WSTray = require('./src/ws_tray.js');
const aboutDialog = require('./src/about.js');
const helpers = require('./src/helpers.js');
const { mixlibInstallUpdater } = require('./src/mixlib_install_updater.js');
const workstation = require('./src/chef_workstation.js');
const util = require('util'); // debug inspection

// appLock will be true if this is the first instance.
let appLock = !app.makeSingleInstance(function (argv, cwd) {});

// If we don't get the lock return.
if (!appLock) {
  console.log('Chef Workstation is already running.');
  app.quit();
  return;
}

// Enable live code reload.
try {
  require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
  });
} catch(err) {}

// If we're in dev mode we want to show all BrowserWindows with the detached dev tools
let is_debug = process.env.DEBUG != undefined
require('electron-debug')({enabled: is_debug});

let tray = null;
let trayMenu = null;
let requestFromMenu = false;

// Background window is hidden and will be used to run service processes. It is
// here now so it is the first/main window of the app meaning the about pop up
// won't close the app when closed.
let backgroundWindow = null;
let pendingVersionUpdate = null;

function createMenu() {
  // The clicks here take a function so that additional parameters such as
  // a pointer to the menu item can be passed.
  let template = [
    {
      id: 'updateCheck',
      label: pendingVersionUpdate ? ('Download Workstation v' + pendingVersionUpdate)  : 'Check for updates...',
      click: () => { requestFromMenu = true;  app.emit('do-update-check') }
    },
    {type: 'separator'},
    {
      label: 'About ' + helpers.getDisplayName(),
      click: aboutDialog.open
    },
    {
      label: 'Quit',
      click: quitApp
    }
  ];

  // Add shortcut on mac
  if (process.platform === "darwin") {
    var quit = template[template.length - 1];
    quit.accelerator = "Command+Q";
  }

  return Menu.buildFromTemplate(template);
}

function createTray() {
  tray = WSTray.instance();
  // I think the Tray class should be doing all this stuff
  trayMenu = createMenu();
  tray.setContextMenu(trayMenu);
}

function startApp() {
  const modalPath = `file://${__dirname}/process.html`
  backgroundWindow = new BrowserWindow({ show: false });
  backgroundWindow.loadURL(modalPath)
  createTray();
  // Defer intiial update check until app is fully rendered
  app.emit('do-update-check');
}

function quitApp() {
  backgroundWindow = null;
  app.quit();
}

mixlibInstallUpdater.on('start-update-check', () => {
  // disable the menu to prevent concurrent checks
  trayMenu.getMenuItemById('updateCheck').enabled  = false;
});

mixlibInstallUpdater.on('update-not-available', () => {
  // If they picked the menu option, show a notification dialog.
  if (requestFromMenu) {
    const noUpdateDialog = require('./src/no_update_dialog.js');
    noUpdateDialog.open();
  }
  WSTray.instance().displayNotification(false);
});

mixlibInstallUpdater.on('update-available', (updateInfo) => {
  // Only display the notification. Changing the menu text is a lot of work
  // and will be done in the next re-factor.
  WSTray.instance().setUpdateAvailable(true);
  if (requestFromMenu)  {
    // If they picked the menu option, show a notification dialog.
    // don't set the tray notification state, because they're viewing that
    // notification now.
    const updateAvailableDialog = require('./src/update_available_dialog.js');
    updateAvailableDialog.open(updateInfo, workstation.getVersionDirect());
  } else {
    WSTray.instance().displayNotification(true);
  }
});

mixlibInstallUpdater.on('error', (error) => {
  if (requestFromMenu) {
    // TODO probably don't show the error except to say try again later, UNLESS
    // we can identify a user-correctable problem (proxy,. etc)
    dialog.showErrorBox('Error', error == null ? "unknown" : error.toString());
  }
});

// reset state of update-related activities when update check is complete
mixlibInstallUpdater.on('end-update-check', () => {
  requestFromMenu = false;
  trayMenu.getMenuItemById('updateCheck').enabled  = true;
});


app.on('do-update-check', () => {
  mixlibInstallUpdater.checkForUpdates(workstation.getVersionDirect());
});

app.on('ready', () => {
  startApp()
});
