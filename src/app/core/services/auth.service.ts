import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  private readonly isLoggedInSignal = signal<boolean>(false);
  public readonly isLoggedIn = this.isLoggedInSignal.asReadonly();

  private readonly currentRoleSignal = signal<string>('Administrador');
  public readonly currentRole = this.currentRoleSignal.asReadonly();

  public readonly roles = ['Administrador', 'Psicólogo', 'Recepcionista', 'Defensor Legal'];

  constructor() {
    const storedAuth = localStorage.getItem('safezone_auth');
    if (storedAuth === 'true') {
      this.isLoggedInSignal.set(true);
    }
    const storedRole = localStorage.getItem('safezone_role');
    if (storedRole && this.roles.includes(storedRole)) {
      this.currentRoleSignal.set(storedRole);
    }
  }

  login(username?: string) {
    this.isLoggedInSignal.set(true);
    localStorage.setItem('safezone_auth', 'true');
    
    if (username) {
      const lower = username.toLowerCase();
      if (lower.includes('admin')) {
        this.changeRole('Administrador');
      } else if (lower.includes('psic')) {
        this.changeRole('Psicólogo');
      } else if (lower.includes('recep')) {
        this.changeRole('Recepcionista');
      } else if (lower.includes('defens') || lower.includes('legal')) {
        this.changeRole('Defensor Legal');
      } else {
        // Por defecto si no coincide ninguno
        this.changeRole('Recepcionista');
      }
    }

    this.toastService.show('Sesión iniciada con éxito. Bienvenido al portal SafeZone.', 'success');
    void this.router.navigateByUrl('/dashboard');
  }

  logout() {
    this.isLoggedInSignal.set(false);
    localStorage.removeItem('safezone_auth');
    this.toastService.show('Sesión cerrada correctamente.', 'warning');
    void this.router.navigateByUrl('/login');
  }

  changeRole(role: string) {
    if (this.roles.includes(role)) {
      this.currentRoleSignal.set(role);
      localStorage.setItem('safezone_role', role);
      this.toastService.show(`Cargando panel adaptado para: ${role}`, 'success');
    }
  }
}
