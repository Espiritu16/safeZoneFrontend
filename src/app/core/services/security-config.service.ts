import { Injectable, signal, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { AuditService } from './audit.service';
import { encryptData, decryptData } from '../../shared/utils/crypto.utils';

export interface SecurityConfig {
  sessionTimeout: number; // en minutos
  maxLoginAttempts: number;
  require2FA: boolean;
  passwordComplexity: string; // 'Baja' | 'Media' | 'Alta'
  minPasswordLength: number;
  auditRetention: number; // en días
  maintenanceMode: boolean;
  permissionsMatrix: { [role: string]: { [module: string]: boolean } };
}

const STORAGE_KEY = 'safezone_security_config';

const DEFAULT_PERMISSIONS: { [role: string]: { [module: string]: boolean } } = {
  'Administrador': { 'Dashboard': true, 'Denuncias': true, 'Casos': true, 'Víctimas': true, 'Citas': true, 'Evidencias': true, 'Reportes': true, 'Auditoría': true, 'Configuración': true },
  'Recepcionista': { 'Dashboard': true, 'Denuncias': true, 'Casos': true, 'Víctimas': true, 'Citas': true, 'Evidencias': true, 'Reportes': false, 'Auditoría': false, 'Configuración': false },
  'Psicólogo': { 'Dashboard': true, 'Denuncias': false, 'Casos': true, 'Víctimas': true, 'Citas': true, 'Evidencias': true, 'Reportes': true, 'Auditoría': false, 'Configuración': false },
  'Defensor Legal': { 'Dashboard': true, 'Denuncias': false, 'Casos': true, 'Víctimas': true, 'Citas': true, 'Evidencias': true, 'Reportes': true, 'Auditoría': false, 'Configuración': false },
  'Víctima': { 'Dashboard': true, 'Denuncias': false, 'Casos': false, 'Víctimas': false, 'Citas': true, 'Evidencias': false, 'Reportes': false, 'Auditoría': false, 'Configuración': false }
};

const DEFAULT_CONFIG: SecurityConfig = {
  sessionTimeout: 15,
  maxLoginAttempts: 3,
  require2FA: false,
  passwordComplexity: 'Alta',
  minPasswordLength: 8,
  auditRetention: 90,
  maintenanceMode: false,
  permissionsMatrix: DEFAULT_PERMISSIONS
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
      const decrypted = decryptData(stored);
      if (decrypted) {
        // Asegurarse de rellenar la matriz si no existiese
        if (!decrypted.permissionsMatrix) {
          decrypted.permissionsMatrix = DEFAULT_PERMISSIONS;
        }
        return decrypted;
      }
      return DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  saveConfig(newConfig: Partial<SecurityConfig>) {
    const updated = { ...this.config(), ...newConfig };
    this.config.set(updated);
    localStorage.setItem(STORAGE_KEY, encryptData(updated));
    
    // Registrar en auditoría
    this.auditService.logAction('Configuración', 'Actualización de políticas de seguridad y accesos del sistema.', 'Configuración');
    this.toastService.show('Configuración de seguridad guardada exitosamente.', 'success');
  }

  toggleMaintenance(status: boolean) {
    this.saveConfig({ maintenanceMode: status });
    const msg = status ? 'Modo de mantenimiento activado.' : 'Modo de mantenimiento desactivado.';
    this.auditService.logAction('Mantenimiento', msg, 'Sistema');
    this.toastService.show(msg, status ? 'warning' : 'success');
  }

  hasPermission(role: string, module: string): boolean {
    const matrix = this.config().permissionsMatrix || DEFAULT_PERMISSIONS;
    return matrix[role]?.[module] ?? false;
  }
}
