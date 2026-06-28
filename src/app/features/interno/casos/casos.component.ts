import { Component, ViewChild, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CasesService, Caso } from '../../../core/services/cases.service';
import type { PrioridadCaso, EstadoCaso, ActualizarCasoRequest } from '../../../core/models/api.models';

interface KanbanColumn {
  title: string;
  status: string;
  dotClass: string;
  previousStatus?: string;
  nextStatus?: string;
}

interface CaseEditFormValue {
  riesgo?: string;
  estado?: string;
  psicologoId?: string;
  defensorId?: string;
  distrito?: string;
  resumen?: string;
}

interface PendingStatusMove {
  caso: Caso;
  targetStatus: string;
}

@Component({
  selector: 'app-casos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DragDropModule],
  templateUrl: './casos.component.html',
  styleUrl: './casos.component.scss'
})
export class CasosComponent {
  protected readonly casesService = inject(CasesService);
  protected readonly casesViewMode = signal<string>('table');
  protected readonly dragStartDelay = { touch: 0, mouse: 0 };
  @ViewChild('editForm') private editForm?: NgForm;
  protected readonly kanbanColumns: KanbanColumn[] = [
    { title: 'Registrado', status: 'Registrado', dotClass: 'sz-dot-warning', nextStatus: 'En evaluación' },
    { title: 'Evaluación', status: 'En evaluación', dotClass: 'sz-dot-warning', nextStatus: 'En atención' },
    { title: 'En atención', status: 'En atención', dotClass: 'sz-dot-info', previousStatus: 'En evaluación', nextStatus: 'Derivado' },
    { title: 'Derivado', status: 'Derivado', dotClass: 'sz-dot-success', previousStatus: 'En atención' },
    { title: 'Cerrado', status: 'Cerrado', dotClass: 'sz-dot-muted', nextStatus: 'Archivado' },
    { title: 'Archivado', status: 'Archivado', dotClass: 'sz-dot-muted' },
  ];
  protected readonly statusFilterOptions = [
    { label: 'Todos los estados', value: 'all' },
    ...this.kanbanColumns.map((column) => ({ label: column.title, value: column.status })),
  ];
  private readonly statusOptions = ['Registrado', 'En evaluación', 'En atención', 'Derivado', 'Cerrado', 'Archivado'];
  private readonly allowedStatusTransitions = new Map<string, string[]>([
    ['Registrado', ['En evaluación']],
    ['En evaluación', ['En atención', 'Cerrado']],
    ['En atención', ['En evaluación', 'Derivado', 'Cerrado']],
    ['Derivado', ['En atención', 'Cerrado']],
    ['Cerrado', ['Archivado']],
    ['Archivado', []],
  ]);
  protected readonly psicologos = computed(() =>
    this.casesService.profesionales().filter((usuario) => usuario.rol === 'PSICOLOGO'),
  );
  protected readonly defensores = computed(() =>
    this.casesService.profesionales().filter((usuario) => usuario.rol === 'DEFENSOR'),
  );

  // Delete modal state
  protected readonly showDeleteModal = signal<boolean>(false);
  protected readonly caseToDelete = signal<Caso | null>(null);
  protected readonly pendingStatusMove = signal<PendingStatusMove | null>(null);

  // Available districts
  protected readonly distritos = [
    'Lima Cercado',
    'Comas',
    'Los Olivos',
    'Puente Piedra',
    'Villa El Salvador',
    'San Juan de Lurigancho',
    'San Martín de Porres'
  ];

  openDeleteModal(caso: Caso) {
    this.caseToDelete.set(caso);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.caseToDelete.set(null);
  }

  protected dropCase(event: CdkDragDrop<string>) {
    const caso = event.item.data as Caso | undefined;
    const targetStatus = event.container.data;
    if (!caso || !targetStatus) {
      return;
    }

    this.requestCaseMove(caso, targetStatus);
  }

  protected requestCaseMove(caso: Caso, targetStatus: string): void {
    if (caso.estado === targetStatus || !this.canMoveStatus(caso.estado, targetStatus)) {
      return;
    }

    this.pendingStatusMove.set({ caso, targetStatus });
  }

  protected closeStatusMoveModal(): void {
    this.pendingStatusMove.set(null);
  }

  protected confirmStatusMove(): void {
    const move = this.pendingStatusMove();
    if (!move) {
      return;
    }

    this.casesService.moveCase(move.caso.id, move.targetStatus);
    this.closeStatusMoveModal();
  }

  protected previousStatus(column: KanbanColumn): string | null {
    return column.previousStatus ?? null;
  }

  protected nextStatus(column: KanbanColumn): string | null {
    return column.nextStatus ?? null;
  }

  protected canCloseCase(caso: Caso): boolean {
    return ['En evaluación', 'En atención', 'Derivado'].includes(caso.estado);
  }

  protected editableStatusOptions(caso: Caso): string[] {
    const allowed = this.allowedStatusTransitions.get(caso.estado) ?? [];
    return this.statusOptions.filter((status) => status === caso.estado || allowed.includes(status));
  }

  private canMoveStatus(currentStatus: string, targetStatus: string): boolean {
    return this.allowedStatusTransitions.get(currentStatus)?.includes(targetStatus) ?? false;
  }

  protected updateEditingCase<K extends keyof Caso>(field: K, value: Caso[K]) {
    const editing = this.casesService.editingCase();
    if (!editing) return;

    this.casesService.editingCase.set({
      ...editing,
      [field]: value,
    });
  }

  confirmDelete() {
    const caso = this.caseToDelete();
    if (caso) {
      this.casesService.closedCase(caso.id);
    }
    this.closeDeleteModal();
  }

  saveEdit(formValue?: CaseEditFormValue) {
    const editing = this.casesService.editingCase();
    if (!editing) return;
    formValue ??= (this.editForm?.value ?? {}) as CaseEditFormValue;

    const prioridadMap: Record<string, PrioridadCaso> = {
      'Leve': 'BAJA',
      'Moderado': 'MEDIA',
      'Alto': 'ALTA',
      'Severo': 'CRITICA'
    };

    const estadoMap: Record<string, EstadoCaso> = {
      'Registrado': 'REGISTRADO',
      'En evaluación': 'EN_EVALUACION',
      'En atención': 'EN_ATENCION',
      'Derivado': 'DERIVADO',
      'Cerrado': 'CERRADO',
      'Archivado': 'ARCHIVADO'
    };

    const riesgo = formValue.riesgo || editing.riesgo;
    const estado = formValue.estado || editing.estado;
    const resumen = formValue.resumen ?? editing.resumen;
    const distrito = formValue.distrito || editing.distrito;
    const psicologoId = formValue.psicologoId || editing.psicologoId;
    const defensorId = formValue.defensorId || editing.defensorId;

    const request: ActualizarCasoRequest = {
      resumen,
      distrito,
      prioridad: prioridadMap[riesgo] || 'MEDIA',
      estado: estadoMap[estado] || 'EN_EVALUACION'
    };

    this.casesService.updateCaseWithAssignments(
      editing.id,
      request,
      psicologoId,
      defensorId,
    );
  }
}
