# Integracion Sprint 1-2 Frontend-Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Conectar el frontend Angular de SafeZone con el backend Spring Boot para los flujos entregados en Sprint 1 y Sprint 2: autenticacion, predenuncias, usuarios base, casos, denuncias y seguimientos.

**Architecture:** La integracion debe centralizar la URL base, endpoints, contratos DTO y manejo de token en `src/app/core`. Las pantallas existentes deben conservar su estructura visual y reemplazar datos mock por servicios HTTP con estados de carga, error, vacio y exito. Los servicios de dominio expondran signals/computed para no forzar una reescritura completa de las vistas.

**Tech Stack:** Angular 21 standalone components, HttpClient, RxJS, signals, Spring Boot REST API, JWT Bearer auth, TypeScript strict-friendly DTOs.

---

## Estado Inicial Detectado

- Rama frontend creada: `feature/integracion-sprint-1-2` desde `dev` local.
- `git fetch origin` fallo por red: `Failed to connect to github.com port 443`. Al hacer `git checkout dev`, Git reporto que `dev` estaba al dia con `origin/dev` localmente.
- `src/app/app.config.ts` no registra `provideHttpClient`, por lo que no se puede usar `HttpClient` todavia.
- `src/app/core/http/api-endpoints.ts` es placeholder.
- `src/app/core/services/auth.service.ts` simula login con `localStorage` y roles por texto.
- `src/app/core/services/cases.service.ts` usa mocks en memoria.
- `src/app/features/interno/denuncias/denuncias.component.ts` crea casos mock al registrar una denuncia.
- `src/app/features/public/denuncia/denuncia.page.ts` solo marca `submitted=true`; no llama al backend.
- Rutas protegidas existen con `authGuard` y `roleGuard`, pero se basan en roles display (`Administrador`, `Psicólogo`, `Recepcionista`, `Defensor Legal`) y no en enums backend (`ADMIN`, `PSICOLOGO`, `RECEPCIONISTA`, `DEFENSOR`, `VICTIMA`, `SOPORTE`).

## Backend Disponible Para Sprint 1 y 2

Base esperada local: `http://localhost:8080/api`.

### Autenticacion Sprint 1

- `POST /api/auth/registrar`
  - Request: `{ nombre: string; correo: string; contrasena: string }`
- `POST /api/auth/iniciar-sesion`
  - Request: `{ correo: string; contrasena: string }`
  - Response: `{ success, message, usuarioId, nombre, correo, rol, token, refreshToken, tipoToken }`
- `POST /api/auth/renovar-token`
  - Request: `{ refreshToken: string }`
- `POST /api/auth/cerrar-sesion`
  - Request: `{ refreshToken: string }`
- `GET /api/auth/me`
  - Response: `{ success, message, usuarioId, nombre, correo, rol, permisos, modulos }`
- `POST /api/auth/recuperar-contrasena`
- `POST /api/auth/verificar-codigo`
- `POST /api/auth/restablecer-contrasena`

### Predenuncias Sprint 1

- `POST /api/predenuncias`
  - Request: `{ nombresContacto, apellidosContacto, telefonoContacto, correoContacto, descripcionHecho, tipoViolencia, fechaIncidente, distrito, direccionReferencia, anonima }`
- `GET /api/predenuncias`
- `GET /api/predenuncias/{id}`
- `PATCH /api/predenuncias/{id}/contactar`
- `PATCH /api/predenuncias/{id}/formalizar`
- `PATCH /api/predenuncias/{id}/descartar`

### Casos Sprint 2

- `GET /api/casos?victimaId=&aliasCodigo=&estado=&prioridad=&nivelRiesgo=`
- `GET /api/casos/{id}`
- `POST /api/casos`
  - Request: `{ victimaId, resumen, distrito, prioridad, estado? }`
- `PUT /api/casos/{id}`
  - Request: `{ resumen?, distrito?, prioridad?, activo?, estado? }`
- `PATCH /api/casos/{id}/inactivar`

Enums frontend exactos:

```ts
export type EstadoCaso = 'REGISTRADO' | 'EN_EVALUACION' | 'EN_ATENCION' | 'DERIVADO' | 'CERRADO' | 'ARCHIVADO';
export type PrioridadCaso = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
export type NivelRiesgo = 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
```

