import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuditService } from '../../../core/services/audit.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  protected readonly authService = inject(AuthService);
  protected readonly toastService = inject(ToastService);
  protected readonly auditService = inject(AuditService);

  username = '';
  password = '';
  isLoggingIn = false;

  login() {
    if (!this.username || !this.username.trim() || !this.password || !this.password.trim()) {
      this.toastService.show('Por favor, ingrese sus credenciales completas.', 'error');
      return;
    }

    this.isLoggingIn = true;
    
    // Simular latencia de red para UX más realista
    setTimeout(() => {
      this.isLoggingIn = false;
      this.authService.login(this.username);
      this.auditService.logAction('Inicio de Sesión', `Autenticación exitosa con usuario: ${this.username}`, 'Auth');
    }, 800);
  }

  showToast(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    this.toastService.show(message, type);
  }
}
