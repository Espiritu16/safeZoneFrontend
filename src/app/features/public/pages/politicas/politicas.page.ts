import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-politicas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="politicas-container">
      <section class="header-section">
        <h1>Políticas y Términos</h1>
        <p class="subtitle">Tu privacidad y seguridad son nuestra prioridad</p>
      </section>

      <section class="content-section">
        <div class="container">
          <div class="politicas-content">
            <h2>Política de Privacidad</h2>

            <h3>1. Recolección de Información</h3>
            <p>
              SafeZone recopila información personal solo cuando es necesario para brindar servicios de protección
              a víctimas de violencia familiar. Esta información incluye: nombre, teléfono, email, y descripción de los hechos.
            </p>

            <h3>2. Protección de Datos</h3>
            <p>
              Todos los datos personales están encriptados y protegidos con estándares de seguridad internacionales.
              Solo personal autorizado tiene acceso a esta información.
            </p>

            <h3>3. Anonimato</h3>
            <p>
              Generamos un alias único (Ej: A-001) para proteger tu identidad en operaciones internas. Tu nombre real
              solo es conocido por profesionales directamente asignados a tu caso.
            </p>

            <h3>4. Uso de la Información</h3>
            <p>
              Tu información se utiliza exclusivamente para:
            </p>
            <ul>
              <li>Contactarte sobre el estado de tu caso</li>
              <li>Brindar servicios de protección y seguimiento</li>
              <li>Coordinar con instituciones legales cuando sea necesario</li>
              <li>Mejoras en nuestros servicios</li>
            </ul>

            <h3>5. Compartición de Datos</h3>
            <p>
              Tu información NO será compartida con terceros sin tu consentimiento, excepto cuando:
            </p>
            <ul>
              <li>La ley lo requiera (órdenes judiciales)</li>
              <li>Sea necesario para tu protección inmediata</li>
              <li>Sea parte de proceso legal en tu caso</li>
            </ul>

            <h3>6. Derechos de Acceso</h3>
            <p>
              Tienes derecho a: acceder a tus datos, solicitar correcciones, solicitar eliminación de información
              (sujeto a retención legal), y obtener una copia de tus registros.
            </p>

            <hr>

            <h2>Términos de Servicio</h2>

            <h3>1. Aceptación de Términos</h3>
            <p>
              Al usar SafeZone, aceptas estos términos y condiciones. Si no estás de acuerdo, por favor no uses nuestros servicios.
            </p>

            <h3>2. Descripción del Servicio</h3>
            <p>
              SafeZone es una plataforma diseñada para recibir denuncias de violencia familiar, proteger la identidad de
              las víctimas, y coordinar seguimiento profesional especializado.
            </p>

            <h3>3. Responsabilidades del Usuario</h3>
            <p>
              Garantizas que:
            </p>
            <ul>
              <li>La información proporcionada es verídica</li>
              <li>Eres mayor de edad (o tu representante legal)</li>
              <li>Usarás el servicio para propósitos legítimos</li>
              <li>No proporcionarás información falsa o engañosa</li>
            </ul>

            <h3>4. Limitación de Responsabilidad</h3>
            <p>
              SafeZone proporciona el servicio "tal como está". No podemos garantizar soluciones inmediatas, pero trabajamos
              con el máximo profesionalismo para protegerte.
            </p>

            <h3>5. Propiedad Intelectual</h3>
            <p>
              Todo contenido en SafeZone (diseño, logos, textos) es propiedad intelectual de SafeZone o sus licensiantes.
              No puedes reproducir sin permiso.
            </p>

            <h3>6. Modificaciones</h3>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Notificaremos cambios significativos
              a usuarios activos.
            </p>

            <hr>

            <h2>Seguridad</h2>

            <h3>1. Medidas de Seguridad</h3>
            <p>
              Implementamos:
            </p>
            <ul>
              <li>Encriptación de datos en tránsito y en reposo</li>
              <li>Autenticación segura</li>
              <li>Protección contra acceso no autorizado</li>
              <li>Auditoría de acceso de personal</li>
              <li>Copias de seguridad regulares</li>
            </ul>

            <h3>2. Incidentes de Seguridad</h3>
            <p>
              En caso de una violación de seguridad que afecte tu información personal, te notificaremos
              inmediatamente y proporcionaremos asistencia.
            </p>

            <h3>3. Reportar Problemas</h3>
            <p>
              Si descubres una vulnerabilidad de seguridad, por favor contáctanos inmediatamente a:
              <strong>seguridad@safezone.pe</strong>
            </p>

            <hr>

            <div class="last-updated">
              <p>Última actualización: 27 de mayo de 2026</p>
              <p>Si tienes preguntas, contacta a: <strong>contacto@safezone.pe</strong></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`

    .politicas-container {
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
      font-family: inherit;
      font-weight: var(--font-bold);
    }

    .subtitle {
      font-size: var(--text-lg);
      margin: var(--space-4) 0 0 0;
      opacity: 0.9;
      font-family: inherit;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 var(--space-6);
    }

    .content-section {
      padding: var(--space-12) var(--space-6);
    }

    .politicas-content {
      background: var(--color-background);
      padding: var(--space-8);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-base);
      line-height: var(--leading-relaxed);
      color: var(--color-foreground-secondary);
      font-family: inherit;
    }

    .politicas-content h2 {
      color: var(--color-primary);
      font-size: var(--text-3xl);
      margin-top: var(--space-8);
      margin-bottom: var(--space-4);
      padding-bottom: var(--space-4);
      border-bottom: 2px solid var(--color-primary);
      font-family: inherit;
      font-weight: var(--font-bold);
    }

    .politicas-content h2:first-child {
      margin-top: 0;
    }

    .politicas-content h3 {
      color: var(--color-foreground);
      font-size: var(--text-xl);
      margin-top: var(--space-6);
      margin-bottom: var(--space-4);
      font-family: inherit;
      font-weight: var(--font-semibold);
    }

    .politicas-content p {
      margin-bottom: var(--space-4);
    }

    .politicas-content ul {
      margin: var(--space-4) 0;
      padding-left: var(--space-8);
    }

    .politicas-content li {
      margin: var(--space-2) 0;
    }

    .politicas-content hr {
      border: none;
      border-top: 1px solid var(--color-border);
      margin: var(--space-8) 0;
    }

    .last-updated {
      background: var(--color-muted);
      padding: var(--space-6);
      border-radius: var(--radius-md);
      border-left: 4px solid var(--color-primary);
      margin-top: var(--space-8);
    }

    .last-updated p {
      margin: var(--space-2) 0;
      color: var(--color-muted-foreground);
      font-size: var(--text-sm);
    }

    @media (max-width: 768px) {
      .header-section h1 {
        font-size: var(--text-3xl);
      }

      .politicas-content {
        padding: var(--space-6);
      }

      .politicas-content h2 {
        font-size: var(--text-2xl);
      }
    }
  `]
})
export class PublicPoliticasPage {}
