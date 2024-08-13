import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewRoomComponent } from './view-room.component';

const routes: Routes = [
  {
    path:'',
    component:ViewRoomComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoomRoutingModule { }
