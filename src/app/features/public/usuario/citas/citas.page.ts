import { Component, OnInit, inject } from '@angular/core';
import type { VictimaHistorialItem } from '../../../../core/models/api.models';
import { UsuarioHistorialService } from '../../../../core/services/usuario-historial.service';

@Component({
  selector: 'app-usuario-citas-page',
  standalone: true,
  templateUrl: './citas.page.html',
  styleUrl: './citas.page.css'
})
export class UsuarioCitasPage implements OnInit {
  protected readonly historialService = inject(UsuarioHistorialService);

  ngOnInit(): void {
    this.historialService.load().subscribe({ error: () => undefined });
  }

  protected refresh(): void {
    this.historialService.refresh().subscribe({ error: () => undefined });
  }

  protected formatDate(date: string | null | undefined): string {
    if (!date) {
      return 'Sin fecha programada';
    }
    return new Intl.DateTimeFormat('es-PE', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  protected statusLabel(status: string | null | undefined): string {
    return (status ?? 'Sin estado').replaceAll('_', ' ');
  }

  protected metadata(item: VictimaHistorialItem, key: string): string {
    const value = item.metadata?.[key];
    return value === null || value === undefined || value === '' ? 'No especificado' : String(value).replaceAll('_', ' ');
  }
}
