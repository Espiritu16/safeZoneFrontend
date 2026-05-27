import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';
import { AuditService } from '../../../core/services/audit.service';

/** Mapa de visibilidad de módulos por rol */
const ROLE_ACCESS: Record<string, string[]> = {
  'dashboard':    ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal'],
  'denuncias':    ['Administrador', 'Recepcionista'],
  'casos':        ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal'],
  'victimas':     ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal'],
  'citas':        ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal'],
  'evidencias':   ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal'],
  'reportes':     ['Administrador', 'Psicólogo', 'Defensor Legal'],
  'auditoria':    ['Administrador'],
  'usuarios':     ['Administrador'],
  'configuracion':['Administrador'],
};

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

  /** Verifica si el rol actual tiene acceso al módulo indicado */
  hasAccess(module: string): boolean {
    const allowed = ROLE_ACCESS[module];
    return allowed ? allowed.includes(this.authService.currentRole()) : false;
  }

  logout() {
    this.auditService.logAction('Cierre de Sesión', 'El usuario cerró su sesión activamente.', 'Auth');
    this.authService.logout();
  }
}
