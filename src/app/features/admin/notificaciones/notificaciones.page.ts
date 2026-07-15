import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from '../../../core/services/notifications.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import type { NotificacionResponse, PrioridadNotificacion, TipoNotificacion } from '../../../core/models/api.models';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notificaciones.page.html',
  styleUrl: './notificaciones.page.css',
})
export class NotificacionesPage {
  private readonly notificationsService = inject(NotificationsService);
  protected readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  protected readonly notificaciones = signal<NotificacionResponse[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly searchQuery = signal('');
  protected readonly statusFilter = signal<'all' | 'pending' | 'read'>('all');
  protected readonly priorityFilter = signal<PrioridadNotificacion | 'all'>('all');
  protected readonly typeFilter = signal<TipoNotificacion | 'all'>('all');

  protected readonly priorityOptions: Array<{ value: PrioridadNotificacion | 'all'; label: string }> = [
    { value: 'all', label: 'Todas las prioridades' },
    { value: 'CRITICA', label: 'Crítica' },
    { value: 'ALTA', label: 'Alta' },
    { value: 'MEDIA', label: 'Media' },
    { value: 'BAJA', label: 'Baja' },
  ];

  protected readonly typeOptions: Array<{ value: TipoNotificacion | 'all'; label: string }> = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'RIESGO_CRITICO', label: 'Riesgo crítico' },
    { value: 'SISTEMA', label: 'Sistema' },
    { value: 'RECORDATORIO', label: 'Recordatorio' },
  ];

  protected readonly filteredNotificaciones = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const status = this.statusFilter();
    const priority = this.priorityFilter();
    const type = this.typeFilter();

    return this.notificaciones().filter((notificacion) => {
      const matchesSearch =
        !query ||
        notificacion.titulo.toLowerCase().includes(query) ||
        notificacion.mensaje.toLowerCase().includes(query) ||
        notificacion.tipo.toLowerCase().includes(query) ||
        notificacion.prioridad.toLowerCase().includes(query);
      const matchesStatus = status === 'all' || (status === 'read' ? notificacion.leida : !notificacion.leida);
      const matchesPriority = priority === 'all' || notificacion.prioridad === priority;
      const matchesType = type === 'all' || notificacion.tipo === type;
      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });
  });

  protected readonly hasActiveFilters = computed(() =>
    Boolean(this.searchQuery().trim()) ||
    this.statusFilter() !== 'all' ||
    this.priorityFilter() !== 'all' ||
    this.typeFilter() !== 'all',
  );

  constructor() {
    this.load();
  }

  protected load(): void {
    this.isLoading.set(true);
    const usuarioId = this.authService.hasRole('ADMIN', 'SOPORTE') ? undefined : this.authService.usuarioId();
    this.notificationsService.list(usuarioId).subscribe({
      next: (items) => {
        this.notificaciones.set(items);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.show('No se pudieron cargar las notificaciones.', 'error');
        this.isLoading.set(false);
      },
    });
  }

  protected marcarLeida(notificacion: NotificacionResponse): void {
    this.notificationsService.markAsRead(notificacion.id).subscribe({
      next: () => this.load(),
      error: () => this.toastService.show('No se pudo marcar como leída.', 'error'),
    });
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('all');
    this.priorityFilter.set('all');
    this.typeFilter.set('all');
  }
}
