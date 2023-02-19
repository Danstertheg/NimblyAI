import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConversationRequest } from 'src/app/domains/conversation-request';

@Component({
  selector: 'app-handle-conversation-request',
  templateUrl: './handle-conversation-request.component.html',
  styleUrls: ['./handle-conversation-request.component.scss', '../create-new-conversation/create-new-conversation.component.scss']
})
export class HandleConversationRequestComponent implements OnInit {
  // set by parent
  convReq: ConversationRequest; 

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConversationRequest) {
    this.convReq = data;
   }

  ngOnInit(): void {
  }

}
