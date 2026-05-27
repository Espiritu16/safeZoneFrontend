import { Injectable, signal, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { AuditService } from './audit.service';

export interface SecurityConfig {
  sessionTimeout: number; // en minutos
  maxLoginAttempts: number;
  require2FA: boolean;
  passwordComplexity: string; // 'Baja' | 'Media' | 'Alta'
  auditRetention: number; // en días
  maintenanceMode: boolean;
}

const STORAGE_KEY = 'safezone_security_config';

const DEFAULT_CONFIG: SecurityConfig = {
  sessionTimeout: 15,
  maxLoginAttempts: 3,
  require2FA: false,
  passwordComplexity: 'Alta',
  auditRetention: 90,
  maintenanceMode: false
};

@Injectable({
  providedIn: 'root'
})
export class SecurityConfigService {
  private readonly toastService = inject(ToastService);
  private readonly auditService = inject(AuditService);

  public readonly config = signal<SecurityConfig>(this.loadFromStorage());

  private loadFromStorage(): SecurityConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  saveConfig(newConfig: Partial<SecurityConfig>) {
    const updated = { ...this.config(), ...newConfig };
    this.config.set(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Registrar en auditoría
    this.auditService.logAction('Configuración', 'Actualización de políticas de seguridad del sistema.', 'Configuración');
    this.toastService.show('Configuración de seguridad guardada exitosamente.', 'success');
  }

  toggleMaintenance(status: boolean) {
    this.saveConfig({ maintenanceMode: status });
    const msg = status ? 'Modo de mantenimiento activado.' : 'Modo de mantenimiento desactivado.';
    this.auditService.logAction('Mantenimiento', msg, 'Sistema');
    this.toastService.show(msg, status ? 'warning' : 'success');
  }
}
