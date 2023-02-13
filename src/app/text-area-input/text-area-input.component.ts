import { Component, OnInit, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { SpinnerOverlayComponentComponent } from '../spinner-overlay-component/spinner-overlay-component.component';

@Component({
  selector: 'app-text-area-input',
  templateUrl: './text-area-input.component.html',
  styleUrls: ['./text-area-input.component.scss']
})
@Injectable()
export class TextAreaInputComponent implements OnInit {
  @Input() AIresponse: string = '';
  @Input() tabOne: boolean = true;
  @Input() tabTwo: boolean = false;
  AIWriter: FormGroup;
  // AITab: FormGroup;
  // AITabZero: FormGroup;
  constructor(private modalOpener: MatDialog) { 
    this.AIWriter = new FormGroup({
      AIInput: new FormControl('')
    });
    // this.AITabZero = new FormGroup({
    //   tabRadioZero: new FormControl('')
    // })
    // this.AITab = new FormGroup({
    //   tabRadio : new FormControl('')
    // });
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
  generateIdeas(){
    this.openAI("Please generate ideas about: ")
  }
  improveText(){
    this.openAI("Please Improve the following text: ")
  }
  fixGrammar(){
    this.openAI("Please fix the grammar mistakes in the followng text: ")
  }
  writeDraft(){
    this.openAI("Please write a draft on the prompt: ")
  }
  summarize(){
    this.openAI("Please summarize the following text: ")
  }
  complete(){
    this.openAI("Please add more to the following text and complete it if possible : ")
  }
  translate(){
    this.openAI("Please find out the language used and translate the following text into english: ")
  }
  createPoem(){
    this.openAI("Please create a poem using the prompt: ")
  }
  createScript(){
    this.openAI("Please create a script using the prompt: ")
  }
  createStory(){
    this.openAI("Please create story using the prompt: ")
  }
  test(){
    console.log(this.AIWriter.value.AIInput)
  }

  selectTabOne(){
    this.tabOne = true;
    this.tabTwo = false;
  }
  selectTabTwo(){
    this.tabOne = false;
      this.tabTwo = true;
  }
  openAI(promptz : string){
    let prompt = promptz + this.AIWriter.value.AIInput;
    let engine = 'text-davinci-002';
    let sessionToken = localStorage.getItem("sessionToken");
  const request = new XMLHttpRequest();
  request.open('POST', 'https://finaltest-ten.vercel.app/api/handleAI/premium');
  request.setRequestHeader('Content-Type', 'application/json');
  request.setRequestHeader('Authorization', `Bearer ${sessionToken}`);

  request.onload = () =>  {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      loader.close(SpinnerOverlayComponentComponent);
      const response = JSON.parse(request.responseText);
      const completedText = response.completedText;
      this.AIresponse = completedText;
      this.tabOne = false;
      this.tabTwo = true;
      // this.AITabZero.value.tabRadioZero = false;
      // this.AITab.value.tabRadio = true;
      // const output = document.getElementById("output");
      // output.value = completedText;
      // document.getElementById("loader").innerHTML = '';
    } else {
      // There was an error
      console.error(request.responseText);
    }
  };

  request.onerror = function() {
    console.error('An error occurred while making the request');
  };

  const data = {
    model: engine,
    prompt: prompt
  };
  var loader = this.modalOpener.open(SpinnerOverlayComponentComponent);
  // document.getElementById("loader").innerHTML = '<span>Loading, Please wait...</span>'; // Set here the image before sending request
  request.send(JSON.stringify(data));
  }








}
