import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LoginModalComponent],
  templateUrl: './public-header.component.html',
  styleUrl: './public-header.component.css'
})
export class PublicHeaderComponent {
  protected readonly authService = inject(AuthService);

  isLoginModalOpen = false;
  isMenuOpen = false;

  openLoginModal(): void {
    this.isLoginModalOpen = true;
    this.isMenuOpen = false;
  }

  closeLoginModal(): void {
    this.isLoginModalOpen = false;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    this.closeMenu();
    this.authService.logout();
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.closeMenu();
  }

  @HostListener('window:resize')
  handleResize(): void {
    if (window.innerWidth >= 1024) {
      this.closeMenu();
    }
  }
}
