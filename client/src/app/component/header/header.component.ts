import { Component } from '@angular/core';
import { AdminService } from 'src/app/admin.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  isAdmin:boolean=false;

  constructor(private _service:AdminService){
    
  }

  ngOnInit(){
    this.isAdmin = JSON.parse(<any>localStorage.getItem("role")) == 'admin';
  }

  logOut(){
    localStorage.clear();
    window.location.href = "/";
  }
}
