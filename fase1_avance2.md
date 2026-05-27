# 🟣 Fase 1 — Avance 2: Autenticación, Seguridad y Gestión de Víctimas

> **Alcance:** Solo frontend visual. Datos mock con signals/localStorage.  
> **Sin backend.** Toda la lógica queda preparada con servicios Angular para futura integración con API.  
> **RF cubiertos:** RF-01, RF-02, RF-03, RF-10, RF-11, RF-16, RF-18, RF-20  
> **RNF cubiertos:** RNF-01, RNF-02, RNF-03

---

## 📊 Estado Actual (Frontend-Only)

| RF | Implementado Visualmente | Faltante Visual | % Frontend |
|----|--------------------------|-----------------|:----------:|
| RF-01 — Autenticar usuario | Login funcional, guard, localStorage | Pantalla de recuperar contraseña, indicador de sesión activa | 🟢 75% |
| RF-02 — Administrar roles | 4 roles definidos, cambio dinámico | CRUD visual de usuarios, sidebar filtrado por rol, restricción visual de rutas | 🔴 30% |
| RF-03 — Registrar víctimas | Campos en formulario de denuncia (Step 1) | Formulario dedicado, más campos, servicio propio | 🟡 40% |
| RF-10 — Configuración de seguridad | Sliders de timeout/contraseña, 3 toggles | Más parámetros, guardar en localStorage, feedback visual | 🟡 50% |
| RF-11 — Anonimato | Checkbox + alias visual en denuncia | Generación determinística, indicador visual claro en todo el sistema | 🟢 60% |
| RF-16 — Historial de víctima | Timeline con 2 entries, perfil visual | Timeline dinámico, tabs de denuncias/citas/evidencias/seguimientos | 🔴 25% |
| RF-18 — Panel por rol | Dashboard con KPIs estáticos | Widgets diferentes por rol, acciones diferenciadas | 🔴 30% |
| RF-20 — Auditoría | Tabla con 5 logs estáticos | Captura automática de acciones en sesión, filtros, más registros | 🟡 40% |

> **Cobertura visual promedio actual: ~43.8%**  
> **Objetivo post-implementación: ~90%+ visual**

---

## 🔨 Sprint 1 — RF-02: Sidebar Filtrado por Rol + Restricción Visual de Rutas

### Objetivo
Que el menú lateral muestre **solo las opciones que corresponden al rol activo**, y que al intentar acceder a una ruta no permitida, se redirija al dashboard con mensaje.

### Archivos a modificar

#### [MODIFY] [sidebar.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/core/layout/sidebar/sidebar.component.html)
- Envolver cada `<a>` del menú con `@if` condicional basado en el rol activo
- Mapa de visibilidad por rol:

| Módulo | Admin | Recepcionista | Psicólogo | Defensor Legal |
|--------|:-----:|:-------------:|:---------:|:--------------:|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Registrar Denuncia | ✅ | ✅ | ❌ | ❌ |
| Control de Casos | ✅ | ✅ | ✅ | ✅ |
| Fichas de Víctimas | ✅ | ✅ | ✅ | ✅ |
| Agenda / Citas | ✅ | ✅ | ✅ | ✅ |
| Evidencias Digitales | ✅ | ✅ | ✅ | ✅ |
| Reportes | ✅ | ❌ | ✅ | ✅ |
| Auditoría | ✅ | ❌ | ❌ | ❌ |
| Configuración | ✅ | ❌ | ❌ | ❌ |

#### [MODIFY] [sidebar.component.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/core/layout/sidebar/sidebar.component.ts)
- Crear método `hasAccess(module: string): boolean` que consulte el rol actual y la tabla de permisos

#### [NEW] `src/app/core/guards/role.guard.ts`
- Crear un `roleGuard` que lea el rol de `AuthService` y compare contra la ruta solicitada
- Si no tiene acceso → `router.navigateByUrl('/dashboard')` + toast de advertencia
- Usar la misma tabla de visibilidad

#### [MODIFY] [app.routes.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/app.routes.ts)
- Agregar `data: { roles: ['Administrador', 'Recepcionista', ...] }` a cada ruta hija
- Agregar `canActivate: [roleGuard]` a las rutas protegidas

### Estimación: ~4-5 horas

---

