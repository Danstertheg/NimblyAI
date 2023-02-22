import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Stripe, StripeCardElement, StripeElements,loadStripe } from '@stripe/stripe-js';
import { ThankYouPageComponent } from '../thank-you-page/thank-you-page.component';
import {MatDialog} from '@angular/material/dialog';
import { SpinnerOverlayComponentComponent } from '../spinner-overlay-component/spinner-overlay-component.component';
@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class PaymentModalComponent implements OnInit {
  stripe!: Stripe | null;
  elements!: StripeElements | null;
  cardElement!: StripeCardElement | null;
  @ViewChild('cardElement') cardElementRef!: ElementRef;

  constructor(private modalOpener: MatDialog) { }

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
  cardError:string = '';
  async submitPayment() {
    // close the previous modal which is still up "premium-page-component"
    this.modalOpener.closeAll()
    // loader component
    var loader = this.modalOpener.open(SpinnerOverlayComponentComponent);
    let sessionToken = localStorage.getItem("sessionToken")
  // Call the stripe.createToken() method to create a token representing the card
  if (this.cardElement !== null) {
    const result = await this.stripe!.createToken(this.cardElement);
    if (result.error) {
      // Inform the user if there was an error
      this.cardError = String(result.error.message);
      console.log(result.error);
    } else {
      // Send the token to the server
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', `Bearer ${sessionToken}`);
      const formData = new FormData();
      formData.append('stripeToken', result.token.id);
      const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ stripeToken: result.token.id })
      };
      fetch('https://finaltest-ten.vercel.app/api/subscriptions', requestOptions)
        .then(response => response.json())
        .then(data => {
          loader.close(SpinnerOverlayComponentComponent);
          console.log('Success:', data);
          // document.getElementById('overlay').style.display = 'none';
          if (data.transactionId) {
            // Redirect the user to the "thankyou.html" page and include the transaction ID as a query parameter in the URL
            // window.location.href = 'thankyou.html?transactionId=' + data.transactionId;
            this.modalOpener.open(ThankYouPageComponent);
            console.log(data.transactionId);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }


  }
}
