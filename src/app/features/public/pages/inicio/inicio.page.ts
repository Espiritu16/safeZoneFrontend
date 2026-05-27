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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
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
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      pointer-events: none;
    }

    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .hero-text h1 {
      font-size: 3.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }

    .hero-text h2 {
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 1.5rem 0;
      opacity: 0.95;
    }

    .hero-text p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      line-height: 1.8;
      opacity: 0.9;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .hero-visual {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-icon {
      font-size: 15rem;
      opacity: 0.3;
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-30px); }
    }

    .btn {
      padding: 1rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      display: inline-block;
      transition: all 0.3s;
      cursor: pointer;
    }

    .btn-large {
      padding: 1.2rem 2.5rem;
      font-size: 1.1rem;
    }

    .btn-primary {
      background: white;
      color: #667eea;
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid white;
    }

    .btn-secondary:hover {
      background: white;
      color: #667eea;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .features {
      padding: 4rem 2rem;
      background: #f8f9fa;
    }

    .features h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #333;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: all 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      font-size: 1.3rem;
      margin-bottom: 1rem;
      color: #333;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
    }

    .cta-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
      text-align: center;
    }

    .cta-section h2 {
      font-size: 2.2rem;
      margin-bottom: 1rem;
    }

    .cta-section p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      opacity: 0.95;
    }

    .emergency-contact {
      background: rgba(255, 255, 255, 0.1);
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      border: 2px solid white;
    }

    .emergency-contact h3 {
      font-size: 2rem;
      margin: 0 0 0.5rem 0;
    }

    .emergency-contact p {
      margin: 0;
      font-size: 1rem;
    }

    .info-section {
      padding: 4rem 2rem;
    }

    .info-section h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #333;
    }

    .info-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .info-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      text-decoration: none;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }

    .info-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.1);
      transition: left 0.3s;
    }

    .info-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .info-card:hover::before {
      left: 100%;
    }

    .info-card h3 {
      font-size: 1.3rem;
      margin-bottom: 1rem;
      position: relative;
      z-index: 1;
    }

    .info-card p {
      margin: 0;
      position: relative;
      z-index: 1;
    }

    .arrow {
      display: inline-block;
      margin-left: 0.5rem;
      transition: margin-left 0.3s;
    }

    .info-card:hover .arrow {
      margin-left: 1rem;
    }

    @media (max-width: 768px) {
      .hero {
        padding: 2rem;
        min-height: auto;
      }

      .hero-content {
        grid-template-columns: 1fr;
      }

      .hero-text h1 {
        font-size: 2.5rem;
      }

      .hero-text h2 {
        font-size: 1.5rem;
      }

      .hero-icon {
        font-size: 8rem;
      }

      .features h2,
      .info-section h2,
      .cta-section h2 {
        font-size: 1.8rem;
      }

      .hero-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class PublicInicioPage {}
