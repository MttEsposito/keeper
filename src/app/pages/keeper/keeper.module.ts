import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxElectronModule } from 'ngx-electron';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

import { KeeperComponent } from "./keeper.component";

@NgModule({
    declarations: [
        KeeperComponent,
    ],
    imports: [
        CommonModule,
        NgxElectronModule,
        MatSidenavModule,
        MatToolbarModule,
        MatDividerModule,
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
        RouterModule.forChild([{
                path:'',
                component: KeeperComponent,
                children:[
                    {
                        path: 'accounts',
                        loadChildren: "./accounts/accounts.module#AccountsModule"
                    },
                    {
                        path: 'settings',
                        loadChildren: "./settings/settings.module#SettingsModule"
                    },
                    { path: '', redirectTo: 'accounts', pathMatch: 'full' },
                    { path: '**', redirectTo: 'accounts' }
                ],
            },
        ])
    ]
})

export class KeeperModule { }
