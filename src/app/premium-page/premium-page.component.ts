import { Component, OnInit,Input, ViewEncapsulation } from '@angular/core';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';
import { BuyCreditsModalComponent } from '../buy-credits-modal/buy-credits-modal.component';
import {MatDialog} from '@angular/material/dialog';
@Component({
  selector: 'app-premium-page',
  templateUrl: './premium-page.component.html',
  styleUrls: ['./premium-page.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class PremiumPageComponent implements OnInit {
  @Input() membership: boolean = true;
  @Input() credits: boolean = false;
  constructor(private modalOpener: MatDialog) { }

  ngOnInit(): void {
  }
  openPaymentForm(){
    if (this.membership == true)
    {
    this.modalOpener.open(PaymentModalComponent);
    }
    else{
      this.modalOpener.open(BuyCreditsModalComponent)
    }
  }
  selectCredits(){
    this.credits = true;
    this.membership = false;
  }
  selectMembership(){
    this.credits = false;
    this.membership = true;
  }
}
