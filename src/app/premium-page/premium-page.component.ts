import { Component, OnInit } from '@angular/core';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';
import {MatDialog} from '@angular/material/dialog';
@Component({
  selector: 'app-premium-page',
  templateUrl: './premium-page.component.html',
  styleUrls: ['./premium-page.component.scss']
})
export class PremiumPageComponent implements OnInit {

  constructor(private modalOpener: MatDialog) { }

  ngOnInit(): void {
  }
  openPaymentForm(){
    this.modalOpener.open(PaymentModalComponent);
  }
}
