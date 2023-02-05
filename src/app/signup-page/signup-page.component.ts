import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {
  @Input() errorMessage: string = '';
  signupform: FormGroup;
  constructor(private router: Router) {
    this.signupform = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    });


  }

  ngOnInit(): void {
  }
  redirectLogin(){
    this.router.navigate(['/loginPage']);
  }
  async signup (){
    let email = this.signupform.value.email;
    let password = this.signupform.value.password;

     // Send a sign up request to the server
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://finaltest-ten.vercel.app/api/signup');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = () => {
    // document.getElementById("spin").style.display = "none";
    if (xhr.status === 200) {
      // Sign up successful, redirect to login page
      this.redirectLogin();    
    } else {
      // Sign up failed, display error message
      const response = JSON.parse(xhr.responseText);
      alert(response.message);
    }
  };
  // document.getElementById("spin").style.display = "block";
  xhr.send(JSON.stringify({ email: email, password: password }));



  }
}
