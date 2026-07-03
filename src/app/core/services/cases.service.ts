import { Injectable, signal, computed, inject } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { API_ENDPOINTS } from '../http/api-endpoints';
import { ApiClientService } from '../http/api-client.service';
import { victimLabel } from '../utils/victim-label.util';

import type {
  ActualizarCasoRequest,
  AsignacionCasoResponse,
  CasoResponse,
  DenunciaResponse,
  EstadoCaso,
  PrioridadCaso,
  UsuarioResponse,
} from '../models/api.models';
import { AsignacionesService } from './asignaciones.service';
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
  psicologoId?: string;
  psicologoAsignacionId?: string;
  defensorId?: string;
  defensorAsignacionId?: string;
  fecha: string;
  resumen?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CasesService {
  private readonly toastService = inject(ToastService);
  private readonly api = inject(ApiClientService);
  private readonly asignacionesService = inject(AsignacionesService);
  private readonly denunciasService = inject(DenunciasService);
  private readonly usuariosService = inject(UsuariosService);
  public readonly showModal = signal<boolean>(false);
  private denunciasByCasoId = new Map<string, DenunciaResponse>();
  private usuariosById = new Map<string, UsuarioResponse>();
  private asignacionesByCasoId = new Map<string, AsignacionCasoResponse[]>();

  public readonly casos = signal<Caso[]>([]);
  public readonly profesionales = signal<UsuarioResponse[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly loadError = signal<string>('');
  public readonly editingCase = signal<Caso | null>(null);
  public readonly casesSearchQuery = signal<string>('');
  public readonly casesAliasFilter = signal<string>('');
  public readonly casesRiskFilter = signal<string>('all');
  public readonly casesStatusFilter = signal<string>('all');
  public readonly casesDateFromFilter = signal<string>('');
  public readonly casesDateToFilter = signal<string>('');
  public readonly casesDistrictFilter = signal<string>('all');
  public readonly casesAssignmentFilter = signal<string>('all');
  
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

      const matchStatus = this.casesStatusFilter() === 'all' ||
                          c.estado === this.casesStatusFilter();

      const matchDateFrom = !this.casesDateFromFilter() ||
                            c.fecha >= this.casesDateFromFilter();

      const matchDateTo = !this.casesDateToFilter() ||
                          c.fecha <= this.casesDateToFilter();

      const matchDistrict = this.casesDistrictFilter() === 'all' ||
                            c.distrito === this.casesDistrictFilter();

      const hasAssignment = c.asignado !== 'Pendiente de asignación' && c.asignado !== 'Pendiente';
      const matchAssignment = this.casesAssignmentFilter() === 'all' ||
                              (this.casesAssignmentFilter() === 'assigned' && hasAssignment) ||
                              (this.casesAssignmentFilter() === 'unassigned' && !hasAssignment);
      
      return matchSearch && matchRisk && matchStatus && matchDateFrom && matchDateTo && matchDistrict && matchAssignment;
    });
  });

  public readonly hasActiveCaseFilters = computed(() =>
    this.casesSearchQuery().trim() !== '' ||
    this.casesAliasFilter().trim() !== '' ||
    this.casesRiskFilter() !== 'all' ||
    this.casesStatusFilter() !== 'all' ||
    this.casesDateFromFilter() !== '' ||
    this.casesDateToFilter() !== '' ||
    this.casesDistrictFilter() !== 'all' ||
    this.casesAssignmentFilter() !== 'all'
  );

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
      casos: this.api.get<CasoResponse[]>(API_ENDPOINTS.casos, {
        aliasCodigo: this.casesAliasFilter().trim() || undefined,
      }),
      asignaciones: this.asignacionesService.list().pipe(catchError(() => of([] as AsignacionCasoResponse[]))),
      denuncias: this.denunciasService.list().pipe(catchError(() => of([] as DenunciaResponse[]))),
      usuarios: this.usuariosService.list().pipe(catchError(() => of([] as UsuarioResponse[]))),
    }).pipe(
      tap(({ asignaciones, denuncias, usuarios }) => this.syncLookupMaps(asignaciones, denuncias, usuarios)),
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

  getFilteredCasosByStatus(status: string) {
    return this.filteredCasos().filter(c => c.estado === status);
  }

  clearCaseFilters(): void {
    this.casesSearchQuery.set('');
    this.casesAliasFilter.set('');
    this.casesRiskFilter.set('all');
    this.casesStatusFilter.set('all');
    this.casesDateFromFilter.set('');
    this.casesDateToFilter.set('');
    this.casesDistrictFilter.set('all');
    this.casesAssignmentFilter.set('all');
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
  updateCaseWithAssignments(
    caseId: string,
    request: ActualizarCasoRequest,
    psicologoId?: string,
    defensorId?: string,
  ): void {
    this.api.put<CasoResponse>(`${API_ENDPOINTS.casos}/${caseId}`, request).pipe(
      switchMap(() =>
        forkJoin(this.assignmentRequests(caseId, psicologoId, defensorId)).pipe(
          map(() => null),
        ),
      ),
    ).subscribe({
      next: () => {
        this.loadCasos().subscribe();
        this.toastService.show('Caso actualizado correctamente.', 'success');
        this.closeModal();
      },
      error: () => {
        this.toastService.show('No se pudo actualizar el caso.', 'error');
      },
    });
  }

  closedCase(caseId: string) {
    this.api.put<CasoResponse>(`${API_ENDPOINTS.casos}/${caseId}`, { estado: 'CERRADO' }).subscribe({
      next: () => {
        this.loadCasos().subscribe();
        this.toastService.show('Caso cerrado correctamente', 'success');
      },
      error: () => {
        this.toastService.show('No se pudo cerrar el caso.', 'error');
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

  private syncLookupMaps(
    asignaciones: AsignacionCasoResponse[],
    denuncias: DenunciaResponse[],
    usuarios: UsuarioResponse[],
  ): void {
    this.denunciasByCasoId = new Map(
      denuncias
        .filter((denuncia) => denuncia.casoId)
        .map((denuncia) => [denuncia.casoId, denuncia]),
    );
    this.usuariosById = new Map(usuarios.map((usuario) => [usuario.id, usuario]));
    this.asignacionesByCasoId = asignaciones.reduce((mapa, asignacion) => {
      const lista = mapa.get(asignacion.casoId) ?? [];
      lista.push(asignacion);
      mapa.set(asignacion.casoId, lista);
      return mapa;
    }, new Map<string, AsignacionCasoResponse[]>());
    this.profesionales.set(
      usuarios.filter((usuario) => usuario.activo && (usuario.rol === 'PSICOLOGO' || usuario.rol === 'DEFENSOR')),
    );
  }

  private toViewModel(caso: CasoResponse): Caso {
    const denuncia = this.denunciasByCasoId.get(caso.id);
    const usuario = this.usuariosById.get(caso.victimaId);
    const asignaciones = this.asignacionesByCasoId.get(caso.id) ?? [];
    const psicologo = asignaciones.find((asignacion) => asignacion.rolProfesional === 'PSICOLOGO');
    const defensor = asignaciones.find((asignacion) => asignacion.rolProfesional === 'DEFENSOR');

    return {
      id: caso.id,
      codigo: `Caso #${caso.id.slice(0, 8).toUpperCase()}`,
      victim: victimLabel(usuario, denuncia?.anonima, caso.victimaId),
      anonimo: denuncia?.anonima ?? false,
      edad: denuncia?.edad != null ? String(denuncia.edad) : '',
      distrito: caso.distrito,
      tipo: this.tipoViolenciaLabel(denuncia?.tipoViolencia, caso.resumen),
      estado: this.statusLabel(caso.estado),
      riesgo: this.riskLabel(caso.prioridad),
      asignado: this.assignedLabel(psicologo, defensor),
      psicologoId: psicologo?.profesionalId,
      psicologoAsignacionId: psicologo?.id,
      defensorId: defensor?.profesionalId,
      defensorAsignacionId: defensor?.id,
      fecha: caso.fechaCreacion.split('T')[0] ?? caso.fechaCreacion,
      resumen: caso.resumen,
    };
  }

  private assignmentRequests(caseId: string, psicologoId?: string, defensorId?: string): Observable<unknown>[] {
    const current = this.editingCase();
    const requests: Observable<unknown>[] = [];

    requests.push(...this.assignmentRequestForRole(caseId, current?.psicologoAsignacionId, current?.psicologoId, psicologoId, 'PSICOLOGO'));
    requests.push(...this.assignmentRequestForRole(caseId, current?.defensorAsignacionId, current?.defensorId, defensorId, 'DEFENSOR'));

    return requests.length > 0 ? requests : [of(null)];
  }

  private assignmentRequestForRole(
    caseId: string,
    assignmentId: string | undefined,
    currentProfessionalId: string | undefined,
    nextProfessionalId: string | undefined,
    rolProfesional: 'PSICOLOGO' | 'DEFENSOR',
  ): Observable<unknown>[] {
    const next = nextProfessionalId || undefined;
    const current = currentProfessionalId || undefined;
    if (assignmentId && next === current) {
      return [];
    }
    if (assignmentId && !next) {
      return [this.asignacionesService.inactivar(assignmentId)];
    }
    if (next) {
      return [this.asignacionesService.create({ casoId: caseId, profesionalId: next, rolProfesional })];
    }
    return [];
  }

  private assignedLabel(psicologo?: AsignacionCasoResponse, defensor?: AsignacionCasoResponse): string {
    const labels = [
      psicologo ? `Psic.: ${this.professionalName(psicologo.profesionalId)}` : '',
      defensor ? `Def.: ${this.professionalName(defensor.profesionalId)}` : '',
    ].filter(Boolean);
    return labels.length > 0 ? labels.join(' | ') : 'Pendiente de asignación';
  }

  private professionalName(profesionalId: string): string {
    const usuario = this.usuariosById.get(profesionalId);
    if (!usuario) {
      return `Profesional ${profesionalId.slice(0, 8)}`;
    }
    return `${usuario.nombres} ${usuario.apellidos}`.trim() || usuario.correo;
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
      'Registrado': 'REGISTRADO',
      'Evaluación': 'EN_EVALUACION',
      'En evaluación': 'EN_EVALUACION',
      'En Proceso': 'EN_ATENCION',
      'En atención': 'EN_ATENCION',
      'Medidas de Protección': 'DERIVADO',
      'Derivado': 'DERIVADO',
      'Cerrado': 'CERRADO',
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