## 🔨 Sprint 2 — RF-02 (parte 2): CRUD Visual de Usuarios + RF-18: Dashboard Dinámico por Rol

### RF-02: Pantalla de Administración de Usuarios

#### [NEW] `src/app/features/usuarios/usuarios.component.ts`
#### [NEW] `src/app/features/usuarios/usuarios.component.html`
#### [NEW] `src/app/features/usuarios/usuarios.component.scss`

- **Tabla de usuarios** con datos mock: nombre, email, rol, estado (activo/inactivo), última conexión
- **Botón "Nuevo Usuario"** → Modal con formulario: nombre, email, contraseña, rol (select), estado
- **Acciones en tabla:** Editar (modal), Cambiar estado (toggle), Eliminar (confirmación)
- Solo visible para rol **Administrador**
- Datos almacenados en un `UsersService` con signal y array mock

#### [NEW] `src/app/core/services/users.service.ts`
- Signal con array de usuarios mock (8-10 usuarios de ejemplo con roles variados)
- Métodos: `getAll()`, `add()`, `update()`, `toggleStatus()`, `delete()`
- Persistir en `localStorage` key `safezone_users`

#### [MODIFY] [app.routes.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/app.routes.ts)
- Agregar ruta `usuarios` con `roles: ['Administrador']`

#### [MODIFY] [sidebar.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/core/layout/sidebar/sidebar.component.html)
- Agregar link "Gestión de Usuarios" con ícono 👥, visible solo para Admin

### RF-18: Dashboard Dinámico por Rol

#### [MODIFY] [dashboard.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/dashboard/dashboard.component.html)

Crear secciones condicionales con `@if` o `@switch` según `authService.currentRole()`:

| Rol | KPIs a mostrar | Widgets principales | Acciones rápidas |
|-----|---------------|---------------------|------------------|
| **Administrador** | Todos los actuales + usuarios activos | Alertas + Casos + Actividad (como está) | Exportar PDF, Registrar Incidente, Gestionar Usuarios |
| **Recepcionista** | Denuncias hoy, Casos nuevos, Pendientes | Últimas denuncias registradas, Formulario rápido | Registrar Denuncia (botón destacado) |
| **Psicólogo** | Mis pacientes, Citas hoy, Evaluaciones pendientes | Lista de citas del día, Mis casos asignados | Registrar Observación, Ver Agenda |
| **Defensor Legal** | Mis casos, Medidas activas, Derivaciones | Casos asignados con estado judicial | Ver Expediente, Registrar Acta |

#### [MODIFY] [dashboard.component.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/dashboard/dashboard.component.ts)
- Inyectar `AppointmentsService` para mostrar citas del día según rol
- Crear datos mock para cada vista de rol

### Estimación: ~6-8 horas

---

## 🔨 Sprint 3 — RF-03: Servicio y Formulario Dedicado de Víctimas + RF-11: Anonimato Mejorado

### RF-03: VictimsService + Formulario Completo

#### [NEW] `src/app/core/services/victims.service.ts`
- Interface `Victim`: id, codigo, alias, nombre, dni, edad, genero, estadoCivil, ocupacion, distrito, direccion, telefono, contactoEmergencia, anonimo, fechaRegistro, estado
- Signal con array de 5-6 víctimas mock (enlazadas a los casos existentes)
- Métodos: `getAll()`, `getById()`, `add()`, `update()`, `generateAlias()`, `search()`
- Persistencia en `localStorage` key `safezone_victims`

#### [MODIFY] [victimas.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/victimas/victimas.component.html)
- Agregar **botón "Registrar Nueva Víctima"** → Modal con formulario completo
- Formulario con campos: DNI, Nombres, Apellidos, Edad, Género, Estado Civil, Ocupación, Distrito, Dirección, Teléfono seguro, Contacto de emergencia (nombre + teléfono), Checkbox de anonimato
- Mostrar más datos en el perfil de la derecha cuando se selecciona una víctima
- Agregar botón "Editar Ficha" en el perfil

#### [MODIFY] [victimas.component.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/victimas/victimas.component.ts)
- Inyectar `VictimsService` en lugar de `CasesService`
- Métodos para abrir/cerrar modal, guardar víctima

### RF-11: Anonimato Determinístico

