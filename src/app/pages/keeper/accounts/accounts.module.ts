import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ActionsDialog } from './dialog-actions/actions.component';
import { AccountsComponent } from './accounts.component';

@NgModule({
    declarations: [
        AccountsComponent,
        ActionsDialog
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatCardModule,
        MatListModule,
        MatDividerModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        RouterModule.forChild([
            {
                path: '',
                component: AccountsComponent
            }
        ])
    ],
    entryComponents: [ActionsDialog]
})

export class AccountsModule { }
