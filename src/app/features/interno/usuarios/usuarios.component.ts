import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { BackendRole, CrearUsuarioRequest, FrontendRole, UsuarioResponse } from '../../../core/models/api.models';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { labelToRole, roleToLabel } from '../../../core/utils/role-mapper';
import { LettersOnlyDirective } from '../../../shared/directives/letters-only.directive';
import { NumbersOnlyDirective } from '../../../shared/directives/numbers-only.directive';
import { TrimOnBlurDirective } from '../../../shared/directives/trim-on-blur.directive';
import { sanitizeLettersOnly } from '../../../shared/utils/input-sanitizers.util';
import { VALIDATION_LIMITS, VALIDATION_PATTERNS, isValidBasicEmail } from '../../../shared/utils/validation-rules';

type UsuarioEstado = 'Activo' | 'Inactivo';
type UsuarioRolFormulario = Exclude<FrontendRole, 'Soporte Técnico'>;

interface UsuarioTabla {
  id: string;
  nombreCompleto: string;
  email: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  distrito: string;
  rol: UsuarioRolFormulario;
  estado: UsuarioEstado;
  fechaActualizacion: string;
}

interface UsuarioFormData {
  nombres: string;
  apellidos: string;
  email: string;
  contrasena: string;
  dni: string;
  telefono: string;
  distrito: string;
  rol: UsuarioRolFormulario;
  estado: UsuarioEstado;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, LettersOnlyDirective, NumbersOnlyDirective, TrimOnBlurDirective],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent implements OnInit {
  private readonly usuariosService = inject(UsuariosService);
  protected readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  readonly rolesDisponibles: UsuarioRolFormulario[] = ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal', 'Víctima'];
  readonly users = signal<UsuarioTabla[]>([]);
  readonly searchQuery = signal('');
  readonly roleFilter = signal<'all' | UsuarioRolFormulario>('all');
  readonly statusFilter = signal<'all' | UsuarioEstado>('all');
  readonly showModal = signal(false);
  readonly editingUser = signal<UsuarioTabla | null>(null);
  readonly showInactivateConfirm = signal<string | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly actionInProgressId = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly filteredUsers = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const role = this.roleFilter();
    return this.users().filter((user) => {
      const matchesSearch =
        !query ||
        user.nombreCompleto.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.dni.includes(query) ||
        user.telefono.includes(query) ||
        user.distrito.toLowerCase().includes(query) ||
        user.rol.toLowerCase().includes(query);
      const matchesRole = role === 'all' || user.rol === role;
      const matchesStatus = this.statusFilter() === 'all' || user.estado === this.statusFilter();
      return matchesSearch && matchesRole && matchesStatus;
    });
  });

  readonly hasActiveFilters = computed(() =>
    Boolean(this.searchQuery().trim()) || this.roleFilter() !== 'all' || this.statusFilter() !== 'all'
  );
  readonly totalActivos = computed(() => this.users().filter((user) => user.estado === 'Activo').length);
  readonly totalInactivos = computed(() => this.users().filter((user) => user.estado === 'Inactivo').length);

  formData: UsuarioFormData = this.emptyForm();

  ngOnInit(): void {
    this.loadUsers();
  }

  openCreate(): void {
    this.formData = this.emptyForm();
    this.editingUser.set(null);
    this.showPassword.set(false);
    this.showModal.set(true);
  }

  openEdit(user: UsuarioTabla): void {
    this.formData = {
      nombres: user.nombres,
      apellidos: user.apellidos,
      email: user.email,
      contrasena: '',
      dni: user.dni,
      telefono: user.telefono,
      distrito: user.distrito,
      rol: user.rol,
      estado: user.estado,
    };
    this.editingUser.set(user);
    this.showPassword.set(false);
    this.showModal.set(true);
  }

  closeModal(): void {
    if (this.saving()) {
      return;
    }
    this.showModal.set(false);
    this.editingUser.set(null);
  }

  saveUser(): void {
    this.normalizeFormData();
    if (!this.isValidForm()) {
      return;
    }

    const editing = this.editingUser();
    this.saving.set(true);

    if (editing) {
      this.usuariosService.update(editing.id, {
        correo: this.formData.email,
        nombres: this.formData.nombres,
        apellidos: this.formData.apellidos,
        dni: this.formData.dni,
        telefono: this.formData.telefono || undefined,
        distrito: this.formData.distrito || undefined,
        rol: this.toBackendRole(this.formData.rol),
        activo: this.formData.estado === 'Activo',
      }).subscribe({
        next: (usuario) => {
          this.users.update((users) => users.map((item) => item.id === usuario.id ? this.toTableUser(usuario) : item));
          this.toastService.show('Usuario actualizado correctamente.', 'success');
          this.finishSave();
        },
        error: (error) => this.handleSaveError(error),
      });
      return;
    }

    this.usuariosService.create(this.toCreateRequest()).subscribe({
      next: (usuario) => {
        this.users.update((users) => [this.toTableUser(usuario), ...users]);
        this.toastService.show('Usuario creado correctamente.', 'success');
        this.finishSave();
      },
      error: (error) => this.handleSaveError(error),
    });
  }

  confirmInactivate(id: string): void {
    this.showInactivateConfirm.set(id);
  }

  executeInactivate(id: string): void {
    this.actionInProgressId.set(id);
    this.usuariosService.inactivar(id).subscribe({
      next: () => {
        this.users.update((users) => users.map((user) => user.id === id ? { ...user, estado: 'Inactivo' } : user));
        this.showInactivateConfirm.set(null);
        this.actionInProgressId.set(null);
        this.toastService.show('Usuario inactivado correctamente.', 'warning');
      },
      error: (error) => {
        this.actionInProgressId.set(null);
        this.toastService.show(this.resolveErrorMessage(error, 'No se pudo inactivar el usuario.'), 'error');
      },
    });
  }

  activate(id: string): void {
    this.actionInProgressId.set(id);
    this.usuariosService.update(id, { activo: true }).subscribe({
      next: (usuario) => {
        this.users.update((users) => users.map((item) => item.id === usuario.id ? this.toTableUser(usuario) : item));
        this.actionInProgressId.set(null);
        this.toastService.show('Usuario activado correctamente.', 'success');
      },
      error: (error) => {
        this.actionInProgressId.set(null);
        this.toastService.show(this.resolveErrorMessage(error, 'No se pudo activar el usuario.'), 'error');
      },
    });
  }

  cancelInactivate(): void {
    this.showInactivateConfirm.set(null);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.roleFilter.set('all');
    this.statusFilter.set('all');
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.usuariosService.list().subscribe({
      next: (usuarios) => {
        this.users.set(usuarios.map((usuario) => this.toTableUser(usuario)));
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.toastService.show(this.resolveErrorMessage(error, 'No se pudo cargar la lista de usuarios.'), 'error');
      },
    });
  }

  private emptyForm(): UsuarioFormData {
    return {
      nombres: '',
      apellidos: '',
      email: '',
      contrasena: '',
      dni: '',
      telefono: '',
      distrito: '',
      rol: 'Recepcionista',
      estado: 'Activo',
    };
  }

  private normalizeFormData(): void {
    this.formData = {
      ...this.formData,
      nombres: sanitizeLettersOnly(this.formData.nombres).trim(),
      apellidos: sanitizeLettersOnly(this.formData.apellidos).trim(),
      email: this.formData.email.trim().toLowerCase(),
      dni: this.formData.dni.trim(),
      telefono: this.formData.telefono.trim(),
      distrito: this.formData.distrito.trim(),
    };
  }

  private isValidForm(): boolean {
    if (!this.formData.nombres || !this.formData.apellidos || !this.formData.email || !this.formData.dni) {
      this.toastService.show('Complete todos los campos obligatorios.', 'error');
      return false;
    }
    if (!this.editingUser() && !this.formData.contrasena) {
      this.toastService.show('Ingrese una contraseña inicial.', 'error');
      return false;
    }
    if (
      this.formData.nombres.length > VALIDATION_LIMITS.PERSON_NAME_MAX ||
      this.formData.apellidos.length > VALIDATION_LIMITS.PERSON_NAME_MAX ||
      !VALIDATION_PATTERNS.PERSON_NAME.test(this.formData.nombres) ||
      !VALIDATION_PATTERNS.PERSON_NAME.test(this.formData.apellidos)
    ) {
      this.toastService.show('Nombres y apellidos solo pueden contener letras.', 'error');
      return false;
    }
    if (!isValidBasicEmail(this.formData.email)) {
      this.toastService.show('Ingrese un correo electrónico válido.', 'error');
      return false;
    }
    if (!VALIDATION_PATTERNS.DNI.test(this.formData.dni)) {
      this.toastService.show('El DNI debe tener 8 dígitos.', 'error');
      return false;
    }
    if (this.formData.telefono && !VALIDATION_PATTERNS.CELULAR.test(this.formData.telefono)) {
      this.toastService.show('El teléfono debe tener 9 dígitos.', 'error');
      return false;
    }
    if (!this.editingUser() && !/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(this.formData.contrasena)) {
      this.toastService.show('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.', 'error');
      return false;
    }
    if (!this.rolesDisponibles.includes(this.formData.rol) || !['Activo', 'Inactivo'].includes(this.formData.estado)) {
      this.toastService.show('Seleccione un rol y estado válidos.', 'error');
      return false;
    }
    return true;
  }

  private toCreateRequest(): CrearUsuarioRequest {
    return {
      correo: this.formData.email,
      contrasena: this.formData.contrasena,
      nombres: this.formData.nombres,
      apellidos: this.formData.apellidos,
      dni: this.formData.dni,
      telefono: this.formData.telefono || undefined,
      distrito: this.formData.distrito || undefined,
      rol: this.toBackendRole(this.formData.rol),
    };
  }

  private toTableUser(usuario: UsuarioResponse): UsuarioTabla {
    return {
      id: usuario.id,
      nombreCompleto: `${usuario.nombres} ${usuario.apellidos}`.trim(),
      email: usuario.correo,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      dni: usuario.dni,
      telefono: usuario.telefono ?? '',
      distrito: usuario.distrito ?? '',
      rol: this.toFrontendRole(usuario.rol),
      estado: usuario.activo ? 'Activo' : 'Inactivo',
      fechaActualizacion: usuario.fechaActualizacion ?? usuario.fechaCreacion ?? 'Nunca',
    };
  }

  private toBackendRole(rol: UsuarioRolFormulario): BackendRole {
    return labelToRole(rol);
  }

  private toFrontendRole(rol: BackendRole): UsuarioRolFormulario {
    const label = roleToLabel(rol);
    return label === 'Soporte Técnico' ? 'Recepcionista' : label;
  }

  private finishSave(): void {
    this.saving.set(false);
    this.showModal.set(false);
    this.editingUser.set(null);
  }

  private handleSaveError(error: unknown): void {
    this.saving.set(false);
    this.toastService.show(this.resolveErrorMessage(error, 'No se pudo guardar el usuario.'), 'error');
  }

  private resolveErrorMessage(error: unknown, fallback: string): string {
    const payload = (error as { error?: { message?: string; mensaje?: string } }).error;
    return payload?.message ?? payload?.mensaje ?? fallback;
  }
}
