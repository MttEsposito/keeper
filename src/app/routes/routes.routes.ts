// IMPORTS
// ANGULAR CORE MODULES
import { Routes } from "@angular/router";

// GUARD
import { RouteGuardApp } from "./route.guard";
// ***************************

// APP ROUTES
const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', loadChildren: '../pages/sign-in/sign-in.module#SignInModule', data: { animation: 'signin' } },
  { path: 'keeper', loadChildren: '../pages/keeper/keeper.module#KeeperModule', canActivate: [RouteGuardApp], data: { animation: 'keeper' } },
  { path: '**', redirectTo: 'sign-in' }
];

export { routes };
