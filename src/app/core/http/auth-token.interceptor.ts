import { HttpInterceptorFn } from '@angular/common/http';

export const ACCESS_TOKEN_KEY = 'safezone_access_token';
export const REFRESH_TOKEN_KEY = 'safezone_refresh_token';
export const USER_KEY = 'safezone_user';

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) {
    return next(request);
  }

  return next(request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }));
};
