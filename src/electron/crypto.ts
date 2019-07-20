import { AES, MD5, enc } from 'crypto-js';

class CryptoJs {

  constructor() { }

  public encryptData(data: string, password: string): string {
    return AES.encrypt(data, password).toString();
  }

  public decryptData(data: string, password: string): string {
    const decrypted = AES.decrypt(data, password);
    return decrypted.toString(enc.Utf8);
  }

  public stringToMd5(word: string): string {
    return MD5(word).toString();
  }

}

export const Crypto = new CryptoJs();
