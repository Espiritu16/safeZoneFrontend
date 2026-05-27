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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
      text-align: center;
    }

    .header-section h1 {
      font-size: 3rem;
      margin: 0;
    }

    .subtitle {
      font-size: 1.3rem;
      margin: 1rem 0 0 0;
      opacity: 0.9;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .content-section {
      padding: 4rem 2rem;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }

    .contact-form h2,
    .contact-info h2 {
      color: #333;
      margin-top: 0;
    }

    form {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 600;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-family: inherit;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      width: 100%;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .success-message {
      background: #d4edda;
      color: #155724;
      padding: 1rem;
      border-radius: 6px;
      margin-top: 1rem;
      border: 1px solid #c3e6cb;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .info-block {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #667eea;
    }

    .info-block h3 {
      margin-top: 0;
      color: #667eea;
    }

    .info-block p {
      margin: 0.5rem 0;
      color: #666;
      line-height: 1.6;
    }

    .info-block a {
      color: #667eea;
      text-decoration: none;
    }

    .info-block a:hover {
      text-decoration: underline;
    }

    .highlight {
      font-size: 1.3rem;
      font-weight: 700;
      color: #667eea;
    }

    .info-block.emergency {
      background: #fff3cd;
      border-left-color: #ff6b6b;
    }

    .info-block.emergency h3 {
      color: #ff6b6b;
    }

    .info-block ul {
      list-style: none;
      padding: 0;
      margin: 1rem 0 0 0;
    }

    .info-block li {
      padding: 0.5rem 0;
      color: #333;
      padding-left: 1.5rem;
      position: relative;
    }

    .info-block li::before {
      content: '▸';
      position: absolute;
      left: 0;
      color: #ff6b6b;
      font-weight: bold;
    }

    .social-block {
      text-align: center;
    }

    .social-block h3 {
      color: #667eea;
    }

    .social-links {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1rem;
    }

    .social-links a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      color: white;
      text-decoration: none;
      font-weight: bold;
      transition: transform 0.3s;
    }

    .social-links a:hover {
      transform: scale(1.1);
    }

    @media (max-width: 768px) {
      .contact-grid {
        grid-template-columns: 1fr;
      }

      .header-section h1 {
        font-size: 2rem;
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
