import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  signUpObj:any = {};


  constructor(private _service:AuthService){

  }

  signUp(){
      this._service.signUp(this.signUpObj,(res:any)=>{
        if(res){
          console.log(res);
        }
      })
  }
 

}
