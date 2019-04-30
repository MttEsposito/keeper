const { CryptoJs } = require("./crypto");
const { FsExtra } = require("./fs-extra");
const { CONST } = require("./constants");

export class ElectronEvents {

    constructor() { }

    _pswKey;

    async signOut() {
        try {
            this._pswKey = "";
            return true;
        } catch (error) {
            return false;
        }
    }

    async signIn(req) {
        try {
            const fse = new FsExtra();
            const crypto = new CryptoJs();
            const pswMd5 = crypto.stringToMd5(req.password);
            const content = await fse.readFile(CONST.path, CONST.usersFile);
            const dataDecryp = crypto.decryptData(content.toString(), CONST.apiKey);
            const data = JSON.parse(dataDecryp);
            const user = data.users.filter(user => user.username == req.username && user.password == pswMd5);
            if (user.length) {
                this._pswKey = req.password;
                delete user[0].password;
                return { result: true, user: user[0] };
            } else {
                return { result: false };
            }
        } catch (err) {
            return { result: false, errMessage: "Error occurred!!" };
        }
    }

    async signUp(req) {
        try {
            const fse = new FsExtra();
            const crypto = new CryptoJs();
            const exist = await fse.existFolder(CONST.path, CONST.usersFile);
            if (exist) {
                let content = await fse.readFile(CONST.path, CONST.usersFile);
                content = content.toString() ? content.toString() : `{"users":[]}`;
                if (content != `{"users":[]}`) {
                    content = crypto.decryptData(content, CONST.apiKey);
                }
                const data = JSON.parse(content.toString());
                req.password = crypto.stringToMd5(req.password);
                req.uid = crypto.stringToMd5((new Date().toISOString()) + req.password);
                data.users.push(req);
                const encData = crypto.encryptData(JSON.stringify(data), CONST.apiKey);
                await fse.writeFile(CONST.path, CONST.usersFile, encData);
                return { result: true };
            } else {
                await fse.createFile(CONST.path, CONST.usersFile);
                const data = JSON.parse(`{"users":[]}`);
                req.password = crypto.stringToMd5(req.password);
                req.uid = crypto.stringToMd5((new Date().toISOString()) + req.password);
                data.users.push(req);
                const encData = crypto.encryptData(JSON.stringify(data), CONST.apiKey);
                await fse.writeFile(CONST.path, CONST.usersFile, encData);
                return { result: true };
            }
        } catch (err) {
            return { result: false, errMessage: "Error occurred!!" };
        }
    }

    async getUsersData(req) {
        try {
            const fse = new FsExtra();
            const crypto = new CryptoJs();
            const userFile = `${req.uid}-${CONST.dataFile}`;
            const exist = await fse.existFolder(CONST.path, userFile);
            if (exist) {
                let content = await fse.readFile(CONST.path, userFile);
                content = content.toString() ? content.toString() : `{}`;
                if (content != `{}`) {
                    content = crypto.decryptData(content, this._pswKey);
                }
                const data = JSON.parse(content.toString());
                const result = data[req.uid] || [];
                return { result: true, data: result };
            } else {
                return { result: true, data: [] };
            }
        } catch (err) {
            return { result: false, data: [] };
        }
    }

    async addAccount(req) {
        try {
            const fse = new FsExtra();
            const crypto = new CryptoJs();
            const userFile = `${req.user.uid}-${CONST.dataFile}`;
            const exist = await fse.existFolder(CONST.path, userFile);
            if (exist) {
                let content = await fse.readFile(CONST.path, userFile);
                content = content.toString();
                content = crypto.decryptData(content, this._pswKey);
                const data = JSON.parse(content.toString());
                if (data[req.user.uid]) {
                    req.value.uid = crypto.stringToMd5((new Date().toISOString()));
                    data[req.user.uid].push(req.value);
                } else {
                    req.value.uid = crypto.stringToMd5((new Date().toISOString()));
                    data[req.user.uid] = req.value;
                }
                const encData = crypto.encryptData(JSON.stringify(data), this._pswKey);
                await fse.writeFile(CONST.path, userFile, encData);
                return { result: true, message: "Account saved!" };
            } else {
                let data = {};
                req.value.uid = crypto.stringToMd5((new Date().toISOString()));
                data[req.user.uid] = [req.value];
                const encData = crypto.encryptData(JSON.stringify(data), this._pswKey);
                await fse.writeFile(CONST.path, userFile, encData);
                return { result: true, message: "Account saved!" };
            }
        } catch (err) {
            return { result: false, message: "Error account not saved!" };
        }
    }

