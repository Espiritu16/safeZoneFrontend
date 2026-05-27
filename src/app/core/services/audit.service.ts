import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService } from './auth.service';

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  ip: string;
  detail: string;
  module: string;
}

const STORAGE_KEY = 'safezone_audit';

// Algunos datos de ejemplo para tener historial inicial
const DEFAULT_LOGS: AuditLog[] = [
  { id: 'l1', timestamp: '2026-05-22 08:30:15', user: 'Admin SafeZone', role: 'Administrador', action: 'Configuración', ip: '192.168.1.110', detail: 'Actualizó política de contraseñas.', module: 'Configuración' },
  { id: 'l2', timestamp: '2026-05-22 08:15:00', user: 'Admin SafeZone', role: 'Administrador', action: 'Inicio de Sesión', ip: '192.168.1.110', detail: 'Autenticación exitosa.', module: 'Auth' },
  { id: 'l3', timestamp: '2026-05-21 16:45:20', user: 'Recepción Lima Centro', role: 'Recepcionista', action: 'Registro de Denuncia', ip: '10.0.5.22', detail: 'Registró denuncia Caso #082-2026.', module: 'Denuncias' },
  { id: 'l4', timestamp: '2026-05-21 14:20:10', user: 'Dra. Sofía Medina', role: 'Psicólogo', action: 'Acceso a Expediente', ip: '10.0.5.33', detail: 'Consultó expediente de víctima SZ-V-001.', module: 'Víctimas' },
  { id: 'l5', timestamp: '2026-05-21 10:10:05', user: 'Soporte TI', role: 'Soporte Técnico', action: 'Mantenimiento', ip: '192.168.1.50', detail: 'Backup de base de datos completado.', module: 'Sistema' },
];

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private readonly authService = inject(AuthService);

  public readonly logs = signal<AuditLog[]>(this.loadFromStorage());
  
  // Filtros
  public readonly searchQuery = signal<string>('');
  public readonly actionFilter = signal<string>('all');
  public readonly dateFilter = signal<string>('');

  public readonly filteredLogs = computed(() => {
    return this.logs().filter(log => {
      const matchSearch = log.user.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
                          log.detail.toLowerCase().includes(this.searchQuery().toLowerCase());
      const matchAction = this.actionFilter() === 'all' || log.action === this.actionFilter();
      const matchDate = !this.dateFilter() || log.timestamp.startsWith(this.dateFilter());
      return matchSearch && matchAction && matchDate;
    });
  });

  private loadFromStorage(): AuditLog[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_LOGS;
    } catch {
      return DEFAULT_LOGS;
    }
  }

  private saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs()));
  }

  private getMockIp(): string {
    return `192.168.1.${Math.floor(Math.random() * 200) + 10}`;
  }

  private formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  /**
   * Registra una acción dinámicamente usando el usuario autenticado actual.
   */
  logAction(action: string, detail: string, module: string) {
    const role = this.authService.currentRole();
    // Simular el nombre del usuario basado en el rol activo para la demo
    const user = role === 'Administrador' ? 'Admin SafeZone' :
                 role === 'Recepcionista' ? 'Recepción Lima Centro' :
                 role === 'Psicólogo' ? 'Dra. Sofía Medina' :
                 role === 'Defensor Legal' ? 'Abog. María Torres' :
                 role === 'Víctima' ? 'Ana María López' : 'Soporte TI';

    const newLog: AuditLog = {
      id: 'l' + Date.now(),
      timestamp: this.formatDate(new Date()),
      user,
      role,
      action,
      ip: this.getMockIp(),
      detail,
      module
    };

    // Agregar al inicio
    this.logs.update(list => [newLog, ...list]);
    this.saveToStorage();
  }

  exportToCSV() {
    const data = this.filteredLogs();
    const headers = ['Timestamp', 'Usuario', 'Rol', 'Módulo', 'Acción', 'IP', 'Detalle'];
    const csvContent = [
      headers.join(','),
      ...data.map(log => `"${log.timestamp}","${log.user}","${log.role}","${log.module}","${log.action}","${log.ip}","${log.detail}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `safezone_audit_logs_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
