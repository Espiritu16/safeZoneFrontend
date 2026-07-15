import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import type { VictimaHistorialItem } from '../../../../core/models/api.models';
import { EvidenceService } from '../../../../core/services/evidence.service';
import { UsuarioHistorialService } from '../../../../core/services/usuario-historial.service';

@Component({
  selector: 'app-usuario-casos-page',
  standalone: true,
  templateUrl: './casos.page.html',
  styleUrl: './casos.page.css'
})
export class UsuarioCasosPage implements OnInit, OnDestroy {
  protected readonly historialService = inject(UsuarioHistorialService);
  private readonly evidenceService = inject(EvidenceService);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly selectedCase = signal<VictimaHistorialItem | null>(null);
  protected readonly previewEvidence = signal<VictimaHistorialItem | null>(null);
  protected readonly previewUrl = signal<string | null>(null);
  protected readonly previewSafeUrl = signal<SafeResourceUrl | null>(null);
  protected readonly previewLoading = signal(false);
  protected readonly previewError = signal('');
  protected readonly selectedCaseEvidence = computed(() => {
    const caso = this.selectedCase();
    if (!caso) {
      return [];
    }
    return this.historialService.evidencias().filter((evidencia) => evidencia.casoId === caso.id);
  });

  ngOnInit(): void {
    this.historialService.load().subscribe({ error: () => undefined });
  }

  ngOnDestroy(): void {
    this.revokePreviewUrl();
  }

  protected refresh(): void {
    this.historialService.refresh().subscribe({ error: () => undefined });
  }

  protected formatDate(date: string | null | undefined): string {
    if (!date) {
      return 'Sin fecha';
    }
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  protected statusLabel(status: string | null | undefined): string {
    return (status ?? 'Sin estado').replaceAll('_', ' ');
  }

  protected metadata(item: VictimaHistorialItem, key: string): string {
    const value = item.metadata?.[key];
    return value === null || value === undefined || value === '' ? 'No especificado' : String(value).replaceAll('_', ' ');
  }

  protected openCase(caso: VictimaHistorialItem): void {
    this.selectedCase.set(caso);
  }

  protected closeCase(): void {
    this.closePreview();
    this.selectedCase.set(null);
  }

  protected evidenceName(evidencia: VictimaHistorialItem): string {
    return this.metadata(evidencia, 'nombreOriginal') === 'No especificado'
      ? evidencia.titulo
      : this.metadata(evidencia, 'nombreOriginal');
  }

  protected evidenceType(evidencia: VictimaHistorialItem): string {
    const mime = this.metadata(evidencia, 'tipoMime').toLowerCase();
    const name = this.evidenceName(evidencia).toLowerCase();
    if (mime.startsWith('image/') || /\.(png|jpe?g|webp)$/.test(name)) return 'Imagen';
    if (mime === 'application/pdf' || name.endsWith('.pdf')) return 'PDF';
    if (mime.startsWith('audio/') || /\.(mp3|wav|m4a)$/.test(name)) return 'Audio';
    if (mime.startsWith('video/') || /\.(mp4|mov)$/.test(name)) return 'Video';
    return 'Documento';
  }

  protected canPreview(evidencia: VictimaHistorialItem): boolean {
    return ['Imagen', 'PDF', 'Audio', 'Video'].includes(this.evidenceType(evidencia));
  }

  protected openPreview(evidencia: VictimaHistorialItem): void {
    this.revokePreviewUrl();
    this.previewEvidence.set(evidencia);
    this.previewLoading.set(true);
    this.previewError.set('');
    this.evidenceService.loadArchivo(evidencia.id).subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        this.previewUrl.set(objectUrl);
        this.previewSafeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl));
        this.previewLoading.set(false);
      },
      error: () => {
        this.previewError.set('No se pudo cargar la vista previa de la evidencia.');
        this.previewLoading.set(false);
      },
    });
  }

  protected closePreview(): void {
    this.previewEvidence.set(null);
    this.previewError.set('');
    this.previewLoading.set(false);
    this.revokePreviewUrl();
  }

  protected downloadEvidence(evidencia: VictimaHistorialItem): void {
    this.evidenceService.loadArchivo(evidencia.id, true).subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = this.evidenceName(evidencia);
        link.click();
        URL.revokeObjectURL(objectUrl);
      },
      error: () => {
        this.previewError.set('No se pudo descargar la evidencia.');
      },
    });
  }

  private revokePreviewUrl(): void {
    const currentUrl = this.previewUrl();
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }
    this.previewUrl.set(null);
    this.previewSafeUrl.set(null);
  }
}
