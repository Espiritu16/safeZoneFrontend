import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="public-header">
      <nav class="navbar">
        <div class="navbar-container">
          <!-- Logo -->
          <div class="navbar-brand">
            <a routerLink="/" class="logo">
              <span class="logo-icon">🛡️</span>
              <span class="logo-text">SafeZone</span>
            </a>
          </div>

          <!-- Navigation Links -->
          <ul class="nav-menu">
            <li>
              <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                Inicio
              </a>
            </li>
            <li>
              <a routerLink="/public/nosotros" routerLinkActive="active">
                Nosotros
              </a>
            </li>
            <li>
              <a routerLink="/public/informacion" routerLinkActive="active">
                Información
              </a>
            </li>
            <li>
              <a routerLink="/public/contacto" routerLinkActive="active">
                Contacto
              </a>
            </li>
            <li>
              <a routerLink="/public/faq" routerLinkActive="active">
                FAQ
              </a>
            </li>
          </ul>

          <!-- CTA Buttons -->
          <div class="nav-actions">
            <a routerLink="/public/denuncias/nueva" class="btn btn-primary">
              Denunciar
            </a>
            <a routerLink="/public/denuncias/consultar" class="btn btn-secondary">
              Mi Caso
            </a>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .public-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar {
      padding: 0;
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }

    .navbar-brand {
      flex-shrink: 0;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: white;
      font-weight: 700;
      font-size: 1.5rem;
      transition: opacity 0.3s;
    }

    .logo:hover {
      opacity: 0.8;
    }

    .logo-icon {
      font-size: 1.8rem;
    }

    .nav-menu {
      list-style: none;
      display: flex;
      gap: 2rem;
      margin: 0;
      padding: 0;
      flex: 1;
      justify-content: center;
    }

    .nav-menu a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: opacity 0.3s;
      position: relative;
    }

    .nav-menu a:hover,
    .nav-menu a.active {
      opacity: 0.8;
    }

    .nav-menu a.active::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      right: 0;
      height: 2px;
      background: white;
      border-radius: 1px;
    }

    .nav-actions {
      display: flex;
      gap: 1rem;
      flex-shrink: 0;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
      display: inline-block;
    }

    .btn-primary {
      background: white;
      color: #667eea;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid white;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .navbar-container {
        flex-wrap: wrap;
        padding: 1rem;
        gap: 1rem;
      }

      .nav-menu {
        order: 3;
        width: 100%;
        gap: 1rem;
        font-size: 0.9rem;
        justify-content: flex-start;
      }

      .nav-actions {
        gap: 0.5rem;
      }

      .btn {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
      }
    }
  `]
})
export class PublicHeaderComponent {}
