import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LoginModalComponent],
  templateUrl: './public-header.component.html',
  styleUrl: './public-header.component.css'
})
export class PublicHeaderComponent {
  isLoginModalOpen = false;

  openLoginModal(): void {
    this.isLoginModalOpen = true;
  }

  closeLoginModal(): void {
    this.isLoginModalOpen = false;
  }
}
