import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ElectronService } from 'ngx-electron';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { LoaderService } from 'src/app/services/loader.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.scss']
})

export class ActionsDialog implements OnInit {

    constructor(
        private _dialogRef: MatDialogRef<ActionsDialog>,
        private _toast: ToastService,
        private _loader: LoaderService,
        private _electron: ElectronService,
        private _auth: AuthService,
        private _ngZone: NgZone,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this._electron.ipcRenderer.on('actionReply', (event: any, arg: any) => {
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
        this.submitted = false;
        if (this.data.action === "Edit") {
            this.bindEditData(this.data.record);
        }
    }

    public actionSub(action: string, form: NgForm): void {
        const user = this._auth.get();
        this.submitted = true;
        this._loader.present();
        switch (action) {
            case "Add": {
                this._electron.ipcRenderer.send("addAccount", { value: form.value, user });
                break;
            }
            case "Edit": {
                const uid = this.data.record.uid;
                this._electron.ipcRenderer.send("editAccount", { value: form.value, user, uid });
                break;
            }
            case "Remove": {
                const uid = this.data.record.uid;
                this._electron.ipcRenderer.send("removeAccount", { user, uid });
                break;
            }
            default: {
                console.error("Wrong action invoked");
                break;
            }
        }
    }

    private bindEditData(val: any): void {
        this.title = val.title;
        this.link = val.link;
        this.username = val.username;
        this.password = val.password;
        this.desc = val.desc;
    }

    private _electronResponse(res: any): void {
        this._loader.dismiss();
        this._dialogRef.close();
        this._toast.show(res.message, res.result ? "success" : "danger");
    }

}
