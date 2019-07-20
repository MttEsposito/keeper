import * as ElectronStore from 'electron-store';

class Storage {

  constructor() { }

  private _storage: ElectronStore<any> = new ElectronStore();

  public getItem(key: string): any {
    return this._storage.get(key);
  }

  public setItem(key: string, value: any): void {
    this._storage.set(key, value);
  }

  public itemExist(key: string): boolean {
    return this._storage.has(key);
  }

  // public clearAll(): void {
  //   this._storage.clear();
  // }

}

export const Store = new Storage();
