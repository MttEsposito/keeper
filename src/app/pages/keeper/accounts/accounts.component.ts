import { Component, OnInit, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ElectronService } from 'ngx-electron';

import { ActionsDialog } from "./dialog-actions/actions.component";

import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ToastService } from 'src/app/services/toast.service';
import { Accounts } from 'src/app/models/accounts.interface';

@Component({
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  constructor(
    private _dialog: MatDialog,
    private _electron: ElectronService,
    private _auth: AuthService,
    private _loader: LoaderService,
    private _ngZone: NgZone,
    private _toast: ToastService
  ) {
    this._electron.ipcRenderer.on('getDataReply', (event: any, arg: any) => {
      this._ngZone.run(() => {
        this._electronResponse(arg);
      });
    })
  }

  public hideAll: boolean = true;
  public accounts: Array<Accounts> = [];

  public ngOnInit(): void {
    this.getUserData();
  }

  public redirectTo(url: string): void {
    this._electron.shell.openExternal(url);
  }

  public openDialog(action: string, record: any): void {
    this._dialog.open(ActionsDialog, {
      width: '600px',
      disableClose: true,
      autoFocus: false,
      data: { action, record }
    }).afterClosed().subscribe(result => {
      if (result !== "cancel"){
        this.getUserData();
      }
    });
  }

  public getUserData(): void {
    this._loader.present();
    const user = this._auth.get();
    this._electron.ipcRenderer.send("getUserData", user);
  }

  private _electronResponse(res: any): void {
    this._loader.dismiss();
    this.accounts = res.data;
    if (!res.result){
      this._toast.show("Ups an error occurred, try again later", "danger");
    }
  }


}
