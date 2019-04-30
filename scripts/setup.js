const ELECTRON_FILE_NAME = "electron_main.js";
class Setup {

    constructor() {
        this.init();
    }

    writeInfoLog(message) {
        console.log(`[${new Date().toISOString()}]   ${message}`);
    }

    writeErrorLog(error) {
        console.error(error);
    }

    init() {

        this.writeInfoLog("Setup js init");

        const action = process.argv[2];

        this.writeInfoLog(`Action called: ${action}`);

        switch (action) {
            case "--main":
                this.buildMain();
                break;
            case "--minify":
                this.minifyJs();
                break;
            default:
                this.writeErrorLog(`[${new Date().toISOString()}]   Wrong acton invoked`);
                break;
        }
    }

    async buildMain() {
        try {
            this.writeInfoLog(`Build main invoked`);

            const fse = require('fs-extra');

            const libriaries = `
const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require("electron-updater");
const cryptoJs = require("crypto-js");
const fse = require("fs-extra");
const { homedir,type,platform } = require('os');
const { WindowsToaster } = require("node-notifier");
const LOG = require('electron-log');
`;
            this.writeInfoLog(`Start concat file`);

            let fileString = [];

            const files = [
                `${__dirname}/../src/electron/constants.js`,
                `${__dirname}/../src/electron/main.js`,
                `${__dirname}/../src/electron/events.js`,
                `${__dirname}/../src/electron/fs-extra.js`,
                `${__dirname}/../src/electron/crypto.js`
            ];

            fileString.push(libriaries);

            for (const f of files) {
                try {
                    const content = await fse.readFile(f, 'utf8')
                    if (content.includes("class")) {
                        fileString.push(content.substring(content.indexOf("class")));
                    } else {
                        const initCut = content.indexOf("export") + 6;
                        fileString.push(content.substring(initCut));
                    }
                } catch (err) {
                    this.writeErrorLog(err)
                }
            }

            fileString.push("new Electron().electronStart();");

            const output = fileString.join("\n");

            const file = output.replace(/export/g, '');

            this.writeInfoLog(`Content file generated`);

            await fse.writeFile("bundle.js", file);

            this.writeInfoLog(`File created`);

            this.writeInfoLog(`End concat file`);

            this.writeInfoLog(`Build bundle succed!`);

            this.minifyJs();
        } catch (err) {
            this.writeErrorLog(err)
        }
    }

    async minifyJs() {
        try {
            this.writeInfoLog(`Minify installer invoked`);

            const compressor = require('node-minify');

            this.writeInfoLog(`Start minify js`);

            const babel = {
                compressor: "babel-minify",
                input: `bundle.js`,
                output: ELECTRON_FILE_NAME,
                options: {
                    babelrc: 'scripts/.babelrc',
                    presets: ["minify"]
                },
            };

            await compressor.minify(babel);

            this.writeInfoLog(`Minify done!`);

            this.writeInfoLog(`Output file ${ELECTRON_FILE_NAME} generated`);

            this.writeInfoLog(`Removing old file`);

            const fse = require('fs-extra');

            let promises = [
                fse.remove("./bundle.js")
            ];

            await Promise.all(promises);

            this.writeInfoLog(`Old file removed`);

            this.writeInfoLog(`Setup js end`);

        } catch (err) {
            this.writeErrorLog(err)
        }
    }
}

new Setup();