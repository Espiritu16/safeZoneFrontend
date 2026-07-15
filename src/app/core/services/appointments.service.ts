import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, tap } from 'rxjs';
import { API_ENDPOINTS } from '../http/api-endpoints';
import { ApiClientService } from '../http/api-client.service';
import type {
  ActualizarCitaRequest,
  CasoResponse,
  CitaResponse,
  CrearCitaRequest,
  EstadoCita,
  TipoCita,
  UsuarioResponse,
} from '../models/api.models';
import { normalizeText } from '../../shared/utils/input-sanitizers.util';
import { VALIDATION_LIMITS } from '../../shared/utils/validation-rules';
import { ToastService } from './toast.service';
import { UsuariosService } from './usuarios.service';

export interface Cita {
  id: string;
  casoId: string;
  caso: string;
  victimaId: string;
  victima: string;
  especialistaId: string;
  profesional: string;
  tipoCita: TipoCita;
  tipo: string;
  fechaInicio: string;
  fechaFin: string;
  fecha: string;
  hora: string;
  fechaFinLabel: string;
  horaFin: string;
  estado: EstadoCita;
  estadoLabel: string;
  motivoCancelacion?: string | null;
  observaciones?: string | null;
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private readonly api = inject(ApiClientService);
  private readonly toastService = inject(ToastService);
  private readonly usuariosService = inject(UsuariosService);
  private usuariosById = new Map<string, UsuarioResponse>();
  private casosById = new Map<string, CasoResponse>();

