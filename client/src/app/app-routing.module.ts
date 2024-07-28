import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./component/auth/login/login.module").then(m => m.LoginModule)
  },
  {
    path: "signUp",
    loadChildren: () => import("./component/auth/sign-up/sign-up.module").then(m => m.SignUpModule)
  },
  {
    path: "dashboard",
    loadChildren: () => import("./component/dashboard/dashboard.module").then(m => m.DashboardModule)
  },
  {
    path: "calendar",
    loadChildren: () => import("./component/calendar/calendar.module").then(m => m.CalendarModule)
  },
  {
    path: "manage_ota",
    loadChildren: () => import("./component/manage-ota/manage-ota.module").then(m => m.ManageOtaModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
