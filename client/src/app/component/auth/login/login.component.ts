import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor (private _router:Router){}

  loginObj:any = {};
  loginArr:any = [];
  getFormSignUpValues(){

console.log(this.loginObj.email);

    let savedData = JSON.parse(<any>localStorage.getItem("signUp"))

    savedData.forEach((element:any)=>{
      
      if(this.loginObj.email == element.email && this.loginObj.password == element.password){
        this._router.navigate(["/login"])
      }else{
        console.log("user not found");
        
      }
    })
    
  }

}
