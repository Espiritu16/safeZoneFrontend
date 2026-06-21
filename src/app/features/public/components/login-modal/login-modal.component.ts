import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuditService } from '../../../../core/services/audit.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

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

  private toggleBodyScroll(locked: boolean): void {
    this.document.body.classList.toggle('login-modal-open', locked);
  }
}
