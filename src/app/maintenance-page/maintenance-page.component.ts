import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maintenance-page',
  templateUrl: './maintenance-page.component.html',
  styleUrls: ['./maintenance-page.component.scss']
})
export class MaintenancePageComponent implements OnInit {

  avatarUrl = '../../assets/welcome-chat-removebg-preview.png';
  score = 0;

  clickAvatar() {
    this.score++;
    this.animateAvatar();
  }

  animateAvatar() {
    const avatarContainer = document.querySelector('.avatar-container');
    avatarContainer?.classList.add('pulse');
    setTimeout(() => {
      avatarContainer?.classList.remove('pulse');
    }, 2000);
  }
  constructor() { }

  ngOnInit(): void {
  }

}
