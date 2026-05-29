import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-informacion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="info-page">
      <!-- ─── Hero ───────────────────────────────────────────────── -->
      <section class="hero" aria-labelledby="info-hero-title">
        <div class="hero-bg" aria-hidden="true"></div>
        <div class="hero-container">
          <nav class="breadcrumb" aria-label="Ruta de navegación">
            <a routerLink="/public">Inicio</a>
            <span class="icon icon--sm" aria-hidden="true">chevron_right</span>
            <span aria-current="page">Información</span>
          </nav>

          <span class="hero-eyebrow">
            <span class="icon icon--sm" aria-hidden="true">menu_book</span>
            Centro de información
          </span>
          <h1 id="info-hero-title">Conoce tus derechos y cómo actuar</h1>
          <p class="hero-subtitle">
            Información clara y verificada sobre violencia familiar, derechos de las víctimas
            y el protocolo de atención que SafeZone aplica en cada caso.
          </p>

          <div class="hero-quick-links">
            <a href="#tipos-violencia" class="quick-link">
              <span class="icon icon--sm" aria-hidden="true">list_alt</span>
              Tipos de violencia
            </a>
            <a href="#derechos" class="quick-link">
              <span class="icon icon--sm" aria-hidden="true">gavel</span>
              Derechos
            </a>
            <a href="#protocolo" class="quick-link">
              <span class="icon icon--sm" aria-hidden="true">route</span>
              Protocolo
            </a>
            <a href="#recursos" class="quick-link">
              <span class="icon icon--sm" aria-hidden="true">contact_support</span>
              Recursos
            </a>
          </div>
        </div>
      </section>

      <!-- ─── Alerta de emergencia ───────────────────────────────── -->
      <section class="alert-band" aria-label="Línea de emergencia">
        <div class="container alert-content">
          <span class="alert-icon" aria-hidden="true">
            <span class="icon icon--md icon--filled">emergency</span>
          </span>
          <div class="alert-text">
            <strong>¿Estás en peligro inmediato?</strong>
            Llama gratis a la <a href="tel:1800-SAFEZONE">línea SafeZone&nbsp;1800-SAFEZONE</a>,
            disponible las 24 horas.
          </div>
          <a routerLink="/public/denuncias/nueva" class="alert-cta">
            Denunciar ahora
            <span class="icon icon--sm" aria-hidden="true">arrow_forward</span>
          </a>
        </div>
      </section>

      <!-- ─── Tipos de violencia + Derechos ──────────────────────── -->
      <section class="info-section" id="tipos-violencia">
        <div class="container">
          <div class="info-grid">
            <article class="info-card" aria-labelledby="tipos-title">
              <div class="info-card-head">
                <span class="info-card-badge" aria-hidden="true">
                  <span class="icon icon--md">list_alt</span>
                </span>
                <h2 id="tipos-title">Tipos de violencia familiar</h2>
              </div>
              <div class="info-card-body">
                <div class="info-item">
                  <h3>
                    <span class="icon icon--sm" aria-hidden="true">fitness_center</span>
                    Violencia física
                  </h3>
                  <p>Actos que causan daño corporal directo: golpes, jalones, empujones, quemaduras.</p>
                </div>
                <div class="info-item">
                  <h3>
                    <span class="icon icon--sm" aria-hidden="true">psychology_alt</span>
                    Violencia psicológica
                  </h3>
                  <p>Actos que generan daño emocional: insultos, amenazas, humillación, aislamiento.</p>
                </div>
                <div class="info-item">
                  <h3>
                    <span class="icon icon--sm" aria-hidden="true">no_adult_content</span>
                    Violencia sexual
                  </h3>
                  <p>Actos de naturaleza sexual sin consentimiento: abuso sexual, violación, acoso.</p>
                </div>
                <div class="info-item">
                  <h3>
                    <span class="icon icon--sm" aria-hidden="true">payments</span>
                    Violencia económica
                  </h3>
                  <p>Control de recursos económicos y negación de acceso a dinero o bienes.</p>
                </div>
              </div>
            </article>

            <article class="info-card info-card--accent" id="derechos" aria-labelledby="derechos-title">
              <div class="info-card-head">
                <span class="info-card-badge info-card-badge--accent" aria-hidden="true">
                  <span class="icon icon--md">gavel</span>
                </span>
                <h2 id="derechos-title">Derechos de las víctimas</h2>
              </div>
              <div class="info-card-body">
                <div class="info-item">
                  <h3>
                    <span class="icon icon--sm" aria-hidden="true">shield_person</span>
                    Derecho a la protección
                  </h3>
                  <p>Medidas de protección personal que eviten nuevas agresiones.</p>
                </div>
                <div class="info-item">
                  <h3>
                    <span class="icon icon--sm" aria-hidden="true">info</span>
                    Derecho a la información
                  </h3>
                  <p>Información clara sobre el estado de tu caso y tus opciones legales.</p>
                </div>
                <div class="info-item">
                  <h3>
                    <span class="icon icon--sm" aria-hidden="true">lock</span>
                    Derecho a la privacidad
                  </h3>
                  <p>Tu identidad y datos personales serán protegidos durante todo el proceso.</p>
                </div>
                <div class="info-item">
                  <h3>
                    <span class="icon icon--sm" aria-hidden="true">balance</span>
                    Derecho a asesoría legal
                  </h3>
                  <p>Acceso a representación legal gratuita para defender tus derechos.</p>
                </div>
                <div class="info-item">
                  <h3>
                    <span class="icon icon--sm" aria-hidden="true">healing</span>
                    Derecho a la reparación
                  </h3>
                  <p>Compensación por el daño sufrido cuando la ley lo establezca.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- ─── Protocolo de atención (timeline) ───────────────────── -->
      <section class="protocol" id="protocolo" aria-labelledby="protocolo-title">
        <div class="container">
          <header class="section-head">
            <span class="section-eyebrow">
              <span class="icon icon--sm" aria-hidden="true">route</span>
              Cómo trabajamos
            </span>
            <h2 id="protocolo-title">Protocolo de atención paso a paso</h2>
            <p class="section-lead">
              Desde tu primer reporte hasta el cierre del caso, así acompañamos cada situación.
            </p>
          </header>

          <ol class="timeline" role="list">
            <li class="timeline-item">
              <div class="timeline-marker" aria-hidden="true">
                <span class="timeline-number">1</span>
                <span class="timeline-icon"><span class="icon icon--sm">inbox</span></span>
              </div>
              <div class="timeline-content">
                <h3>Recepción de la denuncia</h3>
                <p>Tu reporte es recibido y registrado de forma confidencial en nuestro sistema.</p>
              </div>
            </li>
            <li class="timeline-item">
              <div class="timeline-marker" aria-hidden="true">
                <span class="timeline-number">2</span>
                <span class="timeline-icon"><span class="icon icon--sm">call</span></span>
              </div>
              <div class="timeline-content">
                <h3>Validación de contacto</h3>
                <p>Un recepcionista se comunica para validar tus datos y brindar apoyo inicial.</p>
              </div>
            </li>
            <li class="timeline-item">
              <div class="timeline-marker" aria-hidden="true">
                <span class="timeline-number">3</span>
                <span class="timeline-icon"><span class="icon icon--sm">folder_managed</span></span>
              </div>
              <div class="timeline-content">
                <h3>Creación del caso</h3>
                <p>Se formaliza tu denuncia y se crea un expediente con alias anónimo.</p>
              </div>
            </li>
            <li class="timeline-item">
              <div class="timeline-marker" aria-hidden="true">
                <span class="timeline-number">4</span>
                <span class="timeline-icon"><span class="icon icon--sm">crisis_alert</span></span>
              </div>
              <div class="timeline-content">
                <h3>Evaluación de riesgo</h3>
                <p>Un especialista evalúa el nivel de riesgo y define prioridades de atención.</p>
              </div>
            </li>
            <li class="timeline-item">
              <div class="timeline-marker" aria-hidden="true">
                <span class="timeline-number">5</span>
                <span class="timeline-icon"><span class="icon icon--sm">group_add</span></span>
              </div>
              <div class="timeline-content">
                <h3>Asignación profesional</h3>
                <p>Se asigna psicólogo y/o defensor legal según las necesidades de tu caso.</p>
              </div>
            </li>
            <li class="timeline-item">
              <div class="timeline-marker" aria-hidden="true">
                <span class="timeline-number">6</span>
                <span class="timeline-icon"><span class="icon icon--sm">monitor_heart</span></span>
              </div>
              <div class="timeline-content">
                <h3>Seguimiento continuo</h3>
                <p>Recibes atención especializada hasta la resolución del caso.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <!-- ─── Recursos y enlaces útiles ──────────────────────────── -->
      <section class="resources" id="recursos" aria-labelledby="recursos-title">
        <div class="container">
          <header class="section-head section-head--center">
            <span class="section-eyebrow">
              <span class="icon icon--sm" aria-hidden="true">contact_support</span>
              Recursos
            </span>
            <h2 id="recursos-title">Recursos y enlaces útiles</h2>
            <p class="section-lead">Líneas oficiales, instituciones de apoyo y documentos clave.</p>
          </header>

          <div class="resources-grid">
            <article class="resource-card">
              <header class="resource-head">
                <span class="resource-icon" aria-hidden="true">
                  <span class="icon icon--md icon--filled">support_agent</span>
                </span>
                <h3>Líneas de ayuda</h3>
              </header>
              <ul>
                <li>
                  <span class="icon icon--sm" aria-hidden="true">verified</span>
                  <a href="tel:1800-SAFEZONE">SafeZone&nbsp;<strong>1800-SAFEZONE</strong></a>
                </li>
                <li>
                  <span class="icon icon--sm" aria-hidden="true">call</span>
                  <a href="tel:100">MIMP Línea&nbsp;<strong>100</strong></a>
                </li>
                <li>
                  <span class="icon icon--sm" aria-hidden="true">local_police</span>
                  <a href="tel:105">Policía Nacional&nbsp;<strong>105</strong></a>
                </li>
              </ul>
            </article>

            <article class="resource-card">
              <header class="resource-head">
                <span class="resource-icon" aria-hidden="true">
                  <span class="icon icon--md icon--filled">domain</span>
                </span>
                <h3>Instituciones de apoyo</h3>
              </header>
              <ul>
                <li>
                  <span class="icon icon--sm" aria-hidden="true">chevron_right</span>
                  MIMP — Ministerio de la Mujer
                </li>
                <li>
                  <span class="icon icon--sm" aria-hidden="true">chevron_right</span>
                  Poder Judicial — Juzgados de Familia
                </li>
                <li>
                  <span class="icon icon--sm" aria-hidden="true">chevron_right</span>
                  PNP — Especializada en violencia
                </li>
              </ul>
            </article>

            <article class="resource-card">
              <header class="resource-head">
                <span class="resource-icon" aria-hidden="true">
                  <span class="icon icon--md icon--filled">menu_book</span>
                </span>
                <h3>Documentos útiles</h3>
              </header>
              <ul>
                <li>
                  <span class="icon icon--sm" aria-hidden="true">description</span>
                  Ley 30364 — Violencia familiar
                </li>
                <li>
                  <span class="icon icon--sm" aria-hidden="true">description</span>
                  Guía de derechos
                </li>
                <li>
                  <span class="icon icon--sm" aria-hidden="true">description</span>
                  Formulario de denuncia
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <!-- ─── CTA final ─────────────────────────────────────────── -->
      <section class="cta-final" aria-labelledby="cta-title">
        <div class="container cta-wrapper">
          <div class="cta-text">
            <h2 id="cta-title">¿Necesitas dar el primer paso?</h2>
            <p>Tu denuncia es confidencial y será atendida por personal especializado.</p>
          </div>
          <div class="cta-actions">
            <a routerLink="/public/denuncias/nueva" class="btn btn-primary">
              <span class="icon icon--sm" aria-hidden="true">shield_lock</span>
              Iniciar denuncia
            </a>
            <a routerLink="/public/contacto" class="btn btn-ghost">
              <span class="icon icon--sm" aria-hidden="true">forum</span>
              Otras formas de contacto
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`

    .info-page { width: 100%; }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--space-6);
    }

    /* ─── HERO ───────────────────────────────────────────────────── */
    .hero {
      position: relative;
      background: linear-gradient(135deg, #0F1E3F 0%, var(--color-primary) 60%, #2c4d9f 100%);
      color: #fff;
      padding: var(--space-16) var(--space-6) var(--space-12);
      overflow: hidden;
      isolation: isolate;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      z-index: -1;
      background-image:
        radial-gradient(circle at 18% 20%, rgba(245, 158, 11, 0.18) 0%, transparent 38%),
        radial-gradient(circle at 88% 78%, rgba(255, 255, 255, 0.10) 0%, transparent 42%),
        repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 18px);
    }
    .hero-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .breadcrumb {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: var(--space-6);
    }
    .breadcrumb a {
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-sm);
      transition: background var(--duration-fast) var(--ease-in-out);
    }
    .breadcrumb a:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }
    .breadcrumb a:focus-visible {
      outline: 2px solid var(--color-accent-lighter);
      outline-offset: 2px;
    }
    .breadcrumb .icon { color: rgba(255, 255, 255, 0.5); }
    .breadcrumb [aria-current="page"] { color: #fff; font-weight: var(--font-semibold); }

    .hero-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.35);
      color: var(--color-accent-lighter);
      border-radius: var(--radius-full);
      font-family: var(--font-sans);
      font-size: var(--text-xs);
      font-weight: var(--font-bold);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: var(--space-5);
    }

    .hero h1 {
      font-family: var(--font-serif);
      font-size: clamp(2rem, 4vw, var(--text-5xl));
      font-weight: var(--font-bold);
      line-height: 1.1;
      letter-spacing: var(--tracking-tight);
      margin: 0 0 var(--space-4) 0;
      color: #fff;
      max-width: 780px;
    }
    .hero-subtitle {
      font-family: var(--font-sans);
      font-size: var(--text-lg);
      line-height: var(--leading-relaxed);
      color: rgba(255, 255, 255, 0.88);
      margin: 0 0 var(--space-8) 0;
      max-width: 680px;
    }

    .hero-quick-links {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }
    .quick-link {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: var(--radius-full);
      text-decoration: none;
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      min-height: 40px;
      transition: background var(--duration-fast) var(--ease-in-out),
                  border-color var(--duration-fast) var(--ease-in-out),
                  transform var(--duration-fast) var(--ease-in-out);
    }
    .quick-link:hover {
      background: rgba(255, 255, 255, 0.14);
      border-color: var(--color-accent-lighter);
      transform: translateY(-1px);
    }
    .quick-link:focus-visible {
      outline: 2px solid var(--color-accent-lighter);
      outline-offset: 2px;
    }
    .quick-link .icon { color: var(--color-accent-lighter); }

    /* ─── ALERT BAND ─────────────────────────────────────────────── */
    .alert-band {
      background: linear-gradient(90deg, #fef3c7 0%, #ffedd5 100%);
      border-top: 1px solid #f59e0b33;
      border-bottom: 1px solid #f59e0b33;
    }
    .alert-content {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding-top: var(--space-4);
      padding-bottom: var(--space-4);
      flex-wrap: wrap;
    }
    .alert-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      background: var(--color-destructive);
      color: #fff;
      flex-shrink: 0;
      box-shadow: 0 4px 10px -3px rgba(220, 38, 38, 0.5);
    }
    .alert-text {
      flex: 1;
      min-width: 240px;
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      color: var(--color-foreground);
      line-height: var(--leading-relaxed);
    }
    .alert-text strong {
      display: inline-block;
      margin-right: var(--space-2);
      color: var(--color-destructive-dark);
    }
    .alert-text a {
      color: var(--color-destructive-dark);
      font-weight: var(--font-bold);
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .alert-text a:focus-visible {
      outline: 2px solid var(--color-destructive);
      outline-offset: 2px;
      border-radius: var(--radius-sm);
    }
    .alert-cta {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      background: var(--color-destructive);
      color: #fff;
      text-decoration: none;
      border-radius: var(--radius-base);
      font-family: var(--font-sans);
      font-weight: var(--font-semibold);
      font-size: var(--text-sm);
      min-height: 44px;
      transition: background var(--duration-fast) var(--ease-in-out),
                  transform var(--duration-fast) var(--ease-in-out),
                  box-shadow var(--duration-fast) var(--ease-in-out);
    }
    .alert-cta:hover {
      background: var(--color-destructive-dark);
      transform: translateY(-1px);
      box-shadow: 0 8px 18px -4px rgba(220, 38, 38, 0.5);
    }
    .alert-cta:focus-visible {
      outline: 2px solid var(--color-destructive);
      outline-offset: 3px;
    }

    /* ─── INFO CARDS ─────────────────────────────────────────────── */
    .info-section {
      padding: var(--space-16) var(--space-6);
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: var(--space-8);
    }
    .info-card {
      background: #fff;
      border-radius: var(--radius-lg);
      padding: var(--space-8);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      transition: transform var(--duration-base) var(--ease-in-out),
                  box-shadow var(--duration-base) var(--ease-in-out);
    }
    .info-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
    }
    .info-card--accent { border-top: 4px solid var(--color-accent); }

    .info-card-head {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      margin-bottom: var(--space-6);
      padding-bottom: var(--space-5);
      border-bottom: 1px solid var(--color-border);
    }
    .info-card-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: rgba(30, 58, 138, 0.08);
      color: var(--color-primary);
      flex-shrink: 0;
    }
    .info-card-badge--accent {
      background: rgba(180, 83, 9, 0.1);
      color: var(--color-accent-dark);
    }
    .info-card h2 {
      margin: 0;
      font-family: var(--font-serif);
      font-weight: var(--font-bold);
      font-size: var(--text-2xl);
      color: var(--color-primary-dark);
      line-height: 1.2;
    }
    .info-card-body {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }
    .info-item h3 {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin: 0 0 var(--space-1) 0;
      font-family: var(--font-serif);
      font-weight: var(--font-semibold);
      font-size: var(--text-lg);
      color: var(--color-foreground);
    }
    .info-item h3 .icon { color: var(--color-primary); }
    .info-card--accent .info-item h3 .icon { color: var(--color-accent-dark); }
    .info-item p {
      margin: 0;
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      line-height: var(--leading-relaxed);
      color: var(--color-muted-foreground);
    }

    /* ─── PROTOCOL / TIMELINE ────────────────────────────────────── */
    .protocol {
      padding: var(--space-16) var(--space-6);
      background:
        linear-gradient(180deg, var(--color-muted) 0%, #ffffff 100%);
    }

    .section-head { margin-bottom: var(--space-12); max-width: 700px; }
    .section-head--center {
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    }
    .section-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-1) var(--space-3);
      background: rgba(30, 58, 138, 0.08);
      color: var(--color-primary);
      border-radius: var(--radius-full);
      font-family: var(--font-sans);
      font-size: var(--text-xs);
      font-weight: var(--font-bold);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: var(--space-4);
    }
    .section-head h2 {
      margin: 0 0 var(--space-3) 0;
      font-family: var(--font-serif);
      font-weight: var(--font-bold);
      font-size: clamp(1.75rem, 3vw, var(--text-4xl));
      color: var(--color-primary-dark);
      letter-spacing: var(--tracking-tight);
      line-height: 1.15;
    }
    .section-lead {
      margin: 0;
      font-family: var(--font-sans);
      font-size: var(--text-lg);
      color: var(--color-muted-foreground);
      line-height: var(--leading-relaxed);
    }

    .timeline {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: var(--space-6);
      position: relative;
    }

    .timeline-item {
      display: grid;
      grid-template-columns: 88px 1fr;
      gap: var(--space-6);
      align-items: start;
      position: relative;
    }
    .timeline-item:not(:last-child)::before {
      content: '';
      position: absolute;
      left: 43px;
      top: 88px;
      bottom: -24px;
      width: 2px;
      background: linear-gradient(180deg, var(--color-primary) 0%, transparent 100%);
      opacity: 0.35;
    }

    .timeline-marker {
      position: relative;
      width: 88px;
      height: 88px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .timeline-number {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-serif);
      font-weight: var(--font-bold);
      font-size: var(--text-2xl);
      box-shadow: 0 8px 20px -8px rgba(15, 30, 63, 0.5);
    }
    .timeline-icon {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 30px;
      height: 30px;
      border-radius: var(--radius-full);
      background: var(--color-accent);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #fff;
    }

    .timeline-content {
      background: #fff;
      padding: var(--space-5) var(--space-6);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-xs);
    }
    .timeline-content h3 {
      margin: 0 0 var(--space-2) 0;
      font-family: var(--font-serif);
      font-weight: var(--font-semibold);
      font-size: var(--text-xl);
      color: var(--color-primary-dark);
    }
    .timeline-content p {
      margin: 0;
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      line-height: var(--leading-relaxed);
      color: var(--color-muted-foreground);
    }

    /* ─── RESOURCES ──────────────────────────────────────────────── */
    .resources {
      padding: var(--space-16) var(--space-6);
      background: #fff;
    }
    .resources-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--space-6);
    }
    .resource-card {
      background: var(--color-background);
      padding: var(--space-6);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      transition: transform var(--duration-base) var(--ease-in-out),
                  box-shadow var(--duration-base) var(--ease-in-out),
                  border-color var(--duration-base) var(--ease-in-out);
    }
    .resource-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
      border-color: var(--color-primary);
    }
    .resource-head {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }
    .resource-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .resource-card h3 {
      margin: 0;
      font-family: var(--font-serif);
      font-weight: var(--font-bold);
      font-size: var(--text-lg);
      color: var(--color-primary-dark);
    }
    .resource-card ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    .resource-card li {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      color: var(--color-foreground-secondary);
      line-height: var(--leading-normal);
      padding: var(--space-1) 0;
    }
    .resource-card li .icon { color: var(--color-accent); flex-shrink: 0; }
    .resource-card a {
      color: var(--color-foreground-secondary);
      text-decoration: none;
      transition: color var(--duration-fast) var(--ease-in-out);
    }
    .resource-card a:hover { color: var(--color-primary); text-decoration: underline; text-underline-offset: 3px; }
    .resource-card a:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
      border-radius: var(--radius-sm);
    }

    /* ─── CTA FINAL ──────────────────────────────────────────────── */
    .cta-final {
      padding: var(--space-12) var(--space-6);
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
      color: #fff;
    }
    .cta-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-8);
      flex-wrap: wrap;
    }
    .cta-text {
      flex: 1;
      min-width: 280px;
    }
    .cta-text h2 {
      margin: 0 0 var(--space-2) 0;
      font-family: var(--font-serif);
      font-weight: var(--font-bold);
      font-size: var(--text-3xl);
      color: #fff;
    }
    .cta-text p {
      margin: 0;
      font-family: var(--font-sans);
      font-size: var(--text-base);
      color: rgba(255, 255, 255, 0.85);
    }
    .cta-actions {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-5);
      min-height: 48px;
      border-radius: var(--radius-md);
      font-family: var(--font-sans);
      font-size: var(--text-base);
      font-weight: var(--font-semibold);
      text-decoration: none;
      border: 1px solid transparent;
      cursor: pointer;
      transition: transform var(--duration-fast) var(--ease-in-out),
                  background var(--duration-fast) var(--ease-in-out),
                  box-shadow var(--duration-fast) var(--ease-in-out),
                  border-color var(--duration-fast) var(--ease-in-out);
    }
    .btn:focus-visible {
      outline: 2px solid var(--color-accent-lighter);
      outline-offset: 3px;
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
      color: #fff;
      box-shadow: 0 6px 16px -4px rgba(180, 83, 9, 0.6);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 24px -6px rgba(180, 83, 9, 0.55); }
    .btn-ghost {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.3);
    }
    .btn-ghost:hover {
      background: rgba(255, 255, 255, 0.16);
      border-color: rgba(255, 255, 255, 0.5);
    }

    /* ─── Responsive ─────────────────────────────────────────────── */
    @media (max-width: 768px) {
      .hero { padding: var(--space-12) var(--space-4) var(--space-10); }
      .alert-content { padding: var(--space-3) 0; }
      .alert-cta { width: 100%; justify-content: center; }
      .info-section, .protocol, .resources { padding: var(--space-12) var(--space-4); }
      .info-grid { grid-template-columns: 1fr; gap: var(--space-6); }
      .info-card { padding: var(--space-6); }
      .timeline-item {
        grid-template-columns: 68px 1fr;
        gap: var(--space-4);
      }
      .timeline-marker { width: 68px; height: 68px; }
      .timeline-number { width: 52px; height: 52px; font-size: var(--text-xl); }
      .timeline-icon { width: 26px; height: 26px; }
      .timeline-item:not(:last-child)::before { left: 33px; top: 68px; }
      .cta-wrapper { flex-direction: column; align-items: stretch; }
      .cta-actions { flex-direction: column; }
      .cta-actions .btn { width: 100%; }
    }

    @media (max-width: 480px) {
      .hero h1 { font-size: var(--text-3xl); }
      .hero-subtitle { font-size: var(--text-base); }
      .info-card-head { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class PublicInformacionPage {}
