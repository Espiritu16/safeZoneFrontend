import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, forkJoin, map, of, tap } from 'rxjs';
import type {
  ActualizarUsuarioRequest,
  CrearUsuarioRequest,
  DenunciaResponse,
  UsuarioResponse,
  VictimaHistorialResponse,
} from '../models/api.models';
import { API_ENDPOINTS } from '../http/api-endpoints';
import { ApiClientService } from '../http/api-client.service';
import { DenunciasService } from './denuncias.service';
import { ToastService } from './toast.service';
import { UsuariosService } from './usuarios.service';

export interface Victim {
  id: string;
  codigo: string;
  alias: string;
  nombre: string;
  apellidos: string;
  dni: string;
  edad: number;
  genero: string;
  estadoCivil: string;
  ocupacion: string;
  distrito: string;
  direccion: string;
  telefono: string;
  contactoEmergencia: { nombre: string; telefono: string };
  anonimo: boolean;
  fechaRegistro: string;
  estado: string;
}

@Injectable({
  providedIn: 'root',
})
export class VictimsService {
  private readonly api = inject(ApiClientService);
  private readonly toastService = inject(ToastService);
  private readonly usuariosService = inject(UsuariosService);
  private readonly denunciasService = inject(DenunciasService);
  private denunciasByVictimaId = new Map<string, DenunciaResponse[]>();

  public readonly victims = signal<Victim[]>([]);
  public readonly searchQuery = signal<string>('');
  public readonly statusFilter = signal<'all' | 'Activo' | 'Archivado'>('all');
  public readonly districtFilter = signal<string>('all');
  public readonly identityFilter = signal<'all' | 'identificada' | 'anonima'>('all');
  public readonly isLoading = signal<boolean>(false);
  public readonly loadError = signal<string>('');
  public readonly historyLoadingId = signal<string>('');
  public readonly historyError = signal<string>('');
  private readonly historiesByVictim = signal<Map<string, VictimaHistorialResponse>>(new Map());

  public readonly filteredVictims = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const status = this.statusFilter();
    const district = this.districtFilter();
    const identity = this.identityFilter();

