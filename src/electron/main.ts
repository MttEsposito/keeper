import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain } from 'electron';
import * as LOG from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { WindowsToaster } from 'node-notifier';
import { ElectronEvents } from './events';

// initaliaze log to write output on file
LOG.transports.file.file = `${__dirname}\\app-log.log`;

class Electron {

  constructor() {
    this._init();
  }

  private mainWindow: BrowserWindow = null;
  private isUpdating: boolean = false;

  private _init(): void {
    LOG.info("Electron start");
    // disable warning security
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
    app.setMaxListeners(30);
    // ready event
    app.on('ready', () => {
      LOG.info("App ready");
      this._createMainWindow();
      this._updateDispatcher();
      this._eventsDispatcher();
      setTimeout(() => {
        LOG.info("Check for update");
        autoUpdater.checkForUpdates();
        setInterval(() => {
          if (!this.isUpdating) {
            LOG.info("Check for update");
            autoUpdater.checkForUpdates();
          }
        }, 300000);// check for update every 5 minutes
      }, 30000);// check the update after 30 seconds app is opend
    });

    app.on("window-all-closed", () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (this.mainWindow === null) {
        this._createMainWindow();
      }
    })
  }

  private _createMainWindow(): void {
    LOG.info("Create main window");
    const settings: BrowserWindowConstructorOptions = {
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
    // this.mainWindow.webContents.openDevTools();
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  private _updateDispatcher(): void {
    LOG.info("Create lifecycle update events");
    // const sendStatusUpdate = (obj) => {
    //     this.mainWindow.webContents.send('updateMessage', obj);
    // }

    autoUpdater.on('checking-for-update', () => {
      LOG.info("Checking for update");
    })

    autoUpdater.on('update-available', (info) => {
      this.isUpdating = true;
      LOG.info("Update available");
    })

    autoUpdater.on('download-progress', (progressObj) => {
      const percent = progressObj.percent.toFixed(1);
      LOG.info(`Download-progress: ${percent}%`);
    })

    autoUpdater.on('update-not-available', (info) => {
      LOG.info("Update not available");
    })

    autoUpdater.on('error', (err) => {
      LOG.error(err);
    })

    autoUpdater.on('update-downloaded', (info) => {
      this.mainWindow.webContents.send('updateReadyToInstall', info);
      this._sendNotify("New keeper version", "An update of keeper is ready to install");
      LOG.info("Update downloaded");
    });
  }

  private _sendNotify(title: string, message: string): void {
    LOG.info("Create notification");
    const notifier = new WindowsToaster({
      withFallback: false
    });
    const Notification: any = {
      title: title,
      message: message,
      sound: true,
      icon: `${__dirname}/dist/keeper/assets/archive_icon.png`,
      wait: true,
      appID: "com.keeper.app"
    }
    notifier.notify(Notification);
  }

  private _eventsDispatcher(): void {
    LOG.info("Create lifecycle events UI - LOGIC");

    const events: ElectronEvents = new ElectronEvents();

    ipcMain.on("access", (event: any, args: any) => {
      LOG.info("Event access !");
      events.access(args)
        .then(res => event.sender.send("accessReply", res))
        .catch(err=> event.sender.send("accessReply", err))
    });

    ipcMain.on("signOut", (event: any, args: any) => {
      LOG.info("Event end session !");
      events.signOut()
        .then(res => event.sender.send("signOutReply", res))
        .catch(err => event.sender.send("signOutReply", err))
    });


    ipcMain.on("createPassword", (event: any, args: any) => {
      LOG.info("Event create password !");
      events.createPassword(args)
        .then(res => event.sender.send("createPasswordReply", res))
        .catch(err => event.sender.send("createPasswordReply", err))
    });

    ipcMain.on("userExist", (event: any, args: any) => {
      LOG.info("Event user exist !");
      events.userExist()
        .then(res => event.sender.send("userExistReply", res))
        .catch(err => event.sender.send("userExistReply", err))
    });

    ipcMain.on("getUserData", (event: any, args: any) => {
      LOG.info("Event get account !");
      events.getUsersData()
        .then(res => event.sender.send("getDataReply", { result: true, data: res }))
        .catch(err => event.sender.send("getDataReply", { result: true, data: err }))
    });

    ipcMain.on("addAccount", (event: any, args: any) => {
      LOG.info("Event add account !");
      events.addAccount(args)
        .then(res => event.sender.send("actionReply", res))
        .catch(err => event.sender.send("actionReply", err))
    });

    ipcMain.on("editAccount", (event: any, args: any) => {
      LOG.info("Event edit account !");
      events.editAccount(args)
        .then(res => event.sender.send("actionReply", res))
        .catch(err => event.sender.send("actionReply", err))
    });

    ipcMain.on("removeAccount", (event: any, args: any) => {
      LOG.info("Event remove account !");
      events.removeAccount(args)
        .then(res => event.sender.send("actionReply", res))
        .catch(err => event.sender.send("actionReply", err))
    });

    ipcMain.on("changePassword", (event: any, args: any) => {
      LOG.info("Event change password !");
      events.changePassword(args)
        .then(res => event.sender.send("changePswReply", res))
        .catch(err => event.sender.send("changePswReply", err))
    });

    ipcMain.on("changeTheme", (event: any, args: any) => {
      LOG.info("Event change theme !");
      events.setTheme(args)
        .then(res => event.sender.send("changeThemeReply", res))
        .catch(err => event.sender.send("changeThemeReply", err))
    });

    ipcMain.on("getUserTheme", (event: any, args: any) => {
      LOG.info("Event get theme !");
      events.getTheme()
        .then(res => event.sender.send("getUserThemeReply", res))
        .catch(err => event.sender.send("getUserThemeReply", err))
    });

    ipcMain.on("exportFile", (event: any, args: any) => {
      LOG.info("Event export backup !");
      events.exportBackup(args)
        .then(res => event.sender.send("exportFileReply", res))
        .catch(err => event.sender.send("exportFileReply", err))
    });

    ipcMain.on("quitAndUpdate", (event: any, args: any) => {
      LOG.info("Event quit and update !");
      autoUpdater.quitAndInstall(true, true);
    });

    ipcMain.on("getVersion", (event: any, args: any) => {
      LOG.info("Event get version !");
      event.sender.send("versionReply", app.getVersion());
    });
  }


}

new Electron();
