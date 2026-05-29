import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicFooterComponent } from '../components/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../components/public-header/public-header.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, PublicHeaderComponent, PublicFooterComponent],
  templateUrl: './inicio.page.html',
  styleUrl: './inicio.page.css'
})
export class InicioPage {}
