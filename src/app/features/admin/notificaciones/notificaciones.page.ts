import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.page.html',
  styleUrl: './notificaciones.page.css'
})
export default class NotificacionesPageComponent {
  public readonly notificationService = inject(NotificationService);

  marcarLeida(id: string) {
    this.notificationService.marcarComoLeida(id);
  }
}
