import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ManageContentModule } from '../manage-content/manage-content.module';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ManageContentModule
  ],
  exports:[HomeComponent]
})
export class HomeModule { }
