import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

/**
 * Guard de autorización por rol.
 * Lee la metadata `data.roles` de cada ruta y compara contra el rol activo del usuario.
 * Si el rol no está en la lista, redirige a la portada permitida para su rol.
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (!authService.isLoggedIn()) {
    void router.navigateByUrl('/inicio');
    return false;
  }

  const allowedRoles: string[] = route.data?.['roles'] ?? [];

  // Si no se especifican roles, la ruta es accesible para todos los autenticados
  if (allowedRoles.length === 0) {
    return true;
  }

  const currentRole = authService.currentRole();

  if (allowedRoles.includes(currentRole)) {
    return true;
  }

  toastService.show(
    `Acceso denegado. El rol "${currentRole}" no tiene permisos para acceder a este módulo.`,
    'error'
  );
  void router.navigateByUrl(authService.homeUrl());
  return false;
};
