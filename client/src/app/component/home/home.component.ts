import { Component, ElementRef, ViewChild } from '@angular/core';
import { ManageContentComponent } from '../manage-content/manage-content.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild(ManageContentComponent) child!:ManageContentComponent;

  constructor() { }

  focus(section: any) {
  this.child.focus(section);

  }

}
