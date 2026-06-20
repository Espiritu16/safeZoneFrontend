import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../http/api-endpoints';
import { ApiClientService } from '../http/api-client.service';
import type { CrearUsuarioRequest, UsuarioResponse } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private readonly api = inject(ApiClientService);

  list(): Observable<UsuarioResponse[]> {
    return this.api.get<UsuarioResponse[]>(API_ENDPOINTS.usuarios);
  }

  create(request: CrearUsuarioRequest): Observable<UsuarioResponse> {
    return this.api.post<UsuarioResponse>(API_ENDPOINTS.usuarios, request);
  }

  findVictimaByDni(dni: string): Observable<UsuarioResponse | undefined> {
    return this.list().pipe(
      map((users) => users.find((user) => user.rol === 'VICTIMA' && user.activo && user.dni === dni)),
    );
  }
}
