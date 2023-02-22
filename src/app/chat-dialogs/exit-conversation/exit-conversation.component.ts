import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

// Vercel API URL: 
const apiURL = "https://finaltest-ten.vercel.app"; // "http://localhost:5000"; 

const sessionToken = localStorage.getItem("sessionToken");

@Component({
  selector: 'app-exit-conversation',
  templateUrl: './exit-conversation.component.html',
  styleUrls: ['./exit-conversation.component.scss', '../create-new-conversation/create-new-conversation.component.scss']
})
export class ExitConversationComponent implements OnInit {
  // set by parent:
  conversationId: string;

  // Reference to component to opened this dialog 
  // This was set by parent after it used .open()
  parentComponent: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: string,
    private dialogRef: MatDialogRef<ExitConversationComponent>) {
      this.conversationId = data;
  }

  ngOnInit(): void {
  }

  confirmExit(confirm: boolean) {
    if (confirm) {
      fetch(apiURL + "/api/conversation/" + this.conversationId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          exitingUserId: localStorage.getItem("email")
        })
      }) 
      .then(response => {
        if (response.ok) {
          console.log('Conversation Exited successfully.');    
          
          // Change currentConversationId to default (0):
          this.parentComponent.resetConversationId();

        } else {
          throw new Error(`Failed to exit conversation (status ${response.status}). (DELETE to /conversation)`);
        }
      })
      .catch(error => {
        console.error('An error occurred while exiting the conversation (DELETE to /conversation):', error);
      });
    }

    this.dialogRef.close();
  }
}
