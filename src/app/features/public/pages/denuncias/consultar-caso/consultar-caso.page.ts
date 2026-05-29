import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrimOnBlurDirective } from '../../../../../shared/directives/trim-on-blur.directive';
import { sanitizeCaseCode } from '../../../../../shared/utils/input-sanitizers.util';
import { VALIDATION_PATTERNS } from '../../../../../shared/utils/validation-rules';

@Component({
  selector: 'app-public-consultar-caso',
  standalone: true,
  imports: [CommonModule, FormsModule, TrimOnBlurDirective],
  template: `
    <div class="consultar-caso-container">
      <section class="header-section">
        <h1>Consultar Mi Caso</h1>
        <p class="subtitle">Verifica el estado de tu denuncia</p>
      </section>

      <section class="content-section">
        <div class="container">
          <div class="search-box">
            <h2>Ingresa tu código de seguimiento</h2>
            <div class="search-form">
              <input
                type="text"
                appTrimOnBlur
                [(ngModel)]="codigoSeguimiento"
                placeholder="Ej: PD-ABC12345"
                class="search-input"
                maxlength="17"
                pattern="^[A-Z]{2,4}-[A-Z0-9]{6,12}$"
              >
              <button (click)="buscarCaso()" class="btn btn-primary">
                Buscar
              </button>
            </div>
            <p class="info-text">
              El código de seguimiento fue generado cuando enviaste tu denuncia.
            </p>
            <p *ngIf="validationMessage" class="info-text" style="color: var(--color-destructive);">
              {{ validationMessage }}
            </p>
          </div>

          <div *ngIf="casoBuscado && !casoEncontrado" class="no-result">
            <div class="warning-icon">⚠️</div>
            <h3>Caso No Encontrado</h3>
            <p>
              No encontramos un caso con el código ingresado.
              Verifica que el código sea correcto.
            </p>
          </div>

          <div *ngIf="casoEncontrado" class="caso-info">
            <h2>Estado de Tu Caso</h2>

            <div class="info-panel">
              <div class="info-row">
                <span class="label">Código de Seguimiento:</span>
                <span class="value">{{ caso.codigo }}</span>
              </div>
              <div class="info-row">
                <span class="label">Alias Anónimo:</span>
                <span class="value">{{ caso.alias }}</span>
              </div>
              <div class="info-row">
                <span class="label">Estado Actual:</span>
                <span class="value" [ngClass]="'estado-' + caso.estado">
                  {{ estadoLabel[caso.estado] }}
                </span>
              </div>
              <div class="info-row">
                <span class="label">Nivel de Riesgo:</span>
                <span class="value" [ngClass]="'riesgo-' + caso.riesgo">
                  {{ caso.riesgo }}
                </span>
              </div>
              <div class="info-row">
                <span class="label">Fecha de Registro:</span>
                <span class="value">{{ caso.fechaRegistro }}</span>
              </div>
            </div>

            <div class="timeline-section">
              <h3>Historial del Caso</h3>
              <div class="timeline">
                <div *ngFor="let evento of caso.eventos" class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <h4>{{ evento.titulo }}</h4>
                    <p>{{ evento.descripcion }}</p>
                    <small>{{ evento.fecha }}</small>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="caso.proximoEvento" class="upcoming">
              <h3>Próximo Evento</h3>
              <div class="upcoming-card">
                <p class="event-type">{{ caso.proximoEvento.tipo }}</p>
                <p class="event-date">{{ caso.proximoEvento.fecha }}</p>
                <p class="event-details">{{ caso.proximoEvento.detalles }}</p>
              </div>
            </div>

            <div class="actions">
              <a href="/" class="btn btn-secondary">Volver a Inicio</a>
              <a href="/public/contacto" class="btn btn-primary">Contactar a SafeZone</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`

    .consultar-caso-container {
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

    .search-box {
      background: var(--color-background);
      padding: var(--space-8);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      margin-bottom: var(--space-8);
      text-align: center;
    }

    .search-box h2 {
      color: var(--color-primary);
      margin-top: 0;
      font-family: var(--font-serif);
      font-size: var(--text-2xl);
      font-weight: var(--font-bold);
    }

    .search-form {
      display: flex;
      gap: var(--space-4);
      margin: var(--space-8) 0;
    }

    .search-input {
      flex: 1;
      padding: var(--space-4);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--text-base);
      transition: border-color var(--duration-base) var(--ease-in-out);
      font-family: var(--font-sans);
    }

    .search-input:focus {
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
      font-family: var(--font-sans);
      font-size: var(--text-base);
      min-height: 44px;
      display: inline-flex;
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
      box-shadow: var(--shadow-lg);
    }

    .btn-secondary {
      background-color: var(--color-muted);
      color: var(--color-foreground);
    }

    .btn-secondary:hover {
      background-color: var(--color-border);
    }

    .info-text {
      color: var(--color-muted-foreground);
      font-size: var(--text-sm);
      margin: 0;
      font-family: var(--font-sans);
    }

    .no-result {
      text-align: center;
      padding: var(--space-8);
      background: var(--color-warning-lighter);
      border-radius: var(--radius-lg);
      border: 2px solid var(--color-warning);
    }

    .warning-icon {
      font-size: var(--text-5xl);
      margin-bottom: var(--space-4);
    }

    .caso-info {
      background: var(--color-background);
      padding: var(--space-8);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
    }

    .caso-info h2 {
      color: var(--color-primary);
      margin-top: 0;
      font-family: var(--font-serif);
      font-size: var(--text-2xl);
      font-weight: var(--font-bold);
    }

    .info-panel {
      background: var(--color-muted);
      padding: var(--space-6);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-8);
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4) 0;
      border-bottom: 1px solid var(--color-border);
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-row .label {
      font-weight: var(--font-semibold);
      color: var(--color-foreground);
      font-family: var(--font-sans);
    }

    .info-row .value {
      color: var(--color-primary);
      font-weight: var(--font-semibold);
      font-family: var(--font-sans);
    }

    .estado-registrado {
      background: rgba(30, 58, 138, 0.1);
      color: var(--color-primary-dark);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
    }

    .estado-evaluacion {
      background: var(--color-warning-lighter);
      color: var(--color-warning-dark);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
    }

    .estado-atencion {
      background: rgba(5, 150, 105, 0.1);
      color: var(--color-success-dark);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
    }

    .riesgo-bajo {
      background: var(--color-success-lighter);
      color: var(--color-success-dark);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
    }

    .riesgo-medio {
      background: var(--color-warning-lighter);
      color: var(--color-warning-dark);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
    }

    .riesgo-alto {
      background: var(--color-destructive-lighter);
      color: var(--color-destructive-dark);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
    }

    .riesgo-critico {
      background: var(--color-destructive-light);
      color: white;
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      font-weight: var(--font-bold);
    }

    .timeline-section {
      margin: var(--space-8) 0;
    }

    .timeline-section h3 {
      color: var(--color-primary);
      font-family: var(--font-serif);
      font-size: var(--text-xl);
      font-weight: var(--font-semibold);
    }

    .timeline {
      position: relative;
      padding: var(--space-4) 0;
    }

    .timeline-item {
      display: flex;
      gap: var(--space-6);
      margin-bottom: var(--space-8);
      position: relative;
    }

    .timeline-dot {
      width: 16px;
      height: 16px;
      background-color: var(--color-primary);
      border-radius: var(--radius-full);
      flex-shrink: 0;
      margin-top: var(--space-1);
    }

    .timeline-content {
      flex: 1;
      background: var(--color-muted);
      padding: var(--space-4);
      border-radius: var(--radius-md);
    }

    .timeline-content h4 {
      margin: 0 0 var(--space-2) 0;
      color: var(--color-foreground);
      font-family: var(--font-sans);
      font-weight: var(--font-semibold);
    }

    .timeline-content p {
      margin: 0 0 var(--space-2) 0;
      color: var(--color-muted-foreground);
      line-height: var(--leading-normal);
      font-family: var(--font-sans);
    }

    .timeline-content small {
      color: var(--color-muted-foreground);
      font-size: var(--text-xs);
    }

    .upcoming {
      background: rgba(30, 58, 138, 0.05);
      padding: var(--space-8);
      border-radius: var(--radius-lg);
      margin: var(--space-8) 0;
      border-left: 4px solid var(--color-primary);
    }

    .upcoming h3 {
      color: var(--color-primary);
      margin-top: 0;
      font-family: var(--font-serif);
      font-size: var(--text-xl);
      font-weight: var(--font-semibold);
    }

    .upcoming-card {
      background: var(--color-background);
      padding: var(--space-6);
      border-radius: var(--radius-md);
    }

    .event-type {
      font-weight: var(--font-semibold);
      color: var(--color-primary);
      margin: 0 0 var(--space-2) 0;
      font-family: var(--font-sans);
    }

    .event-date {
      font-size: var(--text-lg);
      color: var(--color-foreground);
      margin: var(--space-2) 0;
      font-family: var(--font-sans);
      font-weight: var(--font-semibold);
    }

    .event-details {
      color: var(--color-muted-foreground);
      margin: var(--space-2) 0 0 0;
      line-height: var(--leading-normal);
      font-family: var(--font-sans);
    }

    .actions {
      display: flex;
      gap: var(--space-4);
      margin-top: var(--space-8);
    }

    .actions .btn {
      flex: 1;
      text-align: center;
    }

    @media (max-width: 768px) {
      .header-section h1 {
        font-size: var(--text-3xl);
      }

      .search-form {
        flex-direction: column;
      }

      .info-row {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
      }

      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class PublicConsultarCasoPage {
  codigoSeguimiento = '';
  casoBuscado = false;
  casoEncontrado = false;
  validationMessage = '';

  estadoLabel: { [key: string]: string } = {
    registrado: 'Registrado',
    evaluacion: 'En Evaluación',
    atencion: 'En Atención',
    cerrado: 'Cerrado'
  };

  caso = {
    codigo: 'PD-ABC12345',
    alias: 'A-001',
    estado: 'atencion',
    riesgo: 'alto',
    fechaRegistro: '20 de mayo de 2026',
    eventos: [
      {
        titulo: 'Denuncia Registrada',
        descripcion: 'Tu denuncia fue recibida y registrada en el sistema.',
        fecha: '20 de mayo, 10:30 AM'
      },
      {
        titulo: 'Contacto Validado',
        descripcion: 'Un recepcionista se comunicó contigo para validar la información.',
        fecha: '20 de mayo, 3:15 PM'
      },
      {
        titulo: 'Caso Creado',
        descripcion: 'Se formalizó tu denuncia y se creó un expediente.',
        fecha: '21 de mayo, 9:00 AM'
      },
      {
        titulo: 'Evaluación de Riesgo',
        descripcion: 'Un especialista evaluó el nivel de riesgo de tu caso.',
        fecha: '21 de mayo, 11:30 AM'
      },
      {
        titulo: 'Asignación Profesional',
        descripcion: 'Se te asignó una psicóloga especializada.',
        fecha: '22 de mayo, 2:00 PM'
      }
    ],
    proximoEvento: {
      tipo: 'Cita Psicológica',
      fecha: '27 de mayo, 10:00 AM',
      detalles: 'Primera sesión con la Lic. María González'
    }
  };

  buscarCaso() {
    this.codigoSeguimiento = sanitizeCaseCode(this.codigoSeguimiento);
    this.validationMessage = '';
    if (!VALIDATION_PATTERNS.CASE_CODE.test(this.codigoSeguimiento)) {
      this.validationMessage = 'El código debe tener el formato PD-ABC12345.';
      this.casoBuscado = false;
      this.casoEncontrado = false;
      return;
    }
    // Simular búsqueda
    this.casoBuscado = true;
    // En una aplicación real, aquí haríamos una llamada a la API
    this.casoEncontrado = this.codigoSeguimiento.startsWith('PD-');
  }
}
