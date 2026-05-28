import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService, User } from '../../core/services/users.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { 
  onlyLetters, 
  isValidEmail, 
  trimAndCollapse 
} from '../../shared/utils/validation.utils';

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

  errors = {
    nombre: '',
    email: ''
  };

  clearError(field: keyof typeof this.errors) {
    this.errors[field] = '';
  }

  openCreate() {
    this.formData = { nombre: '', email: '', rol: 'Recepcionista', estado: 'Activo', ultimaConexion: 'Nunca' };
    this.errors = { nombre: '', email: '' };
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
    this.errors = { nombre: '', email: '' };
    this.usersService.openEditModal(user);
  }

  saveUser() {
    let hasError = false;

    // Sanitizar campos
    this.formData.nombre = trimAndCollapse(this.formData.nombre);
    this.formData.email = trimAndCollapse(this.formData.email);

    // Validar Nombre
    if (!this.formData.nombre) {
      this.errors.nombre = 'El nombre completo es obligatorio.';
      hasError = true;
    } else if (!onlyLetters(this.formData.nombre)) {
      this.errors.nombre = 'Solo se permiten letras, espacios, apóstrofe y guion.';
      hasError = true;
    } else if (this.formData.nombre.length < 4 || this.formData.nombre.length > 120) {
      this.errors.nombre = 'El nombre debe tener entre 4 y 120 caracteres.';
      hasError = true;
    } else {
      this.errors.nombre = '';
    }

    // Validar Email
    if (!this.formData.email) {
      this.errors.email = 'El correo institucional es obligatorio.';
      hasError = true;
    } else if (!isValidEmail(this.formData.email)) {
      this.errors.email = 'Debe ingresar un correo electrónico válido.';
      hasError = true;
    } else if (!this.formData.email.toLowerCase().endsWith('@safezone.gob.pe')) {
      this.errors.email = 'El correo debe pertenecer al dominio institucional @safezone.gob.pe.';
      hasError = true;
    } else {
      this.errors.email = '';
    }

    if (hasError) {
      this.toastService.show('Por favor, corrija los errores del formulario.', 'error');
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
