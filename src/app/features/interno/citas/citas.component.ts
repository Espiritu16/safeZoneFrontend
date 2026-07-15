import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentsService, type Cita } from '../../../core/services/appointments.service';
import { CasesService } from '../../../core/services/cases.service';
import type { EstadoCita, TipoCita } from '../../../core/models/api.models';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { TrimOnBlurDirective } from '../../../shared/directives/trim-on-blur.directive';
import { normalizeText } from '../../../shared/utils/input-sanitizers.util';
import { VALIDATION_LIMITS } from '../../../shared/utils/validation-rules';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, TrimOnBlurDirective],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.scss'
})
export class CitasComponent {
  protected readonly appointmentsService = inject(AppointmentsService);
  protected readonly casesService = inject(CasesService);
  protected readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  protected readonly searchQuery = signal('');
  protected readonly typeFilter = signal<TipoCita | 'TODAS'>('TODAS');
  protected readonly dateFromFilter = signal('');
  protected readonly dateToFilter = signal('');
  protected readonly cancelingCita = signal<Cita | null>(null);
  protected readonly cancelReason = signal('');

  protected readonly estados: Array<{ value: EstadoCita | 'TODAS'; label: string }> = [
    { value: 'TODAS', label: 'Todas' },
    { value: 'PROGRAMADA', label: 'Programadas' },
    { value: 'CONFIRMADA', label: 'Confirmadas' },
    { value: 'ATENDIDA', label: 'Atendidas' },
    { value: 'NO_ASISTIO', label: 'No asistió' },
    { value: 'CANCELADA', label: 'Canceladas' },
  ];

  protected readonly estadosAtencion: Array<{ value: EstadoCita; label: string }> = [
    { value: 'CONFIRMADA', label: 'Confirmar' },
    { value: 'ATENDIDA', label: 'Atendida' },
    { value: 'NO_ASISTIO', label: 'No asistió' },
  ];

  protected readonly tipos: Array<{ value: TipoCita | 'TODAS'; label: string }> = [
    { value: 'TODAS', label: 'Todos los tipos' },
    { value: 'PSICOLOGIA', label: 'Psicológicas' },
    { value: 'LEGAL', label: 'Legales' },
  ];

  protected readonly forcedTipoCita = computed<TipoCita | null>(() => {
    if (this.authService.hasRole('DEFENSOR')) {
      return 'LEGAL';
    }
    if (this.authService.hasRole('PSICOLOGO')) {
      return 'PSICOLOGIA';
    }
    return null;
  });

  protected readonly forcedTipoLabel = computed(() => this.forcedTipoCita() === 'LEGAL' ? 'Legal' : 'Psicológica');

  protected readonly visibleCitas = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const type = this.forcedTipoCita() ?? this.typeFilter();

    return this.appointmentsService.filteredCitas().filter((cita) => {
      const matchesSearch =
        !query ||
        cita.caso.toLowerCase().includes(query) ||
        cita.victima.toLowerCase().includes(query) ||
        cita.profesional.toLowerCase().includes(query) ||
        cita.tipo.toLowerCase().includes(query) ||
        cita.estadoLabel.toLowerCase().includes(query) ||
        (cita.observaciones ?? '').toLowerCase().includes(query);
      const matchesType = type === 'TODAS' || cita.tipoCita === type;
      const matchesDateFrom = !this.dateFromFilter() || cita.fecha >= this.dateFromFilter();
      const matchesDateTo = !this.dateToFilter() || cita.fecha <= this.dateToFilter();
      return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
    });
  });

  protected actualizarEstado(citaId: string, value: string): void {
    const cita = this.appointmentsService.citas().find((item) => item.id === citaId);
    if (cita && value) {
      this.appointmentsService.actualizarEstado(cita, value as EstadoCita);
    }
  }

  protected openCancelModal(cita: Cita): void {
    this.cancelingCita.set(cita);
    this.cancelReason.set(cita.motivoCancelacion ?? '');
  }

  protected openCreateModal(): void {
    this.appointmentsService.openCreateModal();
    this.applyForcedTipoCita();
  }

  protected openEditModal(cita: Cita): void {
    this.appointmentsService.openEditModal(cita);
    this.applyForcedTipoCita();
  }

  protected saveCita(): void {
    this.applyForcedTipoCita();
    this.appointmentsService.saveCita();
  }

  protected closeCancelModal(): void {
    this.cancelingCita.set(null);
    this.cancelReason.set('');
  }

  protected confirmCancel(): void {
    const cita = this.cancelingCita();
    const reason = normalizeText(this.cancelReason());
    if (!cita) {
      return;
    }
    if (!reason) {
      this.toastService.show('Ingrese el motivo de cancelación.', 'error');
      return;
    }
    if (reason.length > VALIDATION_LIMITS.NOTES_MAX) {
      this.toastService.show('El motivo no debe superar los 500 caracteres.', 'error');
      return;
    }

    this.appointmentsService.actualizarEstado(cita, 'CANCELADA', reason);
    this.closeCancelModal();
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.typeFilter.set(this.forcedTipoCita() ?? 'TODAS');
    this.dateFromFilter.set('');
    this.dateToFilter.set('');
    this.appointmentsService.statusFilter.set('TODAS');
  }

  private applyForcedTipoCita(): void {
    const tipo = this.forcedTipoCita();
    if (tipo) {
      this.appointmentsService.nuevaCita.tipoCita = tipo;
      this.typeFilter.set(tipo);
    }
  }
}
