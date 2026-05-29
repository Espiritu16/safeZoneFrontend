import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicFooterComponent } from '../components/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../components/public-header/public-header.component';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [RouterLink, PublicHeaderComponent, PublicFooterComponent],
  templateUrl: './faq.page.html',
  styleUrl: './faq.page.css'
})
export class FaqPage {
  activeItem = 'predenuncia-que-es';

  toggleAccordion(item: string) {
    this.activeItem = this.activeItem === item ? '' : item;
  }

  isActive(item: string) {
    return this.activeItem === item;
  }
}
