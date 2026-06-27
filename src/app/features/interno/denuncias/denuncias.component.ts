import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, Observable, of, switchMap } from 'rxjs';
import type { CrearUsuarioRequest, NivelRiesgo, UsuarioResponse } from '../../../core/models/api.models';
import { CasesService } from '../../../core/services/cases.service';
import { DenunciasService } from '../../../core/services/denuncias.service';
import { ToastService } from '../../../core/services/toast.service';
import { EvidenceService } from '../../../core/services/evidence.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
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
  private readonly denunciasService = inject(DenunciasService);
  private readonly toastService = inject(ToastService);
  private readonly evidenceService = inject(EvidenceService);
  private readonly usuariosService = inject(UsuariosService);

  protected readonly Math = Math;

  activeStep = signal<number>(1);
  isSubmitting = signal<boolean>(false);

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

    this.isSubmitting.set(true);
    this.resolveVictima().pipe(
      switchMap((victima) => this.denunciasService.create({
        victimaId: victima.id,
        edad:Number(this.denunciaForm.edad),
        descripcion: this.denunciaForm.detalleHechos,
        tipoViolencia: this.denunciaForm.tipoViolencia,
        fechaIncidente: new Date().toISOString(),
        distrito: this.denunciaForm.distrito,
        direccionReferencia: `Relacion con agresor: ${this.denunciaForm.relacionAgresor}`,
        nivelRiesgo: this.resolveRisk(),
        anonima: this.denunciaForm.anonimo,
        adjuntos: [],
      })),
      switchMap(() => this.casesService.loadCasos()),
      finalize(() => this.isSubmitting.set(false)),
    ).subscribe({
      next: () => {
        this.toastService.show('Denuncia registrada en el backend. El caso asociado ya fue actualizado.', 'success');
        this.resetForm();
        void this.router.navigateByUrl('/casos');
      },
      error: () => {
        this.toastService.show('No se pudo registrar la denuncia. Verifique la sesión y los datos de la víctima.', 'error');
      },
    });
  }

  simulateFileUpload(event: Event) {
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

  private resolveVictima(): Observable<UsuarioResponse> {
    if (this.denunciaForm.anonimo) {
      return this.usuariosService.create(this.buildAnonymousVictim());
    }

    return this.usuariosService.findVictimaByDni(this.denunciaForm.dni).pipe(
      switchMap((victima) => victima ? of(victima) : this.usuariosService.create(this.buildNamedVictim())),
    );
  }

  private buildNamedVictim(): CrearUsuarioRequest {
    const { nombres, apellidos } = this.splitName(this.denunciaForm.nombre);
    return {
      correo: `victima.${this.denunciaForm.dni}@safezone.local`,
      contrasena: 'Victima123',
      nombres,
      apellidos,
      dni: this.denunciaForm.dni,
      telefono: this.denunciaForm.telefono,
      distrito: this.denunciaForm.distrito,
      rol: 'VICTIMA',
    };
  }

  private buildAnonymousVictim(): CrearUsuarioRequest {
    const suffix = Date.now().toString().slice(-8);
    return {
      correo: `anonima.${suffix}@safezone.local`,
      contrasena: 'Victima123',
      nombres: 'Victima',
      apellidos: 'Anonima',
      dni: suffix.padStart(8, '0'),
      telefono: this.denunciaForm.telefono,
      distrito: this.denunciaForm.distrito,
      rol: 'VICTIMA',
    };
  }

  private splitName(fullName: string): { nombres: string; apellidos: string } {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return { nombres: parts[0], apellidos: 'No especificado' };
    }
    const midpoint = Math.ceil(parts.length / 2);
    return {
      nombres: parts.slice(0, midpoint).join(' '),
      apellidos: parts.slice(midpoint).join(' ') || 'No especificado',
    };
  }

  private resolveRisk(): NivelRiesgo {
    return this.denunciaForm.medidasInmediatas ? 'CRITICO' : 'ALTO';
  }

  private resetForm(): void {
    this.activeStep.set(1);
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
  }
}