### Denuncias Sprint 2

- `GET /api/denuncias?victimaId=&casoId=&nivelRiesgo=&distrito=&tipoViolencia=`
- `GET /api/denuncias/{id}`
- `POST /api/denuncias`
  - Request: `{ casoId?, victimaId, descripcion, tipoViolencia, fechaIncidente, distrito, direccionReferencia?, nivelRiesgo, anonima?, adjuntos? }`
- `PUT /api/denuncias/{id}`
- `PATCH /api/denuncias/{id}/inactivar`

### Seguimientos Sprint 2

- `GET /api/seguimientos?casoId=&autorId=`
- `GET /api/seguimientos/{id}`
- `POST /api/seguimientos`
  - Request: `{ casoId, autorId, tipoSeguimiento, contenido, proximaAccion?, fechaProximaAccion? }`
- `PUT /api/seguimientos/{id}`
- `PATCH /api/seguimientos/{id}/inactivar`

---

## File Structure

### Crear

- `src/environments/environment.ts`
  - Define `apiBaseUrl: 'http://localhost:8080/api'`.
- `src/environments/environment.development.ts`
  - Mismo valor local para dev.
- `src/app/core/http/api-client.service.ts`
  - Wrapper tipado sobre `HttpClient` con `get/post/put/patch`.
- `src/app/core/http/auth-token.interceptor.ts`
  - Agrega `Authorization: Bearer <token>` cuando existe token.
- `src/app/core/models/api.models.ts`
  - DTOs compartidos de auth, usuarios, predenuncias, casos, denuncias y seguimientos.
- `src/app/core/utils/role-mapper.ts`
  - Mapea roles backend a labels frontend y viceversa.
- `src/app/core/services/predenuncias.service.ts`
  - Servicio real para predenuncias publicas e internas.
- `src/app/core/services/complaints.service.ts`
  - Servicio real de denuncias Sprint 2.
- `src/app/core/services/follow-ups.service.ts`
  - Servicio real de seguimientos Sprint 2.

### Modificar

- `src/app/app.config.ts`
  - Agregar `provideHttpClient(withInterceptors([authTokenInterceptor]))`.
- `src/app/core/http/api-endpoints.ts`
  - Reemplazar placeholder por endpoints reales.
- `src/app/core/services/auth.service.ts`
  - Reemplazar login mock por API real, persistir token, refresh token y contexto.
- `src/app/core/guards/auth.guard.ts`
  - Usar estado real de sesion.
- `src/app/core/guards/role.guard.ts`
  - Comparar roles normalizados del backend.
- `src/app/features/auth/login/login.component.ts`
  - Enviar `{ correo, contrasena }`, manejar loading/error.
- `src/app/features/public/components/login-modal/login-modal.component.ts`
  - Usar login real.
- `src/app/features/public/denuncia/denuncia.page.ts`
  - Enviar predenuncia real a `/api/predenuncias`.
- `src/app/core/services/cases.service.ts`
  - Reemplazar mocks por API real de casos.
- `src/app/features/interno/casos/casos.component.ts`
  - Cargar casos y actualizar estado contra backend.
- `src/app/features/interno/casos/casos.component.html`
  - Ajustar labels/badges a enums reales y estados de carga/vacio/error.
- `src/app/features/interno/denuncias/denuncias.component.ts`
  - Enviar denuncia real a `/api/denuncias`; dejar de crear caso mock manualmente.
- `src/app/features/interno/denuncias/denuncias.component.html`
  - Ajustar campos necesarios para `victimaId`, `nivelRiesgo`, `fechaIncidente` y errores backend.
- `src/app/features/interno/dashboard/dashboard.component.ts`
  - Leer metricas desde servicios reales de casos/denuncias cuando este autenticado.
- `src/app/features/public/usuario/casos/casos.page.ts` y `.html`
  - Mostrar casos del usuario autenticado cuando el rol sea `VICTIMA`.
- `src/app/features/public/usuario/denuncias/denuncias.page.ts` y `.html`
  - Mostrar denuncias del usuario autenticado.
- `src/app/features/public/usuario/notificaciones/notificaciones.page.ts` y `.html`
  - Mantener placeholder si backend de notificaciones sigue en Sprint 3; documentar dependencia.

### Tests

