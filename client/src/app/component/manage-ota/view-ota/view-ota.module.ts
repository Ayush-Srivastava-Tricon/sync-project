import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewOtaRoutingModule } from './view-ota-routing.module';
import { ViewOtaComponent } from './view-ota.component';


@NgModule({
  declarations: [ViewOtaComponent],
  imports: [
    CommonModule,
    ViewOtaRoutingModule
  ],
  exports:[ViewOtaComponent]
})
export class ViewOtaModule { }
