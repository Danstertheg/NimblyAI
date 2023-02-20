import { Component, Input, OnInit, OnChanges, SimpleChanges  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import io from "socket.io-client";
import { Message } from '../domains/message';
import { AddUserToConversationComponent } from '../chat-dialogs/add-user-to-conversation/add-user-to-conversation.component';

// Socket Io (Glitch) URL:
const serverUrl = "https://einsteinchat-socket-io-server.glitch.me"; // no need to specify port 

// Vercel API URL:
const apiURL = "http://localhost:5000"; //"https://finaltest-ten.vercel.app/";

// JWT:
const sessionToken = localStorage.getItem("sessionToken");

/*
  TODO:
   - Emit "leave" (with convId and userId) when user clicks on another conversation
   - Pull messages from MongoDB and load them into this.messages (make sure DB implementation mirrors Message interface)
*/

@Component({
  selector: 'app-chatlogs',
  templateUrl: './chatlogs.component.html',
  styleUrls: ['./chatlogs.component.scss']
})
export class ChatlogsComponent implements OnInit, OnChanges {
  socket: any;

  // Conversation ID of this chat log component (inputted by parent) - initial value is "0"
  @Input() conversationId!: string;

  // To leave() the last conversation on socket-io. Or not, if it is initial value "-1"
  previousConversationId = '-1';

  // User's unique identifier is their email
  myId = localStorage.getItem("email");

  // Message array to be pulled from DB
  messages: Array<Message> = [];
  
  // Handle for form to send message
  messageForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private addUserToConversation: MatDialog) {
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
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
        this.getMessagesFromMongoDB();
      }
    }
  }

  getMessagesFromMongoDB() {
    fetch(apiURL + "/api/messages/" + this.conversationId, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionToken}`
      }
    })
    .then(response => response.json())
    .then((response: any) => {
      for(const message of response) {
        this.messages.push({
          conversationId: message.conversationId,
          senderId: message.senderId,
          timestamp: message.timestamp,
          text: message.text,
          aiAnswer: message.aiAnswer
        })
      }
    })
    .catch(error => {
      console.error("Error while retrieving messages from MongoDB for this conversation: " + error);
    });
  }

  sendMessage() {
    const message = this.messageForm.get('message')?.value;

    const aiAnswer = ""; // stays empty if is wasn't a question for AI
    // CHECK IF IT WAS A QUESTION FOR AI, IF SO:
      // Call server.js to contact AI and get an answer before sending to socket.io

    if (message !== "") {
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
  }

  openAddUserToConvDialog() {
    this.addUserToConversation.open(AddUserToConversationComponent, {
      data: this.conversationId
    })
  }
}
