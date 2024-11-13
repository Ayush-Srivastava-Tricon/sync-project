import { Component } from '@angular/core';
import { AdminService } from 'src/app/admin.service';

@Component({
  selector: 'app-manage-rule-engine',
  templateUrl: './manage-rule-engine.component.html',
  styleUrls: ['./manage-rule-engine.component.scss']
})
export class ManageRuleEngineComponent {
  allruleenginedata: any;
  ruleConfig: any = {
    margin: false,
    territory: false,
    selling_period: false,
    travel_period: false,
    excluding_selling_partner: false,
    cancellation_policy: false,
    payment_policy: false,
    hotels_content: false,
    hotel_partner_allocation: false,
  };

  constructor(private service: AdminService) { }

  ngOnInit() {
    this.getruleengineData();
  }

  getruleengineData() {
    this.service.fetchruleEngineData((response: any) => {
      this.allruleenginedata = response[0];
      console.log(this.allruleenginedata);

      // console.log(response);

    })
  }

  // On checkbox state change
  onChange() {
    // console.log(this.ruleConfig);
  }

  // Submit the rule engine configuration
  submitValue() {
    // localStorage.setItem("managerule", JSON.stringify(this.ruleConfig));
    this.ruleConfig["id"] = this.allruleenginedata.id;
    this.service.setruleEngineData(this.ruleConfig, (response: any) => {
      if (response.status === 200) {
        console.log(response);
      }
    });
  }
}