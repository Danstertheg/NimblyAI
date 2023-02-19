import { Component, Input, OnInit } from '@angular/core';
import { Conversation } from '../domains/conversation';

@Component({
  selector: 'app-chat-option',
  templateUrl: './chat-option.component.html',
  styleUrls: ['./chat-option.component.scss']
})
export class ChatOptionComponent implements OnInit {
  @Input() conversation?: Conversation;

  // String to display for other users (OTHER THAN current user) IDs:
  userIds = ""; 

  // User's unique identifier is their email
  myId = localStorage.getItem("email");

  constructor() {}

  ngOnInit(): void {
    // Fill userIds with IDs of all users except current one:
    if (this.conversation) {
      for (let i = 0; i < this.conversation.userIds.length; i++) {
        this.userIds += (i === 0 || i === this.conversation.userIds.length - 1) ? "" : ", "; // add a comma if not the first one

        this.userIds += (this.conversation.userIds[i] === this.myId) ? "" : this.conversation.userIds[i];
      }
    }
  }

}
