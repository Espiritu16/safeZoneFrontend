import { Component, ElementRef, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, map, switchMap } from 'rxjs';
import type { PreDenunciaResponse, VictimaHistorialItem } from '../../../../core/models/api.models';
import { AuthService } from '../../../../core/services/auth.service';
import { EvidenceService } from '../../../../core/services/evidence.service';
import { PredenunciasService } from '../../../../core/services/predenuncias.service';
import { UsuarioHistorialService } from '../../../../core/services/usuario-historial.service';
import { DistrictComboboxComponent } from '../../../../shared/components/district-combobox/district-combobox.component';

interface RegistroVictima {
  id: string;
  sourceId: string;
  tipo: 'PREDENUNCIA' | 'DENUNCIA';
  codigo: string;
  titulo: string;
  descripcion: string;
  estado: string;
  etiqueta: string;
  fechaInicio?: string | null;
  fechaActualizacion?: string | null;
  proximoPaso: string;
  casoId?: string | null;
  denunciaId?: string | null;
  timeline: Array<{ label: string; detail: string; date: string; complete: boolean }>;
}

@Component({
  selector: 'app-usuario-denuncias-page',
  standalone: true,
  imports: [ReactiveFormsModule, DistrictComboboxComponent],
  templateUrl: './denuncias.page.html',
  styleUrl: './denuncias.page.css'
})
export class UsuarioDenunciasPage implements OnInit {
  @ViewChild('newPredenunciaPanel') private newPredenunciaPanel?: ElementRef<HTMLElement>;
  @ViewChild('caseConsultationPanel') private caseConsultationPanel?: ElementRef<HTMLElement>;

  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly authService = inject(AuthService);
  protected readonly evidenceService = inject(EvidenceService);
  private readonly predenunciasService = inject(PredenunciasService);
  protected readonly historialService = inject(UsuarioHistorialService);

  protected readonly showNewPredenuncia = signal(false);
  protected readonly showCaseConsultation = signal(false);
  protected readonly currentReportStep = signal(1);
  protected readonly isSubmitting = signal(false);
  protected readonly isLoadingRecords = signal(false);
  protected readonly myPredenuncias = signal<PreDenunciaResponse[]>([]);
  protected readonly selectedRecordId = signal('');
  protected readonly submitMessage = signal('');
  protected readonly submitError = signal('');
  protected readonly recordsError = signal('');
  protected readonly registros = computed<RegistroVictima[]>(() => {
    const predenuncias = this.myPredenuncias().map((record) => this.toPredenunciaRegistro(record));
    const denunciaIdsFromPredenuncias = new Set(this.myPredenuncias().map((record) => record.denunciaId).filter(Boolean));
    const denuncias = this.historialService.denuncias()
      .filter((denuncia) => !denunciaIdsFromPredenuncias.has(denuncia.id))
      .map((denuncia) => this.toDenunciaRegistro(denuncia));

    return [...predenuncias, ...denuncias].sort((a, b) => {
      const dateA = new Date(a.fechaActualizacion ?? a.fechaInicio ?? 0).getTime();
      const dateB = new Date(b.fechaActualizacion ?? b.fechaInicio ?? 0).getTime();
      return dateB - dateA;
    });
  });
  protected readonly selectedRecord = computed(() => {
    const records = this.registros();
    const selectedId = this.selectedRecordId();
    return records.find((record) => record.id === selectedId) ?? records[0] ?? null;
  });

