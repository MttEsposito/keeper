import { Component, OnInit, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ElectronService } from 'ngx-electron';

import { ActionsDialog } from './dialog-actions/actions.component';

import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ToastService } from 'src/app/services/toast.service';

import { Accounts } from 'src/app/models/accounts.interface';

import { GetDataResponse } from 'src/app/models/response.interface';
import { Actions } from 'src/app/models/action-buttons.interface';

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
    this._electron.ipcRenderer.on('getDataReply', (event: any, arg: GetDataResponse) => {
      this._ngZone.run(() => {
        this._electronResponse(arg);
      });
    })
  }

  public hideAll: boolean = true;
  public viewAcc: Array<Accounts> = [];
  private _accounts: Array<Accounts> = [];
  public readonly actions: Array<Actions> = [{
    icon: "delete",
    tooltip: "Delete",
    color: "warn",
    action: "Remove"
  }, {
    icon: "edit",
    tooltip: "Edit",
    color: "primary",
    action: "Edit"
  }, {
    icon: "language",
    tooltip: "Open website",
    color: "primary",
    action: "Redirect"
  }]

  public ngOnInit(): void {
    this.getUserData();
  }

  public getUserData(): void {
    this._loader.present();
    const user = this._auth.get();
    this._electron.ipcRenderer.send("getUserData", user);
  }

  public accountsActions(action: string, data: any): void {
    switch (action) {
      case "Add":
        this._openDialog(action, data);
        break;
      case "Edit":
        this._openDialog(action, data);
        break;
      case "Remove":
        this._openDialog(action, data);
        break;
      case "Redirect":
        this._redirectTo(data.link);
        break;
      default:
        console.error("Wrong action invoked");
        break;
    }
  }

  public filter(key: string): void {
    let acc: Array<Accounts> = this._accounts;
    acc = acc.filter(a => {
      const values: string = `${a.title},${a.desc}`.toLowerCase();
      if (values.includes(key.trim().toLocaleLowerCase())) {
        return a;
      }
    });
    this.viewAcc = acc;
  }

  private _redirectTo(url: string): void {
    this._electron.shell.openExternal(url);
  }

  private _openDialog(action: string, record: any): void {
    this._dialog.open(ActionsDialog, {
      width: '600px',
      disableClose: true,
      autoFocus: false,
      data: { action, record }
    }).afterClosed().subscribe(result => {
      if (result !== "cancel") {
        this.getUserData();
      }
    });
  }

  private _electronResponse(res: GetDataResponse): void {
    this._loader.dismiss();
    this._accounts = res.data;
    this.viewAcc = res.data;
    if (!res.result) {
      this._toast.show("Ups an error occurred", "danger");
    }
  }

}
