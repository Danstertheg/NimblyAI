import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Conversation } from '../domains/conversation';
import { ConversationRequest } from '../domains/conversation-request';
import { CreateNewConversationComponent } from '../chat-dialogs/create-new-conversation/create-new-conversation.component';

@Component({
  selector: 'app-chat-options',
  templateUrl: './chat-options.component.html',
  styleUrls: ['./chat-options.component.scss']
})
export class ChatOptionsComponent implements OnInit {
  // Current conversation id (IF ANY) passed by parent (chatbox)
  @Input() currentConversationId?: string;

  // User's unique identifier is their email
  myId = localStorage.getItem("email");

  // Array of conversations retrieved from DB
  conversations: Array<Conversation> = [{
    conversationId: "1",
    userIds: ["littleJimmy@einstein.org", "shebasquine@gmail.com"]
  }];

  // Array of pending conversations retrieved from DB
  conversationRequests: Array<ConversationRequest> = [{
    conversationId: "2",
    invitedId: "shebasquine@gmail.com",
    invitingId: "test@test.com"
  }];

  // To know which of the two options in the mat-button-toggle is active (conversations OR requests)
  selectedOptionForConversations = "conversations";

  constructor(private createConversationDialog: MatDialog) { }

  ngOnInit(): void {
    // GET: Conversation lists where myId is one of the ids in "userIds"

    // GET: Conversation Request lists for userId where myId is the invitedId
    
  }

  setCurrentConversation(newConversationId: string) {
    alert("Changing to convo: "+ newConversationId )
    this.currentConversationId = newConversationId;
  }

  openCreateConversationDialog() {
    this.createConversationDialog.open(CreateNewConversationComponent);
  }
}
