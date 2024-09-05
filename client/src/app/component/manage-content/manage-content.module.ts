import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageContentRoutingModule } from './manage-content-routing.module';
import { ManageContentComponent } from './manage-content.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ManageContentComponent],
  imports: [
    CommonModule,
    ManageContentRoutingModule,
    FormsModule
  ],
  exports:[ManageContentComponent]
})
export class ManageContentModule { }
