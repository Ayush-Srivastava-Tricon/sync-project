import { Injectable } from '@angular/core';
import { BaseService } from './service/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseService {

  constructor(http:HttpClient) {
    super(http);
   }

  addOta(formData: any,callback:any){
    this.postData(formData,this.httpUrls['ADD_OTA'],callback);
  }

  getOtaList(callback:any){
    this.getData({},this.httpUrls['GET_OTA_LIST'],callback);
  }
}
