import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicFooterComponent } from '../components/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../components/public-header/public-header.component';

@Component({
  selector: 'app-informacion-page',
  standalone: true,
  imports: [RouterLink, PublicHeaderComponent, PublicFooterComponent],
  templateUrl: './informacion.page.html',
  styleUrl: './informacion.page.css'
})
export class InformacionPage {}
