import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatOptionComponent } from './chat-option.component';

describe('ChatOptionComponent', () => {
  let component: ChatOptionComponent;
  let fixture: ComponentFixture<ChatOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatOptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
