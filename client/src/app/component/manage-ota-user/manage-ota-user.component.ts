import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SellerService } from 'src/app/service/seller.service';
import { AlertService } from 'src/app/shared/alert.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-manage-ota-user',
  templateUrl: './manage-ota-user.component.html',
  styleUrls: ['./manage-ota-user.component.scss']
})
export class ManageOtaUserComponent {


  loader: boolean = false;
  otaUserList: any = [];
  showActionDropDown: any = {};
  showModal: any = {};
  otaModal: any;
  isEditModal: boolean = false;
  formData: any = new FormData();
  currentOtaId: any = 0;
  siteIcon: any = '';
  siteIconFile: any = '';
  commissionValue:any;

  siteIconPathBaseUrl: any = environment.baseurl;

  constructor(private alert: AlertService, private fb: FormBuilder, private _seller: SellerService,private router:Router) {
    this.otaModal = this.fb.group(
      {
        ota_id: [null, Validators.required],
        site_name: [null],
        site_icon: ['',Validators.required],
        site_user: ['', Validators.required],
        site_pass: ['', Validators.required],
        site_apikey: ['', Validators.required],
        site_otherinfo: ['', Validators.required],
        commission: ['', [Validators.required,Validators.max(100)]],
        commissionType: ['', [Validators.required]]
      }
    )
  }

  ngOnInit() {
    this.getOtaListByUser();
  }

  getOtaListByUser(){
    this._seller.getOtaListByUser((res: any) => {
      if (res.status == 200) {
        this.otaUserList = res.data;
      }
    })
  }

  getOtaList() {
    this._seller.getOtaList((res: any) => {
      if (res.status == 200) {
        console.log(res);
        this.otaModal.controls['ota_id'].setValue(res.data);
        this.otaModal.controls['ota_id'].updateValueAndValidity();
      }
    })
  }


  openModal() {
    this.showModal.ota = true;
    this.getOtaList();
  }

  closeModal() {
    this.showModal.ota = false;
    this.showModal.delete = false;
    this.isEditModal = false;
    this.siteIcon = '';
    this.siteIconFile='';
    this.otaModal.reset();
  }

  showDropDown(idx: any) {
    this.showActionDropDown[idx] = !this.showActionDropDown[idx];
  }

  editOtaOpenModal(item: any) {
    
    this.isEditModal = true;
    this.otaModal.patchValue(item);
    this.siteIcon = this.siteIconPathBaseUrl + item.site_icon;
    this.siteIconFile = item.site_icon;
    this.showModal.ota = true;
    this.currentOtaId = item.ota_user_id;
    this.selectCommissioType({target:{value:item.commissionType}});
    console.log(item);
    this.otaModal.controls['ota_id'].setValidators(null);
    this.otaModal.controls['ota_id'].updateValueAndValidity();
    
  }

  editOtaUser(){
    this.loader = true;
    if (this.otaModal.status == "VALID") {
      
      const formData = new FormData();
      formData.append('ota_id', this.otaModal.get('ota_id').value);
      formData.append('siteIcon', this.siteIconFile ? this.siteIconFile : this.otaModal.get('site_icon').value);
      formData.append('siteName', this.otaModal.get('site_name').value);
      formData.append('siteUser', this.otaModal.get('site_user').value);
      formData.append('sitePass', this.otaModal.get('site_pass').value);
      formData.append('siteApiKey', this.otaModal.get('site_apikey').value);
      formData.append('siteOtherInfo', this.otaModal.get('site_otherinfo').value);
      formData.append('commission', this.otaModal.get('commission').value);
      formData.append('commissionType', this.otaModal.get('commissionType').value);
      formData.append('id', this.currentOtaId);

      this._seller.editOtaUser(formData, (res: any) => {
        if (res.status == 200) {
          console.log(res);
          this.alert.alert("success", res.message, "Success", { displayDuration: 2000, pos: 'top' });
          this.loader = false;
          this.closeModal();
          this.getOtaListByUser();
        }
      })
    } else{
      this.alert.alert("trash","Fields cannot be empty","Error",{displayDuration:2000,top});
      this.loader = false;
    }
  }


