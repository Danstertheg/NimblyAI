import { Component, OnInit } from '@angular/core';
import { Conversation } from '../domains/conversation';
import io from "socket.io-client";
const serverUrl = "https://nimbly.glitch.me";

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit {
  // userId = localStorage.getItem("email");
  socket:any;
  currentConversationId: string = "0";
  chatOptionsClass = "chat-options";
  chatlogsClass = "chat-logs" 
  currentConversation!: Conversation;
  currentConversationToken:string = "";
  hide = true;
  shonen = false;
  constructor() { }

  ngOnInit(): void {
    this.socket = io(serverUrl);
    // this.socket.on("acceptRequestStatus", (status:string,conversationId:string,conversation:any) => {
    //   console.log("received")
    //   if (status == "success"){
    //     console.log("The request was succesfully sent");
    //     this.SetConversation({id:conversationId,conv:conversation});
    //   }
      
    // })
  }


  SetConversationId(id: string) {
    this.currentConversationId = id;
    //  this.currentConversation = {_id:Math.random().toString(), userIds:[Math.random().toString()]} 
    
  }

  SetConversation(data: any) { // sent from chat-options
    this.currentConversationId = data.id;
    this.currentConversation = data.conv;
    // this.currentConversationToken = data.token;
  }
  mobileChatlogsView(mobileChatOpened:boolean){
    console.log(mobileChatOpened)
    if (mobileChatOpened){
      this.chatOptionsClass = "hide";
      this.chatlogsClass = "show";
    }
    else {
      // return button must have been pressed to return settings 
      this.mobileReturnChatOptions();
    }
  }
  mobileReturnChatOptions(){
    this.chatOptionsClass = "show";
    this.chatlogsClass = "hide";
  }
}
