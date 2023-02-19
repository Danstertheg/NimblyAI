import { Component, Input, OnInit } from '@angular/core';
import { ConversationRequest } from '../domains/conversation-request';
import { MatDialog } from '@angular/material/dialog';
import { HandleConversationRequestComponent } from '../chat-dialogs/handle-conversation-request/handle-conversation-request.component';

@Component({
  selector: 'app-conversation-request',
  templateUrl: './conversation-request.component.html',
  styleUrls: ['./conversation-request.component.scss', '../chat-option/chat-option.component.scss']
})
export class ConversationRequestComponent implements OnInit {
  // Conversation Request object inputted by parent (it will always be set so we use '!')
  @Input() conversationRequest!: ConversationRequest;

  constructor(private handleConvRequestDialog: MatDialog) { }

  ngOnInit(): void {
  }

  openHandleConversationRequestDialog() {
    this.handleConvRequestDialog.open(HandleConversationRequestComponent, {
      data: this.conversationRequest
    })
  }

}
