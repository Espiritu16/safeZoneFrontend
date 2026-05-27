import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-informacion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="informacion-container">
      <section class="header-section">
        <h1>Centro de Información</h1>
        <p class="subtitle">Aprende sobre violencia familiar y tus derechos</p>
      </section>

      <section class="content-section">
        <div class="container">
          <div class="info-grid">
            <div class="info-card">
              <h2>📋 Tipos de Violencia Familiar</h2>
              <div class="info-content">
                <h3>Violencia Física</h3>
                <p>Actos que causan daño corporal directo. Incluye: golpes, jalones, empujones, quemaduras.</p>

                <h3>Violencia Psicológica</h3>
                <p>Actos que generan daño emocional. Incluye: insultos, amenazas, humillación, aislamiento.</p>

                <h3>Violencia Sexual</h3>
                <p>Actos de naturaleza sexual sin consentimiento. Incluye: abuso sexual, violación, acoso.</p>

                <h3>Violencia Económica</h3>
                <p>Control de recursos económicos y negación de acceso a dinero o bienes.</p>
              </div>
            </div>

            <div class="info-card">
              <h2>⚖️ Derechos de las Víctimas</h2>
              <div class="info-content">
                <h3>Derecho a la Protección</h3>
                <p>Tienes derecho a medidas de protección personal que eviten nuevas agresiones.</p>

                <h3>Derecho a la Información</h3>
                <p>Derecho a recibir información clara sobre el estado de tu caso y tus opciones legales.</p>

                <h3>Derecho a la Privacidad</h3>
                <p>Tu identidad y datos personales serán protegidos durante todo el proceso.</p>

                <h3>Derecho a Asesoría Legal</h3>
                <p>Acceso a representación legal gratuita para defender tus derechos.</p>

                <h3>Derecho a la Reparación</h3>
                <p>Derecho a recibir compensación por el daño sufrido cuando la ley lo establezca.</p>
              </div>
            </div>
          </div>

          <div class="protocol-section">
            <h2>Protocolo de Atención</h2>
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-number">1</div>
                <h3>Recepción de Denuncia</h3>
                <p>Tu reporte es recibido y registrado en nuestro sistema de forma confidencial.</p>
              </div>

              <div class="timeline-item">
                <div class="timeline-number">2</div>
                <h3>Validación de Contacto</h3>
                <p>Un recepcionista se comunica para validar tus datos y brindar apoyo inicial.</p>
              </div>

              <div class="timeline-item">
                <div class="timeline-number">3</div>
                <h3>Creación de Caso</h3>
                <p>Se formaliza tu denuncia y se crea un expediente con alias anónimo.</p>
              </div>

              <div class="timeline-item">
                <div class="timeline-number">4</div>
                <h3>Evaluación de Riesgo</h3>
                <p>Un especialista evalúa el nivel de riesgo y define prioridades de atención.</p>
              </div>

              <div class="timeline-item">
                <div class="timeline-number">5</div>
                <h3>Asignación Profesional</h3>
                <p>Se asigna psicólogo y/o defensor legal según las necesidades de tu caso.</p>
              </div>

              <div class="timeline-item">
                <div class="timeline-number">6</div>
                <h3>Seguimiento Continuo</h3>
                <p>Recibes atención especializada y seguimiento de tu caso hasta su resolución.</p>
              </div>
            </div>
          </div>

          <div class="resources-section">
            <h2>Recursos y Enlaces Útiles</h2>
            <div class="resources-grid">
              <div class="resource-item">
                <h3>📞 Líneas de Ayuda</h3>
                <ul>
                  <li>SafeZone: 1800-SAFEZONE</li>
                  <li>MIMP Línea 100: 100</li>
                  <li>Policía Nacional: 105</li>
                </ul>
              </div>

              <div class="resource-item">
                <h3>🏥 Instituciones de Apoyo</h3>
                <ul>
                  <li>MIMP - Ministerio de la Mujer</li>
                  <li>Poder Judicial - Juzgados de Familia</li>
                  <li>PNP - Especializada en Violencia</li>
                </ul>
              </div>

              <div class="resource-item">
                <h3>📚 Documentos Útiles</h3>
                <ul>
                  <li>Ley 30364 - Violencia Familiar</li>
                  <li>Guía de Derechos</li>
                  <li>Formulario de Denuncia</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .informacion-container {
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

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .info-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #667eea;
    }

    .info-card h2 {
      margin-top: 0;
      color: #667eea;
      font-size: 1.5rem;
    }

    .info-content h3 {
      color: #333;
      font-size: 1.1rem;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .info-content h3:first-child {
      margin-top: 0;
    }

    .info-content p {
      color: #666;
      margin: 0 0 1rem 0;
      line-height: 1.6;
    }

    .protocol-section {
      background: #f8f9fa;
      padding: 3rem;
      border-radius: 12px;
      margin-bottom: 4rem;
    }

    .protocol-section h2 {
      text-align: center;
      font-size: 2rem;
      margin-top: 0;
      margin-bottom: 3rem;
      color: #333;
    }

    .timeline {
      display: grid;
      gap: 2rem;
    }

    .timeline-item {
      display: grid;
      grid-template-columns: 60px 1fr;
      gap: 2rem;
      align-items: flex-start;
    }

    .timeline-number {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .timeline-item h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .timeline-item p {
      margin: 0;
      color: #666;
      line-height: 1.6;
    }

    .resources-section h2 {
      text-align: center;
      font-size: 2rem;
      margin-bottom: 2rem;
      color: #333;
    }

    .resources-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .resource-item {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .resource-item h3 {
      color: #667eea;
      margin-top: 0;
    }

    .resource-item ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .resource-item li {
      padding: 0.5rem 0;
      color: #666;
      padding-left: 1.5rem;
      position: relative;
    }

    .resource-item li::before {
      content: '▸';
      position: absolute;
      left: 0;
      color: #667eea;
      font-weight: bold;
    }

    @media (max-width: 768px) {
      .header-section h1 {
        font-size: 2rem;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .timeline-item {
        grid-template-columns: 50px 1fr;
        gap: 1rem;
      }

      .timeline-number {
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
      }
    }
  `]
})
export class PublicInformacionPage {}
