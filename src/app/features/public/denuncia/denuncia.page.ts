import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicFooterComponent } from '../components/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../components/public-header/public-header.component';

@Component({
  selector: 'app-denuncia-page',
  standalone: true,
  imports: [RouterLink, PublicHeaderComponent, PublicFooterComponent],
  templateUrl: './denuncia.page.html',
  styleUrl: './denuncia.page.css'
})
export class DenunciaPage {
  currentStep = 1;
  submitted = false;

  goToStep(step: number) {
    this.currentStep = step;
    this.submitted = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submitForm() {
    this.submitted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  startOver() {
    this.currentStep = 1;
    this.submitted = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
