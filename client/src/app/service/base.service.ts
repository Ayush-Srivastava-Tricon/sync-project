import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  httpUrls:any={
    'LOGIN':'http://localhost:3000/api/login',
    'SIGNUP':'http://localhost:3000/api/signup',
    'USER_LIST':'http://localhost:3000/api/getUsers',
    'ADD_OTA':'http://localhost:3000/api/addOta',
    'GET_OTA_LIST':'http://localhost:3000/api/getOta',


    //ADMIN//
    'IMPORT_PROPERTY_LIST_FROM_URL':'http://localhost:3000/api/get_property_list_and_save',
    'GET_PROPERTY_LIST':'http://localhost:3000/api/get_property_list',
    'GET_PROPERTY_LIST_BY_OTA':'http://localhost:3000/api/get_property_by_ota',
    'IMPORT_ROOM_LIST':'http://localhost:3000/api/get_room_list_and_save',
    'GET_ROOM_LIST_BY_PROPERTY':'http://localhost:3000/api/get_rooms_by_property_and_ota',
    'IMPORT_CALENDAR_DATA':'http://localhost:3000/api/import_calendar_data_and_save',
    'GET_CALENDAR_DATA':'http://localhost:3000/api/fetch_calendar_data_by_start_end_date',
    'CHECK_AVAILABLITY':'http://localhost:3000/api/check_room_availability',
    'GET_RESERVATION_LIST':'http://localhost:3000/api/get_reservation_list',
    'GET_BOOKING_LOG_LIST':'http://localhost:3000/api/get_booking_log',

  }

  constructor(public http:HttpClient) { }


  getData(d:any,url:any,callback:any){
    return this.http.get(url).subscribe((data:any)=>callback(<any>data),(error:any)=>callback(error.error));
  }

  postData(d:any,url:any,callback:any){
    return this.http.post(url,d).subscribe((data:any)=>callback(<any>data),(error:any)=>callback(error.error));
  }
  
}
