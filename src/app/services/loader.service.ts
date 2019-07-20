// IMPORTS
// ANGULAR CORE MODULES
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// ***************************

@Injectable({ providedIn: "root" })

export class LoaderService {

  private _loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public loading: Observable<boolean> = this._loader.asObservable();

  constructor() { }

  // SHOW THE LOADER
  public present(): void {
    this._loader.next(true);
  }

  // HIDE THE LOADER
  public dismiss(): void {
    this._loader.next(false);
  }

}
