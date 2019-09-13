import { app, BrowserWindow, dialog, ipcMain, Menu, shell, MenuItemConstructorOptions } from 'electron';
import { OmnitruckUpdateChecker } from './omnitruck-update-checker';
import AppConfigSingleton from './app-config';

import aboutDialog = require('./about_dialog.js');
import helpers = require('./helpers.js');
import WSTray = require('./ws_tray.js');
import workstation = require('./chef_workstation.js');

export class Main {
  // Background window is hidden and will be used to run service processes. It is
  // here now so it is the first/main window of the app meaning the about pop up
  // won't close the app when closed.
  private backgroundWindow: BrowserWindow;
  private displayUpdateNotAvailableDialog: boolean;
  private pendingUpdate;
  private requestFromUser: boolean;
  private tray;
  private trayMenu: Menu;
  private updateCheckInterval;
  private appConfig = AppConfigSingleton;
  private omnitruckUpdateChecker: OmnitruckUpdateChecker;

  constructor() {
    this.omnitruckUpdateChecker = new OmnitruckUpdateChecker();
  }

  private createMenu() {
    let template: MenuItemConstructorOptions[] = [
      {
        id: 'updateCheck',
        label: this.pendingUpdate ? 'Download Update' : 'Check For Updates...',
        enabled: this.appConfig.areUpdatesEnabled(),
        click: () => { this.pendingUpdate ? this.downloadUpdate() : this.triggerUpdateCheck(true) }
      },
      {type: 'separator'},
      {
        label: 'About ' + helpers.getDisplayName(),
        click: () => { aboutDialog.open() }
      },
      {
        label: 'Quit',
        click: () => { this.quitApp() }
      }
    ];

    // Add shortcut on mac
    if (process.platform === "darwin") {
      var quit = template[template.length - 1];
      quit['accelerator'] = "Command+Q";
    }

    return Menu.buildFromTemplate(template);
  }

  private createTray() {
    this.tray = WSTray.instance();
    // I think the Tray class should be doing all this stuff
    this.trayMenu = this.createMenu();
    this.tray.setContextMenu(this.trayMenu);
  }

  private setupUpdateInterval() {
    let updateCheckIntervalMinutes = this.appConfig.getUpdateIntervalMinutes();
    this.updateCheckInterval = setInterval(this.triggerUpdateCheck, updateCheckIntervalMinutes*60*1000);
  }

  private clearUpdateInterval() {
    clearInterval(this.updateCheckInterval);
    this.updateCheckInterval = null;
  }

  private triggerUpdateCheck(requestFromUser=false, displayUpdateNotAvailableDialog=true) {
    this.requestFromUser = requestFromUser;
    this.displayUpdateNotAvailableDialog = displayUpdateNotAvailableDialog;
    this.omnitruckUpdateChecker.checkForUpdates(workstation.getVersion(), this.appConfig.getUpdateChannel());
  }

  private downloadUpdate() {
    let result = shell.openExternalSync(this.pendingUpdate.url);
    console.log("Attempted to open URL: " + this.pendingUpdate.url + ". Result: " + result);
  }

  private startApp() {
    const modalPath = `file://${__dirname}/process.html`
    this.backgroundWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        // https://electronjs.org/docs/tutorial/security#2-do-not-enable-nodejs-integration-for-remote-content
        // Electron does not recommend enabling this since it exposes sites to XSS attacks. Since we are
        // only distributing an app that is already running on someone's system we can get away with it but
        // we should switch to the 'preload' pattern documented in that tutorial.
        nodeIntegration: true
      }
    });
    this.backgroundWindow.loadURL(modalPath)
    this.createTray();
    // Do first check and setup update checks.
    if (this.appConfig.areUpdatesEnabled()) {
      this.triggerUpdateCheck();
      this.setupUpdateInterval();
    }
  }

  private quitApp() {
    this.clearUpdateInterval();
    this.backgroundWindow = null;
    app.quit();
  }

  run() {
    if(!app.requestSingleInstanceLock()) {
      console.log('Chef Workstation is already running.');
      app.quit();
      return;
    }
    app.on('ready', () => { this.startApp() });

    ipcMain.on('do-update-check', () => { this.triggerUpdateCheck() });
    ipcMain.on('do-download', () => { this.downloadUpdate() });

    this.omnitruckUpdateChecker.on('start-update-check', () => {
      // disable the menu to prevent concurrent checks
      this.trayMenu.getMenuItemById('updateCheck').enabled  = false;
      this.tray.setContextMenu(this.trayMenu);
    });

    this.omnitruckUpdateChecker.on('update-not-available', () => {
      this.pendingUpdate = null;
      this.tray.setUpdateAvailable(false);
      // If they picked the menu option, show a notification dialog.
      if (this.requestFromUser && this.displayUpdateNotAvailableDialog) {
        const noUpdateDialog = require('./no_update_dialog.js');
        noUpdateDialog.open();
      }
    });

    this.omnitruckUpdateChecker.on('update-available', (updateInfo) => {
      this.pendingUpdate = updateInfo;
      this.tray.setUpdateAvailable(true);
      this.trayMenu = this.createMenu();
      this.tray.setContextMenu(this.trayMenu);

      if (this.requestFromUser)  {
        // If they picked the menu option, show a notification dialog.
        // don't set the tray notification state, because they're viewing that
        // notification now.
        const updateAvailableDialog = require('./update_available_dialog.js');
        updateAvailableDialog.open(updateInfo);
      }
    });

    this.omnitruckUpdateChecker.on('error', (error) => {
      if (this.requestFromUser) {
        // TODO probably don't show the error except to say try again later, UNLESS
        // we can identify a user-correctable problem (proxy,. etc)
        dialog.showErrorBox('Error', error == null ? "unknown" : error.toString());
      }
    });

    // reset state of update-related activities when update check is complete
    this.omnitruckUpdateChecker.on('end-update-check', () => {
      this.requestFromUser = false;
      this.displayUpdateNotAvailableDialog = true;
      this.trayMenu = this.createMenu();
      this.trayMenu.getMenuItemById('updateCheck').enabled  = true;
      this.tray.setContextMenu(this.trayMenu);
    });
  }
}
