import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-nosotros',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="nosotros-container">
      <section class="header-section">
        <h1>Nosotros</h1>
        <p class="subtitle">Conoce la misión y visión de SafeZone</p>
      </section>

      <section class="content-section">
        <div class="container">
          <div class="vision-mision-grid">
            <div class="card">
              <h2>🎯 Misión</h2>
              <p>
                Ser una plataforma web de referencia que facilite el acceso a servicios de denuncia,
                protección y seguimiento especializado para víctimas de violencia familiar, garantizando
                confidencialidad, rapidez y sensibilidad humana en cada interacción.
              </p>
            </div>

            <div class="card">
              <h2>🌟 Visión</h2>
              <p>
                Contribuir a la erradicación de la violencia familiar en Lima Metropolitana mediante
                un sistema integral que proteja a las víctimas, facilite la acción legal y permita
                el seguimiento profesional desde una plataforma moderna y segura.
              </p>
            </div>
          </div>

          <div class="values-section">
            <h2>Valores</h2>
            <div class="values-grid">
              <div class="value-card">
                <h3>🛡️ Protección</h3>
                <p>La seguridad y privacidad de nuestras usuarias es nuestra prioridad máxima.</p>
              </div>
              <div class="value-card">
                <h3>❤️ Empatía</h3>
                <p>Entendemos el dolor y el miedo de quienes acuden a nosotros.</p>
              </div>
              <div class="value-card">
                <h3>⚖️ Justicia</h3>
                <p>Trabajamos para que se aplique la ley y se protejan los derechos.</p>
              </div>
              <div class="value-card">
                <h3>🤝 Colaboración</h3>
                <p>Trabajamos coordinadamente con instituciones y profesionales especializados.</p>
              </div>
            </div>
          </div>

          <div class="team-section">
            <h2>Equipo Detrás de SafeZone</h2>
            <p class="team-intro">
              SafeZone fue desarrollado por estudiantes de Ingeniería de Sistemas de la Universidad Tecnológica del Perú
              como parte de un proyecto innovador para abordar la problemática de violencia familiar.
            </p>

            <div class="team-members">
              <div class="team-member">
                <div class="avatar">KE</div>
                <h4>Kevin Espíritu</h4>
                <p>Desarrollador Frontend</p>
              </div>
              <div class="team-member">
                <div class="avatar">FA</div>
                <h4>Fabrizio Bustamante</h4>
                <p>Desarrollador Full Stack</p>
              </div>
              <div class="team-member">
                <div class="avatar">SV</div>
                <h4>Salvador Goicochea</h4>
                <p>Ingeniero de Sistemas</p>
              </div>
              <div class="team-member">
                <div class="avatar">WI</div>
                <h4>Walter Mantari</h4>
                <p>Desarrollador Backend</p>
              </div>
              <div class="team-member">
                <div class="avatar">SK</div>
                <h4>Shayuri García</h4>
                <p>Diseñadora UX/UI</p>
              </div>
              <div class="team-member">
                <div class="avatar">AF</div>
                <h4>Adrián Viera</h4>
                <p>Gestor de Proyectos</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`

    .nosotros-container {
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
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--space-6);
    }

    .content-section {
      padding: var(--space-16) var(--space-6);
    }

    .vision-mision-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-8);
      margin-bottom: var(--space-16);
    }

    .card {
      background-color: var(--color-primary);
      color: var(--color-on-primary);
      padding: var(--space-8);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
    }

    .card h2 {
      margin-top: 0;
      font-size: var(--text-2xl);
      font-family: inherit;
      font-weight: var(--font-bold);
    }

    .card p {
      margin: 0;
      line-height: var(--leading-relaxed);
      font-family: inherit;
    }

    .values-section h2,
    .team-section h2 {
      font-size: var(--text-3xl);
      color: var(--color-foreground);
      text-align: center;
      margin-bottom: var(--space-8);
      font-family: inherit;
      font-weight: var(--font-bold);
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-8);
      margin-bottom: var(--space-16);
    }

    .value-card {
      background: var(--color-background);
      padding: var(--space-8);
      border-radius: var(--radius-lg);
      border-left: 4px solid var(--color-primary);
      box-shadow: var(--shadow-sm);
      transition: all var(--duration-base) var(--ease-in-out);
    }

    .value-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-lg);
      border-left-color: var(--color-accent);
    }

    .value-card h3 {
      margin-top: 0;
      color: var(--color-primary);
      font-family: inherit;
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
    }

    .value-card p {
      color: var(--color-muted-foreground);
      font-family: inherit;
    }

    .team-section {
      background: var(--color-muted);
      padding: var(--space-12);
      border-radius: var(--radius-lg);
    }

    .team-intro {
      text-align: center;
      font-size: var(--text-lg);
      color: var(--color-muted-foreground);
      margin-bottom: var(--space-8);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      font-family: inherit;
    }

    .team-members {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: var(--space-8);
    }

    .team-member {
      background: var(--color-background);
      padding: var(--space-6);
      border-radius: var(--radius-lg);
      text-align: center;
      box-shadow: var(--shadow-sm);
      transition: all var(--duration-base) var(--ease-in-out);
    }

    .team-member:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-4px);
    }

    .avatar {
      width: 60px;
      height: 60px;
      background-color: var(--color-primary);
      color: var(--color-on-primary);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-bold);
      font-size: var(--text-lg);
      margin: 0 auto var(--space-4);
      font-family: inherit;
    }

    .team-member h4 {
      margin: 0 0 var(--space-2) 0;
      color: var(--color-foreground);
      font-family: inherit;
      font-size: var(--text-base);
      font-weight: var(--font-semibold);
    }

    .team-member p {
      margin: 0;
      color: var(--color-primary);
      font-size: var(--text-sm);
      font-family: inherit;
      font-weight: var(--font-medium);
    }

    @media (max-width: 768px) {
      .header-section h1 {
        font-size: var(--text-3xl);
      }

      .team-members {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }

      .team-section {
        padding: var(--space-8);
      }
    }
  `]
})
export class PublicNosotrosPage {}
