import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuditService } from '../../../../core/services/audit.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

type LoginModalStep = 'login' | 'register' | 'email' | 'code' | 'reset';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css',
})
export class LoginModalComponent implements OnChanges, OnDestroy {
  @Input() open = false;
  @Output() readonly closed = new EventEmitter<void>();

  protected readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly auditService = inject(AuditService);

  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  errorMessage = '';
  recoveryStep: LoginModalStep = 'login';
  registerName = '';
  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';
  showRegisterPassword = false;
  recoveryEmail = '';
  recoveryCode = '';
  newPassword = '';
  confirmPassword = '';
  showNewPassword = false;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) {
      this.toggleBodyScroll(this.open);
    }
  }

  ngOnDestroy(): void {
    this.toggleBodyScroll(false);
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.open && !this.authService.isLoading()) {
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }

  startRecovery(): void {
    this.errorMessage = '';
    this.recoveryEmail = this.email.trim();
    this.recoveryCode = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.recoveryStep = 'email';
    this.resetModalScroll();
  }

  startRegister(): void {
    this.errorMessage = '';
    this.registerName = '';
    this.registerEmail = this.email.trim();
    this.registerPassword = '';
    this.registerConfirmPassword = '';
    this.recoveryStep = 'register';
    this.resetModalScroll();
  }

  backToLogin(): void {
    this.errorMessage = '';
    this.recoveryStep = 'login';
    this.password = '';
    this.resetModalScroll();
  }

  login(): void {
    this.errorMessage = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Por favor, ingrese sus credenciales completas.';
      this.toastService.show(this.errorMessage, 'error');
      return;
    }

    if (this.authService.isLoading()) {
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.closed.emit();
        this.auditService.logAction('Inicio de Sesión', `Autenticación exitosa con usuario: ${this.email}`, 'Auth');
      },
      error: (error: unknown) => {
        this.errorMessage = error instanceof Error ? error.message : 'No se pudo iniciar sesión. Verifique sus credenciales.';
      },
    });
  }

  registerAccount(): void {
    this.errorMessage = '';

    if (!this.registerName.trim() || !this.registerEmail.trim() || !this.registerPassword.trim() || !this.registerConfirmPassword.trim()) {
      this.errorMessage = 'Complete su nombre, correo y contraseña.';
      this.toastService.show(this.errorMessage, 'error');
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      this.toastService.show(this.errorMessage, 'error');
      return;
    }

    if (this.authService.isLoading()) {
      return;
    }

    this.authService.registerAccount(this.registerName, this.registerEmail, this.registerPassword).subscribe({
      next: () => {
        this.email = this.registerEmail.trim();
        this.password = '';
        this.registerPassword = '';
        this.registerConfirmPassword = '';
        this.recoveryStep = 'login';
        this.resetModalScroll();
      },
      error: (error: unknown) => {
        this.errorMessage = error instanceof Error ? error.message : 'No se pudo crear la cuenta.';
      },
    });
  }

  requestRecoveryCode(): void {
    this.errorMessage = '';

    if (!this.recoveryEmail.trim()) {
      this.errorMessage = 'Ingrese el correo vinculado a su cuenta.';
      this.toastService.show(this.errorMessage, 'error');
      return;
    }

    if (this.authService.isLoading()) {
      return;
    }

    this.authService.requestPasswordRecovery(this.recoveryEmail).subscribe({
      next: () => {
        this.email = this.recoveryEmail.trim();
        this.recoveryStep = 'code';
        this.resetModalScroll();
      },
      error: (error: unknown) => {
        this.errorMessage = error instanceof Error ? error.message : 'No se pudo solicitar el codigo de recuperacion.';
      },
    });
  }

  verifyRecoveryCode(): void {
    this.errorMessage = '';

    if (!this.recoveryEmail.trim() || !this.recoveryCode.trim()) {
      this.errorMessage = 'Ingrese el correo y el codigo de recuperacion.';
      this.toastService.show(this.errorMessage, 'error');
      return;
    }

    if (this.authService.isLoading()) {
      return;
    }

    this.authService.verifyRecoveryCode(this.recoveryEmail, this.recoveryCode).subscribe({
      next: () => {
        this.recoveryStep = 'reset';
        this.resetModalScroll();
      },
      error: (error: unknown) => {
        this.errorMessage = error instanceof Error ? error.message : 'No se pudo verificar el codigo de recuperacion.';
      },
    });
  }

  resetPassword(): void {
    this.errorMessage = '';

    if (!this.recoveryEmail.trim() || !this.recoveryCode.trim() || !this.newPassword.trim() || !this.confirmPassword.trim()) {
      this.errorMessage = 'Complete el codigo y la nueva contrasena.';
      this.toastService.show(this.errorMessage, 'error');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contrasenas no coinciden.';
      this.toastService.show(this.errorMessage, 'error');
      return;
    }

    if (this.authService.isLoading()) {
      return;
    }

    this.authService.resetPassword(this.recoveryEmail, this.recoveryCode, this.newPassword).subscribe({
      next: () => {
        this.password = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.recoveryStep = 'login';
        this.resetModalScroll();
      },
      error: (error: unknown) => {
        this.errorMessage = error instanceof Error ? error.message : 'No se pudo restablecer la contrasena.';
      },
    });
  }

  private toggleBodyScroll(locked: boolean): void {
    this.document.body.classList.toggle('login-modal-open', locked);
  }

  private resetModalScroll(): void {
    this.document.defaultView?.requestAnimationFrame(() => {
      this.document.querySelector('.login-modal-card')?.scrollTo({ top: 0 });
    });
  }
}
