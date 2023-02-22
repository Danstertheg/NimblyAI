import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { ConversationRequest } from 'src/app/domains/conversation-request';

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

  // Reference to component to opened this dialog (to call a function to GET requests again upon .close()-ing this)
  // This was set by parent after it used .open() (parent is conversation-request component)
  parentComponent: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConversationRequest,
    private dialogRef: MatDialogRef<HandleConversationRequestComponent>) { // second parameter is to close dialog
    this.convReq = data;
   }

  ngOnInit(): void {
  }

  respondToRequest(accept: boolean) {
    const sessionToken = localStorage.getItem("sessionToken");

    if (accept) {
      fetch(apiURL + "/api/conversation/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          invitedUserId: this.convReq.invitedId,
          invitingUserId: this.convReq.invitingId,
          conversationId: this.convReq.conversationId,
          convReqId: this.convReq._id
        })
      }) 
      .then(response => {
        if (response.ok) {
          console.log('Conversation request deleted successfully. Conversation accepted successfully.');
          
          // Trigger a function in component that opened this modal
          this.parentComponent.onConvRequestResponded();
        } else {
          throw new Error(`Failed to accept conversation request (status ${response.status}). (POST to /conversation)`);
        }
      })
      .catch(error => {
        console.error('An error occurred while accepting the conversation request (POST to /conversation):', error);
      });

    } else {
      // Reject request - did not accept, so don't create/edit a conversation entry:
      fetch(apiURL + "/api/conversation-request/" + this.convReq._id, {
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
