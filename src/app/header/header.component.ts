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
  openGetPremiumModal() {
    this.modalOpener.open(PremiumModalComponent);
  }
  ngOnInit(): void {

    
  }
  einsteinWriter(){
    this.router.navigate(['/einsteinWriter']);

  }
  einsteinChat(){
    this.router.navigate(['/einsteinChat']);

  }

}
