import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

type QueryValue = string | number | boolean | null | undefined;

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = this.resolveBaseUrl();

  getBaseUrl(): string {
    return this.baseUrl;
  }

  get<T>(path: string, params?: Record<string, QueryValue>): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, { params: this.toParams(params) });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body);
  }

  patch<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body);
  }

  private resolveBaseUrl(): string {
    if (!Capacitor.isNativePlatform()) {
      return environment.apiBaseUrl;
    }

    if (Capacitor.getPlatform() === 'android') {
      return environment.androidApiBaseUrl;
    }

    if (Capacitor.getPlatform() === 'ios') {
      return environment.iosApiBaseUrl;
    }

    return environment.apiBaseUrl;
  }

  private toParams(params?: Record<string, QueryValue>): HttpParams {
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params ?? {})) {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    }
    return httpParams;
  }
}
