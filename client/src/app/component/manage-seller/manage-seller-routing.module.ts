import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageSellerComponent } from './manage-seller.component';

const routes: Routes = [
  {
    path:'',
    component:ManageSellerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageSellerRoutingModule { }
