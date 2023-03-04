import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessSignupMsgComponent } from './success-signup-msg.component';

describe('SuccessSignupMsgComponent', () => {
  let component: SuccessSignupMsgComponent;
  let fixture: ComponentFixture<SuccessSignupMsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessSignupMsgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessSignupMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
