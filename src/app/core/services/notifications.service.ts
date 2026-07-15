import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../http/api-endpoints';
import { ApiClientService } from '../http/api-client.service';
import type { ActualizarNotificacionRequest, NotificacionResponse } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly api = inject(ApiClientService);

  list(usuarioId?: string): Observable<NotificacionResponse[]> {
    return this.api.get<NotificacionResponse[]>(API_ENDPOINTS.notificaciones, { usuarioId });
  }

  listMine(): Observable<NotificacionResponse[]> {
    return this.api.get<NotificacionResponse[]>(API_ENDPOINTS.misNotificaciones);
  }

  update(id: string, request: ActualizarNotificacionRequest): Observable<NotificacionResponse> {
    return this.api.put<NotificacionResponse>(`${API_ENDPOINTS.notificaciones}/${id}`, request);
  }

  markAsRead(id: string): Observable<NotificacionResponse> {
    return this.update(id, { leida: true });
  }

  inactivar(id: string): Observable<void> {
    return this.api.patch<void>(`${API_ENDPOINTS.notificaciones}/${id}/inactivar`);
  }
}
