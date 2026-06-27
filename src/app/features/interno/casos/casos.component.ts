import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CasesService, Caso } from '../../../core/services/cases.service';
import type { PrioridadCaso, EstadoCaso, ActualizarCasoRequest } from '../../../core/models/api.models';

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

  confirmDelete() {
    const caso = this.caseToDelete();
    if (caso) {
      this.casesService.closedCase(caso.id);
    }
    this.closeDeleteModal();
  }

  saveEdit() {
    const editing = this.casesService.editingCase();
    if (!editing) return;

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

    const request: ActualizarCasoRequest = {
      resumen: editing.resumen,
      distrito: editing.distrito,
      prioridad: prioridadMap[editing.riesgo] || 'MEDIA',
      estado: estadoMap[editing.estado] || 'EN_EVALUACION'
    };

    this.casesService.editCase(editing.id, request);
    this.casesService.closeModal();
  }
}
