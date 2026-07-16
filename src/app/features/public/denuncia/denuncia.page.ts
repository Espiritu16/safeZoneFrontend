import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, map, switchMap } from 'rxjs';
import { PublicFooterComponent } from '../components/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../components/public-header/public-header.component';
import { LettersOnlyDirective } from '../../../shared/directives/letters-only.directive';
import { TrimOnBlurDirective } from '../../../shared/directives/trim-on-blur.directive';
import { normalizeText, sanitizeLettersOnly, sanitizeNumbersOnly } from '../../../shared/utils/input-sanitizers.util';
import { isValidBasicEmail, VALIDATION_LIMITS, VALIDATION_PATTERNS } from '../../../shared/utils/validation-rules';
import { PredenunciasService } from '../../../core/services/predenuncias.service';
import { EvidenceService } from '../../../core/services/evidence.service';
import { DistrictComboboxComponent } from '../../../shared/components/district-combobox/district-combobox.component';

@Component({
  selector: 'app-denuncia-page',
  standalone: true,
  imports: [FormsModule, RouterLink, PublicHeaderComponent, PublicFooterComponent, LettersOnlyDirective, TrimOnBlurDirective, DistrictComboboxComponent],
  templateUrl: './denuncia.page.html',
  styleUrl: './denuncia.page.css'
})
export class DenunciaPage {
  private readonly predenunciasService = inject(PredenunciasService);
  protected readonly evidenceService = inject(EvidenceService);
  private readonly cdr = inject(ChangeDetectorRef);

  currentStep = 1;
  submitted = false;
  validationMessage = '';
  isSubmitting = false;
  trackingCode = '';

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
    if (![1, 2, 3, 4, 5].every(step => this.validateStep(step))) {
      return;
    }
    this.isSubmitting = true;
    this.predenunciasService.create({
      nombresContacto: this.formData.contactName,
      apellidosContacto: 'No especificado',
      telefonoContacto: this.formData.channel === 'Correo Electrónico Seguro' ? undefined : this.formData.contactValue,
      correoContacto: this.formData.channel === 'Correo Electrónico Seguro' ? this.formData.contactValue : undefined,
      descripcionHecho: this.formData.description,
      tipoViolencia: this.formData.situationType,
      fechaIncidente: this.toOffsetDateTime(this.formData.incidentDate),
      distrito: this.formData.location,
      direccionReferencia: this.formData.preferredTime,
      anonima: false,
    }).pipe(
      switchMap((response) => this.evidenceService.uploadAll(undefined, undefined, response.id).pipe(
        map(() => response),
      )),
      finalize(() => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }),
    ).subscribe({
      next: (response) => {
        this.trackingCode = `PD-${response.id.slice(0, 8).toUpperCase()}`;
        this.submitted = true;
        this.evidenceService.clearPending();
        this.cdr.detectChanges();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {
        this.validationMessage = 'No se pudo enviar la predenuncia. Revise los datos o intente nuevamente.';
        this.cdr.detectChanges();
      },
    });
  }

  startOver() {
    this.currentStep = 1;
    this.submitted = false;
    this.validationMessage = '';
    this.trackingCode = '';
    this.evidenceService.clearPending();
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

  get reviewSituation(): string {
    return this.formData.situationType || 'Sin tipo seleccionado';
  }

  get reviewDateAndLocation(): string {
    const date = this.formData.incidentDate
      ? new Intl.DateTimeFormat('es-PE', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          timeZone: 'America/Lima',
        }).format(new Date(`${this.formData.incidentDate}T00:00:00-05:00`))
      : 'Fecha no registrada';

    return `${date} - ${this.formData.location || 'Distrito no registrado'}`;
  }

  get reviewContact(): string {
    return this.formData.contactName || 'Contacto no registrado';
  }

  get reviewContactValue(): string {
    return `${this.formData.contactValue || 'Dato no registrado'} (${this.formData.channel})`;
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
        this.validationMessage = 'Seleccione el distrito del incidente.';
      } else if (
        this.formData.description.length < VALIDATION_LIMITS.LONG_TEXT_MIN ||
        this.formData.description.length > VALIDATION_LIMITS.LONG_TEXT_MAX
      ) {
        this.validationMessage = 'La descripción debe tener entre 20 y 2000 caracteres.';
      } else if (!this.formData.risk) {
        this.validationMessage = 'Seleccione el nivel de riesgo percibido.';
      }
    }

    if (step === 4) {
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

    if (step === 5 && !this.formData.acceptedTerms) {
      this.validationMessage = 'Debe confirmar la veracidad de la información y el tratamiento de datos.';
    }

    return !this.validationMessage;
  }

  private toOffsetDateTime(date: string): string | undefined {
    return date ? new Date(`${date}T00:00:00`).toISOString() : undefined;
  }
}
