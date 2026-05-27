import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { ToastContainerComponent } from '../../../shared/components/toast-container/toast-container.component';
import { GlobalLoaderComponent } from '../../../shared/components/global-loader/global-loader.component';
import { LayoutService } from '../../services/layout.service';
import { CasesService } from '../../services/cases.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    TopbarComponent,
    ToastContainerComponent,
    GlobalLoaderComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  protected readonly layoutService = inject(LayoutService);
  protected readonly casesService = inject(CasesService);
  protected readonly toastService = inject(ToastService);
}
