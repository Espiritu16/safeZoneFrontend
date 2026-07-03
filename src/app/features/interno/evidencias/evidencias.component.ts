import { Component, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EvidenceService,Evidencia } from '../../../core/services/evidence.service';
import { ToastService } from '../../../core/services/toast.service';
import { CasesService } from '../../../core/services/cases.service';
import { DenunciasService } from '../../../core/services/denuncias.service';

@Component({
  selector: 'app-evidencias',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './evidencias.component.html',
  styleUrl: './evidencias.component.scss'
})
export class EvidenciasComponent implements OnDestroy {
  protected readonly evidenceService = inject(EvidenceService);
  protected readonly toastService = inject(ToastService);
  protected readonly denunciasService=inject(DenunciasService);
  protected readonly casesService = inject(CasesService);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly vincularCasoId=signal<string>('');
  protected readonly vincularDenunciaId=signal<string>('');
  protected readonly previewFile = signal<Evidencia | null>(null);
  protected readonly previewUrl = signal<string | null>(null);
  protected readonly previewSafeUrl = signal<SafeResourceUrl | null>(null);
  protected readonly previewLoading = signal(false);
  protected readonly previewError = signal('');

  ngOnDestroy(): void {
    this.revokePreviewUrl();
  }

  ngOnInit(): void {
    this.evidenceService.loadEvidencias().subscribe();
    this.casesService.loadCasos().subscribe();
    this.denunciasService.loadDenuncias().subscribe(); 
  }
  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.evidenceService.uploadDirecto(file);
    input.value = '';
  }
  protected abrirVincular(evidencia:Evidencia):void{
    this.vincularCasoId.set('');
    this.vincularDenunciaId.set('');
    this.evidenceService.evidenciaAVincular.set(evidencia);
  }
  protected cerrarVincular():void{
    this.evidenceService.evidenciaAVincular.set(null);
  }
  protected confirmarVincular():void{
    const evidencia=this.evidenceService.evidenciaAVincular();
    const casoId=this.vincularCasoId().trim()
    const denunciaId=this.vincularDenunciaId().trim()
    if(!evidencia || (!casoId && !denunciaId)){
      this.toastService.show('Debe seleccionar al menos un Caso ID o Denuncia ID.','warning');
      return;
    }
    this.evidenceService.vincular(evidencia.id,{
      casoId:casoId || undefined,
      denunciaId:denunciaId ||  undefined,
    }).subscribe({
      next:()=>this.cerrarVincular(),
    })
  }

  protected abrirPreview(evidencia: Evidencia): void {
    this.revokePreviewUrl();
    this.previewFile.set(evidencia);
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

  protected cerrarPreview(): void {
    this.previewFile.set(null);
    this.previewError.set('');
    this.previewLoading.set(false);
    this.revokePreviewUrl();
  }

  protected descargar(evidencia: Evidencia): void {
    this.evidenceService.loadArchivo(evidencia.id, true).subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = evidencia.name;
        link.click();
        URL.revokeObjectURL(objectUrl);
      },
      error: () => {
        this.toastService.show('No se pudo descargar la evidencia.', 'error');
      },
    });
  }

  protected canPreview(evidencia: Evidencia): boolean {
    return ['Imagen', 'PDF', 'Audio', 'Video'].includes(evidencia.type);
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
