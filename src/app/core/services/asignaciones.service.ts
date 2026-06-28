import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../http/api-endpoints';
import { ApiClientService } from '../http/api-client.service';
import type {
  AsignacionCasoResponse,
  ActualizarAsignacionCasoRequest,
  CrearAsignacionCasoRequest,
} from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class AsignacionesService {
  private readonly api = inject(ApiClientService);

  list(casoId?: string): Observable<AsignacionCasoResponse[]> {
    const query = casoId ? `?casoId=${encodeURIComponent(casoId)}` : '';
    return this.api.get<AsignacionCasoResponse[]>(`${API_ENDPOINTS.asignaciones}${query}`);
  }

  create(request: CrearAsignacionCasoRequest): Observable<AsignacionCasoResponse> {
    return this.api.post<AsignacionCasoResponse>(API_ENDPOINTS.asignaciones, request);
  }

  update(id: string, request: ActualizarAsignacionCasoRequest): Observable<AsignacionCasoResponse> {
    return this.api.put<AsignacionCasoResponse>(`${API_ENDPOINTS.asignaciones}/${id}`, request);
  }

  inactivar(id: string): Observable<void> {
    return this.api.patch<void>(`${API_ENDPOINTS.asignaciones}/${id}/inactivar`);
  }
}
