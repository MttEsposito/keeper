const ELECTRON_FILE_NAME = "electron_main.js";

const writeInfoLog = (message) => {
    console.log(`[${new Date().toISOString()}]   ${message}`);
}

const writeErrorLog = (error) => {
    console.error(error);
}

const init = () => {

    writeInfoLog("Setup js init");

    const action = process.argv[2];

    writeInfoLog(`Action called: ${action}`);

    switch (action) {
        case "--main":
            buildMain();
            break;
        case "--minify":
            minifyJs();
            break;
        default:
            writeErrorLog(`[${new Date().toISOString()}]   Wrong acton invoked`);
            break;
    }
}

const buildMain = async () => {

    writeInfoLog(`Build main invoked`);

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
    writeInfoLog(`Start concat file`);

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
            writeErrorLog(err)
        }
    }

    fileString.push("new Electron().electronStart();");

    const output = fileString.join("\n");

    const file = output.replace(/export/g, '');

    writeInfoLog(`Content file generated`);

    await fse.writeFile("bundle.js", file);

    writeInfoLog(`File created`);

    writeInfoLog(`End concat file`);

    writeInfoLog(`Build bundle succed!`);

    minifyJs();
}

const minifyJs = async () => {
    try {
        writeInfoLog(`Minify installer invoked`);

        const compressor = require('node-minify');

        writeInfoLog(`Start minify js`);

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

        writeInfoLog(`Minify done!`);

        writeInfoLog(`Output file keeper_electron_main.js generated`);

        writeInfoLog(`Removing old file`);

        const fse = require('fs-extra');

        let promises = [
            fse.remove("./bundle.js")
        ];

        await Promise.all(promises);

        writeInfoLog(`Old file removed`);

        writeInfoLog(`Setup js end`);

    } catch (error) {
        writeErrorLog(error)
    }
}

init();
