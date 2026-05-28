import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
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
export class LoginComponent implements OnInit, OnDestroy {
  protected readonly authService = inject(AuthService);
  protected readonly toastService = inject(ToastService);
  protected readonly auditService = inject(AuditService);

  username = '';
  password = '';
  isLoggingIn = false;

  // Estado para la recuperación de contraseña
  recoveryMode = signal<boolean>(false);
  resetMode = signal<boolean>(false);
  recoveryEmail = '';
  recoveryCode = '';
  newPassword = '';

  // Estado de bloqueo
  remainingLockTime = signal<number>(0);
  private timerInterval: any;

  ngOnInit() {
    this.checkLockState();
    this.timerInterval = setInterval(() => this.checkLockState(), 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  checkLockState() {
    const lockTimeStr = localStorage.getItem('safezone_login_lock');
    if (lockTimeStr) {
      const lockTime = new Date(lockTimeStr).getTime();
      const diff = (Date.now() - lockTime) / 1000;
      if (diff < 60) {
        this.remainingLockTime.set(Math.ceil(60 - diff));
      } else {
        this.remainingLockTime.set(0);
        localStorage.removeItem('safezone_login_lock');
        localStorage.setItem('safezone_login_attempts', '0');
      }
    } else {
      this.remainingLockTime.set(0);
    }
  }

  login() {
    if (this.remainingLockTime() > 0) {
      this.toastService.show(`Por favor, espere a que termine el bloqueo.`, 'error');
      return;
    }

    if (!this.username || !this.username.trim() || !this.password || !this.password.trim()) {
      this.toastService.show('Por favor, ingrese sus credenciales completas.', 'error');
      return;
    }

    this.isLoggingIn = true;
    
    setTimeout(() => {
      this.isLoggingIn = false;
      this.authService.login(this.username, this.password);
      this.checkLockState();
    }, 800);
  }

  selectTestCredentials(role: 'admin' | 'psic' | 'recep' | 'legal' | 'victima') {
    switch (role) {
      case 'admin':
        this.username = 'admin@safezone.pe';
        this.password = 'AdminPass123';
        break;
      case 'psic':
        this.username = 'psicologia@safezone.pe';
        this.password = 'PsicPass123';
        break;
      case 'recep':
        this.username = 'recepcion@safezone.pe';
        this.password = 'RecepPass123';
        break;
      case 'legal':
        this.username = 'legal@safezone.pe';
        this.password = 'LegalPass123';
        break;
      case 'victima':
        this.username = 'victima@safezone.pe';
        this.password = 'VictimaPass123';
        break;
    }
    this.toastService.show(`Credenciales del rol seleccionadas.`, 'info');
  }

  sendRecoveryCode() {
    if (this.authService.solicitarRecuperacion(this.recoveryEmail)) {
      this.resetMode.set(true);
    }
  }

  resetPassword() {
    if (this.authService.restablecerContrasena(this.recoveryEmail, this.recoveryCode, this.newPassword)) {
      this.recoveryMode.set(false);
      this.resetMode.set(false);
      this.password = this.newPassword;
      this.username = this.recoveryEmail;
      this.recoveryEmail = '';
      this.recoveryCode = '';
      this.newPassword = '';
    }
  }

}
