# 🟠 Fase 3 — Presentación Final: Citas, Reportes, Notificaciones, Evidencias, Asignación y Confirmación

> **Alcance:** Solo frontend visual. Datos mock con signals/localStorage.  
> **Sin backend.** Servicios Angular preparados para integración futura con API REST + WebSocket.  
> **RF cubiertos:** RF-05, RF-07, RF-08, RF-09, RF-14, RF-19  
> **RNF cubiertos:** RNF-04, RNF-06, RNF-10, RNF-11  
> **Prerequisito:** Fase 1 y Fase 2 completadas (todos los servicios base, AuditService, ObservationsService, etc.)

---

## 📊 Estado Actual (Frontend-Only)

| RF | Implementado Visualmente | Faltante Visual | % Frontend |
|----|--------------------------|-----------------|:----------:|
| RF-05 — Gestionar citas | Calendario estático, agenda del día, modal nueva cita | Reprogramar, cancelar, calendario dinámico, validar disponibilidad | 🟡 45% |
| RF-07 — Generar reportes | KPIs estáticos, gráfico barras CSS, barras progreso | Filtros por fecha/tipo/riesgo, exportación real, datos dinámicos | 🔴 30% |
| RF-08 — Notificaciones | Toasts de UI, alertas hardcoded en dashboard | Panel de campana, notificaciones automáticas, historial | 🔴 10% |
| RF-09 — Evidencias digitales | Upload simulado, grid de archivos, modal preview | Vinculación a caso, validaciones, metadatos, previsualización real | 🟡 40% |
| RF-14 — Asignación profesionales | Campo `asignado` visual en cada caso | Módulo de profesionales, catálogo, asignación con disponibilidad | 🔴 10% |
| RF-19 — Confirmación atención | Estado pendiente/completada en citas | Botones de marcar atendida/no asistida/reprogramada, formulario post-cita | 🔴 10% |

> **Cobertura visual promedio actual: ~24.2%**  
> **Objetivo post-implementación: ~90%+ visual**

---

## 🔨 Sprint 1 — RF-14: Módulo de Profesionales y Asignación (100% nuevo)

### Objetivo
Crear un módulo completo para visualizar el catálogo de profesionales disponibles y asignarlos a casos.

### Archivos nuevos

#### [NEW] `src/app/core/services/professionals.service.ts`

```typescript
interface Professional {
  id: string;
  nombre: string;
  especialidad: string;     // 'Psicología Clínica' | 'Derecho Familiar' | 'Trabajo Social'
  rol: string;              // 'Psicólogo' | 'Defensor Legal'
  email: string;
  telefono: string;
  estado: string;           // 'Disponible' | 'Ocupado' | 'Licencia' | 'Inactivo'
  casosAsignados: number;
  maxCasos: number;         // Capacidad máxima
  horario: string;          // 'Lun-Vie 8:00-17:00'
  foto: string;             // Iniciales para avatar
}
```

- Signal con array de 6-8 profesionales mock
- Métodos: `getAll()`, `getAvailable()`, `getById()`, `assignToCase()`, `unassignFromCase()`, `getLoadByProfessional()`
- Computed `availableProfessionals` → filtra los que no están en licencia/inactivos y `casosAsignados < maxCasos`
- Persistencia en `localStorage` key `safezone_professionals`

#### [NEW] `src/app/features/profesionales/profesionales.component.ts`
#### [NEW] `src/app/features/profesionales/profesionales.component.html`
#### [NEW] `src/app/features/profesionales/profesionales.component.scss`

**Diseño de la pantalla de profesionales:**

