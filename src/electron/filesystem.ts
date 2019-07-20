import { outputFile } from 'fs-extra';
import * as LOG from 'electron-log';

class FileSystem {

  constructor() { }

  public async createFile(path: string, data: any): Promise<boolean> {
    try {
      const now = new Date().toISOString().replace(/:/g, "-");
      const name = `Keeper-${now}.bck.json`;
      await outputFile(`${path}\\${name}`, JSON.stringify(data, null, " "));
      return true
    } catch (error) {
      LOG.error(error);
      return false;
    }
  }
}

export const Fs = new FileSystem();
