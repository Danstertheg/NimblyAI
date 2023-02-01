import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-banner',
  templateUrl: './landing-banner.component.html',
  styleUrls: ['./landing-banner.component.scss']
})
export class LandingBannerComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
  }
  redirectSignup(){
    this.router.navigate(['/signupPage']);
  }
  redirectLogin(){
    this.router.navigate(['/loginPage']);
  }
}
