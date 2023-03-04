import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { ConversationRequest } from 'src/app/domains/conversation-request';
import io from "socket.io-client";

// Socket Io (Glitch) URL:
// const serverUrl = "https://einsteinchat-socket-io-server.glitch.me"; // no need to specify port 
const serverUrl = "https://nimbly.glitch.me"
// Vercel API URL:
const apiURL = "https://finaltest-ten.vercel.app"; // "http://localhost:5000"; 

@Component({
  selector: 'app-handle-conversation-request',
  templateUrl: './handle-conversation-request.component.html',
  styleUrls: ['./handle-conversation-request.component.scss', '../create-new-conversation/create-new-conversation.component.scss']
})
export class HandleConversationRequestComponent implements OnInit {
  // set by parent
  convReq: ConversationRequest; 
  errorMessage:string = ""
  // Reference to component to opened this dialog (to call a function to GET requests again upon .close()-ing this)
  // This was set by parent after it used .open() (parent is conversation-request component)
  parentComponent: any;
  socket:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConversationRequest,
    private dialogRef: MatDialogRef<HandleConversationRequestComponent>) { // second parameter is to close dialog
    this.convReq = data;
   }

  ngOnInit(): void {
    this.socket = io(serverUrl);
    
  }

  async respondToRequest(accept: boolean) {
    const sessionToken = localStorage.getItem("sessionToken");
    if (!this.socket.connected){
      this.errorMessage = "Error establishing connection to the server. Please try again.";
      return
    }

    if (accept) {
      this.socket.emit("acceptRequest",this.convReq.invitedId, this.convReq.invitingId, this.convReq.conversationId, this.convReq._id, this.convReq.token, sessionToken);

      // await fetch(apiURL + "/api/conversation/", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${sessionToken}`
      //   },
      //   body: JSON.stringify({
      //     invitedUserId: this.convReq.invitedId,
      //     invitingUserId: this.convReq.invitingId,
      //     conversationId: this.convReq.conversationId,
      //     convReqId: this.convReq._id,
      //     token:this.convReq.token,
      //   })
      // }) 
      // .then(response => {
      //   if (response.ok) {
      //     console.log('Conversation request deleted successfully. Conversation accepted successfully.');
          
      //     // Trigger a function in component that opened this modal
      //     this.parentComponent.onConvRequestResponded();
      //   } else {
      //     throw new Error(`Failed to accept conversation request (status ${response.status}). (POST to /conversation)`);
      //   }
      // })
      // .catch(error => {
      //   console.error('An error occurred while accepting the conversation request (POST to /conversation):', error);
      // });

    } else {
      // Reject request - did not accept, so don't create/edit a conversation entry:
      await fetch(apiURL + "/api/conversation-request/" + this.convReq._id, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${sessionToken}`
        }
      }) 
      .then(response => {
        if (response.ok) {
          console.log('Conversation request deleted successfully');
          
          // Trigger a function in component that opened this modal
          this.parentComponent.onConvRequestResponded();
        } else {
          throw new Error(`Failed to delete conversation request (status ${response.status})`);
        }
      })
      .catch(error => {
        console.error('An error occurred while deleting the conversation request:', error);
      });

    }
    
    // close dialog (this component)
    this.dialogRef.close();
  }
}
