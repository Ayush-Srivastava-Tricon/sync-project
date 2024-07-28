import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(private router:Router,private _service:AuthService){}

  ngOnInit(){
    this.fetchUserList();
  }

  fetchUserList(){
    this._service.fetchUserList((res:any)=>{
      if(res){
        console.log(res);
        
      }
    })
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/'])
  }

}
