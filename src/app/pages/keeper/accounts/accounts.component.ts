import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ElectronService } from 'ngx-electron';
import { MessageBoxOptions } from 'electron';

import { ActionsDialog } from "./dialog-actions/actions.component";

import { AuthService } from '@keeperServices/auth.service';
import { LoaderService } from '@keeperServices/loader.service';
import { ToastService } from '@keeperServices/toast.service';
import { TitleService } from '@keeperServices/title.service';

import { Accounts } from '@keeperModels/accounts.interface';
import { GetDataResponse } from '@keeperModels/response.interface';
import { Actions } from '@keeperModels/action-buttons.interface';

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
    private _toast: ToastService,
    private _title: TitleService
  ) {
    this._electron.ipcRenderer.on('getDataReply', (event: any, arg: GetDataResponse) => {
      this._ngZone.run(() => {
        this._electronResponse(arg);
      });
    });
  }

  // hidden file input reference
  @ViewChild('filterInput') public filterInput: ElementRef;

  public hideAll: boolean = false;
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
  }];

  public ngOnInit(): void {
    this._title.setTitle("Keeper-Accounts");
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
      if (values.includes(key.trim().toLowerCase())) {
        return a;
      }
    });
    this.viewAcc = acc;
  }

  public copyToClipboard(value: string): void {
    this._electron.clipboard.writeText(value);
  }

  private _redirectTo(url: string): void {
    this._electron.shell.openExternal(url)
      .catch(err => {
        const settings: MessageBoxOptions = {
          title: "error",
          type: "error",
          message: "Fail to open wrong url"
        };
        this._electron.remote.dialog.showMessageBox(settings);
      });
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
    const isKeyFiltered: string = this.filterInput.nativeElement.value;
    if (isKeyFiltered) {
      this.filter(isKeyFiltered);
    }
    if (!res.result) {
      this._toast.openSnackbar("Ups an error occurred", "danger", true, false);
    }
  }

}
