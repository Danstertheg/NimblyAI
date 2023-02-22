import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, ElementRef   } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import io from "socket.io-client";
import { Message } from '../domains/message';
import { AddUserToConversationComponent } from '../chat-dialogs/add-user-to-conversation/add-user-to-conversation.component';
import { ExitConversationComponent } from '../chat-dialogs/exit-conversation/exit-conversation.component';
import { SpinnerOverlayComponentComponent } from '../spinner-overlay-component/spinner-overlay-component.component';
import { Conversation } from '../domains/conversation';
import { GetUserIdsStringFromArray } from '../chat-option/chat-option.component';

// Socket Io (Glitch) URL:
const serverUrl = "https://einsteinchat-socket-io-server.glitch.me"; // no need to specify port 

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

  socket: any;

  // Conversation ID of this chat log component (inputted by parent) - initial value is "0"
  @Input() conversationId!: string;
  @Input() conversation!: Conversation;

  // String to display for other users (OTHER THAN current user) IDs:
  userIds = ""; 

  // Current page of messages:
  currMessagePage = 0;
  private nextMessagePageAlreadyCalled = false;

  // Event emitter to trigger parent function when current conversationId changes:
  @Output() currentConversationIdChange: EventEmitter<string> = new EventEmitter<string>();

  // To leave() the last conversation on socket-io. Or not, if it is initial value "-1"
  previousConversationId = '-1';

  // User's unique identifier is their email
  myId = localStorage.getItem("email") || "";

  // Message array to be pulled from DB
  messages: Array<Message> = [];
  
  // Handle for form to send message
  messageForm: FormGroup;

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
  ngOnInit(): void {
    this.socket = io(serverUrl);

    this.socket.on("connect", () => {
      console.log("Successfully connected to glitch server!");      

      // How client should react when a new message arrives (including one of their own being broadcasted):
      this.socket.on("message", (senderEmail: string, timestamp: string, text: string, aiAnswer?: string) => {
        // Add to local array of messages
        this.messages.push({
          conversationId: this.conversationId,
          senderId: senderEmail,
          timestamp: timestamp,
          text: text,
          aiAnswer: aiAnswer
        })

        setTimeout(() => {
          this.scrollDown(true);
        }, 0)
        this.playMessageSound();        
      })
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    // If conversationId changes (set by parent), get messages again:
    // This also happens on initial load!
    if ('conversationId' in changes) {
      if (this.conversationId !== "0") {
        // If there was a previous conv, leave its room on Socket IO:
        if (this.previousConversationId !== "-1")
          this.socket.emit("leave", this.previousConversationId, this.myId);

        // Join new conversation's room on Socket IO
        this.socket.emit("join", this.conversationId, this.myId);

        // save current conv id on previousConversationId:
        this.previousConversationId = this.conversationId;

        // Retrieve past messages of this newly-opened conversation:
        this.messages = [];
        this.getMessagesFromMongoDB(true); // scroll to bottom since it is initial GET of messages
      }
    }

    if ('conversation' in changes && this.conversation) {
      // Fill userIds with IDs of all users except current one:
      this.userIds = GetUserIdsStringFromArray(this.conversation.userIds, this.myId);
    }
  }

  getMessagesFromMongoDB(scrollBottom: boolean) {
    console.log("getting page of messages: " + this.currMessagePage);

    fetch(apiURL + "/api/messages/" + this.conversationId + "?page=" + this.currMessagePage, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionToken}`
      }
    })
    .then(response => response.json())
    .then((response: any) => {
      if (response.length < 5) {
        this.currMessagePage = -1; // Set it to this value to prevent any more GETs
      }
        let newMessages: Array<Message> = [];

        for (let i = response.length - 1; i >= 0; i--) {
          const message = response[i];
          
          newMessages.push({
            conversationId: message.conversationId,
            senderId: message.senderId,
            timestamp: message.timestamp,
            text: message.text,
            aiAnswer: message.aiAnswer
          })
        }

        this.messages.unshift(...newMessages); // add new array of messages to the front of messages array
      

      // scrollBottom? Ok, it will scroll to the bottom after messages is updated
      // scrollBottom = false? Ok, it will scroll to 21 px away from top (To allow user to scroll up once to get next page)
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

  handleMessage(forAI: boolean) {
    const message = this.messageForm.get('message')?.value;

    let aiAnswer = ""; // stays empty if is wasn't a question for AI
    // CHECK IF IT WAS A QUESTION FOR AI, IF SO:
      // Call server.js to contact AI and get an answer before sending to socket.io

    if (message !== "") {
      // Asking the AI:
      if (forAI) {
        this.openAI(message);
      } else 
        this.postMessage(message, aiAnswer);
    }
  }

  postMessage(message: string, aiAnswer: string) {
    const timestamp = new Date().toLocaleString();

    // Send message to Socket.io
    this.socket.emit("message", this.conversationId, this.myId, message, timestamp, aiAnswer);

    // Post message to MongoDb "Messages" collection:
    fetch(apiURL + "/api/messages/" + this.conversationId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionToken}`
      },
      body: JSON.stringify({
        senderId: this.myId,
        timestamp: timestamp,
        text: message,
        aiAnswer: aiAnswer
      })
    }) 
    .then(response => {
      if (response.ok) {
        console.log('Message sent successfully.');

      } else {
        throw new Error(`Failed to send message to MongoDB (status ${response.status}). (POST to /messages)`);
      }
    })
    .catch(error => {
      console.error('An error occurred while accepting the conversation request (POST to /conversation):', error);
    });

    // clear input field:
    this.messageForm.get('message')?.setValue("");
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


  openAI(prompt: string) {  
    let engine = 'text-davinci-002';

    const request = new XMLHttpRequest();
    request.open('POST', 'https://finaltest-ten.vercel.app/api/handleAI/premium');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', `Bearer ${sessionToken}`);

    request.onload = () =>  {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        const response = JSON.parse(request.responseText);
        const completedText = response.completedText;

        // close loading modal:
        loader.close(SpinnerOverlayComponentComponent);

        if (response.credits){
          console.log(response.credits + " new credit amount")
          
          // BOB-TODO: Reduce credit amount by one:
          // this.creditAmount = response.credits;
        }

        console.log("AI Responded to '" + prompt + "': " + completedText)
        this.postMessage(prompt, completedText);
      } else {
        // There was an error
        console.error("ERROR when sending to OpenAI: " + request.responseText);
      }
    };

    request.onerror = function() {
      console.error('An error occurred while making the request');
    };

    const data = {
      model: engine,
      prompt: prompt
    };
    var loader = this.dialogOpener.open(SpinnerOverlayComponentComponent);
    
    request.send(JSON.stringify(data));
  }

}
