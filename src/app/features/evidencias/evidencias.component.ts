import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvidenceService } from '../../core/services/evidence.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-evidencias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evidencias.component.html',
  styleUrl: './evidencias.component.scss'
})
export class EvidenciasComponent {
  protected readonly evidenceService = inject(EvidenceService);
  protected readonly toastService = inject(ToastService);
}
