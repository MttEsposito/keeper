import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';

import { AuthService } from 'src/app/services/auth.service';

import { User } from 'src/app/models/user.interface';
import { Section } from 'src/app/models/section.interface';

@Component({
  templateUrl: './keeper.component.html',
  styleUrls: ['./keeper.component.scss']
})
export class KeeperComponent implements OnInit {

  constructor(
    private _auth: AuthService,
    private _electron: ElectronService,
    private _ngZone: NgZone,
    private _route: Router
  ) {
    this._electron.ipcRenderer.on('versionReply', (event: any, arg: any) => {
      this._ngZone.run(() => {
        this.version = arg;
      });
    })
    this._electron.ipcRenderer.on('signOutReply', (event: any, arg: any) => {
      this._ngZone.run(() => {
        this._signOutRedirect();
      });
    })
  }

  public user: User;
  public version: string = "";
  public readonly sections: Array<Section> = [
    { label: "Accounts", icon: "person", link: "/keeper/accounts" },
    { label: "Settings", icon: "settings", link: "/keeper/settings" }
  ]

  public ngOnInit(): void {
    this.user = this._auth.get();
    this._getVersion();
  }

  public signOut(): void {
    this._electron.ipcRenderer.send("signOut", {});
  }

  private _signOutRedirect():void{
    this._auth.remove();
    this._route.navigate(["/sign-in"]);
  }

  private _getVersion(): void {
    this._electron.ipcRenderer.send("getVersion", {});
  }

}
