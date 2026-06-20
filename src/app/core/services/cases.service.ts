import { Injectable, signal, computed, inject } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { API_ENDPOINTS } from '../http/api-endpoints';
import { ApiClientService } from '../http/api-client.service';
import type { ActualizarCasoRequest, CasoResponse, EstadoCaso, PrioridadCaso } from '../models/api.models';
import { ToastService } from './toast.service';

export interface Caso {
  id: string;
  codigo: string;
  victim: string;
  anonimo: boolean;
  edad: number;
  distrito: string;
  tipo: string;
  estado: string;
  riesgo: string;
  asignado: string;
  fecha: string;
  emocion: string;
}

@Injectable({
  providedIn: 'root'
})
export class CasesService {
  private readonly toastService = inject(ToastService);
  private readonly api = inject(ApiClientService);

  public readonly casos = signal<Caso[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly loadError = signal<string>('');

  public readonly casesSearchQuery = signal<string>('');
  public readonly casesRiskFilter = signal<string>('all');
  
  // Expediente Seleccionado
  public readonly selectedCase = signal<Caso | null>(null);
  public readonly activeCaseTab = signal<string>('detalles');

  public readonly filteredCasos = computed(() => {
    return this.casos().filter(c => {
      const matchSearch = c.codigo.toLowerCase().includes(this.casesSearchQuery().toLowerCase()) || 
                          c.victim.toLowerCase().includes(this.casesSearchQuery().toLowerCase()) ||
                          c.asignado.toLowerCase().includes(this.casesSearchQuery().toLowerCase());
      
      const matchRisk = this.casesRiskFilter() === 'all' || 
                        c.riesgo.toLowerCase() === this.casesRiskFilter().toLowerCase();
      
      return matchSearch && matchRisk;
    });
  });

  public readonly totalCasos = computed(() => this.casos().length);
  public readonly casosSeveros = computed(() => this.casos().filter(c => c.riesgo === 'Severo').length);
  public readonly casosModerados = computed(() => this.casos().filter(c => c.riesgo === 'Moderado').length);
  public readonly casosLeves = computed(() => this.casos().filter(c => c.riesgo === 'Leve').length);

  constructor() {
    this.loadCasos().subscribe();
  }

  loadCasos(): Observable<Caso[]> {
    this.isLoading.set(true);
    this.loadError.set('');
    return this.api.get<CasoResponse[]>(API_ENDPOINTS.casos).pipe(
      map((response) => response.map((caso) => this.toViewModel(caso))),
      tap((casos) => this.casos.set(casos)),
      catchError(() => {
        this.loadError.set('No se pudieron cargar los casos desde el backend.');
        return of([] as Caso[]);
      }),
      tap(() => this.isLoading.set(false)),
    );
  }

  getCasosByStatus(status: string) {
    return this.casos().filter(c => c.estado === status);
  }

  moveCase(caseId: string, newStatus: string) {
    const estado = this.backendStatus(newStatus);
    const request: ActualizarCasoRequest = { estado };
    this.api.put<CasoResponse>(`${API_ENDPOINTS.casos}/${caseId}`, request).subscribe({
      next: (response) => {
        const updated = this.toViewModel(response);
        this.casos.update((casosList) => casosList.map((caso) => caso.id === caseId ? updated : caso));
        this.toastService.show(`${updated.codigo} movido a estado: ${updated.estado}`, 'success');
      },
      error: () => this.toastService.show('No se pudo actualizar el estado del caso.', 'error'),
    });
  }

  addCase(newCase: Omit<Caso, 'id'>) {
    const id = (this.casos().length + 1).toString();
    this.casos.update(list => [...list, { ...newCase, id }]);
  }

  viewCaseDetails(caso: Caso) {
    this.selectedCase.set(caso);
    this.activeCaseTab.set('detalles');
  }

  closeCaseDrawer() {
    this.selectedCase.set(null);
  }

  private toViewModel(caso: CasoResponse): Caso {
    return {
      id: caso.id,
      codigo: `Caso #${caso.id.slice(0, 8).toUpperCase()}`,
      victim: `Víctima ${caso.victimaId.slice(0, 8)}`,
      anonimo: true,
      edad: 0,
      distrito: caso.distrito,
      tipo: this.tipoFromSummary(caso.resumen),
      estado: this.statusLabel(caso.estado),
      riesgo: this.riskLabel(caso.prioridad),
      asignado: 'Pendiente de asignación',
      fecha: caso.fechaCreacion.split('T')[0] ?? caso.fechaCreacion,
      emocion: 'Seguimiento pendiente',
    };
  }

  private statusLabel(status: EstadoCaso): string {
    const labels: Record<EstadoCaso, string> = {
      REGISTRADO: 'Evaluación',
      EN_EVALUACION: 'Evaluación',
      EN_ATENCION: 'En Proceso',
      DERIVADO: 'Medidas de Protección',
      CERRADO: 'Archivado',
      ARCHIVADO: 'Archivado',
    };
    return labels[status];
  }

  private backendStatus(label: string): EstadoCaso {
    const statuses: Record<string, EstadoCaso> = {
      'Evaluación': 'EN_EVALUACION',
      'En Proceso': 'EN_ATENCION',
      'Medidas de Protección': 'DERIVADO',
      Archivado: 'ARCHIVADO',
    };
    return statuses[label] ?? 'EN_EVALUACION';
  }

  private riskLabel(priority: PrioridadCaso): string {
    const labels: Record<PrioridadCaso, string> = {
      BAJA: 'Leve',
      MEDIA: 'Moderado',
      ALTA: 'Severo',
      CRITICA: 'Severo',
    };
    return labels[priority];
  }

  private tipoFromSummary(summary: string): string {
    const match = summary.match(/Violencia\s+([^.\n]+)/i);
    return match?.[1]?.trim() || 'No especificado';
  }
}
