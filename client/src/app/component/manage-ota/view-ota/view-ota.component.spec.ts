import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOtaComponent } from './view-ota.component';

describe('ViewOtaComponent', () => {
  let component: ViewOtaComponent;
  let fixture: ComponentFixture<ViewOtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOtaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
