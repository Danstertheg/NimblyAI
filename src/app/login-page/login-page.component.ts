import { Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { SpinnerOverlayComponentComponent } from '../spinner-overlay-component/spinner-overlay-component.component';
import { SuccessSignupMsgComponent } from '../success-signup-msg/success-signup-msg.component';
import io from "socket.io-client";

const serverUrl = "https://nimbly.glitch.me";
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginform: FormGroup;
  forgotPwdForm: FormGroup;
  @Input() errorMessage: string = '';
  emailStatus:string = '';
  socket: any;
  forgotPassword = false;
  constructor(private router: Router,private modalOpener: MatDialog) {
    this.socket = io(serverUrl);
    this.loginform = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    });
    this.forgotPwdForm = new FormGroup({
      forgotEmail: new FormControl(''),
    })
  }

  ngOnInit(): void {
  }

  redirectSignup() {
    this.router.navigate(['/signupPage']);
  }
  returnToLogin(){
    this.forgotPassword = false;
  }
  forgotPasswordForm(){
    this.forgotPassword = true;
  }
  forgotEmail = "";
  async submitForgotPassword(){
    // this.forgotEmail = "test@gmail.com" 
    if (!this.socket.connected){
      this.emailStatus = "Error establishing connection to server. Please try again.";
      return
    }
    console.log("sending email to " + this.forgotPwdForm.value.forgotEmail);
    var loader = this.modalOpener.open(SpinnerOverlayComponentComponent);
    try {
      
      const response = await fetch('https://finaltest-ten.vercel.app/api/forgot-password', {
        method: 'POST',
        body: JSON.stringify({
          email: this.forgotPwdForm.value.forgotEmail
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        loader.close(SpinnerOverlayComponentComponent);
        // password reset link successfully sent
  
         const data = await response.json();
        
      //   if (data.sessionToken) {
      //   // console.log(data.sessionToken);
      // }
      console.log(data.message)
      if (data.message == "success"){
        this.emailStatus = "Success! Please check your email for a password reset link. Valid for 1 hour.";
      }
      else{
        this.emailStatus = "Something went wrong, please try again later.";
      }
  
      } else {
        const data = await response.json();
        loader.close(SpinnerOverlayComponentComponent);
        this.errorMessage = 'Invalid username or password';
  
      }
    } catch (error) {
      this.errorMessage = 'An error occured please try again later';
      loader.close(SpinnerOverlayComponentComponent);
    }
    
  }
  async login() {
    // console.log(this.loginform.value);
    let username = this.loginform.value.email;
    let password = this.loginform.value.password;
    if (!this.socket.connected)
    {
      this.errorMessage = "Error establishing connection to server. Please try again.";
      return
    }
    // Send a POST request to the server to log in the user
    var loader = this.modalOpener.open(SpinnerOverlayComponentComponent);
  try {
    const response = await fetch('https://finaltest-ten.vercel.app/api/login', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        email:username,
        password:password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json())
    .then(data => {
      loader.close(SpinnerOverlayComponentComponent);
      console.log(data)
      console.log(data.message)
      console.log(data.reason)
      console.log(data.status)
      if (data.status == "SUCCESS"){
        localStorage.setItem('email', username.toLowerCase());
        localStorage.setItem('sessionToken', data.sessionToken);
        this.router.navigate(['/navigationPage'])  
      }
      else if (data.status == "FAIL"){
        if (data.reason == "NOT_VERIFIED"){
          var verifyModal = this.modalOpener.open(SuccessSignupMsgComponent,{data: { email: username }});
          this.errorMessage = "Please verify your email."
          // not verified user, verify email....
        }
        else {
          this.errorMessage = 'Invalid username or password'
        }
      }
    })
    // if (response.ok) {


      

      // const data = await response.json();
      
      
    //   if (data.sessionToken) {
    //   // console.log(data.sessionToken);
    // }
      // localStorage.setItem('email', username.toLowerCase());
      // localStorage.setItem('sessionToken', data.sessionToken);
      // this.router.navigate(['/navigationPage'])

    // } else {
      // const data = await response.json();
      // loader.close(SpinnerOverlayComponentComponent);
      // this.errorMessage = 'Invalid username or password';

    // }
  } catch (error) {

    this.errorMessage = 'An error occured please try again later';
    loader.close(SpinnerOverlayComponentComponent);
  }
  }
}
