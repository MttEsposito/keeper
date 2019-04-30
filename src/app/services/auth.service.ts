import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from "../models/user.interface";

@Injectable({providedIn:"root"})

export class AuthService {

    private _user: BehaviorSubject<User> = new BehaviorSubject<User>({});

    public userSigned: Observable<User> = this._user.asObservable();

    constructor() { }

    public set(user: User): void {
        this._user.next(user);
    }

    public remove(): void {
        this._user.next(null);
    }

    public get(): any {
        return this._user.value || {};
    }

}
