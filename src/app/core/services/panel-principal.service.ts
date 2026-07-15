import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../http/api-endpoints';
import { ApiClientService } from '../http/api-client.service';
import type { PanelRolResponse } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class PanelPrincipalService {
  private readonly api = inject(ApiClientService);

  load(): Observable<PanelRolResponse> {
    return this.api.get<PanelRolResponse>(API_ENDPOINTS.panelPrincipal);
  }
}
