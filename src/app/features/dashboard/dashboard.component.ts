import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CasesService } from '../../core/services/cases.service';
import { AppointmentsService } from '../../core/services/appointments.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  protected readonly authService = inject(AuthService);
  protected readonly casesService = inject(CasesService);
  protected readonly appointmentsService = inject(AppointmentsService);
  protected readonly toastService = inject(ToastService);

  showToast(text: string, type: 'success' | 'error' | 'warning' | 'info') {
    this.toastService.show(text, type);
  }

  viewCaseDetails(caso: any) {
    this.casesService.viewCaseDetails(caso);
  }
}
