import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  signUpObj:any = {};
  signUpArr:any = []
  getFormSignUpValues(){
this.signUpArr.push(this.signUpObj)

    localStorage.setItem("signUp",JSON.stringify(this.signUpArr))
    
  }

}
