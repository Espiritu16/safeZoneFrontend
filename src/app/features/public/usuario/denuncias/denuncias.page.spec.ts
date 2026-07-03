import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../../../core/services/auth.service';
import { EvidenceService } from '../../../../core/services/evidence.service';
import { PredenunciasService } from '../../../../core/services/predenuncias.service';
import { UsuarioHistorialService } from '../../../../core/services/usuario-historial.service';
import { UsuarioDenunciasPage } from './denuncias.page';

describe('UsuarioDenunciasPage', () => {
  let fixture: ComponentFixture<UsuarioDenunciasPage>;
  let predenunciasService: { create: ReturnType<typeof vi.fn>; listMine: ReturnType<typeof vi.fn> };
  let evidenceService: any;
  let historialService: any;

  beforeEach(async () => {
    predenunciasService = {
      listMine: vi.fn().mockReturnValue(of([])),
      create: vi.fn().mockReturnValue(of({
        id: 'pred-12345678',
        estado: 'PENDIENTE',
        descripcionHecho: 'Descripcion suficientemente clara para la prueba',
        fechaCreacion: '2026-06-16T10:00:00',
        fechaActualizacion: '2026-06-16T10:00:00',
      })),
    };
    historialService = {
      isLoading: signal(false).asReadonly(),
      denuncias: signal([]).asReadonly(),
      load: vi.fn().mockReturnValue(of({})),
      refresh: vi.fn().mockReturnValue(of({})),
    };
    evidenceService = {
      pendingEvidence: signal([]).asReadonly(),
      uploadAll: vi.fn().mockReturnValue(of([])),
      clearPending: vi.fn(),
      onFileSelected: vi.fn(),
      removeFile: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UsuarioDenunciasPage],
      providers: [
        provideRouter([]),
        { provide: PredenunciasService, useValue: predenunciasService },
        { provide: EvidenceService, useValue: evidenceService },
        { provide: UsuarioHistorialService, useValue: historialService },
        {
          provide: AuthService,
          useValue: {
            nombre: () => 'Lucia Perez',
            correo: () => 'lucia@example.com',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioDenunciasPage);
    fixture.detectChanges();
  });

  it('opens the compact predenuncia form in the same victim page', () => {
    expect(fixture.nativeElement.textContent).not.toContain('Registrar nueva predenuncia');

    const openButton = fixture.debugElement.query(By.css('[data-testid="open-new-predenuncia"]'));
    openButton.triggerEventHandler('click');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Registrar nueva predenuncia');
    expect(fixture.nativeElement.textContent).toContain('Progreso');
    expect(fixture.nativeElement.textContent).toContain('Seleccione el tipo de situacion');
    expect(fixture.nativeElement.textContent).toContain('Violencia Psicologica');
    expect(fixture.nativeElement.textContent).toContain('Encriptacion de Extremo a Extremo');
    expect(fixture.nativeElement.textContent).toContain('Emergencia inmediata');
  });

  it('loads and displays predenuncias linked to the logged victim', () => {
    predenunciasService.listMine.mockReturnValue(of([
      {
        id: 'pred-abc12345',
        estado: 'PENDIENTE',
        victimaId: 'victima-1',
        tipoViolencia: 'FISICA',
        distrito: 'Comas',
        descripcionHecho: 'Descripcion registrada desde el panel de victima',
        fechaCreacion: '2026-06-17T10:00:00',
        fechaActualizacion: '2026-06-17T10:00:00',
      },
    ]));

    fixture = TestBed.createComponent(UsuarioDenunciasPage);
    fixture.detectChanges();

    expect(predenunciasService.listMine).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('PD-PRED-ABC');
    expect(fixture.nativeElement.textContent).toContain('PENDIENTE');
    expect(fixture.nativeElement.textContent).toContain('FISICA');
    expect(fixture.nativeElement.textContent).not.toContain('Aún no hay denuncias vinculadas a esta cuenta.');
  });

  it('loads and displays formal denuncias from the authenticated history', async () => {
    historialService.denuncias = signal([
      {
        tipo: 'DENUNCIA',
        id: 'den-12345678',
        casoId: 'caso-12345678',
        titulo: 'PSICOLOGICA',
        detalle: 'Denuncia formal de prueba vinculada a la victima.',
        estado: 'ALTO',
        fecha: '2026-06-19T10:00:00',
        metadata: { nivelRiesgo: 'ALTO' },
      },
    ]).asReadonly();

    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [UsuarioDenunciasPage],
        providers: [
          provideRouter([]),
          { provide: PredenunciasService, useValue: predenunciasService },
          { provide: EvidenceService, useValue: evidenceService },
          { provide: UsuarioHistorialService, useValue: historialService },
          {
            provide: AuthService,
            useValue: {
              nombre: () => 'Lucia Perez',
              correo: () => 'lucia@example.com',
            },
          },
        ],
      })
      .compileComponents();

    fixture = TestBed.createComponent(UsuarioDenunciasPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('DN-DEN-1234');
    expect(fixture.nativeElement.textContent).toContain('Denuncia formal');
    expect(fixture.nativeElement.textContent).toContain('CASO CASO-123');
  });

  it('opens a compact record consultation panel for linked victim records', () => {
    predenunciasService.listMine.mockReturnValue(of([
      {
        id: 'pred-abc12345',
        estado: 'PENDIENTE',
        victimaId: 'victima-1',
        tipoViolencia: 'FISICA',
        distrito: 'Comas',
        descripcionHecho: 'Descripcion registrada desde el panel de victima',
        fechaCreacion: '2026-06-17T10:00:00',
        fechaActualizacion: '2026-06-18T09:30:00',
      },
    ]));

    fixture = TestBed.createComponent(UsuarioDenunciasPage);
    fixture.detectChanges();

    click('[data-testid="open-case-consultation"]');

    expect(fixture.nativeElement.textContent).toContain('Consulta de registro');
    expect(fixture.nativeElement.textContent).toContain('Resumen del registro');
    expect(fixture.nativeElement.textContent).toContain('PD-PRED-ABC');
    expect(fixture.nativeElement.textContent).toContain('Revisión inicial');
    expect(fixture.nativeElement.textContent).toContain('Cronología del proceso');
    expect(fixture.nativeElement.textContent).toContain('Seguridad institucional');
  });

  it('moves through the compact predenuncia wizard steps', () => {
    const openButton = fixture.debugElement.query(By.css('[data-testid="open-new-predenuncia"]'));
    openButton.triggerEventHandler('click');
    fixture.detectChanges();

    setRadio('[data-testid="tipo-violencia-PSICOLOGICA"]');
    click('[data-testid="continue-step-1"]');

    expect(fixture.nativeElement.textContent).toContain('Detalle de los hechos');
    expect(fixture.nativeElement.textContent).not.toContain('Seleccione el tipo de situacion');

    setInput('[data-testid="fecha-incidente"]', '2026-06-15');
    setInput('[data-testid="distrito"]', 'Comas');
    setInput('[data-testid="descripcion-hecho"]', 'Descripcion suficientemente clara para registrar una predenuncia.');
    click('[data-testid="continue-step-2"]');

    expect(fixture.nativeElement.textContent).toContain('Evidencias opcionales');
    click('[data-testid="continue-step-3"]');

    expect(fixture.nativeElement.textContent).toContain('Informacion de contacto');
    setInput('[data-testid="contacto-valor"]', '999888777');
    click('[data-testid="continue-step-4"]');

    expect(fixture.nativeElement.textContent).toContain('Revision y envio');
    expect(fixture.nativeElement.textContent).toContain('PSICOLOGICA');
  });

  it('submits a compact predenuncia from the victim page', () => {
    const openButton = fixture.debugElement.query(By.css('[data-testid="open-new-predenuncia"]'));
    openButton.triggerEventHandler('click');
    fixture.detectChanges();

    setRadio('[data-testid="tipo-violencia-PSICOLOGICA"]');
    click('[data-testid="continue-step-1"]');
    setInput('[data-testid="fecha-incidente"]', '2026-06-15');
    setInput('[data-testid="distrito"]', 'Comas');
    setInput('[data-testid="descripcion-hecho"]', 'Descripcion suficientemente clara para registrar una predenuncia.');
    click('[data-testid="continue-step-2"]');
    click('[data-testid="continue-step-3"]');
    setInput('[data-testid="contacto-valor"]', '999888777');
    click('[data-testid="continue-step-4"]');
    setCheckbox('[data-testid="acepto-terminos"]', true);

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit');

    expect(predenunciasService.create).toHaveBeenCalledWith({
      nombresContacto: 'Lucia Perez',
      apellidosContacto: 'No especificado',
      telefonoContacto: '999888777',
      correoContacto: 'lucia@example.com',
      descripcionHecho: 'Descripcion suficientemente clara para registrar una predenuncia.',
      tipoViolencia: 'PSICOLOGICA',
      fechaIncidente: '2026-06-15T05:00:00.000Z',
      distrito: 'Comas',
      direccionReferencia: 'Registrada desde el panel de victima',
      anonima: false,
    });
    expect(evidenceService.uploadAll).toHaveBeenCalledWith(undefined, undefined, 'pred-12345678');
  });

  function setInput(selector: string, value: string): void {
    const input = fixture.debugElement.query(By.css(selector)).nativeElement as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  function setRadio(selector: string): void {
    const input = fixture.debugElement.query(By.css(selector)).nativeElement as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  function setCheckbox(selector: string, checked: boolean): void {
    const input = fixture.debugElement.query(By.css(selector)).nativeElement as HTMLInputElement;
    input.checked = checked;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  function click(selector: string): void {
    const element = fixture.debugElement.query(By.css(selector));
    element.triggerEventHandler('click');
    fixture.detectChanges();
  }
});
