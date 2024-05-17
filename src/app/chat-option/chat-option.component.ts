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
  recentMessage:string = "";
  recentMessageTimestamp:string = "10pm";
  // User's unique identifier is their email
  myId = localStorage.getItem("email") || "";

  constructor() {}

  ngOnInit(): void {
    // Fill userIds with IDs of all users except current one:
    if (this.conversation)
      this.userIds = GetUserIdsStringFromArray(this.conversation.userIds, this.myId);
      this.recentMessage = this.conversation?.recentMessage as string;
      const inputDate = new Date(this.conversation?.recentMessageTimestamp as string); // Convert the input date string to a Date object

      const today = new Date(); // Get the current date object

      // Check if the input date is the same as today
      if (inputDate.getDate() === today.getDate() &&
        inputDate.getMonth() === today.getMonth() &&
        inputDate.getFullYear() === today.getFullYear()) {

      // If the input date is today, print only the time
      const timeString = inputDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      this.recentMessageTimestamp = timeString;
        }
      else if (inputDate.toLocaleDateString() == "Invalid Date"){
        this.recentMessageTimestamp = "New";
      }
        else{
          const timeStamp = inputDate.toLocaleDateString();
          this.recentMessageTimestamp = timeStamp;
        }
      
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
