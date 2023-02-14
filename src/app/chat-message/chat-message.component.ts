import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss', '../chatlogs/chatlogs.component.scss']
})
export class ChatMessageComponent implements OnInit {
  // sender: if true (right side), if false (left side)
  @Input() sender?: boolean;

  @Input() message?: string;
  @Input() timestamp?: string;



  constructor() { }

  ngOnInit(): void {
  }

}
