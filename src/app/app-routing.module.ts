import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPassComponent } from './reset/reset-pass/reset-pass.component';
import { TweetListComponent } from './tweet-list/tweet-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { JwtGuard } from './services/jwt.guard';
import {ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';


const routes: Routes = [
  { 
    path:"" , 
    redirectTo: "/login",
    pathMatch:"full"
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: "login/register", 
    redirectTo: "register",
    pathMatch: "full"
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
   { 
    path: "login/forgotpassword", 
    redirectTo: "forgotpassword",
    pathMatch: "full"
  },
  { 
    path: 'forgotpassword', 
    component: ForgotpasswordComponent 
  },
  { 
    path: 'home', 
    component: NavbarComponent,
    canActivate:[JwtGuard],
    children : 
    [
      { 
        path:"" , 
        component: TweetListComponent,
        canActivate:[JwtGuard],
      },
      {
        path:"tweets/all",
        component: TweetListComponent,
        canActivate:[JwtGuard],
      },
      {
        path: "logout",
        redirectTo:"/login",
        pathMatch:"full"
        
      },
      { 
        path: 'user-list', 
        component: UserListComponent,
        canActivate:[JwtGuard],
      },
      { 
        path: 'passwordReset/:loginId', 
        component: ResetPassComponent,
        canActivate:[JwtGuard],
      },
    ]
  },
  { 
    path: 'home/user-list/nav',
    component: NavbarComponent,
    canActivate:[JwtGuard],
    children : 
    [
      { 
        path:"" , 
        component: TweetListComponent,
        canActivate:[JwtGuard],
      },
      {
        path:"tweets/:loginId",
        component: TweetListComponent,
        canActivate:[JwtGuard],
      },
      {
        path:"user-list/nav/tweets/:loginId",
        component: TweetListComponent,
        canActivate:[JwtGuard],
      },
      {
        path: "logout",
        redirectTo:"/login",
        pathMatch:"full"
        
      },
      { 
        path: 'user-list', 
        component: UserListComponent,
        canActivate:[JwtGuard],
      },
      { 
        path: 'passwordReset/:loginId', 
        component: ResetPassComponent,
        canActivate:[JwtGuard],
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
