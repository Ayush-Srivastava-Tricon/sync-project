import { Injectable } from '@angular/core';
import { BaseService } from './service/base.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  addOta(formData: any, callback: any) {
    this.postData(formData, this.httpUrls['ADD_OTA'], callback);
  }

  editOta(formData: any, callback: any) {
    this.postData(formData, this.httpUrls['EDIT_OTA'], callback);
  }

  deleteOta(params: any, callback: any) {
    this.postData(params, this.httpUrls['DELETE_OTA'], callback);
  }

  getOtaList(callback: any) {
    this.getData({}, this.httpUrls['GET_OTA_LIST'], callback);
  }

  getPropertyList(apiEndPoint: any, callback: any) {
    this.postData(apiEndPoint, this.httpUrls['IMPORT_PROPERTY_LIST_FROM_URL'], callback);
  }

  deleteProperty(params: any, callback: any) {
    this.postData(params, this.httpUrls['DELETE_PROPERTY'], callback);
  }

  getPropertyListByOTAId(params: any, callback: any) {
    this.postData(params, this.httpUrls['GET_PROPERTY_LIST_BY_OTA'], callback);
  }

  importRoomList(params: any, callback: any) {
    this.postData(params, this.httpUrls['IMPORT_ROOM_LIST'], callback);
  }

  getRoomListByOtaAndProperty(params: any, callback: any) {
    this.postData(params, this.httpUrls['GET_ROOM_LIST_BY_PROPERTY'], callback);
  }

  deleteRoom(params: any, callback: any) {
    this.postData(params, this.httpUrls['DELETE_ROOM'], callback);
  }

  importCalendarData(params: any, callback: any) {
    this.postData(params, this.httpUrls['IMPORT_CALENDAR_DATA'], callback);
  }


  fetchCalendarDataByStartEndDate(params:any,callback:any){
    this.postData(params,this.httpUrls['GET_CALENDAR_DATA'],callback)

  }

  checkAvailability(params:any,callback:any){
    this.postData(params,this.httpUrls['CHECK_AVAILABLITY'],callback)
    
  }
  
  getListOfReservation(callback:any){
    this.getData({}, this.httpUrls['GET_RESERVATION_LIST'], callback);
  }
  
  fetchBookingLog(callback:any){
    this.getData({}, this.httpUrls['GET_BOOKING_LOG_LIST'], callback);
  }
  
  addUser(params:any,callback:any){
    this.postData(params,this.httpUrls['ADD_USER'],callback)
  }
  
  fetchUserList(callback:any){
    this.getData({}, this.httpUrls['GET_USER_LIST'], callback);
  }
  
  editUser(params:any,callback:any){
    this.postData(params,this.httpUrls['EDIT_USER'],callback)
  }
  
  deleteUser(params:any,callback:any){
    this.postData(params,this.httpUrls['DELETE_USER'],callback)
  }










}
