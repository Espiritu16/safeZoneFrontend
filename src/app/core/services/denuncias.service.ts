import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../http/api-endpoints';
import { ApiClientService } from '../http/api-client.service';
import type { CrearDenunciaRequest, DenunciaFilters, DenunciaResponse } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class DenunciasService {
  private readonly api = inject(ApiClientService);

  list(filters: DenunciaFilters = {}): Observable<DenunciaResponse[]> {
    return this.api.get<DenunciaResponse[]>(API_ENDPOINTS.denuncias, { ...filters });
  }

  create(request: CrearDenunciaRequest): Observable<DenunciaResponse> {
    return this.api.post<DenunciaResponse>(API_ENDPOINTS.denuncias, request);
  }
}
