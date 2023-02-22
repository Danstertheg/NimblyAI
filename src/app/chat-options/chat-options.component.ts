import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Conversation } from '../domains/conversation';
import { ConversationRequest } from '../domains/conversation-request';
import { CreateNewConversationComponent } from '../chat-dialogs/create-new-conversation/create-new-conversation.component';

// Vercel API URL:
const apiURL = "http://localhost:5000"; //"https://finaltest-ten.vercel.app/";

const sessionToken = localStorage.getItem("sessionToken");

@Component({
  selector: 'app-chat-options',
  templateUrl: './chat-options.component.html',
  styleUrls: ['./chat-options.component.scss']
})
export class ChatOptionsComponent implements OnInit {
  // Current conversation id (IF ANY) passed by parent (chatbox)
  @Input() currentConversationId?: string;

  // Event emitter to trigger parent function when current conversationId changes:
  @Output() currentConversationIdChange: EventEmitter<any> = new EventEmitter<any>();

  // User's unique identifier is their email
  myId = localStorage.getItem("email");

  // Array of conversations retrieved from DB
  conversations: Array<Conversation> = [];

  // Array of pending conversations retrieved from DB
  conversationRequests: Array<ConversationRequest> = [];

  // To know which of the two options in the mat-button-toggle is active (conversations OR requests)
  selectedOptionForConversations = "conversations";

  constructor(private createConversationDialog: MatDialog) { }

  ngOnInit(): void {
    // GET: Conversation lists where myId is one of the ids in "userIds"
    //this.getConversations();

    // GET: Conversation Request lists for userId where myId is the invitedId
    this.getConversationRequests();
  }

  ngOnChanges(changes: SimpleChanges) {
    // If currentConversationId changes (set by parent), get conversations again:
    if ('currentConversationId' in changes) {
      if (this.currentConversationId === '0')
        this.getConversations();
    }
  }

  getConversations() {
    // Reset array:
    this.conversations = [];

    fetch(apiURL + "/api/conversation/" + this.myId, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionToken}`
      }
    })
    .then(response => response.json())
    .then((response: any) => {
      for(const conv of response) {
        this.conversations.push({
          _id: conv._id,
          userIds: conv.userIds
        })
      }
    })
    .catch(error => {
      console.error(error);
    });
  }

  getConversationRequests() {
    // Reset array
    this.conversationRequests = [];

    fetch(apiURL + "/api/conversation-request/" + this.myId, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionToken}`
      }
    })
    .then(response => response.json())
    .then((response: any) => {
      for(const request of response) {
        this.conversationRequests.push({
          _id: request._id, // used to respond to conversation request 
          conversationId: request.conversationId, // may be undefined
          invitedId: request.invitedId,
          invitingId: request.invitingId
        })
      }
    })
    .catch(error => {
      console.error(error);
    });
  }

  setCurrentConversation(conversation: Conversation) {
    this.currentConversationId = conversation._id;

    // Emit alert so parent knows conversationId has just changed:
    this.currentConversationIdChange.emit(
      { id: this.currentConversationId, conv: conversation } // we need to pass the conversation object to chatlogs
    );
  }

  openCreateConversationDialog() {
    this.createConversationDialog.open(CreateNewConversationComponent);
  }
}
