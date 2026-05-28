import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <a class="skip-link" href="#contenido-principal">Saltar al contenido</a>

    <header class="public-header" [class.is-scrolled]="isScrolled()">
      <nav class="navbar" aria-label="Navegación principal">
        <div class="navbar-container">
          <!-- Logo: lleva al inicio público -->
          <a routerLink="/public" class="brand" aria-label="SafeZone, ir al inicio">
            <span class="brand-mark" aria-hidden="true">
              <span class="icon icon--lg icon--filled">verified_user</span>
            </span>
            <span class="brand-text">
              <span class="brand-name">SafeZone</span>
              <span class="brand-tagline">Protección y denuncia</span>
            </span>
          </a>

          <!-- Botón hamburguesa (mobile) -->
          <button
            type="button"
            class="nav-toggle"
            [class.is-open]="menuOpen()"
            [attr.aria-expanded]="menuOpen()"
            aria-controls="main-nav"
            aria-label="Abrir menú de navegación"
            (click)="toggleMenu()"
          >
            <span class="icon icon--lg" aria-hidden="true">{{ menuOpen() ? 'close' : 'menu' }}</span>
          </button>

          <!-- Menú navegación -->
          <div class="nav-wrapper" id="main-nav" [class.is-open]="menuOpen()">
            <ul class="nav-menu" role="list">
              <li>
                <a
                  routerLink="/public"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: true }"
                  (click)="closeMenu()"
                >
                  <span class="icon icon--sm" aria-hidden="true">home</span>
                  <span>Inicio</span>
                </a>
              </li>
              <li>
                <a routerLink="/public/nosotros" routerLinkActive="active" (click)="closeMenu()">
                  <span class="icon icon--sm" aria-hidden="true">diversity_3</span>
                  <span>Nosotros</span>
                </a>
              </li>
              <li>
                <a routerLink="/public/informacion" routerLinkActive="active" (click)="closeMenu()">
                  <span class="icon icon--sm" aria-hidden="true">menu_book</span>
                  <span>Información</span>
                </a>
              </li>
              <li>
                <a routerLink="/public/contacto" routerLinkActive="active" (click)="closeMenu()">
                  <span class="icon icon--sm" aria-hidden="true">mail</span>
                  <span>Contacto</span>
                </a>
              </li>
              <li>
                <a routerLink="/public/faq" routerLinkActive="active" (click)="closeMenu()">
                  <span class="icon icon--sm" aria-hidden="true">help</span>
                  <span>FAQ</span>
                </a>
              </li>
            </ul>

            <div class="nav-actions">
              <a routerLink="/login" class="btn btn-ghost" (click)="closeMenu()">
                <span class="icon icon--sm" aria-hidden="true">login</span>
                <span>Iniciar Sesión</span>
              </a>
              <a routerLink="/public/denuncias/consultar" class="btn btn-ghost" (click)="closeMenu()">
                <span class="icon icon--sm" aria-hidden="true">search</span>
                <span>Mi caso</span>
              </a>
              <a routerLink="/public/denuncias/nueva" class="btn btn-primary" (click)="closeMenu()">
                <span class="icon icon--sm" aria-hidden="true">shield_lock</span>
                <span>Denunciar</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`

    /* ─── Skip link (accesibilidad) ─────────────────────────────── */
    .skip-link {
      position: absolute;
      top: -48px;
      left: var(--space-2);
      z-index: var(--z-tooltip);
      padding: var(--space-2) var(--space-4);
      background: var(--color-primary-dark);
      color: var(--color-on-primary);
      text-decoration: none;
      border-radius: var(--radius-base);
      font-family: var(--font-sans);
      font-weight: var(--font-semibold);
      box-shadow: var(--shadow-md);
      transition: top var(--duration-fast) var(--ease-out);
    }
    .skip-link:focus {
      top: var(--space-2);
      outline: 2px solid var(--color-accent-lighter);
      outline-offset: 2px;
    }

    /* ─── Header bar ─────────────────────────────────────────────── */
    .public-header {
      position: sticky;
      top: 0;
      z-index: var(--z-fixed);
      background-color: var(--color-primary-dark);
      color: var(--color-on-primary);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      transition: box-shadow var(--duration-base) var(--ease-in-out),
                  background-color var(--duration-base) var(--ease-in-out);
    }
    .public-header.is-scrolled {
      box-shadow: var(--shadow-md);
      background-color: var(--color-primary);
    }

    .navbar { padding: 0; }
    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--space-3) var(--space-6);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-6);
      min-height: 72px;
      position: relative;
    }

    /* ─── Brand (logo) ───────────────────────────────────────────── */
    .brand {
      display: inline-flex;
      align-items: center;
      gap: var(--space-3);
      text-decoration: none;
      color: var(--color-on-primary);
      flex-shrink: 0;
      border-radius: var(--radius-md);
      padding: var(--space-1);
      transition: opacity var(--duration-fast) var(--ease-in-out);
    }
    .brand:hover { opacity: 0.92; }
    .brand:focus-visible {
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
      box-shadow: 0 4px 12px -2px rgba(180, 83, 9, 0.45);
    }
    .brand-text {
      display: inline-flex;
      flex-direction: column;
      line-height: 1.15;
    }
    .brand-name {
      font-family: var(--font-serif);
      font-weight: var(--font-bold);
      font-size: var(--text-xl);
      letter-spacing: var(--tracking-tight);
    }
    .brand-tagline {
      font-family: var(--font-sans);
      font-size: 0.7rem;
      font-weight: var(--font-medium);
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.7);
    }

    /* ─── Hamburger (mobile only) ────────────────────────────────── */
    .nav-toggle {
      display: none;
      width: 44px;
      height: 44px;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: var(--color-on-primary);
      border-radius: var(--radius-base);
      cursor: pointer;
      transition: background var(--duration-fast) var(--ease-in-out),
                  border-color var(--duration-fast) var(--ease-in-out);
    }
    .nav-toggle:hover { background: rgba(255, 255, 255, 0.08); }
    .nav-toggle:focus-visible {
      outline: 2px solid var(--color-accent-lighter);
      outline-offset: 2px;
    }
    .nav-toggle.is-open {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.3);
    }

    /* ─── Nav wrapper ────────────────────────────────────────────── */
    .nav-wrapper {
      display: flex;
      align-items: center;
      gap: var(--space-8);
      flex: 1;
      justify-content: flex-end;
    }

    .nav-menu {
      list-style: none;
      display: flex;
      gap: var(--space-2);
      margin: 0;
      padding: 0;
    }
    .nav-menu a {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-base);
      position: relative;
      min-height: 40px;
      transition: color var(--duration-fast) var(--ease-in-out),
                  background var(--duration-fast) var(--ease-in-out);
    }
    .nav-menu a .icon {
      color: rgba(255, 255, 255, 0.6);
      transition: color var(--duration-fast) var(--ease-in-out);
    }
    .nav-menu a:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.06);
    }
    .nav-menu a:hover .icon { color: var(--color-accent-lighter); }
    .nav-menu a:focus-visible {
      outline: 2px solid var(--color-accent-lighter);
      outline-offset: 2px;
    }
    .nav-menu a.active {
      color: #fff;
      background: rgba(245, 158, 11, 0.12);
    }
    .nav-menu a.active .icon { color: var(--color-accent-lighter); }
    .nav-menu a.active::after {
      content: '';
      position: absolute;
      left: var(--space-3);
      right: var(--space-3);
      bottom: 2px;
      height: 2px;
      background: var(--color-accent-lighter);
      border-radius: 2px;
    }

    /* ─── Action buttons ─────────────────────────────────────────── */
    .nav-actions {
      display: flex;
      gap: var(--space-2);
      align-items: center;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      min-height: 44px;
      border-radius: var(--radius-base);
      font-family: var(--font-sans);
      font-size: var(--text-sm);
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
      outline-offset: 2px;
    }
    .btn-ghost {
      background: transparent;
      color: rgba(255, 255, 255, 0.92);
      border-color: rgba(255, 255, 255, 0.25);
    }
    .btn-ghost:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.45);
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
      color: #fff;
      box-shadow: 0 4px 12px -3px rgba(180, 83, 9, 0.55);
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 20px -4px rgba(180, 83, 9, 0.6);
    }
    .btn-primary:active {
      transform: translateY(0);
      box-shadow: 0 3px 8px -2px rgba(180, 83, 9, 0.45);
    }

    /* ─── Responsive: tablet ─────────────────────────────────────── */
    @media (max-width: 1024px) {
      .brand-tagline { display: none; }
    }

    /* ─── Responsive: mobile (≤768px) ────────────────────────────── */
    @media (max-width: 768px) {
      .navbar-container {
        padding: var(--space-3) var(--space-4);
        min-height: 64px;
      }
      .nav-toggle { display: inline-flex; }

      .nav-wrapper {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
        gap: var(--space-4);
        background: var(--color-primary-dark);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: var(--shadow-lg);
        max-height: 0;
        overflow: hidden;
        padding: 0 var(--space-4);
        transition: max-height var(--duration-base) var(--ease-in-out),
                    padding var(--duration-base) var(--ease-in-out);
      }
      .nav-wrapper.is-open {
        max-height: calc(100vh - 64px);
        padding: var(--space-4);
        overflow-y: auto;
      }
      .nav-menu {
        flex-direction: column;
        gap: var(--space-1);
        width: 100%;
      }
      .nav-menu a {
        padding: var(--space-3) var(--space-4);
        font-size: var(--text-base);
        min-height: 48px;
        border-radius: var(--radius-md);
      }
      .nav-menu a.active::after { display: none; }
      .nav-menu a.active {
        background: rgba(245, 158, 11, 0.18);
        border-left: 3px solid var(--color-accent-lighter);
        padding-left: calc(var(--space-4) - 3px);
      }
      .nav-actions {
        flex-direction: column;
        width: 100%;
        gap: var(--space-2);
        padding-top: var(--space-2);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .nav-actions .btn { width: 100%; }
    }
  `]
})
export class PublicHeaderComponent {
  readonly menuOpen = signal(false);
  readonly isScrolled = signal(false);

  constructor(router: Router) {
    // Cierra el menú móvil al cambiar de ruta
    router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.menuOpen.set(false));
  }

  toggleMenu() { this.menuOpen.update((v) => !v); }
  closeMenu() { this.menuOpen.set(false); }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 8);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.menuOpen()) this.closeMenu();
  }
}
