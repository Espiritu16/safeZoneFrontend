import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VictimsService, Victim } from '../../../core/services/victims.service';
import { ToastService } from '../../../core/services/toast.service';
import { NumbersOnlyDirective } from '../../../shared/directives/numbers-only.directive';
import { LettersOnlyDirective } from '../../../shared/directives/letters-only.directive';
import { TrimOnBlurDirective } from '../../../shared/directives/trim-on-blur.directive';
import { normalizeText, sanitizeLettersOnly, sanitizeNumbersOnly } from '../../../shared/utils/input-sanitizers.util';
import { VALIDATION_LIMITS, VALIDATION_PATTERNS } from '../../../shared/utils/validation-rules';

@Component({
  selector: 'app-victimas',
  standalone: true,
  imports: [CommonModule, FormsModule, NumbersOnlyDirective, LettersOnlyDirective, TrimOnBlurDirective],
  templateUrl: './victimas.component.html',
  styleUrl: './victimas.component.scss'
})
export class VictimasComponent {
  protected readonly victimsService = inject(VictimsService);
  protected readonly toastService = inject(ToastService);

  activeTab = signal<'perfil' | 'denuncias' | 'citas' | 'seguimientos' | 'evidencias'>('perfil');

  formData = {
    nombre: '',
    apellidos: '',
    dni: '',
    edad: '18',
    genero: 'Femenino',
    estadoCivil: 'Soltera',
    ocupacion: '',
    distrito: 'Lima',
    direccion: '',
    telefono: '',
    contactoEmergenciaNombre: '',
    contactoEmergenciaTelefono: '',
    anonimo: false,
    estado: 'Activo'
  };

  openEdit(v: Victim) {
    this.formData = {
      nombre: v.nombre,
      apellidos: v.apellidos,
      dni: v.dni,
      edad: String(v.edad),
      genero: v.genero,
      estadoCivil: v.estadoCivil,
      ocupacion: v.ocupacion,
      distrito: v.distrito,
      direccion: v.direccion,
      telefono: v.telefono,
      contactoEmergenciaNombre: v.contactoEmergencia?.nombre || '',
      contactoEmergenciaTelefono: v.contactoEmergencia?.telefono || '',
      anonimo: v.anonimo,
      estado: v.estado
    };
    this.victimsService.openEditModal(v);
  }

  saveVictim() {
    this.normalizeForm();

    if (!this.formData.anonimo) {
      if (!this.isValidPersonName(this.formData.nombre, VALIDATION_LIMITS.PERSON_NAME_MAX)) {
        this.toastService.show('El nombre debe tener entre 2 y 80 caracteres y solo letras.', 'error');
        return;
      }
      if (!this.isValidPersonName(this.formData.apellidos, VALIDATION_LIMITS.PERSON_NAME_MAX)) {
        this.toastService.show('Los apellidos deben tener entre 2 y 80 caracteres y solo letras.', 'error');
        return;
      }
      if (!VALIDATION_PATTERNS.DNI.test(this.formData.dni)) {
        this.toastService.show('El DNI debe tener 8 dígitos numéricos.', 'error');
        return;
      }
      if (!this.formData.nombre.trim() || !this.formData.apellidos.trim() || !this.formData.dni.trim()) {
        this.toastService.show('Nombre, apellidos y DNI son obligatorios.', 'error');
        return;
      }
    } else {
      if (!this.formData.distrito.trim()) {
        this.toastService.show('El distrito es obligatorio para generar el alias.', 'error');
        return;
      }
    }

    const edad = Number(this.formData.edad);
    if (!Number.isInteger(edad) || edad < VALIDATION_LIMITS.AGE_MIN || edad > VALIDATION_LIMITS.AGE_MAX) {
      this.toastService.show('La edad debe ser un número entero entre 0 y 120.', 'error');
      return;
    }
    if (this.formData.direccion.length > VALIDATION_LIMITS.ADDRESS_MAX) {
      this.toastService.show('La dirección no debe superar los 200 caracteres.', 'error');
      return;
    }
    if (this.formData.telefono && !VALIDATION_PATTERNS.CELULAR.test(this.formData.telefono)) {
      this.toastService.show('El teléfono debe tener 9 dígitos numéricos.', 'error');
      return;
    }
    if (
      this.formData.contactoEmergenciaNombre &&
      !this.isValidPersonName(this.formData.contactoEmergenciaNombre, VALIDATION_LIMITS.NAME_MAX)
    ) {
      this.toastService.show('El contacto de emergencia solo permite letras y máximo 120 caracteres.', 'error');
      return;
    }
    if (
      this.formData.contactoEmergenciaTelefono &&
      !VALIDATION_PATTERNS.CELULAR.test(this.formData.contactoEmergenciaTelefono)
    ) {
      this.toastService.show('El teléfono de emergencia debe tener 9 dígitos numéricos.', 'error');
      return;
    }

    const victimData = {
      nombre: this.formData.anonimo ? '' : this.formData.nombre,
      apellidos: this.formData.anonimo ? '' : this.formData.apellidos,
      dni: this.formData.anonimo ? '' : this.formData.dni,
      edad,
      genero: this.formData.genero,
      estadoCivil: this.formData.estadoCivil,
      ocupacion: this.formData.ocupacion,
      distrito: this.formData.distrito,
      direccion: this.formData.direccion,
      telefono: this.formData.telefono,
      contactoEmergencia: {
        nombre: this.formData.contactoEmergenciaNombre,
        telefono: this.formData.contactoEmergenciaTelefono
      },
      anonimo: this.formData.anonimo,
      estado: this.formData.estado
    };

    const editing = this.victimsService.editingVictim();
    if (editing) {
      this.victimsService.update(editing.id, victimData);
    } else {
      this.victimsService.add(victimData);
    }
    
    this.victimsService.closeModal();
  }

  private normalizeForm() {
    this.formData = {
      ...this.formData,
      nombre: sanitizeLettersOnly(this.formData.nombre).trim(),
      apellidos: sanitizeLettersOnly(this.formData.apellidos).trim(),
      dni: sanitizeNumbersOnly(this.formData.dni),
      edad: sanitizeNumbersOnly(String(this.formData.edad)),
      ocupacion: normalizeText(this.formData.ocupacion),
      direccion: normalizeText(this.formData.direccion),
      telefono: sanitizeNumbersOnly(this.formData.telefono),
      contactoEmergenciaNombre: sanitizeLettersOnly(this.formData.contactoEmergenciaNombre).trim(),
      contactoEmergenciaTelefono: sanitizeNumbersOnly(this.formData.contactoEmergenciaTelefono),
    };
  }

  private isValidPersonName(value: string, max: number): boolean {
    return value.length >= VALIDATION_LIMITS.NAME_MIN && value.length <= max && VALIDATION_PATTERNS.PERSON_NAME.test(value);
  }
}
