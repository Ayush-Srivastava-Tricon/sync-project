import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./component/home/home.module").then(m => m.HomeModule)
  },
  {
    path: "login",
    loadChildren: () => import("./component/auth/login/login.module").then(m => m.LoginModule)
  },
  {
    path: "signUp",
    loadChildren: () => import("./component/auth/sign-up/sign-up.module").then(m => m.SignUpModule)
  },
  {
    path: "dashboard",
    loadChildren: () => import("./component/dashboard/dashboard.module").then(m => m.DashboardModule),
    canActivate:[AuthGuard]
  },
  {
    path: "view_calendar/:ota/:property_id/:room_id",
    pathMatch:'full',
    loadChildren: () => import("./component/calendar/calendar.module").then(m => m.CalendarModule),
    canActivate:[AuthGuard]
  },
  {
    path: "view_calendar",
    pathMatch:'full',
    loadChildren: () => import("./component/calendar/calendar.module").then(m => m.CalendarModule),
    canActivate:[AuthGuard]
  },
  {
    path: "add_reservation",
    loadChildren: () => import("./component/add-reservation/add-reservation.module").then(m => m.AddReservationModule),
    canActivate:[AuthGuard]
  },
  {
    path: "list_reservation",
    loadChildren: () => import("./component/list-reservation/list-reservation.module").then(m => m.ListReservationModule),
    canActivate:[AuthGuard]
  },
  {
    path: "manage_ota",
    loadChildren: () => import("./component/manage-ota/manage-ota.module").then(m => m.ManageOtaModule),
    canActivate:[AuthGuard]
  },
  {
    path: "manage_ota_user",
    loadChildren: () => import("./component/manage-ota-user/manage-ota-user.module").then(m => m.ManageOtaUserModule),
    canActivate:[AuthGuard]
  },
  {
    path: "booking_log",
    loadChildren: () => import("./component/booking-log/booking-log.module").then(m => m.BookingLogModule),
    canActivate:[AuthGuard]
  },
  {
    path:'view_property/:id',
    loadChildren:()=>import("./component/manage-ota/view-ota/view-ota.module").then(m=>m.ViewOtaModule),
    canActivate:[AuthGuard]
  },
  {
    path:'view_room/:id',
    loadChildren:()=>import("./component/manage-ota/view-room/view-room.module").then(m=>m.ViewRoomModule),
    canActivate:[AuthGuard]
  },
  {
    path:'manage_user',
    loadChildren:()=>import("./component/manage-user/manage-user.module").then(m=>m.ManageUserModule),
    canActivate:[AuthGuard]
  },
  {
    path:'manage_content',
    loadChildren:()=>import("./component/manage-content/manage-content.module").then(m=>m.ManageContentModule),
    canActivate:[AuthGuard]
  },
  {
    path:'manage_content/privacy_policy',
    loadChildren:()=>import("./component/manage-content/privacy-policy/privacy-policy.module").then(m=>m.PrivacyPolicyModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
