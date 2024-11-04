import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSellerComponent } from './manage-seller.component';

describe('ManageSellerComponent', () => {
  let component: ManageSellerComponent;
  let fixture: ComponentFixture<ManageSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSellerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