```
┌─────────────────────────────────────────────────────────────┐
│ 👥 Directorio de Profesionales         [Agregar Profesional]│
│ Panel de gestión del equipo interdisciplinario               │
│                                                              │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│ │ 🟢 Disponible│ │ 🟡 Ocupados  │ │ 📊 Carga     │         │
│ │     5        │ │     2        │ │   Promedio    │         │
│ │              │ │              │ │   3.2 casos   │         │
│ └──────────────┘ └──────────────┘ └──────────────┘         │
│                                                              │
│ ┌───── Tarjeta Profesional ──────────────────────────────┐  │
│ │  [SM]  Dra. Sofía Medina                               │  │
│ │        Psicología Clínica                               │  │
│ │        📧 smedina@safezone.gob.pe                       │  │
│ │        📞 987-654-321                                    │  │
│ │        🕐 Lun-Vie 8:00-17:00                            │  │
│ │        📊 Casos: 3/5 ████████░░ 60%                     │  │
│ │        Estado: 🟢 Disponible                            │  │
│ │        [Ver Casos Asignados] [Cambiar Estado]           │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ ┌───── Tarjeta Profesional ──────────────────────────────┐  │
│ │  [CR]  Dr. Carlos Rojas                                │  │
│ │        Psicología Clínica                               │  │
│ │        📧 crojas@safezone.gob.pe                        │  │
│ │        📊 Casos: 2/5 ████░░░░░░ 40%                     │  │
│ │        Estado: 🟢 Disponible                            │  │
│ │        [Ver Casos Asignados] [Cambiar Estado]           │  │
│ └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Modal de asignación** (se abre desde el módulo de Casos):

```
┌─────────────────────────────────────────────┐
│ Asignar Profesional al Caso #082-2026       │
│                                              │
│ Tipo de profesional: [Psicólogo ▼]           │
│                                              │
│ Profesionales disponibles:                   │
│ ○ Dra. Sofía Medina — 3/5 casos (60%)       │
│ ● Dr. Carlos Rojas  — 2/5 casos (40%) ✓    │
│ ○ Dra. Ana López    — 4/5 casos (80%)       │
│                                              │
│ Motivo de asignación: [________________]     │
│                                              │
│ [Cancelar]                [Asignar]          │
└─────────────────────────────────────────────┘
```

### Integración con módulo de Casos

#### [MODIFY] [casos.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/casos/casos.component.html)
- En el drawer de detalle del caso: botón **"Cambiar Profesional"** que abre el modal de asignación
- Mostrar barra de carga del profesional asignado

#### [MODIFY] [app.routes.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/app.routes.ts)
- Agregar ruta `profesionales` con `roles: ['Administrador']`

#### [MODIFY] Sidebar
- Agregar link "Profesionales" con ícono, visible solo para Administrador

### Estimación: ~6-7 horas

---

## 🔨 Sprint 2 — RF-05: Calendario Dinámico + Reprogramar/Cancelar Citas

### Objetivo
Convertir el calendario estático en dinámico y agregar funcionalidades de reprogramar y cancelar citas.

### Archivos modificados

#### [MODIFY] [appointments.service.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/core/services/appointments.service.ts)

Agregar:
```typescript
interface Cita {
  // Campos existentes +
  notas: string;
  victimName: string;
  estadoHistorial: { estado: string; fecha: string; motivo: string }[];
}
```

- Signal `currentMonth` y `currentYear` para navegación del calendario
- Computed `calendarDays` → genera array de 35-42 días con los datos del mes actual
- Computed `citasForDay(date: string)` → filtra citas por fecha
- Métodos nuevos:
  - `reschedule(citaId, newDate, newHour, motivo)` → cambia fecha/hora, agrega al historial
  - `cancel(citaId, motivo)` → estado = 'Cancelada', agrega al historial
  - `nextMonth()`, `prevMonth()`, `goToToday()`
  - `checkConflict(doctorId, date, hour)` → verifica si hay otra cita en ese horario (visual)
- Más citas mock (8-10 distribuidas en diferentes días del mes)
- Persistencia en `localStorage` key `safezone_appointments`

#### [MODIFY] [citas.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/citas/citas.component.html)

**Calendario dinámico:**
- Generar celdas con `@for` basado en `calendarDays` computed
- Cada celda muestra los eventos de ese día dinámicamente
- Navegación `<` `>` funcional conectada a `nextMonth()`/`prevMonth()`
- Botón "Hoy" conectado a `goToToday()`

**Vista Semana** (nueva):
- Grid de 7 columnas × 12 filas (horas de 7:00 a 19:00)
- Citas posicionadas según hora con altura proporcional a duración
- Toggle entre Mes/Semana funcional

**Acciones en cada cita de la agenda:**
```
┌─────────────────────────────────────────────┐
│ 09:00 AM — Cita Psicológica                 │
│ Caso #082-2026 — Ana María L.               │
│ Profesional: Dra. Sofía Medina              │
│ Estado: 🟡 Pendiente                        │
│                                              │
│ [Reprogramar] [Cancelar] [Ver Caso]          │
└─────────────────────────────────────────────┘
```

**Modal de Reprogramación:**
```
┌──────────────────────────────────────────┐
│ Reprogramar Cita                          │
│                                          │
│ Cita actual: 22/05/2026 a las 09:00      │
│                                          │
│ Nueva fecha: [📅 ________]               │
│ Nueva hora:  [🕐 ________]              │
│                                          │
│ ⚠️ Conflicto detectado: Dra. Medina      │
│    ya tiene cita a las 10:00             │
│                                          │
│ Motivo: [_________________________]      │
│                                          │
│ [Cancelar]          [Confirmar Cambio]    │
└──────────────────────────────────────────┘
```

**Modal de Cancelación:**
- Motivo obligatorio (select: "Víctima solicitó", "Profesional no disponible", "Emergencia", "Otro")
- Textarea para detalle
- Checkbox "Notificar a la víctima"

#### [MODIFY] [citas.component.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/citas/citas.component.ts)
- Signals para modales de reprogramar/cancelar
- Signal para la cita seleccionada
- Métodos handler para cada acción

### Estimación: ~6-7 horas

---

## 🔨 Sprint 3 — RF-08: Sistema de Notificaciones + RF-19: Confirmación de Atención

### RF-08: Panel de Notificaciones

#### [NEW] `src/app/core/services/notifications.service.ts`

```typescript
interface Notification {
  id: string;
  type: string;        // 'caso_critico' | 'nueva_asignacion' | 'cita_proxima' | 'cambio_estado' | 'evidencia' | 'sistema'
  title: string;
  message: string;
  date: string;
  read: boolean;
  icon: string;        // emoji
  link: string;        // ruta a navegar al hacer click
  targetRoles: string[]; // qué roles ven esta notificación
}
```

- Signal con array de 10-15 notificaciones mock distribuidas por tipo
- Computed `unreadCount` → cuenta no leídas
- Computed `filteredByRole` → filtra por rol actual
- Métodos: `markAsRead(id)`, `markAllAsRead()`, `add(notification)`, `getAll()`
- Persistencia en `localStorage` key `safezone_notifications`

**Generación automática de notificaciones** (integrar en servicios existentes):
- En `CasesService.moveCase()` → si el nuevo estado es crítico → `notifications.add({ type: 'caso_critico', ... })`
- En `CasesService.addCase()` → `notifications.add({ type: 'cambio_estado', ... })`
- En `AppointmentsService.saveCita()` → `notifications.add({ type: 'cita_proxima', ... })`
- En `ProfessionalsService.assignToCase()` → `notifications.add({ type: 'nueva_asignacion', ... })`
- En `EvidenceService.simulateFileUpload()` → `notifications.add({ type: 'evidencia', ... })`

#### [NEW] `src/app/shared/components/notifications-panel/notifications-panel.component.ts`
#### [NEW] `src/app/shared/components/notifications-panel/notifications-panel.component.html`
#### [NEW] `src/app/shared/components/notifications-panel/notifications-panel.component.scss`

**Diseño del panel (se abre desde el topbar):**

```
┌──────────────────────────────────────┐
│ 🔔 Notificaciones (7 nuevas)        │
│                           [Leer todo]│
│ ─────────────────────────────────── │
│                                      │
│ 🔴 CASO CRÍTICO — Hace 5 min        │
│    Se registró un caso de riesgo     │
│    crítico: Caso #083-2026           │
│    → Click para ver                  │
│                                      │
│ 📅 CITA PRÓXIMA — Hace 30 min       │
│    Cita psicológica programada       │
│    para mañana a las 10:00           │
│    Caso #082-2026                    │
│                                      │
│ 👤 NUEVA ASIGNACIÓN — Hace 1h       │
│    Se te asignó el Caso #085-2026    │
│    Víctima: SZ-LIMA-052              │
│                                      │
│ 📋 CAMBIO DE ESTADO — Hace 2h       │ (leída — fondo gris)
│    El Caso #079-2026 pasó a         │
│    estado "En Atención"              │
│                                      │
│ ─── Anteriores ──────────────────── │
│ ...                                  │
└──────────────────────────────────────┘
```

#### [MODIFY] Topbar Component
- Agregar **ícono de campana 🔔** con badge rojo del `unreadCount`
- Al hacer click → toggle del panel de notificaciones (dropdown/sidebar)
- Animación de badge cuando hay nueva notificación

### RF-19: Confirmación de Atención Realizada

#### [MODIFY] [citas.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/citas/citas.component.html)

Agregar a cada cita en la agenda del día:

```
┌─────────────────────────────────────────────────┐
│ 09:00 — Cita Psicológica                        │
│ Caso #082-2026 — Ana María L.                   │
│ Estado: 🟡 Pendiente                            │
│                                                  │
│ [✅ Atendida] [❌ No Asistió] [🔄 Reprogramar]   │
└─────────────────────────────────────────────────┘
```

**Al hacer click en "Atendida"** → Modal post-atención:

```
┌──────────────────────────────────────────────┐
│ ✅ Registrar Atención Completada              │
│                                              │
│ Caso: #082-2026                              │
│ Tipo: Cita Psicológica                       │
│ Profesional: Dra. Sofía Medina               │
│                                              │
│ Resumen de la atención:                      │
│ ┌──────────────────────────────────────────┐ │
│ │ Describa brevemente lo realizado...      │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Estado emocional observado:                  │
│ [Estable ▼]                                  │
│                                              │
│ ¿Requiere cita de seguimiento? [Sí ▼]       │
│ Fecha sugerida: [📅 ________]               │
│                                              │
│ [Cancelar]              [Confirmar Atención] │
└──────────────────────────────────────────────┘
```

**Al hacer click en "No Asistió":**
- Modal simple: motivo (select: "No se presentó", "Canceló por teléfono", "Emergencia", "Desconocido") + notas opcionales
- El estado cambia a "No Asistida" con badge gris

#### [MODIFY] [appointments.service.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/core/services/appointments.service.ts)
- Método `markAsAttended(citaId, resumen, estadoEmocional, requireFollowUp, followUpDate)`
- Método `markAsNoShow(citaId, motivo, notas)`
- Nuevos estados posibles: `Pendiente`, `Completada`, `Cancelada`, `Reprogramada`, `No Asistida`
- Registrar en `AuditService` y generar notificación

### Estimación: ~7-8 horas

---

## 🔨 Sprint 4 — RF-09: Evidencias Vinculadas + RF-07: Reportes Dinámicos

### RF-09: Evidencias Vinculadas a Casos

#### [MODIFY] [evidence.service.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/core/services/evidence.service.ts)

Expandir interface:
```typescript
interface Evidencia {
  // Campos existentes +
  caseId: string;         // Vinculación a caso
  caseCodigo: string;
  denunciaId: string;     // Vinculación a denuncia (opcional)
  hash: string;           // Hash mock SHA-256 para cadena de custodia
  cadenaEstado: string;   // 'Registrada' | 'En Análisis' | 'Verificada' | 'Rechazada'
  tags: string[];         // Etiquetas: 'amenaza', 'agresión física', 'acoso'
}
```

- Más datos mock (6-8 evidencias vinculadas a diferentes casos)
- Métodos: `getByCaseId()`, `getByDenunciaId()`, `updateStatus()`, `addTag()`
- Validación visual: `validateFileType(name)` y `validateFileSize(sizeMB)`
- Persistencia en `localStorage` key `safezone_evidence`

#### [MODIFY] [evidencias.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/evidencias/evidencias.component.html)

**Mejoras visuales:**

```
┌──────────────────────────────────────────────────────────────┐
│ 📁 Gestión de Evidencias Digitales    [Subir Evidencia]      │
│                                                              │
│ Filtros: [Caso ▼] [Tipo archivo ▼] [Estado ▼]               │
│                                                              │
│ ┌─ Evidencia ──────────────────────────────────────────────┐ │
│ │ 📄 acta_comisaria_santiago.pdf              2.4 MB       │ │
│ │                                                          │ │
│ │ 📎 Vinculado a: Caso #082-2026 — Ana María L.           │ │
│ │ 🔐 Hash SHA-256: a3f2c...8d91                           │ │
│ │ 📋 Cadena: ✅ Verificada                                │ │
│ │ 🏷️ Tags: [amenaza] [documento oficial]                   │ │
│ │ 👤 Subido por: Recepcionista — 20/05/2026 14:30         │ │
│ │                                                          │ │
│ │ [Previsualizar] [Descargar] [Ver Caso] [Cambiar Estado] │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**Modal de upload mejorado:**
- Select obligatorio: "Vincular a caso" (lista de casos activos)
- Select de tipo: "Acta policial", "Certificado médico", "Audio de amenaza", "Captura de pantalla", "Foto", "Otro"
- Tags (chips input): agregar etiquetas descriptivas
- Validación visual: tipo de archivo permitido, tamaño máximo 25MB
- Barra de progreso simulada durante el "upload"