  public readonly citas = signal<Cita[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly loadError = signal<string>('');
  public readonly showAppointmentModal = signal<boolean>(false);
  public readonly editingCita = signal<Cita | null>(null);
  public readonly calendarView = signal<string>('agenda');
  public readonly statusFilter = signal<EstadoCita | 'TODAS'>('TODAS');

  public nuevaCita: CrearCitaRequest = {
    casoId: '',
    tipoCita: 'PSICOLOGIA',
    fechaInicio: this.defaultStart(),
    fechaFin: null,
    observaciones: '',
  };

  public readonly filteredCitas = computed(() => {
    const status = this.statusFilter();
    return status === 'TODAS' ? this.citas() : this.citas().filter((cita) => cita.estado === status);
  });

  constructor() {
    this.loadCitas().subscribe();
  }

  list(): Observable<CitaResponse[]> {
    return this.api.get<CitaResponse[]>(API_ENDPOINTS.citas);
  }

  create(request: CrearCitaRequest): Observable<CitaResponse> {
    return this.api.post<CitaResponse>(API_ENDPOINTS.citas, request);
  }

  update(id: string, request: ActualizarCitaRequest): Observable<CitaResponse> {
    return this.api.put<CitaResponse>(`${API_ENDPOINTS.citas}/${id}`, request);
  }

  inactivar(id: string): Observable<void> {
    return this.api.patch<void>(`${API_ENDPOINTS.citas}/${id}/inactivar`);
  }

  loadCitas(): Observable<Cita[]> {
    this.isLoading.set(true);
    this.loadError.set('');
    return forkJoin({
      citas: this.list(),
      casos: this.api.get<CasoResponse[]>(API_ENDPOINTS.casos).pipe(catchError(() => of([] as CasoResponse[]))),
      usuarios: this.usuariosService.list().pipe(catchError(() => of([] as UsuarioResponse[]))),
    }).pipe(
      tap(({ casos, usuarios }) => {
        this.casosById = new Map(casos.map((caso) => [caso.id, caso]));
        this.usuariosById = new Map(usuarios.map((usuario) => [usuario.id, usuario]));
      }),
      map(({ citas }) => citas.map((cita) => this.toViewModel(cita))),
      tap((citas) => this.citas.set(citas)),
      catchError(() => {
        this.loadError.set('No se pudieron cargar las citas.');
        this.toastService.show('No se pudieron cargar las citas.', 'error');
        return of([] as Cita[]);
      }),
      tap(() => this.isLoading.set(false)),
    );
  }

  openCreateModal(casoId = ''): void {
    this.editingCita.set(null);
    this.nuevaCita = {
      casoId,
      tipoCita: 'PSICOLOGIA',
      fechaInicio: this.defaultStart(),
      fechaFin: null,
      observaciones: '',
    };
    this.showAppointmentModal.set(true);
  }

  openEditModal(cita: Cita): void {
    this.editingCita.set(cita);
    this.nuevaCita = {
      casoId: cita.casoId,
      tipoCita: cita.tipoCita,
      fechaInicio: cita.fechaInicio.slice(0, 16),
      fechaFin: cita.fechaFin ? cita.fechaFin.slice(0, 16) : null,
      observaciones: cita.observaciones ?? '',
    };
    this.showAppointmentModal.set(true);
  }

  closeModal(): void {
    this.showAppointmentModal.set(false);
    this.editingCita.set(null);
  }

  saveCita(): void {
    const request = this.sanitizeRequest(this.nuevaCita);
    const error = this.validateRequest(request);
    if (error) {
      this.toastService.show(error, 'error');
      return;
    }

    const editing = this.editingCita();
    const action$ = editing
      ? this.update(editing.id, {
          tipoCita: request.tipoCita,
          fechaInicio: request.fechaInicio,
          fechaFin: request.fechaFin,
          observaciones: request.observaciones,
        })
      : this.create(request);

    action$.subscribe({
      next: () => {
        this.toastService.show(editing ? 'Cita reprogramada correctamente.' : 'Cita programada correctamente.', 'success');
        this.closeModal();
        this.loadCitas().subscribe();
      },
      error: (errorResponse) => {
        const message = errorResponse?.error?.message || 'No se pudo guardar la cita. Verifique disponibilidad y asignación.';
        this.toastService.show(message, 'error');
      },
    });
  }

  actualizarEstado(cita: Cita, estado: EstadoCita, motivoCancelacion?: string): void {
    this.update(cita.id, {
      estado,
      motivoCancelacion: motivoCancelacion || cita.motivoCancelacion || null,
    }).subscribe({
      next: () => {
        this.toastService.show('Estado de cita actualizado.', 'success');
        this.loadCitas().subscribe();
      },
      error: () => this.toastService.show('No se pudo actualizar el estado de la cita.', 'error'),
    });
  }

  private sanitizeRequest(request: CrearCitaRequest): CrearCitaRequest {
    return {
      ...request,
      casoId: request.casoId.trim(),
      fechaInicio: this.toBackendDateTime(request.fechaInicio),
      fechaFin: request.fechaFin ? this.toBackendDateTime(request.fechaFin) : null,
      observaciones: normalizeText(request.observaciones ?? ''),
    };
  }

  private validateRequest(request: CrearCitaRequest): string {
    if (!request.casoId) {
      return 'Seleccione un caso vinculado.';
    }
    if (!request.fechaInicio) {
      return 'Seleccione fecha y hora de inicio.';
    }
    if (request.fechaFin && request.fechaFin <= request.fechaInicio) {
      return 'La fecha de fin debe ser posterior al inicio.';
    }
    if ((request.observaciones ?? '').length > VALIDATION_LIMITS.NOTES_MAX) {
      return 'Las observaciones no deben superar los 500 caracteres.';
    }
    return '';
  }

  private toViewModel(cita: CitaResponse): Cita {
    const caso = this.casosById.get(cita.casoId);
    const victima = this.usuariosById.get(cita.victimaId);
    const profesional = this.usuariosById.get(cita.especialistaId);
    const fechaFin = cita.fechaFin ?? '';
    return {
      id: cita.id,
      casoId: cita.casoId,
      caso: caso ? `Caso #${caso.id.slice(0, 8).toUpperCase()}` : `Caso #${cita.casoId.slice(0, 8).toUpperCase()}`,
      victimaId: cita.victimaId,
      victima: victima ? `${victima.nombres} ${victima.apellidos}`.trim() || victima.correo : `Víctima ${cita.victimaId.slice(0, 8)}`,
      especialistaId: cita.especialistaId,
      profesional: profesional ? `${profesional.nombres} ${profesional.apellidos}`.trim() || profesional.correo : `Profesional ${cita.especialistaId.slice(0, 8)}`,
      tipoCita: cita.tipoCita,
      tipo: cita.tipoCita === 'PSICOLOGIA' ? 'Psicológica' : 'Legal',
      fechaInicio: cita.fechaInicio,
      fechaFin: cita.fechaFin,
      fecha: cita.fechaInicio.split('T')[0],
      hora: cita.fechaInicio.substring(11, 16),
      fechaFinLabel: fechaFin ? fechaFin.split('T')[0] : 'Sin fin',
      horaFin: fechaFin ? fechaFin.substring(11, 16) : 'Sin definir',
      estado: cita.estado,
      estadoLabel: this.estadoLabel(cita.estado),
      motivoCancelacion: cita.motivoCancelacion,
      observaciones: cita.observaciones,
      color: cita.tipoCita === 'PSICOLOGIA' ? 'psychology' : 'legal',
    };
  }

  private estadoLabel(estado: EstadoCita): string {
    const labels: Record<EstadoCita, string> = {
      PROGRAMADA: 'Programada',
      CONFIRMADA: 'Confirmada',
      CANCELADA: 'Cancelada',
      ATENDIDA: 'Atendida',
      NO_ASISTIO: 'No asistió',
    };
    return labels[estado];
  }

  private defaultStart(): string {
    const date = new Date();
    date.setHours(date.getHours() + 2, 0, 0, 0);
    return date.toISOString().slice(0, 16);
  }

  private toBackendDateTime(value: string): string {
    return value.length === 16 ? `${value}:00-05:00` : value;
  }
}
