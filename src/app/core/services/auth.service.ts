import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { AuditService } from './audit.service';
import { SecurityConfigService } from './security-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly auditService = inject(AuditService);
  private readonly configService = inject(SecurityConfigService);

  private readonly isLoggedInSignal = signal<boolean>(false);
  public readonly isLoggedIn = this.isLoggedInSignal.asReadonly();

  private readonly currentRoleSignal = signal<string>('Administrador');
  public readonly currentRole = this.currentRoleSignal.asReadonly();

  public readonly roles = ['Administrador', 'Psicólogo', 'Recepcionista', 'Defensor Legal', 'Víctima'];
  private inactivityTimer: any;

  constructor() {
    const storedAuth = localStorage.getItem('safezone_auth');
    if (storedAuth === 'true') {
      this.isLoggedInSignal.set(true);
      this.startInactivityTimer();
    }
    const storedRole = localStorage.getItem('safezone_role');
    if (storedRole && this.roles.includes(storedRole)) {
      this.currentRoleSignal.set(storedRole);
    }
    this.setupActivityListeners();
  }

  private setupActivityListeners() {
    if (typeof window === 'undefined') return;
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(e => {
      window.addEventListener(e, () => this.resetInactivityTimer());
    });
  }

  private startInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    const timeoutMinutes = this.configService.config().sessionTimeout || 15;
    this.inactivityTimer = setTimeout(() => {
      if (this.isLoggedIn()) {
        this.auditService.logAction('Cierre por Inactividad', 'Sesión cerrada automáticamente por inactividad.', 'Auth');
        this.toastService.show('Su sesión ha expirado por inactividad.', 'warning');
        this.logout();
      }
    }, timeoutMinutes * 60 * 1000);
  }

  private resetInactivityTimer() {
    if (this.isLoggedIn()) {
      this.startInactivityTimer();
    }
  }

  login(username?: string, password?: string) {
    // Simular validación de bloqueo
    const maxAttempts = this.configService.config().maxLoginAttempts;
    const lockTimeStr = localStorage.getItem('safezone_login_lock');
    if (lockTimeStr) {
      const lockTime = new Date(lockTimeStr).getTime();
      const diff = (Date.now() - lockTime) / 1000;
      if (diff < 60) {
        const remaining = Math.ceil(60 - diff);
        this.toastService.show(`Acceso temporalmente bloqueado. Intente de nuevo en ${remaining} segundos.`, 'error');
        return;
      } else {
        localStorage.removeItem('safezone_login_lock');
        localStorage.setItem('safezone_login_attempts', '0');
      }
    }

    // Simulación de contraseña incorrecta para pruebas de bloqueo
    if (password === 'wrong') {
      let attempts = parseInt(localStorage.getItem('safezone_login_attempts') || '0', 10);
      attempts++;
      localStorage.setItem('safezone_login_attempts', attempts.toString());

      this.auditService.logAction('Inicio Fallido', `Intento fallido de inicio de sesión para el usuario: ${username}`, 'Auth');

      if (attempts >= maxAttempts) {
        localStorage.setItem('safezone_login_lock', new Date().toISOString());
        this.toastService.show(`Demasiados intentos fallidos. Cuenta bloqueada por 60 segundos.`, 'error');
      } else {
        this.toastService.show(`Credenciales inválidas. Intento ${attempts} de ${maxAttempts}.`, 'error');
      }
      return;
    }

    // Login Exitoso
    localStorage.setItem('safezone_login_attempts', '0');
    this.isLoggedInSignal.set(true);
    localStorage.setItem('safezone_auth', 'true');
    this.startInactivityTimer();
    
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
      } else if (lower.includes('vict') || lower.includes('victim')) {
        this.changeRole('Víctima');
      } else {
        this.changeRole('Recepcionista');
      }
    }

    this.auditService.logAction('Inicio de Sesión', `Usuario accedió con rol: ${this.currentRole()}`, 'Auth');
    this.toastService.show('Sesión iniciada con éxito. Bienvenido al portal SafeZone.', 'success');

    if (this.currentRole() === 'Víctima') {
      void this.router.navigateByUrl('/portal/dashboard');
    } else {
      void this.router.navigateByUrl('/dashboard');
    }
  }

  logout() {
    this.auditService.logAction('Cierre de Sesión', `El usuario con rol ${this.currentRole()} cerró sesión.`, 'Auth');
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
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
      this.auditService.logAction('Cambio de Rol', `Rol activo cambiado a: ${role}`, 'Auth');
    }
  }

  solicitarRecuperacion(email: string): boolean {
    if (!email.trim() || !email.includes('@')) {
      this.toastService.show('Ingrese un correo electrónico válido.', 'error');
      return false;
    }
    this.auditService.logAction('Recuperar Contraseña', `Solicitud de código para: ${email}`, 'Auth');
    this.toastService.show('Código de recuperación enviado a su correo.', 'success');
    return true;
  }

  restablecerContrasena(email: string, codigo: string, contrasena: string): boolean {
    if (!codigo.trim() || contrasena.length < this.configService.config().minPasswordLength) {
      this.toastService.show(`La contraseña debe tener mínimo ${this.configService.config().minPasswordLength} caracteres.`, 'error');
      return false;
    }
    this.auditService.logAction('Restablecer Contraseña', `Contraseña restablecida para el usuario: ${email}`, 'Auth');
    this.toastService.show('Su contraseña ha sido restablecida exitosamente.', 'success');
    return true;
  }
}
