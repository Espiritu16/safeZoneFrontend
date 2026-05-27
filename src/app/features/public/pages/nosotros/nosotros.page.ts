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

    .vision-mision-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .card h2 {
      margin-top: 0;
      font-size: 1.5rem;
    }

    .card p {
      margin: 0;
      line-height: 1.8;
    }

    .values-section h2,
    .team-section h2 {
      font-size: 2rem;
      color: #333;
      text-align: center;
      margin-bottom: 2rem;
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .value-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      border-left: 4px solid #667eea;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s;
    }

    .value-card:hover {
      transform: translateY(-5px);
    }

    .value-card h3 {
      margin-top: 0;
      color: #667eea;
    }

    .team-section {
      background: #f8f9fa;
      padding: 3rem;
      border-radius: 12px;
    }

    .team-intro {
      text-align: center;
      font-size: 1.1rem;
      color: #666;
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .team-members {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 2rem;
    }

    .team-member {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .avatar {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.2rem;
      margin: 0 auto 1rem;
    }

    .team-member h4 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .team-member p {
      margin: 0;
      color: #667eea;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .header-section h1 {
        font-size: 2rem;
      }

      .team-members {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
    }
  `]
})
export class PublicNosotrosPage {}
