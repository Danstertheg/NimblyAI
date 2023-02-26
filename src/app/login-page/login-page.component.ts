import { Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { SpinnerOverlayComponentComponent } from '../spinner-overlay-component/spinner-overlay-component.component';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginform: FormGroup;
  forgotPwdForm: FormGroup;
  @Input() errorMessage: string = '';
  emailStatus:string = ''
  forgotPassword = false;
  constructor(private router: Router,private modalOpener: MatDialog) {
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

    console.log("sending email to " + this.forgotPwdForm.value.forgotEmail);
    try {
      var loader = this.modalOpener.open(SpinnerOverlayComponentComponent);
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
    
        this.errorMessage = 'Invalid username or password';
  
      }
    } catch (error) {
      this.errorMessage = 'An error occured please try again later';
  
    }
    
  }
  async login() {
    // console.log(this.loginform.value);
    let username = this.loginform.value.email;
    let password = this.loginform.value.password;
    // Send a POST request to the server to log in the user
  try {
    var loader = this.modalOpener.open(SpinnerOverlayComponentComponent);
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
    });
    if (response.ok) {

      loader.close(SpinnerOverlayComponentComponent);

      const data = await response.json();
      
      if (data.sessionToken) {
      // console.log(data.sessionToken);
    }


      localStorage.setItem('email', username.toLowerCase());
      // console.log(data.message);
      // console.log(data.error);
    
      // If the login was successful, redirect the user to the home page
      
      localStorage.setItem('sessionToken', data.sessionToken);
    
      // console.log("sending session token" + JSON.stringify(data.sessionToken))
      this.router.navigate(['/einsteinChat'])

    } else {
      const data = await response.json();
  
      this.errorMessage = 'Invalid username or password';

    }
  } catch (error) {
    this.errorMessage = 'An error occured please try again later';

  }
  }
}
