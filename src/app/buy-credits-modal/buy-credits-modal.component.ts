import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Stripe, StripeCardElement, StripeElements,loadStripe } from '@stripe/stripe-js';
import {MatDialog} from '@angular/material/dialog';
import { SpinnerOverlayComponentComponent } from '../spinner-overlay-component/spinner-overlay-component.component';
import { PremiumPageComponent } from '../premium-page/premium-page.component';
import { ThankYouPageComponent } from '../thank-you-page/thank-you-page.component';
@Component({
  selector: 'app-buy-credits-modal',
  templateUrl: './buy-credits-modal.component.html',
  styleUrls: ['./buy-credits-modal.component.scss']
})
export class BuyCreditsModalComponent implements OnInit {
  cardError:string = '';
  optionOne: boolean = true;
  optionTwo: boolean = false;
  optionThree: boolean = false;
  selectOptionOne(){
    this.optionOne = true;
    this.optionTwo = false;
    this.optionThree = false;
  }
  selectOptionTwo(){
    this.optionOne = false;
    this.optionTwo = true;
    this.optionThree = false;
  }
  selectOptionThree(){
    this.optionOne = false;
    this.optionTwo = false;
    this.optionThree = true;
  }
  constructor(private modalOpener: MatDialog) { }
  stripe!: Stripe | null;
  elements!: StripeElements | null;
  cardElement!: StripeCardElement | null;
  @ViewChild('cardElement') cardElementRef!: ElementRef;
  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51MNnWjKl4N1skbwW4K1RF0AwxDA65F8pNATGyus2HNEeR2MBo4Ucn8cgyW3qA2pKQwj1atOWuuyZvIeZmTJggX7Q00NlmJXMkW');
     // Create a new instance of the Stripe object with your publishable API key
    //  this.stripe = await loadStripe('pk_live_51MNnWjKl4N1skbwWrjgV50vyNMquahvMUnNdKpc14TJpEk9YEGCsoRCsjLuG4fLUri5aGensmuqqv9yOFsP63EWG00aCyL1aZA');
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
  async purchaseCredits(){
    this.modalOpener.closeAll()
    var loader = this.modalOpener.open(SpinnerOverlayComponentComponent);
    
    let creditAmount = 0;
    if (this.optionOne)
    {
      creditAmount = 4;
    }
    else if(this.optionTwo){
      creditAmount = 20;
    }
    else if(this.optionThree){
      creditAmount = 40;
    }
    else{
      this.cardError = "Please select an option";
    }

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
          body: JSON.stringify({ stripeToken: result.token.id,credits:creditAmount })
        };
        fetch('https://finaltest-ten.vercel.app/api/purchaseCredits', requestOptions)
          .then(response => response.json())
          .then(data => {
            loader.close(SpinnerOverlayComponentComponent);
            
            
            // document.getElementById('overlay').style.display = 'none';
            if (data.sessionId) {
              this.modalOpener.open(ThankYouPageComponent);
              console.log(data.sessionId);
            }
          })
          .catch(error => {
            // alert("There was an error processing your purchase, please try again later.");
            console.error('Error:', error);
          });
      }
    }


  }
}
