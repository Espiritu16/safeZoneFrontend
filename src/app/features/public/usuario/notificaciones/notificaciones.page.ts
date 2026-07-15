import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import type { NotificacionResponse } from '../../../../core/models/api.models';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationsService } from '../../../../core/services/notifications.service';

@Component({
  selector: 'app-usuario-notificaciones-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.page.html',
  styleUrl: './notificaciones.page.css'
})
export class UsuarioNotificacionesPage {
  private readonly authService = inject(AuthService);
  private readonly notificationsService = inject(NotificationsService);
  protected readonly notificaciones = signal<NotificacionResponse[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly error = signal('');

  constructor() {
    this.load();
  }

  protected load(): void {
    this.isLoading.set(true);
    this.error.set('');
    this.notificationsService.listMine().subscribe({
      next: (items) => {
        this.notificaciones.set(items);
        this.isLoading.set(false);
      },
      error: () => this.loadLegacyNotifications(),
    });
  }

  private loadLegacyNotifications(): void {
    const usuarioId = this.authService.usuarioId();
    if (!usuarioId) {
      this.error.set('No se pudieron cargar las notificaciones.');
      this.isLoading.set(false);
      return;
    }
    this.notificationsService.list(usuarioId).subscribe({
      next: (items) => {
        this.notificaciones.set(items);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las notificaciones.');
        this.isLoading.set(false);
      },
    });
  }

  protected marcarLeida(notificacion: NotificacionResponse): void {
    this.notificationsService.markAsRead(notificacion.id).subscribe({
      next: () => this.load(),
      error: () => this.error.set('No se pudo marcar la notificación como leída.'),
    });
  }
}
