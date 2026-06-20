import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicFooterComponent } from '../components/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../components/public-header/public-header.component';
import { LoginModalComponent } from '../components/login-modal/login-modal.component';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [PublicHeaderComponent, PublicFooterComponent, LoginModalComponent],
  templateUrl: './inicio.page.html',
  styleUrl: './inicio.page.css'
})
export class InicioPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  isLoginModalOpen = false;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      if (params.get('login') === '1' && !this.authService.isLoggedIn()) {
        this.isLoginModalOpen = true;
      }
    });
  }

  openLoginModal(): void {
    if (this.authService.isLoggedIn()) {
      this.toastService.show('Ya tienes una sesión activa. Puedes continuar desde Mi Panel.', 'info');
      return;
    }
    this.isLoginModalOpen = true;
  }

  closeLoginModal(): void {
    this.isLoginModalOpen = false;
  }
}
