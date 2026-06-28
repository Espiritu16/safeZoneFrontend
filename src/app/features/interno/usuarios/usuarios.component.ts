import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService, User } from '../../../core/services/users.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { LettersOnlyDirective } from '../../../shared/directives/letters-only.directive';
import { TrimOnBlurDirective } from '../../../shared/directives/trim-on-blur.directive';
import { sanitizeLettersOnly } from '../../../shared/utils/input-sanitizers.util';
import { isValidInstitutionalEmail, VALIDATION_LIMITS, VALIDATION_PATTERNS } from '../../../shared/utils/validation-rules';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, LettersOnlyDirective, TrimOnBlurDirective],
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
    password:'',
    rol: 'Recepcionista',
    estado: 'Activo',
    ultimaConexion: 'Nunca'
  };

  openCreate() {
    this.formData = { nombre: '', email: '', rol: 'Recepcionista',password:'', estado: 'Activo', ultimaConexion: 'Nunca' };
    this.usersService.openCreateModal();
  }

  openEdit(user: User) {
    this.formData = {
      nombre: user.nombre,
      email: user.email,
      password:user.password,
      rol: user.rol,
      estado: user.estado,
      ultimaConexion: user.ultimaConexion
    };
    this.usersService.openEditModal(user);
  }

  saveUser() {
    this.formData = {
      ...this.formData,
      nombre: sanitizeLettersOnly(this.formData.nombre).trim(),
      email: this.formData.email.trim().toLowerCase(),
    };

    if (!this.formData.nombre.trim() || !this.formData.email.trim()) {
      this.toastService.show('Complete todos los campos obligatorios.', 'error');
      return;
    }
    if (
      this.formData.nombre.length < VALIDATION_LIMITS.USER_NAME_MIN ||
      this.formData.nombre.length > VALIDATION_LIMITS.USER_NAME_MAX ||
      !VALIDATION_PATTERNS.PERSON_NAME.test(this.formData.nombre)
    ) {
      this.toastService.show('El nombre debe tener entre 4 y 120 caracteres y solo letras.', 'error');
      return;
    }
    if (!isValidInstitutionalEmail(this.formData.email)) {
      this.toastService.show('Debe ingresar un correo institucional válido @safezone.gob.pe.', 'error');
      return;
    }
    if (!this.authService.roles.some((role) => role === this.formData.rol) || !['Activo', 'Inactivo'].includes(this.formData.estado)) {
      this.toastService.show('Seleccione un rol y estado válidos.', 'error');
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
