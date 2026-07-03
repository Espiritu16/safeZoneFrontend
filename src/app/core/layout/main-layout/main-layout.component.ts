import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { ToastContainerComponent } from '../../../shared/components/toast-container/toast-container.component';
import { GlobalLoaderComponent } from '../../../shared/components/global-loader/global-loader.component';
import { LayoutService } from '../../services/layout.service';
import { CasesService } from '../../services/cases.service';
import { ToastService } from '../../services/toast.service';
import { SeguimientosService } from '../../services/seguimientos.service';
import type { SeguimientoCasoResponse } from '../../models/api.models';

type SeguimientoForm = {
  tipoSeguimiento: string;
  contenido: string;
  proximaAccion: string;
  fechaProximaAccion: string;
};

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  private readonly seguimientosService = inject(SeguimientosService);
  protected readonly seguimientos = signal<SeguimientoCasoResponse[]>([]);
  protected readonly isLoadingSeguimientos = signal(false);
  protected readonly seguimientoError = signal('');
  protected readonly isSavingSeguimiento = signal(false);
  protected readonly showSeguimientoForm = signal(false);
  protected readonly seguimientoForm = signal<SeguimientoForm>({
    tipoSeguimiento: 'OBSERVACION',
    contenido: '',
    proximaAccion: '',
    fechaProximaAccion: '',
  });

  protected readonly canSubmitSeguimiento = computed(() =>
    this.seguimientoForm().tipoSeguimiento.trim().length > 0 &&
    this.seguimientoForm().contenido.trim().length >= 10 &&
    !this.isSavingSeguimiento(),
  );

  protected loadSeguimientos(casoId: string): void {
    this.isLoadingSeguimientos.set(true);
    this.seguimientoError.set('');
    this.seguimientosService.list(casoId).subscribe({
      next: (seguimientos) => {
        this.seguimientos.set(seguimientos);
        this.isLoadingSeguimientos.set(false);
      },
      error: () => {
        this.seguimientoError.set('No se pudieron cargar los seguimientos del caso.');
        this.isLoadingSeguimientos.set(false);
      },
    });
  }

  protected openSeguimientoTab(casoId: string): void {
    this.casesService.activeCaseTab.set('historial');
    this.loadSeguimientos(casoId);
  }

  protected updateSeguimientoForm(field: keyof SeguimientoForm, value: string): void {
    this.seguimientoForm.set({
      ...this.seguimientoForm(),
      [field]: value,
    });
  }

  protected submitSeguimiento(casoId: string): void {
    const form = this.seguimientoForm();
    if (!this.canSubmitSeguimiento()) {
      return;
    }

    this.isSavingSeguimiento.set(true);
    this.seguimientosService.create({
      casoId,
      tipoSeguimiento: form.tipoSeguimiento.trim(),
      contenido: form.contenido.trim(),
      proximaAccion: form.proximaAccion.trim() || undefined,
      fechaProximaAccion: form.fechaProximaAccion || undefined,
    }).subscribe({
      next: (seguimiento) => {
        this.seguimientos.update((actuales) => [seguimiento, ...actuales]);
        this.resetSeguimientoForm();
        this.showSeguimientoForm.set(false);
        this.toastService.show('Observación registrada correctamente.', 'success');
        this.isSavingSeguimiento.set(false);
      },
      error: () => {
        this.toastService.show('No se pudo registrar la observación.', 'error');
        this.isSavingSeguimiento.set(false);
      },
    });
  }

  protected resetSeguimientoForm(): void {
    this.seguimientoForm.set({
      tipoSeguimiento: 'OBSERVACION',
      contenido: '',
      proximaAccion: '',
      fechaProximaAccion: '',
    });
  }

  protected closeCaseDrawer(): void {
    this.showSeguimientoForm.set(false);
    this.seguimientos.set([]);
    this.resetSeguimientoForm();
    this.casesService.closeCaseDrawer();
  }
}
