export default {
  input: 'dist/electron/main.js',
  output: {
    file: '../../main.js',
    format: 'cjs',
  },
  external: [
    'electron',
    'electron-log',
    'electron-updater',
    'node-notifier',
    'os',
    'crypto-js',
    'electron-store',
    'fs-extra'
  ]
};
