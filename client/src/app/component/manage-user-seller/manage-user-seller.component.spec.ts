import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserSellerComponent } from './manage-user-seller.component';

describe('ManageUserSellerComponent', () => {
  let component: ManageUserSellerComponent;
  let fixture: ComponentFixture<ManageUserSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserSellerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageUserSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
