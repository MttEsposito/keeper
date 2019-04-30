const cryptoJs = require('crypto-js');

export class CryptoJs {

    constructor() { }

    encryptData(data, password) {
        return cryptoJs.AES.encrypt(data, password);
    }

    decryptData(data, password) {
        const decrypted = cryptoJs.AES.decrypt(data, password);
        return decrypted.toString(cryptoJs.enc.Utf8);
    }

    stringToMd5(string) {
        return cryptoJs.MD5(string).toString();
    }

}