import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';
  isLoggedIn:boolean=false;

  constructor(private router: Router,private auth:AuthService) {
    console.log(232);
    
      router.events.forEach((event) => {
        if (event instanceof NavigationStart) {
          if ((event['url'] == '/login' || event.url == '/')) {
            this.isLoggedIn = false;
          } else if(this.auth.isUserAuthenticated()) {
                this.isLoggedIn = true;
          }else{
            this.isLoggedIn = false;
          }
        }
      });
    }

}
