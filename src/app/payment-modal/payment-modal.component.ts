import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Stripe, StripeCardElement, StripeElements,loadStripe } from '@stripe/stripe-js';


@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss']
})
export class PaymentModalComponent implements OnInit {
  stripe!: Stripe | null;
  elements!: StripeElements | null;
  cardElement!: StripeCardElement | null;
  @ViewChild('cardElement') cardElementRef!: ElementRef;

  constructor() { }

  async ngOnInit(){
    // Create a new instance of the Stripe object with your publishable API key
    this.stripe = await loadStripe('pk_live_51MNnWjKl4N1skbwWrjgV50vyNMquahvMUnNdKpc14TJpEk9YEGCsoRCsjLuG4fLUri5aGensmuqqv9yOFsP63EWG00aCyL1aZA');
    // Create a new instance of the Elements object
    if (this.stripe !== null){
    this.elements = this.stripe.elements();
    
    // Create a new card Element
    if (this.elements !== null){
    this.cardElement = this.elements.create('card');
    // Mount the card Element to the DOM
    this.cardElement.mount(this.cardElementRef.nativeElement);
    }
    }
  }

  async submitPayment() {



  }
}
