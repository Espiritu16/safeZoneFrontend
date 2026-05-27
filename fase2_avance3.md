# 🔵 Fase 2 — Avance 3: Gestión de Casos y Denuncias

> **Alcance:** Solo frontend visual. Datos mock con signals/localStorage.  
> **Sin backend.** Servicios Angular preparados para integración futura con API REST.  
> **RF cubiertos:** RF-04, RF-06, RF-12, RF-13, RF-15, RF-17  
> **RNF cubiertos:** RNF-05, RNF-07, RNF-08, RNF-09  
> **Prerequisito:** Fase 1 completada (servicios base, roleGuard, AuditService, VictimsService)

---

## 📊 Estado Actual (Frontend-Only)

| RF | Implementado Visualmente | Faltante Visual | % Frontend |
|----|--------------------------|-----------------|:----------:|
| RF-04 — Clasificar caso | Badges de riesgo (Severo/Moderado/Leve) | Formulario de evaluación, nivel "Crítico", cálculo automático | 🔴 25% |
| RF-06 — Registrar observaciones | Nada implementado | Formulario completo, listado por caso, filtro por profesional | 🔴 0% |
| RF-12 — Denuncia asistida | Multi-step 4 pasos funcional | Validaciones por paso, registro del recepcionista, servicio dedicado | 🟡 55% |
| RF-13 — Gestión de casos | Tabla + Kanban, crear, consultar | Editar caso, cerrar caso, drawer con detalles completos, paginación | 🟡 50% |
| RF-15 — Cambio de estado | Kanban con 3 columnas + moveCase() | 6 estados completos, historial de cambios, confirmación | 🔴 35% |
| RF-17 — Búsqueda y filtros | Input texto + filtro riesgo + contador | Filtros por tipo de violencia, estado, rango de fechas | 🟡 50% |

> **Cobertura visual promedio actual: ~35.8%**  
> **Objetivo post-implementación: ~90%+ visual**

---

## 🔨 Sprint 1 — RF-04: Formulario de Evaluación y Clasificación de Riesgo

### Objetivo
Crear un formulario de evaluación inicial que, mediante un cuestionario de preguntas, **calcule automáticamente el nivel de riesgo** (Bajo, Medio, Alto, Crítico) y lo asigne al caso.

### Archivos nuevos

#### [NEW] `src/app/features/casos/evaluacion-riesgo/evaluacion-riesgo.component.ts`
#### [NEW] `src/app/features/casos/evaluacion-riesgo/evaluacion-riesgo.component.html`
#### [NEW] `src/app/features/casos/evaluacion-riesgo/evaluacion-riesgo.component.scss`

**Diseño del formulario de evaluación:**

El formulario contiene 8-10 preguntas tipo escala (1-5) o Sí/No agrupadas en categorías:

| Categoría | Preguntas ejemplo | Peso |
|-----------|-------------------|------|
| **Frecuencia** | ¿Con qué frecuencia ocurren las agresiones? (Diario/Semanal/Mensual/Esporádico) | Alto |
| **Tipo de violencia** | ¿Qué tipos de violencia se reportan? (Física/Psicológica/Sexual/Económica - múltiple) | Alto |
| **Amenazas** | ¿El agresor ha amenazado de muerte a la víctima? (Sí/No) | Crítico |
| **Armas** | ¿El agresor tiene acceso a armas? (Sí/No/Desconocido) | Crítico |
| **Historial** | ¿Existen denuncias previas? (Sí, múltiples/Sí, una/No) | Medio |
| **Red de apoyo** | ¿La víctima cuenta con red de apoyo familiar/social? (Sí/Parcial/No) | Medio |
| **Convivencia** | ¿La víctima convive con el agresor actualmente? (Sí/No) | Alto |
| **Menores** | ¿Hay menores de edad involucrados? (Sí/No) | Alto |

**Lógica de cálculo (en el componente):**
```
Puntaje 0-20  → Bajo    (🟢 verde)
Puntaje 21-40 → Medio   (🟡 amarillo)
Puntaje 41-60 → Alto    (🟠 naranja)
Puntaje 61+   → Crítico (🔴 rojo)
```

**UI del componente:**
- Formulario con tarjetas por pregunta (una por sección)
- Barra de progreso que se llena conforme se responden las preguntas
- Al final: **panel de resultado** con badge grande del nivel de riesgo + puntaje numérico
- Botón "Confirmar y asignar al caso"
- El resultado se guarda en el campo `riesgo` del caso en `CasesService`

### Archivos modificados

#### [MODIFY] [cases.service.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/core/services/cases.service.ts)
- Agregar campo `riskScore: number` a la interface `Caso`
- Actualizar los 4 niveles de riesgo: `Bajo`, `Medio`, `Alto`, `Crítico` (reemplazar `Severo` → `Crítico`, `Leve` → `Bajo`)
- Método `updateRiskLevel(caseId: string, score: number, level: string)`

