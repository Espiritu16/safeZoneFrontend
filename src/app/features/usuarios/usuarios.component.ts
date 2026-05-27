import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService, User } from '../../core/services/users.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {
  protected readonly usersService = inject(UsersService);
  protected readonly authService = inject(AuthService);
  protected readonly toastService = inject(ToastService);

  showDeleteConfirm = signal<string | null>(null);

  // Formulario para nuevo/editar usuario
  formData = {
    nombre: '',
    email: '',
    rol: 'Recepcionista',
    estado: 'Activo',
    ultimaConexion: 'Nunca'
  };

  openCreate() {
    this.formData = { nombre: '', email: '', rol: 'Recepcionista', estado: 'Activo', ultimaConexion: 'Nunca' };
    this.usersService.openCreateModal();
  }

  openEdit(user: User) {
    this.formData = {
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      estado: user.estado,
      ultimaConexion: user.ultimaConexion
    };
    this.usersService.openEditModal(user);
  }

  saveUser() {
    if (!this.formData.nombre.trim() || !this.formData.email.trim()) {
      this.toastService.show('Complete todos los campos obligatorios.', 'error');
      return;
    }

    const editing = this.usersService.editingUser();
    if (editing) {
      this.usersService.update(editing.id, this.formData);
    } else {
      this.usersService.add(this.formData);
    }
    this.usersService.closeModal();
  }

  confirmDelete(id: string) {
    this.showDeleteConfirm.set(id);
  }

  executeDelete(id: string) {
    this.usersService.delete(id);
    this.showDeleteConfirm.set(null);
  }

  cancelDelete() {
    this.showDeleteConfirm.set(null);
  }
}
