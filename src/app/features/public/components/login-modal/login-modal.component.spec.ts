import '@angular/compiler';
import { DOCUMENT } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuditService } from '../../../../core/services/audit.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LoginModalComponent } from './login-modal.component';

describe('LoginModalComponent', () => {
  let fixture: ComponentFixture<LoginModalComponent>;
  let component: LoginModalComponent;
  let authService: {
    login: ReturnType<typeof vi.fn>;
    isLoading: ReturnType<typeof vi.fn>;
    registerAccount: ReturnType<typeof vi.fn>;
    requestPasswordRecovery: ReturnType<typeof vi.fn>;
    verifyRecoveryCode: ReturnType<typeof vi.fn>;
    resetPassword: ReturnType<typeof vi.fn>;
  };
  let toastService: { show: ReturnType<typeof vi.fn> };
  let auditService: { logAction: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authService = {
      login: vi.fn(),
      isLoading: vi.fn().mockReturnValue(false),
      registerAccount: vi.fn(),
      requestPasswordRecovery: vi.fn(),
      verifyRecoveryCode: vi.fn(),
      resetPassword: vi.fn(),
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

  it('creates an account from the login modal and returns to login', () => {
    authService.registerAccount.mockReturnValue(of({ success: true, message: 'Cuenta creada correctamente' }));
    component.startRegister();
    component.registerName = 'Victima de Prueba';
    component.registerEmail = 'victima@gmail.com';
    component.registerPassword = 'Nueva123';
    component.registerConfirmPassword = 'Nueva123';

    component.registerAccount();

    expect(authService.registerAccount).toHaveBeenCalledWith('Victima de Prueba', 'victima@gmail.com', 'Nueva123');
    expect(component.recoveryStep).toBe('login');
    expect(component.email).toBe('victima@gmail.com');
    expect(component.password).toBe('');
  });

  it('does not create an account when passwords do not match', () => {
    component.startRegister();
    component.registerName = 'Victima de Prueba';
    component.registerEmail = 'victima@gmail.com';
    component.registerPassword = 'Nueva123';
    component.registerConfirmPassword = 'Otra123';

    component.registerAccount();

    expect(authService.registerAccount).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Las contraseñas no coinciden.');
    expect(toastService.show).toHaveBeenCalledWith('Las contraseñas no coinciden.', 'error');
  });

  it('requests a recovery code from the login modal', () => {
    authService.requestPasswordRecovery.mockReturnValue(of({ success: true, message: 'Codigo enviado correctamente' }));
    component.email = 'victima@gmail.com';

    component.startRecovery();
    component.requestRecoveryCode();

    expect(authService.requestPasswordRecovery).toHaveBeenCalledWith('victima@gmail.com');
    expect(component.recoveryStep).toBe('code');
  });

  it('resets the password only after code and matching new passwords are provided', () => {
    authService.resetPassword.mockReturnValue(of({ success: true, message: 'Contrasena restablecida correctamente' }));
    component.recoveryStep = 'reset';
    component.recoveryEmail = 'victima@gmail.com';
    component.recoveryCode = '123456';
    component.newPassword = 'Nueva123';
    component.confirmPassword = 'Nueva123';

    component.resetPassword();

    expect(authService.resetPassword).toHaveBeenCalledWith('victima@gmail.com', '123456', 'Nueva123');
    expect(component.recoveryStep).toBe('login');
    expect(component.password).toBe('');
  });
});
