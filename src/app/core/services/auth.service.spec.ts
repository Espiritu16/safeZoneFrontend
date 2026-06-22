import '@angular/compiler';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-route-stub',
  standalone: true,
  template: '',
})
class RouteStubComponent {}

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;
  let toastService: { show: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();
    toastService = {
      show: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'dashboard', component: RouteStubComponent },
          { path: 'inicio', component: RouteStubComponent },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ToastService, useValue: toastService },
      ],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('logs in against backend and persists the session', () => {
    let completed = false;

    service.login('kevin@gmail.com', 'kevin123').subscribe(() => {
      completed = true;
    });

    const request = http.expectOne('http://localhost:8080/api/auth/iniciar-sesion');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ correo: 'kevin@gmail.com', contrasena: 'kevin123' });
    request.flush({
      success: true,
      message: 'OK',
      usuarioId: 'user-1',
      nombre: 'Kevin',
      correo: 'kevin@gmail.com',
      rol: 'ADMIN',
      token: 'access-token',
      refreshToken: 'refresh-token',
      tipoToken: 'Bearer',
    });

    expect(completed).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.currentRole()).toBe('Administrador');
    expect(service.usuarioId()).toBe('user-1');
    expect(localStorage.getItem('safezone_access_token')).toBe('access-token');
    expect(localStorage.getItem('safezone_refresh_token')).toBe('refresh-token');
  });

  it('normalizes backend login errors for the caller and toast', () => {
    let receivedError: unknown;

    service.login('victima@gmail.com', 'bad-password').subscribe({
      error: (error) => {
        receivedError = error;
      },
    });

    const request = http.expectOne('http://localhost:8080/api/auth/iniciar-sesion');
    request.flush(
      { success: false, message: 'Correo o contraseña incorrectos.' },
      { status: 401, statusText: 'Unauthorized' },
    );

    expect(receivedError).toBeInstanceOf(Error);
    expect((receivedError as Error).message).toBe('Correo o contraseña incorrectos.');
    expect(toastService.show).toHaveBeenCalledWith('Correo o contraseña incorrectos.', 'error');
    expect(service.isLoading()).toBe(false);
  });

  it('registers a public victim account with normalized email', () => {
    let completed = false;

    service.registerAccount('  Victima de Prueba  ', ' VICTIMA@gmail.com ', 'Nueva123').subscribe(() => {
      completed = true;
    });

    const request = http.expectOne('http://localhost:8080/api/auth/registrar');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      nombre: 'Victima de Prueba',
      correo: 'victima@gmail.com',
      contrasena: 'Nueva123',
    });
    request.flush({ success: true, message: 'Cuenta creada correctamente' });

    expect(completed).toBe(true);
    expect(toastService.show).toHaveBeenCalledWith('Cuenta creada correctamente', 'success');
  });

  it('requests a password recovery code for the normalized email', () => {
    let completed = false;

    service.requestPasswordRecovery(' VICTIMA@gmail.com ').subscribe(() => {
      completed = true;
    });

    const request = http.expectOne('http://localhost:8080/api/auth/recuperar-contrasena');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ correo: 'victima@gmail.com' });
    request.flush({ success: true, message: 'Codigo enviado correctamente' });

    expect(completed).toBe(true);
    expect(toastService.show).toHaveBeenCalledWith('Codigo enviado correctamente', 'success');
  });

  it('verifies a recovery code using the same normalized email', () => {
    let completed = false;

    service.verifyRecoveryCode(' VICTIMA@gmail.com ', '123456').subscribe(() => {
      completed = true;
    });

    const request = http.expectOne('http://localhost:8080/api/auth/verificar-codigo');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ correo: 'victima@gmail.com', codigo: '123456' });
    request.flush({ success: true, message: 'Codigo verificado correctamente' });

    expect(completed).toBe(true);
  });

  it('resets password for the email tied to the verified recovery code', () => {
    let completed = false;

    service.resetPassword(' VICTIMA@gmail.com ', '123456', 'Nueva123').subscribe(() => {
      completed = true;
    });

    const request = http.expectOne('http://localhost:8080/api/auth/restablecer-contrasena');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      correo: 'victima@gmail.com',
      codigo: '123456',
      nuevaPassword: 'Nueva123',
    });
    request.flush({ success: true, message: 'Contrasena restablecida correctamente' });

    expect(completed).toBe(true);
    expect(toastService.show).toHaveBeenCalledWith('Contrasena restablecida correctamente', 'success');
  });

  it('logs out locally and clears session values', () => {
    localStorage.setItem('safezone_access_token', 'access-token');
    localStorage.setItem('safezone_refresh_token', 'refresh-token');
    localStorage.setItem('safezone_user', JSON.stringify({ usuarioId: 'user-1', rol: 'ADMIN' }));

    service.logout();

    const request = http.expectOne('http://localhost:8080/api/auth/cerrar-sesion');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ refreshToken: 'refresh-token' });
    request.flush({ success: true });

    expect(service.isLoggedIn()).toBe(false);
    expect(localStorage.getItem('safezone_access_token')).toBeNull();
    expect(localStorage.getItem('safezone_refresh_token')).toBeNull();
    expect(localStorage.getItem('safezone_user')).toBeNull();
  });
});
