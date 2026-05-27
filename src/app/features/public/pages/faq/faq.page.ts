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

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .faq-section h2 {
      color: #667eea;
      font-size: 1.5rem;
      margin-top: 0;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #667eea;
    }

    .accordion {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .accordion-item {
      background: white;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      overflow: hidden;
    }

    .accordion-header {
      width: 100%;
      padding: 1rem;
      background: white;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s;
    }

    .accordion-header:hover {
      background: #f8f9fa;
      color: #667eea;
    }

    .accordion-header.abierto {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .accordion-header .icon {
      font-size: 1.5rem;
      font-weight: bold;
      transition: transform 0.3s;
    }

    .accordion-content {
      padding: 1rem;
      background: #f8f9fa;
      border-top: 1px solid #e0e0e0;
      animation: slideDown 0.3s ease-out;
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
      color: #666;
      line-height: 1.8;
    }

    .cta-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 3rem;
      border-radius: 12px;
      text-align: center;
    }

    .cta-section h2 {
      margin-top: 0;
      margin-bottom: 1rem;
    }

    .cta-section p {
      margin-bottom: 2rem;
      font-size: 1.1rem;
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

    .btn-primary {
      background: white;
      color: #667eea;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      .header-section h1 {
        font-size: 2rem;
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
