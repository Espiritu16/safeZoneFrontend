import { Component, ViewChild, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CasesService, Caso } from '../../../core/services/cases.service';
import type { PrioridadCaso, EstadoCaso, ActualizarCasoRequest } from '../../../core/models/api.models';

interface CaseEditFormValue {
  riesgo?: string;
  estado?: string;
  psicologoId?: string;
  defensorId?: string;
  distrito?: string;
  resumen?: string;
}

@Component({
  selector: 'app-casos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './casos.component.html',
  styleUrl: './casos.component.scss'
})
export class CasosComponent {
  protected readonly casesService = inject(CasesService);
  protected readonly casesViewMode = signal<string>('table');
  @ViewChild('editForm') private editForm?: NgForm;
  protected readonly psicologos = computed(() =>
    this.casesService.profesionales().filter((usuario) => usuario.rol === 'PSICOLOGO'),
  );
  protected readonly defensores = computed(() =>
    this.casesService.profesionales().filter((usuario) => usuario.rol === 'DEFENSOR'),
  );

  // Delete modal state
  protected readonly showDeleteModal = signal<boolean>(false);
  protected readonly caseToDelete = signal<Caso | null>(null);

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
