'use strict';
/*
* WSTray module handles toggling the state/image of our tray icon.
*/
const { app, Tray, systemPreferences } = require('electron');
const path = require('path');
const is = require('electron-is');
const workstation = require('./helpers/chef_workstation.js')
const util = require('util');

// private
// On mac ending the filename in 'Template' tells the os the image is only B+W,
// this means the os will handle toggling the color for darkMode. Since we need
// to show notifications we have to handle the toggle of the notification images
// ourselves.
const macIcon = path.join(__dirname, '../assets/images/iconLightTemplate.png');
const macIconLightNotify = path.join(__dirname, '../assets/images/iconLightNotify.png');
const macIconDarkNotify = path.join(__dirname, '../assets/images/iconDarkNotify.png');
// On Windows we need larger images so they display correctly. We only need light
// images on windows since the task bar is dark.
const winIcon = path.join(__dirname, '../assets/images/iconLightTemplate@3x.png');
const winIconNotify = path.join(__dirname, '../assets/images/iconLightNotify@3x.png');

// Default icon
var icon = is.macOS() ? macIcon : winIcon;

// Electron Tray
var tray = null;
var isNotifying;

// TODO should these be globals?
var updateAvailable = false;
var version = "[unknown]";

function WSTray() {
    tray = new Tray(icon);
    if (is.macOS()) {
      app.dock.hide()
    }
    isNotifying = false;
    setToolTip();
    setVersion(workstation.getVersion());
}

function setNotifyIcon() {
    if (is.macOS()) {
        if (systemPreferences.isDarkMode()) {
            tray.setImage(macIconLightNotify);
        } else {
            tray.setImage(macIconDarkNotify);
        }
    } else {
        tray.setImage(winIconNotify);
    }
}

function displayNotification(notify) {
    isNotifying = notify;
    if (isNotifying) {
        setNotifyIcon();
    } else {
        // restore default icon.
        tray.setImage(icon);
    }
}

function setContextMenu(contextMenu) {
    tray.setContextMenu(contextMenu);
};

function setUpdateAvailable(u) {
    updateAvailable = u;
    displayNotification(updateAvailable);
    setToolTip();
}

function setVersion(v) {
    version = v;
    setToolTip();
}

function setToolTip() {
    var toolTip = util.format("Chef Workstation %s\n", version);
    tray.setToolTip(updateAvailable ? toolTip + "Update Available" : toolTip + "Up to date");
};

function subscribeThemeChangeMacOS() {
  tray.subscribeNotification(
    'AppleInterfaceThemeChangedNotification',
    displayNotification(isNotifying)
  );
};

// Expose Public WSTray instance funcitons.
WSTray.prototype.displayNotification = displayNotification;
WSTray.prototype.setContextMenu = setContextMenu;
WSTray.prototype.setUpdateAvailable = setUpdateAvailable;

// WSTray Singleton
var wsTray = null;

// Public WSTray module functions. Think of this as a static function.
var self = module.exports = {
    instance: function instance() {
        if (wsTray == null) {
            wsTray = new WSTray();
        }
        return wsTray;
    }
}

// Not sure about this pattern but it makes sure we have an instance
// as soon as the app starts.
app.on('ready', () => {
  self.instance();

  // Not sure about this pattern... Maybe this should live in main?
  // Subscribe to changes to dark mode setting so we can update the icon.
  subscribeThemeChangeMacOS;
});
