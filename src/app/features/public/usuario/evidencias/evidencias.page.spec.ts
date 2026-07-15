import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UsuarioHistorialService } from '../../../../core/services/usuario-historial.service';
import { UsuarioEvidenciasPage } from './evidencias.page';

describe('UsuarioEvidenciasPage', () => {
  let fixture: ComponentFixture<UsuarioEvidenciasPage>;

  beforeEach(async () => {
    const serviceMock = {
      isLoading: signal(false).asReadonly(),
      error: signal('').asReadonly(),
      evidencias: signal([
        {
          tipo: 'EVIDENCIA',
          id: 'evidencia-1',
          casoId: 'caso-12345678',
          titulo: 'captura-chat.pdf',
          detalle: 'Archivo asociado al expediente',
          estado: 'application/pdf',
          fecha: '2026-07-13T12:00:00Z',
          metadata: {
            nombreOriginal: 'captura-chat.pdf',
            tipoMime: 'application/pdf',
            denunciaId: 'denuncia-12345678',
            predenunciaId: 'N/A',
          },
        },
      ]).asReadonly(),
      load: vi.fn().mockReturnValue(of({})),
      refresh: vi.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [UsuarioEvidenciasPage],
      providers: [{ provide: UsuarioHistorialService, useValue: serviceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioEvidenciasPage);
    fixture.detectChanges();
  });

  it('renders preview action for linked evidence', () => {
    expect(fixture.nativeElement.textContent).toContain('captura-chat.pdf');
    expect(fixture.nativeElement.textContent).toContain('Previsualizar');
  });
});
