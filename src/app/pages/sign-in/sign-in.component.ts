import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ElectronService } from 'ngx-electron';

import { MatDialog } from '@angular/material';

import { CreatePswDialog } from './dialog-create-password/create-password.component';

import { LoaderService } from '@keeperServices/loader.service';
import { AuthService } from '@keeperServices/auth.service';
import { ToastService } from '@keeperServices/toast.service';
import { TitleService } from '@keeperServices/title.service';

import { AccessResponse } from '@keeperModels/response.interface';

@Component({
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})

export class SignInComponent implements OnInit {

  constructor(
    private _dialog: MatDialog,
    private _loader: LoaderService,
    private _toast: ToastService,
    private _electron: ElectronService,
    private _ngZone: NgZone,
    private _router: Router,
    private _auth: AuthService,
    private _title: TitleService,
  ) {
    this._electron.ipcRenderer.on('userExistReply', (event: any, arg: boolean) => {
      this._ngZone.run(() => {
        if (!arg) {
          this.userNotExist = true;
          this._openDialog();
        }
      });
    });
    this._electron.ipcRenderer.on('accessReply', (event: any, arg: AccessResponse) => {
      this._ngZone.run(() => {
        this._singInReply(arg);
      });
    });
  }

  public submitted: boolean = false;
  public userNotExist: boolean = false;

  public ngOnInit(): void {
    this._title.setTitle("Keeper-Access");
    this._electron.ipcRenderer.send("userExist", {});
  }

  public accessUser(form: NgForm): void {
      this.submitted = true;
      this._loader.present();
      this._electron.ipcRenderer.send("access", form.value);
  }

  private _openDialog(): void {
    this._dialog.open(CreatePswDialog, {
      width: '600px',
      disableClose: true,
      autoFocus: false,
    }).afterClosed().subscribe(c => this.userNotExist = false);
  }

  private _singInReply(res: AccessResponse): void {
    this._loader.dismiss();
    if (res.result) {
      this._auth.set(res.user);
      this._router.navigate([`/keeper`]);
    } else {
      this.submitted = false;
      this._toast.openSnackbar(res.message, "danger", true, false);
    }
  }
}
