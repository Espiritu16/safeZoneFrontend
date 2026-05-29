import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CasesService } from '../../../core/services/cases.service';
import { ToastService } from '../../../core/services/toast.service';
import { EvidenceService } from '../../../core/services/evidence.service';

@Component({
  selector: 'app-denuncias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './denuncias.component.html',
  styleUrl: './denuncias.component.scss'
})
export class DenunciasComponent {
  private readonly router = inject(Router);
  private readonly casesService = inject(CasesService);
  private readonly toastService = inject(ToastService);
  private readonly evidenceService = inject(EvidenceService);

  protected readonly Math = Math;

  activeStep = signal<number>(1);

  denunciaForm = {
    dni: '',
    nombre: '',
    anonimo: false,
    edad: '',
    distrito: 'Lima',
    telefono: '',
    tipoViolencia: 'Física',
    relacionAgresor: 'Cónyuge',
    detalleHechos: '',
    medidasInmediatas: false
  };

  nextStep() {
    if (this.activeStep() < 4) {
      this.activeStep.update(s => s + 1);
    }
  }

  prevStep() {
    if (this.activeStep() > 1) {
      this.activeStep.update(s => s - 1);
    }
  }

  submitDenuncia() {
    const caseNum = Math.floor(Math.random() * 100 + 100);
    const newCase = {
      codigo: `Caso #${caseNum}-2026`,
      victim: this.denunciaForm.anonimo ? `Lima-${Math.floor(Math.random() * 900 + 100)}` : (this.denunciaForm.nombre || 'Ana María L.'),
      anonimo: this.denunciaForm.anonimo,
      edad: Number(this.denunciaForm.edad) || 34,
      distrito: this.denunciaForm.distrito,
      tipo: this.denunciaForm.tipoViolencia,
      estado: 'Evaluación',
      riesgo: 'Severo',
      asignado: 'Dra. Sofía Medina',
      fecha: new Date().toISOString().split('T')[0],
      emocion: 'Ansiedad Alta'
    };

    this.casesService.addCase(newCase);
    this.toastService.show(`Denuncia registrada. Se ha generado el Caso #${caseNum}-2026 de forma automática.`, 'success');
    this.activeStep.set(1);
    
    // Reset form
    this.denunciaForm = {
      dni: '',
      nombre: '',
      anonimo: false,
      edad: '',
      distrito: 'Lima',
      telefono: '',
      tipoViolencia: 'Física',
      relacionAgresor: 'Cónyuge',
      detalleHechos: '',
      medidasInmediatas: false
    };

    void this.router.navigateByUrl('/casos');
  }

  simulateFileUpload(event: any) {
    this.evidenceService.simulateFileUpload(event);
  }
}
