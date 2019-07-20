// IMPORTS
// ANGULAR CORE MODULES
import { Injectable } from '@angular/core';

// MATERIAL MODULE
import { MatSnackBar } from '@angular/material';

// APP COMPONENT
import { SnackbarComponent } from '@keeperShared/snackbar/snackbar.component';
// ***************************

@Injectable({ providedIn: "root" })

export class ToastService {

  constructor(private _toast: MatSnackBar) { }

  // OPEN THE SNACKBAR FROM A COMPONENT
  public openSnackbar(message: string, style: string, needTime: boolean, isUpdate?: boolean): void {
    this._toast.openFromComponent(SnackbarComponent, {
      verticalPosition: "bottom",
      horizontalPosition: "left",
      panelClass: `toast-${style}`,
      duration: needTime ? 2500 : null,
      data: { message, isUpdate }
    }).afterDismissed().subscribe(s => {
      if (isUpdate)
        setTimeout(() => {
          this.openSnackbar("Update ready to install", "info", false, true);
        }, 600000)// re-show update every 10 minutes
    });
  }

}
