import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  loginObj:any = {};
  
  constructor (private _service:AuthService,private router:Router){}
  
  login(){
    this._service.login(this.loginObj,(res:any)=>{
      if(res){
        console.log(res);
        this.router.navigate(['dashboard'])
      }
    })
  }

}
