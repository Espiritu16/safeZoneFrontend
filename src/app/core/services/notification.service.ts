import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of, BehaviorSubject, Observable } from 'rxjs';

export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  tipo: 'alerta' | 'info' | 'cita';
}

export interface CrearNotificacionRequest {
  titulo: string;
  mensaje: string;
  tipo: 'alerta' | 'info' | 'cita';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  
  // Estado reactivo (Signal) para la UI
  public readonly notificaciones = signal<Notificacion[]>([]);
  public readonly unreadCount = signal<number>(0);

  // Fallback data simulada
  private fallbackData: Notificacion[] = [
    { id: '1', titulo: 'Caso Crítico', mensaje: 'El caso #082 requiere atención inmediata.', fecha: new Date().toISOString(), leida: false, tipo: 'alerta' },
    { id: '2', titulo: 'Nueva Cita', mensaje: 'Se te ha asignado una cita para mañana.', fecha: new Date(Date.now() - 86400000).toISOString(), leida: false, tipo: 'cita' },
    { id: '3', titulo: 'Actualización de Estado', mensaje: 'El caso #075 ha sido resuelto.', fecha: new Date(Date.now() - 172800000).toISOString(), leida: true, tipo: 'info' }
  ];

  constructor() {
    this.cargarNotificaciones();
  }

  /**
   * GET /api/notificaciones
   */
  cargarNotificaciones() {
    this.http.get<Notificacion[]>('/api/notificaciones').pipe(
      catchError((error) => {
        console.warn('API /api/notificaciones falló, usando fallback en memoria.', error);
        return of(this.fallbackData);
      })
    ).subscribe((data) => {
      this.notificaciones.set(data);
      this.actualizarUnreadCount(data);
    });
  }

  /**
   * PATCH /api/notificaciones/{id}/inactivar
   */
  marcarComoLeida(id: string) {
    this.http.patch(`/api/notificaciones/${id}/inactivar`, {}).pipe(
      catchError((error) => {
        console.warn(`API /api/notificaciones/${id}/inactivar falló, usando fallback en memoria.`, error);
        // Fallback simulación
        const actualizadas = this.notificaciones().map(n => 
          n.id === id ? { ...n, leida: true } : n
        );
        return of(actualizadas);
      })
    ).subscribe((data) => {
      // Si la API real devuelve un objeto vacío, debemos mutar localmente
      const isArray = Array.isArray(data);
      if (isArray) {
        this.notificaciones.set(data);
        this.actualizarUnreadCount(data);
      } else {
        const actualizadas = this.notificaciones().map(n => 
          n.id === id ? { ...n, leida: true } : n
        );
        this.notificaciones.set(actualizadas);
        this.actualizarUnreadCount(actualizadas);
      }
    });
  }

  /**
   * Simulación reactiva local (para cuando se agenda una cita o se crea un caso crítico)
   */
  crearNotificacionLocal(req: CrearNotificacionRequest) {
    const nueva: Notificacion = {
      id: Date.now().toString(),
      titulo: req.titulo,
      mensaje: req.mensaje,
      fecha: new Date().toISOString(),
      leida: false,
      tipo: req.tipo
    };
    
    // Lo agregamos a nuestro estado local reactivo
    const actuales = [nueva, ...this.notificaciones()];
    this.notificaciones.set(actuales);
    this.actualizarUnreadCount(actuales);
  }

  private actualizarUnreadCount(data: Notificacion[]) {
    const unread = data.filter(n => !n.leida).length;
    this.unreadCount.set(unread);
  }
}
