import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentsService } from '../../core/services/appointments.service';
import { CasesService } from '../../core/services/cases.service';
import { ToastService } from '../../core/services/toast.service';
import { trimAndCollapse } from '../../shared/utils/validation.utils';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.scss'
})
export class CitasComponent {
  protected readonly appointmentsService = inject(AppointmentsService);
  protected readonly casesService = inject(CasesService);
  protected readonly toastService = inject(ToastService);

  errors = {
    casoId: '',
    fecha: '',
    hora: '',
    notas: ''
  };

  clearError(field: keyof typeof this.errors) {
    this.errors[field] = '';
  }

  showToast(text: string, type: 'success' | 'error' | 'warning' | 'info') {
    this.toastService.show(text, type);
  }

  openModal() {
    this.errors = { casoId: '', fecha: '', hora: '', notas: '' };
    // Inicializar fecha con la fecha actual o mañana si se desea
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.appointmentsService.nuevaCita.fecha = `${year}-${month}-${day}`;
    
    // Inicializar casoId si no hay ninguno seleccionado y hay casos disponibles
    const casos = this.casesService.casos();
    if (casos.length > 0 && !this.appointmentsService.nuevaCita.casoId) {
      this.appointmentsService.nuevaCita.casoId = casos[0].codigo;
    }
    
    this.appointmentsService.showAppointmentModal.set(true);
  }

  agendarCita() {
    let hasError = false;
    const form = this.appointmentsService.nuevaCita;

    // Sanitizar notas
    form.notas = trimAndCollapse(form.notas);

    // Validar casoId
    if (!form.casoId) {
      this.errors.casoId = 'El caso vinculado es obligatorio.';
      hasError = true;
    } else {
      this.errors.casoId = '';
    }

    // Validar fecha
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    if (!form.fecha) {
      this.errors.fecha = 'La fecha es obligatoria.';
      hasError = true;
    } else if (form.fecha < todayStr) {
      this.errors.fecha = 'La fecha no puede ser anterior a la fecha actual.';
      hasError = true;
    } else {
      this.errors.fecha = '';
    }

    // Validar hora
    if (!form.hora) {
      this.errors.hora = 'La hora es obligatoria.';
      hasError = true;
    } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(form.hora)) {
      this.errors.hora = 'La hora debe tener el formato HH:mm.';
      hasError = true;
    } else {
      this.errors.hora = '';
    }

    // Validar notas
    if (form.notas && form.notas.length > 500) {
      this.errors.notas = 'Las notas no pueden exceder los 500 caracteres.';
      hasError = true;
    } else {
      this.errors.notas = '';
    }

    if (hasError) {
      this.toastService.show('Por favor, corrija los errores del formulario.', 'error');
      return;
    }

    // Guardar cita
    this.appointmentsService.saveCita();
  }
}
