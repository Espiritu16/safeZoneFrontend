import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SeguimientosService } from './seguimientos.service';

describe('SeguimientosService', () => {
  let service: SeguimientosService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SeguimientosService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('crea observaciones sin enviar autorId desde el frontend', () => {
    service
      .create({
        casoId: 'caso-1',
        tipoSeguimiento: 'OBSERVACION',
        contenido: 'Se registra observacion inicial.',
        proximaAccion: 'Programar cita psicologica.',
      })
      .subscribe();

    const request = http.expectOne('http://localhost:8080/api/seguimientos');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      casoId: 'caso-1',
      tipoSeguimiento: 'OBSERVACION',
      contenido: 'Se registra observacion inicial.',
      proximaAccion: 'Programar cita psicologica.',
    });
    request.flush({
      id: 'seguimiento-1',
      casoId: 'caso-1',
      autorId: 'profesional-1',
      rolAutor: 'PSICOLOGO',
      tipoSeguimiento: 'OBSERVACION',
      contenido: 'Se registra observacion inicial.',
      proximaAccion: 'Programar cita psicologica.',
      activo: true,
      fechaCreacion: '2026-07-02T10:00:00',
      fechaActualizacion: '2026-07-02T10:00:00',
    });
  });

  it('convierte fecha datetime-local a ISO con zona horaria antes de crear observacion', () => {
    service
      .create({
        casoId: 'caso-1',
        tipoSeguimiento: 'OBSERVACION',
        contenido: 'Se registra observacion con proxima accion.',
        proximaAccion: 'Programar llamada de seguimiento.',
        fechaProximaAccion: '2026-07-19T08:09',
      })
      .subscribe();

    const request = http.expectOne('http://localhost:8080/api/seguimientos');
    expect(request.request.body.fechaProximaAccion).toBe(new Date('2026-07-19T08:09').toISOString());
    request.flush({
      id: 'seguimiento-2',
      casoId: 'caso-1',
      autorId: 'profesional-1',
      rolAutor: 'PSICOLOGO',
      tipoSeguimiento: 'OBSERVACION',
      contenido: 'Se registra observacion con proxima accion.',
      proximaAccion: 'Programar llamada de seguimiento.',
      fechaProximaAccion: new Date('2026-07-19T08:09').toISOString(),
      activo: true,
      fechaCreacion: '2026-07-02T10:00:00',
      fechaActualizacion: '2026-07-02T10:00:00',
    });
  });
});
