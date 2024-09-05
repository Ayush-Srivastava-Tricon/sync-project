import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/alert.service';
import { ContentService } from 'src/app/shared/content.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-content',
  templateUrl: './manage-content.component.html',
  styleUrls: ['./manage-content.component.scss']
})
export class ManageContentComponent {
  contentData: any = {};
  selectedFile: any;
  imgBaseUrl: any = environment.baseurl;
  chooseFileHover: any = {
    home: false,
    about_us: false,
    our_belief: false,
    our_role: false,
    how_it_works: false
  };
  editConfig: any = {
    home: false,
    about_us: false,
    our_belief: false,
    our_role: false,
    how_it_works: false
  };
  selectedAboutUsFiles: any = {};
  selectedRoleImage: any;
  isEditManageContent:boolean=false;
  
  @ViewChild("aboutus") aboutus!: ElementRef;
  @ViewChild("contactus") contactus!: ElementRef;
  @ViewChild("home") home!: ElementRef;

  constructor(private contentService: ContentService, private alert: AlertService,private router:Router) { 
      this.isEditManageContent = this.router.url == '/manage_content';
      console.log(this.isEditManageContent);
      
  }

  ngOnInit(): void {
    this.loadContent();
  }

  editHome() {
    this.editConfig.home = !this.editConfig.home;
    if (!this.editConfig.home) {
      this.updateContent(this.contentData.home, 'home')
    }
  }

  getHomeContentData(subSection: any, event: any) {
    this.contentData['home'].content_data[subSection] = event.target.textContent;
  }

  loadContent() {
    this.contentService.getContent((res: any) => {
      if (res.status == 200) {
        this.seperateSectionData(res.data);
      }
    });
  }

  seperateSectionData(data: any) {
    const obj: any = {};
    for (let item of data) {
      if (!obj.hasOwnProperty(item.section)) {
        obj[item.section] = item;
      }
    }
    this.contentData = obj;
    console.log(this.contentData);

  }

  chooseHomeImg(event: any) {
    this.selectedFile = event.target.files[0];
  }


  updateContent(data: any, sectionName: any) {

    const formData: FormData = new FormData();
    formData.append('section', sectionName);
    formData.append('content', JSON.stringify(data));
    sectionName == 'our_role' ? this.selectedFile = this.selectedRoleImage : '';
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.contentService.updateContent(formData, (res: any) => {
      if (res.status == 200) {
        this.loadContent();
        this.alert.alert("success", res.message, "Success", { displayDuration: 2000, pos: 'top' })
      }

    })
  }

  editAboutUs() {
    this.editConfig.about_us = !this.editConfig.about_us;
    if (!this.editConfig.about_us) {
      this.updateAboutUsContent();
    }
  }

  onAboutUsFileSelected(event: any, index: any) {
    const file = event.target.files[0];
    this.selectedAboutUsFiles[`card_${index}_image_path`] = file;
  }

  getAboutContentData(card: any, event: any) {
    card.description = event.target.textContent;
  }

  updateAboutUsContent() {
    const formData = new FormData();
    console.log(this.selectedAboutUsFiles);

    if (this.selectedAboutUsFiles) {
      for (const key in this.selectedAboutUsFiles) {
        formData.append(key, this.selectedAboutUsFiles[key]);
      }
    }
    formData.append('cards', JSON.stringify(this.contentData.about_us.content_data));

    this.contentService.updateAboutUsContent(formData, (res: any) => {
      if (res.status == 200) {
        this.loadContent();
        this.alert.alert("success", res.message, "Success", { displayDuration: 2000, pos: 'top' })
      }

    })
  }

  editOurBelief() {
    this.editConfig.our_belief = !this.editConfig.our_belief;
    if (!this.editConfig.our_belief) {
      this.updateContent(this.contentData.our_belief, 'our_belief')
    }
  }

  getBeliefContentData(item: any, event: any) {
    item.item = event.target.textContent;
  }

  editOurRole() {
    this.editConfig.our_role = !this.editConfig.our_role;
    if (!this.editConfig.our_role) {
      this.updateContent(this.contentData.our_role, 'our_role')
    }
  }

  chooseOurRoleImg(event: any) {
    this.selectedRoleImage = event.target.files[0];
  }

  getRoleContentData(item: any, event: any) {
    item.item = event.target.textContent;
  }


  editHowItWorks() {
    this.editConfig.how_it_works = !this.editConfig.how_it_works;
    if (!this.editConfig.how_it_works) {
      this.updateContent(this.contentData.how_it_works, 'how_it_works')
    }
  }


  getHowitWorksContentData(item: any, event: any) {
    item.item = event.target.textContent;
  }

  editSiteTitle() {
    this.editConfig.site_title = !this.editConfig.site_title;
    if (!this.editConfig.site_title) {
      this.updateContent(this.contentData.site_title, 'site_title')
    }
  }


  getSiteTitleContentData(event: any) {
    this.contentData['site_title'].content_data.title = event.target.textContent;
  }
  editSiteEmail() {
    this.editConfig.site_email = !this.editConfig.site_email;
    if (!this.editConfig.site_email) {
      this.updateContent(this.contentData.site_email, 'site_email')
    }
  }

  getSiteEmailContentData(event: any) {
    this.contentData['site_email'].content_data.email = event.target.textContent;
  }

  openMail(emailTo: any) {
    console.log("sdfsdfns");
    location.href = "mailto:" + emailTo + '?subject=Query'
  }

  sendMail() {
    //SMTP request
  }

  focus(section: any) {
    let th:any =  this;
    th[section].nativeElement.scrollIntoView();

  }
}
