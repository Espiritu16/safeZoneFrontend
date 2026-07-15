import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { ToastService } from '../../../core/services/toast.service';
import { ReportsService } from '../../../core/services/reports.service';
import type { NivelRiesgo, ReporteMensualRequest, ReporteMensualResponse } from '../../../core/models/api.models';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent {
  protected readonly toastService = inject(ToastService);
  private readonly reportsService = inject(ReportsService);
  @ViewChild('riesgoChart') private riesgoChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('tipoChart') private tipoChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('distritoChart') private distritoChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('citasChart') private citasChart?: ElementRef<HTMLCanvasElement>;
  private charts: Chart[] = [];
  private refreshTimer?: ReturnType<typeof setTimeout>;
  private viewReady = false;

  protected readonly fechaDesde = signal<string>('');
  protected readonly fechaHasta = signal<string>('');
  protected readonly tipoViolencia = signal<string>('');
  protected readonly nivelRiesgo = signal<NivelRiesgo | ''>('');
  protected readonly reporte = signal<ReporteMensualResponse | null>(null);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly isExporting = signal<boolean>(false);
  protected readonly updatedAt = signal<string>('');

  protected readonly tiposViolencia = [
    { value: '', label: 'Todos los tipos' },
    { value: 'FISICA', label: 'Física' },
    { value: 'PSICOLOGICA', label: 'Psicológica' },
    { value: 'SEXUAL', label: 'Sexual' },
    { value: 'ECONOMICA', label: 'Económica' },
    { value: 'PATRIMONIAL', label: 'Patrimonial' },
    { value: 'DIGITAL', label: 'Digital' },
    { value: 'OTRA', label: 'Otra' },
  ];

  protected readonly riesgos: Array<{ value: NivelRiesgo | ''; label: string }> = [
    { value: '', label: 'Todos los riesgos' },
    { value: 'BAJO', label: 'Bajo' },
    { value: 'MEDIO', label: 'Medio' },
    { value: 'ALTO', label: 'Alto' },
    { value: 'CRITICO', label: 'Crítico' },
  ];

  constructor() {
    effect(() => {
      this.scheduleAutoRefresh(this.buildRequest());
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderCharts();
  }

  ngOnDestroy(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    this.destroyCharts();
  }

  protected generarReporte(request: ReporteMensualRequest = this.buildRequest()): void {
    this.isLoading.set(true);
    this.reportsService.generarMensual(request).subscribe({
      next: (response) => {
        this.reporte.set(response);
        this.updatedAt.set(new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }));
        this.isLoading.set(false);
        setTimeout(() => this.renderCharts());
      },
      error: () => {
        this.toastService.show('No se pudo generar el reporte.', 'error');
        this.isLoading.set(false);
      },
    });
  }

  protected exportarExcel(): void {
    this.isExporting.set(true);
    this.reportsService.generarMensualExcel(this.buildRequest()).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte-safezone-${this.fechaDesde() || 'inicio'}-${this.fechaHasta() || 'hoy'}.xlsx`;
        link.click();
        URL.revokeObjectURL(url);
        this.isExporting.set(false);
      },
      error: () => {
        this.toastService.show('No se pudo exportar el reporte en Excel.', 'error');
        this.isExporting.set(false);
      },
    });
  }

  @HostListener('window:focus')
  protected refreshOnFocus(): void {
    this.generarReporte();
  }

  @HostListener('document:visibilitychange')
  protected refreshOnVisibility(): void {
    if (document.visibilityState === 'visible') {
      this.generarReporte();
    }
  }

  protected porcentaje(value: number, total: number): string {
    if (!total) {
      return '0%';
    }
    return `${Math.round((value / total) * 100)}%`;
  }

  protected entries(record: Record<string, number> | undefined | null): Array<{ key: string; value: number }> {
    return Object.entries(record ?? {}).map(([key, value]) => ({ key, value }));
  }

  protected maxValue(record: Record<string, number> | undefined | null): number {
    return Math.max(1, ...Object.values(record ?? {}));
  }

  protected barWidth(value: number, record: Record<string, number> | undefined | null): string {
    return `${Math.max(8, Math.round((value / this.maxValue(record)) * 100))}%`;
  }

  private renderCharts(): void {
    if (!this.viewReady || !this.reporte()) {
      return;
    }
    this.destroyCharts();
    const reporte = this.reporte();
    if (!reporte) {
      return;
    }

    this.createDoughnutChart(
      this.riesgoChart,
      'Riesgo',
      this.entries(reporte.porNivelRiesgo),
      ['#16a34a', '#f59e0b', '#f97316', '#dc2626'],
    );
    this.createBarChart(
      this.tipoChart,
      'Casos por tipo de violencia',
      this.entries(reporte.porTipoViolencia),
      '#2563eb',
      false,
    );
    this.createBarChart(
      this.distritoChart,
      'Casos por distrito',
      this.entries(reporte.porDistrito),
      '#7c3aed',
      false,
    );
    this.createBarChart(
      this.citasChart,
      'Estado de citas',
      [
        { key: 'Atendidas', value: reporte.citasAtendidas },
        { key: 'Canceladas', value: reporte.citasCanceladas },
        { key: 'No asistidas', value: reporte.citasNoAsistidas },
      ],
      '#0891b2',
      true,
    );
  }

  private createDoughnutChart(
    canvas: ElementRef<HTMLCanvasElement> | undefined,
    label: string,
    data: Array<{ key: string; value: number }>,
    colors: string[],
  ): void {
    if (!canvas || data.length === 0) {
      return;
    }
    this.charts.push(new Chart(canvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: data.map((item) => item.key),
        datasets: [{
          label,
          data: data.map((item) => item.value),
          backgroundColor: colors,
          borderColor: '#ffffff',
          borderWidth: 2,
        }],
      },
      options: this.chartOptions(),
    }));
  }

  private createBarChart(
    canvas: ElementRef<HTMLCanvasElement> | undefined,
    label: string,
    data: Array<{ key: string; value: number }>,
    color: string,
    horizontal: boolean,
  ): void {
    if (!canvas || data.length === 0) {
      return;
    }
    this.charts.push(new Chart(canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map((item) => item.key),
        datasets: [{
          label,
          data: data.map((item) => item.value),
          backgroundColor: color,
          borderRadius: 6,
          maxBarThickness: 34,
        }],
      },
      options: {
        ...this.chartOptions(),
        indexAxis: horizontal ? 'y' : 'x',
        scales: {
          x: { beginAtZero: true, ticks: { precision: 0 } },
          y: { beginAtZero: true, ticks: { precision: 0 } },
        },
      },
    }));
  }

  private chartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            boxWidth: 12,
            boxHeight: 12,
          },
        },
      },
    };
  }

  private destroyCharts(): void {
    this.charts.forEach((chart) => chart.destroy());
    this.charts = [];
  }

  private scheduleAutoRefresh(request: ReporteMensualRequest): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    this.refreshTimer = setTimeout(() => this.generarReporte(request), 350);
  }

  private buildRequest(): ReporteMensualRequest {
    return {
      fechaDesde: this.fechaDesde() ? `${this.fechaDesde()}T00:00:00-05:00` : null,
      fechaHasta: this.fechaHasta() ? `${this.fechaHasta()}T23:59:59-05:00` : null,
      tipoViolencia: this.tipoViolencia().trim() || null,
      nivelRiesgo: this.nivelRiesgo() || null,
    };
  }
}
