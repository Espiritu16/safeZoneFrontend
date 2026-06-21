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
  errorMessage = '';

  login() {
    this.errorMessage = '';

    if (!this.username || !this.username.trim() || !this.password || !this.password.trim()) {
      this.errorMessage = 'Por favor, ingrese sus credenciales completas.';
      this.toastService.show(this.errorMessage, 'error');
      return;
    }

    if (this.authService.isLoading()) {
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.auditService.logAction('Inicio de Sesión', `Autenticación exitosa con usuario: ${this.username}`, 'Auth');
      },
      error: (error: unknown) => {
        this.errorMessage = error instanceof Error ? error.message : 'No se pudo iniciar sesión. Verifique sus credenciales.';
      },
    });
  }

  showToast(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    this.toastService.show(message, type);
  }
}
