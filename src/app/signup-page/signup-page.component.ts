import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
  }
  redirectLogin(){
    this.router.navigate(['/loginPage']);
  }
}
