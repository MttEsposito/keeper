'use strict';

var electron = require('electron');
var LOG = require('electron-log');
var electronUpdater = require('electron-updater');
var nodeNotifier = require('node-notifier');
var os = require('os');
var cryptoJs = require('crypto-js');
var ElectronStore = require('electron-store');
var fsExtra = require('fs-extra');

const CONST = {
    user: os.userInfo(),
    storageKey: {
        accounts: "USER_DATA_ACCOUNTS",
        psw: "USER_PSW_HASH",
        theme: "USER_APP_THEME",
    },
    message: {
        success: {
            createPsw: "Password successfully created ! ｡^‿^｡",
            addAcc: "Account saved ! (　＾∇＾)",
            editAcc: "Account edited ! •ᴗ•",
            delAcc: "Account deleted ! ツ",
            changePsw: "Password changed ! [⌐■-■]",
            bck: "Check folder for bck file (>◕ᴗ◕)>"
        },
        error: {
            common: "Ups something goes wrong (╥_╥)",
            access: "Wrong password !!! ლ(ಠ_ಠლ)",
            changePsw: "Password and confirm password not match ! ಠ_ಠ"
        }
    }
};
const { user, storageKey, message } = CONST;

class CryptoJs {
    constructor() { }
    encryptData(data, password) {
        return cryptoJs.AES.encrypt(data, password).toString();
    }
    decryptData(data, password) {
        const decrypted = cryptoJs.AES.decrypt(data, password);
        return decrypted.toString(cryptoJs.enc.Utf8);
    }
    stringToMd5(word) {
        return cryptoJs.MD5(word).toString();
    }
}
const Crypto = new CryptoJs();

class Storage {
    constructor() {
        this._storage = new ElectronStore();
    }
    getItem(key) {
        return this._storage.get(key);
    }
    setItem(key, value) {
        this._storage.set(key, value);
    }
    itemExist(key) {
        return this._storage.has(key);
    }
}
const Store = new Storage();

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class FileSystem {
    constructor() { }
    createFile(path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date().toISOString().replace(/:/g, "-");
                const name = `Keeper-${now}.bck.json`;
                yield fsExtra.outputFile(`${path}\\${name}`, JSON.stringify(data, null, " "));
                return true;
            }
            catch (error) {
                LOG.error(error);
                return false;
            }
        });
    }
}
const Fs = new FileSystem();

