import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetRuleEngineRoutingModule } from './set-rule-engine-routing.module';
import { SetRuleEngineComponent } from './set-rule-engine.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [SetRuleEngineComponent],
  imports: [
    CommonModule,
    SetRuleEngineRoutingModule,
    FormsModule
  ],
  exports:[SetRuleEngineComponent]
})
export class SetRuleEngineModule { }
