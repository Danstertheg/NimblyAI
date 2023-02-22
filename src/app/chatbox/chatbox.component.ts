import { Component, OnInit } from '@angular/core';
import { Conversation } from '../domains/conversation';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit {
  currentConversationId: string = "0";

  currentConversation!: Conversation;

  constructor() { }

  ngOnInit(): void {
  }

  SetConversationId(id: string) {
    this.currentConversationId = id;
  }

  SetConversation(data: any) { // sent from chat-options
    this.currentConversationId = data.id;
    this.currentConversation = data.conv;
  }

}