  backToManageOta() {
    this.showModal.ota = false;
    this.isEditModal = false;
    this.showActionDropDown = {};
    this.siteIcon = '';
    this.siteIconFile = '';
    this.otaModal.reset();
  }

  chooseSiteIcon(event: any) {
    const file: any = event.target.files[0];
    this.siteIcon = URL.createObjectURL(file);
    this.siteIconFile = event.target.files[0];
    this.otaModal.controls['site_icon'].setValue(this.siteIconFile);
    
  }

  addNewOtaUser() {
    this.loader = true;
    console.log(this.otaModal.value);
    if (this.otaModal.status == "VALID") {
      
      const formData = new FormData();
      formData.append('ota_id', this.otaModal.get('ota_id').value);
      formData.append('siteIcon', this.siteIconFile);
      formData.append('siteName', this.otaModal.get('site_name').value);
      formData.append('siteUser', this.otaModal.get('site_user').value);
      formData.append('sitePass', this.otaModal.get('site_pass').value);
      formData.append('siteApiKey', this.otaModal.get('site_apikey').value);
      formData.append('siteOtherInfo', this.otaModal.get('site_otherinfo').value);
      formData.append('commission', this.otaModal.get('commission').value);
      formData.append('commissionType', this.otaModal.get('commissionType').value);
      

      this._seller.addOtaUser(formData, (res: any) => {
        if (res.status == 200) {
          console.log(res);
          this.alert.alert("success", res.message, "Success", { displayDuration: 2000, pos: 'top' });
          this.loader = false;
          this.closeModal();
          this.getOtaListByUser();
        }
      })

    } else{
      this.alert.alert("trash","Fields cannot be empty","Error",{displayDuration:2000,top});
      this.loader = false;
    }
  }

  toggleDeleteModal(id:any){
    this.showModal.delete = true;
    this.currentOtaId = id;
  }

  deleteOta(){
    this.loader=true;
    let params:any={
      id:this.currentOtaId
    };
    this._seller.deleteOtaUser(params,(res:any)=>{
      if(res.status == 200){
        this.alert.alert("success", res.message, "Success", { displayDuration: 2000, pos: 'top' });
        this.loader=false;
          this.closeModal();
          this.getOtaListByUser();
      }else{
          this.loader=false;
          this.closeModal();
          this.alert.alert("trash","Something went wrong","Error",{displayDuration:2000,top});

        }
      })
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
      this.router.navigate(["view_property",item.id ? item.id : item.ota_user_id]);
      let siteName:any = item.site_name.toLowerCase().split(" ").join("_");
      localStorage.setItem("current_ota_detail",JSON.stringify({"site_name":siteName,"apikey":item.site_apikey,"endPoint":item.site_endpoint,"theme_id":item.site_otherinfo,"ota_id":item.id,'site_unformat_name':item.site_name, "ota_user_id":item.ota_user_id}));
      
    }

    selectCommissioType(event:any){
      if(event.target.value == 'fixed'){
        this.otaModal.controls['commission'].setValidators([Validators.required]);
        this.otaModal.controls['commission'].updateValueAndValidity();
      }else{
        this.otaModal.controls['commission'].setValidators([Validators.required,Validators.max(100)]);
        this.otaModal.controls['commission'].updateValueAndValidity();
      }
    }

    selectOtaNameAndId(event:any){
      let otaData:any = JSON.parse(event.target.value);
      this.otaModal.controls['ota_id'].setValue(otaData.id)
      this.otaModal.controls['ota_id'].updateValueAndValidity();

      this.otaModal.controls['site_name'].setValue(otaData.site_name)
      this.otaModal.controls['site_name'].updateValueAndValidity();



      
    }

}
