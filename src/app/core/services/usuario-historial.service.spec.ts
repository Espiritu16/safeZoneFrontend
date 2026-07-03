import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { UsuarioHistorialService } from './usuario-historial.service';

describe('UsuarioHistorialService', () => {
  let service: UsuarioHistorialService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UsuarioHistorialService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('loads the authenticated victim history from the backend', () => {
    service.load().subscribe((response) => {
      expect(response.victimaId).toBe('victima-1');
      expect(service.casos()).toHaveLength(1);
      expect(service.citas()).toHaveLength(0);
      expect(service.evidencias()).toHaveLength(0);
    });

    const request = http.expectOne('http://localhost:8080/api/victimas/me/historial');
    expect(request.request.method).toBe('GET');
    request.flush({
      victimaId: 'victima-1',
      aliasActivo: null,
      casos: [
        {
          tipo: 'CASO',
          id: 'caso-1',
          casoId: 'caso-1',
          titulo: 'Caso registrado',
          detalle: 'Distrito: Comas',
          estado: 'EN_EVALUACION',
          fecha: '2026-07-01T10:00:00Z',
          metadata: { prioridad: 'ALTA', distrito: 'Comas' },
        },
      ],
      denuncias: [],
      citas: [],
      seguimientos: [],
      evidencias: [],
      lineaTiempo: [],
    });
  });
});
