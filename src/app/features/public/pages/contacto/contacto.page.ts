import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  onlyLetters, 
  isValidEmail, 
  trimAndCollapse 
} from '../../../../shared/utils/validation.utils';

@Component({
  selector: 'app-public-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contacto-container">
      <section class="header-section">
        <h1>Contacto</h1>
        <p class="subtitle">Nos gustaría saber de ti</p>
      </section>

      <section class="content-section">
        <div class="container">
          <div class="contact-grid">
            <div class="contact-form">
              <h2>Envíanos un mensaje</h2>
              <form (ngSubmit)="onSubmit()" #contactForm="ngForm">
                <div class="form-group" [class.has-error]="errors.nombre">
                  <label for="nombre">Nombre: *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    [(ngModel)]="formData.nombre"
                    (input)="clearError('nombre')"
                    placeholder="Tu nombre completo"
                    required
                  >
                  @if (errors.nombre) {
                    <span class="form-error">{{ errors.nombre }}</span>
                  }
                </div>

                <div class="form-group" [class.has-error]="errors.email">
                  <label for="email">Email: *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    [(ngModel)]="formData.email"
                    (input)="clearError('email')"
                    placeholder="tu@email.com"
                    required
                  >
                  @if (errors.email) {
                    <span class="form-error">{{ errors.email }}</span>
                  }
                </div>

                <div class="form-group" [class.has-error]="errors.asunto">
                  <label for="asunto">Asunto: *</label>
                  <select id="asunto" name="asunto" [(ngModel)]="formData.asunto" (change)="clearError('asunto')" required>
                    <option value="">Seleccionar asunto...</option>
                    <option value="consulta">Consulta General</option>
                    <option value="emergencia">Emergencia/Ayuda Inmediata</option>
                    <option value="feedback">Feedback/Sugerencias</option>
                    <option value="tecnico">Problema Técnico</option>
                  </select>
                  @if (errors.asunto) {
                    <span class="form-error">{{ errors.asunto }}</span>
                  }
                </div>

                <div class="form-group" [class.has-error]="errors.mensaje">
                  <label for="mensaje">Mensaje: *</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    [(ngModel)]="formData.mensaje"
                    (input)="clearError('mensaje')"
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                    rows="5"
                    required
                  ></textarea>
                  @if (errors.mensaje) {
                    <span class="form-error">{{ errors.mensaje }}</span>
                  }
                </div>

                <button type="submit" class="btn btn-primary">
                  Enviar Mensaje
                </button>
              </form>

              <div *ngIf="mensajeEnviado" class="success-message">
                ✓ Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto pronto.
              </div>
            </div>

            <div class="contact-info">
              <h2>Información de Contacto</h2>

              <div class="info-block">
                <h3>📞 Línea de Ayuda 24/7</h3>
                <p class="highlight">1800-SAFEZONE</p>
                <p>Disponible para emergencias y consultas urgentes</p>
              </div>

              <div class="info-block">
                <h3>📧 Email</h3>
                <p><a href="mailto:contacto@safezone.pe">contacto@safezone.pe</a></p>
                <p>Respuesta en 24 horas</p>
              </div>

              <div class="info-block">
                <h3>📍 Ubicación</h3>
                <p>
                  SafeZone Centro<br>
                  Av. Principal, Lima, Perú<br>
                  (Próximamente más sedes)
                </p>
              </div>

              <div class="info-block">
                <h3>⏰ Horarios de Atención</h3>
                <p>
                  Lunes a Viernes: 9:00 AM - 6:00 PM<br>
                  Sábados: 10:00 AM - 2:00 PM<br>
                  Domingos: Línea de emergencia disponible<br>
                  <strong>Línea 24/7 siempre disponible</strong>
                </p>
              </div>

              <div class="info-block emergency">
                <h3>🚨 En Emergencia</h3>
                <p>Si estás en peligro inmediato:</p>
                <ul>
                  <li><strong>Línea SafeZone:</strong> 1800-SAFEZONE</li>
                  <li><strong>MIMP Línea 100:</strong> 100</li>
                  <li><strong>Policía Nacional:</strong> 105</li>
                </ul>
              </div>

              <div class="social-block">
                <h3>Síguenos</h3>
                <div class="social-links">
                  <a href="#" title="Facebook">f</a>
                  <a href="#" title="WhatsApp">W</a>
                  <a href="#" title="Twitter">𝕏</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .contacto-container {
      width: 100%;
    }

    .header-section {
      background-color: var(--color-primary);
      color: var(--color-on-primary);
      padding: var(--space-16) var(--space-6);
      text-align: center;
    }

    .header-section h1 {
      font-size: var(--text-5xl);
      margin: 0;
      font-family: var(--font-serif);
      font-weight: var(--font-bold);
    }

    .subtitle {
      font-size: var(--text-lg);
      margin: var(--space-4) 0 0 0;
      opacity: 0.9;
      font-family: var(--font-sans);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--space-6);
    }

    .content-section {
      padding: var(--space-16) var(--space-6);
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-12);
    }

    .contact-form h2,
    .contact-info h2 {
      color: var(--color-foreground);
      margin-top: 0;
      font-family: var(--font-serif);
      font-weight: var(--font-bold);
      font-size: var(--text-2xl);
    }

    form {
      background: var(--color-background);
      padding: var(--space-8);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }

    .form-group {
      margin-bottom: var(--space-6);
    }

    .form-group label {
      display: block;
      margin-bottom: var(--space-2);
      color: var(--color-foreground);
      font-weight: var(--font-semibold);
      font-family: var(--font-sans);
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: var(--space-3);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-family: var(--font-sans);
      font-size: var(--text-base);
      transition: all var(--duration-base) var(--ease-in-out);
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
    }

    .form-error {
      color: #dc2626;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: block;
    }

    .has-error input,
    .has-error select,
    .has-error textarea {
      border-color: #dc2626 !important;
    }

    .btn {
      padding: var(--space-4) var(--space-6);
      border: none;
      border-radius: var(--radius-md);
      font-weight: var(--font-semibold);
      cursor: pointer;
      transition: all var(--duration-base) var(--ease-in-out);
      width: 100%;
      font-family: var(--font-sans);
      min-height: 44px;
    }

    .btn:focus-visible {
      outline: 2px solid var(--color-ring);
      outline-offset: 2px;
    }

    .btn-primary {
      background-color: var(--color-primary);
      color: var(--color-on-primary);
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--color-primary-light);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .success-message {
      background: var(--color-success-lighter);
      color: var(--color-success-dark);
      padding: var(--space-4);
      border-radius: var(--radius-md);
      margin-top: var(--space-4);
      border: 1px solid var(--color-success);
      font-family: var(--font-sans);
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
    }

    .info-block {
      background: var(--color-background);
      padding: var(--space-6);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border-left: 4px solid var(--color-primary);
    }

    .info-block h3 {
      margin-top: 0;
      color: var(--color-primary);
      font-family: var(--font-serif);
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
    }

    .info-block p {
      margin: var(--space-2) 0;
      color: var(--color-muted-foreground);
      line-height: var(--leading-normal);
      font-family: var(--font-sans);
    }

    .info-block a {
      color: var(--color-primary);
      text-decoration: none;
      transition: all var(--duration-fast) var(--ease-in-out);
    }

    .info-block a:hover {
      text-decoration: underline;
      color: var(--color-primary-light);
    }

    .info-block a:focus-visible {
      outline: 2px solid var(--color-ring);
      outline-offset: 2px;
      border-radius: var(--radius-sm);
    }

    .highlight {
      font-size: var(--text-xl);
      font-weight: var(--font-bold);
      color: var(--color-primary);
      font-family: var(--font-sans);
    }

    .info-block.emergency {
      background: var(--color-warning-lighter);
      border-left-color: var(--color-destructive);
    }

    .info-block.emergency h3 {
      color: var(--color-destructive);
    }

    .info-block.emergency ul {
      list-style: none;
      padding: 0;
      margin: var(--space-4) 0 0 0;
      font-family: var(--font-sans);
    }

    .info-block.emergency li {
      padding: var(--space-2) 0;
      color: var(--color-foreground);
      padding-left: var(--space-6);
      position: relative;
    }

    .info-block.emergency li::before {
      content: '▸';
      position: absolute;
      left: 0;
      color: var(--color-destructive);
      font-weight: var(--font-bold);
    }

    .social-block {
      text-align: center;
    }

    .social-block h3 {
      color: var(--color-primary);
      font-family: var(--font-serif);
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
    }

    .social-links {
      display: flex;
      gap: var(--space-4);
      justify-content: center;
      margin-top: var(--space-4);
    }

    .social-links a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      background-color: var(--color-primary);
      border-radius: var(--radius-full);
      color: var(--color-on-primary);
      text-decoration: none;
      font-weight: var(--font-bold);
      transition: all var(--duration-base) var(--ease-in-out);
    }

    .social-links a:hover {
      transform: scale(1.1);
      background-color: var(--color-primary-light);
    }

    .social-links a:focus-visible {
      outline: 2px solid var(--color-ring);
      outline-offset: 2px;
    }

    @media (max-width: 768px) {
      .contact-grid {
        grid-template-columns: 1fr;
        gap: var(--space-8);
      }

      .header-section h1 {
        font-size: var(--text-3xl);
      }

      .contact-info {
        order: -1;
      }
    }
  `]
})
export class PublicContactoPage {
  formData = {
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  };

  errors = {
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  };

  mensajeEnviado = false;

  clearError(field: keyof typeof this.errors) {
    this.errors[field] = '';
  }

  onSubmit() {
    let hasError = false;

    // Sanitizar
    this.formData.nombre = trimAndCollapse(this.formData.nombre);
    this.formData.email = trimAndCollapse(this.formData.email);
    this.formData.mensaje = trimAndCollapse(this.formData.mensaje);

    // Validar nombre
    if (!this.formData.nombre) {
      this.errors.nombre = 'El nombre es obligatorio.';
      hasError = true;
    } else if (!onlyLetters(this.formData.nombre)) {
      this.errors.nombre = 'Solo se permiten letras, espacios, apóstrofe y guion.';
      hasError = true;
    } else if (this.formData.nombre.length < 2 || this.formData.nombre.length > 120) {
      this.errors.nombre = 'El nombre debe tener entre 2 y 120 caracteres.';
      hasError = true;
    } else {
      this.errors.nombre = '';
    }

    // Validar email
    if (!this.formData.email) {
      this.errors.email = 'El correo electrónico es obligatorio.';
      hasError = true;
    } else if (!isValidEmail(this.formData.email)) {
      this.errors.email = 'Debe ingresar un correo electrónico válido.';
      hasError = true;
    } else {
      this.errors.email = '';
    }

    // Validar asunto
    if (!this.formData.asunto) {
      this.errors.asunto = 'Debe seleccionar un asunto.';
      hasError = true;
    } else {
      this.errors.asunto = '';
    }

    // Validar mensaje
    if (!this.formData.mensaje) {
      this.errors.mensaje = 'El mensaje es obligatorio.';
      hasError = true;
    } else if (this.formData.mensaje.length < 10 || this.formData.mensaje.length > 1000) {
      this.errors.mensaje = 'El mensaje debe tener entre 10 y 1000 caracteres.';
      hasError = true;
    } else {
      this.errors.mensaje = '';
    }

    if (hasError) {
      return;
    }

    // Simular envío
    console.log('Formulario enviado:', this.formData);
    this.mensajeEnviado = true;

    // Limpiar formulario después de 3 segundos
    setTimeout(() => {
      this.formData = {
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
      };
      this.mensajeEnviado = false;
    }, 3000);
  }
}
