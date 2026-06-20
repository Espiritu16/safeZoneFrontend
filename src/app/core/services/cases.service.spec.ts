import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { CasesService } from './cases.service';

describe('CasesService', () => {
  let service: CasesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CasesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('loads and maps backend cases to dashboard view models', () => {
    const request = http.expectOne('http://localhost:8080/api/casos');
    request.flush([
      {
        id: '12345678-0000-0000-0000-000000000000',
        victimaId: '87654321-0000-0000-0000-000000000000',
        estado: 'EN_ATENCION',
        prioridad: 'ALTA',
        resumen: 'Violencia Fisica. Registro formalizado.',
        distrito: 'Comas',
        activo: true,
        fechaCreacion: '2026-06-16T10:00:00',
        fechaActualizacion: '2026-06-16T10:00:00',
      },
    ]);

    expect(service.casos()).toEqual([
      expect.objectContaining({
        codigo: 'Caso #12345678',
        victim: 'Víctima 87654321',
        estado: 'En Proceso',
        riesgo: 'Severo',
        distrito: 'Comas',
      }),
    ]);
  });

  it('persists a case state transition through the backend', () => {
    http.expectOne('http://localhost:8080/api/casos').flush([]);

    service.casos.set([
      {
        id: 'case-1',
        codigo: 'Caso #CASE-1',
        victim: 'Víctima demo',
        anonimo: true,
        edad: 0,
        distrito: 'Lima',
        tipo: 'Fisica',
        estado: 'Evaluación',
        riesgo: 'Moderado',
        asignado: 'Pendiente',
        fecha: '2026-06-16',
        emocion: 'Pendiente',
      },
    ]);

    service.moveCase('case-1', 'En Proceso');

    const request = http.expectOne('http://localhost:8080/api/casos/case-1');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ estado: 'EN_ATENCION' });
    request.flush({
      id: 'case-1',
      victimaId: 'victima-1',
      estado: 'EN_ATENCION',
      prioridad: 'MEDIA',
      resumen: 'Violencia Psicologica.',
      distrito: 'Lima',
      activo: true,
      fechaCreacion: '2026-06-16T10:00:00',
      fechaActualizacion: '2026-06-16T10:00:00',
    });

    expect(service.casos()[0].estado).toBe('En Proceso');
  });
});
