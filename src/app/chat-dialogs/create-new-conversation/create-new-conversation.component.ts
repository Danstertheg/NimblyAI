import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

// Vercel API URL:
const apiURL = "http://localhost:5000"; //"https://finaltest-ten.vercel.app/";

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

  constructor(private dialogRef: MatDialogRef<CreateNewConversationComponent>) { }

  ngOnInit(): void {
  }

  onAddUserEmail() {
    // UNCOMMENT THIS FOR DEPLOYMENT: 
    // if(this.currUserEmail === localStorage.getItem("email")) 
    //   alert("You cannot add yourself to a conversation. That's default behavior, sir");
    // else
      this.usersToAdd.push(this.currUserEmail);

    this.currUserEmail = "";
  }

  postNewConversationRequests() {
    const sessionToken = localStorage.getItem("sessionToken");

    // POST a conversation request for each email to add:
    for (const email of this.usersToAdd) {
      fetch(apiURL + "/api/conversation-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          invitedUserId: email,
          invitingUserId: localStorage.getItem("email")
        })
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error(error);
      });
    }

    // close dialog (this component)
    this.dialogRef.close();
  }
}
