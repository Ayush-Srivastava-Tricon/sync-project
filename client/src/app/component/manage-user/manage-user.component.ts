import { Component } from '@angular/core';
import { AdminService } from 'src/app/admin.service';
import { AlertService } from 'src/app/shared/alert.service';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent {
  loader:boolean=false;
  showModal:any={};
  isEditModal:boolean=false;
  userList:any=[];
  userConfig:any={
    email:'',
    password:'',
    name:'',
    role:''
  };
  currentUserId:any=0;

  constructor(private _service:AdminService,private alert:AlertService){}

  ngOnInit(){
    this.fetchUserList();

  }

  fetchUserList(){
    this.loader=true;
    this._service.fetchUserList((res:any)=>{
      if(res.status == 200){
        this.loader=false;
        this.userList = res.data;
      }else{
        console.log(23);
        
        this.alert.alert("error",res.error.message,"Error",{ displayDuration: 2000, pos: 'top' });
        this.loader=false;
      }
    })
  }


  saveUser(){
    this.loader=true;
    this._service.addUser(this.userConfig,(res:any)=>{
      if(res.status == 200){
        this.alert.alert("success",res.message,"Success",{ displayDuration: 2000, pos: 'top' });
        this.fetchUserList();
        this.backToUser();
        this.loader=false;
      }else{
        this.alert.alert("error",res.error.message,"Error",{ displayDuration: 2000, pos: 'top' });
        this.loader=false;
      }
    })
  }
  
  openModal(){
    this.showModal.user = true;
    this.isEditModal = false;
  }

  editKeeperOpenModal(item:any){
    this.currentUserId = item.id;
    this.isEditModal=true;
    this.showModal.user = true;
    this.userConfig = item;
  }

  editUser(){
    this.loader=true;
    this._service.editUser(this.userConfig,(res:any)=>{
      if(res.status == 200){
        this.loader=false;
        this.backToUser();
        this.fetchUserList();
        this.alert.alert("success",res.message,"Success",{ displayDuration: 2000, pos: 'top' });
      }else{
        this.loader=false;
        this.alert.alert("error",res.message,"Error",{ displayDuration: 2000, pos: 'top' });
      }
    })
  }

  deleteUserModal(id:any){
    this.currentUserId = id;
    this.showModal.delete=true;
  }

  deleteUser(){
      this._service.deleteUser({id:this.currentUserId},(res:any)=>{
        if(res.status = 200){
          this.showModal.delete=false;
          this.backToUser();
          this.fetchUserList();
          this.alert.alert("error",res.message,"Success",{ displayDuration: 2000, pos: 'top' });
        }else{
          this.showModal.delete=false;
          this.alert.alert("error",res.message,"Error",{ displayDuration: 2000, pos: 'top' });
        }
      })
  }

  closeModal(){
    this.showModal.delete=false;
  }

  backToUser(){
      this.showModal.user = false;
      this.userConfig = {};
  }

  

}
