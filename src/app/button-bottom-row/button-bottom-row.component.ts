import { Component, Input, OnInit } from '@angular/core';
import { TextAreaInputComponent } from '../text-area-input/text-area-input.component';

@Component({
  selector: 'app-button-bottom-row',
  templateUrl: './button-bottom-row.component.html',
  styleUrls: ['./button-bottom-row.component.scss']
})
export class ButtonBottomRowComponent implements OnInit {

  constructor(public textAreaInputComponent:TextAreaInputComponent) { }
  openAI(){
    console.log(this.textAreaInputComponent.input);
this.textAreaInputComponent.data = "pressed the button.";
  }
  ngOnInit(): void {
  }

}
