import { Component, OnInit } from '@angular/core';
import { Conversation } from '../domains/conversation';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit {
  currentConversationId: string = "0";
  chatOptionsClass = "chat-options";
  chatlogsClass = "chat-logs" 
  currentConversation!: Conversation;
  hide = true;
  shonen = false;
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
  mobileChatlogsView(mobileChatOpened:boolean){
    console.log(mobileChatOpened)
    if (mobileChatOpened){
      this.chatOptionsClass = "hide";
      this.chatlogsClass = "show";
    }
    else {
      // return button must have been pressed to return settings 
      this.mobileReturnChatOptions();
    }
  }
  mobileReturnChatOptions(){
    this.chatOptionsClass = "show";
    this.chatlogsClass = "hide";
  }
}
