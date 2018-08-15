const {app, Tray, Menu, BrowserWindow, Notification} = require('electron');
const path = require('path');

// TODO use https://electronjs.org/docs/api/native-image which hopefully supports scaling
const iconPath = path.join(__dirname, 'images/cws_small.png');
let appIcon = null;
let win = null;

app.on('ready', function(){
  appIcon = new Tray(iconPath);

  // Notification - https://electronjs.org/docs/api/notification
  // TODO listen to the action events
  let notif = new Notification({
    title: 'Chef Workstation',
    subtitle: 'New update now available!',
    silent: true,
    icon: iconPath,
    // Buttons won't work until our app is signed
    // https://electronjs.org/docs/api/structures/notification-action#button-support-on-macos
    actions: [
      {
        type: 'button',
        text: 'Install'
      },
      {
        type: 'button',
        text: 'Later'
      }
    ]
  });

  // TODO notification event 'click' should pop up a window pretends to download and update
  downloadWindow = new notif.on('click', () => {
    console.log('an event occurred!');
  });

  preferencesWindow = new BrowserWindow({show: false});
  preferencesWindow.loadURL(`file://${__dirname}/preferences.html`)

  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Check for Updates...',
      click (menuItem, browserWindow, event) {
        notif.show()
      }
    },
    {
      type: 'separator'
    },
    {
      // orderFrontStandardAboutPanel
      // TODO requires packaging and Info.plist support
      role: 'about'
    },
    {
      label: 'Preferences',
      accelerator: 'Cmd+,',
      // TODO dummy preferences window
      click: () => preferencesWindow.show()
    },
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      selector: 'terminate:',
    }
  ]);
  appIcon.setToolTip('This is my application.');
  appIcon.setContextMenu(contextMenu);
});
