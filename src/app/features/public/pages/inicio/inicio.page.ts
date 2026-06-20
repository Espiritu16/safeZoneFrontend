import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1>SafeZone</h1>
          <h2>Plataforma de Denuncias y Protección</h2>
          <p>
            Un espacio seguro, confidencial y accesible para denunciar casos de violencia familiar
            y obtener seguimiento profesional especializado.
          </p>
          <div class="hero-actions">
            <a routerLink="/public/denuncias/nueva" class="btn btn-large btn-primary">
              Denunciar Ahora
            </a>
            <a routerLink="/public/denuncias/consultar" class="btn btn-large btn-secondary">
              Consultar Mi Caso
            </a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-icon">🛡️</div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2>¿Cómo funcionamos?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📋</div>
            <h3>Denuncia Confidencial</h3>
            <p>
              Registra tu denuncia de forma segura y anónima. Generamos un alias para proteger
              tu identidad durante todo el proceso.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>Atención Profesional</h3>
            <p>
              Un equipo de psicólogos y defensores legales especializados brindará seguimiento
              personalizado a tu caso.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Protección Integral</h3>
            <p>
              Trabajamos coordinadamente con instituciones para asegurar tu protección y la
              aplicación de medidas legales necesarias.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Seguimiento 24/7</h3>
            <p>
              Consulta el estado de tu caso en cualquier momento. Línea de ayuda disponible
              permanentemente para emergencias.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <h2>¿Necesitas ayuda inmediata?</h2>
        <p>Si estás en peligro, comunícate con la línea de emergencia:</p>
        <div class="emergency-contact">
          <h3>📞 1800-SAFEZONE</h3>
          <p>Disponible 24 horas</p>
        </div>
        <a routerLink="/public/contacto" class="btn btn-primary">
          Más formas de contactarnos
        </a>
      </div>
    </section>

    <section class="info-section">
      <div class="container">
        <h2>Información Importante</h2>
        <div class="info-cards">
          <a routerLink="/public/informacion/tipos-violencia" class="info-card">
            <h3>Tipos de Violencia</h3>
            <p>Conoce qué se considera violencia familiar y cómo identificarla.</p>
            <span class="arrow">→</span>
          </a>

          <a routerLink="/public/informacion/derechos" class="info-card">
            <h3>Derechos de las Víctimas</h3>
            <p>Aprende cuáles son tus derechos ante la ley y las instituciones.</p>
            <span class="arrow">→</span>
          </a>

          <a routerLink="/public/faq" class="info-card">
            <h3>Preguntas Frecuentes</h3>
            <p>Resuelve tus dudas sobre cómo funciona SafeZone y el proceso.</p>
            <span class="arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`

    .hero {
      background-color: var(--color-primary);
      color: var(--color-on-primary);
      padding: var(--space-16) var(--space-6);
      min-height: 600px;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 500px;
      height: 500px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: var(--radius-full);
      pointer-events: none;
    }

    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-16);
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .hero-text h1 {
      font-size: var(--text-5xl);
      font-weight: var(--font-bold);
      margin: 0 0 var(--space-2) 0;
      font-family: inherit;
    }

    .hero-text h2 {
      font-size: var(--text-3xl);
      font-weight: var(--font-semibold);
      margin: 0 0 var(--space-6) 0;
      opacity: 0.95;
      font-family: inherit;
    }

    .hero-text p {
      font-size: var(--text-lg);
      margin-bottom: var(--space-8);
      line-height: var(--leading-relaxed);
      opacity: 0.9;
      font-family: inherit;
    }

    .hero-actions {
      display: flex;
      gap: var(--space-4);
      flex-wrap: wrap;
    }

    .hero-visual {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-icon {
      font-size: 15rem;
      opacity: 0.2;
      animation: float var(--duration-slow) ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-30px); }
    }

    .btn {
      padding: var(--space-4) var(--space-6);
      border-radius: var(--radius-md);
      text-decoration: none;
      font-weight: var(--font-semibold);
      display: inline-block;
      transition: all var(--duration-base) var(--ease-in-out);
      cursor: pointer;
      border: none;
      font-family: inherit;
      min-height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn:focus-visible {
      outline: 2px solid var(--color-ring);
      outline-offset: 2px;
    }

    .btn-large {
      padding: var(--space-5) var(--space-8);
      font-size: var(--text-lg);
    }

    .btn-primary {
      background-color: var(--color-accent);
      color: white;
    }

    .btn-primary:hover {
      background-color: var(--color-accent-light);
      transform: translateY(-3px);
      box-shadow: var(--shadow-lg);
    }

    .btn-secondary {
      background-color: rgba(255, 255, 255, 0.15);
      color: var(--color-on-primary);
      border: 2px solid var(--color-on-primary);
    }

    .btn-secondary:hover {
      background-color: var(--color-accent);
      color: white;
      border-color: var(--color-accent);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--space-6);
    }

    .features {
      padding: var(--space-16) var(--space-6);
      background: var(--color-background);
    }

    .features h2 {
      text-align: center;
      font-size: var(--text-4xl);
      margin-bottom: var(--space-12);
      color: var(--color-foreground);
      font-family: inherit;
      font-weight: var(--font-bold);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-8);
    }

    .feature-card {
      background: var(--color-background);
      padding: var(--space-8);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      text-align: center;
      transition: all var(--duration-base) var(--ease-in-out);
      border: 1px solid var(--color-border);
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-lg);
      border-color: var(--color-primary);
    }

    .feature-icon {
      font-size: var(--text-5xl);
      margin-bottom: var(--space-4);
    }

    .feature-card h3 {
      font-size: var(--text-xl);
      margin-bottom: var(--space-4);
      color: var(--color-foreground);
      font-family: inherit;
      font-weight: var(--font-semibold);
    }

    .feature-card p {
      color: var(--color-muted-foreground);
      line-height: var(--leading-relaxed);
      font-family: inherit;
    }

    .cta-section {
      background-color: var(--color-primary);
      color: var(--color-on-primary);
      padding: var(--space-16) var(--space-6);
      text-align: center;
    }

    .cta-section h2 {
      font-size: var(--text-4xl);
      margin-bottom: var(--space-4);
      font-family: inherit;
      font-weight: var(--font-bold);
    }

    .cta-section p {
      font-size: var(--text-lg);
      margin-bottom: var(--space-8);
      opacity: 0.95;
      font-family: inherit;
    }

    .emergency-contact {
      background: rgba(255, 255, 255, 0.1);
      padding: var(--space-8);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-8);
      border: 2px solid var(--color-accent);
    }

    .emergency-contact h3 {
      font-size: var(--text-3xl);
      margin: 0 0 var(--space-2) 0;
      font-family: inherit;
      font-weight: var(--font-bold);
      color: var(--color-accent);
    }

    .emergency-contact p {
      margin: 0;
      font-size: var(--text-base);
      font-family: inherit;
    }

    .info-section {
      padding: var(--space-16) var(--space-6);
    }

    .info-section h2 {
      text-align: center;
      font-size: var(--text-4xl);
      margin-bottom: var(--space-12);
      color: var(--color-foreground);
      font-family: inherit;
      font-weight: var(--font-bold);
    }

    .info-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-8);
    }

    .info-card {
      background-color: var(--color-primary);
      color: var(--color-on-primary);
      padding: var(--space-8);
      border-radius: var(--radius-lg);
      text-decoration: none;
      transition: all var(--duration-base) var(--ease-in-out);
      position: relative;
      overflow: hidden;
      border: 1px solid var(--color-primary-light);
    }

    .info-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: var(--color-accent);
      opacity: 0.1;
      transition: left var(--duration-base) var(--ease-in-out);
    }

    .info-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-lg);
      border-color: var(--color-accent);
    }

    .info-card:hover::before {
      left: 100%;
    }

    .info-card:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }

    .info-card h3 {
      font-size: var(--text-xl);
      margin-bottom: var(--space-4);
      position: relative;
      z-index: 1;
      font-family: inherit;
      font-weight: var(--font-semibold);
    }

    .info-card p {
      margin: 0;
      position: relative;
      z-index: 1;
      font-family: inherit;
    }

    .arrow {
      display: inline-block;
      margin-left: var(--space-2);
      transition: margin-left var(--duration-base) var(--ease-in-out);
    }

    .info-card:hover .arrow {
      margin-left: var(--space-4);
    }

    @media (max-width: 768px) {
      .hero {
        padding: var(--space-8) var(--space-4);
        min-height: auto;
      }

      .hero-content {
        grid-template-columns: 1fr;
        gap: var(--space-8);
      }

      .hero-text h1 {
        font-size: var(--text-4xl);
      }

      .hero-text h2 {
        font-size: var(--text-2xl);
      }

      .hero-icon {
        font-size: 8rem;
      }

      .features h2,
      .info-section h2,
      .cta-section h2 {
        font-size: var(--text-3xl);
      }

      .hero-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class PublicInicioPage {}
