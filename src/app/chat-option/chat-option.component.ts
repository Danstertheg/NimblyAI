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
  myId = localStorage.getItem("email") || "";

  constructor() {}

  ngOnInit(): void {
    // Fill userIds with IDs of all users except current one:
    if (this.conversation)
      this.userIds = GetUserIdsStringFromArray(this.conversation.userIds, this.myId);
  }

}

// To also use in Chatlogs:
export function GetUserIdsStringFromArray(userIds: Array<string>, myId: string): string {
  let userIdList = "(Only You)";

  // Nobody but you? Lonely...
  if (userIds.length > 1) {
    userIdList = "";
    
    for (let i = 0; i < userIds.length; i++) {
      userIdList += (i === 0 || i === userIds.length - 1) ? "" : ", "; // add a comma if not the first one

      userIdList += (userIds[i] === myId) ? "" : userIds[i];
    }
  }

  return userIdList;
}
