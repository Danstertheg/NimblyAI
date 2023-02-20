import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitConversationComponent } from './exit-conversation.component';

describe('ExitConversationComponent', () => {
  let component: ExitConversationComponent;
  let fixture: ComponentFixture<ExitConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExitConversationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
