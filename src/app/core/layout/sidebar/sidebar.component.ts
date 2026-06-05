import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';
import { AuditService } from '../../../core/services/audit.service';

interface SidebarItem {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
  readonly hasArrow?: boolean;
}

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

  protected readonly navItems: SidebarItem[] = [
    { label: 'Panel', path: '/dashboard', icon: 'bi-grid-1x2-fill' },
    { label: 'Denuncias', path: '/denuncias', icon: 'bi-file-earmark-text', hasArrow: true },
    { label: 'Casos', path: '/casos', icon: 'bi-folder2-open', hasArrow: true },
    { label: 'Víctimas', path: '/victimas', icon: 'bi-shield-check', hasArrow: true },
    { label: 'Citas', path: '/citas', icon: 'bi-calendar3', hasArrow: true },
    { label: 'Evidencias', path: '/evidencias', icon: 'bi-file-earmark-arrow-up', hasArrow: true },
    { label: 'Reportes', path: '/reportes', icon: 'bi-bar-chart', hasArrow: true }
  ];

  protected readonly configItems: SidebarItem[] = [
    { label: 'Auditoría', path: '/auditoria', icon: 'bi-clock-history', hasArrow: true },
    { label: 'Usuarios', path: '/usuarios', icon: 'bi-people', hasArrow: true },
    { label: 'Configuración', path: '/configuracion', icon: 'bi-gear' }
  ];

  protected readonly userName = 'SafeZone';
  protected readonly userRole = 'ADMINISTRADOR';

  /** Modo demo de diseño: todos los módulos internos se muestran sin filtrar por rol. */
  hasAccess(_module: string): boolean {
    return true;
  }

  logout() {
    this.auditService.logAction('Cierre de Sesión', 'El usuario cerró su sesión activamente.', 'Auth');
    this.authService.logout();
  }
}
