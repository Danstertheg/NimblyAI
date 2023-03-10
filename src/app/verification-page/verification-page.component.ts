import { Component, OnInit } from '@angular/core';

import { ActivatedRoute,Router  } from '@angular/router';
import io from "socket.io-client";

// Socket Io (Glitch) URL:
const serverUrl = "https://nimbly.glitch.me"
@Component({
  selector: 'app-verification-page',
  templateUrl: './verification-page.component.html',
  styleUrls: ['./verification-page.component.scss']
})
export class VerificationPageComponent implements OnInit {
  socket:any;
  token?: string;
  verified:boolean = false;
  verificationStatus = ""
  constructor(private route: ActivatedRoute,private router: Router) { 

  }

  ngOnInit(): void {
    this.socket = io(serverUrl);
    const tokenParam = this.route.snapshot.queryParamMap.get('token');
    const tokenID = this.route.snapshot.queryParamMap.get('id');
    console.log(tokenParam);
    this.token = tokenParam !== null ? tokenParam : '';
        fetch('https://finaltest-ten.vercel.app/api/email-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
      token:tokenParam,
      id:tokenID 
    })
    })
    .then(response => response.json())
    .then(data => {
      this.verificationStatus = data.message;
      if (data.message == "success"){
        this.verified = true;
        this.verificationStatus = "Email has been successfully verified."
      }
      else{
        this.verificationStatus = "Failed Email Verification. " + data.message + " Try again."
        this.verified = false;
      }
    })
    .catch(error => {
      this.verified = false;
      this.verificationStatus = "Server error. Try again Later."
    });

  }
redirectLogin(){
  this.router.navigate(['/loginPage']);
}
}
