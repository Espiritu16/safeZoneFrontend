import { Injectable, signal, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../http/api-endpoints';
import { VincularEvidenciaRequest, EvidenciaResponse } from '../models/api.models';

export interface Evidencia {
  id: string; // antes era number — debe coincidir con el UUID (String) del backend
  name: string;
  size: string;
  type: string;
  date: string;
  uploader: string;
  riskIcon: string;
  casoId?: string | null;
  denunciaId?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);

  public readonly evidencias = signal<Evidencia[]>([]);
  public readonly showEvidenceModal = signal<boolean>(false);
  private readonly pendingFiles = signal<File[]>([]);

  /** Maneja la selección de un archivo (preview local antes de subirlo). */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.pendingFiles.update((files) => [...files, file]);

    const nuevoArchivo: Evidencia = {
      id: crypto.randomUUID(), // antes: this.evidencias().length + 1 (colisionaba)
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: this.inferType(file.name),
      date: new Date().toLocaleString(),
      uploader: this.authService.currentRole(),
      riskIcon: 'image',
    };
    this.evidencias.update((e) => [nuevoArchivo, ...e]);
    this.toastService.show('Archivo añadido. Se subirá al registrar la denuncia.', 'warning');

    input.value = ''; // permite volver a seleccionar el mismo archivo si hace falta
  }

  removeFile(file: File): void {
    this.pendingFiles.update((files) => files.filter((f) => f !== file));
  }

  hasPendingFiles(): boolean {
    return this.pendingFiles().length > 0;
  }

  /** Sube todos los archivos pendientes y devuelve sus URLs/IDs. */
  uploadAll(denunciaId?: string, casoId?: string): Observable<string[]> {
    const files = this.pendingFiles();
    if (files.length === 0) {
      return of([]);
    }
    const uploads = files.map((file) => this.uploadOne(file, casoId, denunciaId));
    return forkJoin(uploads);
  }

  private uploadOne(file: File, casoId?: string, denunciaId?: string): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    if (casoId) formData.append('casoId', casoId);
    if (denunciaId) formData.append('denunciaId', denunciaId);

    return this.http.post<EvidenciaResponse>(`${environment.apiBaseUrl}${API_ENDPOINTS.adjuntos}`, formData).pipe(
      map((response) => response.id),
      catchError(() => {
        this.toastService.show(`No se pudo subir el archivo: ${file.name}`, 'error');
        throw new Error('upload_failed');
      }),
    );
  }

  /** Carga evidencias desde el backend. Sin parámetros, trae todas (incluye "sueltas"). */
  loadEvidencias(casoId?: string, denunciaId?: string): Observable<Evidencia[]> {
    const params: Record<string, string> = {};
    if (casoId) params['casoId'] = casoId;
    if (denunciaId) params['denunciaId'] = denunciaId;

    return this.http.get<EvidenciaResponse[]>(`${environment.apiBaseUrl}${API_ENDPOINTS.adjuntos}`, { params }).pipe(
      map((response) => response.map((r) => this.toViewModel(r))),
      tap((evidencias) => this.evidencias.set(evidencias)),
      catchError(() => {
        this.toastService.show('No se pudieron cargar las evidencias.', 'error');
        return of([]);
      }),
    );
  }
  uploadDirecto(file: File): void {
    this.uploadOne(file).subscribe({
      next: () => {
        this.toastService.show('Evidencia subida correctamente.', 'success');
        this.loadEvidencias().subscribe();
      },
    });
  }
  /** Vincula una evidencia suelta a un caso y/o denuncia existente. */
  vincular(evidenciaId: string, request: VincularEvidenciaRequest): Observable<Evidencia> {
    return this.http.patch<EvidenciaResponse>(
      `${environment.apiBaseUrl}${API_ENDPOINTS.adjuntos}/${evidenciaId}/vincular`,
      request,
    ).pipe(
      map((r) => this.toViewModel(r)),
      tap((evidencia) => {
        this.evidencias.update((lista) =>
          lista.map((e) => (e.id === evidencia.id ? evidencia : e)),
        );
        this.toastService.show('Evidencia vinculada correctamente.', 'success');
      }),
      catchError(() => {
        this.toastService.show('No se pudo vincular la evidencia.', 'error');
        throw new Error('vincular_failed');
      }),
    );
  }

  private toViewModel(r: EvidenciaResponse): Evidencia {
    return {
      id: r.id, // directo, sin conversión a Number (era el bug principal)
      name: r.nombreOriginal,
      size: `${(r.tamano / (1024 * 1024)).toFixed(1)} MB`,
      type: this.inferType(r.nombreOriginal),
      date: r.fechaCreacion,
      uploader: r.subidoPor,
      riskIcon: 'image',
      casoId: r.casoId,
      denunciaId: r.denunciaId,
    };
  }

  private inferType(nombreArchivo: string): string {
    const ext = nombreArchivo.split('.').pop()?.toLowerCase() ?? '';
    if (['pdf'].includes(ext)) return 'PDF';
    if (['mp3', 'wav', 'ogg'].includes(ext)) return 'Audio';
    if (['mp4', 'mov', 'avi'].includes(ext)) return 'Video';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'Imagen';
    return 'Desconocido';
  }

  clearPending(): void {
    this.pendingFiles.set([]);
  }
}
