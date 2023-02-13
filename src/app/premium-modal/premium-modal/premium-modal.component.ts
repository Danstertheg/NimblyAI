import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PremiumPageComponent } from 'src/app/premium-page/premium-page.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-premium-modal',
  templateUrl: './premium-modal.component.html',
  styleUrls: ['./premium-modal.component.scss']
})
export class PremiumModalComponent implements OnInit {

  constructor(private router: Router,private modalOpener: MatDialog) { }
  goToPremium(){
    // this.router.navigate(['/premiumPage']);
    this.modalOpener.open(PremiumPageComponent);

  }
  ngOnInit(): void {
  }

}