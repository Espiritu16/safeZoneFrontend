import { Injectable, signal, computed, inject } from '@angular/core';
import { ToastService } from './toast.service';

export interface User {
  id: string;
  nombre: string;
  email: string;
  password:string;
  rol: string;
  estado: string;       // 'Activo' | 'Inactivo'
  ultimaConexion: string;
}

const STORAGE_KEY = 'safezone_users';

const DEFAULT_USERS: User[] = [
  { id: 'u1', nombre: 'Admin SafeZone', email: 'admin@safezone.gob.pe',password:"casa123",rol: 'Administrador', estado: 'Activo', ultimaConexion: '2026-05-22 08:10' },
  { id: 'u2', nombre: 'Dra. Sofía Medina', email: 'smedina@safezone.gob.pe',password:"12345$",rol: 'Psicólogo', estado: 'Activo', ultimaConexion: '2026-05-22 01:22' },
  { id: 'u3', nombre: 'Dr. Carlos Rojas', email: 'crojas@safezone.gob.pe',password:"58910&",rol: 'Psicólogo', estado: 'Activo', ultimaConexion: '2026-05-21 23:40' },
  { id: 'u4', nombre: 'Recepción Lima Centro', email: 'recepcion_lima@safezone.gob.pe',password:"78935$",rol: 'Recepcionista', estado: 'Activo', ultimaConexion: '2026-05-22 07:55' },
  { id: 'u5', nombre: 'Abog. María Torres', email: 'mtorres@safezone.gob.pe',password:"74158$",rol: 'Defensor Legal', estado: 'Activo', ultimaConexion: '2026-05-21 18:30' },
  { id: 'u8', nombre: 'Dr. Manuel Cabrera', email: 'mcabrera@safezone.gob.pe',password:"714869",rol: 'Psicólogo', estado: 'Inactivo', ultimaConexion: '2026-05-10 11:20' },
];

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly toastService = inject(ToastService);

  public readonly users = signal<User[]>(this.loadFromStorage());

  public readonly searchQuery = signal<string>('');
  public readonly roleFilter = signal<string>('all');

  public readonly filteredUsers = computed(() => {
    return this.users().filter(u => {
      const matchSearch =
        u.nombre.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchQuery().toLowerCase());
      const matchRole = this.roleFilter() === 'all' || u.rol === this.roleFilter();
      return matchSearch && matchRole;
    });
  });

  public readonly totalActivos = computed(() => this.users().filter(u => u.estado === 'Activo').length);
  public readonly totalInactivos = computed(() => this.users().filter(u => u.estado === 'Inactivo').length);

  // Modal state
  public readonly showModal = signal<boolean>(false);
  public readonly editingUser = signal<User | null>(null);

  private loadFromStorage(): User[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  }

  private saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.users()));
  }

  add(user: Omit<User, 'id'>) {
    const id = 'u' + (Date.now());
    this.users.update(list => [...list, { ...user, id }]);
    this.saveToStorage();
    this.toastService.show(`Usuario "${user.nombre}" registrado exitosamente.`, 'success');
  }

  update(id: string, data: Partial<User>) {
    this.users.update(list =>
      list.map(u => u.id === id ? { ...u, ...data } : u)
    );
    this.saveToStorage();
    this.toastService.show('Datos del usuario actualizados.', 'success');
  }

  toggleStatus(id: string) {
    this.users.update(list =>
      list.map(u => {
        if (u.id === id) {
          const newStatus = u.estado === 'Activo' ? 'Inactivo' : 'Activo';
          this.toastService.show(`Estado de "${u.nombre}" cambiado a ${newStatus}.`, 'warning');
          return { ...u, estado: newStatus };
        }
        return u;
      })
    );
    this.saveToStorage();
  }

  delete(id: string) {
    const user = this.users().find(u => u.id === id);
    this.users.update(list => list.filter(u => u.id !== id));
    this.saveToStorage();
    if (user) {
      this.toastService.show(`Usuario "${user.nombre}" eliminado del sistema.`, 'error');
    }
  }

  openCreateModal() {
    this.editingUser.set(null);
    this.showModal.set(true);
  }

  openEditModal(user: User) {
    this.editingUser.set({ ...user });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingUser.set(null);
  }
}
