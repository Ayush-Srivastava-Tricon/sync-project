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
  }

  constructor(public http:HttpClient) { }


  getData(d:any,url:any,callback:any){
    return this.http.get(url).subscribe((data:any)=>callback(<any>data));
  }

  postData(d:any,url:any,callback:any){
    return this.http.post(url,d).subscribe((data:any)=>callback(<any>data));
  }
  
}
