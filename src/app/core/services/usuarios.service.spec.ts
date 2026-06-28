import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { UsuariosService } from './usuarios.service';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UsuariosService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('creates users through the backend endpoint', () => {
    const request = {
      correo: 'recepcion@safezone.gob.pe',
      contrasena: 'ClaveSegura123!',
      nombres: 'Maria',
      apellidos: 'Torres',
      dni: '45678912',
      telefono: '999888777',
      distrito: 'Comas',
      rol: 'RECEPCIONISTA' as const,
    };

    service.create(request).subscribe((response) => {
      expect(response.correo).toBe('recepcion@safezone.gob.pe');
      expect(response.rol).toBe('RECEPCIONISTA');
    });

    const httpRequest = http.expectOne('http://localhost:8080/api/usuarios');
    expect(httpRequest.request.method).toBe('POST');
    expect(httpRequest.request.body).toEqual(request);
    httpRequest.flush({ id: 'usuario-1', ...request, activo: true });
  });

  it('updates users and inactivates them without deleting records', () => {
    service.update('usuario-1', { nombres: 'Ana', rol: 'PSICOLOGO', activo: false }).subscribe();

    const updateRequest = http.expectOne('http://localhost:8080/api/usuarios/usuario-1');
    expect(updateRequest.request.method).toBe('PUT');
    expect(updateRequest.request.body).toEqual({ nombres: 'Ana', rol: 'PSICOLOGO', activo: false });
    updateRequest.flush({
      id: 'usuario-1',
      correo: 'ana@safezone.gob.pe',
      nombres: 'Ana',
      apellidos: 'Rojas',
      dni: '12345678',
      rol: 'PSICOLOGO',
      activo: false,
    });

    service.inactivar('usuario-1').subscribe();

    const inactivarRequest = http.expectOne('http://localhost:8080/api/usuarios/usuario-1/inactivar');
    expect(inactivarRequest.request.method).toBe('PATCH');
    expect(inactivarRequest.request.body).toEqual({});
    inactivarRequest.flush(null);
  });
});
