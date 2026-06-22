import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { InicioPage } from './inicio.page';

describe('InicioPage', () => {
  let fixture: ComponentFixture<InicioPage>;
  let queryParamMap: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let authService: { isLoggedIn: ReturnType<typeof vi.fn>; isLoading: ReturnType<typeof vi.fn>; homeUrl: ReturnType<typeof vi.fn>; nombre: ReturnType<typeof vi.fn>; correo: ReturnType<typeof vi.fn>; currentRole: ReturnType<typeof vi.fn> };
  let toastService: { show: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    queryParamMap = new BehaviorSubject(convertToParamMap({}));
    authService = {
      isLoggedIn: vi.fn().mockReturnValue(false),
      isLoading: vi.fn().mockReturnValue(false),
      homeUrl: vi.fn().mockReturnValue('/usuario/denuncias'),
      nombre: vi.fn().mockReturnValue('Maria Victima'),
      correo: vi.fn().mockReturnValue('victima@gmail.com'),
      currentRole: vi.fn().mockReturnValue('Víctima'),
    };
    toastService = {
      show: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [InicioPage],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService },
        { provide: ActivatedRoute, useValue: { queryParamMap: queryParamMap.asObservable() } },
      ],
    }).compileComponents();
  });

  it('opens the login modal when redirected with login query param', () => {
    queryParamMap.next(convertToParamMap({ login: '1' }));

    fixture = TestBed.createComponent(InicioPage);
    fixture.detectChanges();

    expect(fixture.componentInstance.isLoginModalOpen).toBe(true);
  });

  it('shows an active session notice instead of opening login', () => {
    authService.isLoggedIn.mockReturnValue(true);
    fixture = TestBed.createComponent(InicioPage);
    fixture.detectChanges();

    fixture.componentInstance.openLoginModal();

    expect(fixture.componentInstance.isLoginModalOpen).toBe(false);
    expect(toastService.show).toHaveBeenCalledWith('Ya tienes una sesión activa. Puedes continuar desde Mi Panel.', 'info');
  });

  it('opens and closes the mobile download modal from documentation action', () => {
    fixture = TestBed.createComponent(InicioPage);
    fixture.detectChanges();

    fixture.componentInstance.openDownloadModal();
    expect(fixture.componentInstance.isDownloadModalOpen).toBe(true);

    fixture.componentInstance.closeDownloadModal();
    expect(fixture.componentInstance.isDownloadModalOpen).toBe(false);
  });
});
