import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewRoomRoutingModule } from './view-room-routing.module';
import { ViewRoomComponent } from './view-room.component';


@NgModule({
  declarations: [ViewRoomComponent],
  imports: [
    CommonModule,
    ViewRoomRoutingModule
  ],
  exports:[ViewRoomComponent]
})
export class ViewRoomModule { }
