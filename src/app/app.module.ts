import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxElectronModule } from 'ngx-electron';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ToastService } from './services/toast.service';
import { ThemeService } from './services/theme.service';

import { AppComponent } from './app.component';
import { UpdateToastModule } from './shared/toast-update/update-toast.module';

import { AppRoutingModule } from "./routes/routes.module";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    UpdateToastModule,
    NgxElectronModule
  ],
  providers: [
    ToastService, 
    ThemeService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
