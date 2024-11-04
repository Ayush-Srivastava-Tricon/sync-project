import { Component } from '@angular/core';

@Component({
  selector: 'app-manage-rule-engine',
  templateUrl: './manage-rule-engine.component.html',
  styleUrls: ['./manage-rule-engine.component.scss']
})
export class ManageRuleEngineComponent {
  ruleConfig: any = {};

  myboj: any;

  constructor() {

  }



  onChange() {
    console.log(this.ruleConfig);
  }

  submitValue() {
    localStorage.setItem("managerule", JSON.stringify(this.ruleConfig));
  }
}
