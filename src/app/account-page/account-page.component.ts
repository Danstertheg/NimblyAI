import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {
  currentTab:string = 'Account';
  constructor() { }
  switchTitle(title:string){
    this.currentTab = title;
  }
  ngOnInit(): void {
  }

}
