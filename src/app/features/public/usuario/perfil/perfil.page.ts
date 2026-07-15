import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import type { UsuarioResponse } from '../../../../core/models/api.models';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-usuario-perfil-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.page.html',
  styleUrl: './perfil.page.css'
})
export class UsuarioPerfilPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  protected readonly perfil = signal<UsuarioResponse | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly error = signal('');
  protected readonly success = signal('');

  protected readonly passwordForm = this.fb.nonNullable.group(
    {
      contrasenaActual: ['', [Validators.required]],
      nuevaContrasena: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
      confirmarContrasena: ['', [Validators.required]],
    },
    { validators: [this.passwordsMatch] },
  );

  protected readonly nombreCompleto = computed(() => {
    const perfil = this.perfil();
    if (!perfil) {
      return 'Usuario';
    }
    return `${perfil.nombres} ${perfil.apellidos}`.trim();
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.isLoading.set(true);
    this.error.set('');
    this.authService.loadMyProfile().subscribe({
      next: (perfil) => {
        this.perfil.set(perfil);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar tus datos de perfil.');
        this.isLoading.set(false);
      },
    });
  }

  protected submitPassword(): void {
    this.success.set('');
    this.error.set('');
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.isSaving.set(true);
    const value = this.passwordForm.getRawValue();
    this.authService.changeMyPassword(value).subscribe({
      next: () => {
        this.success.set('Tu contrasena se actualizo correctamente.');
        this.passwordForm.reset();
        this.isSaving.set(false);
      },
      error: (error: Error) => {
        this.error.set(error.message || 'No se pudo actualizar la contrasena.');
        this.isSaving.set(false);
      },
    });
  }

  protected controlInvalid(name: keyof typeof this.passwordForm.controls): boolean {
    const control = this.passwordForm.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  private passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const nueva = control.get('nuevaContrasena')?.value;
    const confirmar = control.get('confirmarContrasena')?.value;
    return nueva && confirmar && nueva !== confirmar ? { passwordMismatch: true } : null;
  }
}
