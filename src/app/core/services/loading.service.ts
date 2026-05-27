import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly isLoadingSignal = signal<boolean>(false);
  public readonly isLoading = this.isLoadingSignal.asReadonly();

  setLoading(value: boolean) {
    this.isLoadingSignal.set(value);
  }

  triggerLoading(durationMs: number = 800) {
    this.isLoadingSignal.set(true);
    setTimeout(() => this.isLoadingSignal.set(false), durationMs);
  }
}
