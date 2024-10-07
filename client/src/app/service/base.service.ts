import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  httpUrls:any={
    'LOGIN':'/login',
    'SIGNUP':'/signup',
    'ADD_OTA':'/addOta',
    'EDIT_OTA':'/editOta',
    'DELETE_OTA':'/deleteOta',
    'GET_OTA_LIST':'/getOta',
    'GET_OTA_LIST_BY_USER':'/getOtaByUser',
    'ADD_OTA_BY_USER':'/addOtaUser',
    'EDIT_OTA_BY_USER':'/editOtaUser',
    'DELETE_OTA_BY_USER':'/deleteOtaUser',


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
    'GET_ALL_CALENDAR_DATA':'/fetch_all_calendar_data',
    'CHECK_AVAILABLITY':'/check_room_availability',
    'GET_RESERVATION_LIST':'/get_reservation_list',
    'GET_BOOKING_LOG_LIST':'/get_booking_log',
    'GET_USER_LIST':'/get_user_list',
    'ADD_USER':'/add_user',
    'EDIT_USER':'/edit_user',
    'DELETE_USER':'/delete_user',

    //Content
    'GET_CONTENT':"/get_content",
    'UPDATE_CONTENT':"/update_content",
    'UPDATE_ABOUT_US_CONTENT':"/update_content/about_us",
    'SEND_MAIL':"/contact_mail",


  }

  constructor(public http:HttpClient) { }

  getTokenFromLocal() {
    let token = localStorage.getItem("token");
    return token;
  }

  handleRefreshToken(callback: any) {
    let refreshToken: any = localStorage.getItem("refreshToken");
    let role:any = localStorage.getItem("role");
    let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', `Bearer ${refreshToken}`)


    return this.http.post(environment.url+"/refreshToken",{refreshToken,role},{ headers: headers }).subscribe((data: any) => callback(<any>data));

  }


  getData(d:any,url:any,callback:any){
    let headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Authorization', `Bearer ${this.getTokenFromLocal()}`)

    return this.http.get(environment.url+url,{headers}).subscribe((data:any)=>{ callback(data) },
    (error: any) => {
      console.log(error)
      if (error.error.status == 500) {
        this.handleRefreshToken((res: any) => {
          if (res.status == 200) {
            this.setTokenIntoLocal(res.data)
            this.getData(d, url, callback);
          }
        });
      }
      if (error) {
        callback(error);
      }
    })

  }

  postData(d:any,url:any,callback:any){
    let headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('content-type', 'multipart/form-data')
    .set('Access-Control-Allow-Origin', '*')
    .set('Authorization', `Bearer ${this.getTokenFromLocal()}`);

    if (d instanceof FormData) {
      // FormData does not need Content-Type header
      headers = headers.delete('Content-Type');
  } else {
      headers = headers.set('Content-Type', 'application/json');
  }

    return this.http.post(environment.url+url,d,{headers}).subscribe((data:any)=>{ callback(data) },
    (error: any) => {
      console.log(error)
      if (error.error.status == 498) {
        this.handleRefreshToken((res: any) => {
          if (res.status == 200) {
            this.setTokenIntoLocal(res.data)
            this.postData(d, url, callback);
          }
        });
      }
      if (error) {
        callback(error);
      }
    })
  }

  setTokenIntoLocal(data:any){
    localStorage.setItem("token",data.token);
    localStorage.setItem("refreshToken",data.refreshToken);
    localStorage.setItem("role",data.role);
    localStorage.setItem("user_id",data.user_id);
}
  
}
