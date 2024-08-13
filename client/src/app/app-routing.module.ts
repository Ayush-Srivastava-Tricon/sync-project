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
    path: "view_calendar/:ota/:property_id/:room_id",
    loadChildren: () => import("./component/calendar/calendar.module").then(m => m.CalendarModule)
  },
  {
    path: "view_calendar",
    loadChildren: () => import("./component/calendar/calendar.module").then(m => m.CalendarModule)
  },
  {
    path: "add_reservation",
    loadChildren: () => import("./component/add-reservation/add-reservation.module").then(m => m.AddReservationModule)
  },
  {
    path: "list_reservation",
    loadChildren: () => import("./component/list-reservation/list-reservation.module").then(m => m.ListReservationModule)
  },
  {
    path: "manage_ota",
    loadChildren: () => import("./component/manage-ota/manage-ota.module").then(m => m.ManageOtaModule)
  },
  {
    path: "booking_log",
    loadChildren: () => import("./component/booking-log/booking-log.module").then(m => m.BookingLogModule)
  },
  {
    path:'view_property/:id',
    loadChildren:()=>import("./component/manage-ota/view-ota/view-ota.module").then(m=>m.ViewOtaModule)
  },
  {
    path:'view_room/:id',
    loadChildren:()=>import("./component/manage-ota/view-room/view-room.module").then(m=>m.ViewRoomModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
