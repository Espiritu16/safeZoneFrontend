import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastContainerComponent } from '../../../shared/components/toast-container/toast-container.component';
import { GlobalLoaderComponent } from '../../../shared/components/global-loader/global-loader.component';

@Component({
  selector: 'app-victim-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastContainerComponent, GlobalLoaderComponent],
  templateUrl: './victim-layout.component.html',
  styleUrl: './victim-layout.component.scss'
})
export class VictimLayoutComponent {
  protected readonly authService = inject(AuthService);
}
