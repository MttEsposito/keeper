import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';

import { SettingsComponent } from './settings.component';

@NgModule({
    declarations: [
        SettingsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatCardModule,
        MatExpansionModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        RouterModule.forChild([
            {
                path: '',
                component: SettingsComponent
            }
        ])
    ]
})

export class SettingsModule { }
