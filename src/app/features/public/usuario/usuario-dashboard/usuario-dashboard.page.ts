import { Component, OnInit, computed, inject } from '@angular/core';
import type { VictimaHistorialItem } from '../../../../core/models/api.models';
import { UsuarioHistorialService } from '../../../../core/services/usuario-historial.service';

@Component({
  selector: 'app-usuario-dashboard-page',
  standalone: true,
  templateUrl: './usuario-dashboard.page.html',
  styleUrl: './usuario-dashboard.page.css'
})
export class UsuarioDashboardPage implements OnInit {
  protected readonly historialService = inject(UsuarioHistorialService);
  protected readonly recentItems = computed(() => this.historialService.lineaTiempo().slice(0, 5));

  ngOnInit(): void {
    this.historialService.load().subscribe({ error: () => undefined });
  }

  protected refresh(): void {
    this.historialService.refresh().subscribe({ error: () => undefined });
  }

  protected formatDate(date: string | null | undefined): string {
    if (!date) {
      return 'Sin fecha';
    }
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  protected itemIcon(item: VictimaHistorialItem): string {
    const icons: Record<string, string> = {
      CASO: 'folder_open',
      DENUNCIA: 'assignment',
      CITA: 'event',
      SEGUIMIENTO: 'timeline',
      EVIDENCIA: 'inventory_2',
    };
    return icons[item.tipo] ?? 'info';
  }

  protected statusLabel(status: string | null | undefined): string {
    return (status ?? 'Sin estado').replaceAll('_', ' ');
  }
}
