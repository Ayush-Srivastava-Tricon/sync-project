import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageContentComponent } from './manage-content.component';

const routes: Routes = [
  {
    path:'',
    component:ManageContentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageContentRoutingModule { }
