import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppointmentsService, type Cita } from '../../../core/services/appointments.service';
import { AuthService } from '../../../core/services/auth.service';
import { CasesService, type Caso } from '../../../core/services/cases.service';
import { NotificationsService } from '../../../core/services/notifications.service';
import { PanelPrincipalService } from '../../../core/services/panel-principal.service';
import { ToastService } from '../../../core/services/toast.service';
import type { NotificacionResponse, PanelRolResponse } from '../../../core/models/api.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  protected readonly authService = inject(AuthService);
  protected readonly casesService = inject(CasesService);
  protected readonly appointmentsService = inject(AppointmentsService);
  protected readonly toastService = inject(ToastService);
  private readonly panelService = inject(PanelPrincipalService);
  private readonly notificationsService = inject(NotificationsService);

  protected readonly panel = signal<PanelRolResponse | null>(null);
  protected readonly notifications = signal<NotificacionResponse[]>([]);
  protected readonly isLoadingPanel = signal(false);

  protected readonly dashboardTitle = computed(() => {
    const role = this.authService.currentRole();
    if (role === 'Administrador') return 'Panel de Administración General';
    if (role === 'Recepcionista') return 'Panel de Recepción de Denuncias';
    if (role === 'Psicólogo') return 'Panel Clínico - Psicología';
    if (role === 'Defensor Legal') return 'Panel Jurídico - Defensa Legal';
    return 'Panel SafeZone';
  });

  protected readonly dashboardDescription = computed(() => {
    const role = this.authService.currentRole();
    if (role === 'Administrador') return 'Indicadores, alertas y actividad real registrada en el sistema.';
    if (role === 'Recepcionista') return 'Seguimiento operativo de predenuncias, denuncias, casos y citas.';
    if (role === 'Psicólogo') return 'Casos asignados, citas y seguimiento clínico conectado a la base de datos.';
    if (role === 'Defensor Legal') return 'Expedientes, citas y seguimiento legal conectado a la base de datos.';
    return 'Resumen operativo conectado a la base de datos.';
  });

  protected readonly visibleCases = computed(() => {
    const userId = this.authService.usuarioId();
    const role = this.authService.currentBackendRole();
    const casos = this.casesService.casos();
    const scoped = role === 'PSICOLOGO'
      ? casos.filter((caso) => caso.psicologoId === userId)
      : role === 'DEFENSOR'
        ? casos.filter((caso) => caso.defensorId === userId)
        : casos;

    return [...scoped]
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .slice(0, 6);
  });

  protected readonly visibleCitas = computed(() => {
    const userId = this.authService.usuarioId();
    const role = this.authService.currentBackendRole();
    const citas = this.appointmentsService.citas();
    const scoped = role === 'PSICOLOGO' || role === 'DEFENSOR'
      ? citas.filter((cita) => cita.especialistaId === userId)
      : citas;

    return [...scoped]
      .sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio))
      .slice(0, 6);
  });

  protected readonly recentNotifications = computed(() =>
    [...this.notifications()]
      .sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion))
      .slice(0, 6),
  );

  constructor() {
    this.loadDashboard();
  }

  protected loadDashboard(): void {
    this.isLoadingPanel.set(true);
    this.panelService.load().subscribe({
      next: (panel) => {
        this.panel.set(panel);
        this.isLoadingPanel.set(false);
      },
      error: () => {
        this.toastService.show('No se pudo cargar el panel principal.', 'error');
        this.isLoadingPanel.set(false);
      },
    });

    const usuarioId = this.authService.hasRole('ADMIN', 'SOPORTE') ? undefined : this.authService.usuarioId();
    this.notificationsService.list(usuarioId).subscribe({
      next: (items) => this.notifications.set(items),
      error: () => this.notifications.set([]),
    });
  }

  viewCaseDetails(caso: Caso): void {
    this.casesService.viewCaseDetails(caso);
  }

  protected routeForModule(module: string): string {
    const routes: Record<string, string> = {
      auditoria: '/auditoria',
      casos: '/casos',
      casos_asignados: '/casos',
      citas: '/citas',
      configuracion: '/configuracion',
      denuncias: '/predenuncias',
      evidencias: '/evidencias',
      notificaciones: '/notificaciones',
      predenuncias: '/predenuncias',
      reportes: '/reportes',
      seguimientos: '/casos',
      usuarios: '/usuarios',
      victimas: '/victimas',
    };
    return routes[module] ?? '/dashboard';
  }

  protected indicatorClass(index: number): string {
    return ['card-kpi-brand', 'card-kpi-warning', 'card-kpi-success', 'card-kpi-danger'][index % 4];
  }

  protected notificationBadgeClass(notification: NotificacionResponse): string {
    if (notification.prioridad === 'CRITICA' || notification.prioridad === 'ALTA') return 'badge-risk-severe';
    if (notification.prioridad === 'MEDIA') return 'badge-risk-moderate';
    return 'badge-risk-low';
  }

  protected citaBadgeClass(cita: Cita): string {
    if (cita.estado === 'ATENDIDA') return 'badge-success';
    if (cita.estado === 'CANCELADA' || cita.estado === 'NO_ASISTIO') return 'badge-danger';
    return 'badge-warning';
  }
}
