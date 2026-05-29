import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PublicHeaderComponent } from './header.component';
import { PublicFooterComponent } from './footer.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PublicHeaderComponent, PublicFooterComponent],
  template: `
    <div class="public-layout">
      <app-public-header></app-public-header>

      <main id="contenido-principal" class="public-main" tabindex="-1">
        <router-outlet></router-outlet>
      </main>

      <app-public-footer></app-public-footer>
    </div>
  `,
  styles: [`

    .public-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: var(--color-background);
    }

    .public-main {
      flex: 1;
      width: 100%;
    }
    .public-main:focus { outline: none; }
  `]
})
export class PublicLayoutComponent {}