#### [MODIFY] [casos.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/casos/casos.component.html)
- Agregar botón "Evaluar Riesgo" en la columna de acciones de cada caso que no tenga evaluación
- Agregar badge `Crítico` con color rojo intenso y animación de pulso
- Actualizar filtro de riesgo con los 4 niveles

### Estimación: ~5-6 horas

---

## 🔨 Sprint 2 — RF-06: Panel de Observaciones por Caso (100% nuevo)

### Objetivo
Crear un sistema completo de observaciones/notas que psicólogos y defensores legales puedan registrar dentro del expediente de un caso.

### Archivos nuevos

#### [NEW] `src/app/core/services/observations.service.ts`

```typescript
interface Observation {
  id: string;
  caseId: string;
  authorName: string;
  authorRole: string;  // 'Psicólogo' | 'Defensor Legal'
  date: string;
  type: string;        // 'Observación' | 'Acción Realizada' | 'Recomendación' | 'Próxima Acción'
  content: string;
  isPrivate: boolean;  // Solo visible para el mismo rol
}
```

- Signal con array de 8-10 observaciones mock distribuidas entre los casos existentes
- Métodos: `getByCaseId()`, `add()`, `update()`, `delete()`, `filterByType()`, `filterByRole()`
- Persistencia en `localStorage` key `safezone_observations`

#### [NEW] `src/app/features/casos/observaciones-panel/observaciones-panel.component.ts`
#### [NEW] `src/app/features/casos/observaciones-panel/observaciones-panel.component.html`
#### [NEW] `src/app/features/casos/observaciones-panel/observaciones-panel.component.scss`

**Diseño del panel:**

```
┌─────────────────────────────────────────────────────┐
│ 📋 Observaciones del Caso #082-2026                 │
│                                                     │
│ [Filtro: Todas ▼] [Filtro: Todos los roles ▼]       │
│                                                     │
│ ┌─ Nueva Observación ─────────────────────────────┐ │
│ │ Tipo: [Observación ▼]                           │ │
│ │ ┌───────────────────────────────────────────┐    │ │
│ │ │ Escriba su observación aquí...            │    │ │
│ │ └───────────────────────────────────────────┘    │ │
│ │ ☐ Marcar como privada (solo mi rol)             │ │
│ │                         [Guardar Observación]   │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ─── Historial ──────────────────────────────────── │
│                                                     │
│ 🟣 Dr. Carlos Rojas (Psicólogo) — Hace 2 horas    │
│    Tipo: Observación                                │
│    "La víctima presenta síntomas de estrés          │
│     postraumático agudo. Se recomienda sesión       │
│     diaria de contención emocional."                │
│                                                     │
│ 🔵 Abog. María Torres (Defensor Legal) — Hace 1d   │
│    Tipo: Acción Realizada                           │
│    "Se presentó solicitud de medidas cautelares      │
│     ante el 2do Juzgado de Familia de Lima."        │
│                                                     │
│ 🟣 Dra. Sofía Medina (Psicólogo) — Hace 3 días    │
│    Tipo: Recomendación                              │
│    "Derivar a terapia grupal. La víctima muestra    │
│     apertura a participar en grupos de apoyo."      │
│                                                     │
│ 🔵 Abog. María Torres (Defensor Legal) — Hace 5d   │
│    Tipo: Próxima Acción                             │
│    "Programar audiencia de seguimiento para          │
│     verificar cumplimiento de medidas de            │
│     alejamiento. Fecha tentativa: 28/05/2026"       │
└─────────────────────────────────────────────────────┘
```

- Cada observación tiene: avatar con inicial del autor, nombre, rol (con color), timestamp, tipo (badge), contenido
- Las observaciones privadas muestran un 🔒 y solo son visibles si el rol actual coincide
- Formulario de nueva observación con: select de tipo, textarea, checkbox de privacidad
- Solo visible/editable para roles **Psicólogo** y **Defensor Legal**

### Integración con el módulo de Casos

#### [MODIFY] [casos.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/casos/casos.component.html)
- Agregar un **drawer lateral** (panel deslizable) que se abre al hacer click en "Ficha Digital" de un caso
- El drawer tiene tabs: `[ Detalles | Observaciones | Timeline ]`
- La tab "Observaciones" carga el `observaciones-panel` component

#### [MODIFY] [casos.component.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/casos/casos.component.ts)
- Signal `showDrawer` y `activeDrawerTab`
- Inyectar `ObservationsService`

### Estimación: ~6-7 horas

---

## 🔨 Sprint 3 — RF-12 y RF-13: Mejoras a Denuncias + CRUD Completo de Casos

