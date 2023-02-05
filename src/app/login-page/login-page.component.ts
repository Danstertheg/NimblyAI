import { Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginform: FormGroup;
  @Input() errorMessage: string = '';
  constructor(private router: Router) {
    this.loginform = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    });
  }

  ngOnInit(): void {
  }

  redirectSignup() {
    this.router.navigate(['/signupPage']);
  }

  async login() {
    console.log(this.loginform.value);
    let username = this.loginform.value.email;
    let password = this.loginform.value.password;
    // Send a POST request to the server to log in the user
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
    });
    if (response.ok) {


      const data = await response.json();
      
      if (data.sessionToken) {
      console.log(data.sessionToken);
    }


      localStorage.setItem('email', username);
      console.log(data.message);
      console.log(data.error);
    
      // If the login was successful, redirect the user to the home page
      
      localStorage.setItem('sessionToken', data.sessionToken);
    
      console.log("sending session token" + JSON.stringify(data.sessionToken))
      this.router.navigate(['/einsteinWriter'])

    } else {
      const data = await response.json();
  
      this.errorMessage = 'Invalid username or password';

    }
  } catch (error) {
    this.errorMessage = 'An error occured please try again later';

  }
  }
}
