import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  text: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastsSignal = signal<Toast[]>([]);
  public readonly toasts = this.toastsSignal.asReadonly();

  show(text: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    const id = Date.now();
    this.toastsSignal.update(t => [...t, { id, text, type }]);
    
    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }

  remove(id: number) {
    this.toastsSignal.update(tList => tList.filter(item => item.id !== id));
  }
}
