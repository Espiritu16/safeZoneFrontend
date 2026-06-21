import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { roleGuard } from './role.guard';

describe('roleGuard', () => {
  let authService: {
    isLoggedIn: ReturnType<typeof vi.fn>;
    currentRole: ReturnType<typeof vi.fn>;
    homeUrl: ReturnType<typeof vi.fn>;
  };
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };
  let toastService: { show: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authService = {
      isLoggedIn: vi.fn(),
      currentRole: vi.fn(),
      homeUrl: vi.fn(),
    };
    router = {
      navigateByUrl: vi.fn(),
    };
    toastService = {
      show: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: ToastService, useValue: toastService },
      ],
    });
  });

  it('blocks internal routes when there is no active session', () => {
    authService.isLoggedIn.mockReturnValue(false);
    const route = { data: { roles: ['Administrador'] } } as unknown as ActivatedRouteSnapshot;

    const result = TestBed.runInInjectionContext(() => roleGuard(route, {} as never));

    expect(result).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/inicio');
    expect(toastService.show).not.toHaveBeenCalled();
  });

  it('allows the route when the authenticated role is allowed', () => {
    authService.isLoggedIn.mockReturnValue(true);
    authService.currentRole.mockReturnValue('Administrador');
    const route = { data: { roles: ['Administrador'] } } as unknown as ActivatedRouteSnapshot;

    const result = TestBed.runInInjectionContext(() => roleGuard(route, {} as never));

    expect(result).toBe(true);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('redirects authenticated users when their role is not allowed', () => {
    authService.isLoggedIn.mockReturnValue(true);
    authService.currentRole.mockReturnValue('Víctima');
    authService.homeUrl.mockReturnValue('/usuario/denuncias');
    const route = { data: { roles: ['Administrador'] } } as unknown as ActivatedRouteSnapshot;

    const result = TestBed.runInInjectionContext(() => roleGuard(route, {} as never));

    expect(result).toBe(false);
    expect(toastService.show).toHaveBeenCalledWith(
      'Acceso denegado. El rol "Víctima" no tiene permisos para acceder a este módulo.',
      'error',
    );
    expect(router.navigateByUrl).toHaveBeenCalledWith('/usuario/denuncias');
  });
});
