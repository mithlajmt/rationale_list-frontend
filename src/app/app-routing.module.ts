import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from './modules/shared/notfound/notfound.component';
import { Token } from '@angular/compiler';
import { LoginGuard } from './guards/login.guard';
import { TokenGuard } from './guards/token.guard';

const routes: Routes = [
  { path: 'auth', canActivate:[TokenGuard], loadChildren: () => import('./modules/auth/auth-routing.module').then(m => m.AuthRoutingModule) },
  { path: 'user',loadChildren: () => import('./modules/user/user-routing.module').then(m => m.UserRoutingModule) },
  { path: 'admin',loadChildren: () => import('./modules/admin/admin-routing.module').then(m => m.AdminRoutingModule) },
  { path: '', redirectTo: 'auth/register', pathMatch: 'full' }, // Optional: Redirect to register or default route
  { path: '**', component: NotfoundComponent } // Wildcard route for handling 404 pages
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
