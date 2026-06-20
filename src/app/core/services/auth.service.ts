import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../http/api-endpoints';
import { ApiClientService } from '../http/api-client.service';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '../http/auth-token.interceptor';
import type { BackendRole, FrontendRole, LoginResponse, SessionContextResponse } from '../models/api.models';
import { roleToLabel } from '../utils/role-mapper';
import { ToastService } from './toast.service';

interface StoredUser {
  usuarioId: string;
  nombre: string;
  correo: string;
  rol: BackendRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly api = inject(ApiClientService);

  private readonly isLoggedInSignal = signal<boolean>(false);
  public readonly isLoggedIn = this.isLoggedInSignal.asReadonly();

  private readonly currentRoleSignal = signal<FrontendRole>('Administrador');
  public readonly currentRole = this.currentRoleSignal.asReadonly();

  private readonly currentBackendRoleSignal = signal<BackendRole>('ADMIN');
  public readonly currentBackendRole = this.currentBackendRoleSignal.asReadonly();

  private readonly usuarioIdSignal = signal<string>('');
  public readonly usuarioId = this.usuarioIdSignal.asReadonly();

  private readonly nombreSignal = signal<string>('');
  public readonly nombre = this.nombreSignal.asReadonly();

  private readonly correoSignal = signal<string>('');
  public readonly correo = this.correoSignal.asReadonly();

  private readonly isLoadingSignal = signal<boolean>(false);
  public readonly isLoading = this.isLoadingSignal.asReadonly();

  public readonly roles: FrontendRole[] = ['Administrador', 'Psicólogo', 'Recepcionista', 'Defensor Legal', 'Soporte Técnico', 'Víctima'];

  constructor() {
    this.restoreSession();
  }

  login(correo: string, contrasena: string): Observable<LoginResponse> {
    this.isLoadingSignal.set(true);
    return this.api.post<LoginResponse>(API_ENDPOINTS.auth.login, { correo: correo.trim().toLowerCase(), contrasena }).pipe(
      tap((response) => this.persistSession(response)),
      tap(() => this.toastService.show('Sesión iniciada con éxito. Bienvenido al portal SafeZone.', 'success')),
      tap(() => void this.router.navigateByUrl(this.homeUrl())),
      catchError((error) => {
        this.toastService.show(this.errorMessage(error), 'error');
        return throwError(() => error);
      }),
      finalize(() => this.isLoadingSignal.set(false)),
    );
  }

  refreshContext(): Observable<SessionContextResponse> {
    return this.api.get<SessionContextResponse>(API_ENDPOINTS.auth.me).pipe(
      tap((context) => {
        const stored: StoredUser = {
          usuarioId: context.usuarioId,
          nombre: context.nombre,
          correo: context.correo,
          rol: context.rol,
        };
        this.setUser(stored);
        localStorage.setItem(USER_KEY, JSON.stringify(stored));
      }),
    );
  }

  logout(showMessage = true): void {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      this.api.post(API_ENDPOINTS.auth.logout, { refreshToken }).subscribe({ error: () => undefined });
    }
    this.clearSession();
    if (showMessage) {
      this.toastService.show('Sesión cerrada correctamente.', 'warning');
    }
    void this.router.navigateByUrl('/inicio');
  }

  changeRole(role: FrontendRole): void {
    if (!this.roles.includes(role)) {
      return;
    }
    this.currentRoleSignal.set(role);
    this.toastService.show(`Vista adaptada para: ${role}`, 'success');
  }

  accessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  homeUrl(): string {
    return this.currentBackendRoleSignal() === 'VICTIMA' ? '/usuario/denuncias' : '/dashboard';
  }

  private persistSession(response: LoginResponse): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    const stored: StoredUser = {
      usuarioId: response.usuarioId,
      nombre: response.nombre,
      correo: response.correo,
      rol: response.rol,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(stored));
    this.setUser(stored);
    this.isLoggedInSignal.set(true);
  }

  private restoreSession(): void {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (!token || !storedUser) {
      this.clearSession(false);
      return;
    }

    try {
      this.setUser(JSON.parse(storedUser) as StoredUser);
      this.isLoggedInSignal.set(true);
    } catch {
      this.clearSession(false);
    }
  }

  private setUser(user: StoredUser): void {
    this.usuarioIdSignal.set(user.usuarioId);
    this.nombreSignal.set(user.nombre);
    this.correoSignal.set(user.correo);
    this.currentBackendRoleSignal.set(user.rol);
    this.currentRoleSignal.set(roleToLabel(user.rol));
  }

  private clearSession(navigate = true): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('safezone_auth');
    localStorage.removeItem('safezone_role');
    this.isLoggedInSignal.set(false);
    this.usuarioIdSignal.set('');
    this.nombreSignal.set('');
    this.correoSignal.set('');
    this.currentBackendRoleSignal.set('ADMIN');
    this.currentRoleSignal.set('Administrador');
    if (!navigate) {
      return;
    }
  }

  private errorMessage(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const payload = (error as { error?: { message?: string; mensaje?: string } }).error;
      return payload?.message ?? payload?.mensaje ?? 'No se pudo iniciar sesión. Verifique sus credenciales.';
    }
    return 'No se pudo iniciar sesión. Verifique sus credenciales.';
  }
}
