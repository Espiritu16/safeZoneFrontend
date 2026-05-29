import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CasesService } from '../../../core/services/cases.service';
import { ToastService } from '../../../core/services/toast.service';
import { EvidenceService } from '../../../core/services/evidence.service';
import { NumbersOnlyDirective } from '../../../shared/directives/numbers-only.directive';
import { LettersOnlyDirective } from '../../../shared/directives/letters-only.directive';
import { TrimOnBlurDirective } from '../../../shared/directives/trim-on-blur.directive';
import { normalizeText, sanitizeLettersOnly, sanitizeNumbersOnly } from '../../../shared/utils/input-sanitizers.util';
import { VALIDATION_LIMITS, VALIDATION_PATTERNS } from '../../../shared/utils/validation-rules';

@Component({
  selector: 'app-denuncias',
  standalone: true,
  imports: [CommonModule, FormsModule, NumbersOnlyDirective, LettersOnlyDirective, TrimOnBlurDirective],
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
    if (!this.validateStep(this.activeStep())) {
      return;
    }
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
    if (![1, 2, 3, 4].every(step => this.validateStep(step))) {
      return;
    }
    this.normalizeForm();

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

  private normalizeForm() {
    this.denunciaForm = {
      ...this.denunciaForm,
      dni: sanitizeNumbersOnly(this.denunciaForm.dni),
      nombre: sanitizeLettersOnly(this.denunciaForm.nombre).trim(),
      edad: sanitizeNumbersOnly(this.denunciaForm.edad),
      telefono: sanitizeNumbersOnly(this.denunciaForm.telefono),
      detalleHechos: normalizeText(this.denunciaForm.detalleHechos),
    };

    if (this.denunciaForm.anonimo) {
      this.denunciaForm.dni = '';
      this.denunciaForm.nombre = '';
    }
  }

  private validateStep(step: number): boolean {
    this.normalizeForm();

    if (step === 1) {
      if (!this.denunciaForm.anonimo) {
        if (!VALIDATION_PATTERNS.DNI.test(this.denunciaForm.dni)) {
          this.toastService.show('El DNI debe tener 8 dígitos numéricos.', 'error');
          return false;
        }
        if (
          this.denunciaForm.nombre.length < VALIDATION_LIMITS.NAME_MIN ||
          this.denunciaForm.nombre.length > VALIDATION_LIMITS.NAME_MAX ||
          !VALIDATION_PATTERNS.PERSON_NAME.test(this.denunciaForm.nombre)
        ) {
          this.toastService.show('El nombre debe tener entre 2 y 120 caracteres y solo letras.', 'error');
          return false;
        }
      }

      const edad = Number(this.denunciaForm.edad);
      if (!Number.isInteger(edad) || edad < VALIDATION_LIMITS.AGE_MIN || edad > VALIDATION_LIMITS.AGE_MAX) {
        this.toastService.show('La edad debe ser un número entero entre 0 y 120.', 'error');
        return false;
      }
      if (!VALIDATION_PATTERNS.CELULAR.test(this.denunciaForm.telefono)) {
        this.toastService.show('El teléfono debe tener 9 dígitos numéricos.', 'error');
        return false;
      }
      if (!this.denunciaForm.distrito.trim()) {
        this.toastService.show('Seleccione un distrito válido.', 'error');
        return false;
      }
    }

    if (step === 2) {
      if (!this.denunciaForm.tipoViolencia || !this.denunciaForm.relacionAgresor) {
        this.toastService.show('Seleccione el tipo de violencia y la relación con el agresor.', 'error');
        return false;
      }
      if (
        this.denunciaForm.detalleHechos.length < VALIDATION_LIMITS.LONG_TEXT_MIN ||
        this.denunciaForm.detalleHechos.length > VALIDATION_LIMITS.LONG_TEXT_MAX
      ) {
        this.toastService.show('El detalle de los hechos debe tener entre 20 y 2000 caracteres.', 'error');
        return false;
      }
    }

    return true;
  }
}
