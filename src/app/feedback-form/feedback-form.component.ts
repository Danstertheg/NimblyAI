import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { SpinnerOverlayComponentComponent } from '../spinner-overlay-component/spinner-overlay-component.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent implements OnInit {
  feedback: FormGroup;
  errorMessage: string = '';
  // This is only necessary if the form is only going to available to logged in users.
  // sessionToken = localStorage.getItem("sessionToken");
  constructor(private router: Router) { 
    this.feedback = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      feedback: new FormControl(''),
      bugs: new FormControl('')
    });
  }

  ngOnInit(): void {
  }
  redirectAccountPage(){
    this.router.navigate(['/accountPage']);  }
 async submitFeedback(){

    const name = this.feedback.value.name;
    const email = this.feedback.value.email;
    const feedback = this.feedback.value.feedback;
    const bugs = this.feedback.value.bugs;

    let data = {
      name:name,
      email:email,
      feedback:feedback,
      bugs:bugs
    }
    await fetch("https://finaltest-ten.vercel.app/api/user/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // This is only necessary if the form is only available to logged in users 
        // "Authorization": `Bearer ${this.sessionToken}`
      },
      body:JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success == true){
          // the feedback was successfully sent, therefore the boolean is true 
        }
        else if (data.success == false){
          // the feedback was not succesfully sent, therefore the boolean is not true
          let reason = data.reason;
          this.errorMessage = reason;
          // show the reason the form failed here
        }
        else{
          // something must have went wrong
        }
      })
      .catch(error => {
        // something went wrong sending to the server? maybe internet connection.
        console.error("Error:", error);
      });
  }
}
