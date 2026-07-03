import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UsuarioHistorialService } from '../../../../core/services/usuario-historial.service';
import { UsuarioDashboardPage } from './usuario-dashboard.page';

describe('UsuarioDashboardPage', () => {
  let fixture: ComponentFixture<UsuarioDashboardPage>;

  beforeEach(async () => {
    const serviceMock = {
      isLoading: signal(false).asReadonly(),
      error: signal('').asReadonly(),
      casos: signal([{ id: 'caso-1' }]).asReadonly(),
      citas: signal([{ id: 'cita-1' }]).asReadonly(),
      evidencias: signal([{ id: 'evidencia-1' }]).asReadonly(),
      denuncias: signal([{ id: 'denuncia-1' }]).asReadonly(),
      lineaTiempo: signal([
        {
          tipo: 'CASO',
          id: 'caso-1',
          titulo: 'Caso registrado',
          detalle: 'Distrito: Comas',
          estado: 'REGISTRADO',
          fecha: '2026-07-01T10:00:00Z',
          metadata: {},
        },
      ]).asReadonly(),
      load: vi.fn().mockReturnValue(of({})),
      refresh: vi.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [UsuarioDashboardPage],
      providers: [{ provide: UsuarioHistorialService, useValue: serviceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioDashboardPage);
    fixture.detectChanges();
  });

  it('renders linked victim activity summary', () => {
    expect(fixture.nativeElement.textContent).toContain('Casos vinculados');
    expect(fixture.nativeElement.textContent).toContain('Citas registradas');
    expect(fixture.nativeElement.textContent).toContain('Evidencias visibles');
    expect(fixture.nativeElement.textContent).toContain('Caso registrado');
  });
});
