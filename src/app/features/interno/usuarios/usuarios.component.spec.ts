import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CrearUsuarioRequest, UsuarioResponse } from '../../../core/models/api.models';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { UsuariosComponent } from './usuarios.component';

describe('UsuariosComponent', () => {
  let fixture: ComponentFixture<UsuariosComponent>;
  let component: UsuariosComponent;
  let usuariosService: {
    list: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    inactivar: ReturnType<typeof vi.fn>;
  };
  let toastService: { show: ReturnType<typeof vi.fn> };

  const usuarios: UsuarioResponse[] = [
    {
      id: 'usuario-1',
      correo: 'admin@safezone.gob.pe',
      nombres: 'Admin',
      apellidos: 'SafeZone',
      dni: '12345678',
      telefono: '999888777',
      distrito: 'Lima',
      rol: 'ADMIN',
      activo: true,
    },
    {
      id: 'usuario-2',
      correo: 'victima@safezone.gob.pe',
      nombres: 'Ana',
      apellidos: 'Lopez',
      dni: '87654321',
      telefono: '999111222',
      distrito: 'Comas',
      rol: 'VICTIMA',
      activo: false,
    },
  ];

  beforeEach(async () => {
    usuariosService = {
      list: vi.fn().mockReturnValue(of(usuarios)),
      create: vi.fn().mockReturnValue(of({ ...usuarios[0], id: 'usuario-2' })),
      update: vi.fn().mockReturnValue(of(usuarios[0])),
      inactivar: vi.fn().mockReturnValue(of(undefined)),
    };
    toastService = { show: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, UsuariosComponent],
      providers: [
        { provide: UsuariosService, useValue: usuariosService },
        {
          provide: AuthService,
          useValue: {
            roles: ['Administrador', 'Recepcionista', 'Psicólogo', 'Defensor Legal', 'Víctima'],
          },
        },
        { provide: ToastService, useValue: toastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads users from the backend service', () => {
    expect(usuariosService.list).toHaveBeenCalledOnce();
    expect(component.users()).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'usuario-1',
        nombreCompleto: 'Admin SafeZone',
        email: 'admin@safezone.gob.pe',
        rol: 'Administrador',
        estado: 'Activo',
      }),
    ]));
  });

  it('filters users by status and clears active filters', () => {
    component.searchQuery.set('ana');
    component.statusFilter.set('Inactivo');

    expect(component.filteredUsers()).toEqual([
      expect.objectContaining({ id: 'usuario-2', estado: 'Inactivo' }),
    ]);
    expect(component.hasActiveFilters()).toBe(true);

    component.clearFilters();

    expect(component.searchQuery()).toBe('');
    expect(component.roleFilter()).toBe('all');
    expect(component.statusFilter()).toBe('all');
    expect(component.filteredUsers()).toHaveLength(2);
  });

  it('creates a backend user with the required fields and backend role', () => {
    component.openCreate();
    component.formData = {
      nombres: 'Maria',
      apellidos: 'Torres',
      email: 'recepcion@safezone.gob.pe',
      contrasena: 'ClaveSegura123!',
      dni: '45678912',
      telefono: '999888777',
      distrito: 'Comas',
      rol: 'Recepcionista',
      estado: 'Activo',
    };

    component.saveUser();

    const expectedRequest: CrearUsuarioRequest = {
      correo: 'recepcion@safezone.gob.pe',
      contrasena: 'ClaveSegura123!',
      nombres: 'Maria',
      apellidos: 'Torres',
      dni: '45678912',
      telefono: '999888777',
      distrito: 'Comas',
      rol: 'RECEPCIONISTA',
    };
    expect(usuariosService.create).toHaveBeenCalledWith(expectedRequest);
  });

  it('blocks creation when the initial password is weak', () => {
    component.openCreate();
    component.formData = {
      nombres: 'Maria',
      apellidos: 'Torres',
      email: 'recepcion@safezone.gob.pe',
      contrasena: 'clave',
      dni: '45678912',
      telefono: '999888777',
      distrito: 'Comas',
      rol: 'Recepcionista',
      estado: 'Activo',
    };

    component.saveUser();

    expect(usuariosService.create).not.toHaveBeenCalled();
    expect(toastService.show).toHaveBeenCalledWith(expect.stringContaining('contraseña'), 'error');
  });

  it('toggles initial password visibility from the create modal', () => {
    component.openCreate();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('#contrasena') as HTMLInputElement;
    const button = fixture.nativeElement.querySelector('.sz-password-toggle') as HTMLButtonElement;

    expect(input.type).toBe('password');
    button.click();
    fixture.detectChanges();

    expect(component.showPassword()).toBe(true);
    expect((fixture.nativeElement.querySelector('#contrasena') as HTMLInputElement).type).toBe('text');
  });
});
