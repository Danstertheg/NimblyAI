import { Component, Input, OnInit,  Output, EventEmitter } from '@angular/core';
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

  // To trigger a function in the parent to GET conv-reqs (parent is chat-options):
  @Output() refreshConvReqsEmitter = new EventEmitter<void>();

  constructor(private handleConvRequestDialog: MatDialog) { }

  ngOnInit(): void {
  }

  openHandleConversationRequestDialog() {
    alert("this request is for conv #" + this.conversationRequest.conversationId)
    const dialogRef = this.handleConvRequestDialog.open(HandleConversationRequestComponent, {
      data: this.conversationRequest
    })

    // Pass a reference of parent (this component) to dialog:
    dialogRef.componentInstance.parentComponent = this;
  }


  onConvRequestResponded() {
    this.refreshConvReqsEmitter.emit();
  }
}
