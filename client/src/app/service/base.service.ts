import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  httpUrls:any={
    'LOGIN':'/login',
    'SIGNUP':'/signup',
    'USER_LIST':'/getUsers',
    'ADD_OTA':'/addOta',
    'EDIT_OTA':'/editOta',
    'DELETE_OTA':'/deleteOta',
    'GET_OTA_LIST':'/getOta',


    //ADMIN//
    'IMPORT_PROPERTY_LIST_FROM_URL':'/get_property_list_and_save',
    'GET_PROPERTY_LIST':'/get_property_list',
    'GET_PROPERTY_LIST_BY_OTA':'/get_property_by_ota',
    'DELETE_PROPERTY':'/delete_property',
    'IMPORT_ROOM_LIST':'/get_room_list_and_save',
    'DELETE_ROOM':'/delete_room',
    'GET_ROOM_LIST_BY_PROPERTY':'/get_rooms_by_property_and_ota',
    'IMPORT_CALENDAR_DATA':'/import_calendar_data_and_save',
    'GET_CALENDAR_DATA':'/fetch_calendar_data_by_start_end_date',
    'CHECK_AVAILABLITY':'/check_room_availability',
    'GET_RESERVATION_LIST':'/get_reservation_list',
    'GET_BOOKING_LOG_LIST':'/get_booking_log',
    'GET_USER_LIST':'/get_user_list',
    'ADD_USER':'/add_user',
    'EDIT_USER':'/edit_user',
    'DELETE_USER':'/delete_user',

  }

  constructor(public http:HttpClient) { }


  getData(d:any,url:any,callback:any){
    return this.http.get(environment.url+url).subscribe((data:any)=>callback(<any>data),(error:any)=>callback(error.error));
  }

  postData(d:any,url:any,callback:any){
    return this.http.post(environment.url+url,d).subscribe((data:any)=>callback(<any>data),(error:any)=>callback(error.error));
  }
  
}
