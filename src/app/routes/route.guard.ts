// IMPORTS
// ANGULAR CORE MODULES
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

// SERVICES
import { AuthService } from '@keeperServices/auth.service';
// ***************************

@Injectable()

export class RouteGuardApp implements CanActivate {

    constructor(private _auth: AuthService) { }

    // IF USER IS LOGGED GRANT ACCESS
    public canActivate(): boolean {
        if (Object.keys(this._auth.get()).length) {
            return true;
        } else {
            return false;
        }
    }
}
