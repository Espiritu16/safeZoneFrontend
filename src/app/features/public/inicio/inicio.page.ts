import { Component } from '@angular/core';
import { PublicFooterComponent } from '../components/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../components/public-header/public-header.component';
import { LoginModalComponent } from '../components/login-modal/login-modal.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [PublicHeaderComponent, PublicFooterComponent, LoginModalComponent],
  templateUrl: './inicio.page.html',
  styleUrl: './inicio.page.css'
})
export class InicioPage {
  isLoginModalOpen = false;

  openLoginModal(): void {
    this.isLoginModalOpen = true;
  }

  closeLoginModal(): void {
    this.isLoginModalOpen = false;
  }
}
