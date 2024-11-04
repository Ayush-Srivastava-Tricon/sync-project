import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class SellerService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  
  getOtaList(callback: any) {
    this.getData({}, this.httpUrls['GET_OTA_LIST'], callback);
  }

  
  getOtaListByUser(callback: any) {
    this.getData({}, this.httpUrls['GET_OTA_LIST_BY_USER'], callback);
  }
  
  addOtaUser(formData: any, callback: any) {
    this.postData(formData, this.httpUrls['ADD_OTA_BY_USER'], callback);
  }

  editOtaUser(formData: any, callback: any) {
    this.postData(formData, this.httpUrls['EDIT_OTA_BY_USER'], callback);
  }

  deleteOtaUser(params: any, callback: any) {
    this.postData(params, this.httpUrls['DELETE_OTA_BY_USER'], callback);
  }

  fetchCountry(callback:any){
    this.getData({},this.httpUrls['country'],callback)
  }

  fetchState(countryId:any,callback:any){
    return this.http.get(this.httpUrls['state']+"?country_id="+countryId).subscribe((data:any)=>{ callback(data) })
  }

  fetchCity(countryId:any,stateId:any,callback:any){
    return this.http.get(this.httpUrls['city']+"?country_id="+countryId+"&state_id="+stateId).subscribe((data:any)=>{ callback(data) })
}

}
