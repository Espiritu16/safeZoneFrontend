import { routes } from './app.routes';

describe('app.routes', () => {
  it('redirige el modulo interno de denuncias a predenuncias', () => {
    const internalLayout = routes.find((route) => route.path === '' && Array.isArray(route.children));
    const internalDenuncias = internalLayout?.children?.find((route) => route.path === 'denuncias');

    expect(internalDenuncias?.redirectTo).toBe('predenuncias');
    expect(internalDenuncias?.pathMatch).toBe('full');
    expect(internalDenuncias?.loadComponent).toBeUndefined();
  });
});
