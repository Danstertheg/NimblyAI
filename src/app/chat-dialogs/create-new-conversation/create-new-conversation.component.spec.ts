import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewConversationComponent } from './create-new-conversation.component';

describe('CreateNewConversationComponent', () => {
  let component: CreateNewConversationComponent;
  let fixture: ComponentFixture<CreateNewConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewConversationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
