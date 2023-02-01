import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EinsteinChatComponent } from './einstein-chat.component';

describe('EinsteinChatComponent', () => {
  let component: EinsteinChatComponent;
  let fixture: ComponentFixture<EinsteinChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EinsteinChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EinsteinChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
