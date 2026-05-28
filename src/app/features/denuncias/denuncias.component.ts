import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CasesService } from '../../core/services/cases.service';
import { ToastService } from '../../core/services/toast.service';
import { EvidenceService } from '../../core/services/evidence.service';
import { 
  onlyLetters, 
  isValidDni, 
  isValidCelular, 
  trimAndCollapse, 
  blockNonNumericKeys, 
  filterNumericInput 
} from '../../shared/utils/validation.utils';

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
    distrito: 'Lima Cercado',
    telefono: '',
    tipoViolencia: 'Física',
    relacionAgresor: 'Cónyuge',
    detalleHechos: '',
    medidasInmediatas: false
  };

  errors = {
    dni: '',
    nombre: '',
    edad: '',
    telefono: '',
    detalleHechos: ''
  };

  clearError(field: keyof typeof this.errors) {
    this.errors[field] = '';
  }

  onNumericKeydown(event: KeyboardEvent) {
    blockNonNumericKeys(event);
  }

  onDniInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.denunciaForm.dni = filterNumericInput(input.value);
    this.clearError('dni');
  }

  onTelefonoInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.denunciaForm.telefono = filterNumericInput(input.value);
    this.clearError('telefono');
  }

  onEdadInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.denunciaForm.edad = filterNumericInput(input.value);
    this.clearError('edad');
  }

  nextStep() {
    if (this.activeStep() === 1) {
      let hasError = false;
      this.denunciaForm.nombre = trimAndCollapse(this.denunciaForm.nombre);

      if (!this.denunciaForm.anonimo) {
        if (!isValidDni(this.denunciaForm.dni)) {
          this.errors.dni = 'El DNI debe tener exactamente 8 dígitos.';
          hasError = true;
        } else {
          this.errors.dni = '';
        }

        if (!this.denunciaForm.nombre) {
          this.errors.nombre = 'El nombre es obligatorio.';
          hasError = true;
        } else if (!onlyLetters(this.denunciaForm.nombre)) {
          this.errors.nombre = 'Solo se permiten letras, espacios, apóstrofe y guion.';
          hasError = true;
        } else if (this.denunciaForm.nombre.length < 2 || this.denunciaForm.nombre.length > 120) {
          this.errors.nombre = 'El nombre debe tener entre 2 y 120 caracteres.';
          hasError = true;
        } else {
          this.errors.nombre = '';
        }
      } else {
        this.errors.dni = '';
        this.errors.nombre = '';
      }

      const edadNum = Number(this.denunciaForm.edad);
      if (!this.denunciaForm.edad) {
        this.errors.edad = 'La edad es obligatoria.';
        hasError = true;
      } else if (isNaN(edadNum) || edadNum < 0 || edadNum > 120) {
        this.errors.edad = 'La edad debe estar en el rango de 0 a 120.';
        hasError = true;
      } else {
        this.errors.edad = '';
      }

      if (!isValidCelular(this.denunciaForm.telefono)) {
        this.errors.telefono = 'El celular seguro debe tener exactamente 9 dígitos.';
        hasError = true;
      } else {
        this.errors.telefono = '';
      }

      if (hasError) {
        this.toastService.show('Por favor, corrija los errores del formulario.', 'error');
        return;
      }
    }

    if (this.activeStep() === 2) {
      this.denunciaForm.detalleHechos = trimAndCollapse(this.denunciaForm.detalleHechos);
      if (!this.denunciaForm.detalleHechos) {
        this.errors.detalleHechos = 'El detalle narrativo de hechos es obligatorio.';
        this.toastService.show(this.errors.detalleHechos, 'error');
        return;
      } else if (this.denunciaForm.detalleHechos.length < 20 || this.denunciaForm.detalleHechos.length > 2000) {
        this.errors.detalleHechos = 'El detalle de hechos debe tener entre 20 y 2000 caracteres.';
        this.toastService.show(this.errors.detalleHechos, 'error');
        return;
      } else {
        this.errors.detalleHechos = '';
      }
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
    this.denunciaForm.detalleHechos = trimAndCollapse(this.denunciaForm.detalleHechos);
    if (!this.denunciaForm.detalleHechos || this.denunciaForm.detalleHechos.length < 20 || this.denunciaForm.detalleHechos.length > 2000) {
      this.toastService.show('El detalle de hechos debe tener entre 20 y 2000 caracteres.', 'error');
      return;
    }

    // Coherencia del anonimato: si es anónimo, no registrar DNI/nombres reales
    if (this.denunciaForm.anonimo) {
      this.denunciaForm.dni = '';
      this.denunciaForm.nombre = '';
    }

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
      distrito: 'Lima Cercado',
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
