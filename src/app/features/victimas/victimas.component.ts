import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VictimsService, Victim } from '../../core/services/victims.service';
import { ToastService } from '../../core/services/toast.service';

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

  activeTab = signal<'perfil' | 'denuncias' | 'citas' | 'seguimientos' | 'evidencias'>('perfil');

  formData = {
    nombre: '',
    apellidos: '',
    dni: '',
    edad: 18,
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

  openCreate() {
    this.formData = {
      nombre: '', apellidos: '', dni: '', edad: 18, genero: 'Femenino', estadoCivil: 'Soltera',
      ocupacion: '', distrito: 'Lima', direccion: '', telefono: '',
      contactoEmergenciaNombre: '', contactoEmergenciaTelefono: '',
      anonimo: false, estado: 'Activo'
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
    this.victimsService.openEditModal(v);
  }

  saveVictim() {
    if (!this.formData.anonimo) {
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

    const victimData = {
      nombre: this.formData.nombre,
      apellidos: this.formData.apellidos,
      dni: this.formData.dni,
      edad: this.formData.edad,
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
