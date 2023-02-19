import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import io from "socket.io-client";
import { Message } from '../domains/message';
import { AddUserToConversationComponent } from '../chat-dialogs/add-user-to-conversation/add-user-to-conversation.component';

const serverUrl = "https://einsteinchat-socket-io-server.glitch.me"; // no need to specify port 

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
export class ChatlogsComponent implements OnInit {
  socket: any;

  // Conversation ID of this chat log component (inputted by parent)
  @Input() conversationId?: string;

  // User's unique identifier is their email
  myId = localStorage.getItem("email");

  // Message array to be pulled from DB
  messages?: Array<Message> = [{
    senderEmail: this.myId || "your email",
    timestamp: "2:45 PM",
    text: "This is a test message, as if written by you",
  }];
  
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
      console.log("Successfully connected to glitch server!")

      // Join conversation on socket-io:
      this.socket.emit("join", this.conversationId, this.myId);

      // How client should react when a new message arrives (including one of their own being broadcasted):
      this.socket.on("message", (senderEmail: string, timestamp: string, text: string, aiAnswer?: string) => {
        // Add to local array of messages
        this.messages?.push({
          senderEmail: senderEmail,
          timestamp: timestamp,
          text: text,
          aiAnswer: aiAnswer
        })
      })
    })
  }

  sendMessage() {
    const message = this.messageForm.get('message')?.value;

    const aiAnswer = ""; // stays empty if is wasn't a question for AI
    // CHECK IF IT WAS A QUESTION FOR AI, IF SO:
      // Call server.js to contact AI and get an answer before sending to socket.io

    if (message !== "") {
      const timestamp = new Date().toLocaleString();
      
      // Send message to 
      this.socket.emit("message", this.conversationId, this.myId, message, timestamp, aiAnswer);

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
