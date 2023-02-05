import { Component, OnInit, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-text-area-input',
  templateUrl: './text-area-input.component.html',
  styleUrls: ['./text-area-input.component.scss']
})
@Injectable()
export class TextAreaInputComponent implements OnInit {
  @Input() AIresponse: string = 'testarea';
  AIWriter: FormGroup;

  constructor() { 
    this.AIWriter = new FormGroup({
      AIInput: new FormControl('')
    });
  }
  aiTest(){
    this.AIresponse = 'new value'
  }
  set data(val: string){
    // this.AIWriter.value.AIInput = val;
    this.AIresponse = val;
    console.log(this.AIresponse)
  }
  get input(){
    return this.AIWriter.value.AIInput;
  }
  ngOnInit(): void {
  }

}
