import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRuleEngineRoutingModule } from './manage-rule-engine-routing.module';
import { ManageRuleEngineComponent } from './manage-rule-engine.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ManageRuleEngineComponent],
  imports: [
    CommonModule,
    ManageRuleEngineRoutingModule,
    FormsModule
  ],
  exports:[ManageRuleEngineComponent]
})
export class ManageRuleEngineModule { }
