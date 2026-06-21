import { DOCUMENT } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuditService } from '../../../../core/services/audit.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LoginModalComponent } from './login-modal.component';

describe('LoginModalComponent', () => {
  let fixture: ComponentFixture<LoginModalComponent>;
  let component: LoginModalComponent;
  let authService: { login: ReturnType<typeof vi.fn>; isLoading: ReturnType<typeof vi.fn> };
  let toastService: { show: ReturnType<typeof vi.fn> };
  let auditService: { logAction: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authService = {
      login: vi.fn(),
      isLoading: vi.fn().mockReturnValue(false),
    };
    toastService = {
      show: vi.fn(),
    };
    auditService = {
      logAction: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginModalComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService },
        { provide: AuditService, useValue: auditService },
        { provide: DOCUMENT, useValue: document },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginModalComponent);
    component = fixture.componentInstance;
  });

  it('re-enables submit and displays backend login errors', () => {
    authService.login.mockReturnValue(throwError(() => new Error('Correo o contraseña incorrectos.')));
    component.email = 'victima@gmail.com';
    component.password = 'incorrecta';

    component.login();

    expect(authService.login).toHaveBeenCalledWith('victima@gmail.com', 'incorrecta');
    expect(component.errorMessage).toBe('Correo o contraseña incorrectos.');
  });

  it('does not submit empty credentials', () => {
    component.email = '';
    component.password = '';

    component.login();

    expect(authService.login).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Por favor, ingrese sus credenciales completas.');
    expect(toastService.show).toHaveBeenCalledWith('Por favor, ingrese sus credenciales completas.', 'error');
  });
});
