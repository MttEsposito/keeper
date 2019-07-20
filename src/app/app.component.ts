// IMPORTS
// ANGULAR CORE MODULES
import { Component, OnInit, NgZone } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// APP SERVICES
import { LoaderService } from '@keeperServices/loader.service';
import { AuthService } from '@keeperServices/auth.service';
import { ToastService } from '@keeperServices/toast.service';
import { ElectronService } from 'ngx-electron';

// APP ANIMATION ROUTES
import { fades } from './routes/routes.animations';
// ***************************

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fades]
})

export class AppComponent implements OnInit {

  constructor(
    private _loader: LoaderService,
    private _auth: AuthService,
    private _toast: ToastService,
    private _ngZone: NgZone,
    private _electron: ElectronService
  ) {
    // ELECTRON ASYNC EVENT RESPONSE
    this._electron.ipcRenderer.on('updateReadyToInstall', (event: any, arg: any) => {
      this._ngZone.run(() => {
        this._toast.openSnackbar("Update ready to install", "info", false, true);
      });
    });
    this._electron.ipcRenderer.on('getUserThemeReply', (event: any, theme: string) => {
      this._ngZone.run(() => {
        document.body.className = theme;
      });
    });
    // this._electron.ipcRenderer.on('updateMessage', (event: any, arg: any) => {
    //   this._ngZone.run(() => {
    //     console.log(arg)
    //   });
    // });
  }

  // VARIABLE FOR SHOW THE BAR LOADING ON TOP
  public isLoading: boolean = false;

  // ON INIT
  // BIND TO LOADING STATE EVENT
  // BIND TO USER SYSTEM INFO
  // GET AND SET THE USER SAVED THEME
  public ngOnInit(): void {
    this._loader.loading.subscribe(state => this.isLoading = state);
    this._auth.userSigned.subscribe();
    this._electron.ipcRenderer.send("getUserTheme", {});
  }

  // PREPARE ROUTER-OUTLET FOR ANIMATION
  public prepareOutlet(outlet: RouterOutlet): RouterOutlet {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}
