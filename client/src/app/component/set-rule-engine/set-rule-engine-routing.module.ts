import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetRuleEngineComponent } from './set-rule-engine.component';

const routes: Routes = [
  {
    path:'',
    component:SetRuleEngineComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetRuleEngineRoutingModule { }
