import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NgxElectronModule } from 'ngx-electron';

import { UpdateToastComponent } from './update-toast.component';

@NgModule({
  declarations: [UpdateToastComponent],
  imports: [
    CommonModule,
    NgxElectronModule,
    MatButtonModule
  ],
  entryComponents: [UpdateToastComponent],
})

export class UpdateToastModule { }
