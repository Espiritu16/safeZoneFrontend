import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PublicFooterComponent } from '../components/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../components/public-header/public-header.component';
import { LettersOnlyDirective } from '../../../shared/directives/letters-only.directive';
import { TrimOnBlurDirective } from '../../../shared/directives/trim-on-blur.directive';
import { normalizeText, sanitizeLettersOnly } from '../../../shared/utils/input-sanitizers.util';
import { isValidBasicEmail, VALIDATION_LIMITS, VALIDATION_PATTERNS } from '../../../shared/utils/validation-rules';

@Component({
  selector: 'app-contacto-page',
  standalone: true,
  imports: [FormsModule, RouterLink, PublicHeaderComponent, PublicFooterComponent, LettersOnlyDirective, TrimOnBlurDirective],
  templateUrl: './contacto.page.html',
  styleUrl: './contacto.page.css'
})
export class ContactoPage {
  validationMessage = '';
  messageSent = false;

  formData = {
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
    acceptedPrivacy: false,
  };

  onSubmit(event: Event) {
    event.preventDefault();
    this.normalizeForm();

    if (
      this.formData.nombre.length < VALIDATION_LIMITS.NAME_MIN ||
      this.formData.nombre.length > VALIDATION_LIMITS.NAME_MAX ||
      !VALIDATION_PATTERNS.PERSON_NAME.test(this.formData.nombre)
    ) {
      this.validationMessage = 'El nombre debe tener entre 2 y 120 caracteres y solo letras.';
      return;
    }
    if (!isValidBasicEmail(this.formData.email)) {
      this.validationMessage = 'Ingrese un correo electrónico válido.';
      return;
    }
    if (!this.formData.asunto) {
      this.validationMessage = 'Seleccione un asunto válido.';
      return;
    }
    if (
      this.formData.mensaje.length < VALIDATION_LIMITS.MESSAGE_MIN ||
      this.formData.mensaje.length > VALIDATION_LIMITS.MESSAGE_MAX
    ) {
      this.validationMessage = 'El mensaje debe tener entre 10 y 1000 caracteres.';
      return;
    }
    if (!this.formData.acceptedPrivacy) {
      this.validationMessage = 'Debe aceptar la política de privacidad.';
      return;
    }

    this.validationMessage = '';
    this.messageSent = true;
  }

  private normalizeForm() {
    this.formData = {
      ...this.formData,
      nombre: sanitizeLettersOnly(this.formData.nombre).trim(),
      email: this.formData.email.trim().toLowerCase(),
      mensaje: normalizeText(this.formData.mensaje),
    };
  }
}
