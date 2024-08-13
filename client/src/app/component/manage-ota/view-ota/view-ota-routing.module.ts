import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewOtaComponent } from './view-ota.component';

const routes: Routes = [
  {
    path:'',
    component:ViewOtaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewOtaRoutingModule { }
