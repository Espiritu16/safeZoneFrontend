import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';
import { Capacitor } from '@capacitor/core';

import { routes } from './app.routes';
import { authTokenInterceptor } from './core/http/auth-token.interceptor';

const routerFeatures = Capacitor.isNativePlatform() ? [withHashLocation()] : [];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, ...routerFeatures),
    provideHttpClient(withInterceptors([authTokenInterceptor])),
  ]
};