var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class ElectronEvents {
    constructor() {
        this._psw = "";
    }
    signOut() {
        return __awaiter$1(this, void 0, void 0, function* () {
            try {
                this._psw = "";
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    userExist() {
        return __awaiter$1(this, void 0, void 0, function* () {
            try {
                return Store.itemExist(storageKey.psw);
            }
            catch (error) {
                LOG.error(error);
                return false;
            }
        });
    }
    access(obj) {
        return __awaiter$1(this, void 0, void 0, function* () {
            try {
                const pswMd5 = Crypto.stringToMd5(obj.password);
                const pswStored = Store.getItem(storageKey.psw);
                if (pswMd5 === pswStored) {
                    this._psw = obj.password;
                    return { result: true, user };
                }
                else {
                    return { result: false, message: message.error.access };
                }
            }
            catch (error) {
                LOG.error(error);
                return { result: false, message: message.error.common };
            }
        });
    }
    createPassword(obj) {
        return __awaiter$1(this, void 0, void 0, function* () {
            try {
                const pswMd5 = Crypto.stringToMd5(obj.password);
                Store.setItem(storageKey.psw, pswMd5);
                return { result: true, message: message.success.createPsw };
            }
            catch (error) {
                LOG.error(error);
                return { result: false, message: message.error.common };
            }
        });
    }
    getUsersData() {
        return __awaiter$1(this, void 0, void 0, function* () {
            try {
                const encData = Store.getItem(storageKey.accounts) || null;
                return encData ? JSON.parse(Crypto.decryptData(encData, this._psw)) : [];
            }
            catch (error) {
                LOG.error(error);
                return error;
            }
        });
    }
    addAccount(obj) {
        return __awaiter$1(this, void 0, void 0, function* () {
            try {
                const data = yield this.getUsersData();
                obj.value.uid = Crypto.stringToMd5(Date.now().toLocaleString());
                data.push(obj.value);
                const encData = Crypto.encryptData(JSON.stringify(data), this._psw);
                Store.setItem(storageKey.accounts, encData);
                return { result: true, message: message.success.addAcc };
            }
            catch (error) {
                LOG.error(error);
                return { result: false, message: message.error.common };
            }
        });
    }
    editAccount(obj) {
        return __awaiter$1(this, void 0, void 0, function* () {
            try {
                const data = yield this.getUsersData();
                for (let i in data) {
                    if (data[i].uid === obj.uid) {
                        data[i] = obj.value;
                        data[i].uid = obj.uid;
                    }
                }
                const encData = Crypto.encryptData(JSON.stringify(data), this._psw);
                Store.setItem(storageKey.accounts, encData);
                return { result: true, message: message.success.editAcc };
            }
            catch (error) {
                LOG.error(error);
                return { result: false, message: message.error.common };
            }
        });
    }
    removeAccount(obj) {
        return __awaiter$1(this, void 0, void 0, function* () {
            try {
                const data = yield this.getUsersData();
                const filterData = data.filter(acc => acc.uid != obj.uid);
                const encData = Crypto.encryptData(JSON.stringify(filterData), this._psw);
                Store.setItem(storageKey.accounts, encData);
                return { result: true, message: message.success.delAcc };
            }
            catch (error) {
                LOG.error(error);
                return { result: false, message: message.error.common };
            }
        });
    }
    changePassword(obj) {
        return __awaiter$1(this, void 0, void 0, function* () {
            try {
                if (obj.value.password == obj.value.cpassword) {
                    const data = yield this.getUsersData();
                    const newPsw = Crypto.stringToMd5(obj.value.cpassword);
                    Store.setItem(storageKey.psw, newPsw);
                    this._psw = obj.value.cpassword;
                    const encData = Crypto.encryptData(JSON.stringify(data), this._psw);
                    Store.setItem(storageKey.accounts, encData);
                    return { result: true, message: message.success.changePsw };
                }
                else {
                    return { result: false, message: message.error.changePsw };
                }
            }
            catch (error) {
                LOG.error(error);
                return { result: false, message: message.error.common };
            }
        });
    }
    setTheme(obj) {
        return __awaiter$1(this, void 0, void 0, function* () {
            try {
                Store.setItem(storageKey.theme, obj.theme);
                return { result: true, message: "" };
            }
            catch (error) {
                LOG.error(error);
                return { result: false, message: message.error.common };
            }
        });
    }
    getTheme() {
        return __awaiter$1(this, void 0, void 0, function* () {
            try {
                return Store.getItem(storageKey.theme) || "";
            }
            catch (error) {
                LOG.error(error);
                return "";
            }
        });
    }
    exportBackup(obj) {
        return __awaiter$1(this, void 0, void 0, function* () {
            try {
                const data = yield this.getUsersData();
                const output = { data };
                yield Fs.createFile(obj.outPath, output);
                return { result: true, message: message.success.bck };
            }
            catch (error) {
                LOG.error(error);
                return { result: false, message: message.error.common };
            }
        });
    }
}

LOG.transports.file.file = `${__dirname}\\app-log.log`;
class Electron {
    constructor() {
        this.mainWindow = null;
        this.isUpdating = false;
        this._init();
    }
    _init() {
        LOG.info("Electron start");
        process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
        electron.app.setMaxListeners(30);
        electron.app.on('ready', () => {
            LOG.info("App ready");
            this._createMainWindow();
            this._updateDispatcher();
            this._eventsDispatcher();
            setTimeout(() => {
                LOG.info("Check for update");
                electronUpdater.autoUpdater.checkForUpdates();
                setInterval(() => {
                    if (!this.isUpdating) {
                        LOG.info("Check for update");
                        electronUpdater.autoUpdater.checkForUpdates();
                    }
                }, 300000);
            }, 30000);
        });
        electron.app.on("window-all-closed", () => {
            if (process.platform !== 'darwin') {
                electron.app.quit();
            }
        });
        electron.app.on('activate', () => {
            if (this.mainWindow === null) {
                this._createMainWindow();
            }
        });
    }
    _createMainWindow() {
        LOG.info("Create main window");
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
        this.mainWindow = new electron.BrowserWindow(settings);
        this.mainWindow.loadFile(`${__dirname}/dist/keeper/index.html`);
        this.mainWindow.setMenu(null);
        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });
    }
    _updateDispatcher() {
        LOG.info("Create lifecycle update events");
        electronUpdater.autoUpdater.on('checking-for-update', () => {
            LOG.info("Checking for update");
        });
        electronUpdater.autoUpdater.on('update-available', (info) => {
            this.isUpdating = true;
            LOG.info("Update available");
        });
        electronUpdater.autoUpdater.on('download-progress', (progressObj) => {
            const percent = progressObj.percent.toFixed(1);
            LOG.info(`Download-progress: ${percent}%`);
        });
        electronUpdater.autoUpdater.on('update-not-available', (info) => {
            LOG.info("Update not available");
        });
        electronUpdater.autoUpdater.on('error', (err) => {
            LOG.error(err);
        });
        electronUpdater.autoUpdater.on('update-downloaded', (info) => {
            this.mainWindow.webContents.send('updateReadyToInstall', info);
            this._sendNotify("New keeper version", "An update of keeper is ready to install");
            LOG.info("Update downloaded");
        });
    }
    _sendNotify(title, message) {
        LOG.info("Create notification");
        const notifier = new nodeNotifier.WindowsToaster({
            withFallback: false
        });
        const Notification = {
            title: title,
            message: message,
            sound: true,
            icon: `${__dirname}/dist/keeper/assets/archive_icon.png`,
            wait: true,
            appID: "com.keeper.app"
        };
        notifier.notify(Notification);
    }
    _eventsDispatcher() {
        LOG.info("Create lifecycle events UI - LOGIC");
        const events = new ElectronEvents();
        electron.ipcMain.on("access", (event, args) => {
            LOG.info("Event access !");
            events.access(args)
                .then(res => event.sender.send("accessReply", res))
                .catch(err => event.sender.send("accessReply", err));
        });
        electron.ipcMain.on("signOut", (event, args) => {
            LOG.info("Event end session !");
            events.signOut()
                .then(res => event.sender.send("signOutReply", res))
                .catch(err => event.sender.send("signOutReply", err));
        });
        electron.ipcMain.on("createPassword", (event, args) => {
            LOG.info("Event create password !");
            events.createPassword(args)
                .then(res => event.sender.send("createPasswordReply", res))
                .catch(err => event.sender.send("createPasswordReply", err));
        });
        electron.ipcMain.on("userExist", (event, args) => {
            LOG.info("Event user exist !");
            events.userExist()
                .then(res => event.sender.send("userExistReply", res))
                .catch(err => event.sender.send("userExistReply", err));
        });
        electron.ipcMain.on("getUserData", (event, args) => {
            LOG.info("Event get account !");
            events.getUsersData()
                .then(res => event.sender.send("getDataReply", { result: true, data: res }))
                .catch(err => event.sender.send("getDataReply", { result: true, data: err }));
        });
        electron.ipcMain.on("addAccount", (event, args) => {
            LOG.info("Event add account !");
            events.addAccount(args)
                .then(res => event.sender.send("actionReply", res))
                .catch(err => event.sender.send("actionReply", err));
        });
        electron.ipcMain.on("editAccount", (event, args) => {
            LOG.info("Event edit account !");
            events.editAccount(args)
                .then(res => event.sender.send("actionReply", res))
                .catch(err => event.sender.send("actionReply", err));
        });
        electron.ipcMain.on("removeAccount", (event, args) => {
            LOG.info("Event remove account !");
            events.removeAccount(args)
                .then(res => event.sender.send("actionReply", res))
                .catch(err => event.sender.send("actionReply", err));
        });
        electron.ipcMain.on("changePassword", (event, args) => {
            LOG.info("Event change password !");
            events.changePassword(args)
                .then(res => event.sender.send("changePswReply", res))
                .catch(err => event.sender.send("changePswReply", err));
        });
        electron.ipcMain.on("changeTheme", (event, args) => {
            LOG.info("Event change theme !");
            events.setTheme(args)
                .then(res => event.sender.send("changeThemeReply", res))
                .catch(err => event.sender.send("changeThemeReply", err));
        });
        electron.ipcMain.on("getUserTheme", (event, args) => {
            LOG.info("Event get theme !");
            events.getTheme()
                .then(res => event.sender.send("getUserThemeReply", res))
                .catch(err => event.sender.send("getUserThemeReply", err));
        });
        electron.ipcMain.on("exportFile", (event, args) => {
            LOG.info("Event export backup !");
            events.exportBackup(args)
                .then(res => event.sender.send("exportFileReply", res))
                .catch(err => event.sender.send("exportFileReply", err));
        });
        electron.ipcMain.on("quitAndUpdate", (event, args) => {
            LOG.info("Event quit and update !");
            electronUpdater.autoUpdater.quitAndInstall(true, true);
        });
        electron.ipcMain.on("getVersion", (event, args) => {
            LOG.info("Event get version !");
            event.sender.send("versionReply", electron.app.getVersion());
        });
    }
}
new Electron();
