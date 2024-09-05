import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import { AppConstants } from 'src/app/constants/app.constant';
import { AlertService } from 'src/app/shared/alert.service';

@Component({
  selector: 'app-view-ota',
  templateUrl: './view-ota.component.html',
  styleUrls: ['./view-ota.component.scss']
})
export class ViewOtaComponent {

  propertyList:any=[];
  currentOtaDetail:any={};
  loader:boolean=false;
  showActionDropDown:any={};
  showDetailModal:boolean=false;
  propertyDetailsConfig:any={};
  showDeleteModal:boolean=false;
  currentPropertyId:any='';

  constructor(private _service:AdminService,private router:Router,public constant:AppConstants,private alert:AlertService){}

  ngOnInit(){
    this.currentOtaDetail = JSON.parse(<any>localStorage.getItem("current_ota_detail"));
    this.getPropertyListByOTAId();
  }

  importHotels(action:any){
    this.loader=true;
    const { url, auth, action_url } = this.constant.ota_api_url[this.currentOtaDetail.site_name];
    let fullUrl = `${url}/${action_url[action]['url']}`;
    let queryParamsForApi:any = action_url[action]['params'];
    
    if (queryParamsForApi) {
      Object.keys(queryParamsForApi).forEach(key => {
        if (queryParamsForApi[key]) {
          fullUrl += `${fullUrl.includes('?') ? '&' : '?'}${key}=${this.currentOtaDetail[key]}`;
        }
      });
    }
    
    let site_details:any = {
      site_name:this.currentOtaDetail.site_name,
      ota_id:this.currentOtaDetail.ota_id
    }
    
    
    this._service.getPropertyList({site_details,apiUrl:fullUrl,authType:auth},(res:any)=>{
      if(res.status == 200){
        this.loader=false;
        this.getPropertyListByOTAId();
        this.alert.alert("success",res.message,"Success",{displayDuration:2000,top});
      }else{
        this.loader=false;
        this.alert.alert("trash",res.error ? res.error.message : res.message,"Error",{displayDuration:2000,top});
      }
    })
  }

  getPropertyListByOTAId(){
    this.loader=true;
    this._service.getPropertyListByOTAId({ota_id:this.currentOtaDetail.ota_id},(res:any)=>{
      if(res.status == 200){
        console.log(res);
        this.propertyList = res.data;
        this.loader=false;
      }
    })
  }

  viewRoom(item:any){
    this.router.navigate(["view_room",item.property_id]);
    let localData:any = JSON.parse(<any>localStorage.getItem("current_ota_detail"));
    let addedPropertyId:any = {...localData,property_id:item.property_id,property_name:item.name};
    localStorage.setItem("current_ota_detail",JSON.stringify(addedPropertyId));
  }

  toggleDeleteModal(id:any){
      this.currentPropertyId = id;
      this.showDeleteModal=true;
  }

  closeModal(){
    this.showDeleteModal=false;
    this.showDetailModal=false;
  }

  backToManageOta(){
    this.router.navigate(['/manage_ota']);
  }

  showDetail(item:any){
    this.showDetailModal = true;
    this.propertyDetailsConfig = item;
    console.log(this.propertyDetailsConfig);
    
  }


  deleteProperty(){
    this._service.deleteProperty({id:this.currentPropertyId},(res:any)=>{
      if(res.status == 200){
         this.closeModal();        
         this.getPropertyListByOTAId();
         this.alert.alert("success",res.message,"Success",{displayDuration:2000,top});
        }else{
          this.alert.alert("trash",res.error ? res.error.message : res.message,"Error",{displayDuration:2000,top});
        }
    })
  }
}
