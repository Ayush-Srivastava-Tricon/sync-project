import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild("aboutus") aboutus!: ElementRef;
  @ViewChild("contactus") contactus!: ElementRef;

  constructor() { }

  focus(section: any) {
    section == 'aboutus' ? this.aboutus.nativeElement.scrollIntoView() : this.contactus.nativeElement.scrollIntoView();

  }

}
