import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VictimsService, Victim } from '../../core/services/victims.service';
import { ToastService } from '../../core/services/toast.service';
import { CasesService } from '../../core/services/cases.service';
import { AppointmentsService } from '../../core/services/appointments.service';
import { EvidenceService } from '../../core/services/evidence.service';
import { 
  onlyLetters, 
  isValidDni, 
  isValidCelular, 
  trimAndCollapse, 
  blockNonNumericKeys, 
  filterNumericInput 
} from '../../shared/utils/validation.utils';

@Component({
  selector: 'app-victimas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './victimas.component.html',
  styleUrl: './victimas.component.scss'
})
export class VictimasComponent {
  protected readonly victimsService = inject(VictimsService);
  protected readonly toastService = inject(ToastService);
  protected readonly casesService = inject(CasesService);
  protected readonly appointmentsService = inject(AppointmentsService);
  protected readonly evidenceService = inject(EvidenceService);

  activeTab = signal<'perfil' | 'denuncias' | 'citas' | 'seguimientos' | 'evidencias'>('perfil');

  // Filtros dinámicos para el historial de la víctima seleccionada
  selectedVictimCases = computed(() => {
    const selected = this.victimsService.selectedVictim();
    if (!selected) return [];
    return this.casesService.casos().filter(c => {
      // Comparar por nombre real o por alias (según anonimato)
      const nameMatch = c.victim.toLowerCase() === (selected.nombre + ' ' + selected.apellidos).toLowerCase();
      const aliasMatch = selected.anonimo && c.victim.toLowerCase() === selected.alias.toLowerCase();
      return nameMatch || aliasMatch;
    });
  });

  selectedVictimAppointments = computed(() => {
    const cases = this.selectedVictimCases();
    if (cases.length === 0) return [];
    const caseCodes = cases.map(c => c.codigo.toLowerCase());
    return this.appointmentsService.citas().filter(app => {
      return caseCodes.includes(app.caso.toLowerCase());
    });
  });

  selectedVictimEvidences = computed(() => {
    const cases = this.selectedVictimCases();
    if (cases.length === 0) return [];
    return this.evidenceService.evidencias();
  });

  formData = {
    nombre: '',
    apellidos: '',
    dni: '',
    edad: 18,
    genero: 'Femenino',
    estadoCivil: 'Soltera',
    ocupacion: '',
    distrito: 'Lima Cercado',
    direccion: '',
    telefono: '',
    contactoEmergenciaNombre: '',
    contactoEmergenciaTelefono: '',
    anonimo: false,
    estado: 'Activo'
  };

  errors = {
    nombre: '',
    apellidos: '',
    dni: '',
    edad: '',
    direccion: '',
    telefono: '',
    contactoEmergenciaNombre: '',
    contactoEmergenciaTelefono: ''
  };

  clearError(field: keyof typeof this.errors) {
    this.errors[field] = '';
  }

  onNumericKeydown(event: KeyboardEvent) {
    blockNonNumericKeys(event);
  }

  onDniInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.formData.dni = filterNumericInput(input.value);
    this.clearError('dni');
  }

  onEdadInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const filtered = filterNumericInput(input.value);
    this.formData.edad = filtered ? Number(filtered) : 0;
    this.clearError('edad');
  }

  onTelefonoInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.formData.telefono = filterNumericInput(input.value);
    this.clearError('telefono');
  }

  onContactoTelefonoInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.formData.contactoEmergenciaTelefono = filterNumericInput(input.value);
    this.clearError('contactoEmergenciaTelefono');
  }

  openCreate() {
    this.formData = {
      nombre: '', apellidos: '', dni: '', edad: 18, genero: 'Femenino', estadoCivil: 'Soltera',
      ocupacion: '', distrito: 'Lima Cercado', direccion: '', telefono: '',
      contactoEmergenciaNombre: '', contactoEmergenciaTelefono: '',
      anonimo: false, estado: 'Activo'
    };
    this.errors = {
      nombre: '', apellidos: '', dni: '', edad: '', direccion: '', telefono: '',
      contactoEmergenciaNombre: '', contactoEmergenciaTelefono: ''
    };
    this.victimsService.openCreateModal();
  }

  openEdit(v: Victim) {
    this.formData = {
      nombre: v.nombre,
      apellidos: v.apellidos,
      dni: v.dni,
      edad: v.edad,
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
    this.errors = {
      nombre: '', apellidos: '', dni: '', edad: '', direccion: '', telefono: '',
      contactoEmergenciaNombre: '', contactoEmergenciaTelefono: ''
    };
    this.victimsService.openEditModal(v);
  }

  saveVictim() {
    let hasError = false;

    // Sanitización en tiempo de guardado
    this.formData.nombre = trimAndCollapse(this.formData.nombre);
    this.formData.apellidos = trimAndCollapse(this.formData.apellidos);
    this.formData.direccion = trimAndCollapse(this.formData.direccion);
    this.formData.contactoEmergenciaNombre = trimAndCollapse(this.formData.contactoEmergenciaNombre);

    if (!this.formData.anonimo) {
      if (!this.formData.nombre) {
        this.errors.nombre = 'El nombre es obligatorio.';
        hasError = true;
      } else if (!onlyLetters(this.formData.nombre)) {
        this.errors.nombre = 'Solo se permiten letras, espacios, apóstrofe y guion.';
        hasError = true;
      } else if (this.formData.nombre.length < 2 || this.formData.nombre.length > 80) {
        this.errors.nombre = 'El nombre debe tener entre 2 y 80 caracteres.';
        hasError = true;
      } else {
        this.errors.nombre = '';
      }

      if (!this.formData.apellidos) {
        this.errors.apellidos = 'Los apellidos son obligatorios.';
        hasError = true;
      } else if (!onlyLetters(this.formData.apellidos)) {
        this.errors.apellidos = 'Solo se permiten letras, espacios, apóstrofe y guion.';
        hasError = true;
      } else if (this.formData.apellidos.length < 2 || this.formData.apellidos.length > 80) {
        this.errors.apellidos = 'Los apellidos deben tener entre 2 y 80 caracteres.';
        hasError = true;
      } else {
        this.errors.apellidos = '';
      }

      if (!isValidDni(this.formData.dni)) {
        this.errors.dni = 'El DNI debe tener exactamente 8 dígitos.';
        hasError = true;
      } else {
        this.errors.dni = '';
      }
    } else {
      this.errors.nombre = '';
      this.errors.apellidos = '';
      this.errors.dni = '';
    }

    const edadNum = Number(this.formData.edad);
    if (this.formData.edad === null || this.formData.edad === undefined || String(this.formData.edad).trim() === '') {
      this.errors.edad = 'La edad es obligatoria.';
      hasError = true;
    } else if (isNaN(edadNum) || edadNum < 0 || edadNum > 120) {
      this.errors.edad = 'La edad debe estar en el rango de 0 a 120.';
      hasError = true;
    } else {
      this.errors.edad = '';
    }

    if (this.formData.direccion.length > 200) {
      this.errors.direccion = 'La dirección no debe exceder los 200 caracteres.';
      hasError = true;
    } else {
      this.errors.direccion = '';
    }

    if (this.formData.telefono && !isValidCelular(this.formData.telefono)) {
      this.errors.telefono = 'El celular debe tener exactamente 9 dígitos.';
      hasError = true;
    } else {
      this.errors.telefono = '';
    }

    if (this.formData.contactoEmergenciaNombre) {
      if (!onlyLetters(this.formData.contactoEmergenciaNombre)) {
        this.errors.contactoEmergenciaNombre = 'Solo se permiten letras, espacios, apóstrofe y guion.';
        hasError = true;
      } else if (this.formData.contactoEmergenciaNombre.length > 120) {
        this.errors.contactoEmergenciaNombre = 'El nombre de contacto no debe exceder los 120 caracteres.';
        hasError = true;
      } else {
        this.errors.contactoEmergenciaNombre = '';
      }
    } else {
      this.errors.contactoEmergenciaNombre = '';
    }

    if (this.formData.contactoEmergenciaTelefono && !isValidCelular(this.formData.contactoEmergenciaTelefono)) {
      this.errors.contactoEmergenciaTelefono = 'El celular de contacto debe tener exactamente 9 dígitos.';
      hasError = true;
    } else {
      this.errors.contactoEmergenciaTelefono = '';
    }

    if (hasError) {
      this.toastService.show('Por favor, corrija los errores del formulario.', 'error');
      return;
    }

    // Coherencia del anonimato: si es anónimo, borrar datos personales
    if (this.formData.anonimo) {
      this.formData.nombre = '';
      this.formData.apellidos = '';
      this.formData.dni = '';
      this.formData.direccion = '';
    }

    const victimData = {
      nombre: this.formData.nombre,
      apellidos: this.formData.apellidos,
      dni: this.formData.dni,
      edad: Number(this.formData.edad),
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
}
