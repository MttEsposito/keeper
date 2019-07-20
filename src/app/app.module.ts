// IMPORTS
// ANGULAR CORE MODULES
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// ELECTRON MODULE
import { NgxElectronModule } from 'ngx-electron';

// MATERIAL MODULE
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// APP COMPONENT
import { AppComponent } from './app.component';
import { SnackbarModule } from '@keeperShared/snackbar/snackbar.module';

// ROUTES MODULE
import { AppRoutingModule } from './routes/routes.module';
// ***************************

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
    SnackbarModule,
    NgxElectronModule
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
