import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EvidenceService } from './evidence.service';

describe('EvidenceService', () => {
  let service: EvidenceService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(EvidenceService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('conserva url y mime de evidencias cargadas desde backend', () => {
    service.loadEvidencias().subscribe((evidencias) => {
      expect(evidencias[0].url).toBe('/uploads/audio.mp3');
      expect(evidencias[0].mimeType).toBe('audio/mpeg');
      expect(evidencias[0].type).toBe('Audio');
    });

    const request = http.expectOne('http://localhost:8080/api/evidencias');
    request.flush([
      {
        id: 'evidencia-1',
        url: '/uploads/audio.mp3',
        nombreOriginal: 'audio.mp3',
        tamano: 2048,
        tipoMime: 'audio/mpeg',
        subidoPor: 'usuario-1',
        fechaCreacion: '2026-07-03T08:00:00',
        casoId: null,
        denunciaId: null,
        predenunciaId: null,
      },
    ]);
  });

  it('descarga archivo de evidencia como blob autenticado', () => {
    service.loadArchivo('evidencia-1', true).subscribe((blob) => {
      expect(blob.type).toBe('application/pdf');
    });

    const request = http.expectOne('http://localhost:8080/api/evidencias/evidencia-1/archivo?download=true');
    expect(request.request.responseType).toBe('blob');
    request.flush(new Blob(['pdf'], { type: 'application/pdf' }));
  });
});
