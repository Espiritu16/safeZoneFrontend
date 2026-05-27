import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-consultar-caso',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
                [(ngModel)]="codigoSeguimiento"
                placeholder="Ej: PD-ABC12345"
                class="search-input"
              >
              <button (click)="buscarCaso()" class="btn btn-primary">
                Buscar
              </button>
            </div>
            <p class="info-text">
              El código de seguimiento fue generado cuando enviaste tu denuncia.
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

    .search-box {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
      text-align: center;
    }

    .search-box h2 {
      color: #667eea;
      margin-top: 0;
    }

    .search-form {
      display: flex;
      gap: 1rem;
      margin: 2rem 0;
    }

    .search-input {
      flex: 1;
      padding: 1rem;
      border: 2px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
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

    .btn-secondary:hover {
      background: #d0d0d0;
    }

    .info-text {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
    }

    .no-result,
    .warning-icon {
      text-align: center;
      padding: 2rem;
      background: #fff3cd;
      border-radius: 12px;
      border: 2px solid #ffc107;
    }

    .warning-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .caso-info {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .caso-info h2 {
      color: #667eea;
      margin-top: 0;
    }

    .info-panel {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-row .label {
      font-weight: 600;
      color: #333;
    }

    .info-row .value {
      color: #667eea;
      font-weight: 600;
    }

    .estado-registrado {
      background: #e3f2fd;
      color: #1976d2;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }

    .estado-evaluacion {
      background: #fff3e0;
      color: #f57c00;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }

    .estado-atencion {
      background: #f3e5f5;
      color: #7b1fa2;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }

    .riesgo-bajo {
      background: #e8f5e9;
      color: #2e7d32;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }

    .riesgo-medio {
      background: #fff3e0;
      color: #f57c00;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }

    .riesgo-alto {
      background: #ffebee;
      color: #c62828;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }

    .riesgo-critico {
      background: #ffcdd2;
      color: #b71c1c;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: bold;
    }

    .timeline-section {
      margin: 2rem 0;
    }

    .timeline-section h3 {
      color: #667eea;
    }

    .timeline {
      position: relative;
      padding: 1rem 0;
    }

    .timeline-item {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
      position: relative;
    }

    .timeline-dot {
      width: 16px;
      height: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 0.25rem;
    }

    .timeline-content {
      flex: 1;
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
    }

    .timeline-content h4 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .timeline-content p {
      margin: 0 0 0.5rem 0;
      color: #666;
      line-height: 1.6;
    }

    .timeline-content small {
      color: #999;
    }

    .upcoming {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      padding: 2rem;
      border-radius: 12px;
      margin: 2rem 0;
      border-left: 4px solid #667eea;
    }

    .upcoming h3 {
      color: #667eea;
      margin-top: 0;
    }

    .upcoming-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .event-type {
      font-weight: 600;
      color: #667eea;
      margin: 0 0 0.5rem 0;
    }

    .event-date {
      font-size: 1.1rem;
      color: #333;
      margin: 0.5rem 0;
    }

    .event-details {
      color: #666;
      margin: 0.5rem 0 0 0;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .actions .btn {
      flex: 1;
      text-align: center;
    }

    @media (max-width: 768px) {
      .header-section h1 {
        font-size: 2rem;
      }

      .search-form {
        flex-direction: column;
      }

      .info-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
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
    // Simular búsqueda
    this.casoBuscado = true;
    // En una aplicación real, aquí haríamos una llamada a la API
    this.casoEncontrado = this.codigoSeguimiento.startsWith('PD-');
  }
}
