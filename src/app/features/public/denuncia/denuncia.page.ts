import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PublicFooterComponent } from '../components/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../components/public-header/public-header.component';
import { LettersOnlyDirective } from '../../../shared/directives/letters-only.directive';
import { NumbersOnlyDirective } from '../../../shared/directives/numbers-only.directive';
import { TrimOnBlurDirective } from '../../../shared/directives/trim-on-blur.directive';
import { normalizeText, sanitizeLettersOnly, sanitizeNumbersOnly } from '../../../shared/utils/input-sanitizers.util';
import { isValidBasicEmail, VALIDATION_LIMITS, VALIDATION_PATTERNS } from '../../../shared/utils/validation-rules';

@Component({
  selector: 'app-denuncia-page',
  standalone: true,
  imports: [FormsModule, RouterLink, PublicHeaderComponent, PublicFooterComponent, LettersOnlyDirective, NumbersOnlyDirective, TrimOnBlurDirective],
  templateUrl: './denuncia.page.html',
  styleUrl: './denuncia.page.css'
})
export class DenunciaPage {
  currentStep = 1;
  submitted = false;
  validationMessage = '';

  formData = {
    situationType: '',
    incidentDate: '',
    location: '',
    description: '',
    risk: '',
    contactName: '',
    channel: 'WhatsApp (Encriptado)',
    contactValue: '',
    preferredTime: 'Cualquier momento',
    acceptedTerms: false,
  };

  goToStep(step: number) {
    if (step > this.currentStep && !this.validateStep(this.currentStep)) {
      return;
    }
    this.currentStep = step;
    this.submitted = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submitForm() {
    if (![1, 2, 3, 4].every(step => this.validateStep(step))) {
      return;
    }
    this.submitted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  startOver() {
    this.currentStep = 1;
    this.submitted = false;
    this.validationMessage = '';
    this.formData = {
      situationType: '',
      incidentDate: '',
      location: '',
      description: '',
      risk: '',
      contactName: '',
      channel: 'WhatsApp (Encriptado)',
      contactValue: '',
      preferredTime: 'Cualquier momento',
      acceptedTerms: false,
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private normalizeForm() {
    this.formData = {
      ...this.formData,
      location: normalizeText(this.formData.location),
      description: normalizeText(this.formData.description),
      contactName: sanitizeLettersOnly(this.formData.contactName).trim(),
      contactValue:
        this.formData.channel === 'Correo Electrónico Seguro'
          ? this.formData.contactValue.trim().toLowerCase()
          : sanitizeNumbersOnly(this.formData.contactValue),
    };
  }

  private validateStep(step: number): boolean {
    this.normalizeForm();
    this.validationMessage = '';

    if (step === 1 && !this.formData.situationType) {
      this.validationMessage = 'Seleccione al menos un tipo de situación.';
    }

    if (step === 2) {
      const today = new Date().toISOString().split('T')[0];
      if (!this.formData.incidentDate || this.formData.incidentDate > today) {
        this.validationMessage = 'La fecha del incidente es obligatoria y no puede ser futura.';
      } else if (!this.formData.location) {
        this.validationMessage = 'Ingrese la ubicación del incidente.';
      } else if (
        this.formData.description.length < VALIDATION_LIMITS.LONG_TEXT_MIN ||
        this.formData.description.length > VALIDATION_LIMITS.LONG_TEXT_MAX
      ) {
        this.validationMessage = 'La descripción debe tener entre 20 y 2000 caracteres.';
      } else if (!this.formData.risk) {
        this.validationMessage = 'Seleccione el nivel de riesgo percibido.';
      }
    }

    if (step === 3) {
      const usesEmail = this.formData.channel === 'Correo Electrónico Seguro';
      if (
        this.formData.contactName.length < VALIDATION_LIMITS.NAME_MIN ||
        this.formData.contactName.length > VALIDATION_LIMITS.NAME_MAX ||
        !VALIDATION_PATTERNS.PERSON_NAME.test(this.formData.contactName)
      ) {
        this.validationMessage = 'El nombre debe tener entre 2 y 120 caracteres y solo letras.';
      } else if (usesEmail && !isValidBasicEmail(this.formData.contactValue)) {
        this.validationMessage = 'Ingrese un correo electrónico válido.';
      } else if (!usesEmail && !VALIDATION_PATTERNS.CELULAR.test(this.formData.contactValue)) {
        this.validationMessage = 'El teléfono debe tener 9 dígitos numéricos.';
      }
    }

    if (step === 4 && !this.formData.acceptedTerms) {
      this.validationMessage = 'Debe confirmar la veracidad de la información y el tratamiento de datos.';
    }

    return !this.validationMessage;
  }
}
