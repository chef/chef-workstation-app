import { app, BrowserWindow, dialog, ipcMain, Menu, shell, MenuItemConstructorOptions } from 'electron';

const aboutDialog = require('./about_dialog.js');
const helpers = require('./helpers.js');
const { mixlibInstallUpdater } = require('./mixlib_install_updater.js');
const WSTray = require('./ws_tray.js');
const workstation = require('./chef_workstation.js');

export default class Main {
  // Background window is hidden and will be used to run service processes. It is
  // here now so it is the first/main window of the app meaning the about pop up
  // won't close the app when closed.
  private backgroundWindow: BrowserWindow;
  private serviceWindow: BrowserWindow;
  private displayUpdateNotAvailableDialog: boolean;
  private pendingUpdate;
  private requestFromUser: boolean;
  private tray;
  private trayMenu: Menu;
  private updateCheckInterval;

  private createMenu() {
    let template: MenuItemConstructorOptions[] = [
      {
        id: 'updateCheck',
        label: this.pendingUpdate ? 'Download Update' : 'Check For Updates...',
        enabled: workstation.areUpdatesEnabled(),
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
    let updateCheckIntervalMinutes = workstation.getUpdateIntervalMinutes();
    this.updateCheckInterval = setInterval(this.triggerUpdateCheck, updateCheckIntervalMinutes*60*1000);
  }

  private clearUpdateInterval() {
    clearInterval(this.updateCheckInterval);
    this.updateCheckInterval = null;
  }

  private triggerUpdateCheck(requestFromUser=false, displayUpdateNotAvailableDialog=true) {
    this.requestFromUser = requestFromUser;
    this.displayUpdateNotAvailableDialog = displayUpdateNotAvailableDialog;
    mixlibInstallUpdater.checkForUpdates(workstation.getVersion());
  }

  private downloadUpdate() {
    let result = shell.openExternal(this.pendingUpdate.url);
    console.log("Attempted to open URL: " + this.pendingUpdate.url + ". Result: " + result);
  }

  private startService() { 
    const modalPath = `file://${__dirname}/service.html`
    this.serviceWindow= new BrowserWindow({ show: false });
    console.log("Opening service window" );
    this.serviceWindow.loadURL(modalPath)
  }
  private startApp() {
    const modalPath = `file://${__dirname}/process.html`
    this.backgroundWindow = new BrowserWindow({ show: false });
    this.backgroundWindow.loadURL(modalPath)
    this.createTray();
    // Do first check and setup update checks.
    if (workstation.areUpdatesEnabled()) {
      this.triggerUpdateCheck();
      this.setupUpdateInterval();
    }
  }

  private quitApp() {
    this.clearUpdateInterval();
    this.serviceWindow = null;
    this.backgroundWindow = null;
    app.quit();
  }

  run() {
    if (app.makeSingleInstance(function (_argv, _cwd) {})) {
      console.log('Chef Workstation is already running.');
      app.quit();
      return;
    }
    app.on('ready', () => { this.startApp(); this.startService() });

    ipcMain.on('do-update-check', () => { this.triggerUpdateCheck });
    ipcMain.on('do-download', () => { this.downloadUpdate });

    mixlibInstallUpdater.on('start-update-check', () => {
      // disable the menu to prevent concurrent checks
      this.trayMenu.getMenuItemById('updateCheck').enabled  = false;
      this.tray.setContextMenu(this.trayMenu);
    });

    mixlibInstallUpdater.on('update-not-available', () => {
      this.tray.setUpdateAvailable(false);
      // If they picked the menu option, show a notification dialog.
      if (this.requestFromUser && this.displayUpdateNotAvailableDialog) {
        const noUpdateDialog = require('./no_update_dialog.js');
        noUpdateDialog.open();
      }
    });

    mixlibInstallUpdater.on('update-available', (updateInfo) => {
      this.pendingUpdate = updateInfo;
      this.tray.setUpdateAvailable(true);
      this.trayMenu = this.createMenu();
      this.tray.setContextMenu(this.trayMenu);

      if (this.requestFromUser)  {
        // If they picked the menu option, show a notification dialog.
        // don't set the tray notification state, because they're viewing that
        // notification now.
        const updateAvailableDialog = require('./update_available_dialog.js');
        updateAvailableDialog.open();
      }
    });

    mixlibInstallUpdater.on('error', (error) => {
      if (this.requestFromUser) {
        // TODO probably don't show the error except to say try again later, UNLESS
        // we can identify a user-correctable problem (proxy,. etc)
        dialog.showErrorBox('Error', error == null ? "unknown" : error.toString());
      }
    });

    // reset state of update-related activities when update check is complete
    mixlibInstallUpdater.on('end-update-check', () => {
      this.requestFromUser = false;
      this.displayUpdateNotAvailableDialog = true;
      this.trayMenu = this.createMenu();
      this.trayMenu.getMenuItemById('updateCheck').enabled  = true;
      this.tray.setContextMenu(this.trayMenu);
    });
  }
}
