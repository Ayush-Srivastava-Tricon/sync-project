import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { AlertService } from 'src/app/shared/alert.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  signUpObj:any = {};


  constructor(private _service:AuthService,private alert:AlertService){

  }

  signUp(){
      this._service.signUp(this.signUpObj,(res:any)=>{
        if(res){
          this.alert.alert("success",res.message,"Success",{displayDuration:2000});
            this.signUpObj = {};
        }else{
          this.alert.alert("trash","Something went wrong","Error",{displayDuration:2000});
        }
      })
  }
 

}
