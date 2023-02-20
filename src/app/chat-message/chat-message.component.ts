import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../domains/message';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss', '../chatlogs/chatlogs.component.scss']
})
export class ChatMessageComponent implements OnInit {
  // User's unique identifier is their email
  myId = localStorage.getItem("email");

  // Message itself:
  @Input() message!: Message;

  constructor() { }

  ngOnInit(): void {
  }

}
