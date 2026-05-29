import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PublicFooterComponent } from '../../components/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../../components/public-header/public-header.component';

@Component({
  selector: 'app-usuario-layout-page',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, PublicHeaderComponent, PublicFooterComponent],
  templateUrl: './usuario-layout.page.html',
  styleUrl: './usuario-layout.page.css'
})
export class UsuarioLayoutPage {}
