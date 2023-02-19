import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleConversationRequestComponent } from './handle-conversation-request.component';

describe('HandleConversationRequestComponent', () => {
  let component: HandleConversationRequestComponent;
  let fixture: ComponentFixture<HandleConversationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandleConversationRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandleConversationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
