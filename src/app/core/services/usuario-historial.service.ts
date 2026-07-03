import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../http/api-endpoints';
import { ApiClientService } from '../http/api-client.service';
import type { VictimaHistorialResponse } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class UsuarioHistorialService {
  private readonly api = inject(ApiClientService);
  private request$?: Observable<VictimaHistorialResponse>;

  private readonly historialSignal = signal<VictimaHistorialResponse | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal('');

  readonly historial = this.historialSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly casos = computed(() => this.historialSignal()?.casos ?? []);
  readonly citas = computed(() => this.historialSignal()?.citas ?? []);
  readonly evidencias = computed(() => this.historialSignal()?.evidencias ?? []);
  readonly denuncias = computed(() => this.historialSignal()?.denuncias ?? []);
  readonly lineaTiempo = computed(() => this.historialSignal()?.lineaTiempo ?? []);

  load(force = false): Observable<VictimaHistorialResponse> {
    if (!force && this.historialSignal()) {
      return of(this.historialSignal() as VictimaHistorialResponse);
    }

    if (!force && this.request$) {
      return this.request$;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set('');
    this.request$ = this.api.get<VictimaHistorialResponse>(API_ENDPOINTS.victimaHistorial).pipe(
      tap((historial) => this.historialSignal.set(this.normalize(historial))),
      catchError((error) => {
        this.errorSignal.set('No se pudo cargar tu historial vinculado. Intenta nuevamente.');
        return throwError(() => error);
      }),
      finalize(() => {
        this.loadingSignal.set(false);
        this.request$ = undefined;
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    return this.request$;
  }

  refresh(): Observable<VictimaHistorialResponse> {
    return this.load(true);
  }

  private normalize(historial: VictimaHistorialResponse): VictimaHistorialResponse {
    return {
      ...historial,
      casos: historial.casos ?? [],
      denuncias: historial.denuncias ?? [],
      citas: historial.citas ?? [],
      seguimientos: historial.seguimientos ?? [],
      evidencias: historial.evidencias ?? [],
      lineaTiempo: historial.lineaTiempo ?? [],
    };
  }
}
