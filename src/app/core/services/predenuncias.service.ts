import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../http/api-endpoints';
import { ApiClientService } from '../http/api-client.service';
import type {
  CrearPreDenunciaRequest,
  EstadoPreDenuncia,
  FormalizarPreDenunciaRequest,
  PreDenunciaResponse,
} from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class PredenunciasService {
  private readonly api = inject(ApiClientService);

  create(request: CrearPreDenunciaRequest): Observable<PreDenunciaResponse> {
    return this.api.post<PreDenunciaResponse>(API_ENDPOINTS.predenuncias, request);
  }

  list(estado?: EstadoPreDenuncia): Observable<PreDenunciaResponse[]> {
    return this.api.get<PreDenunciaResponse[]>(API_ENDPOINTS.predenuncias, { estado });
  }

  listMine(): Observable<PreDenunciaResponse[]> {
    return this.api.get<PreDenunciaResponse[]>(`${API_ENDPOINTS.predenuncias}/mis-registros`);
  }

  markInContact(id: string): Observable<PreDenunciaResponse> {
    return this.api.patch<PreDenunciaResponse>(`${API_ENDPOINTS.predenuncias}/${id}/contactar`);
  }

  formalize(id: string, request: FormalizarPreDenunciaRequest): Observable<PreDenunciaResponse> {
    return this.api.patch<PreDenunciaResponse>(`${API_ENDPOINTS.predenuncias}/${id}/formalizar`, request);
  }
}
