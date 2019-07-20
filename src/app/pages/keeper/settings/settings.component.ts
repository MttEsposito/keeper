import { Component, OnInit, NgZone, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ElectronService } from 'ngx-electron';

import { LoaderService } from '@keeperServices/loader.service';
import { AuthService } from '@keeperServices/auth.service';
import { ToastService } from '@keeperServices/toast.service';
import { TitleService } from '@keeperServices/title.service';

import { Themes } from '@keeperModels/themes.interface';
import { Accordion } from '@keeperModels/accordion.interface';
import { CommonResponse } from '@keeperModels/response.interface';

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
    private _toast: ToastService,
    private _title: TitleService
  ) {
    this._electron.ipcRenderer.on('changePswReply', (event: any, arg: CommonResponse) => {
      this._ngZone.run(() => {
        this._electronResponse(arg);
      });
    });
    this._electron.ipcRenderer.on('changeThemeReply', (event: any, arg: CommonResponse) => {
      this._ngZone.run(() => {
        if (arg.result) {
          document.body.className = this.pickedTheme;
        }
      });
    });
    this._electron.ipcRenderer.on('getUserThemeReply', (event: any, arg: string) => {
      this._ngZone.run(() => {
        this.pickedTheme = arg;
      });
    });
    this._electron.ipcRenderer.on('exportFileReply', (event: any, arg: CommonResponse) => {
      this._ngZone.run(() => {
        this._saveBackup(arg);
      });
    });
  }

  // hidden file input reference
  @ViewChild('fileInput') public fileInput: ElementRef;
  // form reference
  @ViewChild('cpassword') public cpswForm: NgForm;
  // template reference
  @ViewChild('formCpassword') public formCpassword: TemplateRef<any>;
  @ViewChild('themePicker') public themePicker: TemplateRef<any>;
  @ViewChild('exportData') public exportData: TemplateRef<any>;

  public readonly formHint: string = "input must be 7 chars long";
  public submitted: boolean = false;
  public exportPathModel: any;
  public output: string = "";
  public pickedTheme: string = "";
  public hide: boolean = true;
  public readonly accordions: Array<Accordion> = [{
    title: "Change password",
    description: "Change password access of keeper",
    icon: "account_circle",
    contentId: "formCpassword"
  }, {
    title: "Change theme",
    description: "Change theme of keeper",
    icon: "brush",
    contentId: "themePicker"
  }, {
    title: "Export data",
    description: "Get a backup file of accounts",
    icon: "insert_drive_file",
    contentId: "exportData"
  }];
  public readonly themes: Array<Themes> = [{
    value: "",
    label: "Defalut-blue"
  }, {
    value: "dark-purple-theme",
    label: "Dark-purple"
  }, {
    value: "light-blue-theme",
    label: "Light-blue"
  }, {
    value: "light-grey-theme",
    label: "Light-grey"
  }];

  public ngOnInit(): void {
    this._title.setTitle("Keeper-Settings");
    this._electron.ipcRenderer.send("getUserTheme", {});
  }

  public changePassword(form: NgForm): void {
    this.submitted = true;
    this._loader.present();
    const payload = { value: form.value };
    this._electron.ipcRenderer.send("changePassword", payload);
  }

  public changeTheme(): void {
    this._electron.ipcRenderer.send("changeTheme", { theme: this.pickedTheme });
  }

  public pickerChange(event: any): void {
    this.output = event.target.files.length ? event.target.files[0].path : "";
  }

  public exportFile(): void {
    this.submitted = true;
    this._loader.present();
    this._electron.ipcRenderer.send("exportFile", { outPath: this.output });
  }

  private _electronResponse(res: CommonResponse): void {
    if (!res.message.includes("not match")) {
      this.cpswForm.resetForm();
    }
    this.submitted = false;
    this._loader.dismiss();
    this._toast.openSnackbar(res.message, res.result ? "success" : "danger", true, false);
  }
  private _saveBackup(res: CommonResponse): void {
    this.output = "";
    this.exportPathModel = "";
    this.submitted = false;
    this._loader.dismiss();
    this._toast.openSnackbar(res.message, res.result ? "success" : "danger", true, false);
  }

}
