import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageSellerRoutingModule } from './manage-seller-routing.module';
import { ManageSellerComponent } from './manage-seller.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ManageSellerComponent],
  imports: [
    CommonModule,
    ManageSellerRoutingModule,
ReactiveFormsModule

  ],
  exports:[ManageSellerComponent]
})
export class ManageSellerModule { }