- `src/app/core/services/auth.service.spec.ts`
- `src/app/core/services/cases.service.spec.ts`
- `src/app/core/services/predenuncias.service.spec.ts`
- `src/app/core/services/complaints.service.spec.ts`
- `src/app/core/services/follow-ups.service.spec.ts`
- `src/app/features/public/denuncia/denuncia.page.spec.ts`
- `src/app/features/interno/denuncias/denuncias.component.spec.ts`

---

## Task 1: Configuracion HTTP Base

**Files:**
- Create: `src/environments/environment.ts`
- Create: `src/environments/environment.development.ts`
- Create: `src/app/core/http/api-client.service.ts`
- Create: `src/app/core/http/auth-token.interceptor.ts`
- Modify: `src/app/app.config.ts`
- Modify: `src/app/core/http/api-endpoints.ts`

- [ ] **Step 1: Crear environments**

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api',
};
```

- [ ] **Step 2: Definir endpoints reales**

```ts
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/iniciar-sesion',
    register: '/auth/registrar',
    me: '/auth/me',
    refresh: '/auth/renovar-token',
    logout: '/auth/cerrar-sesion',
    recoverPassword: '/auth/recuperar-contrasena',
    verifyCode: '/auth/verificar-codigo',
    resetPassword: '/auth/restablecer-contrasena',
  },
  predenuncias: '/predenuncias',
  casos: '/casos',
  denuncias: '/denuncias',
  seguimientos: '/seguimientos',
  usuarios: '/usuarios',
  victimas: '/victimas',
  panelPrincipal: '/panel-principal/me',
} as const;
```

- [ ] **Step 3: Crear `ApiClientService`**

```ts
@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  get<T>(path: string, params?: Record<string, string | number | boolean | null | undefined>): Observable<T> {
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

  private toParams(params?: Record<string, string | number | boolean | null | undefined>): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }
}
```

- [ ] **Step 4: Registrar `HttpClient` e interceptor**

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authTokenInterceptor])),
  ],
};
```

- [ ] **Step 5: Validar build**

Run: `pnpm build`
Expected: build exitoso sin errores de providers.

- [ ] **Step 6: Commit**

```bash
git add src/environments src/app/core/http src/app/app.config.ts
git commit -m "chore(api): configurar cliente http del backend"
```

---

## Task 2: Autenticacion Real Sprint 1

**Files:**
- Create: `src/app/core/models/api.models.ts`
- Create: `src/app/core/utils/role-mapper.ts`
- Modify: `src/app/core/services/auth.service.ts`
- Modify: `src/app/core/guards/auth.guard.ts`
- Modify: `src/app/core/guards/role.guard.ts`
- Modify: `src/app/features/auth/login/login.component.ts`
- Modify: `src/app/features/public/components/login-modal/login-modal.component.ts`
- Test: `src/app/core/services/auth.service.spec.ts`

- [ ] **Step 1: Definir modelos de auth**

```ts
export type BackendRole = 'VICTIMA' | 'RECEPCIONISTA' | 'PSICOLOGO' | 'DEFENSOR' | 'SOPORTE' | 'ADMIN';
export type FrontendRole = 'Víctima' | 'Recepcionista' | 'Psicólogo' | 'Defensor Legal' | 'Soporte Técnico' | 'Administrador';

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  usuarioId: string;
  nombre: string;
  correo: string;
  rol: BackendRole;
  token: string;
  refreshToken: string;
  tipoToken: string;
}

export interface SessionContextResponse {
  success: boolean;
  message: string;
  usuarioId: string;
  nombre: string;
  correo: string;
  rol: BackendRole;
  permisos: string[];
  modulos: string[];
}
```

- [ ] **Step 2: Implementar mapper de roles**

```ts
export function roleToLabel(role: BackendRole): FrontendRole {
  const labels: Record<BackendRole, FrontendRole> = {
    VICTIMA: 'Víctima',
    RECEPCIONISTA: 'Recepcionista',
    PSICOLOGO: 'Psicólogo',
    DEFENSOR: 'Defensor Legal',
    SOPORTE: 'Soporte Técnico',
    ADMIN: 'Administrador',
  };
  return labels[role];
}

export function labelToRole(label: FrontendRole): BackendRole {
  const roles: Record<FrontendRole, BackendRole> = {
    'Víctima': 'VICTIMA',
    'Recepcionista': 'RECEPCIONISTA',
    'Psicólogo': 'PSICOLOGO',
    'Defensor Legal': 'DEFENSOR',
    'Soporte Técnico': 'SOPORTE',
    'Administrador': 'ADMIN',
  };
  return roles[label];
}
```

