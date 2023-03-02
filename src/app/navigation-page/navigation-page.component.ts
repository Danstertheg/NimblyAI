import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navigation-page',
  templateUrl: './navigation-page.component.html',
  styleUrls: ['./navigation-page.component.scss']
})
export class NavigationPageComponent implements OnInit {

  constructor(private router: Router) { }
  email = localStorage.getItem("email")?.toString().toLowerCase();
  ngOnInit(): void {
  }
  tool(){
    this.router.navigate(['/einsteinWriter']);

  }
  chat(){
    this.router.navigate(['/einsteinChat']);

  }
}