#### En `VictimsService`:
- Método `generateAlias()`: genera código con formato `SZ-AAAA-NNN` (ej: `SZ-LIMA-047`) basado en distrito + contador secuencial guardado en localStorage
- Al registrar con anonimato = true, se genera el alias automáticamente y se ocultan DNI/nombre en toda la plataforma

#### Indicadores visuales en todo el sistema:
- En [casos.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/casos/casos.component.html): mantener 🔒 badge
- En víctimas: mostrar "Identidad Protegida — Código: SZ-LIMA-047"
- En citas: mostrar solo el alias, nunca el nombre real
- En auditoría: registrar acceso a datos de víctima anónima

### Estimación: ~5-6 horas

---

## 🔨 Sprint 4 — RF-16: Historial Completo con Tabs + RF-20: Auditoría Dinámica

### RF-16: Historial Dinámico de Atención

#### [MODIFY] [victimas.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/victimas/victimas.component.html)

Reemplazar el panel derecho estático con un **sistema de tabs**:

```
[ Perfil ] [ Denuncias ] [ Citas ] [ Seguimientos ] [ Evidencias ]
```

| Tab | Contenido |
|-----|-----------|
| **Perfil** | Datos personales completos + badge de anonimato + nivel de riesgo actual |
| **Denuncias** | Lista de denuncias asociadas a esta víctima (mock: 1-2 denuncias con fecha, tipo, estado) |
| **Citas** | Citas pasadas y futuras vinculadas (desde `AppointmentsService` filtrado por caso) |
| **Seguimientos** | Timeline de evolución (actual mejorado con 4-5 entries dinámicos desde un array mock) |
| **Evidencias** | Archivos de evidencia vinculados (desde `EvidenceService` filtrado por caso) |

#### [MODIFY] [victimas.component.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/victimas/victimas.component.ts)
- Signal `activeTab` para manejar la tab activa
- Inyectar `AppointmentsService` y `EvidenceService` para alimentar las tabs
- Datos de seguimiento mock más ricos (5-6 entries con diferentes tipos de evento)

### RF-20: Auditoría Dinámica en Sesión

#### [NEW] `src/app/core/services/audit.service.ts`
- Interface `AuditLog`: id, timestamp, user, role, action, ip, detail, module
- Signal con array de logs (inicializado con los 5 actuales)
- Método `logAction(action: string, detail: string, module: string)` que:
  - Genera timestamp automático (`new Date().toLocaleString()`)
  - Usa el usuario/rol actual de `AuthService`
  - IP mock: `192.168.x.x` aleatorio
  - Agrega al inicio del array
  - Persiste en `localStorage` key `safezone_audit`
- Método `getAll()`, `filterByDate()`, `filterByUser()`, `filterByAction()`

#### Integrar captura automática en:
- **Login/Logout** → `auth.service.ts`: `logAction('Inicio de Sesión', ...)`, `logAction('Cierre de Sesión', ...)`
- **Registrar denuncia** → `denuncias.component.ts`: `logAction('Registro de Denuncia', ...)`
- **Cambiar estado de caso** → `cases.service.ts`: `logAction('Cambio de Estado', ...)`
- **Subir evidencia** → `evidence.service.ts`: `logAction('Carga de Evidencia', ...)`
- **Guardar configuración** → `configuracion.component.ts`: `logAction('Modificación de Configuración', ...)`
- **Ver expediente de víctima** → `victimas.component.ts`: `logAction('Acceso a Expediente', ...)`

#### [MODIFY] [auditoria.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/auditoria/auditoria.component.html)
- Agregar **filtros** encima de la tabla: input de búsqueda, select por tipo de acción, datepicker por rango de fechas
- Agregar **botón "Exportar CSV"** (genera un download de un archivo .csv con los logs visibles)
- Agregar **badge de contador** al lado del título: "248 registros"
- La tabla ahora se alimenta del `AuditService` en vez de datos hardcoded

#### [MODIFY] [auditoria.component.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/auditoria/auditoria.component.ts)
- Inyectar `AuditService`
- Signals para filtros activos
- Computed para lista filtrada
- Método `exportCSV()` que genera y descarga un archivo

### Estimación: ~6-7 horas

---

## 🔨 Sprint 5 — RF-10: Configuración de Seguridad Persistente + RF-01: Mejoras de Login

