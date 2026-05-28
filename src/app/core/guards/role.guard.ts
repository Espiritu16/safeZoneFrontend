import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { SecurityConfigService } from '../services/security-config.service';

/**
 * Guard de autorización por rol.
 * Lee la metadata `data.roles` de cada ruta y compara contra el rol activo del usuario
 * y la matriz de permisos configurada dinámicamente.
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);
  const configService = inject(SecurityConfigService);

  const allowedRoles: string[] = route.data?.['roles'] ?? [];

  // Si no se especifican roles, la ruta es accesible para todos los autenticados
  if (allowedRoles.length === 0) {
    return true;
  }

  const currentRole = authService.currentRole();
  const path = route.routeConfig?.path ?? '';

  let moduleKey = path.charAt(0).toUpperCase() + path.slice(1);
  if (moduleKey === 'Configuracion') moduleKey = 'Configuración';
  if (moduleKey === 'Auditoria') moduleKey = 'Auditoría';
  if (moduleKey === 'Victimas') moduleKey = 'Víctimas';
  if (moduleKey === 'Mis-citas') moduleKey = 'Citas'; // Mapeo para ruta de víctima

  const hasPerm = (path === 'dashboard' || path === '') ? true : configService.hasPermission(currentRole, moduleKey);

  if (allowedRoles.includes(currentRole) && hasPerm) {
    return true;
  }

  toastService.show(
    `Acceso denegado. El rol "${currentRole}" no tiene permisos para acceder a este módulo.`,
    'error'
  );

  // Redirigir según el rol
  if (currentRole === 'Víctima') {
    void router.navigateByUrl('/portal/dashboard');
  } else {
    void router.navigateByUrl('/dashboard');
  }
  return false;
};
