import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CasesService } from '../../core/services/cases.service';

@Component({
  selector: 'app-casos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './casos.component.html',
  styleUrl: './casos.component.scss'
})
export class CasosComponent {
  protected readonly casesService = inject(CasesService);
  protected readonly casesViewMode = signal<string>('table');
}
