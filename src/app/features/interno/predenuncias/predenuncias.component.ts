import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, Observable, of, switchMap } from 'rxjs';
import type { CrearUsuarioRequest, EstadoPreDenuncia, NivelRiesgo, PreDenunciaResponse, UsuarioResponse } from '../../../core/models/api.models';
import { PredenunciasService } from '../../../core/services/predenuncias.service';
import { ToastService } from '../../../core/services/toast.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { LettersOnlyDirective } from '../../../shared/directives/letters-only.directive';
import { NumbersOnlyDirective } from '../../../shared/directives/numbers-only.directive';
import { TrimOnBlurDirective } from '../../../shared/directives/trim-on-blur.directive';
import { sanitizeLettersOnly, sanitizeNumbersOnly } from '../../../shared/utils/input-sanitizers.util';
import { VALIDATION_PATTERNS } from '../../../shared/utils/validation-rules';
import { DistrictComboboxComponent } from '../../../shared/components/district-combobox/district-combobox.component';

interface FormalizeForm {
  formalizarAnonima: boolean;
  dni: string;
  nombre: string;
  telefono: string;
  distrito: string;
  nivelRiesgo: NivelRiesgo;
  edad: string;
}

@Component({
  selector: 'app-predenuncias',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, LettersOnlyDirective, NumbersOnlyDirective, TrimOnBlurDirective, DistrictComboboxComponent],
  templateUrl: './predenuncias.component.html',
  styleUrl: './predenuncias.component.scss',
})
export class PredenunciasComponent implements OnInit {
  private readonly predenunciasService = inject(PredenunciasService);
  private readonly toastService = inject(ToastService);
  private readonly usuariosService = inject(UsuariosService);

  protected readonly predenuncias = signal<PreDenunciaResponse[]>([]);
  protected readonly loading = signal(false);
  protected readonly actionId = signal<string | null>(null);
  protected readonly formalizeId = signal<string | null>(null);
  protected readonly formalizeActionId = signal<string | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly searchQuery = signal('');
  protected readonly typeFilter = signal('');
  protected readonly districtFilter = signal('');
  protected readonly dateFromFilter = signal('');
  protected readonly dateToFilter = signal('');

  protected estadoFilter: EstadoPreDenuncia | '' = '';
  protected formalizeForms: Record<string, FormalizeForm> = {};

  protected readonly filteredPredenuncias = computed(() => {
    const search = this.normalize(this.searchQuery());
    const type = this.normalize(this.typeFilter());
    const district = this.normalize(this.districtFilter());
    const dateFrom = this.dateFromFilter();
    const dateTo = this.dateToFilter();

    return this.predenuncias().filter((predenuncia) => {
      const searchable = this.normalize([
        predenuncia.id,
        predenuncia.nombresContacto,
        predenuncia.apellidosContacto,
        predenuncia.telefonoContacto,
        predenuncia.correoContacto,
        predenuncia.tipoViolencia,
        predenuncia.distrito,
        predenuncia.descripcionHecho,
      ].filter(Boolean).join(' '));
      const fecha = (predenuncia.fechaCreacion || predenuncia.fechaIncidente || '').split('T')[0];

      const matchSearch = !search || searchable.includes(search);
      const matchType = !type || this.normalize(predenuncia.tipoViolencia || '') === type;
      const matchDistrict = !district || this.normalize(predenuncia.distrito || '') === district;
      const matchDateFrom = !dateFrom || fecha >= dateFrom;
      const matchDateTo = !dateTo || fecha <= dateTo;

      return matchSearch && matchType && matchDistrict && matchDateFrom && matchDateTo;
    });
  });

  protected readonly hasActiveFilters = computed(() =>
    this.searchQuery().trim() !== '' ||
    this.estadoFilter !== '' ||
    this.typeFilter() !== '' ||
    this.districtFilter() !== '' ||
    this.dateFromFilter() !== '' ||
    this.dateToFilter() !== ''
  );

  protected readonly typeOptions = computed(() =>
    [...new Set(this.predenuncias().map((item) => item.tipoViolencia).filter(Boolean) as string[])]
      .sort((a, b) => a.localeCompare(b)),
  );

