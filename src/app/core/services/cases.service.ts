import { Injectable, signal, computed, inject } from '@angular/core';
import { ToastService } from './toast.service';

export interface Caso {
  id: string;
  codigo: string;
  victim: string;
  anonimo: boolean;
  edad: number;
  distrito: string;
  tipo: string;
  estado: string;
  riesgo: string;
  asignado: string;
  fecha: string;
  emocion: string;
}

@Injectable({
  providedIn: 'root'
})
export class CasesService {
  private readonly toastService = inject(ToastService);

  public readonly casos = signal<Caso[]>([
    { id: '1', codigo: 'Caso #082-2026', victim: 'Ana María L.', anonimo: false, edad: 34, distrito: 'Lima Metropolitana', tipo: 'Física', estado: 'En Proceso', riesgo: 'Severo', asignado: 'Dra. Sofía Medina', fecha: '2026-05-20', emocion: 'Ansiedad Alta' },
    { id: '2', codigo: 'Caso #079-2026', victim: 'María-99', anonimo: true, edad: 28, distrito: 'San Martín de Porres', tipo: 'Psicológica', estado: 'Evaluación', riesgo: 'Moderado', asignado: 'Dr. Carlos Rojas', fecha: '2026-05-18', emocion: 'Temor / Inseguridad' },
    { id: '3', codigo: 'Caso #075-2026', victim: 'Patricia S.', anonimo: false, edad: 42, distrito: 'San Juan de Lurigancho', tipo: 'Física', estado: 'Medidas de Protección', riesgo: 'Severo', asignado: 'Dra. Sofía Medina', fecha: '2026-05-15', emocion: 'Angustia Extrema' },
    { id: '4', codigo: 'Caso #070-2026', victim: 'Luz-88', anonimo: true, edad: 19, distrito: 'Comas', tipo: 'Económica', estado: 'Archivado', riesgo: 'Leve', asignado: 'Dr. Carlos Rojas', fecha: '2026-05-10', emocion: 'Tristeza profunda' },
    { id: '5', codigo: 'Caso #083-2026', victim: 'Gabriela M.', anonimo: false, edad: 31, distrito: 'Villa El Salvador', tipo: 'Física y Psicológica', estado: 'Evaluación', riesgo: 'Severo', asignado: 'Dra. Sofía Medina', fecha: '2026-05-21', emocion: 'Aislada / Indefensa' }
  ]);

  public readonly casesSearchQuery = signal<string>('');
  public readonly casesRiskFilter = signal<string>('all');
  
  // Expediente Seleccionado
  public readonly selectedCase = signal<Caso | null>(null);
  public readonly activeCaseTab = signal<string>('detalles');

  public readonly filteredCasos = computed(() => {
    return this.casos().filter(c => {
      const matchSearch = c.codigo.toLowerCase().includes(this.casesSearchQuery().toLowerCase()) || 
                          c.victim.toLowerCase().includes(this.casesSearchQuery().toLowerCase()) ||
                          c.asignado.toLowerCase().includes(this.casesSearchQuery().toLowerCase());
      
      const matchRisk = this.casesRiskFilter() === 'all' || 
                        c.riesgo.toLowerCase() === this.casesRiskFilter().toLowerCase();
      
      return matchSearch && matchRisk;
    });
  });

  public readonly totalCasos = computed(() => this.casos().length);
  public readonly casosSeveros = computed(() => this.casos().filter(c => c.riesgo === 'Severo').length);
  public readonly casosModerados = computed(() => this.casos().filter(c => c.riesgo === 'Moderado').length);
  public readonly casosLeves = computed(() => this.casos().filter(c => c.riesgo === 'Leve').length);

  getCasosByStatus(status: string) {
    return this.casos().filter(c => c.estado === status);
  }

  moveCase(caseId: string, newStatus: string) {
    this.casos.update(casosList => {
      return casosList.map(c => {
        if (c.id === caseId) {
          this.toastService.show(`${c.codigo} movido a estado: ${newStatus}`, 'success');
          return { ...c, estado: newStatus };
        }
        return c;
      });
    });
  }

  addCase(newCase: Omit<Caso, 'id'>) {
    const id = (this.casos().length + 1).toString();
    this.casos.update(list => [...list, { ...newCase, id }]);
  }

  viewCaseDetails(caso: Caso) {
    this.selectedCase.set(caso);
    this.activeCaseTab.set('detalles');
  }

  closeCaseDrawer() {
    this.selectedCase.set(null);
  }
}
