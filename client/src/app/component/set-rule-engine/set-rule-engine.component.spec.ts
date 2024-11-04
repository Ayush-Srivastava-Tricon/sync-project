import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetRuleEngineComponent } from './set-rule-engine.component';

describe('SetRuleEngineComponent', () => {
  let component: SetRuleEngineComponent;
  let fixture: ComponentFixture<SetRuleEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetRuleEngineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetRuleEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
