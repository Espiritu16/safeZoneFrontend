import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';
import { AuditService } from '../../../core/services/audit.service';
import { SecurityConfigService } from '../../../core/services/security-config.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  protected readonly authService = inject(AuthService);
  protected readonly layoutService = inject(LayoutService);
  protected readonly auditService = inject(AuditService);
  private readonly configService = inject(SecurityConfigService);

  /** Verifica si el rol actual tiene acceso al módulo indicado */
  hasAccess(module: string): boolean {
    const role = this.authService.currentRole();
    let moduleKey = module.charAt(0).toUpperCase() + module.slice(1);
    if (moduleKey === 'Configuracion') moduleKey = 'Configuración';
    if (moduleKey === 'Auditoria') moduleKey = 'Auditoría';
    if (moduleKey === 'Victimas') moduleKey = 'Víctimas';
    
    return this.configService.hasPermission(role, moduleKey);
  }

  logout() {
    this.auditService.logAction('Cierre de Sesión', 'El usuario cerró su sesión activamente.', 'Auth');
    this.authService.logout();
  }
}
