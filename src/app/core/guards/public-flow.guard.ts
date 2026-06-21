import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const publicFlowGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (authService.isLoggedIn()) {
    return router.parseUrl(authService.homeUrl());
  }

  toastService.show('Inicia sesión para registrar o consultar tus denuncias desde el panel.', 'warning');
  return router.parseUrl('/inicio?login=1');
};