  protected readonly situationTypes = [
    {
      value: 'FISICA',
      icon: 'back_hand',
      title: 'Violencia Fisica',
      description: 'Uso de la fuerza que cause o pueda causar dano fisico.',
    },
    {
      value: 'PSICOLOGICA',
      icon: 'psychology',
      title: 'Violencia Psicologica',
      description: 'Dano emocional, intimidacion, amenazas o disminucion de la autoestima.',
    },
    {
      value: 'SEXUAL',
      icon: 'shield_person',
      title: 'Violencia Sexual',
      description: 'Actos de naturaleza sexual realizados sin consentimiento o mediante coercion.',
    },
    {
      value: 'ECONOMICA',
      icon: 'account_balance_wallet',
      title: 'Violencia Economica',
      description: 'Control, limitacion o privacion del acceso a recursos economicos.',
    },
    {
      value: 'PATRIMONIAL',
      icon: 'home_work',
      title: 'Violencia Patrimonial',
      description: 'Dano, retencion, sustraccion o destruccion de bienes o documentos.',
    },
    {
      value: 'DIGITAL',
      icon: 'phonelink_lock',
      title: 'Violencia Digital',
      description: 'Acoso, amenazas, difusion no consentida o control mediante medios digitales.',
    },
    {
      value: 'OTRA',
      icon: 'more_horiz',
      title: 'Otra forma de violencia',
      description: 'Situaciones no clasificadas en los tipos anteriores.',
    },
  ] as const;

  protected readonly reportSteps = [
    { step: 1, icon: 'category', label: 'Tipo de situacion' },
    { step: 2, icon: 'description', label: 'Detalle de los hechos' },
    { step: 3, icon: 'attach_file', label: 'Evidencias' },
    { step: 4, icon: 'contact_mail', label: 'Informacion de contacto' },
    { step: 5, icon: 'fact_check', label: 'Revision y envio' },
  ] as const;

