import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PremiumModalComponent } from '../premium-modal/premium-modal/premium-modal.component';
import { SpinnerOverlayComponentComponent } from '../spinner-overlay-component/spinner-overlay-component.component';

@Component({
  selector: 'app-landing-banner',
  templateUrl: './landing-banner.component.html',
  styleUrls: ['./landing-banner.component.scss']
})
export class LandingBannerComponent implements OnInit {

  constructor(private router: Router, private modalOpener: MatDialog) {}

  openGetPremiumModal() {
    this.modalOpener.open(PremiumModalComponent);
  }
  async checkLoggedIn(){
    if (localStorage.getItem("email") !== null ){
      if (localStorage.getItem("sessionToken") !== null){

        let username = localStorage.getItem("email");
        let sessionToken = localStorage.getItem("sessionToken");
        var loader = this.modalOpener.open(SpinnerOverlayComponentComponent);

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
    if (response) {
      loader.close(SpinnerOverlayComponentComponent);

      const data = await response.json();
      
      if (data.message == "Authenticated") {
        this.router.navigate(['/einsteinChat'])
      }
      }
    }
  }
}
  ngOnInit(): void {
    this.checkLoggedIn();
  }
  redirectSignup(){
    this.router.navigate(['/signupPage']);
  }
  redirectLogin(){
    this.router.navigate(['/loginPage']);
  }
}
