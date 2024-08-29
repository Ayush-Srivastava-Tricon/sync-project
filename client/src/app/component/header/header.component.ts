import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import { AlertService } from 'src/app/shared/alert.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  isAdmin:boolean=false;

  constructor(private alert:AlertService,private router: Router){
    
  }

  ngOnInit(){
    this.isAdmin = localStorage.getItem("role") == 'admin';
  }

  logOut(){
    localStorage.clear();
    this.router.navigateByUrl('/login');
    this.alert.alert("trash","Logged Out","Success",{displayDuration:2000,pos: 'top'});
  }
}
