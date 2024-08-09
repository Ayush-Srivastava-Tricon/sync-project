import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { AddReservationComponent } from './add-reservation.component';
import { AddReservationRoutingModule } from './add-reservation-routing.component';


@NgModule({
  declarations: [AddReservationComponent],
  imports: [
    CommonModule,
    AddReservationRoutingModule,
    FormsModule
  ],
  exports:[AddReservationComponent]
})
export class AddReservationModule { }
