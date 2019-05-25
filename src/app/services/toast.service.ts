import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { UpdateToastComponent } from '../shared/toast-update/update-toast.component';

@Injectable({ providedIn: "root" })

export class ToastService {

    constructor(private _toast: MatSnackBar) { }

    public show(message: string, style: string): void {
        this._toast.open(message, "close", {
            verticalPosition: "bottom",
            horizontalPosition: "left",
            panelClass: `toast-${style}`,
            duration: 2500
        });
    }

    public showUpdateToast(): void {
        this._toast.openFromComponent(UpdateToastComponent, {
            verticalPosition: "bottom",
            horizontalPosition: "left",
            panelClass: `toast-info`,
            duration: null
        }).afterDismissed().subscribe(r => {
            setTimeout(() => {
                this.showUpdateToast();
            }, 600000)// re-show update every 10 minutes
        });
    }

}
