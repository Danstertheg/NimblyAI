import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfulRequestSendComponent } from './successful-request-send.component';

describe('SuccessfulRequestSendComponent', () => {
  let component: SuccessfulRequestSendComponent;
  let fixture: ComponentFixture<SuccessfulRequestSendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessfulRequestSendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessfulRequestSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