### RF-12: Mejoras al Flujo de Denuncia Asistida

#### [NEW] `src/app/core/services/denuncias.service.ts`

```typescript
interface Denuncia {
  id: string;
  codigo: string;
  victimId: string;
  casoId: string;
  tipoViolencia: string;
  relacionAgresor: string;
  detalleHechos: string;
  registradoPor: string;       // Nombre del recepcionista/persona que registró
  rolRegistrador: string;
  fechaRegistro: string;
  estado: string;              // 'Registrada' | 'En Proceso' | 'Derivada' | 'Archivada'
  medidasInmediatas: boolean;
  evidenciasIds: string[];
}
```

- Signal con array de 3-4 denuncias mock vinculadas a casos existentes
- Métodos: `getAll()`, `add()`, `getByCaseId()`, `getByVictimId()`
- Persistencia en `localStorage` key `safezone_denuncias`

#### [MODIFY] [denuncias.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/denuncias/denuncias.component.html)
- **Validaciones visuales por paso:**
  - Step 1: DNI obligatorio (8 dígitos, validación visual con borde rojo), nombre obligatorio si no es anónimo, edad obligatoria
  - Step 2: Tipo de violencia obligatorio, detalle de hechos mínimo 20 caracteres
  - Step 3: Al menos 1 archivo cargado (o checkbox "sin evidencias por el momento")
  - Step 4: Resumen **editable** — botón "Editar" al lado de cada campo que lleva al paso correspondiente
- **Mostrar quién registra:** Banner superior "Registrado por: [nombre del usuario actual] — Rol: [rol actual]"
- **Botón "Guardar borrador"** en cada paso para no perder la info

#### [MODIFY] [denuncias.component.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/denuncias/denuncias.component.ts)
- Inyectar `DenunciasService`, `VictimsService`
- Signals de validación por paso: `isStep1Valid`, `isStep2Valid`, etc.
- Al enviar: crear denuncia + crear caso + crear/vincular víctima (flujo completo)
- Registrar en `AuditService`

### RF-13: CRUD Completo de Casos

#### [MODIFY] [casos.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/casos/casos.component.html)

**Drawer lateral completo con tabs:**
```
┌────────────────────────────────────────────────┐
│  ← Cerrar    Caso #082-2026                    │
│                                                │
│  [ Detalles ] [ Observaciones ] [ Timeline ]   │
│                                                │
│  ── Tab Detalles ──────────────────────────── │
│                                                │
│  Víctima: Ana María L.        [Editar]         │
│  Tipo: Física                                  │
│  Riesgo: Severo                                │
│  Estado: En Proceso                            │
│  Encargado: Dra. Sofía Medina                  │
│  Fecha: 2026-05-20                             │
│  Estado Emocional: Ansiedad Alta               │
│                                                │
│  ── Acciones ─────────────────────────────── │
│  [Editar Caso] [Cerrar Caso] [Archivar]        │
└────────────────────────────────────────────────┘
```

- **Botón "Editar Caso"** → Mismo drawer cambia a modo edición con inputs editables
- **Botón "Cerrar Caso"** → Modal de confirmación con: motivo de cierre (select), observación final (textarea), checkbox "notificar a víctima"
- **Botón "Archivar"** → Similar al cierre, pero pide justificación
- **Tab "Timeline"** → Historial de cambios de estado con quién, cuándo y por qué

#### [MODIFY] [cases.service.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/core/services/cases.service.ts)
- Método `updateCase(id, data)` para edición
- Método `closeCase(id, reason, notes)` para cierre formal
- Método `archiveCase(id, justification)` para archivado
- Array `stateHistory` dentro de cada caso para registrar cambios
- Paginación: signals `currentPage`, `pageSize`, computed `paginatedCasos`
- Persistencia en `localStorage` key `safezone_cases`

### Estimación: ~7-8 horas

---

## 🔨 Sprint 4 — RF-15: 6 Estados Completos + RF-17: Filtros Avanzados

### RF-15: Kanban con 6 Estados + Historial de Transiciones

#### [MODIFY] [casos.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/casos/casos.component.html)

**Kanban rediseñado con 6 columnas:**

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│Registrado│→│Evaluación│→│En Atención│→│ Derivado │→│ Cerrado  │→│Archivado │
│   (🔵)   │ │   (🟡)   │ │   (🟢)   │ │   (🟠)   │ │   (⚫)   │ │   (⬜)   │
│          │ │          │ │          │ │          │ │          │ │          │
│  Card 1  │ │  Card 2  │ │  Card 3  │ │          │ │  Card 4  │ │          │
│          │ │  Card 5  │ │          │ │          │ │          │ │          │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

