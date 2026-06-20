import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout.component';
import { PublicInicioPage } from './pages/inicio/inicio.page';
import { PublicNosotrosPage } from './pages/nosotros/nosotros.page';
import { PublicInformacionPage } from './pages/informacion/informacion.page';
import { PublicContactoPage } from './pages/contacto/contacto.page';
import { PublicFaqPage } from './pages/faq/faq.page';
import { PublicNuevaDenunciaPage } from './pages/denuncias/nueva-denuncia/nueva-denuncia.page';
import { PublicConsultarCasoPage } from './pages/denuncias/consultar-caso/consultar-caso.page';
import { PublicPoliticasPage } from './pages/politicas/politicas.page';
import { publicFlowGuard } from '../../core/guards/public-flow.guard';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      // Página de inicio
      {
        path: '',
        component: PublicInicioPage,
        data: { title: 'Inicio - SafeZone' }
      },

      // Páginas informativas
      {
        path: 'nosotros',
        component: PublicNosotrosPage,
        data: { title: 'Nosotros - SafeZone' }
      },

      {
        path: 'informacion',
        component: PublicInformacionPage,
        data: { title: 'Información - SafeZone' }
      },
      {
        path: 'informacion/tipos-violencia',
        redirectTo: 'informacion',
        pathMatch: 'full'
      },
      {
        path: 'informacion/derechos',
        redirectTo: 'informacion',
        pathMatch: 'full'
      },

      {
        path: 'contacto',
        component: PublicContactoPage,
        data: { title: 'Contacto - SafeZone' }
      },

      {
        path: 'faq',
        component: PublicFaqPage,
        data: { title: 'Preguntas Frecuentes - SafeZone' }
      },

      // Flujo de denuncias
      {
        path: 'denuncias',
        children: [
          {
            path: 'nueva',
            canActivate: [publicFlowGuard],
            component: PublicNuevaDenunciaPage,
            data: { title: 'Enviar Denuncia - SafeZone' }
          },
          {
            path: 'consultar',
            canActivate: [publicFlowGuard],
            component: PublicConsultarCasoPage,
            data: { title: 'Consultar Mi Caso - SafeZone' }
          }
        ]
      },

      // Políticas y términos
      {
        path: 'politicas',
        component: PublicPoliticasPage,
        data: { title: 'Políticas - SafeZone' }
      },

      // Wildcard para rutas públicas no encontradas
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
];
