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

  constructor(private router: Router,private modalOpener: MatDialog) {}
  onHamburger = false;
  toggleMenu(){
    this.onHamburger = !this.onHamburger;
  }
  openGetPremiumModal() {
    this.modalOpener.open(PremiumModalComponent);
  }
  sessionToken = localStorage.getItem("sessionToken");
  premiumStatus = true;
  ngOnInit(): void {

    
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
  einsteinWriter(){
    this.router.navigate(['/einsteinWriter']);

  }
  einsteinChat(){
    this.router.navigate(['/einsteinChat']);

  }
  accountPage(){
    this.router.navigate(['./accountPage']);
  }
  logout() {
    fetch('https://finaltest-ten.vercel.app/api/logout')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to log out');
      })
      .then(data => {
        if (data.logoutStatus === 'success') {
          window.location.href = '';
        } else {
          throw new Error('Failed to log out');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
}
