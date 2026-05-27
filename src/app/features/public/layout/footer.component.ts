import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="public-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>SafeZone</h4>
          <p>Plataforma de denuncias y seguimiento de casos de violencia familiar.</p>
          <div class="social-links">
            <a href="#" title="Facebook" aria-label="Facebook">f</a>
            <a href="#" title="WhatsApp" aria-label="WhatsApp">W</a>
            <a href="#" title="Twitter" aria-label="Twitter">𝕏</a>
          </div>
        </div>

        <div class="footer-section">
          <h5>Navegación</h5>
          <ul>
            <li><a routerLink="/">Inicio</a></li>
            <li><a routerLink="/public/nosotros">Nosotros</a></li>
            <li><a routerLink="/public/informacion">Información</a></li>
            <li><a routerLink="/public/contacto">Contacto</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h5>Recursos</h5>
          <ul>
            <li><a routerLink="/public/faq">Preguntas Frecuentes</a></li>
            <li><a routerLink="/public/politicas/privacidad">Privacidad</a></li>
            <li><a routerLink="/public/politicas/terminos">Términos</a></li>
            <li><a routerLink="/public/politicas/seguridad">Seguridad</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h5>Línea de Ayuda</h5>
          <p class="help-line">
            <strong>1800-SAFEZONE</strong>
            <br>
            24/7 - Disponible
          </p>
          <p class="email">
            contacto@safezone.pe
          </p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 SafeZone. Todos los derechos reservados.</p>
        <p>Desarrollado por el equipo de Ingeniería de Sistemas - UTP</p>
      </div>
    </footer>
  `,
  styles: [`
    .public-footer {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #e0e0e0;
      padding: 3rem 2rem 1rem;
      margin-top: 5rem;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-section h4,
    .footer-section h5 {
      color: white;
      margin-bottom: 1rem;
      font-size: 1rem;
    }

    .footer-section h4 {
      font-size: 1.3rem;
    }

    .footer-section p {
      margin: 0.5rem 0;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-section li {
      margin: 0.5rem 0;
    }

    .footer-section a {
      color: #e0e0e0;
      text-decoration: none;
      transition: color 0.3s;
      font-size: 0.9rem;
    }

    .footer-section a:hover {
      color: #667eea;
    }

    .social-links {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .social-links a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: rgba(102, 126, 234, 0.2);
      border-radius: 50%;
      color: #667eea;
      font-weight: bold;
    }

    .social-links a:hover {
      background: #667eea;
      color: white;
    }

    .help-line {
      font-weight: 600;
      color: #667eea;
    }

    .email {
      color: #e0e0e0;
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
      font-size: 0.85rem;
      color: #888;
    }

    .footer-bottom p {
      margin: 0.5rem 0;
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
      }

      .footer-section {
        text-align: center;
      }

      .social-links {
        justify-content: center;
      }
    }
  `]
})
export class PublicFooterComponent {}
