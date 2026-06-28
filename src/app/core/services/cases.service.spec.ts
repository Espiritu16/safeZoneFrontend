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

  function flushInitialLoad(
    casos: unknown[] = [],
    asignaciones: unknown[] = [],
    denuncias: unknown[] = [],
    usuarios: unknown[] = [],
  ): void {
    http.expectOne('http://localhost:8080/api/casos').flush(casos);
    http.expectOne('http://localhost:8080/api/asignaciones').flush(asignaciones);
    http.expectOne('http://localhost:8080/api/denuncias').flush(denuncias);
    http.expectOne('http://localhost:8080/api/usuarios').flush(usuarios);
  }

  it('loads and enriches backend cases with denuncia and usuario data', () => {
    flushInitialLoad(
      [
        {
          id: '12345678-0000-0000-0000-000000000000',
          victimaId: '87654321-0000-0000-0000-000000000000',
          estado: 'EN_ATENCION',
          prioridad: 'ALTA',
          resumen: 'Descripcion de los hechos.',
          distrito: 'Comas',
          activo: true,
          fechaCreacion: '2026-06-16T10:00:00',
          fechaActualizacion: '2026-06-16T10:00:00',
        },
      ],
      [
        {
          id: 'asignacion-1',
          casoId: '12345678-0000-0000-0000-000000000000',
          profesionalId: 'psicologo-1',
          rolProfesional: 'PSICOLOGO',
          activo: true,
          fechaAsignacion: '2026-06-16T11:00:00',
        },
      ],
      [
        {
          id: 'denuncia-1',
          casoId: '12345678-0000-0000-0000-000000000000',
          victimaId: '87654321-0000-0000-0000-000000000000',
          descripcion: 'Descripcion de los hechos.',
          tipoViolencia: 'FISICA',
          fechaIncidente: '2026-06-15T10:00:00',
          distrito: 'Comas',
          direccionReferencia: 'Referencia',
          nivelRiesgo: 'ALTO',
          anonima: false,
          adjuntos: [],
          activo: true,
          fechaCreacion: '2026-06-16T10:00:00',
          fechaActualizacion: '2026-06-16T10:00:00',
        },
      ],
      [
        {
          id: '87654321-0000-0000-0000-000000000000',
          correo: 'maria@example.com',
          nombres: 'Ana Maria',
          apellidos: 'Lopez',
          dni: '45678912',
          telefono: '999888777',
          distrito: 'Comas',
          rol: 'VICTIMA',
          activo: true,
        },
        {
          id: 'psicologo-1',
          correo: 'psicologa@example.com',
          nombres: 'Rosa',
          apellidos: 'Salas',
          dni: '12345678',
          telefono: '999111222',
          distrito: 'Comas',
          rol: 'PSICOLOGO',
          activo: true,
        },
      ],
    );

    expect(service.casos()).toEqual([
      expect.objectContaining({
        codigo: 'Caso #12345678',
        victim: 'Ana Maria Lopez',
        tipo: 'Violencia Física',
        anonimo: false,
        estado: 'En atención',
        riesgo: 'Alto',
        distrito: 'Comas',
        asignado: 'Psic.: Rosa Salas',
      }),
    ]);
  });

  it('persists a case state transition through the backend', () => {
    flushInitialLoad();

    service.casos.set([
      {
        id: 'case-1',
        codigo: 'Caso #CASE-1',
        victim: 'Víctima demo',
        anonimo: true,
        edad: '0',
        distrito: 'Lima',
        tipo: 'Fisica',
        estado: 'Evaluación',
        riesgo: 'Moderado',
        asignado: 'Pendiente',
        fecha: '2026-06-16',
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

    expect(service.casos()[0].estado).toBe('En atención');
  });

  it('closes a case by updating its status instead of inactivating it', () => {
    flushInitialLoad();

    service.closedCase('case-1');

    const updateRequest = http.expectOne('http://localhost:8080/api/casos/case-1');
    expect(updateRequest.request.method).toBe('PUT');
    expect(updateRequest.request.body).toEqual({ estado: 'CERRADO' });
    updateRequest.flush({
      id: 'case-1',
      victimaId: 'victima-1',
      estado: 'CERRADO',
      prioridad: 'MEDIA',
      resumen: 'Caso cerrado.',
      distrito: 'Lima',
      activo: true,
      fechaCreacion: '2026-06-16T10:00:00',
      fechaActualizacion: '2026-06-16T10:00:00',
    });

    flushInitialLoad();
  });

  it('filters cases by case status', () => {
    flushInitialLoad();

    service.casos.set([
      {
        id: 'case-1',
        codigo: 'Caso #CASE-1',
        victim: 'Víctima uno',
        anonimo: false,
        edad: '30',
        distrito: 'Comas',
        tipo: 'Violencia Física',
        estado: 'En evaluación',
        riesgo: 'Moderado',
        asignado: 'Pendiente',
        fecha: '2026-06-16',
      },
      {
        id: 'case-2',
        codigo: 'Caso #CASE-2',
        victim: 'Víctima dos',
        anonimo: false,
        edad: '25',
        distrito: 'Lima',
        tipo: 'Violencia Psicológica',
        estado: 'En atención',
        riesgo: 'Alto',
        asignado: 'Psic.: Rosa Salas',
        fecha: '2026-06-17',
      },
    ]);

    service.casesStatusFilter.set('En atención');

    expect(service.filteredCasos()).toEqual([
      expect.objectContaining({
        id: 'case-2',
        estado: 'En atención',
      }),
    ]);
    expect(service.getFilteredCasosByStatus('En atención')).toHaveLength(1);
    expect(service.getFilteredCasosByStatus('En evaluación')).toHaveLength(0);
  });

  it('filters cases by date range, district and assignment status', () => {
    flushInitialLoad();

    service.casos.set([
      {
        id: 'case-1',
        codigo: 'Caso #CASE-1',
        victim: 'Víctima uno',
        anonimo: false,
        edad: '30',
        distrito: 'Comas',
        tipo: 'Violencia Física',
        estado: 'En evaluación',
        riesgo: 'Moderado',
        asignado: 'Pendiente de asignación',
        fecha: '2026-06-10',
      },
      {
        id: 'case-2',
        codigo: 'Caso #CASE-2',
        victim: 'Víctima dos',
        anonimo: false,
        edad: '25',
        distrito: 'Lima Cercado',
        tipo: 'Violencia Psicológica',
        estado: 'En atención',
        riesgo: 'Alto',
        asignado: 'Psic.: Rosa Salas',
        fecha: '2026-06-18',
      },
      {
        id: 'case-3',
        codigo: 'Caso #CASE-3',
        victim: 'Víctima tres',
        anonimo: false,
        edad: '28',
        distrito: 'Lima Cercado',
        tipo: 'Violencia Digital',
        estado: 'Derivado',
        riesgo: 'Leve',
        asignado: 'Pendiente de asignación',
        fecha: '2026-06-25',
      },
    ]);

    service.casesDateFromFilter.set('2026-06-15');
    service.casesDateToFilter.set('2026-06-20');
    service.casesDistrictFilter.set('Lima Cercado');
    service.casesAssignmentFilter.set('assigned');

    expect(service.filteredCasos()).toEqual([
      expect.objectContaining({
        id: 'case-2',
        distrito: 'Lima Cercado',
        fecha: '2026-06-18',
      }),
    ]);
  });

  it('clears all active case filters', () => {
    flushInitialLoad();

    service.casesSearchQuery.set('caso');
    service.casesRiskFilter.set('alto');
    service.casesStatusFilter.set('En atención');
    service.casesDateFromFilter.set('2026-06-01');
    service.casesDateToFilter.set('2026-06-30');
    service.casesDistrictFilter.set('Comas');
    service.casesAssignmentFilter.set('assigned');

    expect(service.hasActiveCaseFilters()).toBe(true);

    service.clearCaseFilters();

    expect(service.casesSearchQuery()).toBe('');
    expect(service.casesRiskFilter()).toBe('all');
    expect(service.casesStatusFilter()).toBe('all');
    expect(service.casesDateFromFilter()).toBe('');
    expect(service.casesDateToFilter()).toBe('');
    expect(service.casesDistrictFilter()).toBe('all');
    expect(service.casesAssignmentFilter()).toBe('all');
    expect(service.hasActiveCaseFilters()).toBe(false);
  });
});
