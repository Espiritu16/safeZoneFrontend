import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { PredenunciasService } from './predenuncias.service';

describe('PredenunciasService', () => {
  let service: PredenunciasService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PredenunciasService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('posts public predenuncia data to the backend endpoint', () => {
    service.create({
      nombresContacto: 'Kevin',
      telefonoContacto: '999999999',
      descripcionHecho: 'Descripcion suficientemente amplia para el registro.',
      tipoViolencia: 'FISICA',
      distrito: 'Lima',
    }).subscribe((response) => {
      expect(response.id).toBe('pd-1');
    });

    const request = http.expectOne('http://localhost:8080/api/predenuncias');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.tipoViolencia).toBe('FISICA');
    request.flush({ id: 'pd-1', estado: 'PENDIENTE', fechaCreacion: '2026-06-16', fechaActualizacion: '2026-06-16' });
  });

  it('formalizes an in-contact predenuncia with victim and risk data', () => {
    service.formalize('pd-1', {
      victimaId: 'victima-1',
      nivelRiesgo: 'ALTO',
    }).subscribe((response) => {
      expect(response.estado).toBe('FORMALIZADA');
      expect(response.denunciaId).toBe('denuncia-1');
      expect(response.casoId).toBe('caso-1');
    });

    const request = http.expectOne('http://localhost:8080/api/predenuncias/pd-1/formalizar');
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ victimaId: 'victima-1', nivelRiesgo: 'ALTO' });
    request.flush({
      id: 'pd-1',
      estado: 'FORMALIZADA',
      denunciaId: 'denuncia-1',
      casoId: 'caso-1',
      fechaCreacion: '2026-06-16',
      fechaActualizacion: '2026-06-16',
    });
  });

  it('formalizes an in-contact predenuncia under anonymous alias', () => {
    service.formalize('pd-2', {
      nivelRiesgo: 'CRITICO',
      formalizarAnonima: true,
    }).subscribe((response) => {
      expect(response.estado).toBe('FORMALIZADA');
      expect(response.victimaId).toBe('victima-alias-1');
    });

    const request = http.expectOne('http://localhost:8080/api/predenuncias/pd-2/formalizar');
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ nivelRiesgo: 'CRITICO', formalizarAnonima: true });
    request.flush({
      id: 'pd-2',
      estado: 'FORMALIZADA',
      victimaId: 'victima-alias-1',
      denunciaId: 'denuncia-2',
      casoId: 'caso-2',
      fechaCreacion: '2026-06-16',
      fechaActualizacion: '2026-06-16',
    });
  });
});
