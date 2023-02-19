import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-new-conversation',
  templateUrl: './create-new-conversation.component.html',
  styleUrls: ['./create-new-conversation.component.scss']
})
export class CreateNewConversationComponent implements OnInit {
  // Variable for add user form input field value:
  currUserEmail = "";

  // Array containing all users added to this conversation so far (invites will ONLY be sent after "Create" is pressed though)
  usersToAdd: Array<string> = [];

  constructor() { }

  ngOnInit(): void {
  }

  onAddUserEmail() {
    this.usersToAdd.push(this.currUserEmail);
    this.currUserEmail = "";
  }
}
