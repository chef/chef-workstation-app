import {
  BrowserWindow,
  BrowserView
} from 'electron';
import path = require('path');

export class PreferencesDialog {
  private preferencesDialog: BrowserWindow;
  private contentView: BrowserView;

  // the selected tab: when modifying this, update the switchTab() func
  private selectedTab: "general" | "notifications" | "advanced";

  // size of our preferences window
  private winWidth = 500;
  private winHeight = 400;

  // all our HTML tabs and menu bar
  private menubarHTML = path.join('file://', __dirname, 'preferences_bar.html');
  private advancedHTML = path.join('file://', __dirname, 'advanced_tab.html');
  private generalHTML = path.join('file://', __dirname, 'general_tab.html');
  private notificationsHTML = path.join('file://', __dirname, 'notifications_tab.html');

  constructor() {
    this.preferencesDialog = new BrowserWindow({
      titleBarStyle: 'customButtonsOnHover',
      width: this.winWidth,
      height: this.winHeight,
      show: false,
      alwaysOnTop: true,
      resizable: false,
      minimizable: true,
      maximizable: false,
      webPreferences: {
        nodeIntegration: true
      }
    });
    this.contentView = new BrowserView({ webPreferences: { nodeIntegration: true }});
    this.preferencesDialog.addBrowserView(this.contentView);
    this.contentView.setBounds({
      x: 0, y: 78,
      width: this.winWidth,
      height: this.winHeight
    });
    this.preferencesDialog.loadURL(this.menubarHTML);

    // by default the advanced tab is selected
    this.contentView.webContents.loadURL(this.advancedHTML);
    this.selectedTab = "advanced";
  }

  public show() {
    this.preferencesDialog.on('ready-to-show', () => { this.preferencesDialog.show(); });
    this.preferencesDialog.on('closed', () => { this.preferencesDialog = null; });
  }

  public switchTab(tab: string) {
    if (tab == this.selectedTab) {
      return;
    }

    switch(tab) {
      case 'general': {
        this.contentView.webContents.loadURL(this.generalHTML);
        break;
      }
      case 'notifications': {
        this.contentView.webContents.loadURL(this.notificationsHTML);
        break;
      }
      case 'advanced': {
        this.contentView.webContents.loadURL(this.advancedHTML);
        break;
      }
      default: {
        console.log("ERROR: Unknown tab "+tab);
        this.contentView.webContents.loadURL(this.generalHTML);
        this.selectedTab = 'general';
        return;
      }
    }

    // store the new selected tab
    this.selectedTab = tab;
  }
}
