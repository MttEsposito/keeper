// IMPORTS
// ANGULAR CORE MODULES
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// MATERIAL MODULE
import { MatButtonModule } from '@angular/material/button';

// APP COMPONENT
import { SnackbarComponent } from './snackbar.component';
// ***************************

@NgModule({
  declarations: [SnackbarComponent],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  entryComponents: [SnackbarComponent],
})

export class SnackbarModule { }
