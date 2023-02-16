import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import io from "socket.io-client";
import { Message } from '../domains/message';

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
  messageForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
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
}
