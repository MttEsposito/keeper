import { Component, OnInit, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ElectronService } from 'ngx-electron';

import { MatDialogRef } from '@angular/material';

import { ToastService } from '../../../services/toast.service';
import { LoaderService } from 'src/app/services/loader.service';

import { CommonResponse } from 'src/app/models/response.interface';

@Component({
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})

export class CreateUserDialog implements OnInit {

  constructor(
    private _dialogRef: MatDialogRef<CreateUserDialog>,
    private _toast: ToastService,
    private _loader: LoaderService,
    private _electron: ElectronService,
    private _ngZone: NgZone,
  ) {
    this._electron.ipcRenderer.on('signUpReply', (event: any, arg: CommonResponse) => {
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

  public createUser(form: NgForm): void {
    this.submitted = true;
    this._loader.present();
    this._electron.ipcRenderer.send("signUp", form.value);
  }

  private _signUpReply(res: CommonResponse): void {
    this._loader.dismiss();
    if (res.result) {
      this._dialogRef.close();
      this._toast.show(res.message, "success");
    } else {
      this.submitted = false;
      this._toast.show(res.message, "danger");
    }
  }

}
