import { Injectable, inject,signal } from '@angular/core';
import { Observable,tap, catchError, of, forkJoin, map  } from 'rxjs';
import { API_ENDPOINTS } from '../http/api-endpoints';
import { ApiClientService } from '../http/api-client.service';
import type { CrearDenunciaRequest, DenunciaFilters, DenunciaResponse, UsuarioResponse } from '../models/api.models';
import { ToastService } from './toast.service';
import {UsuariosService } from './usuarios.service';
import { victimLabel } from '../utils/victim-label.util';
export interface DenunciaConVictima extends DenunciaResponse {
  victimaNombre: string;
}
@Injectable({
  providedIn: 'root',
})
export class DenunciasService {
  private readonly api = inject(ApiClientService);
  private readonly usuariosService = inject(UsuariosService);
  private readonly toastService = inject(ToastService);
  public readonly denuncias = signal<DenunciaConVictima[]>([]);

  list(filters: DenunciaFilters = {}): Observable<DenunciaResponse[]> {
    return this.api.get<DenunciaResponse[]>(API_ENDPOINTS.denuncias, { ...filters });
  }
  loadDenuncias(filters: DenunciaFilters = {}): Observable<DenunciaConVictima[]> {
    return forkJoin({
      denuncias: this.list(filters),
      usuarios: this.usuariosService.list().pipe(catchError(() => of([] as UsuarioResponse[]))),
    }).pipe(
      map(({ denuncias, usuarios }) => {
        const usuariosById = new Map(usuarios.map((u) => [u.id, u]));
        return denuncias.map((d) => ({
          ...d,
          victimaNombre: victimLabel(usuariosById.get(d.victimaId), d.anonima, d.victimaId),
        }));
      }),
      tap((denuncias) => this.denuncias.set(denuncias)),
      catchError(() => {
        this.toastService.show('No se pudieron cargar las denuncias.', 'error');
        return of([]);
      }),
    );
  }

  create(request: CrearDenunciaRequest): Observable<DenunciaResponse> {
    return this.api.post<DenunciaResponse>(API_ENDPOINTS.denuncias, request);
  }
}
