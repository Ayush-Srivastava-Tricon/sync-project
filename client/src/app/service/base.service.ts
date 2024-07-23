import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  httpUrls:any={
    'login':'http://localhost:3000/api/login',
    'signup':'http://localhost:3000/api/signup',
  }

  constructor(public http:HttpClient) { }


  getData(){

  }

  postData(d:any,url:any,callback:any){
    return this.http.post(url,d).subscribe((data:any)=>callback(<any>data));
  }
  
}
