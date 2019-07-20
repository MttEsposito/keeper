import { user, message, storageKey } from "./constant";
import { Crypto } from "./crypto";
import { Store } from "./storage";
import * as LOG from 'electron-log';
import { Accounts } from '../app/models/accounts.interface';
import { AccessResponse, CommonResponse } from '../app/models/response.interface';
import { Fs } from "./filesystem";

export class ElectronEvents {
  constructor() {
    // Store.clearAll();
  }

  private _psw: string = "";

  public async signOut(): Promise<boolean> {
    try {
      this._psw = "";
      return true;
    } catch (error) {
      return false;
    }
  }


  public async userExist(): Promise<boolean> {
    try {
      return Store.itemExist(storageKey.psw);
    } catch (error) {
      LOG.error(error);
      return false;
    }
  }

  public async access(obj: any): Promise<AccessResponse> {
    try {
      const pswMd5 = Crypto.stringToMd5(obj.password);
      const pswStored = Store.getItem(storageKey.psw);
      if (pswMd5 === pswStored) {
        this._psw = obj.password;
        return { result: true, user };
      } else {
        return { result: false, message: message.error.access };
      }
    } catch (error) {
      LOG.error(error);
      return { result: false, message: message.error.common };
    }
  }

  public async createPassword(obj: any): Promise<CommonResponse> {
    try {
      const pswMd5 = Crypto.stringToMd5(obj.password);
      Store.setItem(storageKey.psw, pswMd5);
      return { result: true, message: message.success.createPsw };
    } catch (error) {
      LOG.error(error);
      return { result: false, message: message.error.common };
    }
  }

  public async getUsersData(): Promise<Array<Accounts>> {
    try {
      const encData = Store.getItem(storageKey.accounts) || null;
      return encData ? JSON.parse(Crypto.decryptData(encData, this._psw)) : [];
    } catch (error) {
      LOG.error(error);
      return error;
    }
  }

  public async addAccount(obj: any): Promise<CommonResponse> {
    try {
      const data = await this.getUsersData();
      obj.value.uid = Crypto.stringToMd5(Date.now().toLocaleString());
      data.push(obj.value);
      const encData = Crypto.encryptData(JSON.stringify(data), this._psw);
      Store.setItem(storageKey.accounts, encData);
      return { result: true, message: message.success.addAcc };
    } catch (error) {
      LOG.error(error);
      return { result: false, message: message.error.common };
    }
  }

  public async editAccount(obj: any): Promise<CommonResponse> {
    try {
      const data = await this.getUsersData();
      for (let i in data) {
        if (data[i].uid === obj.uid) {
          data[i] = obj.value;
          data[i].uid = obj.uid;
        }
      }
      const encData = Crypto.encryptData(JSON.stringify(data), this._psw);
      Store.setItem(storageKey.accounts, encData);
      return { result: true, message: message.success.editAcc };
    } catch (error) {
      LOG.error(error);
      return { result: false, message: message.error.common };
    }
  }

  public async removeAccount(obj: any): Promise<CommonResponse> {
    try {
      const data = await this.getUsersData();
      const filterData = data.filter(acc => acc.uid != obj.uid);
      const encData = Crypto.encryptData(JSON.stringify(filterData), this._psw);
      Store.setItem(storageKey.accounts, encData);
      return { result: true, message: message.success.delAcc };
    } catch (error) {
      LOG.error(error);
      return { result: false, message: message.error.common };
    }
  }

  public async changePassword(obj: any): Promise<CommonResponse> {
    try {
      if (obj.value.password == obj.value.cpassword) {
        const data = await this.getUsersData();
        const newPsw = Crypto.stringToMd5(obj.value.cpassword);
        Store.setItem(storageKey.psw, newPsw);
        this._psw = obj.value.cpassword;
        const encData = Crypto.encryptData(JSON.stringify(data), this._psw);
        Store.setItem(storageKey.accounts, encData);
        return { result: true, message: message.success.changePsw };
      } else {
        return { result: false, message: message.error.changePsw };
      }
    } catch (error) {
      LOG.error(error);
      return { result: false, message: message.error.common };
    }
  }

  public async setTheme(obj: any): Promise<CommonResponse> {
    try {
      Store.setItem(storageKey.theme, obj.theme);
      return { result: true, message: "" };
    } catch (error) {
      LOG.error(error);
      return { result: false, message: message.error.common };
    }
  }

  public async getTheme(): Promise<string> {
    try {
      return Store.getItem(storageKey.theme) || "";
    } catch (error) {
      LOG.error(error);
      return "";
    }
  }

  public async exportBackup(obj: any): Promise<CommonResponse> {
    try {
      const data = await this.getUsersData();
      const output = { data };
      await Fs.createFile(obj.outPath, output);
      return { result: true, message: message.success.bck };
    } catch (error) {
      LOG.error(error);
      return { result: false, message: message.error.common };
    }
  }

}
