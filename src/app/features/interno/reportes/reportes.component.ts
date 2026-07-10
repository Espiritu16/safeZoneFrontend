import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { CasesService } from '../../../core/services/cases.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent {
  protected readonly toastService = inject(ToastService);
  protected readonly appointmentsService = inject(AppointmentsService);
  protected readonly casesService = inject(CasesService);

  // Filtros reactivos
  fechaDesde = signal<string>('');
  fechaHasta = signal<string>('');
  tipoViolencia = signal<string>('Todos');
  riesgo = signal<string>('Todos');

  // Tarjetas Dinámicas
  totalDenuncias = computed(() => {
    let casos = this.casesService.casos();
    if (this.tipoViolencia() !== 'Todos') {
      casos = casos.filter(c => c.tipo === this.tipoViolencia());
    }
    if (this.riesgo() !== 'Todos') {
      casos = casos.filter(c => c.riesgo === this.riesgo());
    }
    if (this.fechaDesde()) {
      casos = casos.filter(c => c.fecha >= this.fechaDesde());
    }
    if (this.fechaHasta()) {
      casos = casos.filter(c => c.fecha <= this.fechaHasta());
    }
    return casos.length;
  });

  consultasLegales = computed(() => {
    let citas = this.appointmentsService.citas().filter(c => c.tipo === 'Legal');
    if (this.fechaDesde()) citas = citas.filter(c => c.fecha >= this.fechaDesde());
    if (this.fechaHasta()) citas = citas.filter(c => c.fecha <= this.fechaHasta());
    return citas.length;
  });

  consultasPsicologicas = computed(() => {
    let citas = this.appointmentsService.citas().filter(c => c.tipo === 'Psicológica' || c.tipo === 'PsicolÃ³gica');
    if (this.fechaDesde()) citas = citas.filter(c => c.fecha >= this.fechaDesde());
    if (this.fechaHasta()) citas = citas.filter(c => c.fecha <= this.fechaHasta());
    return citas.length;
  });

  // Simulando dinámica de los gráficos en base a los filtros
  semanasData = computed(() => {
    // Si hay un filtro aplicado reducimos los valores para simular actualización en tiempo real
    const factor = (this.riesgo() === 'Severo' || this.tipoViolencia() !== 'Todos') ? 0.5 : 1;
    return [
      { height: 80 * factor, label: 'Semana 1', tooltip: `Riesgo Severo: ${Math.round(40 * factor)} casos`, isSevere: true },
      { height: 60 * factor, label: 'Semana 2', tooltip: `Riesgo Moderado: ${Math.round(30 * factor)} casos`, isSevere: false },
      { height: 90 * factor, label: 'Semana 3', tooltip: `Riesgo Severo: ${Math.round(45 * factor)} casos`, isSevere: true },
      { height: 50 * factor, label: 'Semana 4', tooltip: `Riesgo Leve: ${Math.round(25 * factor)} casos`, isSevere: false }
    ];
  });
}
