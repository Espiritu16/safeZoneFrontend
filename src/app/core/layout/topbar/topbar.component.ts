import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';
import { LoadingService } from '../../../core/services/loading.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  protected readonly authService = inject(AuthService);
  protected readonly layoutService = inject(LayoutService);
  protected readonly loadingService = inject(LoadingService);
  protected readonly toastService = inject(ToastService);

  changeRole(event: Event) {
    const role = (event.target as HTMLSelectElement).value;
    this.authService.changeRole(role);
  }

  triggerLoading() {
    this.loadingService.triggerLoading(800);
  }

  showNotificationsToast() {
    this.toastService.show('No hay notificaciones críticas pendientes.', 'info');
  }
}
