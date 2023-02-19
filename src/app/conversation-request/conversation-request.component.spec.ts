import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationRequestComponent } from './conversation-request.component';

describe('ConversationRequestComponent', () => {
  let component: ConversationRequestComponent;
  let fixture: ComponentFixture<ConversationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversationRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
