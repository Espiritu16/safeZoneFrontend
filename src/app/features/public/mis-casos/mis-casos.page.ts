import { Component, ElementRef, ViewChild } from '@angular/core';
import { PublicFooterComponent } from '../components/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../components/public-header/public-header.component';

@Component({
  selector: 'app-mis-casos-page',
  standalone: true,
  imports: [PublicHeaderComponent, PublicFooterComponent],
  templateUrl: './mis-casos.page.html',
  styleUrl: './mis-casos.page.css'
})
export class MisCasosPage {
  @ViewChild('caseResults') caseResults?: ElementRef<HTMLElement>;

  hasConsulted = false;

  consultarCaso() {
    this.hasConsulted = true;

    const results = this.caseResults?.nativeElement;
    if (!results) return;

    requestAnimationFrame(() => {
      const header = document.querySelector('header.public-header') as HTMLElement | null;
      const headerHeight = header?.getBoundingClientRect().height ?? 80;
      const safeTopGap = 16;
      const resultsRect = results.getBoundingClientRect();
      const targetTop = window.scrollY + resultsRect.top - headerHeight - safeTopGap;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth'
      });
    });
  }
}
