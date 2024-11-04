import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageRuleEngineComponent } from './manage-rule-engine.component';

const routes: Routes = [
  {
    path:'',
    component:ManageRuleEngineComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRuleEngineRoutingModule { }
