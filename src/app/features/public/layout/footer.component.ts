import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="public-footer" role="contentinfo">
      <div class="footer-container">
        <div class="footer-grid">
          <!-- Brand + Misión + Redes -->
          <div class="footer-section footer-brand">
            <a routerLink="/public" class="brand-link" aria-label="SafeZone, ir al inicio">
              <span class="brand-mark" aria-hidden="true">
                <span class="icon icon--lg icon--filled">verified_user</span>
              </span>
              <span class="brand-text">SafeZone</span>
            </a>
            <p class="brand-desc">
              Plataforma confidencial para denunciar y dar seguimiento profesional
              a casos de violencia familiar. Tu seguridad es nuestra prioridad.
            </p>

            <div class="social-links" aria-label="Redes sociales">
              <a href="#" aria-label="SafeZone en Facebook" title="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" aria-label="SafeZone en WhatsApp" title="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.413c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.59 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>
              <a href="#" aria-label="SafeZone en X (Twitter)" title="X">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Navegación -->
          <div class="footer-section">
            <h5>Navegación</h5>
            <ul>
              <li><a routerLink="/public">Inicio</a></li>
              <li><a routerLink="/public/nosotros">Nosotros</a></li>
              <li><a routerLink="/public/informacion">Información</a></li>
              <li><a routerLink="/public/contacto">Contacto</a></li>
            </ul>
          </div>

          <!-- Recursos -->
          <div class="footer-section">
            <h5>Recursos</h5>
            <ul>
              <li><a routerLink="/public/faq">Preguntas frecuentes</a></li>
              <li><a routerLink="/public/politicas">Políticas de privacidad</a></li>
              <li><a routerLink="/public/politicas">Términos y condiciones</a></li>
              <li><a routerLink="/public/denuncias/consultar">Consultar mi caso</a></li>
            </ul>
          </div>

          <!-- Línea de ayuda -->
          <div class="footer-section footer-help">
            <h5>Línea de ayuda</h5>
            <a href="tel:1800-SAFEZONE" class="help-line">
              <span class="icon icon--md icon--filled" aria-hidden="true">support_agent</span>
              <span class="help-number">1800-SAFEZONE</span>
            </a>
            <p class="help-availability">
              <span class="icon icon--sm" aria-hidden="true">schedule</span>
              Disponible 24 horas, todos los días
            </p>
            <a href="mailto:contacto@safezone.pe" class="help-email">
              <span class="icon icon--sm" aria-hidden="true">mail</span>
              contacto&#64;safezone.pe
            </a>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2026 SafeZone. Todos los derechos reservados.</p>
          <p class="credit">
            <span class="icon icon--sm" aria-hidden="true">school</span>
            Proyecto de Ingeniería de Sistemas — Universidad Tecnológica del Perú
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`

    .public-footer {
      background: linear-gradient(180deg, var(--color-primary-dark) 0%, #0a1326 100%);
      color: rgba(255, 255, 255, 0.78);
      padding: var(--space-16) var(--space-6) var(--space-6);
      margin-top: var(--space-16);
      border-top: 4px solid var(--color-accent);
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.4fr;
      gap: var(--space-12);
      margin-bottom: var(--space-12);
      align-items: start;
    }

    /* ─── Brand block ────────────────────────────────────────────── */
    .footer-brand {
      max-width: 360px;
    }
    .brand-link {
      display: inline-flex;
      align-items: center;
      gap: var(--space-3);
      text-decoration: none;
      color: #fff;
      margin-bottom: var(--space-4);
      border-radius: var(--radius-md);
      padding: var(--space-1);
    }
    .brand-link:focus-visible {
      outline: 2px solid var(--color-accent-lighter);
      outline-offset: 3px;
    }
    .brand-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
      color: #fff;
      box-shadow: 0 4px 12px -3px rgba(180, 83, 9, 0.55);
    }
    .brand-text {
      font-family: var(--font-serif);
      font-weight: var(--font-bold);
      font-size: var(--text-xl);
      letter-spacing: var(--tracking-tight);
    }
    .brand-desc {
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      line-height: var(--leading-relaxed);
      color: rgba(255, 255, 255, 0.72);
      margin: 0 0 var(--space-6) 0;
    }

    /* ─── Social links ───────────────────────────────────────────── */
    .social-links {
      display: flex;
      gap: var(--space-3);
    }
    .social-links a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.06);
      color: rgba(255, 255, 255, 0.78);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: background var(--duration-fast) var(--ease-in-out),
                  color var(--duration-fast) var(--ease-in-out),
                  transform var(--duration-fast) var(--ease-in-out),
                  border-color var(--duration-fast) var(--ease-in-out);
    }
    .social-links a svg {
      width: 18px;
      height: 18px;
    }
    .social-links a:hover {
      background: var(--color-accent);
      color: #fff;
      border-color: var(--color-accent);
      transform: translateY(-2px);
    }
    .social-links a:focus-visible {
      outline: 2px solid var(--color-accent-lighter);
      outline-offset: 2px;
    }

    /* ─── Section headers ────────────────────────────────────────── */
    .footer-section h5 {
      color: #fff;
      font-family: var(--font-sans);
      font-size: 0.8rem;
      font-weight: var(--font-bold);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin: 0 0 var(--space-5) 0;
    }

    /* ─── Footer links lists ─────────────────────────────────────── */
    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    .footer-section a:not(.brand-link):not(.help-line):not(.help-email):not(.social-links a) {
      color: rgba(255, 255, 255, 0.72);
      text-decoration: none;
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      padding: var(--space-1) 0;
      display: inline-block;
      transition: color var(--duration-fast) var(--ease-in-out),
                  transform var(--duration-fast) var(--ease-in-out);
      border-radius: var(--radius-sm);
    }
    .footer-section ul a:hover {
      color: var(--color-accent-lighter);
      transform: translateX(2px);
    }
    .footer-section ul a:focus-visible {
      outline: 2px solid var(--color-accent-lighter);
      outline-offset: 2px;
    }

    /* ─── Help block ─────────────────────────────────────────────── */
    .footer-help {
      max-width: 280px;
    }
    .help-line {
      display: inline-flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: var(--radius-md);
      text-decoration: none;
      color: #fff;
      margin-bottom: var(--space-3);
      transition: background var(--duration-fast) var(--ease-in-out),
                  border-color var(--duration-fast) var(--ease-in-out);
      min-height: 44px;
    }
    .help-line:hover {
      background: rgba(245, 158, 11, 0.18);
      border-color: rgba(245, 158, 11, 0.55);
    }
    .help-line:focus-visible {
      outline: 2px solid var(--color-accent-lighter);
      outline-offset: 2px;
    }
    .help-line .icon { color: var(--color-accent-lighter); }
    .help-number {
      font-family: var(--font-sans);
      font-weight: var(--font-bold);
      font-size: var(--text-base);
      letter-spacing: 0.02em;
    }
    .help-availability {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      margin: 0 0 var(--space-3) 0;
      font-family: var(--font-sans);
      font-size: var(--text-xs);
      color: rgba(255, 255, 255, 0.72);
    }
    .help-availability .icon { color: var(--color-accent-lighter); }
    .help-email {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      color: rgba(255, 255, 255, 0.72);
      text-decoration: none;
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      transition: color var(--duration-fast) var(--ease-in-out);
    }
    .help-email:hover { color: var(--color-accent-lighter); }
    .help-email:focus-visible {
      outline: 2px solid var(--color-accent-lighter);
      outline-offset: 2px;
      border-radius: var(--radius-sm);
    }

    /* ─── Footer bottom ──────────────────────────────────────────── */
    .footer-bottom {
      padding-top: var(--space-6);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--space-3);
      font-family: var(--font-sans);
      font-size: var(--text-xs);
      color: rgba(255, 255, 255, 0.58);
    }
    .footer-bottom p { margin: 0; }
    .footer-bottom .credit {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
    }
    .footer-bottom .credit .icon { color: rgba(255, 255, 255, 0.5); }

    /* ─── Responsive ─────────────────────────────────────────────── */
    @media (max-width: 1024px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: var(--space-8);
      }
      .footer-brand { grid-column: 1 / -1; max-width: 100%; }
      .footer-help { max-width: 100%; }
    }

    @media (max-width: 640px) {
      .public-footer {
        padding: var(--space-10) var(--space-4) var(--space-4);
        margin-top: var(--space-12);
      }
      .footer-grid {
        grid-template-columns: 1fr;
        gap: var(--space-8);
      }
      .footer-bottom {
        flex-direction: column;
        text-align: center;
        align-items: center;
      }
    }
  `]
})
export class PublicFooterComponent {}
