import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ElectronService } from 'ngx-electron';

import { LoaderService } from "./services/loader.service";
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { ToastService } from 'src/app/services/toast.service';

import { fades } from './routes/routes.animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [fades]
})

export class AppComponent implements OnInit {

  constructor(
    private _loader: LoaderService,
    private _auth: AuthService,
    private _theme: ThemeService,
    private _toast: ToastService,
    private _electron: ElectronService,
    private _ngZone: NgZone
  ) {
    this._electron.ipcRenderer.on('updateReadyToInstall', (event: any, arg: any) => {
      this._ngZone.run(() => {
        this._toast.showUpdateToast();
      });
    });

    // this._electron.ipcRenderer.on('updateMessage', (event: any, arg: any) => {
    //   this._ngZone.run(() => {
    //     console.log(arg)
    //   });
    // });
  }

  public isLoading: boolean = false;

  public ngOnInit(): void {
    this._loader.loading.subscribe(state => this.isLoading = state);
    this._auth.userSigned.subscribe(user => { });
    this._theme.defaultTheme();
  }

  public prepareOutlet(outlet: RouterOutlet): RouterOutlet {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}
