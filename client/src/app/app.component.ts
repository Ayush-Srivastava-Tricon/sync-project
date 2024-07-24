import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';
  isLoggedIn:boolean=false;

  ngOnInit(){
   this.isLoggedIn =  JSON.parse(<any>localStorage.getItem("isLoggedIn"));
  }
}
