import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqItem {
  id: number;
  pregunta: string;
  respuesta: string;
  abierto?: boolean;
}

@Component({
  selector: 'app-public-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="faq-container">
      <section class="header-section">
        <h1>Preguntas Frecuentes</h1>
        <p class="subtitle">Encuentra respuestas a tus dudas</p>
      </section>

      <section class="content-section">
        <div class="container">
          <div class="faq-grid">
            <div class="faq-section">
              <h2>Sobre SafeZone</h2>
              <div class="accordion">
                <div *ngFor="let item of faqAboutSafezone" class="accordion-item">
                  <button
                    class="accordion-header"
                    (click)="toggleItem(item)"
                    [class.abierto]="item.abierto"
                  >
                    <span>{{ item.pregunta }}</span>
                    <span class="icon">{{ item.abierto ? '−' : '+' }}</span>
                  </button>
                  <div *ngIf="item.abierto" class="accordion-content">
                    <p>{{ item.respuesta }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="faq-section">
              <h2>Sobre Denuncias</h2>
              <div class="accordion">
                <div *ngFor="let item of faqDenuncias" class="accordion-item">
                  <button
                    class="accordion-header"
                    (click)="toggleItem(item)"
                    [class.abierto]="item.abierto"
                  >
                    <span>{{ item.pregunta }}</span>
                    <span class="icon">{{ item.abierto ? '−' : '+' }}</span>
                  </button>
                  <div *ngIf="item.abierto" class="accordion-content">
                    <p>{{ item.respuesta }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="faq-section">
              <h2>Sobre Privacidad y Seguridad</h2>
              <div class="accordion">
                <div *ngFor="let item of faqSeguridad" class="accordion-item">
                  <button
                    class="accordion-header"
                    (click)="toggleItem(item)"
                    [class.abierto]="item.abierto"
                  >
                    <span>{{ item.pregunta }}</span>
                    <span class="icon">{{ item.abierto ? '−' : '+' }}</span>
                  </button>
                  <div *ngIf="item.abierto" class="accordion-content">
                    <p>{{ item.respuesta }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="faq-section">
              <h2>Sobre Seguimiento</h2>
              <div class="accordion">
                <div *ngFor="let item of faqSeguimiento" class="accordion-item">
                  <button
                    class="accordion-header"
                    (click)="toggleItem(item)"
                    [class.abierto]="item.abierto"
                  >
                    <span>{{ item.pregunta }}</span>
                    <span class="icon">{{ item.abierto ? '−' : '+' }}</span>
                  </button>
                  <div *ngIf="item.abierto" class="accordion-content">
                    <p>{{ item.respuesta }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="cta-section">
            <h2>¿No encontraste tu respuesta?</h2>
            <p>Comunícate con nosotros a través de nuestro formulario de contacto o llama a nuestra línea de ayuda.</p>
            <a href="/public/contacto" class="btn btn-primary">
              Contactar a SafeZone
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`

    .faq-container {
      width: 100%;
    }

    .header-section {
      background-color: var(--color-primary);
      color: var(--color-on-primary);
      padding: var(--space-16) var(--space-6);
      text-align: center;
    }

    .header-section h1 {
      font-size: var(--text-5xl);
      margin: 0;
      font-family: var(--font-serif);
      font-weight: var(--font-bold);
    }

    .subtitle {
      font-size: var(--text-lg);
      margin: var(--space-4) 0 0 0;
      opacity: 0.9;
      font-family: var(--font-sans);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--space-6);
    }

    .content-section {
      padding: var(--space-16) var(--space-6);
    }

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-8);
      margin-bottom: var(--space-16);
    }

    .faq-section h2 {
      color: var(--color-primary);
      font-size: var(--text-xl);
      margin-top: 0;
      margin-bottom: var(--space-6);
      padding-bottom: var(--space-4);
      border-bottom: 2px solid var(--color-primary);
      font-family: var(--font-serif);
      font-weight: var(--font-bold);
    }

    .accordion {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .accordion-item {
      background: var(--color-background);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      overflow: hidden;
    }

    .accordion-header {
      width: 100%;
      padding: var(--space-4);
      background: var(--color-background);
      border: none;
      cursor: pointer;
      font-size: var(--text-base);
      font-weight: var(--font-semibold);
      color: var(--color-foreground);
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all var(--duration-base) var(--ease-in-out);
      font-family: var(--font-sans);
      min-height: 44px;
    }

    .accordion-header:hover {
      background: var(--color-muted);
      color: var(--color-primary);
    }

    .accordion-header:focus-visible {
      outline: 2px solid var(--color-ring);
      outline-offset: -2px;
    }

    .accordion-header.abierto {
      background-color: var(--color-primary);
      color: var(--color-on-primary);
    }

    .accordion-header .icon {
      font-size: var(--text-xl);
      font-weight: var(--font-bold);
      transition: transform var(--duration-base) var(--ease-in-out);
    }

    .accordion-content {
      padding: var(--space-4);
      background: var(--color-muted);
      border-top: 1px solid var(--color-border);
      animation: slideDown var(--duration-base) var(--ease-out);
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .accordion-content p {
      margin: 0;
      color: var(--color-muted-foreground);
      line-height: var(--leading-relaxed);
      font-family: var(--font-sans);
    }

    .cta-section {
      background-color: var(--color-primary);
      color: var(--color-on-primary);
      padding: var(--space-12);
      border-radius: var(--radius-lg);
      text-align: center;
    }

    .cta-section h2 {
      margin-top: 0;
      margin-bottom: var(--space-4);
      font-family: var(--font-serif);
      font-weight: var(--font-bold);
      font-size: var(--text-2xl);
    }

    .cta-section p {
      margin-bottom: var(--space-8);
      font-size: var(--text-lg);
      font-family: var(--font-sans);
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
      font-family: var(--font-sans);
      min-height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn:focus-visible {
      outline: 2px solid var(--color-ring);
      outline-offset: 2px;
    }

    .btn-primary {
      background-color: var(--color-accent);
      color: white;
    }

    .btn-primary:hover {
      background-color: var(--color-accent-light);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    @media (max-width: 768px) {
      .header-section h1 {
        font-size: var(--text-3xl);
      }

      .faq-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PublicFaqPage {
  faqAboutSafezone: FaqItem[] = [
    {
      id: 1,
      pregunta: '¿Qué es SafeZone?',
      respuesta: 'SafeZone es una plataforma web moderna diseñada para recibir denuncias de violencia familiar de forma confidencial y brindar seguimiento profesional especializado a las víctimas.'
    },
    {
      id: 2,
      pregunta: '¿Es realmente seguro y confidencial?',
      respuesta: 'Sí. SafeZone utiliza protocolos de seguridad de nivel empresarial y genera un alias anónimo para cada víctima. Tus datos personales están protegidos en todo momento.'
    },
    {
      id: 3,
      pregunta: '¿Cuánto cuesta usar SafeZone?',
      respuesta: 'SafeZone es completamente gratuito. Es un servicio público diseñado para proteger a las víctimas de violencia familiar.'
    }
  ];

  faqDenuncias: FaqItem[] = [
    {
      id: 4,
      pregunta: '¿Cómo hago una denuncia?',
      respuesta: 'Puedes hacer una denuncia a través del formulario en nuestro sitio web. Solo necesitas proporcionarnos información básica y una forma segura de contactarte. El proceso es simple y confidencial.'
    },
    {
      id: 5,
      pregunta: '¿Puedo denunciar de forma anónima?',
      respuesta: 'Sí, puedes iniciara un proceso de denuncia anónimo. Sin embargo, para poder ayudarte efectivamente, necesitaremos una forma de contactarte de manera segura.'
    },
    {
      id: 6,
      pregunta: '¿Qué sucede después de presentar una denuncia?',
      respuesta: 'Después de tu denuncia, un recepcionista se comunicará contigo para validar la información. Si procede, se creará un caso formal y se te asignará un equipo profesional.'
    }
  ];

  faqSeguridad: FaqItem[] = [
    {
      id: 7,
      pregunta: '¿Cómo se protege mi privacidad?',
      respuesta: 'SafeZone genera un alias único para cada usuario, encripta toda comunicación y restringe el acceso a datos personales solo a profesionales autorizados.'
    },
    {
      id: 8,
      pregunta: '¿Puedo confiar en que mis datos no serán compartidos?',
      respuesta: 'Tus datos solo se compartirán con profesionales especializados (psicólogos, defensores legales) que trabajan en tu caso y con instituciones legales cuando sea necesario.'
    },
    {
      id: 9,
      pregunta: '¿Qué pasa si cambio de opinión?',
      respuesta: 'Puedes comunicarte con nosotros en cualquier momento para actualizar tu información o pausar el proceso. Tienes control total sobre tu caso.'
    }
  ];

  faqSeguimiento: FaqItem[] = [
    {
      id: 10,
      pregunta: '¿Cómo puedo ver el estado de mi caso?',
      respuesta: 'Puedes consultar el estado de tu caso en cualquier momento usando tu código de seguimiento o alias. Accede a la sección "Consultar Mi Caso".'
    },
    {
      id: 11,
      pregunta: '¿Cuánto tiempo toma resolver un caso?',
      respuesta: 'El tiempo depende de la complejidad de cada caso. Los casos críticos reciben atención inmediata. El equipo te mantendrá informado sobre el progreso.'
    },
    {
      id: 12,
      pregunta: '¿Tendré citas con los profesionales?',
      respuesta: 'Sí. Se programarán citas con psicólogos y defensores legales según tus necesidades. Puedes confirmar, reprogramar o cancelar citas según sea necesario.'
    }
  ];

  toggleItem(item: FaqItem) {
    item.abierto = !item.abierto;
  }
}
