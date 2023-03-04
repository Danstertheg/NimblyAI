import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { SpinnerOverlayComponentComponent } from '../spinner-overlay-component/spinner-overlay-component.component';
import io from "socket.io-client";
import { SuccessSignupMsgComponent } from '../success-signup-msg/success-signup-msg.component';
const serverUrl = "https://nimbly.glitch.me";

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {
  @Input() errorMessage: string = '';
  signupform: FormGroup;
  socket:any;

  constructor(private router: Router,private modalOpener: MatDialog) {
    
    this.signupform = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    });


  }

  ngOnInit(): void {
    this.socket = io(serverUrl);

  }
  redirectLogin(){
    this.router.navigate(['/loginPage']);
  }
  async signup (){
    if (!this.socket.connected){
      this.errorMessage = "Error establishing connection to the server. Please try again";
      return
    }
    let email = this.signupform.value.email;
    let password = this.signupform.value.password;
    if (email == ""){
      this.errorMessage = "Email field cannot be left empty.";
      return
    }
    if (password.length < 8){
      this.errorMessage = 'Password must be at least 8 characters long';
    }
     // Send a sign up request to the server
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://finaltest-ten.vercel.app/api/signup');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = () => {
    loader.close(SpinnerOverlayComponentComponent);

    // document.getElementById("spin").style.display = "none";
    if (xhr.status === 200) {
      // Sign up successful, redirect to login page
      this.modalOpener.open(SuccessSignupMsgComponent)
      // this.redirectLogin();    
    } else {
      // Sign up failed, display error message
      const response = JSON.parse(xhr.responseText);
      this.errorMessage = response.message;
    }
  };
  var loader = this.modalOpener.open(SpinnerOverlayComponentComponent);
  // document.getElementById("spin").style.display = "block";
  xhr.send(JSON.stringify({ email: email, password: password }));



  }
}
