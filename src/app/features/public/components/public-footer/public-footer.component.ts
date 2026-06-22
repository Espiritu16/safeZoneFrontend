import { Component } from '@angular/core';
import { MobileDownloadModalComponent } from '../mobile-download-modal/mobile-download-modal.component';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [MobileDownloadModalComponent],
  templateUrl: './public-footer.component.html',
  styleUrl: './public-footer.component.css'
})
export class PublicFooterComponent {
  isDownloadModalOpen = false;

  openDownloadModal(): void {
    this.isDownloadModalOpen = true;
  }

  closeDownloadModal(): void {
    this.isDownloadModalOpen = false;
  }
}
