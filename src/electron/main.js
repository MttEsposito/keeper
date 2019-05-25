const { app, BrowserWindow, ipcMain } = require('electron');
const { ElectronEvents } = require("./events");
const { autoUpdater } = require("electron-updater");
const { WindowsToaster } = require("node-notifier");
const LOG = require('electron-log');

class Electron {

  constructor() { }
  mainWindow;
  isUpdating;

  init() {

    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

    app.setMaxListeners(30);

    app.on('ready', () => {

      LOG.info("app start");

      this._createWindow();

      setTimeout(() => {
        LOG.info("check for update");
        autoUpdater.checkForUpdates();
        setInterval(() => {
          if (!this.isUpdating) {
            LOG.info("check for update");
            autoUpdater.checkForUpdates();
          }
        }, 300000);// check for update every 5 minutes
      }, 30000);// check the update after 30 seconds app is opend
    });

    app.on("window-all-closed", () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    });

    app.on('activate', () => {
      if (this.mainWindow === null) {
        this._createWindow();
      }
    })
  }

  _createWindow() {
    LOG.info("create window");
    const settings = {
      width: 850,
      height: 600,
      minHeight: 600,
      minWidth: 850,
      webPreferences: {
        nodeIntegration: true
      },
      icon: `${__dirname}/dist/keeper/assets/images/archive_icon.ico`
    };
    this.mainWindow = new BrowserWindow(settings);
    this.mainWindow.loadFile(`${__dirname}/dist/keeper/index.html`);
    // hide the menu bar
    this.mainWindow.setMenu(null);
    // enable dev tools good for debug
    this.mainWindow.webContents.openDevTools();
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    })
    this._bindLinkUpdate();
    this._bindEvents();
  }

  _bindEvents() {
    LOG.info("bind events UI - LOGIC");

    const events = new ElectronEvents();

    ipcMain.on("signIn", (event, args) => {
      events.signIn(args)
        .then(res => event.sender.send("signReply", res))
        .catch(err => event.sender.send("signReply", err))
    });

    ipcMain.on("signUp", (event, args) => {
      events.signUp(args)
        .then(res => event.sender.send("signUpReply", res))
        .catch(err => event.sender.send("signUpReply", err))
    });

    ipcMain.on("signOut", (event, args) => {
      events.signOut()
        .then(res => event.sender.send("signOutReply", res))
        .catch(err => event.sender.send("signOutReply", err))
    });

    ipcMain.on("getUserData", (event, args) => {
      events.getUsersData(args)
        .then(res => event.sender.send("getDataReply", res))
        .catch(err => event.sender.send("getDataReply", err))
    });

    ipcMain.on("addAccount", (event, args) => {
      events.addAccount(args)
        .then(res => event.sender.send("actionReply", res))
        .catch(err => event.sender.send("actionReply", err))
    });

    ipcMain.on("editAccount", (event, args) => {
      events.editAccount(args)
        .then(res => event.sender.send("actionReply", res))
        .catch(err => event.sender.send("actionReply", err))
    });

    ipcMain.on("removeAccount", (event, args) => {
      events.removeAccount(args)
        .then(res => event.sender.send("actionReply", res))
        .catch(err => event.sender.send("actionReply", err))
    });

    ipcMain.on("changePassword", (event, args) => {
      events.changePassword(args)
        .then(res => event.sender.send("changePswReply", res))
        .catch(err => event.sender.send("changePswReply", err))
    });

    ipcMain.on("quitAndUpdate", (event, args) => {
      autoUpdater.quitAndInstall(true, true);
    });

    ipcMain.on("getVersion", (event, args) => {
      event.sender.send("versionReply", app.getVersion());
    });
  }

  _bindLinkUpdate() {

    LOG.info("bind update events");
    // const sendStatusUpdate = (obj) => {
    //     this.mainWindow.webContents.send('updateMessage', obj);
    // }

    autoUpdater.on('checking-for-update', () => {
      LOG.info("checking-for-update");
    })

    autoUpdater.on('update-available', (info) => {
      this.isUpdating = true;
      LOG.info("update-available");
    })

    autoUpdater.on('download-progress', (progressObj) => {
      const percent = progressObj.percent.toFixed(1);
      LOG.info(`download-progress: ${percent}%`);
    })

    autoUpdater.on('update-not-available', (info) => {
      LOG.info("update-not-available");
    })

    autoUpdater.on('error', (err) => {
      LOG.error(err);
    })

    autoUpdater.on('update-downloaded', (info) => {
      this.mainWindow.webContents.send('updateReadyToInstall', info);
      this._sendNotify("New keeper version", "An update of keeper is ready to install");
      LOG.info("update-downloaded");
    });


  }

  _sendNotify(title, message) {
    LOG.info("create notification");
    const notifier = new WindowsToaster({
      withFallback: false
    });
    const Notification = {
      title: title,
      message: message,
      sound: true,
      icon: `${__dirname}/dist/keeper/assets/archive_icon.png`,
      wait: true,
      appID: "com.keeper.app"
    }
    notifier.notify(Notification);
  }

}
