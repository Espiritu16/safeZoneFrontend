import { Injectable, signal, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';

export interface Evidencia {
  id: number;
  name: string;
  size: string;
  type: string;
  date: string;
  uploader: string;
  riskIcon: string;
}

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);

  public readonly evidencias = signal<Evidencia[]>([
    { id: 1, name: 'acta_comisaria_santiago.pdf', size: '2.4 MB', type: 'PDF', date: '2026-05-20 14:30', uploader: 'Recepcionista', riskIcon: 'shield' },
    { id: 2, name: 'grabacion_audio_amenaza.mp3', size: '12.8 MB', type: 'Audio', date: '2026-05-19 11:15', uploader: 'Víctima', riskIcon: 'lock' },
    { id: 3, name: 'capturas_chats_whatsapp.jpg', size: '5.1 MB', type: 'Imagen', date: '2026-05-18 09:40', uploader: 'Víctima', riskIcon: 'image' },
    { id: 4, name: 'certificado_medico_legal.pdf', size: '1.8 MB', type: 'PDF', date: '2026-05-15 16:00', uploader: 'Defensor Legal', riskIcon: 'shield' }
  ]);

  public readonly showEvidenceModal = signal<boolean>(false);

  simulateFileUpload(event: Event) {
    this.toastService.show('Subiendo archivo...', 'warning');
    setTimeout(() => {
      const nuevoArchivo: Evidencia = {
        id: this.evidencias().length + 1,
        name: 'evidencia_adjunta_' + Math.floor(Math.random() * 1000) + '.jpg',
        size: '3.6 MB',
        type: 'Imagen',
        date: 'Hoy, Hace unos instantes',
        uploader: this.authService.currentRole(),
        riskIcon: 'image'
      };
      this.evidencias.update(e => [nuevoArchivo, ...e]);
      this.toastService.show('Archivo de evidencia analizado y cargado de forma segura.', 'success');
    }, 1200);
  }
}
