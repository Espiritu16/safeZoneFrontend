import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuditService } from '../../../core/services/audit.service';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';
import type { FrontendRole } from '../../models/api.models';

interface SidebarItem {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
  readonly module: string;
  readonly allowedRoles: FrontendRole[];
  readonly hasArrow?: boolean;
}

const INTERNAL_ROLES: FrontendRole[] = ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal', 'Soporte Técnico'];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  protected readonly authService = inject(AuthService);
  protected readonly layoutService = inject(LayoutService);
  protected readonly auditService = inject(AuditService);

  protected readonly navItems: SidebarItem[] = [
    { label: 'Panel', path: '/dashboard', icon: 'bi-grid-1x2-fill', module: 'dashboard', allowedRoles: INTERNAL_ROLES },
    { label: 'Predenuncias', path: '/predenuncias', icon: 'bi-inbox', module: 'predenuncias', allowedRoles: ['Administrador', 'Recepcionista'], hasArrow: true },
    { label: 'Denuncias', path: '/denuncias', icon: 'bi-file-earmark-text', module: 'denuncias', allowedRoles: ['Administrador', 'Recepcionista'], hasArrow: true },
    { label: 'Casos', path: '/casos', icon: 'bi-folder2-open', module: 'casos', allowedRoles: ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal'], hasArrow: true },
    { label: 'Víctimas', path: '/victimas', icon: 'bi-shield-check', module: 'victimas', allowedRoles: ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal'], hasArrow: true },
    { label: 'Citas', path: '/citas', icon: 'bi-calendar3', module: 'citas', allowedRoles: ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal'], hasArrow: true },
    { label: 'Evidencias', path: '/evidencias', icon: 'bi-file-earmark-arrow-up', module: 'evidencias', allowedRoles: ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal'], hasArrow: true },
    { label: 'Reportes', path: '/reportes', icon: 'bi-bar-chart', module: 'reportes', allowedRoles: ['Administrador', 'Psicólogo', 'Defensor Legal'], hasArrow: true },
  ];

  protected readonly configItems: SidebarItem[] = [
    { label: 'Auditoría', path: '/auditoria', icon: 'bi-clock-history', module: 'auditoria', allowedRoles: ['Administrador', 'Soporte Técnico'], hasArrow: true },
    { label: 'Usuarios', path: '/usuarios', icon: 'bi-people', module: 'usuarios', allowedRoles: ['Administrador', 'Soporte Técnico'], hasArrow: true },
    { label: 'Configuración', path: '/configuracion', icon: 'bi-gear', module: 'configuracion', allowedRoles: ['Administrador', 'Soporte Técnico'] },
  ];

  protected hasAccess(item: SidebarItem): boolean {
    return item.allowedRoles.includes(this.authService.currentRole());
  }

  protected logout(): void {
    this.auditService.logAction('Cierre de Sesión', 'El usuario cerró su sesión activamente.', 'Auth');
    this.authService.logout();
  }

  protected userInitials(): string {
    const name = this.authService.nombre() || this.authService.correo() || 'SZ';
    return name
      .split(/\s|@/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }
}
