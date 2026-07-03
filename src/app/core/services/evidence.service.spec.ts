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

  it('sube evidencia directa vinculada a un caso', () => {
    const file = new File(['contenido'], 'foto.png', { type: 'image/png' });

    service.uploadDirecto(file, { casoId: 'caso-1' });

    const uploadRequest = http.expectOne(
      (request) => request.url === 'http://localhost:8080/api/evidencias' && request.method === 'POST',
    );
    expect(uploadRequest.request.body.get('casoId')).toBe('caso-1');
    uploadRequest.flush({
      id: 'evidencia-2',
      url: '/uploads/foto.png',
      nombreOriginal: 'foto.png',
      tamano: 2048,
      tipoMime: 'image/png',
      subidoPor: 'usuario-1',
      fechaCreacion: '2026-07-03T08:00:00',
      casoId: 'caso-1',
      denunciaId: null,
      predenunciaId: null,
    });

    const reloadRequest = http.expectOne('http://localhost:8080/api/evidencias');
    reloadRequest.flush([]);
  });

  it('agrupa evidencias por caso y separa las pendientes de vincular', () => {
    const evidencias = [
      evidencia('e-1', 'caso-1'),
      evidencia('e-2', 'caso-2'),
      evidencia('e-3', null),
    ];

    expect(service.evidenciasDelCaso(evidencias, 'caso-1')).toEqual([evidencias[0]]);
    expect(service.evidenciasSinCaso(evidencias)).toEqual([evidencias[2]]);
  });
});

function evidencia(id: string, casoId: string | null) {
  return {
    id,
    url: `/uploads/${id}.png`,
    name: `${id}.png`,
    size: '1.0 MB',
    type: 'Imagen',
    date: '2026-07-03T08:00:00',
    uploader: 'usuario-1',
    riskIcon: 'image',
    casoId,
    denunciaId: null,
    predenunciaId: null,
  };
}
