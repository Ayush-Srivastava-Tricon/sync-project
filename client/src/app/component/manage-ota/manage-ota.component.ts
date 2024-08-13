import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import { AlertService } from 'src/app/shared/alert.service';

@Component({
  selector: 'app-manage-ota',
  templateUrl: './manage-ota.component.html',
  styleUrls: ['./manage-ota.component.scss']
})
export class ManageOtaComponent {

  loader: boolean = false;
  otaList: any = [];
  showActionDropDown: any = {};
  showModal: any = {};
  otaModal: any;
  isEditModal: boolean = false;
  formData: any = new FormData();
  currentOtaId: number = 0;
  siteIcon: any = '';
  siteIconFile: any = '';

  siteIconPathBaseUrl: any = "http://localhost:3000";
  constructor(private alert: AlertService, private fb: FormBuilder, private _adminService: AdminService,private router:Router) {
    this.otaModal = this.fb.group(
      {
        site_name: ['', Validators.required],
        site_icon: [''],
        site_endpoint: ['', Validators.required],
        site_user: ['', Validators.required],
        site_pass: ['', Validators.required],
        site_apiKey: ['', Validators.required],
        site_otherInfo: ['', Validators.required],
      }
    )
  }

  ngOnInit() {
    this.getOtaList();
  }

  getOtaList() {
    this._adminService.getOtaList((res: any) => {
      if (res.status == 200) {
        console.log(res);
        this.otaList = res.data;
      }
    })
  }


  openModal() {
    this.showModal.ota = true;
    // this.otaModal.reset();
  }

  closeModal() {
    this.showModal.ota = false;
    this.showModal.delete = false;
    this.isEditModal = false;
    this.otaModal.reset();
  }

  showDropDown(idx: any) {
    this.showActionDropDown[idx] = !this.showActionDropDown[idx];
  }

  editOwnerOpenModal(item: any) {
    this.isEditModal = true;
    this.otaModal.patchValue(item);
    this.showModal.ota = true;
    this.currentOtaId = item.id;
  }


  backToManageOta() {
    this.showModal.ota = false;
    this.isEditModal = false;
    this.showActionDropDown = {};
    this.otaModal.reset();
  }

  chooseSiteIcon(event: any) {
    const file: any = event.target.files[0];
    this.siteIcon = URL.createObjectURL(file);
    this.siteIconFile = event.target.files[0];
  }

  editOtaDetails() {

  }

  addNewOtaDetails() {
    this.loader = true;
    if (this.otaModal.status == "VALID") {
      const formData = new FormData();
      formData.append('siteName', this.otaModal.get('site_name').value);
      formData.append('siteIcon', this.siteIconFile);
      formData.append('siteEndpoint', this.otaModal.get('site_endpoint').value);
      formData.append('siteUser', this.otaModal.get('site_user').value);
      formData.append('sitePass', this.otaModal.get('site_pass').value);
      formData.append('siteApiKey', this.otaModal.get('site_apiKey').value);
      formData.append('siteOtherInfo', this.otaModal.get('site_otherInfo').value);

      this._adminService.addOta(formData, (res: any) => {
        if (res.status == 200) {
          console.log(res);
          this.alert.alert("success", res.message, "Success", { displayDuration: 2000, pos: 'top' });
          this.loader = false;
          this.closeModal();
          this.getOtaList();
        }
      })
    } else{
      this.alert.alert("trash","Fields cannot be empty","Error",{displayDuration:2000,top});
      this.loader = false;
    }
  }

  toggleDeleteModal(idx:any){

  }

  copyApiKey(val:any){
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.alert.alert("success","API Key Copied","Success",{ displayDuration: 1000, pos: 'top' })
    }

    viewProperty(item:any){
      this.router.navigate(["view_property",item.id]);
      let siteName:any = item.site_name.toLowerCase().split(" ").join("_");
      localStorage.setItem("current_ota_detail",JSON.stringify({"site_name":siteName,"apikey":item.site_apiKey,"endPoint":item.site_endpoint,"theme_id":item.site_otherInfo,"ota_id":item.id,'site_unformat_name':item.site_name}));
      
    }

}



