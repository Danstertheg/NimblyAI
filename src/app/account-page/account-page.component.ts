import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { PremiumModalComponent } from '../premium-modal/premium-modal/premium-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {
  email = localStorage.getItem("email");
  accountNavClass:string = "";
  accountRenderingClass:string = "hideMobile";
  accountPage = true;
  securityPage = false;
  currentTab:string = 'Account';
  premiumStatus:string = 'Free Member';
  isPaidUser = false;
  pwdChangedMsg:string = '';
  creditAmount = 0;
  sessionToken = localStorage.getItem("sessionToken");
  lastBill = '';
  nextBill = '';
  changePwd: FormGroup;
  constructor(private modalOpener: MatDialog,private router: Router) {
    this.changePwd = new FormGroup({
      currentPassword: new FormControl(''),
      newPassword: new FormControl('')
    })
   }
   mobileReturnToAccountNav(){
    this.accountRenderingClass = "hideMobile";
    this.accountNavClass = "show";
   }
  
  switchTab(title:string){
    this.currentTab = title;
    if (title == "Account")
    {
      this.accountPage = true;
      this.securityPage = false;
    }
    else if (title == "Security"){
      this.accountPage = false;
      this.securityPage = true;
    }
    this.accountRenderingClass = "";
    this.accountNavClass = "hideMobile";
  }

  ngOnInit(): void {
    localStorage.getItem("sessionToken");
    
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
          this.premiumStatus = "Premium Member";
          this.isPaidUser = true;
          this.lastBill = "2/16/2023";
          this.nextBill = "3/16/2023";
        } else {
          console.log("User is not a paid user.");
          this.isPaidUser = false;
          this.premiumStatus = "Free Member";
          this.lastBill = '';
          this.nextBill = ''
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });




      fetch("https://finaltest-ten.vercel.app/api/user/creditBalance", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.sessionToken}`
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          this.creditAmount = data.credits;
        })
        .catch(error => {
          console.error("Error:", error);
        });



  }
  upgradeToPremium(){
    this.modalOpener.open(PremiumModalComponent);
  }
  async cancelSubscription(){
    const response = await fetch('https://finaltest-ten.vercel.app/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.sessionToken}`,
        'Content-Type': 'application/json'
      },
    });
    const json = await response.json();
    if (response.status === 200) {
      // Subscription canceled successfully
      // create subscription canceled message
      // alert(json.message);
      // window.location.href = "accountPage"; 
      alert("Subscription successfully canceled! Refresh to see changes.")
      this.isPaidUser = false;
      this.premiumStatus = "Free member";
      this.lastBill = '';
      this.nextBill = '';

      // logout();
    } else {
      // There was an error
      console.error(json.error);
    }
  
  }

  async updatePasswordByCurrentPassword() {
    const email = localStorage.getItem("email");
    
    const response = await fetch('https://finaltest-ten.vercel.app/api/update-password-by-current-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.sessionToken}` // Replace with your actual access token
      },
      body: JSON.stringify({ email:email,currentPassword:this.changePwd.value.currentPassword, newPassword: this.changePwd.value.newPassword})
    });
    const data = await response.json();
    this.pwdChangedMsg = data.message;
    if (response.ok) {
     

      return data;
    } else {
      throw new Error(data.error);
    }
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
