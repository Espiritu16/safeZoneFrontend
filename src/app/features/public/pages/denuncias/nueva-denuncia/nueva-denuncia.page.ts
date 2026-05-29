import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LettersOnlyDirective } from '../../../../../shared/directives/letters-only.directive';
import { NumbersOnlyDirective } from '../../../../../shared/directives/numbers-only.directive';
import { TrimOnBlurDirective } from '../../../../../shared/directives/trim-on-blur.directive';
import { normalizeText, sanitizeLettersOnly, sanitizeNumbersOnly } from '../../../../../shared/utils/input-sanitizers.util';
import { isValidBasicEmail, VALIDATION_LIMITS, VALIDATION_PATTERNS } from '../../../../../shared/utils/validation-rules';

@Component({
  selector: 'app-public-nueva-denuncia',
  standalone: true,
  imports: [CommonModule, FormsModule, LettersOnlyDirective, NumbersOnlyDirective, TrimOnBlurDirective],
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
              <div *ngIf="validationMessage" class="warning">{{ validationMessage }}</div>
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
                    appTrimOnBlur
                    [(ngModel)]="formData.descripcion"
                    placeholder="Cuéntanos qué sucedió..."
                    rows="4"
                    required
                    minlength="20"
                    maxlength="2000"
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
                  <input type="text" id="nombre" name="nombre" appLettersOnly appTrimOnBlur [(ngModel)]="formData.nombre" required minlength="2" maxlength="120" pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$">
                </div>

                <div class="form-group">
                  <label for="email">Email:</label>
                  <input type="email" id="email" name="email" appTrimOnBlur [(ngModel)]="formData.email" required maxlength="254">
                </div>

                <div class="form-group">
                  <label for="telefono">Teléfono de contacto seguro:</label>
                  <input type="text" inputmode="numeric" id="telefono" name="telefono" appNumbersOnly [(ngModel)]="formData.telefono" required pattern="^[0-9]{9}$" maxlength="9">
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
      max-width: 900px;
      margin: 0 auto;
      padding: 0 var(--space-6);
    }

    .content-section {
      padding: var(--space-12) var(--space-6);
    }

    .form-wrapper {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: var(--space-8);
    }

    .form-info {
      background: var(--color-muted);
      padding: var(--space-8);
      border-radius: var(--radius-lg);
      height: fit-content;
      position: sticky;
      top: var(--space-6);
    }

    .form-info h2 {
      margin-top: 0;
      color: var(--color-primary);
      font-size: var(--text-lg);
      font-family: var(--font-serif);
      font-weight: var(--font-bold);
    }

    .form-info ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .form-info li {
      margin: var(--space-4) 0;
      color: var(--color-muted-foreground);
      line-height: var(--leading-normal);
      font-family: var(--font-sans);
    }

    .denuncia-form {
      background: var(--color-background);
      padding: var(--space-8);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
    }

    .form-step {
      animation: fadeIn var(--duration-base) var(--ease-out);
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
      color: var(--color-primary);
      margin-top: 0;
      font-size: var(--text-2xl);
      font-family: var(--font-serif);
      font-weight: var(--font-bold);
    }

    .form-step p {
      color: var(--color-muted-foreground);
      font-family: var(--font-sans);
    }

    .form-group {
      margin-bottom: var(--space-6);
    }

    .form-group label {
      display: block;
      margin-bottom: var(--space-2);
      color: var(--color-foreground);
      font-weight: var(--font-semibold);
      cursor: pointer;
      font-family: var(--font-sans);
    }

    .form-group label input[type="checkbox"] {
      margin-right: var(--space-2);
      cursor: pointer;
      accent-color: var(--color-primary);
      width: 18px;
      height: 18px;
    }

    .form-group label span {
      display: block;
      margin-left: var(--space-6);
    }

    .form-group small {
      display: block;
      margin-left: var(--space-6);
      color: var(--color-muted-foreground);
      font-size: var(--text-xs);
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

    .form-group small {
      margin-top: var(--space-1);
      display: block;
      color: var(--color-muted-foreground);
    }

    .warning {
      background: var(--color-warning-lighter);
      padding: var(--space-4);
      border-radius: var(--radius-md);
      color: var(--color-warning-dark);
      margin-bottom: var(--space-6);
      font-family: var(--font-sans);
    }

    .form-actions {
      display: flex;
      gap: var(--space-4);
      margin-top: var(--space-8);
    }

    .btn {
      padding: var(--space-3) var(--space-6);
      border: none;
      border-radius: var(--radius-md);
      font-weight: var(--font-semibold);
      cursor: pointer;
      transition: all var(--duration-base) var(--ease-in-out);
      flex: 1;
      font-family: var(--font-sans);
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn:focus-visible {
      outline: 2px solid var(--color-ring);
      outline-offset: 2px;
    }

    .btn-primary {
      background-color: var(--color-primary);
      color: var(--color-on-primary);
    }

    .btn-primary:hover {
      background-color: var(--color-primary-light);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .btn-secondary {
      background-color: var(--color-muted);
      color: var(--color-foreground);
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: var(--color-border);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-success {
      background-color: var(--color-success);
      color: var(--color-on-success);
    }

    .btn-success:hover {
      background-color: var(--color-success-light);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .progress-bar {
      width: 100%;
      height: 4px;
      background: var(--color-border);
      border-radius: var(--radius-full);
      margin-top: var(--space-8);
      overflow: hidden;
    }

    .progress-bar div {
      height: 100%;
      background-color: var(--color-primary);
      transition: width var(--duration-base) var(--ease-in-out);
    }

    .success-panel {
      text-align: center;
      padding: var(--space-12) var(--space-8);
      background: var(--color-background);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
    }

    .success-icon {
      font-size: var(--text-5xl);
      color: var(--color-success);
      margin-bottom: var(--space-4);
    }

    .success-panel h2 {
      color: var(--color-foreground);
      margin-top: 0;
      font-family: var(--font-serif);
      font-size: var(--text-3xl);
      font-weight: var(--font-bold);
    }

    .success-panel p {
      color: var(--color-muted-foreground);
      font-family: var(--font-sans);
    }

    .code-box {
      background: var(--color-muted);
      padding: var(--space-6);
      border-radius: var(--radius-md);
      margin: var(--space-8) 0;
      border: 2px solid var(--color-primary);
    }

    .code-box p {
      color: var(--color-muted-foreground);
      margin: 0;
      font-family: var(--font-sans);
    }

    .code-box h3 {
      font-size: var(--text-3xl);
      color: var(--color-primary);
      margin: var(--space-2) 0 0 0;
      font-family: var(--font-mono);
      letter-spacing: 2px;
      font-weight: var(--font-bold);
    }

    .important {
      color: var(--color-destructive);
      font-weight: var(--font-bold);
      font-family: var(--font-sans);
    }

    @media (max-width: 768px) {
      .form-wrapper {
        grid-template-columns: 1fr;
      }

      .form-info {
        position: static;
      }

      .header-section h1 {
        font-size: var(--text-3xl);
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
  validationMessage = '';

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
    if (!this.validateStep(this.step)) {
      return;
    }
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
    if (![1, 2, 3].every(step => this.validateStep(step))) {
      return;
    }
    // Generar código de seguimiento
    this.codigoSeguimiento = 'PD-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    this.denunciaEnviada = true;
    window.scrollTo(0, 0);
  }

  private normalizeForm() {
    this.formData = {
      ...this.formData,
      descripcion: normalizeText(this.formData.descripcion),
      nombre: sanitizeLettersOnly(this.formData.nombre).trim(),
      email: this.formData.email.trim().toLowerCase(),
      telefono: sanitizeNumbersOnly(this.formData.telefono),
    };
  }

  private validateStep(step: number): boolean {
    this.normalizeForm();
    this.validationMessage = '';

    if (step === 1 && !Object.values(this.formData.tiposViolencia).some(Boolean)) {
      this.validationMessage = 'Seleccione al menos un tipo de violencia.';
    }

    if (step === 2) {
      const today = new Date().toISOString().split('T')[0];
      if (!this.formData.ubicacion) {
        this.validationMessage = 'Seleccione dónde ocurrió el incidente.';
      } else if (!this.formData.fechaUltimo || this.formData.fechaUltimo > today) {
        this.validationMessage = 'La fecha es obligatoria y no puede ser futura.';
      } else if (
        this.formData.descripcion.length < VALIDATION_LIMITS.LONG_TEXT_MIN ||
        this.formData.descripcion.length > VALIDATION_LIMITS.LONG_TEXT_MAX
      ) {
        this.validationMessage = 'La descripción debe tener entre 20 y 2000 caracteres.';
      }
    }

    if (step === 3) {
      if (
        this.formData.nombre.length < VALIDATION_LIMITS.NAME_MIN ||
        this.formData.nombre.length > VALIDATION_LIMITS.NAME_MAX ||
        !VALIDATION_PATTERNS.PERSON_NAME.test(this.formData.nombre)
      ) {
        this.validationMessage = 'El nombre debe tener entre 2 y 120 caracteres y solo letras.';
      } else if (!isValidBasicEmail(this.formData.email)) {
        this.validationMessage = 'Ingrese un email válido.';
      } else if (!VALIDATION_PATTERNS.CELULAR.test(this.formData.telefono)) {
        this.validationMessage = 'El teléfono debe tener 9 dígitos numéricos.';
      }
    }

    return !this.validationMessage;
  }
}
