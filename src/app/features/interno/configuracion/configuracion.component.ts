import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecurityConfigService } from '../../../core/services/security-config.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.scss'
})
export class ConfiguracionComponent {
  protected readonly configService = inject(SecurityConfigService);

  // Local state para los formularios antes de guardar
  formData = {
    sessionTimeout: this.configService.config().sessionTimeout,
    maxLoginAttempts: this.configService.config().maxLoginAttempts,
    require2FA: this.configService.config().require2FA,
    passwordComplexity: this.configService.config().passwordComplexity,
    auditRetention: this.configService.config().auditRetention
  };

  saveSecurityConfig() {
    this.configService.saveConfig({
      sessionTimeout: this.formData.sessionTimeout,
      maxLoginAttempts: this.formData.maxLoginAttempts,
      require2FA: this.formData.require2FA,
      passwordComplexity: this.formData.passwordComplexity,
      auditRetention: this.formData.auditRetention
    });
  }

  toggleMaintenance() {
    const current = this.configService.config().maintenanceMode;
    this.configService.toggleMaintenance(!current);
  }
}
