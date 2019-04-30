import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxElectronModule } from 'ngx-electron';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { SignInComponent } from "./sign-in.component";
import { CreateUserDialog } from './dialog-create-user/create-user.component';

@NgModule({
    declarations: [
        SignInComponent,
        CreateUserDialog
    ],
    imports: [
        CommonModule,
        NgxElectronModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        FormsModule,
        RouterModule.forChild([
            {
                path:'',
                component: SignInComponent
            }
        ])
    ],
    entryComponents: [CreateUserDialog],
})

export class SignInModule { }
