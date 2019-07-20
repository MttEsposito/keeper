import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { SignInComponent } from './sign-in.component';
import { CreatePswDialog } from './dialog-create-password/create-password.component';

@NgModule({
  declarations: [
    SignInComponent,
    CreatePswDialog
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: SignInComponent
      }
    ])
  ],
  entryComponents: [CreatePswDialog],
})

export class SignInModule { }
