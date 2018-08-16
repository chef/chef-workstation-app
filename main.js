'use strict';

const {app, BrowserWindow, Menu, Tray} = require('electron');
const path = require('path');
const aboutWindow = require('./src/about.js');

// Enable live code reload.
try {
  require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
  });
} catch(err) {}

let trayApp = null;
let trayMenu = null;

// Background window is hidden and will be used to run service processes. It is
// here now so it is the first/main window of the app meaning the about pop up
// won't close the app when closed.
let backgroundWindow = null;

function createMenu() {
  let template = [
    {
      label: 'About ' + require('./package.json').productName,
      click: () => { aboutWindow.open() }
    },
    {
      label: 'Quit',
      click: () => { quitApp() }
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
  const trayIcon = path.join(__dirname, 'assets/images/icon.png');
  trayApp = new Tray(trayIcon);
  trayMenu = createMenu();
  trayApp.setContextMenu(trayMenu);
}

function startApp() {
  backgroundWindow = new BrowserWindow({ show: false });
  createTray();
}

function quitApp() {
  backgroundWindow = null;
  app.quit();
}

app.dock.hide();
app.on('ready', () => { startApp() });
