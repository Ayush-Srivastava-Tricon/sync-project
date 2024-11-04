import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SellerService } from 'src/app/service/seller.service';

@Component({
  selector: 'app-set-rule-engine',
  templateUrl: './set-rule-engine.component.html',
  styleUrls: ['./set-rule-engine.component.scss']
})
export class SetRuleEngineComponent {

  ruleConfig:any={};
  showExcludingPartnerList:boolean=false;
  countryList:any=[];
  stateList:any=[];
  cityList:any=[];
  discountForm:FormGroup|any;
  constructor(private sellerService:SellerService){}

  ngOnInit(){
    // this.fetchCountry();
  }

  fetchCountry(){
    this.sellerService.fetchCountry((data:any)=>{
      this.countryList = data.data;
      console.log(this.ruleConfig);
      
    })  
  } 

  getStates(event:any){

  }

  onChange(){

  }

  submitValue(){

  }

  
}