#### [MODIFY] [evidencias.component.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/evidencias/evidencias.component.ts)
- Signals para filtros (por caso, tipo, estado)
- Computed para lista filtrada
- Modal de upload con vinculación

### RF-07: Reportes Dinámicos con Filtros

#### [NEW] `src/app/core/services/reports.service.ts`

```typescript
interface ReportData {
  casosPorRiesgo: { level: string; count: number }[];
  casosPorTipo: { type: string; count: number }[];
  casosPorDistrito: { distrito: string; count: number }[];
  casosPorEstado: { estado: string; count: number }[];
  casosPorMes: { month: string; count: number }[];
  tiempoPromedioResolucion: number;
  eficaciaMedidas: number;
  totalDenuncias: number;
  totalCitasCompletadas: number;
}
```

- Computed que genera `ReportData` dinámicamente a partir de `CasesService.casos()`, `AppointmentsService.citas()`, `DenunciasService.denuncias()`
- Signals de filtro: `reportDateFrom`, `reportDateTo`, `reportViolenceType`, `reportRiskLevel`
- Método `exportCSV()` → genera y descarga archivo .csv con los datos visibles
- Método `exportPDF()` → simula exportación con toast (real PDF requiere lib externa)

#### [MODIFY] [reportes.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/reportes/reportes.component.html)