    async editAccount(req) {
        try {
            const fse = new FsExtra();
            const crypto = new CryptoJs();
            const userFile = `${req.user.uid}-${CONST.dataFile}`;
            let content = await fse.readFile(CONST.path, userFile);
            content = content.toString();
            content = crypto.decryptData(content, this._pswKey);
            let data = JSON.parse(content.toString());
            let values = data[req.user.uid];
            for (let i in values) {
                if (values[i].uid == req.uid) {
                    values[i] = req.value;
                    values[i].uid = req.uid;
                }
            }
            const encData = crypto.encryptData(JSON.stringify(data), this._pswKey);
            await fse.writeFile(CONST.path, userFile, encData);
            return { result: true, message: "Account saved!" };
        } catch (err) {
            return { result: false, message: "Error account not saved!" };
        }
    }

    async removeAccount(req) {
        try {
            const fse = new FsExtra();
            const crypto = new CryptoJs();
            const userFile = `${req.user.uid}-${CONST.dataFile}`;
            let content = await fse.readFile(CONST.path, userFile);
            content = content.toString();
            content = crypto.decryptData(content, this._pswKey);
            const data = JSON.parse(content.toString());
            const newData = data[req.user.uid].filter(record => record.uid != req.uid);
            data[req.user.uid] = newData;
            const encData = crypto.encryptData(JSON.stringify(data), this._pswKey);
            await fse.writeFile(CONST.path, userFile, encData);
            return { result: true, message: "Account removed!" };
        } catch (err) {
            return { result: false, message: "Error account not removed!" };
        }
    }

    async changePassword(req) {
        try {
            const fse = new FsExtra();
            const crypto = new CryptoJs();
            if (req.value.password == req.value.cpassword) {
                const newPsw = crypto.stringToMd5(req.value.cpassword);
                // change password key for all user data
                const userFile = `${req.user.uid}-${CONST.dataFile}`;
                const exist = await fse.existFolder(CONST.path, userFile);
                let userAccounts = null;
                if (exist) {
                    userAccounts = await fse.readFile(CONST.path, userFile);
                    userAccounts = userAccounts.toString() ? userAccounts.toString() : `{}`;
                    if (userAccounts != `{}`) {
                        userAccounts = crypto.decryptData(userAccounts, this._pswKey);
                        const data = JSON.parse(userAccounts.toString());
                        const encData = crypto.encryptData(JSON.stringify(data), req.value.cpassword);
                        await fse.writeFile(CONST.path, userFile, encData);
                    }
                }
                // save new password
                let content = await fse.readFile(CONST.path, CONST.usersFile);
                const dataDecryp = crypto.decryptData(content.toString(), CONST.apiKey);
                const data = JSON.parse(dataDecryp);
                for (let user of data.users) {
                    if (user.uid == req.user.uid) {
                        user.password = newPsw;
                    }
                }
                const encData = crypto.encryptData(JSON.stringify(data), CONST.apiKey);
                await fse.writeFile(CONST.path, CONST.usersFile, encData);
                this._pswKey = req.value.cpassword;
                return { result: true, message: "Password changed!" };
            } else {
                return { result: false, message: "Password and confirm password not match!" };
            }
        } catch (err) {
            return { result: false, message: "Error during change password!" };
        }
    }

}