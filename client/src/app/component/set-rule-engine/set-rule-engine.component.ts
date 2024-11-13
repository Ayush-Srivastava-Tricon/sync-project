import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SellerService } from 'src/app/service/seller.service';

@Component({
  selector: 'app-set-rule-engine',
  templateUrl: './set-rule-engine.component.html',
  styleUrls: ['./set-rule-engine.component.scss']
})
export class SetRuleEngineComponent {

  ruleConfig: any = {};
  showExcludingPartnerList: boolean = false;
  countryList: any = [];
  stateList: any = [];
  cityList: any = [];
  discountForm: FormGroup | any;
  allruleenginedata: any;
  constructor(private sellerService: SellerService) { }

  ngOnInit() {
    // this.fetchCountry();
    this.fethchruleengineData();
  }

  fetchCountry() {
    this.sellerService.fetchCountry((data: any) => {
      this.countryList = data.data;
      console.log(this.ruleConfig);

    })
  }

  fethchruleengineData() {

    this.sellerService.fetchruleEngineData((response: any) => {
      this.allruleenginedata = response[0];
      console.log(this.allruleenginedata);

      // console.log(response);

    })
  }

  getStates(event: any) {

  }

  onChange() {

  }

  submitValue() {

  }


}