### RF-10: Configuración Completa y Persistente

#### [NEW] `src/app/core/services/security-config.service.ts`
- Interface `SecurityConfig`: sessionTimeout, minPasswordLength, requireUppercase, requireNumbers, requireSpecialChar, maxLoginAttempts, twoFactorEnabled, autoLockMinutes
- Cargar/guardar desde `localStorage` key `safezone_security_config`
- Valores por defecto sensatos

#### [MODIFY] [configuracion.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/configuracion/configuracion.component.html)
- Agregar secciones adicionales:
  - **Política de contraseñas:** Checkbox para mayúsculas, números, caracteres especiales + slider longitud mínima
  - **Bloqueo de cuenta:** Slider para máximo de intentos fallidos (3-10)
  - **Autenticación de dos factores:** Toggle con descripción
  - **Bloqueo automático:** Slider para minutos de inactividad
- La matriz de permisos debe ser **dinámica por rol**: select de rol arriba, y los toggles cambian según el rol seleccionado
- **Botón "Guardar"** ahora persiste en localStorage y muestra toast de éxito
- **Botón "Restaurar valores por defecto"**

#### [MODIFY] [configuracion.component.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/configuracion/configuracion.component.ts)
- Inyectar `SecurityConfigService`
- Cargar configuración al iniciar
- Método `save()` que persiste y loguea en auditoría
- Método `resetDefaults()`

### RF-01: Mejoras Visuales de Login

#### [MODIFY] [login.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/auth/login/login.component.html)
- Agregar **credenciales de prueba** debajo del formulario
- Mejorar el indicador mostrando los 4 roles disponibles

#### [MODIFY] [login.component.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/auth/login/login.component.ts)
- Método `selectTestRole(role: string)` que pre-llena username y password automáticamente
- Simular validación de credenciales con delay de 800ms + loading spinner

### Estimación: ~4-5 horas

---

## 📋 Resumen de Entregables Fase 1

### Archivos Nuevos (7)
| Archivo | Propósito |
|---------|-----------|
| `src/app/core/guards/role.guard.ts` | Restricción de rutas por rol |
| `src/app/core/services/users.service.ts` | CRUD visual de usuarios |
| `src/app/core/services/victims.service.ts` | Gestión de víctimas con anonimato |
| `src/app/core/services/audit.service.ts` | Captura dinámica de logs |
| `src/app/core/services/security-config.service.ts` | Configuración persistente |
| `src/app/features/usuarios/usuarios.component.*` | Pantalla CRUD de usuarios (3 archivos: ts, html, scss) |

### Archivos Modificados (12)
| Archivo | Cambios principales |
|---------|--------------------|
| `sidebar.component.html` | Filtro de menú por rol |
| `sidebar.component.ts` | Método `hasAccess()` |
| `app.routes.ts` | Metadata de roles + roleGuard + ruta usuarios |
| `dashboard.component.html` | Contenido diferenciado por rol |
| `dashboard.component.ts` | Inyección de servicios adicionales |
| `victimas.component.html` | Formulario completo + tabs de historial |
| `victimas.component.ts` | VictimsService + tabs + modal |
| `auditoria.component.html` | Filtros + datos dinámicos |
| `auditoria.component.ts` | AuditService + filtros + export |
| `configuracion.component.html` | Secciones expandidas + persistencia |
| `configuracion.component.ts` | SecurityConfigService |
| `login.component.html` | Selector de rol de prueba |

### Esfuerzo Total Estimado: ~25-31 horas

---

## ✅ Resultado Esperado Post-Fase 1

| RF | % Visual Esperado |
|----|:-----------------:|
| RF-01 | 🟢 90% |
| RF-02 | 🟢 85% |
| RF-03 | 🟢 85% |
| RF-10 | 🟢 90% |
| RF-11 | 🟢 85% |
| RF-16 | 🟢 85% |
| RF-18 | 🟢 90% |
| RF-20 | 🟢 90% |
| **Promedio** | **🟢 87.5%** |

> [!TIP]
> El 10-15% restante corresponde a integración real con backend (JWT, API REST, cifrado AES-256), que se completará cuando el backend esté disponible. La arquitectura de servicios Angular queda 100% preparada para esa integración con solo cambiar las llamadas mock por `HttpClient.get/post`.
