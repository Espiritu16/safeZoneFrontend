import {Component, inject,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
export class EvidenciasComponent {
  protected readonly evidenceService = inject(EvidenceService);
  protected readonly toastService = inject(ToastService);
  protected readonly denunciasService=inject(DenunciasService);
  protected readonly casesService = inject(CasesService);
  protected readonly vincularCasoId=signal<string>('');
  protected readonly vincularDenunciaId=signal<string>('');
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
}
