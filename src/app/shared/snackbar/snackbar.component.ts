// IMPORTS
// ANGULAR CORE MODULES
import { Component, Inject } from '@angular/core';

// MATERIAL MODULE
import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';

// ELECTRON MODULE
import { ElectronService } from 'ngx-electron';

// ***************************

@Component({
  selector:'snack-bar-content',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})

export class SnackbarComponent {

  constructor(
    public toast: MatSnackBar,
    private _electron: ElectronService,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) { }

  // SEND EVENT QUIT AND INSTALL TO ELECTRON
  public installUpdate(): void {
    this._electron.ipcRenderer.send("quitAndUpdate", {});
    const settings: any = {
      title: "error",
      type: "error",
      message: "Test 2"
    };
    this._electron.remote.dialog.showMessageBox(settings);
  }

}
