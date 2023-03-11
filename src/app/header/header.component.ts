import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PremiumModalComponent } from '../premium-modal/premium-modal/premium-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router,private modalOpener: MatDialog) {
    
  }
  onHamburger = false;
  toggleMenu(){
    this.onHamburger = !this.onHamburger;
  }
  openGetPremiumModal() {
    this.modalOpener.open(PremiumModalComponent);
  }
  sessionToken = localStorage.getItem("sessionToken");
  premiumStatus = true;
  async ngOnInit(){
    await this.checkLoggedIn();
    
// Send a GET request to the server with the user's ID or email
fetch("https://finaltest-ten.vercel.app/api/user/check-paid-status", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${this.sessionToken}`
  },
})
  .then(response => response.json())
  .then(data => {
    console.log(data)
    if (data.isPaidUser) {
      console.log("User is a paid user.");
      this.premiumStatus = true;
    } else {
      console.log("User is not a paid user.");
      this.premiumStatus = false;
    }
  })
  .catch(error => {
    console.error("Error:", error);
  });
   
  }

  goHome(){
    this.router.navigate(['/navigationPage']);

  }
  einsteinWriter(){
    this.router.navigate(['/einsteinWriter']);

  }
  einsteinChat(){
    this.router.navigate(['/einsteinChat']);

  }
  accountPage(){
    this.router.navigate(['./accountPage']);
  }
  redirectFAQ(){
    this.router.navigate(['/FAQPage']);
  }
  async checkLoggedIn(){
    if (localStorage.getItem("email") == null )
    {
    // not logged in no email stored
    this.router.navigate([''])
    }
    if (localStorage.getItem("sessionToken") == null)
    {
      // not logged in no sessionToken stored
      this.router.navigate([''])
    }
        let username = localStorage.getItem("email");
        let sessionToken = localStorage.getItem("sessionToken");
        // var loader = this.modalOpener.open(SpinnerOverlayComponentComponent);

        // user has a session token and a email stored in brower, need to check with server if the sessionToken is valid and it belongs to the corresponding email.
        const response = await fetch('https://finaltest-ten.vercel.app/api/check-auth', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${sessionToken}`
          },
      body: JSON.stringify({
        email:username,
      }),
     
    });
    if (response.ok) {
      // loader.close(SpinnerOverlayComponentComponent);

      const data = await response.json();
      console.log(data)
      console.log(data.message)
      console.log(data.reason)      
      if (data.message == "NOT_AUTHENTICATED") {
        this.router.navigate([''])
      }
      }
      else{
        // this.router.navigate([''])
      }
 
}
  async logout() {
   await fetch('https://finaltest-ten.vercel.app/api/logout')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to log out');
      })
      .then(data => {
        if (data.logoutStatus === 'success') {
          localStorage.clear()
          this.router.navigate(['']);
        } else {
          throw new Error('Failed to log out');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
}
