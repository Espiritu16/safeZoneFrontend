import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';
import { UsuarioHistorialService } from '../../../../core/services/usuario-historial.service';
import { UsuarioCasosPage } from './casos.page';

describe('UsuarioCasosPage', () => {
  let fixture: ComponentFixture<UsuarioCasosPage>;

  beforeEach(async () => {
    const serviceMock = {
      isLoading: signal(false).asReadonly(),
      error: signal('').asReadonly(),
      casos: signal([
        {
          tipo: 'CASO',
          id: 'caso-12345678',
          casoId: 'caso-12345678',
          titulo: 'Atención por violencia psicológica',
          detalle: 'Distrito: Comas',
          estado: 'EN_EVALUACION',
          fecha: '2026-07-01T10:00:00Z',
          metadata: { prioridad: 'ALTA', distrito: 'Comas' },
        },
      ]).asReadonly(),
      load: vi.fn().mockReturnValue(of({})),
      refresh: vi.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [UsuarioCasosPage],
      providers: [{ provide: UsuarioHistorialService, useValue: serviceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioCasosPage);
    fixture.detectChanges();
  });

  it('renders cases linked to the authenticated victim', () => {
    expect(fixture.nativeElement.textContent).toContain('Atención por violencia psicológica');
    expect(fixture.nativeElement.textContent).toContain('EN EVALUACION');
    expect(fixture.nativeElement.textContent).toContain('Prioridad: ALTA');
    expect(fixture.nativeElement.textContent).not.toContain('No hay casos vinculados a esta cuenta.');
  });
});