**Rediseño completo:**

```
┌─────────────────────────────────────────────────────────────────┐
│ 📊 Estadísticas y Análisis            [Exportar CSV] [Exportar]│
│                                                                 │
│ Filtros: [Desde: 📅] [Hasta: 📅] [Tipo violencia ▼] [Riesgo ▼]│
│                                                                 │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                   │
│ │ Total  │ │T.Prom. │ │Eficacia│ │ Citas  │                   │
│ │Denuncias│ │Resoluc.│ │Medidas │ │Complet.│                   │
│ │  127   │ │ 18.4h  │ │ 92.1%  │ │  823   │                   │
│ └────────┘ └────────┘ └────────┘ └────────┘                   │
│                                                                 │
│ ┌─── Casos por Nivel de Riesgo ───┐ ┌─── Casos por Estado ───┐│
│ │ ████████████████ Crítico: 15    │ │ ██████ Registrado: 8    ││
│ │ ████████████ Alto: 12           │ │ ████████ Evaluación: 12 ││
│ │ ████████ Medio: 8              │ │ ██████████ Atención: 15 ││
│ │ ████ Bajo: 4                   │ │ ████ Derivado: 5        ││
│ └─────────────────────────────────┘ │ ██████ Cerrado: 8       ││
│                                      │ ██ Archivado: 3         ││
│                                      └────────────────────────┘│
│                                                                 │
│ ┌─── Tendencia Mensual ──────────────────────────────────────┐ │
│ │     ╭─╮                                                     │ │
│ │   ╭─╯ ╰╮    ╭─╮                                            │ │
│ │ ╭─╯    ╰─╮╭─╯ ╰─╮                                         │ │
│ │ ╯        ╰╯      ╰─                                        │ │
│ │ Ene  Feb  Mar  Abr  May                                     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─── Top Distritos ──────────────────────────────────────────┐ │
│ │ SJL      ████████████████████████ 340 (dinámico)           │ │
│ │ SMP      ████████████████ 210                               │ │
│ │ VES      ████████████ 170                                   │ │
│ │ Comas    ████████ 120                                       │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

- **Todos los datos son dinámicos** — se alimentan del `ReportsService` que a su vez lee de los signals de `CasesService`
- **Gráficos CSS** — barras horizontales y verticales con porcentajes calculados
- **Tendencia mensual** — gráfico de líneas simplificado con CSS (divs posicionados)
- **Los filtros actualizan todos los gráficos en tiempo real**
- **Exportación CSV** → botón real que genera archivo descargable con los datos filtrados

#### [MODIFY] [reportes.component.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/reportes/reportes.component.ts)
- Inyectar `ReportsService`, `CasesService`
- Signals para filtros activos
- Método `downloadCSV()` con `Blob` + `URL.createObjectURL` para descarga real

### Estimación: ~8-9 horas

---

## 🔨 Sprint 5 — RNF-10 y RNF-11: Environment Files + Revisión Final

### RNF-11: Archivos de Entorno

#### [NEW] `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'SafeZone - Desarrollo',
  version: '1.0.0-dev'
};
```

#### [NEW] `src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://safezone-api.azurewebsites.net/api',
  appName: 'SafeZone',
  version: '1.0.0'
};
```

- Configurar `angular.json` para file replacements en build de producción
- Usar `environment.apiUrl` en todos los servicios (preparado para cuando exista el backend)

### RNF-10: Cumplimiento Ley N.° 30364

#### Visual checklist en el footer o configuración:
- Banner informativo en la pantalla de víctimas: "Este sistema cumple con la Ley N.° 30364 — Ley para prevenir, sancionar y erradicar la violencia contra las mujeres y los integrantes del grupo familiar"
- Indicador de protección de identidad activa cuando hay víctimas anónimas
- Disclaimer en el login sobre la confidencialidad de los datos

### Revisión y QA Visual

- Verificar que todos los componentes rendericen correctamente
- Verificar navegación entre todos los módulos
- Verificar que el filtro por rol funcione en sidebar y dashboard
- Verificar responsive en móvil (sidebar collapse, calendar scroll)
- Verificar que localStorage persista entre sesiones

### Estimación: ~3-4 horas

---

## 📋 Resumen de Entregables Fase 3

### Archivos Nuevos (12)
| Archivo | Propósito |
|---------|-----------|
| `src/app/core/services/professionals.service.ts` | Catálogo de profesionales |
| `src/app/core/services/notifications.service.ts` | Sistema de notificaciones |
| `src/app/core/services/reports.service.ts` | Generación de reportes dinámicos |
| `src/app/features/profesionales/profesionales.component.*` | Pantalla de profesionales (3 archivos) |
| `src/app/shared/components/notifications-panel/notifications-panel.component.*` | Panel de notificaciones (3 archivos) |
| `src/environments/environment.ts` | Config de desarrollo |
| `src/environments/environment.prod.ts` | Config de producción |

### Archivos Modificados (10)
| Archivo | Cambios principales |
|---------|--------------------|
| `appointments.service.ts` | Calendario dinámico, reprogramar, cancelar, confirmar atención, 5 estados |
| `evidence.service.ts` | Vinculación a caso, metadatos, cadena de custodia, validaciones |
| `citas.component.html` | Calendario dinámico, acciones por cita, modales, vista semana |
| `citas.component.ts` | Signals modales, handlers |
| `evidencias.component.html` | Filtros, metadatos, modal upload mejorado |
| `evidencias.component.ts` | Filtros, vinculación |
| `reportes.component.html` | Rediseño completo con gráficos dinámicos y filtros |
| `reportes.component.ts` | ReportsService, filtros, exportación |
| `app.routes.ts` | Ruta profesionales |
| Topbar component | Campana de notificaciones |

### Esfuerzo Total Estimado: ~30-35 horas

---

## ✅ Resultado Esperado Post-Fase 3

| RF | % Visual Esperado |
|----|:-----------------:|
| RF-05 | 🟢 90% |
| RF-07 | 🟢 90% |
| RF-08 | 🟢 85% |
| RF-09 | 🟢 90% |
| RF-14 | 🟢 90% |
| RF-19 | 🟢 90% |
| **Promedio** | **🟢 89.2%** |

---

## 📊 Resumen Global — Las 3 Fases

| Fase | RF Cubiertos | Esfuerzo Estimado | Resultado Visual |
|------|:-----------:|:-----------------:|:----------------:|
| **Fase 1 — Avance 2** | 8 RF | ~25-31h | 87.5% |
| **Fase 2 — Avance 3** | 6 RF | ~23-27h | 89.2% |
| **Fase 3 — Final** | 6 RF | ~30-35h | 89.2% |
| **TOTAL** | **20 RF** | **~78-93h** | **~88.6%** |

> [!IMPORTANT]
> El ~11% restante en cada fase corresponde exclusivamente a funcionalidades que **requieren backend real**: autenticación JWT, cifrado AES-256, persistencia en base de datos, notificaciones push por WebSocket, exportación PDF con librería servidor. La arquitectura de servicios Angular queda **100% preparada** para esa integración: solo se reemplazarían las llamadas mock por `HttpClient.get/post` apuntando a `environment.apiUrl`.
