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
      max-width: 900px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .content-section {
      padding: 3rem 2rem;
    }

    .politicas-content {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      line-height: 1.8;
      color: #666;
    }

    .politicas-content h2 {
      color: #667eea;
      font-size: 1.8rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #667eea;
    }

    .politicas-content h2:first-child {
      margin-top: 0;
    }

    .politicas-content h3 {
      color: #333;
      font-size: 1.2rem;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
    }

    .politicas-content p {
      margin-bottom: 1rem;
    }

    .politicas-content ul {
      margin: 1rem 0;
      padding-left: 2rem;
    }

    .politicas-content li {
      margin: 0.5rem 0;
    }

    .politicas-content hr {
      border: none;
      border-top: 1px solid #e0e0e0;
      margin: 2rem 0;
    }

    .last-updated {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #667eea;
      margin-top: 2rem;
    }

    .last-updated p {
      margin: 0.5rem 0;
      color: #999;
    }

    @media (max-width: 768px) {
      .header-section h1 {
        font-size: 2rem;
      }

      .politicas-content {
        padding: 1.5rem;
      }

      .politicas-content h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class PublicPoliticasPage {}
