import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-nueva-denuncia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="nueva-denuncia-container">
      <section class="header-section">
        <h1>Enviar una Denuncia</h1>
        <p class="subtitle">Tu seguridad es nuestra prioridad</p>
      </section>

      <section class="content-section">
        <div class="container">
          <div class="form-wrapper">
            <div class="form-info">
              <h2>Información Importante</h2>
              <ul>
                <li>✓ Tu identidad será protegida con un alias anónimo</li>
                <li>✓ Toda la información es confidencial</li>
                <li>✓ Recibirás un código de seguimiento para consultar tu caso</li>
                <li>✓ Un equipo profesional se pondrá en contacto contigo</li>
                <li>✓ El servicio es completamente gratuito</li>
              </ul>
            </div>

            <form (ngSubmit)="onSubmit()" #denunciaForm="ngForm" class="denuncia-form">
              <div class="form-step" [hidden]="step !== 1">
                <h3>Paso 1: Tipo de Violencia</h3>
                <p>¿Qué tipo de violencia has experimentado?</p>

                <div class="form-group">
                  <label>
                    <input type="checkbox" name="fisica" [(ngModel)]="formData.tiposViolencia.fisica">
                    <span>Violencia Física</span>
                    <small>Golpes, lesiones, agresiones</small>
                  </label>
                </div>

                <div class="form-group">
                  <label>
                    <input type="checkbox" name="psicologica" [(ngModel)]="formData.tiposViolencia.psicologica">
                    <span>Violencia Psicológica</span>
                    <small>Insultos, amenazas, humillación</small>
                  </label>
                </div>

                <div class="form-group">
                  <label>
                    <input type="checkbox" name="sexual" [(ngModel)]="formData.tiposViolencia.sexual">
                    <span>Violencia Sexual</span>
                    <small>Abuso o agresión sexual</small>
                  </label>
                </div>

                <div class="form-group">
                  <label>
                    <input type="checkbox" name="economica" [(ngModel)]="formData.tiposViolencia.economica">
                    <span>Violencia Económica</span>
                    <small>Control de dinero o recursos</small>
                  </label>
                </div>

                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" disabled>
                    ← Anterior
                  </button>
                  <button type="button" class="btn btn-primary" (click)="nextStep()">
                    Siguiente →
                  </button>
                </div>
              </div>

              <div class="form-step" [hidden]="step !== 2">
                <h3>Paso 2: Información de la Violencia</h3>

                <div class="form-group">
                  <label for="ubicacion">¿Dónde ocurrió?</label>
                  <select id="ubicacion" name="ubicacion" [(ngModel)]="formData.ubicacion" required>
                    <option value="">Seleccionar lugar...</option>
                    <option value="hogar">Hogar/Casa</option>
                    <option value="trabajo">Trabajo</option>
                    <option value="calle">Calle/Vía pública</option>
                    <option value="otro">Otro lugar</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="fecha">¿Cuándo fue el último incidente?</label>
                  <input type="date" id="fecha" name="fecha" [(ngModel)]="formData.fechaUltimo" required>
                </div>

                <div class="form-group">
                  <label for="descrip cion">Descripción de los hechos:</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    [(ngModel)]="formData.descripcion"
                    placeholder="Cuéntanos qué sucedió..."
                    rows="4"
                    required
                  ></textarea>
                  <small>Sé lo más detallado posible para ayudarnos a entender tu situación</small>
                </div>

                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" (click)="previousStep()">
                    ← Anterior
                  </button>
                  <button type="button" class="btn btn-primary" (click)="nextStep()">
                    Siguiente →
                  </button>
                </div>
              </div>

              <div class="form-step" [hidden]="step !== 3">
                <h3>Paso 3: Tu Información de Contacto</h3>
                <p class="warning">⚠️ Esta información es necesaria para que podamos contactarte de forma segura</p>

                <div class="form-group">
                  <label for="nombre">Nombre completo:</label>
                  <input type="text" id="nombre" name="nombre" [(ngModel)]="formData.nombre" required>
                </div>

                <div class="form-group">
                  <label for="email">Email:</label>
                  <input type="email" id="email" name="email" [(ngModel)]="formData.email" required>
                </div>

                <div class="form-group">
                  <label for="telefono">Teléfono de contacto seguro:</label>
                  <input type="tel" id="telefono" name="telefono" [(ngModel)]="formData.telefono" required>
                  <small>Usa un número donde podamos contactarte de forma privada</small>
                </div>

                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" (click)="previousStep()">
                    ← Anterior
                  </button>
                  <button type="submit" class="btn btn-success" [disabled]="!denunciaForm.valid">
                    Enviar Denuncia
                  </button>
                </div>
              </div>

              <div class="progress-bar">
                <div [style.width]="(step / 3) * 100 + '%'"></div>
              </div>
            </form>

            <div *ngIf="denunciaEnviada" class="success-panel">
              <div class="success-icon">✓</div>
              <h2>¡Denuncia Enviada Exitosamente!</h2>
              <p>Gracias por confiar en SafeZone. Tu seguridad es nuestra prioridad.</p>
              <div class="code-box">
                <p>Tu código de seguimiento:</p>
                <h3>{{ codigoSeguimiento }}</h3>
              </div>
              <p class="important">
                <strong>Guarda este código.</strong> Lo necesitarás para consultar el estado de tu caso.
              </p>
              <p>
                Un recepcionista se comunicará contigo en las próximas 24 horas al número de teléfono que proporcionaste.
              </p>
              <a href="/" class="btn btn-primary">
                Volver a Inicio
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .nueva-denuncia-container {
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
      max-width: 900px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .content-section {
      padding: 3rem 2rem;
    }

    .form-wrapper {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2rem;
    }

    .form-info {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 12px;
      height: fit-content;
      position: sticky;
      top: 2rem;
    }

    .form-info h2 {
      margin-top: 0;
      color: #667eea;
      font-size: 1.2rem;
    }

    .form-info ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .form-info li {
      margin: 1rem 0;
      color: #666;
      line-height: 1.6;
    }

    .denuncia-form {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .form-step {
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .form-step h3 {
      color: #667eea;
      margin-top: 0;
      font-size: 1.5rem;
    }

    .form-step p {
      color: #666;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 600;
      cursor: pointer;
    }

    .form-group label input[type="checkbox"] {
      margin-right: 0.5rem;
      cursor: pointer;
    }

    .form-group label span {
      display: block;
      margin-left: 1.5rem;
    }

    .form-group small {
      display: block;
      margin-left: 1.5rem;
      color: #999;
      font-size: 0.85rem;
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

    .form-group small {
      margin-top: 0.25rem;
      display: block;
      color: #999;
    }

    .warning {
      background: #fff3cd;
      padding: 1rem;
      border-radius: 6px;
      color: #856404;
      margin-bottom: 1.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      flex: 1;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary {
      background: #e0e0e0;
      color: #333;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #d0d0d0;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-success {
      background: #28a745;
      color: white;
    }

    .btn-success:hover {
      background: #218838;
      transform: translateY(-2px);
    }

    .progress-bar {
      width: 100%;
      height: 4px;
      background: #e0e0e0;
      border-radius: 2px;
      margin-top: 2rem;
      overflow: hidden;
    }

    .progress-bar div {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s ease;
    }

    .success-panel {
      text-align: center;
      padding: 3rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .success-icon {
      font-size: 4rem;
      color: #28a745;
      margin-bottom: 1rem;
    }

    .success-panel h2 {
      color: #333;
      margin-top: 0;
    }

    .code-box {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin: 2rem 0;
      border: 2px solid #667eea;
    }

    .code-box h3 {
      font-size: 1.8rem;
      color: #667eea;
      margin: 0.5rem 0 0 0;
      font-family: monospace;
      letter-spacing: 2px;
    }

    .important {
      color: #ff6b6b;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .form-wrapper {
        grid-template-columns: 1fr;
      }

      .form-info {
        position: static;
      }

      .header-section h1 {
        font-size: 2rem;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class PublicNuevaDenunciaPage {
  step = 1;
  denunciaEnviada = false;
  codigoSeguimiento = '';

  formData = {
    tiposViolencia: {
      fisica: false,
      psicologica: false,
      sexual: false,
      economica: false
    },
    ubicacion: '',
    fechaUltimo: '',
    descripcion: '',
    nombre: '',
    email: '',
    telefono: ''
  };

  nextStep() {
    if (this.step < 3) {
      this.step++;
      window.scrollTo(0, 0);
    }
  }

  previousStep() {
    if (this.step > 1) {
      this.step--;
      window.scrollTo(0, 0);
    }
  }

  onSubmit() {
    // Generar código de seguimiento
    this.codigoSeguimiento = 'PD-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    console.log('Denuncia enviada:', this.formData);
    console.log('Código:', this.codigoSeguimiento);

    this.denunciaEnviada = true;
    window.scrollTo(0, 0);
  }
}
