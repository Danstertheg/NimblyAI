import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, ElementRef   } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from '../domains/message';
import { CachedMessage } from '../domains/cachedBuffer';
import { AddUserToConversationComponent } from '../chat-dialogs/add-user-to-conversation/add-user-to-conversation.component';
import { ExitConversationComponent } from '../chat-dialogs/exit-conversation/exit-conversation.component';
import { SpinnerOverlayComponentComponent } from '../spinner-overlay-component/spinner-overlay-component.component';
import { Conversation } from '../domains/conversation';
import { GetUserIdsStringFromArray } from '../chat-option/chat-option.component';

import io from "socket.io-client";
// Socket Io (Glitch) URL:
// const serverUrl = "https://einsteinchat-socket-io-server.glitch.me"; // no need to specify port 
const serverUrl = "https://nimbly.glitch.me";
// Vercel API URL:
const apiURL = "https://finaltest-ten.vercel.app"; // "http://localhost:5000"; 

// JWT:
const sessionToken = localStorage.getItem("sessionToken");

@Component({
  selector: 'app-chatlogs',
  templateUrl: './chatlogs.component.html',
  styleUrls: ['./chatlogs.component.scss']
})
export class ChatlogsComponent implements OnInit, OnChanges {
  // Reference to the chat container element
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  @Output() mobileChatEvent = new EventEmitter<boolean>();
  socket: any;
  
  // Conversation ID of this chat log component (inputted by parent) - initial value is "0"
  @Input() conversationId!: string;
  @Input() conversation!: Conversation;

  // String to display for other users (OTHER THAN current user) IDs:
  userIds = ""; 

  // Current page of messages:
  currMessagePage = 0;
  private nextMessagePageAlreadyCalled = false;
  errorMessage:String =""
  
  
  // Event emitter to trigger parent function when current conversationId changes:
  @Output() currentConversationIdChange: EventEmitter<string> = new EventEmitter<string>();

  // To leave() the last conversation on socket-io. Or not, if it is initial value "-1"
  previousConversationId = '-1';

  // User's unique identifier is their email
  myId = localStorage.getItem("email") || "";

