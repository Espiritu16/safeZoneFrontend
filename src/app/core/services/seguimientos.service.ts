import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../http/api-endpoints';
import { ApiClientService } from '../http/api-client.service';
import type { CrearSeguimientoCasoRequest, SeguimientoCasoResponse } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class SeguimientosService {
  private readonly api = inject(ApiClientService);

  list(casoId?: string): Observable<SeguimientoCasoResponse[]> {
    return this.api.get<SeguimientoCasoResponse[]>(API_ENDPOINTS.seguimientos, { casoId });
  }

  create(request: CrearSeguimientoCasoRequest): Observable<SeguimientoCasoResponse> {
    return this.api.post<SeguimientoCasoResponse>(API_ENDPOINTS.seguimientos, request);
  }
}
