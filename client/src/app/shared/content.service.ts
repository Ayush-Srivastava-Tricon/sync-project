import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../service/base.service';

@Injectable({
  providedIn: 'root'
})

export class ContentService extends BaseService {

  constructor(http:HttpClient) { 
    super(http);
  }

  getContent(callback:any) {
    this.getData({},this.httpUrls['GET_CONTENT'],callback);
  }

  updateContent(formData:any,callback:any) {
    this.postData(formData,this.httpUrls['UPDATE_CONTENT'],callback);
  }

  updateAboutUsContent(formData:any,callback:any) {
    this.postData(formData,this.httpUrls['UPDATE_ABOUT_US_CONTENT'],callback);
  }

  sendMail(params:any,callback:any){
    this.postData(params,this.httpUrls['SEND_MAIL'],callback);
  }
}
