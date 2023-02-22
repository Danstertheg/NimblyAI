import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserToConversationComponent } from './add-user-to-conversation.component';

describe('AddUserToConversationComponent', () => {
  let component: AddUserToConversationComponent;
  let fixture: ComponentFixture<AddUserToConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserToConversationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserToConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
