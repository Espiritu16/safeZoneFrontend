import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecurityConfigService } from '../../../core/services/security-config.service';
import { ToastService } from '../../../core/services/toast.service';
import { NumbersOnlyDirective } from '../../../shared/directives/numbers-only.directive';
import { sanitizeNumbersOnly } from '../../../shared/utils/input-sanitizers.util';
import { VALIDATION_LIMITS } from '../../../shared/utils/validation-rules';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule, NumbersOnlyDirective],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.scss'
})
export class ConfiguracionComponent {
  protected readonly configService = inject(SecurityConfigService);
  private readonly toastService = inject(ToastService);

  // Local state para los formularios antes de guardar
  formData = {
    sessionTimeout: String(this.configService.config().sessionTimeout),
    maxLoginAttempts: String(this.configService.config().maxLoginAttempts),
    require2FA: this.configService.config().require2FA,
    passwordComplexity: this.configService.config().passwordComplexity,
    auditRetention: String(this.configService.config().auditRetention)
  };

  saveSecurityConfig() {
    const sessionTimeout = Number(sanitizeNumbersOnly(this.formData.sessionTimeout));
    const maxLoginAttempts = Number(sanitizeNumbersOnly(this.formData.maxLoginAttempts));
    const auditRetention = Number(sanitizeNumbersOnly(this.formData.auditRetention));

    if (sessionTimeout < VALIDATION_LIMITS.SESSION_TIMEOUT_MIN || sessionTimeout > VALIDATION_LIMITS.SESSION_TIMEOUT_MAX) {
      this.toastService.show('La expiración de sesión debe estar entre 5 y 120 minutos.', 'error');
      return;
    }
    if (maxLoginAttempts < VALIDATION_LIMITS.LOGIN_ATTEMPTS_MIN || maxLoginAttempts > VALIDATION_LIMITS.LOGIN_ATTEMPTS_MAX) {
      this.toastService.show('Los intentos fallidos permitidos deben estar entre 1 y 10.', 'error');
      return;
    }
    if (auditRetention < VALIDATION_LIMITS.AUDIT_RETENTION_MIN || auditRetention > VALIDATION_LIMITS.AUDIT_RETENTION_MAX) {
      this.toastService.show('La retención de auditoría debe estar entre 30 y 365 días.', 'error');
      return;
    }

    this.configService.saveConfig({
      sessionTimeout,
      maxLoginAttempts,
      require2FA: this.formData.require2FA,
      passwordComplexity: this.formData.passwordComplexity,
      auditRetention
    });
  }

  toggleMaintenance() {
    const current = this.configService.config().maintenanceMode;
    this.configService.toggleMaintenance(!current);
  }
}
