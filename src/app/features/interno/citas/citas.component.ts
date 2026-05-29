import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { CasesService } from '../../../core/services/cases.service';
import { ToastService } from '../../../core/services/toast.service';

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

  showToast(text: string, type: 'success' | 'error' | 'warning' | 'info') {
    this.toastService.show(text, type);
  }
}
