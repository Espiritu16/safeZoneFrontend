import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';
import { AuditService } from '../../../core/services/audit.service';

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

  /** Modo demo de diseño: todos los módulos internos se muestran sin filtrar por rol. */
  hasAccess(_module: string): boolean {
    return true;
  }

  logout() {
    this.auditService.logAction('Cierre de Sesión', 'El usuario cerró su sesión activamente.', 'Auth');
    this.authService.logout();
  }
}
