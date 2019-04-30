import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ElectronService } from 'ngx-electron';

@Component({
  templateUrl: './update-toast.component.html',
  styleUrls: ['./update-toast.component.scss'],
})

export class UpdateToastComponent {

  constructor(
    private _toast: MatSnackBar,
    private _electron: ElectronService,
    ) { }

  public installUpdate():void{
    this._electron.ipcRenderer.send("quitAndUpdate", {});
  }

  public remindLater(): void {
    this._toast.dismiss();
  }

}
