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
    { label: 'Panel', path: '/dashboard', icon: 'grid_view' },
    { label: 'Denuncias', path: '/denuncias', icon: 'edit_document', hasArrow: true },
    { label: 'Casos', path: '/casos', icon: 'folder_managed', hasArrow: true },
    { label: 'Víctimas', path: '/victimas', icon: 'health_and_safety', hasArrow: true },
    { label: 'Citas', path: '/citas', icon: 'calendar_month', hasArrow: true },
    { label: 'Evidencias', path: '/evidencias', icon: 'upload_file', hasArrow: true },
    { label: 'Reportes', path: '/reportes', icon: 'bar_chart', hasArrow: true }
  ];

  protected readonly configItems: SidebarItem[] = [
    { label: 'Auditoría', path: '/auditoria', icon: 'history', hasArrow: true },
    { label: 'Usuarios', path: '/usuarios', icon: 'group', hasArrow: true },
    { label: 'Configuración', path: '/configuracion', icon: 'settings' }
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