    return this.victims().filter((v) => {
      const matchesSearch =
        !query ||
        v.nombre.toLowerCase().includes(query) ||
        v.apellidos.toLowerCase().includes(query) ||
        v.dni.includes(query) ||
        v.alias.toLowerCase().includes(query) ||
        v.codigo.toLowerCase().includes(query) ||
        v.distrito.toLowerCase().includes(query);
      const matchesStatus = status === 'all' || v.estado === status;
      const matchesDistrict = district === 'all' || v.distrito === district;
      const matchesIdentity = identity === 'all' || (identity === 'anonima' ? v.anonimo : !v.anonimo);
      return matchesSearch && matchesStatus && matchesDistrict && matchesIdentity;
    });
  });

  public readonly districtOptions = computed(() => {
    const districts = this.victims()
      .map((victim) => victim.distrito)
      .filter((district) => district && district !== 'No registrado');
    return [...new Set(districts)].sort((a, b) => a.localeCompare(b));
  });

  public readonly hasActiveFilters = computed(() =>
    Boolean(this.searchQuery().trim()) ||
    this.statusFilter() !== 'all' ||
    this.districtFilter() !== 'all' ||
    this.identityFilter() !== 'all',
  );

  public readonly showModal = signal<boolean>(false);
  public readonly editingVictim = signal<Victim | null>(null);
  public readonly selectedVictim = signal<Victim | null>(null);
  public readonly selectedHistorial = computed(() => {
    const selected = this.selectedVictim();
    return selected ? this.historiesByVictim().get(selected.id) ?? null : null;
  });

  constructor() {
    this.loadVictims();
  }

  loadVictims(): void {
    this.isLoading.set(true);
    this.loadError.set('');
    forkJoin({
      usuarios: this.usuariosService.list(),
      denuncias: this.denunciasService.list().pipe(catchError(() => of([] as DenunciaResponse[]))),
    }).pipe(
      tap(({ denuncias }) => {
        this.denunciasByVictimaId = denuncias.reduce((mapa, denuncia) => {
          const lista = mapa.get(denuncia.victimaId) ?? [];
          lista.push(denuncia);
          mapa.set(denuncia.victimaId, lista);
          return mapa;
        }, new Map<string, DenunciaResponse[]>());
      }),
      map(({ usuarios }) => usuarios
        .filter((usuario) => usuario.rol === 'VICTIMA')
        .map((usuario, index) => this.toVictim(usuario, index + 1))),
    ).subscribe({
      next: (victimas) => {
        this.victims.set(victimas);
        const selected = this.selectedVictim();
        const nextSelected = selected ? victimas.find((v) => v.id === selected.id) ?? null : victimas[0] ?? null;
        this.selectedVictim.set(nextSelected);
        if (nextSelected) {
          this.loadVictimHistory(nextSelected.id);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.loadError.set('No se pudieron cargar las víctimas desde el backend.');
        this.victims.set([]);
        this.selectedVictim.set(null);
        this.isLoading.set(false);
      },
    });
  }

  add(victim: Omit<Victim, 'id' | 'codigo' | 'alias' | 'fechaRegistro'>): void {
    const request = this.toCreateRequest(victim);
    this.usuariosService.create(request).subscribe({
      next: () => {
        this.toastService.show('Víctima registrada correctamente.', 'success');
        this.loadVictims();
      },
      error: (error) => {
        this.toastService.show(error?.error?.message || 'No se pudo registrar la víctima.', 'error');
      },
    });
  }

  update(id: string, data: Partial<Victim>): void {
    const request: ActualizarUsuarioRequest = {
      nombres: data.anonimo ? 'Victima' : data.nombre,
      apellidos: data.anonimo ? 'Protegida' : data.apellidos,
      dni: data.anonimo ? undefined : data.dni,
      telefono: data.telefono,
      distrito: data.distrito,
      rol: 'VICTIMA',
      activo: data.estado ? data.estado === 'Activo' : undefined,
    };
    this.usuariosService.update(id, request).subscribe({
      next: () => {
        this.toastService.show('Datos de víctima actualizados.', 'success');
        this.loadVictims();
      },
      error: (error) => {
        this.toastService.show(error?.error?.message || 'No se pudo actualizar la víctima.', 'error');
      },
    });
  }

  openCreateModal(): void {
    this.editingVictim.set(null);
    this.showModal.set(true);
  }

  openEditModal(victim: Victim): void {
    this.editingVictim.set({ ...victim });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingVictim.set(null);
  }

  selectVictim(victim: Victim): void {
    this.selectedVictim.set(victim);
    this.loadVictimHistory(victim.id);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('all');
    this.districtFilter.set('all');
    this.identityFilter.set('all');
  }

  loadVictimHistory(victimId: string, force = false): void {
    if (!force && this.historiesByVictim().has(victimId)) {
      this.historyError.set('');
      this.historyLoadingId.set('');
      return;
    }

    this.historyLoadingId.set(victimId);
    this.historyError.set('');
    this.api.get<VictimaHistorialResponse>(`${API_ENDPOINTS.victimas}/${victimId}/historial`).subscribe({
      next: (historial) => {
        this.historiesByVictim.update((histories) => {
          const next = new Map(histories);
          next.set(victimId, this.normalizeHistorial(historial));
          return next;
        });
        this.historyLoadingId.set('');
      },
      error: () => {
        this.historyError.set('No se pudo cargar el historial vinculado de esta víctima.');
        this.historyLoadingId.set('');
      },
    });
  }

  private toVictim(usuario: UsuarioResponse, index: number): Victim {
    const denuncias = this.denunciasByVictimaId.get(usuario.id) ?? [];
    const latestDenuncia = [...denuncias].sort((a, b) => (b.fechaCreacion ?? '').localeCompare(a.fechaCreacion ?? ''))[0];
    const anonimo = denuncias.some((denuncia) => denuncia.anonima) || usuario.nombres.toLowerCase().includes('victima');
    const codigo = `SZ-V-${String(index).padStart(3, '0')}`;

    return {
      id: usuario.id,
      codigo,
      alias: anonimo ? this.aliasFromUsuario(usuario) : '',
      nombre: usuario.nombres || 'Sin nombre',
      apellidos: usuario.apellidos || '',
      dni: usuario.dni || '',
      edad: latestDenuncia?.edad ?? 0,
      genero: 'No registrado',
      estadoCivil: 'No registrado',
      ocupacion: 'No registrado',
      distrito: usuario.distrito || latestDenuncia?.distrito || 'No registrado',
      direccion: latestDenuncia?.direccionReferencia || 'No registrada',
      telefono: usuario.telefono || '',
      contactoEmergencia: { nombre: '', telefono: '' },
      anonimo,
      fechaRegistro: (usuario.fechaCreacion ?? '').split('T')[0] || 'Sin fecha',
      estado: usuario.activo ? 'Activo' : 'Archivado',
    };
  }

  private toCreateRequest(victim: Omit<Victim, 'id' | 'codigo' | 'alias' | 'fechaRegistro'>): CrearUsuarioRequest {
    if (victim.anonimo) {
      const suffix = Date.now().toString().slice(-8).padStart(8, '0');
      return {
        correo: `anonima.${suffix}@safezone.local`,
        contrasena: 'Victima123',
        nombres: 'Victima',
        apellidos: 'Protegida',
        dni: suffix,
        telefono: victim.telefono,
        distrito: victim.distrito,
        rol: 'VICTIMA',
      };
    }

    return {
      correo: `victima.${victim.dni}@safezone.local`,
      contrasena: 'Victima123',
      nombres: victim.nombre,
      apellidos: victim.apellidos,
      dni: victim.dni,
      telefono: victim.telefono,
      distrito: victim.distrito,
      rol: 'VICTIMA',
    };
  }

  private aliasFromUsuario(usuario: UsuarioResponse): string {
    const distrito = (usuario.distrito || 'LIM').split(/\s+/)[0].slice(0, 3).toUpperCase().padEnd(3, 'X');
    return `SZ-${distrito}-${usuario.id.slice(0, 6).toUpperCase()}`;
  }

  private normalizeHistorial(historial: VictimaHistorialResponse): VictimaHistorialResponse {
    return {
      ...historial,
      casos: historial.casos ?? [],
      denuncias: historial.denuncias ?? [],
      citas: historial.citas ?? [],
      seguimientos: historial.seguimientos ?? [],
      evidencias: historial.evidencias ?? [],
      lineaTiempo: historial.lineaTiempo ?? [],
    };
  }
}
