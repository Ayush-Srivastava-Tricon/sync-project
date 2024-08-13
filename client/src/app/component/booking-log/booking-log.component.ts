import { Component } from '@angular/core';
import { AdminService } from 'src/app/admin.service';

@Component({
  selector: 'app-booking-log',
  templateUrl: './booking-log.component.html',
  styleUrls: ['./booking-log.component.scss']
})
export class BookingLogComponent {

  bookingLog:any=[];
  loader:boolean=false;

  constructor(private _service:AdminService){

  }

  ngOnInit(){
    this.fetchBookingLog();
    console.log(23);
    
  }

  fetchBookingLog(){
    this._service.fetchBookingLog((res:any)=>{
      if(res.status == 200 ){
        this.bookingLog = res.data;
        console.log(this.bookingLog);
        
      }
    })
  }

}
