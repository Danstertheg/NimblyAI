import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Conversation } from '../domains/conversation';
import { ConversationRequest } from '../domains/conversation-request';
import { CreateNewConversationComponent } from '../chat-dialogs/create-new-conversation/create-new-conversation.component';
import io from "socket.io-client";

// Socket Io (Glitch) URL:
// const serverUrl = "https://einsteinchat-socket-io-server.glitch.me"; // no need to specify port 
const serverUrl = "https://nimbly.glitch.me"
// Vercel API URL:
const apiURL = "https://finaltest-ten.vercel.app"; // "http://localhost:5000"; 

const sessionToken = localStorage.getItem("sessionToken");

@Component({
  selector: 'app-chat-options',
  templateUrl: './chat-options.component.html',
  styleUrls: ['./chat-options.component.scss']
})
export class ChatOptionsComponent implements OnInit {
  socket: any;
  // Current conversation id (IF ANY) passed by parent (chatbox)
  @Input() currentConversationId?: string;
  @Output() mobileChatEvent = new EventEmitter<boolean>();
  chatlogs:boolean = true;
  // Event emitter to trigger parent function when current conversationId changes:
  @Output() currentConversationIdChange: EventEmitter<any> = new EventEmitter<any>();

  // User's unique identifier is their email
  myId = localStorage.getItem("email");
  errorMessage:string = "";
  // Array of conversations retrieved from DB
  conversations: Array<Conversation> = [];

  // Array of pending conversations retrieved from DB
  conversationRequests: Array<ConversationRequest> = [];

  // To know which of the two options in the mat-button-toggle is active (conversations OR requests)
  selectedOptionForConversations = "conversations";
  requestAmount = 0
  constructor(private createConversationDialog: MatDialog) { }

  ngOnInit(): void {
    // GET: Conversation lists where myId is one of the ids in "userIds"
    //this.getConversations();
    this.socket = io(serverUrl);
    // GET: Conversation Request lists for userId where myId is the invitedId
    this.getConversationRequests();
    let authToken = localStorage.getItem("sessionToken");
    let email = localStorage.getItem("email");
    this.socket.emit("listenRequests", email, authToken);
    this.socket.on("receivedRequest", (invitationToken:string) => {
      console.log("received invitation token id from socket server " + invitationToken)
      this.getConversationRequests(); // all requests are reloaded with this previous implementation
      // this.getConvReqByToken(invitationToken) // only the new one that was sent by another user is loaded 
    });
    this.socket.on('connect', () => {
      console.log('Reconnected to server');
      this.getConversationRequests();
      this.getConversations();
      //actively listen for requests, and conversation updates
      this.socket.emit("listenRequests", email, authToken);

      
      this.errorMessage = "";
       // Retrieve conversations, 

    });
 

  }
  openChats(){
    this.selectedOptionForConversations = "conversations";
  }
  getConvReqByToken(invitationToken:string){
    const sessionToken = localStorage.getItem("sessionToken");
    fetch(apiURL + "/api/conversation-request/" + this.myId, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${sessionToken}`
      },
      body: JSON.stringify({
        invitationToken:invitationToken
      })
    })
    .then(response => response.json())
    .then((request: any) => {
      console.log(request)
      // for(const request of response) {
        this.conversationRequests.push({
          _id: request._id, // used to respond to conversation request 
          conversationId: request.conversationId, // may be undefined
          invitedId: request.invitedId,
          invitingId: request.invitingId,
          token:request.token
        })
      // }
    })
    .catch(error => {
      console.error(error);
    });
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
          invitingId: request.invitingId,
          token:request.token
        })
      }
      this.requestAmount = this.conversationRequests.length;
    })
    .catch(error => {
      console.error(error);
    });
  }

  setCurrentConversation(conversation: Conversation) {
    this.currentConversationId = conversation._id;
    if (window.innerWidth <= 680){
      this.mobileChatEvent.emit(this.chatlogs);
    }
    // Emit alert so parent knows conversationId has just changed:
    this.currentConversationIdChange.emit(
      { id: this.currentConversationId, conv: conversation } // we need to pass the conversation object to chatlogs
    );
  }

  openCreateConversationDialog() {
    this.createConversationDialog.open(CreateNewConversationComponent);
  }

}
