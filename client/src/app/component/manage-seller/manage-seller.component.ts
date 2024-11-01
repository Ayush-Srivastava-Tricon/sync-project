import { Component } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { AdminService } from 'src/app/admin.service';
import { AlertService } from 'src/app/shared/alert.service';

@Component({
  selector: 'app-manage-seller',
  templateUrl: './manage-seller.component.html',
  styleUrls: ['./manage-seller.component.scss']
})
export class ManageSellerComponent {
  sellerForm: any
  showModal: any = false
  isEditModal: boolean = false;
  sellerList: any = [];
  loader: boolean = false;
  constructor(private adminService: AdminService,private _fb: FormBuilder,private alert:AlertService) {
    this.sellerForm = this._fb.group({
      name: [],
      user_name: [],
      password: [],
      website: [],
      ip_address: this._fb.array([
        this._fb.group({
          ip: []
        })
      ]),
      status: ['1']
    })

  }

  
  get getterIpAddress(){
    return this.sellerForm.get("ip_address") as FormArray
  }


  dynamicAddIp(){
    for(let i=0;i<3;i++){
      this.getterIpAddress.push(this._fb.group({
        ip: []
      }))
    }
  }

  ngOnInit() {
    this.fetchSellerList();
    this.dynamicAddIp();

  }

  fetchSellerList() {
    this.loader = true;
    this.adminService.getSellerList((res: any) => {
      if (res.status == 200) {
        this.loader = false;
        this.sellerList = res.data;
      } else {
        this.loader = false;

      }
    })
  }



  createNewSeller() {
    this.loader=true;
    this.adminService.savesellerlist(this.sellerForm.value, (res: any) => {
      if(res.status == 200){
        this.loader=false;
        this.fetchSellerList();
        this.showModal=false;
        this.alert.alert("success",res.message,"Success",{displayDuration:2000, pos: 'top'});
      }else{
        this.loader=false;
        this.alert.alert("trash",res.message,"Error",{displayDuration:2000, pos: 'top'});
      }
    })


  }
  hideModal() {
    this.showModal = true;
  }
  backToManageOta() {
    this.showModal = false;
  }


}
