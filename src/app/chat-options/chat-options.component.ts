import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges,ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Conversation } from '../domains/conversation';
import { ConversationRequest } from '../domains/conversation-request';
import { CreateNewConversationComponent } from '../chat-dialogs/create-new-conversation/create-new-conversation.component';
import io from "socket.io-client";
import {Clipboard} from '@angular/cdk/clipboard';
import { MatTooltip } from '@angular/material/tooltip';

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
  needToLoad = false;
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
  invite:string = `
Hi there!

    Wanna try something new? Join me on NimblyAI for some fun conversations and idea sharing!
    It's super easy to sign up at https://nimblyai.com. Let's connect and start chatting! You can start a conversation with me 
    using my email address ${localStorage.getItem("email")}.
  
See you on the platform.`;

  @ViewChild(MatTooltip) tooltip?: MatTooltip;
  showToolTip(){
    this.tooltip?.show()
  }
  async ngOnInit() {
    this.tooltip?.hide()
    // GET: Conversation lists where myId is one of the ids in "userIds"
    //this.getConversations();
    this.socket = io(serverUrl);
    // GET: Conversation Request lists for userId where myId is the invitedId
    // this.getConversationRequests();
    let authToken = localStorage.getItem("sessionToken");
    let email = localStorage.getItem("email");
    this.socket.emit("listenRequests", email, authToken);
    this.socket.on("acceptRequestStatus", (status:string,conversation:any) => {
      if (status == "success"){
        console.log("request was successfully sent ;D")
        this.getConversations();
        //if accepted, it needs to reload, this function is currently used by sender and sendee
        this.getConversationRequests();
        console.log(conversation);
        let conv:Conversation = conversation; 
        this.setCurrentConversation(conv);
        
      }
      
    })
    this.socket.on("receivedRequest", (invitationToken:string) => {
      console.log("received invitation token id from socket server " + invitationToken)
      this.getConversationRequests(); // all requests are reloaded with this previous implementation
      // this.getConvReqByToken(invitationToken) // only the new one that was sent by another user is loaded 
    });
    this.socket.on('disconnect', async () => {
      this.needToLoad = true;
    })
    this.socket.on('connect', async () => {
      if (this.needToLoad){
        await this.getConversations();
      }
      console.log('Reconnected to server');
      await this.getConversationRequests();
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
  async ngOnChanges(changes: SimpleChanges) {
    // If currentConversationId changes (set by parent), get conversations again:
    if ('currentConversationId' in changes) {
      if (this.currentConversationId === '0')
        await this.getConversations();
    }
  }

  async getConversations() {
    console.log("getting conversations")
    // Reset array:
    this.conversations = [];
    const sessionToken = localStorage.getItem("sessionToken");
    await fetch(apiURL + "/api/conversation/" + this.myId, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionToken}`
      }
    })
    .then(response => response.json())
    .then((response: any) => {
      for(const conv of response) {
        //good it is pushing items correctly from chat options here 
        this.conversations.push({
          _id: conv._id,
          userIds: conv.userIds,
          token:conv.token
        })
      }
    })
    .catch(error => {
      console.error(error);
    });
  }

  async getConversationRequests() {
    // Reset array
    this.conversationRequests = [];
    const sessionToken = localStorage.getItem("sessionToken");
    await fetch(apiURL + "/api/conversation-request/" + this.myId, {
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
  NimblyConversation(){
    console.log("start chat with nimbly");
  }
  setCurrentConversation(conversation: Conversation) {
    this.currentConversationId = conversation._id;
    // this.currentConversation = conversation;
    if (window.innerWidth <= 680){
      this.mobileChatEvent.emit(this.chatlogs);
    }
    // Emit alert so parent knows conversationId has just changed:
    this.currentConversationIdChange.emit(
      { id: this.currentConversationId, conv:conversation} // we need to pass the conversation object to chatlogs
      
    );
  }
  setCurrentConversationById(conversationId: string) {
    this.currentConversationId = conversationId;
    if (window.innerWidth <= 680){
      this.mobileChatEvent.emit(this.chatlogs);
    }
    // Emit alert so parent knows conversationId has just changed:
    this.currentConversationIdChange.emit(
      { id: this.currentConversationId } // we need to pass the conversation object to chatlogs
    );
  }
  openCreateConversationDialog() {
    this.createConversationDialog.open(CreateNewConversationComponent);
  }

}
