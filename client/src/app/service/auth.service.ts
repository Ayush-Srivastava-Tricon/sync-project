import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {

  constructor(http:HttpClient) { 
    super(http);
  }

  login(param:any,callback:any){
    this.postData(param,this.httpUrls['login'],callback);
  }



  signUp(param:any,callback:any){
    this.postData(param,this.httpUrls['signup'],callback);
  }
}
