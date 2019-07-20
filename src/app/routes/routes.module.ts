// IMPORTS
// ANGULAR CORE MODULES
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// ROUTES
import { routes } from './routes.routes';

// GUARD
import { RouteGuardApp } from "./route.guard";

// ***************************

@NgModule({
    imports: [RouterModule.forRoot(
        routes,
        {
          enableTracing: false,
          useHash: true,
        }
    )],
    providers: [RouteGuardApp],
    exports: [RouterModule]
})

export class AppRoutingModule { }
