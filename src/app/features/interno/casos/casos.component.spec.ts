import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { CasesService, type Caso } from '../../../core/services/cases.service';
import { CasosComponent } from './casos.component';

describe('CasosComponent', () => {
  let fixture: ComponentFixture<CasosComponent>;
  let component: CasosComponent;
  let casesService: {
    showModal: ReturnType<typeof signal<boolean>>;
    editingCase: ReturnType<typeof signal<Caso | null>>;
    profesionales: ReturnType<typeof signal<unknown[]>>;
    filteredCasos: ReturnType<typeof vi.fn>;
    totalCasos: ReturnType<typeof vi.fn>;
    getFilteredCasosByStatus: ReturnType<typeof vi.fn>;
    hasActiveCaseFilters: ReturnType<typeof vi.fn>;
    casesSearchQuery: ReturnType<typeof signal<string>>;
    casesAliasFilter: ReturnType<typeof signal<string>>;
    casesRiskFilter: ReturnType<typeof signal<string>>;
    casesStatusFilter: ReturnType<typeof signal<string>>;
    casesDistrictFilter: ReturnType<typeof signal<string>>;
    casesAssignmentFilter: ReturnType<typeof signal<string>>;
    casesDateFromFilter: ReturnType<typeof signal<string>>;
    casesDateToFilter: ReturnType<typeof signal<string>>;
    clearCaseFilters: ReturnType<typeof vi.fn>;
    loadCasos: ReturnType<typeof vi.fn>;
    moveCase: ReturnType<typeof vi.fn>;
    closedCase: ReturnType<typeof vi.fn>;
    closeModal: ReturnType<typeof vi.fn>;
    openEditModal: ReturnType<typeof vi.fn>;
    viewCaseDetails: ReturnType<typeof vi.fn>;
    updateCaseWithAssignments: ReturnType<typeof vi.fn>;
  };

  const caso: Caso = {
    id: 'case-1',
    codigo: 'Caso #CASE-1',
    victim: 'Victima Demo',
    anonimo: false,
    edad: '30',
    distrito: 'Comas',
    tipo: 'Violencia Fisica',
    estado: 'En evaluación',
    riesgo: 'Moderado',
    asignado: 'Pendiente',
    fecha: '2026-06-28',
    resumen: 'Resumen del caso de prueba.',
  };

  beforeEach(async () => {
    casesService = {
      showModal: signal(false),
      editingCase: signal(null),
      profesionales: signal([]),
      filteredCasos: vi.fn().mockReturnValue([]),
      totalCasos: vi.fn().mockReturnValue(0),
      getFilteredCasosByStatus: vi.fn().mockReturnValue([]),
      hasActiveCaseFilters: vi.fn().mockReturnValue(false),
      casesSearchQuery: signal(''),
      casesAliasFilter: signal(''),
      casesRiskFilter: signal('all'),
      casesStatusFilter: signal('all'),
      casesDistrictFilter: signal('all'),
      casesAssignmentFilter: signal('all'),
      casesDateFromFilter: signal(''),
      casesDateToFilter: signal(''),
      clearCaseFilters: vi.fn(),
      loadCasos: vi.fn(),
      moveCase: vi.fn(),
      closedCase: vi.fn(),
      closeModal: vi.fn(),
      openEditModal: vi.fn(),
      viewCaseDetails: vi.fn(),
      updateCaseWithAssignments: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CasosComponent],
      providers: [
        provideRouter([]),
        { provide: CasesService, useValue: casesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CasosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('solicita confirmacion antes de mover un caso por drag and drop', () => {
    (component as any).dropCase({
      item: { data: caso },
      container: { data: 'En atención' },
    });

    expect(casesService.moveCase).not.toHaveBeenCalled();
    expect((component as any).pendingStatusMove()).toEqual({
      caso,
      targetStatus: 'En atención',
    });
  });

  it('mueve el caso solo cuando se confirma el cambio de estado', () => {
    (component as any).requestCaseMove(caso, 'En atención');

    (component as any).confirmStatusMove();

    expect(casesService.moveCase).toHaveBeenCalledWith('case-1', 'En atención');
    expect((component as any).pendingStatusMove()).toBeNull();
  });

  it('cancela el cambio de estado sin llamar al backend', () => {
    (component as any).requestCaseMove(caso, 'En atención');

    (component as any).closeStatusMoveModal();

    expect(casesService.moveCase).not.toHaveBeenCalled();
    expect((component as any).pendingStatusMove()).toBeNull();
  });
});
