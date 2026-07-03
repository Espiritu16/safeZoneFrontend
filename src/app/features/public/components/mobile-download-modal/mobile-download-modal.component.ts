import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-download-modal',
  standalone: true,
  templateUrl: './mobile-download-modal.component.html',
  styleUrl: './mobile-download-modal.component.css',
})
export class MobileDownloadModalComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  readonly androidApkUrl = '/downloads/safezone-android.apk?v=6215f52';

  close(): void {
    this.closed.emit();
  }
}
