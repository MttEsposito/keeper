import { userInfo } from 'os';
import { User } from '../app/models/user.interface';

interface Const {
  user: User,
  storageKey: {
    accounts: string;
    psw: string;
    theme: string;
  },
  message: {
    success: {
      createPsw: string;
      addAcc: string;
      editAcc: string;
      delAcc: string;
      changePsw:string;
      bck:string;
    },
    error: {
      common: string;
      access: string;
      changePsw:string;
    }
  }
}

const CONST: Const = {
  user: userInfo(),
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
      bck:"Check folder for bck file (>◕ᴗ◕)>"
    },
    error: {
      common: "Ups something goes wrong (╥_╥)",
      access: "Wrong password !!! ლ(ಠ_ಠლ)",
      changePsw: "Password and confirm password not match ! ಠ_ಠ"
    }
  }

}

export const { user, storageKey, message } = CONST;
