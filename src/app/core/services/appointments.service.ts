import { Injectable, signal, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';
import { normalizeText } from '../../shared/utils/input-sanitizers.util';
import { VALIDATION_LIMITS, VALIDATION_PATTERNS } from '../../shared/utils/validation-rules';

export interface Cita {
  id: string;
  tipo: string;
  caso: string;
  doctor: string;
  fecha: string;
  hora: string;
  estado: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);

  public readonly citas = signal<Cita[]>([
    { id: 'c1', tipo: 'Psicológica', caso: 'Caso #082-2026', doctor: 'Dra. Sofía Medina', fecha: '2026-05-22', hora: '09:00', estado: 'Pendiente', color: 'psychology' },
    { id: 'c2', tipo: 'Legal', caso: 'Caso #075-2026', doctor: 'Dra. Sofía Medina', fecha: '2026-05-22', hora: '11:30', estado: 'Completada', color: 'legal' },
    { id: 'c3', tipo: 'Evaluación', caso: 'Caso #079-2026', doctor: 'Dr. Carlos Rojas', fecha: '2026-05-23', hora: '15:00', estado: 'Pendiente', color: 'social' },
    { id: 'c4', tipo: 'Psicológica', caso: 'Caso #083-2026', doctor: 'Dr. Carlos Rojas', fecha: '2026-05-25', hora: '10:00', estado: 'Pendiente', color: 'psychology' }
  ]);

  public readonly showAppointmentModal = signal<boolean>(false);
  public readonly calendarView = signal<string>('mes');

  public nuevaCita = {
    casoId: '',
    tipo: 'Psicológica',
    fecha: '2026-05-28',
    hora: '10:00',
    notas: ''
  };

  saveCita() {
    this.nuevaCita.notas = normalizeText(this.nuevaCita.notas);

    if (!this.nuevaCita.casoId.trim()) {
      this.toastService.show('Seleccione un caso vinculado.', 'error');
      return;
    }
    if (!['PsicolÃ³gica', 'Legal', 'EvaluaciÃ³n'].includes(this.nuevaCita.tipo)) {
      this.toastService.show('Seleccione un tipo de asesoría válido.', 'error');
      return;
    }
    if (!this.nuevaCita.fecha || this.nuevaCita.fecha < new Date().toISOString().split('T')[0]) {
      this.toastService.show('La fecha de la cita no puede ser anterior a la fecha actual.', 'error');
      return;
    }
    if (!VALIDATION_PATTERNS.TIME_24H.test(this.nuevaCita.hora)) {
      this.toastService.show('Ingrese una hora válida en formato HH:mm.', 'error');
      return;
    }
    if (this.nuevaCita.notas.length > VALIDATION_LIMITS.NOTES_MAX) {
      this.toastService.show('Las notas no deben superar los 500 caracteres.', 'error');
      return;
    }

    const doctorName = this.authService.currentRole() === 'Psicólogo' ? 'Dr. Carlos Rojas' : 'Dra. Sofía Medina';
    const nueva: Cita = {
      id: 'c' + (this.citas().length + 1),
      tipo: this.nuevaCita.tipo,
      caso: this.nuevaCita.casoId || 'Caso #082-2026',
      doctor: doctorName,
      fecha: this.nuevaCita.fecha,
      hora: this.nuevaCita.hora,
      estado: 'Pendiente',
      color: this.nuevaCita.tipo === 'Psicológica' ? 'psychology' : (this.nuevaCita.tipo === 'Legal' ? 'legal' : 'social')
    };

    this.citas.update(c => [...c, nueva]);
    this.showAppointmentModal.set(false);
    this.toastService.show('Cita programada correctamente.', 'success');
    
    // Reset form
    this.nuevaCita = {
      casoId: '',
      tipo: 'Psicológica',
      fecha: '2026-05-28',
      hora: '10:00',
      notas: ''
    };
  }
}
