import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingLogComponent } from './booking-log.component';

describe('BookingLogComponent', () => {
  let component: BookingLogComponent;
  let fixture: ComponentFixture<BookingLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
