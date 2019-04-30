import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ElectronService } from 'ngx-electron';

import { LoaderService } from 'src/app/services/loader.service';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ToastService } from 'src/app/services/toast.service';

import { Themes } from 'src/app/models/themes.interface';

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {

  constructor(
    private _loader: LoaderService,
    private _electron: ElectronService,
    private _ngZone: NgZone,
    private _auth: AuthService,
    private _theme: ThemeService,
    private _toast: ToastService
  ) {
    this._electron.ipcRenderer.on('changePswReply', (event: any, arg: any) => {
      this._ngZone.run(() => {
        this._electronResponse(arg);
      });
    })
  }

  @ViewChild('cpassword') cpswForm: NgForm;

  public submitted: boolean = false;
  public pickedTheme: string = "";
  public hide: boolean = true;
  public themes: Array<Themes> = [{
    value: "",
    label: "Defalut-blue"
  }, {
    value: "dark-themes",
    label: "Dark-purple"
  }, {
    value: "light-blue-theme",
    label: "Light-blue"
  }];

  public ngOnInit(): void {
    this.pickedTheme = this._theme.getTheme();
    this.submitted = false;
  }

  public changePassword(form: NgForm): void {
    this.submitted = true;
    this._loader.present();
    const user = this._auth.get();
    const payload = { value: form.value, user };
    this._electron.ipcRenderer.send("changePassword", payload);
  }

  public changeTheme(): void {
    this._theme.changeTheme(this.pickedTheme);
  }

  private _electronResponse(res: any): void {
    this.cpswForm.resetForm();
    this.submitted = false;
    this._loader.dismiss();
    this._toast.show(res.message, res.result ? "success" : "danger");
  }

}
