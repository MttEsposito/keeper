const fse = require("fs-extra");

export class FsExtra {

    constructor() { }

    readFile(path, name) {
        return fse.readFile(`${path}/Keeper-bin/${name}`);
    }

    writeFile(path, name, data) {
        return fse.writeFile(`${path}/Keeper-bin/${name}`, data);
    }

    existFolder(path, name) {
        return fse.pathExists(`${path}/Keeper-bin/${name}`);
    }

    createFile(path, name) {
        return fse.createFile(`${path}/Keeper-bin/${name}`);
    }
}