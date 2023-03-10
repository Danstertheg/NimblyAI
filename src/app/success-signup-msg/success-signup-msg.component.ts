import { Component, OnInit ,Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import io from "socket.io-client";

// Socket Io (Glitch) URL:
const serverUrl = "https://nimbly.glitch.me"

@Component({
  selector: 'app-success-signup-msg',
  templateUrl: './success-signup-msg.component.html',
  styleUrls: ['./success-signup-msg.component.scss']
})
export class SuccessSignupMsgComponent implements OnInit {
  socket:any;
  verified = false;
  email:string = "";
  emailStatus:string = "Sending...";
  constructor(private router: Router,private modalOpener: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any ) {
    this.socket = io(serverUrl);
    this.email = data.email;
    this.socket.emit("listenVerificationStatus",this.email);
    this.socket.on("verified",()=>{
      this.verified = true;
    })
    this.sendVerification();
   }
  redirectLogin(){
    this.router.navigate(['./loginPage']);
  }
  ngOnInit(): void {

  }
  sendVerification(){
    console.log("Sending verification email...")
    this.emailStatus = "Sending...";
    fetch('https://finaltest-ten.vercel.app/api/email-verification-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: this.email })
    })
    .then(response => response.json())
    .then(data => {
      console.log("sent")
      if (data.message == "error"){
        this.emailStatus = "An error occured with our servers. Try again later."
      }
      else{
      this.emailStatus = "Sent."
      }
    })
    .catch(error => {
      this.emailStatus = "Error Sending Verification. Try again Later."
    });
  }

}
