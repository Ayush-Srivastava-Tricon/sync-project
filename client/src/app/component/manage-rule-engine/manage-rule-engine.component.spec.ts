import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRuleEngineComponent } from './manage-rule-engine.component';

describe('ManageRuleEngineComponent', () => {
  let component: ManageRuleEngineComponent;
  let fixture: ComponentFixture<ManageRuleEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRuleEngineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRuleEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
