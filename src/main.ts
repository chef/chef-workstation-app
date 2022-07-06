import {
  MenuItemConstructorOptions,
  BrowserWindow,
  Menu,
  app,
  dialog,
  ipcMain,
  shell
} from 'electron';
import { OmnitruckUpdateChecker } from './omnitruck-update-checker/omnitruck-update-checker';
import { PreferencesDialog } from './preferences/preferences_dialog';
import AppConfigSingleton from './app-config/app-config';

import aboutDialog = require('./about-dialog/about_dialog.js');
import workstation = require('./helpers/chef_workstation.js');
import helpers = require('./helpers/helpers.js');
import WSTray = require('./ws_tray.js');

// TriggerUpdateSettings is an interface that will enforce the settings
// we pass to the TriggerUpdateCheck function. Since the app is event
// driven, we need to pass parameters as objects.
//
// TODO @afiune Potentially move it to a single types file
export interface TriggerUpdateSettings {
  UserRequest: boolean;
  DisplayUpdateNotAvailableDialog: boolean;
}

export class Main {
  // Background window is hidden and will be used to run service processes. It is
  // here now so it is the first/main window of the app meaning the about pop up
  // won't close the app when closed.
  private backgroundWindow: BrowserWindow;
  private preferencesDialog: PreferencesDialog;
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
        click: () => { this.pendingUpdate ? this.downloadUpdate() : this.triggerUpdateCheck({
          UserRequest: true,
          DisplayUpdateNotAvailableDialog: true
        })}
      },
      {type: 'separator'},
      {
        label: 'Preferences...',
        click: () => { this.openPreferencesDialog() }
      },
      {type: 'separator'},
      {
        label: 'Documentation',
        click: () => { this.openDocs() }
      },
      {
        label: 'Learn Chef',
        click: () => { this.openLearn() }
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

    // Add shortcuts on mac
    if (process.platform === 'darwin') {
      for (var item of template) {
        switch(item.label) {
          case 'Quit':
            item['accelerator'] = 'Command+Q';
            break;
          case 'Preferences...':
            item['accelerator'] = 'Command+,';
            break;
        }
      }
    } else {
      // Remove the preferences dialog for any othe OS that is not macOS
      // @afiune we have to build the preferences for Windows & Linux systems
      //
      // GH: https://github.com/chef/chef-workstation-app/issues/156
      for (var i = template.length-1; i--; ){
        if ( template[i].label === 'Preferences...') template.splice(i, 1);
      }
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
    this.updateCheckInterval = setInterval(
      this.triggerUpdateCheck.bind(this),
      updateCheckIntervalMinutes*60*1000
    );
  }

  private clearUpdateInterval() {
    clearInterval(this.updateCheckInterval);
    this.updateCheckInterval = null;
  }

  public triggerUpdateCheck(settings: TriggerUpdateSettings = {
    UserRequest: false,
    DisplayUpdateNotAvailableDialog: false
  }) {
    this.requestFromUser = settings.UserRequest;
    this.displayUpdateNotAvailableDialog = settings.DisplayUpdateNotAvailableDialog;
    this.omnitruckUpdateChecker.checkForUpdates(workstation.getVersion(), this.appConfig.getUpdateChannel());
  }

  private downloadUpdate() {
    let result = shell.openExternal(this.pendingUpdate.url);
    console.log("Attempted to open URL: " + this.pendingUpdate.url + ". Result: " + result);
  }

  private openDocs() {
    let result = shell.openExternal('https://docs.chef.io/');
    console.log("Attempted to open URL: https://docs.chef.io/. Result: " + result);
  }

  private openLearn() {
    let result = shell.openExternal('https://learn.chef.io/');
    console.log("Attempted to open URL: https://learn.chef.io/. Result: " + result);
  }

  private startApp() {
    const modalPath = `file://${__dirname}/process.html`
    const splash: BrowserWindow = new BrowserWindow({
      width: 300,
      height: 300,
      transparent: true,
    });
    splash.loadURL(`file://${__dirname}/splash.html`);
      setTimeout(function () {
        splash.destroy();
      }, 3000);
    // splash.webContents.openDevTools();
    this.backgroundWindow = new BrowserWindow({
      show: true,
      autoHideMenuBar: true,

      webPreferences: {
        // enableRemoteModule: true,
        // https://electronjs.org/docs/tutorial/security#2-do-not-enable-nodejs-integration-for-remote-content
        // Electron does not recommend enabling this since it exposes sites to XSS attacks. Since we are
        // only distributing an app that is already running on someone's system we can get away with it but
        // we should switch to the 'preload' pattern documented in that tutorial.

        // preload: path.join(__dirname, 'preload.js'), // added @i5pranay93
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    this.backgroundWindow.loadURL(modalPath)
    //to open the dev tools- uncomment the following line
    // this.backgroundWindow.webContents.openDevTools();
    this.createTray();
    // Do first check and setup update checks.
    if (this.appConfig.areUpdatesEnabled()) {
      this.triggerUpdateCheck();
      this.setupUpdateInterval();
    }

    // Make sure we have a ~/.chef directory
    this.createChefDir();
    helpers.createChefReposJson();
  }

  // make the ~/.chef directory if it doesn't exist and add a sample credentials file
  private createChefDir() {
    let os = require('os'),
    fs = require('fs'),
    path = require('path');
    let chefDir = path.join(os.homedir(), '.chef')

    if (!fs.existsSync(chefDir)) {
        console.log("Creating the .chef dir at " + chefDir)
        fs.mkdirSync(chefDir, 0o700);

        let credentialsFile =  path.join(chefDir, 'credentials');
        let pemFile = path.join(chefDir, 'MY_USERNAME.pem');
        let credentialContent = "# This is the Chef Infra credentials file used by the knife CLI and other tools\n" +
                                "# This file supports defining multiple credentials profiles, to allow you to switch between users, orgs, and Chef Infra Servers.\n\n" +
                                "# Example credential file configuration:\n" +
                                "# [default]\n" +
                                "# client_name = 'MY_USERNAME'\n" +
                                "# client_key = '" + pemFile + "'\n" +
                                "# chef_server_url = 'https://api.chef.io/organizations/MY_ORG'\n\n"
        console.log("Creating the credentials file at " + credentialsFile);
        fs.writeFileSync(credentialsFile, credentialContent);
    }
  }

  private openPreferencesDialog() {
    this.preferencesDialog = new PreferencesDialog();
    this.preferencesDialog.show();
  }

  private switchPreferencesTab(tab: string) {
    this.preferencesDialog.switchTab(tab);
  }

  private quitApp() {
    this.clearUpdateInterval();
    this.backgroundWindow = null;
    app.quit();
  }
 private checkForDuplicate(args){
    // chef if args path and file name are not already present
   const path = args
   // cookbook name can be added later
   // const cookbook = path.match(/([^\/]*)\/*$/)
    const obj = helpers.readRepoPath();
   let status = false
   for (var i=0; i<obj.length; i++) {
     if (obj[i]["filepath"] == path) {
       status = true
     }
   }
    return status
 }

  run() {
    if(!app.requestSingleInstanceLock()) {
      console.log('Chef Workstation is already running.');
      console.log(dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }))
      app.quit();
      return;
    }
    app.on('ready', () => { this.startApp() });

    ipcMain.on('do-update-check', (_event, arg) => { this.triggerUpdateCheck(arg) });
    ipcMain.on('do-download', () => { this.downloadUpdate() });
    ipcMain.on('switch-preferences-tab', (_event, arg) => { this.switchPreferencesTab(arg) });
    ipcMain.on('setup-update-interval', () => { this.setupUpdateInterval() });
    ipcMain.on('clear-update-interval', () => { this.clearUpdateInterval() });

    // @pranay
    // @ts-ignore
    ipcMain.on('select-dirs', async (event, arg) => {
      console.log('directories selected', event)
      console.log('directories selected', arg)
      const { canceled, filePaths } = await dialog.showOpenDialog(this.backgroundWindow, {
        properties: ['openDirectory']
      })
      console.log('directories selected', filePaths[0])
        if (canceled) {
          return ""
        } else {
          if (!this.checkForDuplicate(filePaths[0])){
            console.log("returning new cookbook from here")
            // append this file path to json
            helpers.writeRepoPath( filePaths[0], "local")
            // send back cookname and append it to file or refresh whole page
            event.reply("select-dirs-response", filePaths[0])
            return filePaths[0]
          } else{
            console.log("folder is already present")
            event.reply("select-dirs-response", "folder is already present")
          }
              }
    })


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
        const noUpdateDialog = require('./no-update/no_update_dialog.js');
        noUpdateDialog.open();
      }
    });

    this.omnitruckUpdateChecker.on('update-available', (updateInfo) => {
      this.pendingUpdate = updateInfo;
      this.tray.setUpdateAvailable(true, updateInfo.version);
      this.trayMenu = this.createMenu();
      this.tray.setContextMenu(this.trayMenu);

      if (this.requestFromUser)  {
        // If they picked the menu option, show a notification dialog.
        // don't set the tray notification state, because they're viewing that
        // notification now.
        const updateAvailableDialog = require('./update-available/update_available_dialog.js');
        updateAvailableDialog.open(updateInfo);
      }
    });

    this.omnitruckUpdateChecker.on('error', (error) => {
      console.log("Failed to check for updates:  " + (error == null ? "no error given" :  error.toString()))
      if (this.requestFromUser) {
        // TODO probably don't show the error except to say try again later, UNLESS
        // we can identify a user-correctable problem (proxy,. etc)
        dialog.showErrorBox('Update Check Failed', error == null ? "Update service unavailable or unreachable" : error.toString());
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
