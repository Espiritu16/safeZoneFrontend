import { Injectable, signal, computed, inject } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, tap } from 'rxjs';
import { API_ENDPOINTS } from '../http/api-endpoints';
import { ApiClientService } from '../http/api-client.service';
import type {
  ActualizarCasoRequest,
  CasoResponse,
  DenunciaResponse,
  EstadoCaso,
  PrioridadCaso,
  UsuarioResponse,
} from '../models/api.models';
import { DenunciasService } from './denuncias.service';
import { ToastService } from './toast.service';
import { UsuariosService } from './usuarios.service';

const TIPO_VIOLENCIA_LABELS: Record<string, string> = {
  FISICA: 'Violencia Física',
  PSICOLOGICA: 'Violencia Psicológica',
  SEXUAL: 'Violencia Sexual',
  ECONOMICA: 'Violencia Económica',
  PATRIMONIAL:'Violencia Patrimonial',
  DIGITAL: 'Violencia Digital',
  OTRA: 'Otra',
};

export interface Caso {
  id: string;
  codigo: string;
  victim: string;
  anonimo: boolean;
  edad: string;
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
  private readonly denunciasService = inject(DenunciasService);
  private readonly usuariosService = inject(UsuariosService);
  public readonly showModal = signal<boolean>(false);
  private denunciasByCasoId = new Map<string, DenunciaResponse>();
  private usuariosById = new Map<string, UsuarioResponse>();

  public readonly casos = signal<Caso[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly loadError = signal<string>('');
  public readonly editingCase = signal<Caso | null>(null);
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
  public readonly casosAltos=computed(()=>this.casos().filter(c=>c.riesgo ==='Alto').length);
  public readonly casosLeves = computed(() => this.casos().filter(c => c.riesgo === 'Leve').length);

  constructor() {
    this.loadCasos().subscribe();
  }
  openEditModal(caso: Caso) {
      this.editingCase.set({...caso})
      this.showModal.set(true);
  }
  closeModal() {
    this.showModal.set(false);
    this.editingCase.set(null);
  }
  loadCasos(): Observable<Caso[]> {
    this.isLoading.set(true);
    this.loadError.set('');
    return forkJoin({
      casos: this.api.get<CasoResponse[]>(API_ENDPOINTS.casos),
      denuncias: this.denunciasService.list().pipe(catchError(() => of([] as DenunciaResponse[]))),
      usuarios: this.usuariosService.list().pipe(catchError(() => of([] as UsuarioResponse[]))),
    }).pipe(
      tap(({ denuncias, usuarios }) => this.syncLookupMaps(denuncias, usuarios)),
      map(({ casos }) => casos.map((caso) => this.toViewModel(caso))),
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
    this.editCase(caseId, { estado });
  }

  addCase(newCase: Omit<Caso, 'id'>) {
    const id = (this.casos().length + 1).toString();
    this.casos.update(list => [...list, { ...newCase, id }]);
  }
  editCase(caseId:string,request:ActualizarCasoRequest){
    this.api.put<CasoResponse>(`${API_ENDPOINTS.casos}/${caseId}`,request).subscribe({
        next:(response)=>{
          const updated=this.toViewModel(response)
          this.casos.update(casos =>
          casos.map(caso =>
            caso.id === caseId ? updated : caso
          )
          );
          this.toastService.show(
            'Caso actualizado correctamente.',
            'success'
          );
        },
        error: () => {
          this.toastService.show(
            'No se pudo actualizar el caso.',
            'error'
          );
        }
    })

  }
  closedCase(caseId: string) {
    this.api.patch<void>(`${API_ENDPOINTS.casos}/${caseId}/inhabilitar`).subscribe({
      next: () => {
        this.casos.update(casos =>
          casos.filter(caso => caso.id !== caseId)
        );
        this.toastService.show('Caso cerrado correctamente', 'success');
      },
      error: () => {
        this.toastService.show('No se pudo eliminar el caso.', 'error');
      }
    });
  }
  viewCaseDetails(caso: Caso) {
    this.selectedCase.set(caso);
    this.activeCaseTab.set('detalles');
  }

  closeCaseDrawer() {
    this.selectedCase.set(null);
  }

  private syncLookupMaps(denuncias: DenunciaResponse[], usuarios: UsuarioResponse[]): void {
    this.denunciasByCasoId = new Map(
      denuncias
        .filter((denuncia) => denuncia.casoId)
        .map((denuncia) => [denuncia.casoId, denuncia]),
    );
    this.usuariosById = new Map(usuarios.map((usuario) => [usuario.id, usuario]));
  }

  private toViewModel(caso: CasoResponse): Caso {
    const denuncia = this.denunciasByCasoId.get(caso.id);
    const usuario = this.usuariosById.get(caso.victimaId);

    return {
      id: caso.id,
      codigo: `Caso #${caso.id.slice(0, 8).toUpperCase()}`,
      victim: this.victimLabel(usuario, denuncia, caso.victimaId),
      anonimo: denuncia?.anonima ?? false,
      edad: denuncia?.edad != null ? String(denuncia.edad+" años") : '',
      distrito: caso.distrito,
      tipo: this.tipoViolenciaLabel(denuncia?.tipoViolencia, caso.resumen),
      estado: this.statusLabel(caso.estado),
      riesgo: this.riskLabel(caso.prioridad),
      asignado: 'Pendiente de asignación',
      fecha: caso.fechaCreacion.split('T')[0] ?? caso.fechaCreacion,
      emocion: 'Seguimiento pendiente',
    };
  }

  private victimLabel(
    usuario: UsuarioResponse | undefined,
    denuncia: DenunciaResponse | undefined,
    victimaId: string,
  ): string {
    if (denuncia?.anonima) {
      return 'Víctima protegida';
    }

    if (usuario) {
      const nombre = `${usuario.nombres} ${usuario.apellidos}`.trim();
      if (nombre) {
        return nombre;
      }
    }

    return `Víctima ${victimaId.slice(0, 8)}`;
  }

  private tipoViolenciaLabel(rawTipo?: string, resumen?: string): string {
    if (rawTipo) {
      const normalized = rawTipo
        .trim()
        .toUpperCase()
        .normalize('NFD')
        .replace(/\p{M}/gu, '');

      return TIPO_VIOLENCIA_LABELS[normalized] ?? rawTipo;
    }

    return this.tipoFromSummary(resumen ?? '');
  }

  private statusLabel(status: EstadoCaso): string {
    const labels: Record<EstadoCaso, string> = {
      REGISTRADO: 'Registrado',
      EN_EVALUACION: 'En evaluación',
      EN_ATENCION: 'En atención',
      DERIVADO: 'Derivado',
      CERRADO: 'Cerrado',
      ARCHIVADO: 'Archivado',
    };
    return labels[status];
  }

  private backendStatus(label: string): EstadoCaso {
    const statuses: Record<string, EstadoCaso> = {
      'Evaluación': 'EN_EVALUACION',
      'En Proceso': 'EN_ATENCION',
      'Medidas de Protección': 'DERIVADO',
      'Archivado': 'ARCHIVADO',
    };
    return statuses[label] ?? 'EN_EVALUACION';
  }

  private riskLabel(priority: PrioridadCaso): string {
    const labels: Record<PrioridadCaso, string> = {
      BAJA: 'Leve',
      MEDIA: 'Moderado',
      ALTA: 'Alto',
      CRITICA: 'Severo',
    };
    return labels[priority];
  }

  private tipoFromSummary(summary: string): string {
    const match = summary.match(/Violencia\s+([^.\n]+)/i);
    return match?.[1]?.trim() || 'No especificado';
  }
}
