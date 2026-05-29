import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicFooterComponent } from '../components/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../components/public-header/public-header.component';

@Component({
  selector: 'app-contacto-page',
  standalone: true,
  imports: [RouterLink, PublicHeaderComponent, PublicFooterComponent],
  templateUrl: './contacto.page.html',
  styleUrl: './contacto.page.css'
})
export class ContactoPage {}
