import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ElectronService } from 'ngx-electron';

import { MatDialog } from '@angular/material';

import { CreateUserDialog } from './dialog-create-user/create-user.component';

import { LoaderService } from 'src/app/services/loader.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

import { SignInResponse } from 'src/app/models/response.interface';

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
    private _auth: AuthService
  ) {
    this._electron.ipcRenderer.on('signReply', (event: any, arg: SignInResponse) => {
      this._ngZone.run(() => {
        this._singInReply(arg);
      });
    });
  }

  public submitted: boolean = false;

  public ngOnInit(): void {
    this.submitted = false;
  }

  public signInUser(form: NgForm): void {
    this.submitted = true;
    this._loader.present();
    this._electron.ipcRenderer.send("signIn", form.value);
  }

  public openDialog(): void {
    this._dialog.open(CreateUserDialog, {
      width: '600px',
      disableClose: true,
      autoFocus: false,
    });
  }

  private _singInReply(res: SignInResponse): void {
    this._loader.dismiss();
    if (res.result) {
      this._auth.set(res.user);
      this._router.navigate([`/keeper`]);
    } else {
      this.submitted = false;
      this._toast.show(res.message, "danger");
    }
  }
}
