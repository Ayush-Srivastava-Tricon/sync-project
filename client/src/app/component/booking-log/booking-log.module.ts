import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingLogRoutingModule } from './booking-log-routing.module';
import { BookingLogComponent } from './booking-log.component';


@NgModule({
  declarations: [BookingLogComponent],
  imports: [
    CommonModule,
    BookingLogRoutingModule
  ],
  exports:[BookingLogComponent]
})
export class BookingLogModule { }
