'use strict';

const { app, BrowserWindow, Menu } = require('electron');
const WSTray = require('./src/ws_tray.js');
const aboutDialog = require('./src/about.js');
const updater = require('./src/updater.js');
const helpers = require('./src/helpers.js');

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

let tray = null;
let trayMenu = null;

// Background window is hidden and will be used to run service processes. It is
// here now so it is the first/main window of the app meaning the about pop up
// won't close the app when closed.
let backgroundWindow = null;

function createMenu() {
  // The clicks here take a function so that additional parameters such as
  // a pointer to the menu item can be passed.
  let template = [
    {
      label: 'Check for updates...',
      click: updater.checkForUpdates
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
  // Get the menuItem so that the updater can toggle it's state. There's probably
  // a way to encsulate this better.
  backgroundWindow.once('ready-to-show', () => {
    updater.checkForUpdates(trayMenu.items[0]);
  })
}

function quitApp() {
  backgroundWindow = null;
  app.quit();
}

app.on('ready', () => { startApp() });
