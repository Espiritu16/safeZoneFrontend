import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';
import { normalizeText } from '../../shared/utils/input-sanitizers.util';
import { VALIDATION_LIMITS, VALIDATION_PATTERNS } from '../../shared/utils/validation-rules';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);

  public readonly citas = signal<Cita[]>([]);
  public readonly showAppointmentModal = signal<boolean>(false);
  public readonly calendarView = signal<string>('mes');

  public nuevaCita = {
    casoId: '',
    tipo: 'Psicológica',
    fecha: '2026-05-28',
    hora: '10:00',
    notas: ''
  };

  private fallbackData: Cita[] = [
    { id: 'c1', tipo: 'Psicológica', caso: 'Caso #082-2026', doctor: 'Dra. Sofía Medina', fecha: '2026-05-22', hora: '09:00', estado: 'Pendiente', color: 'psychology' },
    { id: 'c2', tipo: 'Legal', caso: 'Caso #075-2026', doctor: 'Dra. Sofía Medina', fecha: '2026-05-22', hora: '11:30', estado: 'Completada', color: 'legal' },
    { id: 'c3', tipo: 'Evaluación', caso: 'Caso #079-2026', doctor: 'Dr. Carlos Rojas', fecha: '2026-05-23', hora: '15:00', estado: 'Pendiente', color: 'social' },
    { id: 'c4', tipo: 'Psicológica', caso: 'Caso #083-2026', doctor: 'Dr. Carlos Rojas', fecha: '2026-05-25', hora: '10:00', estado: 'Pendiente', color: 'psychology' }
  ];

  constructor() {
    this.loadCitas();
  }

  loadCitas() {
    this.http.get<Cita[]>('/api/citas').pipe(
      catchError(error => {
        console.warn('API /api/citas falló, usando fallback en memoria.', error);
        return of(this.fallbackData);
      })
    ).subscribe(data => {
      this.citas.set(data);
    });
  }

  saveCita() {
    this.nuevaCita.notas = normalizeText(this.nuevaCita.notas);

    if (!this.nuevaCita.casoId.trim()) {
      this.toastService.show('Seleccione un caso vinculado.', 'error');
      return;
    }
    if (!['Psicológica', 'Legal', 'Evaluación', 'PsicolÃ³gica', 'EvaluaciÃ³n'].includes(this.nuevaCita.tipo)) {
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
    
    // Validar disponibilidad del profesional (Fallback logic)
    const ocupado = this.citas().some(c => 
      c.doctor === doctorName && c.fecha === this.nuevaCita.fecha && c.hora === this.nuevaCita.hora
    );
    if (ocupado) {
      this.toastService.show('El profesional ya tiene una cita en ese horario.', 'error');
      return;
    }

    const nueva: Cita = {
      id: 'c' + (this.citas().length + 1),
      tipo: this.nuevaCita.tipo,
      caso: this.nuevaCita.casoId || 'Caso #082-2026',
      doctor: doctorName,
      fecha: this.nuevaCita.fecha,
      hora: this.nuevaCita.hora,
      estado: 'Pendiente',
      color: this.nuevaCita.tipo.startsWith('Psi') ? 'psychology' : (this.nuevaCita.tipo === 'Legal' ? 'legal' : 'social')
    };

    this.http.post<Cita>('/api/citas', nueva).pipe(
      catchError(error => {
        console.warn('API POST /api/citas falló, guardando en fallback local.', error);
        return of(nueva);
      })
    ).subscribe(result => {
      this.citas.update(c => [...c, result]);
      this.showAppointmentModal.set(false);
      this.toastService.show('Cita programada correctamente.', 'success');
      
      this.nuevaCita = {
        casoId: '',
        tipo: 'Psicológica',
        fecha: '2026-05-28',
        hora: '10:00',
        notas: ''
      };
    });
  }

  actualizarEstadoCita(id: string, estado: string) {
    this.http.put(`/api/citas/${id}/inactivar`, { estado }).pipe(
      catchError(error => {
        console.warn(`API PUT /api/citas/${id}/inactivar falló, usando fallback en memoria.`, error);
        return of({ id, estado });
      })
    ).subscribe(() => {
      this.citas.update(citas => citas.map(c => c.id === id ? { ...c, estado } : c));
      this.toastService.show(`Cita marcada como ${estado}.`, 'success');
    });
  }
}
