import { CanActivate } from "@angular/router";
import { Injectable } from '@angular/core';

import { AuthService } from '../services/auth.service';

@Injectable()

export class RouteGuardApp implements CanActivate {

    constructor(private _auth: AuthService) { }

    public canActivate(): boolean {
        if (Object.keys(this._auth.get()).length > 0) {
            return true;
        } else {
            return false;
        }
    }
}