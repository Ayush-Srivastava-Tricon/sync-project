import { Component, ViewChild } from '@angular/core';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { AdminService } from 'src/app/admin.service';
import { AppConstants } from 'src/app/constants/app.constant';
import { AlertService } from 'src/app/shared/alert.service';
import { MultiselectDropdownComponent } from 'src/app/shared/multiselect-dropdown/multiselect-dropdown.component';

@Component({
  selector: 'app-list-reservation',
  templateUrl: './list-reservation.component.html',
  styleUrls: ['./list-reservation.component.scss']
})
export class ListReservationComponent {

  loader: boolean = false;
  reservtionList: any = [];
  searchConfig: any = {
    "reservations_no": "",
    "reservation_status": [],
    "ota_details_id": null,
    "guest_email": "",
    "arrival_status": "3_days"
  };

  showDetailModal: boolean = false;
  guestDetailConfig: any = {};
  currentTab: string = 'booking';
  filteredReservation: any = [];
  searchFilterValue:any='';

  constructor(private adminService: AdminService, public constant: AppConstants, private alert: AlertService) {
  }

  ngOnInit() {
    this.getListOfReservation();
  }

  getListOfReservation() {
    this.loader = true;
    this.adminService.getListOfReservation((res: any) => {
      if (res.status == 200) {
        this.reservtionList = res.data;
        this.filteredReservation = [...this.reservtionList];
        this.loader = false;
      } else {
        this.loader = false;
      }
    })
  }

  showGuestDetail(guest: any) {
    console.log(guest);
    this.showDetailModal = true;
    this.guestDetailConfig = guest;
  }

  searchByFilter() {
    this.loader = true;
    if(this.searchFilterValue){
      this.filteredReservation = this.reservtionList.filter((ele:any)=>(ele.bookingRefId.includes(this.searchFilterValue)) || ele.contact.firstName.includes(this.searchFilterValue));
    }else{
      this.filteredReservation = this.reservtionList;
    }
      this.loader = false;
  }

  clearReservationStatus() {
    this.searchConfig['reservation_status'] = [];
    // this.multiselect?.clearSelectedValues();
  }

  clearAllFilter() {
    this.searchConfig = {
      "reservations_no": "",
      "reservation_status": [],
      "ota_details_id": null,
      "guest_email": "",
      "arrival_status": null
    };
    this.clearReservationStatus();
  }



  copyCode(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.alert.alert("success", "Reseration Code Copied", "Success", { displayDuration: 1000, pos: 'top' })
  }


}
