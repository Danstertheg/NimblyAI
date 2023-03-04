import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import io from "socket.io-client";

// Socket Io (Glitch) URL:
// const serverUrl = "https://einsteinchat-socket-io-server.glitch.me"; // no need to specify port 
const serverUrl = "https://nimbly.glitch.me"
// Vercel API URL:
const apiURL = "https://finaltest-ten.vercel.app"; // "http://localhost:5000"; 

@Component({
  selector: 'app-create-new-conversation',
  templateUrl: './create-new-conversation.component.html',
  styleUrls: ['./create-new-conversation.component.scss']
})
export class CreateNewConversationComponent implements OnInit {
  socket: any;
  // Variable for add user form input field value:
  currUserEmail = "";
  errorMessage = ""
  // Array containing all users added to this conversation so far (invites will ONLY be sent after "Create" is pressed though)
  usersToAdd: Array<string> = [];
 
  constructor(private dialogRef: MatDialogRef<CreateNewConversationComponent>) { }

  ngOnInit(): void {
    this.socket = io(serverUrl);
  }

  onAddUserEmail() {
    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    // UNCOMMENT THIS FOR DEPLOYMENT: 
    if(this.currUserEmail.toLowerCase() === localStorage.getItem("email")) {
      this.errorMessage = "You cannot add yourself to a conversation.";
      return;
    }
    if (this.currUserEmail == ""){
      this.errorMessage = "Please enter a valid user (by email)";
      return;
    }
    if (regex.test(this.currUserEmail) == false){
      this.errorMessage = "Please enter a valid user (by email)";
      return;
    }
      this.usersToAdd.push(this.currUserEmail);

    this.currUserEmail = "";
    
  }

  postNewConversationRequests() {
    if (this.usersToAdd.length <= 0 ){
      this.errorMessage = "Users to add cannot be empty";
      return
    }
    if (!this.socket.connected){
      this.errorMessage = "Error establishing connection. Please try again.";
      return
    }
    const authToken = localStorage.getItem("sessionToken");

    // POST a conversation request for each email to add:


      // fetch(apiURL + "/api/conversation-request", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${sessionToken}`
      //   },
      //   body: JSON.stringify({
      //     invitedUsers: JSON.stringify(this.usersToAdd),
      //     invitingUserId: localStorage.getItem("email")
      //   })
      // })
      // .then(response => {
      //   console.log(response);
      // })
      // .catch(error => {
      //   console.error(error);
      // });
      
      const invitedEmails = JSON.stringify(this.usersToAdd);

      const invitingEmail = localStorage.getItem("email");
      
      this.socket.emit("invitation",invitedEmails,invitingEmail,authToken);


    // close dialog (this component)
    this.dialogRef.close();
  }
}
