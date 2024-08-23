import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { AlertService } from 'src/app/shared/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  loginObj:any = {};
  
  constructor (private _service:AuthService,private router:Router,private alert:AlertService){}
  
  login(){
    this._service.login(this.loginObj,(res:any)=>{
      if(res.success){
        this.alert.alert("success",res.message,"Success",{ displayDuration: 1000, pos: 'top' });
        localStorage.setItem("isLoggedIn",JSON.stringify(true));
        localStorage.setItem("role",JSON.stringify(res.role));
        setTimeout(() => {
          window.location.href = "/#/manage_ota";
        }, 1000);
      }else{
        this.alert.alert("trash",res.message,"Error",{ displayDuration: 1000, pos: 'top' });
      }
    })
  }

}
