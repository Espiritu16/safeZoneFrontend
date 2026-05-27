import { Injectable, signal, computed, inject } from '@angular/core';
import { ToastService } from './toast.service';

export interface Victim {
  id: string;
  codigo: string;
  alias: string;
  nombre: string;
  apellidos: string;
  dni: string;
  edad: number;
  genero: string;
  estadoCivil: string;
  ocupacion: string;
  distrito: string;
  direccion: string;
  telefono: string;
  contactoEmergencia: { nombre: string; telefono: string };
  anonimo: boolean;
  fechaRegistro: string;
  estado: string; // 'Activo' | 'Archivado'
}

const STORAGE_KEY = 'safezone_victims';

const DEFAULT_VICTIMS: Victim[] = [
  {
    id: 'v1', codigo: 'SZ-V-001', alias: '', nombre: 'Ana María', apellidos: 'López Pérez', dni: '45678912', edad: 34,
    genero: 'Femenino', estadoCivil: 'Casada', ocupacion: 'Docente', distrito: 'Villa El Salvador', direccion: 'Av. Las Palmas 123',
    telefono: '987654321', contactoEmergencia: { nombre: 'Carlos López', telefono: '912345678' },
    anonimo: false, fechaRegistro: '2026-05-20', estado: 'Activo'
  },
  {
    id: 'v2', codigo: 'SZ-V-002', alias: 'SZ-LIMA-047', nombre: 'Protegida', apellidos: 'Protegida', dni: '00000000', edad: 28,
    genero: 'Femenino', estadoCivil: 'Soltera', ocupacion: 'Independiente', distrito: 'Comas', direccion: 'Reservada',
    telefono: '999888777', contactoEmergencia: { nombre: 'María Rodríguez', telefono: '977666555' },
    anonimo: true, fechaRegistro: '2026-05-21', estado: 'Activo'
  },
  {
    id: 'v3', codigo: 'SZ-V-003', alias: '', nombre: 'Carmen', apellidos: 'Soto Vargas', dni: '71234567', edad: 42,
    genero: 'Femenino', estadoCivil: 'Divorciada', ocupacion: 'Comerciante', distrito: 'San Juan de Lurigancho', direccion: 'Mz H Lt 4 Asoc. El Sol',
    telefono: '963852741', contactoEmergencia: { nombre: 'Juan Soto', telefono: '951753456' },
    anonimo: false, fechaRegistro: '2026-05-22', estado: 'Activo'
  }
];

@Injectable({
  providedIn: 'root'
})
export class VictimsService {
  private readonly toastService = inject(ToastService);
  
  public readonly victims = signal<Victim[]>(this.loadFromStorage());
  public readonly searchQuery = signal<string>('');

  public readonly filteredVictims = computed(() => {
    return this.victims().filter(v => 
      v.nombre.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
      v.apellidos.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
      v.dni.includes(this.searchQuery()) ||
      v.alias.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
      v.codigo.toLowerCase().includes(this.searchQuery().toLowerCase())
    );
  });

  public readonly showModal = signal<boolean>(false);
  public readonly editingVictim = signal<Victim | null>(null);
  public readonly selectedVictim = signal<Victim | null>(null);

  private loadFromStorage(): Victim[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_VICTIMS;
    } catch {
      return DEFAULT_VICTIMS;
    }
  }

  private saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.victims()));
  }

  private getNextCounter(): number {
    const counterStr = localStorage.getItem('safezone_alias_counter') || '47';
    let counter = parseInt(counterStr, 10) + 1;
    localStorage.setItem('safezone_alias_counter', counter.toString());
    return counter;
  }

  public generateAlias(distrito: string): string {
    const codeStr = this.getNextCounter().toString().padStart(3, '0');
    let prefix = distrito.split(' ')[0].toUpperCase();
    if (prefix.length < 3) prefix = 'LIM';
    return `SZ-${prefix}-${codeStr}`;
  }

  add(victim: Omit<Victim, 'id'|'codigo'|'alias'|'fechaRegistro'>) {
    const id = 'v' + Date.now();
    const count = this.victims().length + 1;
    const codigo = `SZ-V-${count.toString().padStart(3, '0')}`;
    
    let alias = '';
    let nombreFinal = victim.nombre;
    let apellidosFinal = victim.apellidos;
    let dniFinal = victim.dni;
    let direccionFinal = victim.direccion;

    if (victim.anonimo) {
      alias = this.generateAlias(victim.distrito);
      nombreFinal = 'Protegida';
      apellidosFinal = 'Protegida';
      dniFinal = '00000000';
      direccionFinal = 'Reservada';
    }

    const newVictim: Victim = {
      ...victim,
      id, codigo, alias,
      nombre: nombreFinal,
      apellidos: apellidosFinal,
      dni: dniFinal,
      direccion: direccionFinal,
      fechaRegistro: new Date().toISOString().split('T')[0]
    };

    this.victims.update(list => [newVictim, ...list]);
    this.saveToStorage();
    this.toastService.show(`Víctima registrada exitosamente${victim.anonimo ? ` (Alias: ${alias})` : ''}.`, 'success');
  }

  update(id: string, data: Partial<Victim>) {
    this.victims.update(list => list.map(v => v.id === id ? { ...v, ...data } : v));
    this.saveToStorage();
    
    if (this.selectedVictim()?.id === id) {
      this.selectedVictim.set({ ...this.selectedVictim()!, ...data });
    }
    this.toastService.show('Datos actualizados.', 'success');
  }

  openCreateModal() {
    this.editingVictim.set(null);
    this.showModal.set(true);
  }

  openEditModal(victim: Victim) {
    this.editingVictim.set({ ...victim });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingVictim.set(null);
  }

  selectVictim(victim: Victim) {
    this.selectedVictim.set(victim);
  }
}