  messageBuffer: Array<CachedMessage> = [];
  thinking = false
  // Message array to be pulled from DB
  messages: Array<Message> = [];
  thinkingIndicesMessages: Array <Number> = []
  // Handle for form to send message
  messageForm: FormGroup;
  pendingUsers: Array<String> = [];
  constructor(private formBuilder: FormBuilder, private dialogOpener: MatDialog) {
    
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  onScroll(event: any) {
    // Only retrieve more messages if all haven't already been retrieved (at which point currMessagePage = -1)
    if (this.currMessagePage != -1) {
      const scrollPos = event.target.scrollTop;
      const topOffset = 20;

      if (scrollPos <= topOffset && !this.nextMessagePageAlreadyCalled) {
        this.currMessagePage++;
        this.getMessagesFromMongoDB(false);
        
        this.nextMessagePageAlreadyCalled = true;
      } else if (scrollPos > topOffset)
        this.nextMessagePageAlreadyCalled = false;
    }
  }

  scrollDown(toBottom: boolean) {
    const heightToScroll = (toBottom) ? this.messageContainer.nativeElement.scrollHeight : 21;
    this.messageContainer.nativeElement.scrollTop = heightToScroll;
  }
  playMessageSound(){
    
      let audio = new Audio();
      audio.src = "./assets/message-sound-effect.mp3";
      audio.load();
      audio.play();
    
  }
  async ngOnInit(){
    
    this.socket = io(serverUrl);
    // Set the socket.io reconnection properties
    this.socket.io.reconnectionAttempts = 3;
    this.socket.io.reconnectionDelay = 1000;
    this.socket.io.timeout = 5000;
    this.socket.on("disconnect", () => {
      this.errorMessage = "Internet Connection Unstable... "
    })
    this.socket.on("sendJoinedMessage", async () => {
      console.log("saying hello to the room")
      await this.sendMessage("Has Joined.",false);
      // send a hello message to everyone saying you have joined automatically
      
    })
    this.socket.on("joined",(userList:any) =>{

    });
    this.socket.on("nimblyReplied",() => {
    this.messages.splice(this.thinkingIndicesMessages[0] as number,1);
    this.thinkingIndicesMessages.pop();
    this.thinking = false;
    });
    this.socket.on('connect_error', (error:string) => {
      console.log(error)
    this.errorMessage = 'Failed to reconnect. Please check your internet connection and try again';
    })
    this.socket.on("connect", async () => {
      this.socket.emit("listenRequests", this.myId, sessionToken);
      this.errorMessage = ""
      console.log("Successfully connected to glitch server!");  
      if(this.conversationId !== "0"){
        //connecting back from a disconnection most likely...
        // if (this.previousConversationId !== "-1")
        //   this.socket.emit("leave", this.previousConversationId, this.myId);
        this.messages = [];
        this.currMessagePage = 0;
        this.nextMessagePageAlreadyCalled = true;
        await this.getMessagesFromMongoDB(false);
        this.socket.emit("join", this.conversationId, this.myId,this.conversation.token,sessionToken);
         // Retrieve cached messages from local storage or memory
         const cachedMessages = this.getCachedMessages();
         // send any messages to the disconnected
         console.log("reconnected, attempting to send disconnected messages: "  + cachedMessages)
         console.log(this.messageBuffer)
         for (let idx in cachedMessages){
          console.log("idx " + idx)
          let msgResult = await this.sendMessage(cachedMessages[idx].message,cachedMessages[idx].forAI);
          if (msgResult == "sent")
            this.messageBuffer.splice(Number(idx), 1);
        }
    

      }

       // How client should react when a new message arrives (including one of their own being broadcasted):
       
      // Handle reconnection
  // this.socket.on('reconnect', () => {
  //   console.log('Reconnected to server');
  //   this.errorMessage = "";
    
  // });
    });
     this.socket.on("pending_users",(pendingUsers:any)=>{
      this.pendingUsers = [];
      for (let idx = 0; idx < pendingUsers.length; idx++)
      {
        this.pendingUsers[idx] = pendingUsers[idx].invitedId;
      }
      console.log(this.pendingUsers)
     })
    this.socket.on("message", (senderEmail: string, timestamp: string, text: string, aiAnswer?: string) => {

      const messageTimestamp = new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});;
      // Add to local array of messages
      this.messages.push({
        conversationId: this.conversationId,
        messageStatus:'sent',
        senderId: senderEmail,
        timestamp: messageTimestamp,
        text: text,
        aiAnswer: aiAnswer
      })

      setTimeout(() => {
        this.scrollDown(true);
      }, 0)
      this.playMessageSound();        
    })
    // })
  }
  getCachedMessages(){
    return this.messageBuffer;
  }
  storeCachedMessage(message:string,forAi:boolean) {
    console.log()
    // store in array that well be sent later
    this.messageBuffer.push({message: message, forAI:forAi})
    // display some type of message for the disconnected user to see his message pending...
    let senderEmail = String(localStorage.getItem("email"));
    if (!forAi){
    this.messages.push({
      conversationId: this.conversationId,
      messageStatus:'sending',
      senderId: senderEmail,
      timestamp: '',
      text: message,
      aiAnswer: ''
    })
  }
  else{
    this.messages.push({
      conversationId: this.conversationId,
      messageStatus:'sending',
      senderId: senderEmail,
      timestamp: '',
      text: message,
      aiAnswer: 'sending'
    })
  }
    // Store the message in an array or a localStorage object
    // ...
    setTimeout(() => {
      this.scrollDown(true);
    }, 0)
        // clear input field:
        this.messageForm.get('message')?.setValue("");
  }
  ngOnChanges(changes: SimpleChanges) {
    // If conversationId changes (set by parent), get messages again:
    // This also happens on initial load!
    if ('conversationId' in changes) {
      if (this.conversationId !== "0") {
        this.pendingUsers = [];
        // If there was a previous conv, leave its room on Socket IO:
        if (this.previousConversationId !== "-1")
          this.socket.emit("leave", this.previousConversationId, this.myId);
        const sessionToken = localStorage.getItem("sessionToken")
        // Join new conversation's room on Socket IO
        this.socket.emit("join", this.conversationId, this.myId,this.conversation.token,sessionToken);

        // save current conv id on previousConversationId:
        this.previousConversationId = this.conversationId;

        // Reset everything for new conversation:
        this.messages = [];
        this.currMessagePage = 0;
        this.nextMessagePageAlreadyCalled = true; // important, or else new conversation might call getMessagesFromMongoDB(false) from onScroll, triggering scrollDown(false) (taking the user 21 px from the top of the new conversation)
        
        // Retrieve past messages of this newly-opened conversation:
        this.getMessagesFromMongoDB(true); // scroll to bottom since it is initial GET of messages
      }
    }

    if ('conversation' in changes && this.conversation) {
      // Fill userIds with IDs of all users except current one:
      this.userIds = GetUserIdsStringFromArray(this.conversation.userIds, this.myId);
    }
    else{
      
    }
  }

  async getMessagesFromMongoDB(scrollBottom: boolean) {
    console.log("getting page of messages: " + this.currMessagePage);
    const sessToken = localStorage.getItem("sessionToken");
    fetch(apiURL + "/api/messages/" + this.conversationId + "?page=" + this.currMessagePage, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessToken}`
      }
    })
    .then(response => response.json())
    .then((response: any) => {
      if (response.length < 20) {
        this.currMessagePage = -1; // Set it to this value to prevent any more GETs
      }
        let newMessages: Array<Message> = [];
        
        
        for (let i = response.length - 1; i >= 0; i--) {
          const message = response[i];
          const inputDate = new Date(message.timestamp); // Convert the input date string to a Date object

          const today = new Date(); // Get the current date object

          // Check if the input date is the same as today
          if (inputDate.getDate() === today.getDate() &&
            inputDate.getMonth() === today.getMonth() &&
            inputDate.getFullYear() === today.getFullYear()) {

          // If the input date is today, print only the time
          const timeString = inputDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          newMessages.push({
            conversationId: message.conversationId,
            messageStatus: 'sent',
            senderId: message.senderId,
            timestamp: timeString,
            text: message.text,
            aiAnswer: message.aiAnswer
          })

        } else {

          // If the input date is not today, print the full date and time
          const dateTimeString = inputDate.toLocaleString();
          newMessages.push({
            conversationId: message.conversationId,
            messageStatus: 'sent',
            senderId: message.senderId,
            timestamp: dateTimeString,
            text: message.text,
            aiAnswer: message.aiAnswer
          })

}
          // const messageTimestamp = new Date(message.timestamp).toLocaleString();
          // newMessages.push({
          //   conversationId: message.conversationId,
          //   messageStatus: 'sent',
          //   senderId: message.senderId,
          //   timestamp: messageTimestamp,
          //   text: message.text,
          //   aiAnswer: message.aiAnswer
          // })
        }

        this.messages.unshift(...newMessages); // add new array of messages to the front of messages array
        console.log(this.messages)
        // const chatlogs = this.Nimbly();
        // console.log(chatlogs);
      // scrollBottom? Ok, it will scroll to the bottom after messages is updated
      // scrollBottom = false? Ok, it will scroll to 21 px away from top (To allow user to scroll up once to get next page)
      // this.playMessageSound();
      setTimeout(() => {
        this.scrollDown(scrollBottom);
      }, 0);
      // When you pass 0 as the second parameter, it means the function will execute as soon as possible, but after the current thread of execution has completed.
      // That is, after the VIEW of the app has been updated with the new messages array.
    })
    .catch(error => {
      console.error("Error while retrieving messages from MongoDB for this conversation: " + error);
    });


  }

 async sendMessage(message:string, forAI:boolean){
    let aiAnswer = ""; // stays empty if is wasn't a question for AI
    // CHECK IF IT WAS A QUESTION FOR AI, IF SO:
      // Call server.js to contact AI and get an answer before sending to socket.io
  let msgResult:string = "success"
    if (message !== "") {
      // Asking the AI:
      if (this.socket.connected){
      if (forAI) {
        await this.Nimbly(message);
      } else 
        await this.postMessage(message);
    }
    else{
      console.log("not connected to internet, cannot send message: " + message + ": going to attempt to store")
      this.storeCachedMessage(message, forAI);
      // this.messageForm.get('message')?.setValue("Lost connection...");
    }
  }
  return msgResult

}
  async handleMessage(forAI: boolean) {
 
   const message = this.messageForm.get('message')?.value;
    let msgResult = await this.sendMessage(message,forAI);
    this.messageForm.get('message')?.setValue("");

  }

  async postMessage(message: string) {
     const timestamp = new Date().toUTCString();
    let sessionToken = localStorage.getItem("sessionToken")
    // Send message to Socket.io
    //empty string for ai answer since this will only be used for posting regular messages
    this.socket.emit("message", this.conversationId, this.myId, message, timestamp, "",sessionToken);

  }

  openAddUserToConvDialog() {
    this.dialogOpener.open(AddUserToConversationComponent, {
      data: this.conversationId
    })
  }

  openExitConvDialog() {
    const dialogRef = this.dialogOpener.open(ExitConversationComponent, {
      data: this.conversationId
    })

    // exit conversation dialog needs a reference of component that opened it. Why?
    // Because if user exits, we want to reset "conversationId" to 0
    dialogRef.componentInstance.parentComponent = this;
  }

  resetConversationId() {
    this.conversationId = "0";

    // let parent (chatbox) know. Why? So, that the sibling (chat-options) can know and re-GET the conversations array:
    this.currentConversationIdChange.emit("0");
  }

   async Nimbly(prompt:string){
    const timestamp = new Date().toUTCString();
    const chatLogs = this.messages.slice(-20)
    .map((message, i) => {
      const sender = message.senderId.split('@')[0];
      const isBot = message.aiAnswer !== "";
      const senderLabel = isBot ? "Nimbly" : sender;
      let messageText:string = message.text;
      if (isBot) {
        messageText = `${sender} asked Nimbly: ${message.text} \n ${senderLabel} replied: ${message.aiAnswer}`;
      }
      return {
        role: isBot ? 'assistant' : 'user',
        content: `${senderLabel}: ${messageText}`
      };
    });
    const sessToken = localStorage.getItem("sessionToken");
   let pushPrompt = {role:"user", content:`${localStorage.getItem("email")?.toString().split('@')[0]} asked Nimbly ${prompt}`}
   let systemMessage = {role:"system", content:"You are a chat bot named Nimbly. You only need to reply not include details unless you are specifically adressing a user in the chat."}
  // push adds at end of array.
   chatLogs.push(pushPrompt);
   //unshift adds at beginning of array
   chatLogs.unshift(systemMessage);
   // prompt is the "message", and pushPrompt is what's going to actually be asked to the artificial intelligence including all of the previous context
   this.socket.emit("askNimbly",this.conversationId, this.myId, prompt, timestamp, chatLogs,sessToken);
   //
   let email = localStorage.getItem("email")
   if (email != null){

    this.messages.push({
      conversationId: this.conversationId,
      messageStatus:'sending',
      senderId: email,
      timestamp: '',
      text: prompt,
      aiAnswer: 'thinking'
    })
    this.thinkingIndicesMessages.push(this.messages.length - 1);
    this.thinking = true;
    setTimeout(() => {
      this.scrollDown(true);
    }, 0);
   }
  
  }


  mobileReturnToChatOptionsBtn(){
    this.mobileChatEvent.emit(false);
  }
}
