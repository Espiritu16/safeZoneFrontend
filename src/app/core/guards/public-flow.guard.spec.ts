import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { publicFlowGuard } from './public-flow.guard';

describe('publicFlowGuard', () => {
  let authService: { isLoggedIn: ReturnType<typeof vi.fn> };
  let router: { parseUrl: ReturnType<typeof vi.fn> };
  let toastService: { show: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authService = {
      isLoggedIn: vi.fn(),
    };
    router = {
      parseUrl: vi.fn((url: string) => ({ url })),
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

  it('redirects logged users from public report flows to their victim panel', () => {
    authService.isLoggedIn.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => publicFlowGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

    expect(router.parseUrl).toHaveBeenCalledWith('/usuario/denuncias');
    expect(result).toEqual({ url: '/usuario/denuncias' });
    expect(toastService.show).not.toHaveBeenCalled();
  });

  it('asks anonymous users to log in before using public report flows', () => {
    authService.isLoggedIn.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() => publicFlowGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

    expect(toastService.show).toHaveBeenCalledWith('Inicia sesión para registrar o consultar tus denuncias desde el panel.', 'warning');
    expect(router.parseUrl).toHaveBeenCalledWith('/inicio?login=1');
    expect(result).toEqual({ url: '/inicio?login=1' });
  });
});
