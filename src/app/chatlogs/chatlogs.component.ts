import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chatlogs',
  templateUrl: './chatlogs.component.html',
  styleUrls: ['./chatlogs.component.scss']
})
export class ChatlogsComponent implements OnInit {
  messageForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  sendMessage() {
    const message = this.messageForm.get('message')?.value;
    alert(`Message: ${message}`);
  }
}
