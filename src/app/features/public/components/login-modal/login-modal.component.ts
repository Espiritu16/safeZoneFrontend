import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
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

  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly auditService = inject(AuditService);

  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  isLoggingIn = false;

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
    if (this.open && !this.isLoggingIn) {
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }

  login(): void {
    if (!this.email.trim() || !this.password.trim()) {
      this.toastService.show('Por favor, ingrese sus credenciales completas.', 'error');
      return;
    }

    this.isLoggingIn = true;
    this.authService.login(this.email, this.password).pipe(
      finalize(() => {
        this.isLoggingIn = false;
      }),
    ).subscribe({
      next: () => {
        this.closed.emit();
        this.auditService.logAction('Inicio de Sesión', `Autenticación exitosa con usuario: ${this.email}`, 'Auth');
      },
      error: () => undefined,
    });
  }

  private toggleBodyScroll(locked: boolean): void {
    this.document.body.classList.toggle('login-modal-open', locked);
  }
}