  protected readonly districtOptions = computed(() =>
    [...new Set(this.predenuncias().map((item) => item.distrito).filter(Boolean) as string[])]
      .sort((a, b) => a.localeCompare(b)),
  );

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.predenunciasService.list(this.estadoFilter || undefined).subscribe({
      next: (items) => {
        this.predenuncias.set(items);
        this.syncFormalizePanel(items);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar la bandeja de predenuncias.');
        this.loading.set(false);
      },
    });
  }

  markInContact(predenuncia: PreDenunciaResponse): void {
    this.actionId.set(predenuncia.id);

    this.predenunciasService.markInContact(predenuncia.id).subscribe({
      next: () => {
        this.toastService.show('Predenuncia asignada y marcada en contacto.', 'success');
        this.actionId.set(null);
        this.load();
      },
      error: () => {
        this.toastService.show('No se pudo asignar la predenuncia.', 'error');
        this.actionId.set(null);
      },
    });
  }

  openFormalize(predenuncia: PreDenunciaResponse): void {
    this.formalizeId.set(this.formalizeId() === predenuncia.id ? null : predenuncia.id);
    this.formalizeForms[predenuncia.id] ??= {
      formalizarAnonima: predenuncia.anonima ?? false,
      dni: '',
      edad: '',
      nombre: predenuncia.nombresContacto || '',
      telefono: predenuncia.telefonoContacto || '',
      distrito: predenuncia.distrito || 'Lima',
      nivelRiesgo: 'ALTO',
    };
  }

  formalize(predenuncia: PreDenunciaResponse): void {
    const form = this.normalizeFormalizeForm(predenuncia.id);
    if (!this.validateFormalizeForm(form)) {
      return;
    }

    this.formalizeActionId.set(predenuncia.id);
    this.resolveVictim(form).pipe(
      switchMap((victima) => this.predenunciasService.formalize(predenuncia.id, {
        victimaId: victima?.id,
        nivelRiesgo: form.nivelRiesgo,
        formalizarAnonima: form.formalizarAnonima,
        edad: Number(form.edad),
      })),
      finalize(() => this.formalizeActionId.set(null)),
    ).subscribe({
      next: () => {
        this.toastService.show('Predenuncia formalizada como denuncia y caso.', 'success');
        this.formalizeId.set(null);
        this.load();
      },
      error: () => {
        this.toastService.show('No se pudo formalizar. Verifique los datos de víctima y riesgo.', 'error');
      },
    });
  }

  protected badgeClass(estado: EstadoPreDenuncia): string {
    return {
      PENDIENTE: 'badge-warning',
      EN_CONTACTO: 'badge-info',
      FORMALIZADA: 'badge-success',
      DESCARTADA: 'badge-danger',
    }[estado];
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.estadoFilter = '';
    this.typeFilter.set('');
    this.districtFilter.set('');
    this.dateFromFilter.set('');
    this.dateToFilter.set('');
    this.load();
  }

  private syncFormalizePanel(items: PreDenunciaResponse[]): void {
    const openId = this.formalizeId();
    if (!openId) {
      return;
    }
    const openItem = items.find((item) => item.id === openId);
    if (!openItem || openItem.estado !== 'EN_CONTACTO') {
      this.formalizeId.set(null);
    }
  }

  private normalizeFormalizeForm(id: string): FormalizeForm {
    const current = this.formalizeForms[id];
    const normalized = {
      ...current,
      formalizarAnonima: Boolean(current.formalizarAnonima),
      dni: current.formalizarAnonima ? '' : sanitizeNumbersOnly(current.dni),
      nombre: current.formalizarAnonima ? 'Victima protegida' : sanitizeLettersOnly(current.nombre).trim(),
      telefono: sanitizeNumbersOnly(current.telefono),
      distrito: current.distrito.trim(),
    };
    this.formalizeForms[id] = normalized;
    return normalized;
  }

  private validateFormalizeForm(form: FormalizeForm): boolean {
    if (!form.formalizarAnonima && !VALIDATION_PATTERNS.DNI.test(form.dni)) {
      this.toastService.show('El DNI de la víctima debe tener 8 dígitos.', 'error');
      return false;
    }
    if (!form.formalizarAnonima && (!form.nombre || form.nombre.length < 2)) {
      this.toastService.show('Ingrese el nombre de la víctima.', 'error');
      return false;
    }
    if (!form.formalizarAnonima && !VALIDATION_PATTERNS.CELULAR.test(form.telefono)) {
      this.toastService.show('El teléfono debe tener 9 dígitos.', 'error');
      return false;
    }
    if (!form.distrito) {
      this.toastService.show('Ingrese el distrito de la víctima.', 'error');
      return false;
    }
    const edadNum = Number(form.edad);
    if (!form.edad || isNaN(edadNum) || edadNum <= 0 || edadNum > 120) {
      this.toastService.show('Ingrese una edad válida.', 'error');
      return false;
    }

    return true;
  }

  private resolveVictim(form: FormalizeForm): Observable<UsuarioResponse | undefined> {
    if (form.formalizarAnonima) {
      return of(undefined);
    }
    return this.usuariosService.findVictimaByDni(form.dni).pipe(
      switchMap((victima) => victima ? of(victima) : this.usuariosService.create(this.buildVictim(form))),
    );
  }

  private buildVictim(form: FormalizeForm): CrearUsuarioRequest {
    const { nombres, apellidos } = this.splitName(form.nombre);
    return {
      correo: `victima.${form.dni}@safezone.local`,
      contrasena: 'Victima123',
      nombres,
      apellidos,
      dni: form.dni,
      telefono: form.telefono,
      distrito: form.distrito,
      rol: 'VICTIMA',
    };
  }

  private splitName(fullName: string): { nombres: string; apellidos: string } {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return { nombres: parts[0], apellidos: 'No especificado' };
    }
    const midpoint = Math.ceil(parts.length / 2);
    return {
      nombres: parts.slice(0, midpoint).join(' '),
      apellidos: parts.slice(midpoint).join(' ') || 'No especificado',
    };
  }

  private normalize(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{M}/gu, '');
  }
}
