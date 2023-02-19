import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user-to-conversation',
  templateUrl: './add-user-to-conversation.component.html',
  styleUrls: ['./add-user-to-conversation.component.scss', '../create-new-conversation/create-new-conversation.component.scss']
})
export class AddUserToConversationComponent implements OnInit {
  // Passed in from chatlogs that triggered this dialog. Set In constructor
  conversationId: string;

  newUserEmail = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) { 
    this.conversationId = data;
  }

  ngOnInit(): void {
  }

}