- Cada tarjeta muestra: badge riesgo, nombre víctima, código, tipo, encargado
- **Flechas de avance/retroceso** en cada tarjeta
- **Al hacer click en la flecha** → Modal de confirmación: "¿Mover Caso #082-2026 de 'Evaluación' a 'En Atención'?" + textarea obligatorio para motivo del cambio
- **Scroll horizontal** en móviles para las 6 columnas
- **Contador por columna** en el header

#### [MODIFY] [cases.service.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/core/services/cases.service.ts)

- Estados válidos: `['Registrado', 'En Evaluación', 'En Atención', 'Derivado', 'Cerrado', 'Archivado']`
- Agregar interface `StateChange`:
```typescript
interface StateChange {
  from: string;
  to: string;
  date: string;
  changedBy: string;
  role: string;
  reason: string;
}
```
- Cada `Caso` tiene un array `stateHistory: StateChange[]`
- `moveCase()` ahora recibe `reason: string` y registra el cambio en el historial + auditoría
- Reglas de transición válidas (no se puede saltar estados):
  - Registrado → Evaluación
  - Evaluación → En Atención | Derivado
  - En Atención → Derivado | Cerrado
  - Derivado → En Atención | Cerrado
  - Cerrado → Archivado
  - Archivado → (irreversible)

### RF-17: Filtros Avanzados de Casos

#### [MODIFY] [casos.component.html](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/casos/casos.component.html)

**Barra de filtros expandida:**

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔍 [Buscar por código, víctima...]  [Riesgo ▼] [Estado ▼]      │
│    [Tipo Violencia ▼]  [Desde: 📅]  [Hasta: 📅]  [Limpiar ✕]  │
│                                         Resultados: 5 de 12    │
└─────────────────────────────────────────────────────────────────┘
```

| Filtro | Tipo | Opciones |
|--------|------|----------|
| Búsqueda texto | Input | Código, nombre/alias víctima, encargado |
| Riesgo | Select | Todos / Bajo / Medio / Alto / Crítico |
| Estado | Select | Todos / Registrado / Evaluación / En Atención / Derivado / Cerrado / Archivado |
| Tipo de violencia | Select | Todos / Física / Psicológica / Económica / Sexual / Combinada |
| Fecha desde | Date input | Fecha mínima de registro |
| Fecha hasta | Date input | Fecha máxima de registro |
| Limpiar filtros | Botón | Resetea todos los filtros |

#### [MODIFY] [cases.service.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/core/services/cases.service.ts)

- Nuevos signals: `casesStatusFilter`, `casesTypeFilter`, `casesDateFrom`, `casesDateTo`
- Computed `filteredCasos` actualizado para combinar todos los filtros
- Método `clearFilters()` para resetear

#### [MODIFY] [casos.component.ts](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/casos/casos.component.ts)
- Bindings a los nuevos signals del service

### Estimación: ~5-6 horas

---

## 📋 Resumen de Entregables Fase 2

### Archivos Nuevos (7)
| Archivo | Propósito |
|---------|-----------|
| `src/app/core/services/denuncias.service.ts` | Gestión de denuncias |
| `src/app/core/services/observations.service.ts` | Observaciones por caso |
| `src/app/features/casos/evaluacion-riesgo/evaluacion-riesgo.component.*` | Formulario de evaluación de riesgo (3 archivos) |
| `src/app/features/casos/observaciones-panel/observaciones-panel.component.*` | Panel de observaciones (3 archivos) |

### Archivos Modificados (6)
| Archivo | Cambios principales |
|---------|--------------------|
| `cases.service.ts` | 4 niveles de riesgo, 6 estados, historial, CRUD completo, filtros, paginación |
| `casos.component.html` | Kanban 6 columnas, drawer lateral con tabs, filtros avanzados, paginación |
| `casos.component.ts` | Signals nuevos, drawer, inyecciones |
| `denuncias.component.html` | Validaciones visuales, registro de quien registra, borrador |
| `denuncias.component.ts` | DenunciasService, validaciones, flujo completo |
| `app.routes.ts` | Ruta para evaluación de riesgo (si es página separada) |

### Esfuerzo Total Estimado: ~23-27 horas

---

## ✅ Resultado Esperado Post-Fase 2

| RF | % Visual Esperado |
|----|:-----------------:|
| RF-04 | 🟢 90% |
| RF-06 | 🟢 90% |
| RF-12 | 🟢 85% |
| RF-13 | 🟢 90% |
| RF-15 | 🟢 90% |
| RF-17 | 🟢 90% |
| **Promedio** | **🟢 89.2%** |

> [!TIP]
> El 10% restante corresponde a validaciones del backend (persistencia real, reglas de negocio server-side) y a la integración con `HttpClient` cuando el backend esté disponible. Los servicios quedan con interfaces TypeScript listas para mapear directamente a los DTOs del API.