  protected readonly newPredenunciaForm = this.fb.group({
    tipoViolencia: ['', Validators.required],
    fechaIncidente: ['', Validators.required],
    distrito: ['', [Validators.required, Validators.maxLength(120)]],
    descripcionHecho: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(4000)]],
    contactoValor: ['', Validators.maxLength(255)],
    aceptoTerminos: [false, Validators.requiredTrue],
  });

  ngOnInit(): void {
    this.loadMyRecords();
    this.historialService.load().subscribe({ error: () => undefined });
  }

  protected openNewPredenuncia(): void {
    this.showCaseConsultation.set(false);
    this.showNewPredenuncia.set(true);
    this.currentReportStep.set(1);
    this.submitMessage.set('');
    this.submitError.set('');
    this.evidenceService.clearPending();
    requestAnimationFrame(() => {
      this.newPredenunciaPanel?.nativeElement.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    });
  }

  protected cancelNewPredenuncia(): void {
    this.showNewPredenuncia.set(false);
    this.currentReportStep.set(1);
    this.submitError.set('');
    this.newPredenunciaForm.reset({
      tipoViolencia: '',
      fechaIncidente: '',
      distrito: '',
      descripcionHecho: '',
      contactoValor: '',
      aceptoTerminos: false,
    });
    this.evidenceService.clearPending();
  }

  protected openCaseConsultation(): void {
    this.showNewPredenuncia.set(false);
    this.submitError.set('');
    if (!this.selectedRecordId() && this.registros().length > 0) {
      this.selectedRecordId.set(this.registros()[0].id);
    }
    this.showCaseConsultation.set(true);
    requestAnimationFrame(() => {
      this.caseConsultationPanel?.nativeElement.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    });
  }

  protected closeCaseConsultation(): void {
    this.showCaseConsultation.set(false);
  }

  protected selectRecord(record: RegistroVictima): void {
    this.selectedRecordId.set(record.id);
  }

  protected isSelectedRecord(record: RegistroVictima): boolean {
    return this.selectedRecord()?.id === record.id;
  }

  protected goToReportStep(step: number): void {
    if (step > this.currentReportStep() && !this.validateStep(this.currentReportStep())) {
      return;
    }
    this.currentReportStep.set(step);
    this.submitError.set('');
  }

  protected nextReportStep(): void {
    const currentStep = this.currentReportStep();
    if (!this.validateStep(currentStep)) {
      return;
    }
    this.currentReportStep.set(Math.min(5, currentStep + 1));
  }

  protected previousReportStep(): void {
    this.currentReportStep.set(Math.max(1, this.currentReportStep() - 1));
    this.submitError.set('');
  }

  protected submitNewPredenuncia(): void {
    this.submitMessage.set('');
    this.submitError.set('');
    if (![1, 2, 3, 4, 5].every((step) => this.validateStep(step))) {
      return;
    }
    if (this.newPredenunciaForm.invalid) {
      this.newPredenunciaForm.markAllAsTouched();
      this.submitError.set('Complete los campos obligatorios antes de enviar la predenuncia.');
      return;
    }

    const value = this.newPredenunciaForm.getRawValue();
    this.isSubmitting.set(true);
    this.predenunciasService.create({
      nombresContacto: this.authService.nombre(),
      apellidosContacto: 'No especificado',
      telefonoContacto: value.contactoValor || undefined,
      correoContacto: this.authService.correo() || undefined,
      descripcionHecho: value.descripcionHecho.trim(),
      tipoViolencia: value.tipoViolencia,
      fechaIncidente: this.toOffsetDateTime(value.fechaIncidente),
      distrito: value.distrito.trim(),
      direccionReferencia: 'Registrada desde el panel de victima',
      anonima: false,
    }).pipe(
      switchMap((response) => this.evidenceService.uploadAll(undefined, undefined, response.id).pipe(
        map(() => response),
      )),
      finalize(() => this.isSubmitting.set(false)),
    ).subscribe({
      next: (response) => {
        this.submitMessage.set(`Predenuncia registrada correctamente. Codigo: PD-${response.id.slice(0, 8).toUpperCase()}`);
        this.evidenceService.clearPending();
        this.cancelNewPredenuncia();
        this.loadMyRecords();
        this.historialService.refresh().subscribe({ error: () => undefined });
      },
      error: () => {
        this.submitError.set('No se pudo registrar la predenuncia. Intente nuevamente.');
      },
    });
  }

  protected trackingCode(record: PreDenunciaResponse): string {
    return `PD-${record.id.slice(0, 8).toUpperCase()}`;
  }

  protected linkedCaseCode(casoId: string | null | undefined): string {
    return casoId ? `CASO ${casoId.slice(0, 8).toUpperCase()}` : 'Sin caso asociado';
  }

  protected recordSummary(record: PreDenunciaResponse): string {
    const parts = [record.tipoViolencia, record.distrito].filter(Boolean);
    return parts.length ? parts.join(' - ') : 'Predenuncia registrada';
  }

  protected caseNextStep(record: PreDenunciaResponse): string {
    const nextSteps: Record<PreDenunciaResponse['estado'], string> = {
      PENDIENTE: 'Revisión inicial',
      EN_CONTACTO: 'Contacto institucional',
      FORMALIZADA: 'Caso formalizado',
      DESCARTADA: 'Atención cerrada',
    };
    return nextSteps[record.estado];
  }

  protected formatCaseDate(date: string | null | undefined): string {
    if (!date) {
      return 'Sin registro';
    }
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  protected timelineFor(record: PreDenunciaResponse): Array<{ label: string; detail: string; date: string; complete: boolean }> {
    const items = [
      {
        label: 'Solicitud registrada',
        detail: 'La predenuncia fue ingresada al sistema de SafeZone.',
        date: this.formatCaseDate(record.fechaCreacion),
        complete: true,
      },
      {
        label: 'Contacto institucional',
        detail: 'Un responsable valida la informacion y coordina el siguiente paso.',
        date: this.formatCaseDate(record.fechaContacto),
        complete: ['EN_CONTACTO', 'FORMALIZADA'].includes(record.estado),
      },
      {
        label: 'Formalizacion',
        detail: 'La predenuncia se convierte en denuncia para seguimiento institucional.',
        date: this.formatCaseDate(record.fechaFormalizacion),
        complete: record.estado === 'FORMALIZADA',
      },
    ];

    if (record.estado === 'DESCARTADA') {
      return [
        items[0],
        {
          label: 'Atención cerrada',
          detail: record.motivoDescarte || 'El registro fue cerrado por revisión institucional.',
          date: this.formatCaseDate(record.fechaActualizacion),
          complete: true,
        },
      ];
    }

    return items;
  }

  private loadMyRecords(): void {
    this.isLoadingRecords.set(true);
    this.recordsError.set('');
    this.predenunciasService.listMine().pipe(
      finalize(() => this.isLoadingRecords.set(false)),
    ).subscribe({
      next: (records) => {
        this.myPredenuncias.set(records);
        if (this.registros().length > 0 && !this.registros().some((record) => record.id === this.selectedRecordId())) {
          this.selectedRecordId.set(this.registros()[0].id);
        }
      },
      error: () => {
        this.myPredenuncias.set([]);
        this.recordsError.set('No se pudieron cargar tus denuncias vinculadas.');
      },
    });
  }

  private toOffsetDateTime(date: string): string | undefined {
    return date ? new Date(`${date}T00:00:00-05:00`).toISOString() : undefined;
  }

  private toPredenunciaRegistro(record: PreDenunciaResponse): RegistroVictima {
    return {
      id: `predenuncia-${record.id}`,
      sourceId: record.id,
      tipo: 'PREDENUNCIA',
      codigo: this.trackingCode(record),
      titulo: this.recordSummary(record),
      descripcion: record.descripcionHecho,
      estado: record.estado,
      etiqueta: record.denunciaId ? 'Predenuncia formalizada' : 'Predenuncia',
      fechaInicio: record.fechaCreacion,
      fechaActualizacion: record.fechaActualizacion,
      proximoPaso: this.caseNextStep(record),
      casoId: record.casoId,
      denunciaId: record.denunciaId,
      timeline: this.timelineFor(record),
    };
  }

  private toDenunciaRegistro(denuncia: VictimaHistorialItem): RegistroVictima {
    const codigo = `DN-${denuncia.id.slice(0, 8).toUpperCase()}`;
    return {
      id: `denuncia-${denuncia.id}`,
      sourceId: denuncia.id,
      tipo: 'DENUNCIA',
      codigo,
      titulo: denuncia.titulo || 'Denuncia formal',
      descripcion: denuncia.detalle || 'Denuncia formal vinculada a tu cuenta.',
      estado: denuncia.estado || 'FORMALIZADA',
      etiqueta: 'Denuncia formal',
      fechaInicio: denuncia.fecha,
      fechaActualizacion: denuncia.fecha,
      proximoPaso: denuncia.casoId ? 'Seguimiento en caso asociado' : 'Revisión institucional',
      casoId: denuncia.casoId,
      denunciaId: denuncia.id,
      timeline: [
        {
          label: 'Denuncia formalizada',
          detail: 'El registro fue incorporado como denuncia formal en el sistema institucional.',
          date: this.formatCaseDate(denuncia.fecha),
          complete: true,
        },
        {
          label: denuncia.casoId ? 'Caso asociado' : 'Caso pendiente de vinculación',
          detail: denuncia.casoId
            ? `La denuncia está vinculada al ${this.linkedCaseCode(denuncia.casoId)}.`
            : 'El equipo institucional completará la vinculación cuando corresponda.',
          date: this.formatCaseDate(denuncia.fecha),
          complete: Boolean(denuncia.casoId),
        },
      ],
    };
  }

  private validateStep(step: number): boolean {
    const fieldsByStep: Record<number, Array<keyof typeof this.newPredenunciaForm.controls>> = {
      1: ['tipoViolencia'],
      2: ['fechaIncidente', 'distrito', 'descripcionHecho'],
      3: [],
      4: ['contactoValor'],
      5: ['aceptoTerminos'],
    };
    const controls = fieldsByStep[step] ?? [];
    controls.forEach((field) => this.newPredenunciaForm.controls[field].markAsTouched());
    const invalid = controls.some((field) => this.newPredenunciaForm.controls[field].invalid);
    if (invalid) {
      this.submitError.set('Complete los campos de este paso antes de continuar.');
      return false;
    }
    this.submitError.set('');
    return true;
  }
}
