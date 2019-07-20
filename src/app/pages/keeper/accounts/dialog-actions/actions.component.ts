import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ElectronService } from 'ngx-electron';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { LoaderService } from '@keeperServices/loader.service';
import { ToastService } from '@keeperServices/toast.service';

import { CommonResponse } from '@keeperModels/response.interface';

@Component({
  selector: 'accounts-action-dialog',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})

export class ActionsDialog implements OnInit {

  constructor(
    private _dialogRef: MatDialogRef<ActionsDialog>,
    private _toast: ToastService,
    private _loader: LoaderService,
    private _electron: ElectronService,
    private _ngZone: NgZone,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this._electron.ipcRenderer.on('actionReply', (event: any, arg: CommonResponse) => {
      this._ngZone.run(() => {
        this._electronResponse(arg);
      });
    })
  }

  public hide: boolean = true;
  public title: string = "";
  public link: string = "";
  public username: string = "";
  public password: string = "";
  public desc: string = "";
  public submitted: boolean = false;

  public ngOnInit(): void {
    if (this.data.action === "Edit") {
      this._bindEditData(this.data.record);
    }
  }

  public actionSub(action: string, form: NgForm): void {
    this.submitted = true;
    this._loader.present();
    switch (action) {
      case "Add": {
        this._electron.ipcRenderer.send("addAccount", { value: form.value });
        break;
      }
      case "Edit": {
        const uid = this.data.record.uid;
        this._electron.ipcRenderer.send("editAccount", { value: form.value, uid });
        break;
      }
      case "Remove": {
        const uid = this.data.record.uid;
        this._electron.ipcRenderer.send("removeAccount", { uid });
        break;
      }
      default: {
        console.error("Wrong action invoked");
        break;
      }
    }
  }

  private _bindEditData(val: any): void {
    this.title = val.title;
    this.link = val.link;
    this.username = val.username;
    this.password = val.password;
    this.desc = val.desc;
  }

  private _electronResponse(res: CommonResponse): void {
    this._loader.dismiss();
    this._dialogRef.close();
    this._toast.openSnackbar(res.message, res.result ? "success" : "danger", true, false);
  }

}
