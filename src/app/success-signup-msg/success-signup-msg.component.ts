import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-success-signup-msg',
  templateUrl: './success-signup-msg.component.html',
  styleUrls: ['./success-signup-msg.component.scss']
})
export class SuccessSignupMsgComponent implements OnInit {

  constructor(private router: Router,private modalOpener: MatDialog) { }
  redirectLogin(){
    this.router.navigate(['./loginPage']);
  }
  ngOnInit(): void {
  }

}
