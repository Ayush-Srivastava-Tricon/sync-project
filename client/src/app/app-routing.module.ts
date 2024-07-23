import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "login",
    loadChildren: () => import("./component/auth/login/login.module").then(m => m.LoginModule)
  },
  {
    path: "signUp",
    loadChildren: () => import("./component/auth/sign-up/sign-up.module").then(m => m.SignUpModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
