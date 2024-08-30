import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import { AppConstants } from 'src/app/constants/app.constant';
import { AlertService } from 'src/app/shared/alert.service';

@Component({
  selector: 'app-view-room',
  templateUrl: './view-room.component.html',
  styleUrls: ['./view-room.component.scss']
})
export class ViewRoomComponent {

  loader: boolean = false;
  roomList: any = [];
  showActionDropDown: any = {};
  currentOtaDetails: any = {};
  showDetailModal: boolean = false;
  roomDetailConfig: any = {};
  showDeleteModal: boolean = false;
  currentRoomId: any = '';

  constructor(private router: Router, public constant: AppConstants, private _service: AdminService, private alert: AlertService) {

  }

  ngOnInit() {
    this.currentOtaDetails = JSON.parse(<any>localStorage.getItem("current_ota_detail"));
    this.getRoomListByOtaAndProperty();
  }

  getRoomListByOtaAndProperty() {
    this._service.getRoomListByOtaAndProperty({ ota_id: this.currentOtaDetails.ota_id, property_id: this.currentOtaDetails.property_id }, (res: any) => {
      if (res.status == 200) {
        this.roomList = res.data;
      }
    })
  }

  importRoomList(action: any) {
    this.loader = true;
    const { url, auth, action_url } = this.constant.ota_api_url[this.currentOtaDetails.site_name];
    let fullUrl = `${url}/${action_url[action]['url']}`;
    let queryParamsForApi: any = action_url[action]['params'];

    if (queryParamsForApi) {
      Object.keys(queryParamsForApi).forEach(key => {
        if (queryParamsForApi[key]) {
          fullUrl += `${fullUrl.includes('?') ? '&' : '?'}${key}=${this.currentOtaDetails[key]}`;
        }
      });
    }

    let site_details: any = {
      site_name: this.currentOtaDetails.site_name,
      ota_id: this.currentOtaDetails.ota_id,
      property_id: this.currentOtaDetails.property_id
    }

    this._service.importRoomList({ site_details, apiUrl: fullUrl, authType: auth }, (res: any) => {
      if (res.status == 200) {
        this.getRoomListByOtaAndProperty();
        this.loader = false;
        this.alert.alert("success", res.message, "Success", { displayDuration: 2000, top });
      } else {
        this.loader = false;
        this.alert.alert("trash", res.error ? res.error.message : res.message, "Error", { displayDuration: 2000, top });
      }
    })
  }

  toggleDeleteModal(id: any) {
    this.currentRoomId = id;
    this.showDeleteModal = true;
  }

  viewCalendar(item: any) {
    let localData: any = JSON.parse(<any>localStorage.getItem("current_ota_detail"));
    let startDate: any = this.formatDate(new Date());

    let addedPropertyId: any = { ...localData, room_id: item.room_id, room_name: item.name, accom_id: item.room_id, rate_id: item.rate_id, from: startDate, occupancy: 1 };
    localStorage.setItem("current_ota_detail", JSON.stringify(addedPropertyId));
    this.router.navigate(['/view_calendar', this.currentOtaDetails.site_name, item.property_id, item.room_id]);
  }

  backToManageProperty() {
    this.router.navigate(['/view_property', this.currentOtaDetails.ota_id]);
  }


  showDetails(item: any) {
    this.showDetailModal = true;
    this.roomDetailConfig = item;
    console.log(this.roomDetailConfig);

  }

  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  closeModal() {
    this.showDeleteModal = false;
    this.showDetailModal = false;
  }
  
  deleteRoom(){
    this._service.deleteRoom({id:this.currentRoomId},(res:any)=>{
      if(res.status == 200){
         this.closeModal();        
         this.getRoomListByOtaAndProperty();
         this.alert.alert("success",res.message,"Success",{displayDuration:2000,top});
        }else{
          this.alert.alert("trash",res.error ? res.error.message : res.message,"Error",{displayDuration:2000,top});
        }
    })
  }

}
