import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PremiumModalComponent } from '../premium-modal/premium-modal/premium-modal.component';

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

  ngOnInit(): void {
  }
  redirectSignup(){
    this.router.navigate(['/signupPage']);
  }
  redirectLogin(){
    this.router.navigate(['/loginPage']);
  }
}
