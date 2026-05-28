import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  onlyLetters, 
  isValidEmail, 
  isValidCelular,
  trimAndCollapse, 
  blockNonNumericKeys, 
  filterNumericInput 
} from '../../../../../shared/utils/validation.utils';

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

            <form (ngSubmit)="onSubmit()" #denunciaForm="ngForm" class="denuncia-form" *ngIf="!denunciaEnviada">
              <div class="form-step" [hidden]="step !== 1">
                <h3>Paso 1: Tipo de Violencia</h3>
                <p>¿Qué tipo de violencia has experimentado? *</p>

                @if (errors.tiposViolencia) {
                  <span class="form-error" style="margin-bottom: 15px;">{{ errors.tiposViolencia }}</span>
                }

                <div class="form-group">
                  <label>
                    <input type="checkbox" name="fisica" [(ngModel)]="formData.tiposViolencia.fisica" (change)="clearError('tiposViolencia')">
                    <span>Violencia Física</span>
                    <small>Golpes, lesiones, agresiones</small>
                  </label>
                </div>

                <div class="form-group">
                  <label>
                    <input type="checkbox" name="psicologica" [(ngModel)]="formData.tiposViolencia.psicologica" (change)="clearError('tiposViolencia')">
                    <span>Violencia Psicológica</span>
                    <small>Insultos, amenazas, humillación</small>
                  </label>
                </div>

                <div class="form-group">
                  <label>
                    <input type="checkbox" name="sexual" [(ngModel)]="formData.tiposViolencia.sexual" (change)="clearError('tiposViolencia')">
                    <span>Violencia Sexual</span>
                    <small>Abuso o agresión sexual</small>
                  </label>
                </div>

                <div class="form-group">
                  <label>
                    <input type="checkbox" name="economica" [(ngModel)]="formData.tiposViolencia.economica" (change)="clearError('tiposViolencia')">
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

                <div class="form-group" [class.has-error]="errors.ubicacion">
                  <label for="ubicacion">¿Dónde ocurrió? *</label>
                  <select id="ubicacion" name="ubicacion" [(ngModel)]="formData.ubicacion" (change)="clearError('ubicacion')" required>
                    <option value="">Seleccionar lugar...</option>
                    <option value="hogar">Hogar/Casa</option>
                    <option value="trabajo">Trabajo</option>
                    <option value="calle">Calle/Vía pública</option>
                    <option value="otro">Otro lugar</option>
                  </select>
                  @if (errors.ubicacion) {
                    <span class="form-error">{{ errors.ubicacion }}</span>
                  }
                </div>

                <div class="form-group" [class.has-error]="errors.fechaUltimo">
                  <label for="fecha">¿Cuándo fue el último incidente? *</label>
                  <input type="date" id="fecha" name="fecha" [(ngModel)]="formData.fechaUltimo" (change)="clearError('fechaUltimo')" required>
                  @if (errors.fechaUltimo) {
                    <span class="form-error">{{ errors.fechaUltimo }}</span>
                  }
                </div>

                <div class="form-group" [class.has-error]="errors.descripcion">
                  <label for="descripcion">Descripción de los hechos: *</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    [(ngModel)]="formData.descripcion"
                    (input)="clearError('descripcion')"
                    placeholder="Cuéntanos qué sucedió..."
                    rows="4"
                    required
                  ></textarea>
                  @if (errors.descripcion) {
                    <span class="form-error">{{ errors.descripcion }}</span>
                  }
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

                <div class="form-group" [class.has-error]="errors.nombre">
                  <label for="nombre">Nombre completo: *</label>
                  <input type="text" id="nombre" name="nombre" [(ngModel)]="formData.nombre" (input)="clearError('nombre')" required>
                  @if (errors.nombre) {
                    <span class="form-error">{{ errors.nombre }}</span>
                  }
                </div>

                <div class="form-group" [class.has-error]="errors.email">
                  <label for="email">Email: *</label>
                  <input type="email" id="email" name="email" [(ngModel)]="formData.email" (input)="clearError('email')" required>
                  @if (errors.email) {
                    <span class="form-error">{{ errors.email }}</span>
                  }
                </div>

                <div class="form-group" [class.has-error]="errors.telefono">
                  <label for="telefono">Teléfono de contacto seguro: *</label>
                  <input type="text" inputmode="numeric" id="telefono" name="telefono" [ngModel]="formData.telefono" (input)="onTelefonoInput($event)" (keydown)="onNumericKeydown($event)" required placeholder="9 dígitos" maxlength="9">
                  @if (errors.telefono) {
                    <span class="form-error">{{ errors.telefono }}</span>
                  }
                  <small>Usa un número donde podamos contactarte de forma privada</small>
                </div>

                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" (click)="previousStep()">
                    ← Anterior
                  </button>
                  <button type="submit" class="btn btn-success">
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

  errors = {
    tiposViolencia: '',
    ubicacion: '',
    fechaUltimo: '',
    descripcion: '',
    nombre: '',
    email: '',
    telefono: ''
  };

  clearError(field: keyof typeof this.errors) {
    this.errors[field] = '';
  }

  onNumericKeydown(event: KeyboardEvent) {
    blockNonNumericKeys(event);
  }

  onTelefonoInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.formData.telefono = filterNumericInput(input.value);
    this.clearError('telefono');
  }

  nextStep() {
    let hasError = false;

    if (this.step === 1) {
      const selected = Object.values(this.formData.tiposViolencia).some(v => v);
      if (!selected) {
        this.errors.tiposViolencia = 'Debe seleccionar al menos un tipo de violencia.';
        hasError = true;
      } else {
        this.errors.tiposViolencia = '';
      }
    }

    if (this.step === 2) {
      this.formData.descripcion = trimAndCollapse(this.formData.descripcion);

      if (!this.formData.ubicacion) {
        this.errors.ubicacion = 'Debe seleccionar la ubicación.';
        hasError = true;
      } else {
        this.errors.ubicacion = '';
      }

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;

      if (!this.formData.fechaUltimo) {
        this.errors.fechaUltimo = 'La fecha del último incidente es obligatoria.';
        hasError = true;
      } else if (this.formData.fechaUltimo > todayStr) {
        this.errors.fechaUltimo = 'La fecha no puede ser futura.';
        hasError = true;
      } else {
        this.errors.fechaUltimo = '';
      }

      if (!this.formData.descripcion) {
        this.errors.descripcion = 'La descripción de los hechos es obligatoria.';
        hasError = true;
      } else if (this.formData.descripcion.length < 20 || this.formData.descripcion.length > 2000) {
        this.errors.descripcion = 'La descripción debe tener entre 20 y 2000 caracteres.';
        hasError = true;
      } else {
        this.errors.descripcion = '';
      }
    }

    if (hasError) {
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
    let hasError = false;

    this.formData.nombre = trimAndCollapse(this.formData.nombre);
    this.formData.email = trimAndCollapse(this.formData.email);

    // Validar nombre
    if (!this.formData.nombre) {
      this.errors.nombre = 'El nombre completo es obligatorio.';
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

    // Validar telefono
    if (!this.formData.telefono) {
      this.errors.telefono = 'El teléfono de contacto es obligatorio.';
      hasError = true;
    } else if (!isValidCelular(this.formData.telefono)) {
      this.errors.telefono = 'El celular debe tener exactamente 9 dígitos.';
      hasError = true;
    } else {
      this.errors.telefono = '';
    }

    if (hasError) {
      return;
    }

    // Generar código de seguimiento
    this.codigoSeguimiento = 'PD-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    console.log('Denuncia enviada:', this.formData);
    console.log('Código:', this.codigoSeguimiento);

    this.denunciaEnviada = true;
    window.scrollTo(0, 0);
  }
}