- [ ] **Step 3: Reescribir `AuthService.login` para API real**

```ts
login(correo: string, contrasena: string): Observable<LoginResponse> {
  this.isLoadingSignal.set(true);
  return this.api.post<LoginResponse>(API_ENDPOINTS.auth.login, { correo, contrasena }).pipe(
    tap((response) => this.persistSession(response)),
    tap(() => this.toastService.show('Sesión iniciada con éxito.', 'success')),
    tap(() => void this.router.navigateByUrl('/dashboard')),
    finalize(() => this.isLoadingSignal.set(false)),
  );
}
```

- [ ] **Step 4: Actualizar guards**

`authGuard` debe permitir acceso si existe token vigente en memoria/localStorage. `roleGuard` debe comparar labels frontend ya mapeados desde backend.

- [ ] **Step 5: Actualizar pantallas de login**

Reemplazar el `setTimeout` por suscripcion a `authService.login(correo, contrasena)` y mostrar error con `ToastService` si el backend responde 401/400.

- [ ] **Step 6: Tests de auth**

Cubrir:
- Login exitoso persiste token y rol.
- Logout borra token y refreshToken.
- Role mapper convierte `ADMIN -> Administrador` y `DEFENSOR -> Defensor Legal`.

Run: `pnpm test -- --run src/app/core/services/auth.service.spec.ts`
Expected: tests OK.

- [ ] **Step 7: Commit**

```bash
git add src/app/core/services/auth.service.ts src/app/core/guards src/app/features/auth/login src/app/features/public/components/login-modal src/app/core/models src/app/core/utils
git commit -m "feat(auth): conectar inicio de sesion con backend"
```

---

## Task 3: Predenuncia Publica Sprint 1

**Files:**
- Create: `src/app/core/services/predenuncias.service.ts`
- Modify: `src/app/features/public/denuncia/denuncia.page.ts`
- Modify: `src/app/features/public/denuncia/denuncia.page.html`
- Test: `src/app/core/services/predenuncias.service.spec.ts`
- Test: `src/app/features/public/denuncia/denuncia.page.spec.ts`

- [ ] **Step 1: Crear servicio de predenuncias**

```ts
export interface CrearPreDenunciaRequest {
  nombresContacto?: string;
  apellidosContacto?: string;
  telefonoContacto?: string;
  correoContacto?: string;
  descripcionHecho: string;
  tipoViolencia?: string;
  fechaIncidente?: string;
  distrito?: string;
  direccionReferencia?: string;
  anonima?: boolean;
}

@Injectable({ providedIn: 'root' })
export class PredenunciasService {
  private readonly api = inject(ApiClientService);

  crear(request: CrearPreDenunciaRequest): Observable<PreDenunciaResponse> {
    return this.api.post<PreDenunciaResponse>(API_ENDPOINTS.predenuncias, request);
  }
}
```

- [ ] **Step 2: Mapear formulario publico a backend**

`DenunciaPage.submitForm()` debe construir:

```ts
const request: CrearPreDenunciaRequest = {
  nombresContacto: this.formData.contactName,
  telefonoContacto: this.formData.channel === 'Correo Electrónico Seguro' ? undefined : this.formData.contactValue,
  correoContacto: this.formData.channel === 'Correo Electrónico Seguro' ? this.formData.contactValue : undefined,
  descripcionHecho: this.formData.description,
  tipoViolencia: this.formData.situationType,
  fechaIncidente: this.formData.incidentDate ? `${this.formData.incidentDate}T00:00:00-05:00` : undefined,
  distrito: this.formData.location,
  direccionReferencia: this.formData.preferredTime,
  anonima: false,
};
```

- [ ] **Step 3: Mostrar estados UX**

Agregar signals:

```ts
isSubmitting = false;
submissionCode = '';
```

Al exito, mostrar `response.id` como codigo de seguimiento y mantener pantalla de confirmacion.

- [ ] **Step 4: Tests**

