import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { PUBLIC_ROUTES } from './features/public/public.routes';

export const routes: Routes = [
  // Rutas públicas (sin autenticación requerida)
  {
    path: 'public',
    loadChildren: () => Promise.resolve(PUBLIC_ROUTES),
  },

  // Login
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
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        data: { roles: [] }, // Accesible para todos los roles
      },
      {
        path: 'denuncias',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/denuncias/denuncias.component').then((m) => m.DenunciasComponent),
        data: { roles: ['Administrador', 'Recepcionista', 'Víctima'] },
      },
      {
        path: 'casos',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/casos/casos.component').then((m) => m.CasosComponent),
        data: { roles: ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal'] },
      },
      {
        path: 'victimas',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/victimas/victimas.component').then((m) => m.VictimasComponent),
        data: { roles: ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal'] },
      },
      {
        path: 'citas',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/citas/citas.component').then((m) => m.CitasComponent),
        data: { roles: ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal', 'Víctima'] },
      },
      {
        path: 'evidencias',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/evidencias/evidencias.component').then((m) => m.EvidenciasComponent),
        data: { roles: ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal'] },
      },
      {
        path: 'reportes',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/reportes/reportes.component').then((m) => m.ReportesComponent),
        data: { roles: ['Administrador', 'Psicólogo', 'Defensor Legal'] },
      },
      {
        path: 'auditoria',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/auditoria/auditoria.component').then((m) => m.AuditoriaComponent),
        data: { roles: ['Administrador', 'Soporte Técnico'] },
      },
      {
        path: 'usuarios',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/usuarios/usuarios.component').then((m) => m.UsuariosComponent),
        data: { roles: ['Administrador', 'Soporte Técnico'] },
      },
      {
        path: 'configuracion',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/configuracion/configuracion.component').then((m) => m.ConfiguracionComponent),
        data: { roles: ['Administrador', 'Soporte Técnico'] },
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
