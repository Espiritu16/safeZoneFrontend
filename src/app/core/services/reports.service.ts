import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../http/api-endpoints';
import { ApiClientService } from '../http/api-client.service';
import type { ReporteMensualRequest, ReporteMensualResponse } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private readonly api = inject(ApiClientService);

  generarMensual(request: ReporteMensualRequest): Observable<ReporteMensualResponse> {
    return this.api.post<ReporteMensualResponse>(`${API_ENDPOINTS.reportes}/mensual`, request);
  }
}
