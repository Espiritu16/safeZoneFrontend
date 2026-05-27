import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  public readonly isSidebarCollapsed = signal<boolean>(false);
  public readonly isMobileSidebarOpen = signal<boolean>(false);

  toggleSidebar() {
    this.isSidebarCollapsed.update(val => !val);
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen.update(val => !val);
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen.set(false);
  }
}