Cubrir:
- No llama API si validacion falla.
- Envia payload con correo cuando canal es correo.
- Envia payload con telefono cuando canal es WhatsApp.

- [ ] **Step 5: Commit**

```bash
git add src/app/core/services/predenuncias.service.ts src/app/features/public/denuncia
git commit -m "feat(predenuncias): conectar formulario publico con backend"
```

---

## Task 4: Casos Sprint 2

**Files:**
- Modify: `src/app/core/services/cases.service.ts`
- Modify: `src/app/features/interno/casos/casos.component.ts`
- Modify: `src/app/features/interno/casos/casos.component.html`
- Modify: `src/app/features/public/usuario/casos/casos.page.ts`
- Modify: `src/app/features/public/usuario/casos/casos.page.html`
- Test: `src/app/core/services/cases.service.spec.ts`

- [ ] **Step 1: Reemplazar mock por DTO real**

```ts
export interface CasoResponse {
  id: string;
  victimaId: string;
  estado: EstadoCaso;
  prioridad: PrioridadCaso;
  resumen: string;
  distrito: string;
  activo: boolean;
  fechaCreacion: string;
  fechaCierre?: string | null;
  fechaActualizacion: string;
}
```

- [ ] **Step 2: Implementar carga y filtros**

```ts
loadCasos(filters: CasoFilters = {}): Observable<CasoResponse[]> {
  this.loadingSignal.set(true);
  return this.api.get<CasoResponse[]>(API_ENDPOINTS.casos, filters).pipe(
    tap((casos) => this.casosSignal.set(casos)),
    catchError((error) => {
      this.errorSignal.set('No se pudieron cargar los casos.');
      return throwError(() => error);
    }),
    finalize(() => this.loadingSignal.set(false)),
  );
}
```

- [ ] **Step 3: Implementar cambio de estado**

```ts
actualizarEstado(id: string, estado: EstadoCaso): Observable<CasoResponse> {
  return this.api.put<CasoResponse>(`${API_ENDPOINTS.casos}/${id}`, { estado }).pipe(
    tap((updated) => this.replaceCaso(updated)),
  );
}
```

- [ ] **Step 4: Ajustar UI**

Estados visibles:
- `REGISTRADO` -> `Registrado`
- `EN_EVALUACION` -> `En evaluación`
- `EN_ATENCION` -> `En atención`
- `DERIVADO` -> `Derivado`
- `CERRADO` -> `Cerrado`
- `ARCHIVADO` -> `Archivado`

Prioridades visibles:
- `BAJA`, `MEDIA`, `ALTA`, `CRITICA`.

- [ ] **Step 5: Tests**

Cubrir:
- `loadCasos` llama `/casos` con query params.
- `actualizarEstado` llama `PUT /casos/{id}`.
- Mapper mantiene enums exactos.

- [ ] **Step 6: Commit**

```bash
git add src/app/core/services/cases.service.ts src/app/features/interno/casos src/app/features/public/usuario/casos
git commit -m "feat(casos): consumir endpoints reales de casos"
```

---

## Task 5: Denuncias Sprint 2

**Files:**
- Create: `src/app/core/services/complaints.service.ts`
- Modify: `src/app/features/interno/denuncias/denuncias.component.ts`
- Modify: `src/app/features/interno/denuncias/denuncias.component.html`
- Modify: `src/app/features/public/usuario/denuncias/denuncias.page.ts`
- Modify: `src/app/features/public/usuario/denuncias/denuncias.page.html`
- Test: `src/app/core/services/complaints.service.spec.ts`
- Test: `src/app/features/interno/denuncias/denuncias.component.spec.ts`

- [ ] **Step 1: Crear servicio de denuncias**

```ts
export interface CrearDenunciaRequest {
  casoId?: string;
  victimaId: string;
  descripcion: string;
  tipoViolencia: string;
  fechaIncidente?: string;
  distrito: string;
  direccionReferencia?: string;
  nivelRiesgo: NivelRiesgo;
  anonima?: boolean;
  adjuntos?: string[];
}

@Injectable({ providedIn: 'root' })
export class ComplaintsService {
  private readonly api = inject(ApiClientService);

  crear(request: CrearDenunciaRequest): Observable<DenunciaResponse> {
    return this.api.post<DenunciaResponse>(API_ENDPOINTS.denuncias, request);
  }

  listar(filters: DenunciaFilters = {}): Observable<DenunciaResponse[]> {
    return this.api.get<DenunciaResponse[]>(API_ENDPOINTS.denuncias, filters);
  }
}
```

