// IMPORTS
// ANGULAR CORE MODULES
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// IMPORT MODELS
import { User } from "@keeperModels/user.interface";
// ***************************

@Injectable({ providedIn: "root" })

export class AuthService {

  private _user: BehaviorSubject<User> = new BehaviorSubject<User>({});

  public userSigned: Observable<User> = this._user.asObservable();

  constructor() { }

  // SET THE USER ON LOGIN
  public set(user: User): void {
    this._user.next(user);
  }

  // REMOVE THE USER ON LOGOFF
  public remove(): void {
    this._user.next({});
  }

  // GET VALUE OF THE USER
  public get(): any {
    return this._user.value || {};
  }

}
