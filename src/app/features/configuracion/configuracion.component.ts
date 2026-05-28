import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecurityConfigService } from '../../core/services/security-config.service';
import { ToastService } from '../../core/services/toast.service';
import { blockNonNumericKeys, filterNumericInput } from '../../shared/utils/validation.utils';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.scss'
})
export class ConfiguracionComponent implements OnInit {
  protected readonly configService = inject(SecurityConfigService);
  private readonly toastService = inject(ToastService);

  modules = ['Dashboard', 'Denuncias', 'Casos', 'Víctimas', 'Citas', 'Evidencias', 'Reportes', 'Auditoría', 'Configuración'];
  roles = ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal', 'Víctima'];

  // Local state para los formularios antes de guardar
  formData = {
    sessionTimeout: String(this.configService.config().sessionTimeout),
    maxLoginAttempts: String(this.configService.config().maxLoginAttempts),
    require2FA: this.configService.config().require2FA,
    passwordComplexity: this.configService.config().passwordComplexity,
    minPasswordLength: String(this.configService.config().minPasswordLength || 8),
    auditRetention: String(this.configService.config().auditRetention)
  };

  errors = {
    sessionTimeout: '',
    maxLoginAttempts: '',
    minPasswordLength: '',
    auditRetention: ''
  };

  permissionsLocalMatrix: { [role: string]: { [module: string]: boolean } } = {};

  ngOnInit() {
    const serviceMatrix = this.configService.config().permissionsMatrix;
    this.roles.forEach(role => {
      this.permissionsLocalMatrix[role] = {};
      this.modules.forEach(mod => {
        this.permissionsLocalMatrix[role][mod] = serviceMatrix[role]?.[mod] ?? false;
      });
    });
  }

  clearError(field: keyof typeof this.errors) {
    this.errors[field] = '';
  }

  onNumericKeydown(event: KeyboardEvent) {
    blockNonNumericKeys(event);
  }

  onSessionTimeoutInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.formData.sessionTimeout = filterNumericInput(input.value);
    this.clearError('sessionTimeout');
  }

  onMaxLoginAttemptsInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.formData.maxLoginAttempts = filterNumericInput(input.value);
    this.clearError('maxLoginAttempts');
  }

  onMinPasswordLengthInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.formData.minPasswordLength = filterNumericInput(input.value);
    this.clearError('minPasswordLength');
  }

  onAuditRetentionInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.formData.auditRetention = filterNumericInput(input.value);
    this.clearError('auditRetention');
  }

  togglePermission(role: string, module: string) {
    if (role === 'Administrador' && (module === 'Configuración' || module === 'Dashboard')) {
      return;
    }
    this.permissionsLocalMatrix[role][module] = !this.permissionsLocalMatrix[role][module];
  }

  saveSecurityConfig() {
    let hasError = false;

    const timeout = Number(this.formData.sessionTimeout);
    const attempts = Number(this.formData.maxLoginAttempts);
    const passLen = Number(this.formData.minPasswordLength);
    const retention = Number(this.formData.auditRetention);

    // Validar Session Timeout
    if (!this.formData.sessionTimeout) {
      this.errors.sessionTimeout = 'El tiempo de expiración es obligatorio.';
      hasError = true;
    } else if (isNaN(timeout) || timeout < 5 || timeout > 120) {
      this.errors.sessionTimeout = 'Debe estar en el rango de 5 a 120 minutos.';
      hasError = true;
    } else {
      this.errors.sessionTimeout = '';
    }

    // Validar Intentos Fallidos
    if (!this.formData.maxLoginAttempts) {
      this.errors.maxLoginAttempts = 'Los intentos fallidos son obligatorios.';
      hasError = true;
    } else if (isNaN(attempts) || attempts < 1 || attempts > 10) {
      this.errors.maxLoginAttempts = 'Debe estar en el rango de 1 a 10 intentos.';
      hasError = true;
    } else {
      this.errors.maxLoginAttempts = '';
    }

    // Validar Longitud Mínima Contraseña
    if (!this.formData.minPasswordLength) {
      this.errors.minPasswordLength = 'La longitud de contraseña es obligatoria.';
      hasError = true;
    } else if (isNaN(passLen) || passLen < 6 || passLen > 20) {
      this.errors.minPasswordLength = 'Debe estar en el rango de 6 a 20 caracteres.';
      hasError = true;
    } else {
      this.errors.minPasswordLength = '';
    }

    // Validar Retención de Auditoría
    if (!this.formData.auditRetention) {
      this.errors.auditRetention = 'Los días de retención son obligatorios.';
      hasError = true;
    } else if (isNaN(retention) || retention < 30 || retention > 365) {
      this.errors.auditRetention = 'Debe estar en el rango de 30 a 365 días.';
      hasError = true;
    } else {
      this.errors.auditRetention = '';
    }

    if (hasError) {
      this.toastService.show('Por favor, corrija los errores del formulario.', 'error');
      return;
    }

    this.configService.saveConfig({
      sessionTimeout: timeout,
      maxLoginAttempts: attempts,
      require2FA: this.formData.require2FA,
      passwordComplexity: this.formData.passwordComplexity,
      minPasswordLength: passLen,
      auditRetention: retention,
      permissionsMatrix: this.permissionsLocalMatrix
    });
  }

  toggleMaintenance() {
    const current = this.configService.config().maintenanceMode;
    this.configService.toggleMaintenance(!current);
  }
}