- [ ] **Step 2: Ajustar formulario interno**

Agregar `victimaId`, `fechaIncidente`, `nivelRiesgo` al modelo de formulario. Si no existe selector de victima todavia, usar campo visible `victimaId` y documentar que en Sprint posterior se reemplaza por buscador.

- [ ] **Step 3: Enviar denuncia real**

`submitDenuncia()` debe llamar `complaintsService.crear(request)` y navegar a `/casos` usando el `casoId` devuelto por backend.

- [ ] **Step 4: Estados UX**

Agregar loading, error y exito:

```ts
isSubmitting = signal(false);
submitError = signal<string | null>(null);
```

- [ ] **Step 5: Tests**

Cubrir:
- Envia `POST /denuncias` con `nivelRiesgo` exacto.
- No crea caso local mock.
- Muestra error si backend falla.

- [ ] **Step 6: Commit**

```bash
git add src/app/core/services/complaints.service.ts src/app/features/interno/denuncias src/app/features/public/usuario/denuncias
git commit -m "feat(denuncias): consumir endpoints reales de denuncias"
```

---

## Task 6: Seguimientos Sprint 2

**Files:**
- Create: `src/app/core/services/follow-ups.service.ts`
- Modify: `src/app/features/interno/casos/casos.component.ts`
- Modify: `src/app/features/interno/casos/casos.component.html`
- Test: `src/app/core/services/follow-ups.service.spec.ts`

- [ ] **Step 1: Crear servicio de seguimientos**

```ts
export interface CrearSeguimientoCasoRequest {
  casoId: string;
  autorId: string;
  tipoSeguimiento: string;
  contenido: string;
  proximaAccion?: string;
  fechaProximaAccion?: string;
}

@Injectable({ providedIn: 'root' })
export class FollowUpsService {
  private readonly api = inject(ApiClientService);

  listar(filters: { casoId?: string; autorId?: string } = {}): Observable<SeguimientoCasoResponse[]> {
    return this.api.get<SeguimientoCasoResponse[]>(API_ENDPOINTS.seguimientos, filters);
  }

  crear(request: CrearSeguimientoCasoRequest): Observable<SeguimientoCasoResponse> {
    return this.api.post<SeguimientoCasoResponse>(API_ENDPOINTS.seguimientos, request);
  }
}
```

- [ ] **Step 2: Integrar en detalle de caso**

Cuando `CasesService.selectedCase` cambie, cargar `GET /seguimientos?casoId=<id>` y renderizar timeline/listado en el tab de seguimiento.

- [ ] **Step 3: Formulario de nuevo seguimiento**

Mostrar formulario solo para roles `PSICOLOGO`, `DEFENSOR`, `ADMIN`. Usar `authService.usuarioId()` como `autorId`.

- [ ] **Step 4: Tests**

Cubrir:
- `listar({ casoId })` llama query correcta.
- `crear()` envia autorId del usuario logueado.
- UI no muestra formulario para `VICTIMA`.

- [ ] **Step 5: Commit**

```bash
git add src/app/core/services/follow-ups.service.ts src/app/features/interno/casos
git commit -m "feat(seguimientos): integrar seguimiento de casos"
```

---

## Task 7: Dashboard y Portal Usuario

**Files:**
- Modify: `src/app/features/interno/dashboard/dashboard.component.ts`
- Modify: `src/app/features/interno/dashboard/dashboard.component.html`
- Modify: `src/app/features/public/usuario/usuario-dashboard/usuario-dashboard.page.ts`
- Modify: `src/app/features/public/usuario/usuario-dashboard/usuario-dashboard.page.html`
- Modify: `src/app/features/public/usuario/casos/casos.page.ts`
- Modify: `src/app/features/public/usuario/denuncias/denuncias.page.ts`

- [ ] **Step 1: Dashboard interno**

Usar `CasesService.totalCasos`, `ComplaintsService.listar` y filtros por riesgo para reemplazar contadores mock.

- [ ] **Step 2: Portal victima**

