import { describe, expect, it } from 'vitest';
import { API_ENDPOINTS } from './api-endpoints';

describe('API_ENDPOINTS', () => {
  it('exposes sprint 1 and sprint 2 backend paths without /api prefix', () => {
    expect(API_ENDPOINTS.auth.login).toBe('/auth/iniciar-sesion');
    expect(API_ENDPOINTS.auth.me).toBe('/auth/me');
    expect(API_ENDPOINTS.predenuncias).toBe('/predenuncias');
    expect(API_ENDPOINTS.casos).toBe('/casos');
    expect(API_ENDPOINTS.denuncias).toBe('/denuncias');
    expect(API_ENDPOINTS.seguimientos).toBe('/seguimientos');
  });
});
