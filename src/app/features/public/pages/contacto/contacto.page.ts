import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
                <div class="form-group">
                  <label for="nombre">Nombre:</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    [(ngModel)]="formData.nombre"
                    placeholder="Tu nombre completo"
                    required
                  >
                </div>

                <div class="form-group">
                  <label for="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    [(ngModel)]="formData.email"
                    placeholder="tu@email.com"
                    required
                  >
                </div>

                <div class="form-group">
                  <label for="asunto">Asunto:</label>
                  <select id="asunto" name="asunto" [(ngModel)]="formData.asunto" required>
                    <option value="">Seleccionar asunto...</option>
                    <option value="consulta">Consulta General</option>
                    <option value="emergencia">Emergencia/Ayuda Inmediata</option>
                    <option value="feedback">Feedback/Sugerencias</option>
                    <option value="tecnico">Problema Técnico</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="mensaje">Mensaje:</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    [(ngModel)]="formData.mensaje"
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                    rows="5"
                    required
                  ></textarea>
                </div>

                <button type="submit" class="btn btn-primary" [disabled]="!contactForm.valid">
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

    .info-block ul {
      list-style: none;
      padding: 0;
      margin: var(--space-4) 0 0 0;
      font-family: var(--font-sans);
    }

    .info-block li {
      padding: var(--space-2) 0;
      color: var(--color-foreground);
      padding-left: var(--space-6);
      position: relative;
    }

    .info-block li::before {
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

  mensajeEnviado = false;

  onSubmit() {
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
