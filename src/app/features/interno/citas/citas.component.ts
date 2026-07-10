import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentsService, Cita } from '../../../core/services/appointments.service';
import { CasesService } from '../../../core/services/cases.service';
import { ToastService } from '../../../core/services/toast.service';
import { TrimOnBlurDirective } from '../../../shared/directives/trim-on-blur.directive';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, TrimOnBlurDirective],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.scss'
})
export class CitasComponent {
  protected readonly appointmentsService = inject(AppointmentsService);
  protected readonly casesService = inject(CasesService);
  protected readonly toastService = inject(ToastService);

  // Estados del modal de registro de resultado
  showResultadoModal = signal<boolean>(false);
  citaSeleccionada = signal<Cita | null>(null);
  nuevoEstado = signal<string>('Atendida');

  showToast(text: string, type: 'success' | 'error' | 'warning' | 'info') {
    this.toastService.show(text, type);
  }

  abrirModalResultado(cita: Cita) {
    this.citaSeleccionada.set(cita);
    this.nuevoEstado.set('Atendida');
    this.showResultadoModal.set(true);
  }

  guardarResultado() {
    const cita = this.citaSeleccionada();
    if (cita) {
      this.appointmentsService.actualizarEstadoCita(cita.id, this.nuevoEstado());
      this.showResultadoModal.set(false);
      this.citaSeleccionada.set(null);
    }
  }
}