Si `authService.currentBackendRole() === 'VICTIMA'`, cargar:

```ts
this.casesService.loadCasos({ victimaId: this.authService.usuarioId() });
this.complaintsService.listar({ victimaId: this.authService.usuarioId() });
```

- [ ] **Step 3: Estados vacios**

Cada pantalla debe mostrar:
- Cargando.
- Error con reintentar.
- Vacio: “Aun no hay registros asociados a tu cuenta.”
- Exito con tabla/listado.

- [ ] **Step 4: Commit**

```bash
git add src/app/features/interno/dashboard src/app/features/public/usuario
git commit -m "feat(portal): mostrar datos reales de usuario y panel"
```

---

## Task 8: Verificacion Integral

**Files:**
- Modify only if tests/build require fixes.

- [ ] **Step 1: Instalar dependencias si falta `node_modules`**

Run: `pnpm install`
Expected: dependencias instaladas sin cambios inesperados en lockfile salvo que sea necesario.

- [ ] **Step 2: Tests unitarios**

Run: `pnpm test -- --run`
Expected: tests OK.

- [ ] **Step 3: Build**

Run: `pnpm build`
Expected: build exitoso.

- [ ] **Step 4: Prueba manual local con backend**

Terminal backend:

```bash
cd /Users/sankef/INTEGRADOR\ WEB/safeZoneBackend
set -a
source .env
set +a
mvn spring-boot:run
```

Terminal frontend:

```bash
cd /Users/sankef/INTEGRADOR\ WEB/safeZoneFrontend
pnpm start
```

Validar en navegador:
- Login con usuario existente de `safezonedb`.
- Crear predenuncia publica.
- Marcar predenuncia como `EN_CONTACTO`.
- Formalizar predenuncia `EN_CONTACTO` creando o reutilizando victima y generando denuncia/caso.
- Formalizar predenuncia bajo alias anonimo sin solicitar DNI real, generando victima protegida y alias institucional.
- Ver caso creado automaticamente.
- Cambiar estado del caso siguiendo transiciones permitidas.
- Crear seguimiento como `PSICOLOGO`, `DEFENSOR` o `ADMIN`.

- [ ] **Step 5: Commit de ajustes finales**

```bash
git add .
git commit -m "test(integracion): validar conexion frontend backend sprint 1 2"
```

---

## Riesgos y Decisiones

- `GET /api/notificaciones`, `citas`, `evidencias`, `asignaciones` todavia tienen servicios backend placeholder de Sprint 3. No deben bloquear Sprint 1-2; las pantallas pueden mantener placeholder o mensaje de “pendiente de Sprint 3”.
- Para cerrar el flujo Sprint 2 desde predenuncia se requiere contacto previo (`EN_CONTACTO`) y datos minimos de victima. La UI debe resolver la victima por DNI o crearla cuando se formaliza con identidad. Si se formaliza bajo alias anonimo, no debe solicitar DNI real; el backend genera una victima protegida con DNI tecnico `ALIAS...`, alias institucional y denuncia anonima. Asignaciones especializadas, citas, evidencias y reportes quedan fuera de este corte.
- El backend no expone paginacion todavia para casos/denuncias/seguimientos; el frontend debe filtrar solo lo necesario y evitar asumir paginacion.
- Se debe evitar hardcodear tokens o credenciales en el frontend. La URL base local va en environment; credenciales se manejan desde login.
- Si GitHub sigue sin conectar, no intentar push hasta que `git fetch origin` responda.

## Self-Review

- Cobertura Sprint 1: auth, recuperacion base, predenuncias y contexto de sesion estan contemplados.
- Cobertura Sprint 2: predenuncia en contacto, formalizacion con identidad o bajo alias anonimo a denuncia/caso, casos, denuncias y seguimientos estan contemplados con DTOs y endpoints reales.
- Placeholders detectados: solo se dejan como riesgo para modulos Sprint 3, no como pasos de implementacion Sprint 1-2.
- Type consistency: los enums y nombres de campos coinciden con los records Java revisados en backend.
- Validacion ejecutada para formalizacion: `pnpm test -- --watch=false`, `pnpm build`, `mvn -Dtest=PreDenunciaServiceTest test`, `mvn test` y prueba API/DB contra `safezonedb`.
