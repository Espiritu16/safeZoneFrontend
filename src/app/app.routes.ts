import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicFlowGuard } from './core/guards/public-flow.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  {
    path: 'inicio',
    loadComponent: () =>
      import('./features/public/inicio/inicio.page').then((m) => m.InicioPage),
  },
  {
    path: 'informacion',
    loadComponent: () =>
      import('./features/public/informacion/informacion.page').then((m) => m.InformacionPage),
  },
  {
    path: 'nosotros',
    loadComponent: () =>
      import('./features/public/nosotros/nosotros.page').then((m) => m.NosotrosPage),
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./features/public/faq/faq.page').then((m) => m.FaqPage),
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./features/public/contacto/contacto.page').then((m) => m.ContactoPage),
  },
  {
    path: 'politicas',
    loadComponent: () =>
      import('./features/public/politicas/politicas.page').then((m) => m.PoliticasPage),
  },
  {
    path: 'denuncia',
    canActivate: [publicFlowGuard],
    loadComponent: () =>
      import('./features/public/denuncia/denuncia.page').then((m) => m.DenunciaPage),
  },
  {
    path: 'mis-casos',
    canActivate: [publicFlowGuard],
    loadComponent: () =>
      import('./features/public/mis-casos/mis-casos.page').then((m) => m.MisCasosPage),
  },
  {
    path: 'usuario',
    canActivate: [authGuard, roleGuard],
    loadComponent: () =>
      import('./features/public/usuario/usuario-layout/usuario-layout.page').then((m) => m.UsuarioLayoutPage),
    data: { roles: ['Víctima'] },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/public/usuario/usuario-dashboard/usuario-dashboard.page').then((m) => m.UsuarioDashboardPage),
      },
      {
        path: 'denuncias',
        loadComponent: () =>
          import('./features/public/usuario/denuncias/denuncias.page').then((m) => m.UsuarioDenunciasPage),
      },
      {
        path: 'casos',
        loadComponent: () =>
          import('./features/public/usuario/casos/casos.page').then((m) => m.UsuarioCasosPage),
      },
      {
        path: 'citas',
        loadComponent: () =>
          import('./features/public/usuario/citas/citas.page').then((m) => m.UsuarioCitasPage),
      },
      {
        path: 'evidencias',
        loadComponent: () =>
          import('./features/public/usuario/evidencias/evidencias.page').then((m) => m.UsuarioEvidenciasPage),
      },
      {
        path: 'notificaciones',
        loadComponent: () =>
          import('./features/public/usuario/notificaciones/notificaciones.page').then((m) => m.UsuarioNotificacionesPage),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/public/usuario/perfil/perfil.page').then((m) => m.UsuarioPerfilPage),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },

  // Rutas protegidas (requieren autenticación)
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/interno/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        data: { roles: ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal', 'Soporte Técnico'] },
      },
      {
        path: 'predenuncias',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/interno/predenuncias/predenuncias.component').then((m) => m.PredenunciasComponent),
        data: { roles: ['Administrador', 'Recepcionista'] },
      },
      {
        path: 'denuncias',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/interno/denuncias/denuncias.component').then((m) => m.DenunciasComponent),
        data: { roles: ['Administrador', 'Recepcionista'] },
      },
      {
        path: 'casos',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/interno/casos/casos.component').then((m) => m.CasosComponent),
        data: { roles: ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal'] },
      },
      {
        path: 'victimas',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/interno/victimas/victimas.component').then((m) => m.VictimasComponent),
        data: { roles: ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal'] },
      },
      {
        path: 'citas',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/interno/citas/citas.component').then((m) => m.CitasComponent),
        data: { roles: ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal'] },
      },
      {
        path: 'evidencias',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/interno/evidencias/evidencias.component').then((m) => m.EvidenciasComponent),
        data: { roles: ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal'] },
      },
      {
        path: 'reportes',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/interno/reportes/reportes.component').then((m) => m.ReportesComponent),
        data: { roles: ['Administrador', 'Psicólogo', 'Defensor Legal'] },
      },
      {
        path: 'auditoria',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/interno/auditoria/auditoria.component').then((m) => m.AuditoriaComponent),
        data: { roles: ['Administrador', 'Soporte Técnico'] },
      },
      {
        path: 'usuarios',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/interno/usuarios/usuarios.component').then((m) => m.UsuariosComponent),
        data: { roles: ['Administrador', 'Soporte Técnico'] },
      },
      {
        path: 'configuracion',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/interno/configuracion/configuracion.component').then((m) => m.ConfiguracionComponent),
        data: { roles: ['Administrador', 'Soporte Técnico'] },
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: 'inicio' },
];
