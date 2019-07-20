import { Component, OnInit, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ElectronService } from 'ngx-electron';

import { MatDialogRef } from '@angular/material';

import { ToastService } from '@keeperServices/toast.service';
import { LoaderService } from '@keeperServices/loader.service';

import { CommonResponse } from '@keeperModels/response.interface';

@Component({
  selector:'create-password-dialog',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss']
})

export class CreatePswDialog implements OnInit {

  constructor(
    private _dialogRef: MatDialogRef<CreatePswDialog>,
    private _toast: ToastService,
    private _loader: LoaderService,
    private _electron: ElectronService,
    private _ngZone: NgZone,
  ) {
    this._electron.ipcRenderer.on('createPasswordReply', (event: any, arg: CommonResponse) => {
      this._ngZone.run(() => {
        this._signUpReply(arg);
      });
    });
  }

  public formHint: string = "input must be 7 chars long";

  public submitted: boolean = false;

  public ngOnInit(): void {
    this.submitted = false;
  }

  public async createPassword(form: NgForm):Promise<void> {
      this.submitted = true;
      this._loader.present();
      this._electron.ipcRenderer.send("createPassword", form.value);
  }

  private _signUpReply(res: CommonResponse): void {
    this._loader.dismiss();
    if (res.result) {
      this._dialogRef.close();
      this._toast.openSnackbar(res.message, "success", true, false);
    } else {
      this.submitted = false;
      this._toast.openSnackbar(res.message, "danger", true, false);
    }
  }

}
