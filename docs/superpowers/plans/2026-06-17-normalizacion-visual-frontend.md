# Normalizacion Visual Global Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unificar el patron visual de todo el frontend SafeZone para que las paginas publicas, el portal de victima y las vistas internas compartan tipografia, espaciado, botones, tarjetas, formularios y estados consistentes.

**Architecture:** La normalizacion se hara desde los tokens globales hacia las pantallas activas. Primero se consolidan fuentes y variables base, luego se reemplazan estilos locales divergentes por clases/componentes existentes, y finalmente se revisan rutas legacy o duplicadas para evitar que sigan apareciendo patrones visuales alternos.

**Tech Stack:** Angular standalone components, SCSS global en `src/styles`, CSS por componente, Tailwind utility classes existentes, Vitest/Angular unit test runner, build con Angular CLI.

---

## Estado Actual

La rama actual es `feature/integracion-sprint-1-2`.

Hay cambios sin commitear relacionados con el rediseño compacto de `Nueva denuncia` en:

- `src/app/features/public/usuario/denuncias/denuncias.page.ts`
- `src/app/features/public/usuario/denuncias/denuncias.page.html`
- `src/app/features/public/usuario/denuncias/denuncias.page.css`
- `src/app/features/public/usuario/denuncias/denuncias.page.spec.ts`

Antes de iniciar esta normalizacion, decidir si esos cambios se commitean como trabajo previo o si se mantienen en el mismo lote visual. No revertirlos.

## Hallazgos Del Audit Visual

- `src/styles/abstracts/_variables.scss` define `Inter` como fuente base.
- `src/app/features/public/styles/design-tokens.css` define otro sistema visual con `EB Garamond + Lato`.
- `src/index.html` carga `EB Garamond`, `Lato`, `Inter`, `JetBrains Mono` y `Manrope`.
- `public-header`, `login-modal` y varias paginas publicas usan `Manrope`, `JetBrains Mono`, `Lato` o `EB Garamond` directamente.
- Existen rutas/componentes duplicados en `src/app/features/public/usuario/*` y `src/app/features/usuario/*`.
- Las vistas internas usan el sistema SCSS global (`btn`, `card`, `form-label`, `badge`, `sz-page-*`), mientras varias paginas publicas usan estilos propios y Tailwind.

## Decision Visual Base

- Fuente principal: `Inter`.
- Fuente monoespaciada permitida: `JetBrains Mono` solo para codigos, IDs, tokens o tracking codes.
- Fuentes a retirar de pantallas activas: `EB Garamond`, `Lato`, `Manrope`.
- Radio base de tarjetas y controles: 8px a 12px, evitando estilos excesivamente redondeados salvo badges/pills.
- Paleta base: mantener la paleta institucional de `src/styles/abstracts/_colors.scss` y exponer aliases CSS si una pantalla publica necesita variables `--color-*`.
- Iconografia: mantener Material Symbols donde ya existe, sin introducir otra libreria.

## Rutas En Alcance

Publicas:

- `/inicio`
- `/informacion`
- `/nosotros`
- `/faq`
- `/contacto`
- `/politicas`
- `/denuncia`
- `/mis-casos`

Portal victima:

- `/usuario`
- `/usuario/denuncias`
- `/usuario/casos`
- `/usuario/citas`
- `/usuario/evidencias`
- `/usuario/notificaciones`
- `/usuario/perfil`

Internas:

- `/dashboard`
- `/predenuncias`
- `/denuncias`
- `/casos`
- `/victimas`
- `/citas`
- `/evidencias`
- `/reportes`
- `/auditoria`
- `/usuarios`
- `/configuracion`

Legacy/duplicadas a auditar:

- `src/app/features/public/pages/**`
- `src/app/features/usuario/**`
- `src/app/features/admin/**`

---

### Task 1: Congelar El Estado Visual Actual

**Files:**

- Modify: `docs/superpowers/plans/2026-06-17-normalizacion-visual-frontend.md`
- Read: `src/app/app.routes.ts`
- Read: `src/app/features/public/public.routes.ts`
- Read: `src/styles.scss`

- [ ] **Step 1: Registrar estado git antes de tocar estilos**

Run:

```bash
git status --short --branch
```

Expected:

```text
## feature/integracion-sprint-1-2...origin/feature/integracion-sprint-1-2
 M src/app/features/public/usuario/denuncias/denuncias.page.css
 M src/app/features/public/usuario/denuncias/denuncias.page.html
 M src/app/features/public/usuario/denuncias/denuncias.page.ts
?? src/app/features/public/usuario/denuncias/denuncias.page.spec.ts
?? docs/superpowers/plans/2026-06-17-normalizacion-visual-frontend.md
```

- [ ] **Step 2: Listar rutas activas**

Run:

```bash
sed -n '1,220p' src/app/app.routes.ts
sed -n '1,160p' src/app/features/public/public.routes.ts
```

Expected: identificar que rutas se cargan realmente y separar componentes legacy no enlazados.

- [ ] **Step 3: Validar baseline**

Run:

```bash
pnpm exec ng test
pnpm build
```

Expected:

```text
Test Files  7 passed
Application bundle generation complete
```

---

### Task 2: Consolidar Fuentes Globales

**Files:**

- Modify: `src/index.html`
- Modify: `src/styles/abstracts/_variables.scss`
- Modify: `src/app/features/public/styles/design-tokens.css`
- Test: `src/app/app.spec.ts`

- [ ] **Step 1: Crear prueba de contrato visual de fuentes**

Add to `src/app/app.spec.ts`:

```ts
it('uses Inter as the primary SafeZone font contract', () => {
  const rootFont = getComputedStyle(document.body).fontFamily;
  expect(rootFont).toContain('Inter');
});
```

- [ ] **Step 2: Ejecutar prueba y confirmar baseline**

Run:

```bash
pnpm exec ng test --include src/app/app.spec.ts
```

Expected: PASS si `body` ya hereda `Inter`; si falla, corregir en el siguiente paso.

- [ ] **Step 3: Reducir fuentes cargadas**

In `src/index.html`, replace the Google Fonts link with:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap"
  rel="stylesheet">
```

Update the comment to:

```html
<!-- Tipografia: Inter global; JetBrains Mono solo para codigos e identificadores -->
```

- [ ] **Step 4: Actualizar tokens publicos**

In `src/app/features/public/styles/design-tokens.css`, set:

```css
--font-serif: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

- [ ] **Step 5: Validar**

Run:

```bash
pnpm exec ng test --include src/app/app.spec.ts
pnpm build
```

Expected: tests pass and build completes.

- [ ] **Step 6: Commit**

```bash
git add src/index.html src/styles/abstracts/_variables.scss src/app/features/public/styles/design-tokens.css src/app/app.spec.ts
git commit -m "style(frontend): unificar tipografia global"
```

---

### Task 3: Eliminar Fuentes Locales Divergentes En Componentes Activos

**Files:**

- Modify: `src/app/features/public/components/public-header/public-header.component.css`
- Modify: `src/app/features/public/components/login-modal/login-modal.component.css`
- Modify: `src/app/features/public/usuario/usuario-layout/usuario-layout.page.css`
- Search: `src/app/features/public/**/*.css`
- Search: `src/app/features/public/**/*.ts`

- [ ] **Step 1: Detectar fuentes hardcodeadas**

Run:

```bash
rg -n "font-family:.*(Manrope|Lato|Garamond|Inter|JetBrains|Courier)" src/app src/styles
```

Expected: obtener una lista concreta de reglas CSS/inline styles con fuentes locales.

- [ ] **Step 2: Reemplazar fuentes de texto comun**

For every active route component, replace:

```css
font-family: "Manrope", sans-serif;
font-family: var(--font-serif);
font-family: var(--font-sans);
font-family: "Inter", sans-serif;
```

with:

```css
font-family: inherit;
```

Keep monospace only for codes:

```css
font-family: "JetBrains Mono", monospace;
```

- [ ] **Step 3: Validar que solo queden monospace permitidos**

Run:

```bash
rg -n "font-family:" src/app src/styles
```

Expected: solo `inherit`, global typography, and `JetBrains Mono` for code-like UI.

- [ ] **Step 4: Build**

Run:

```bash
pnpm build
```

Expected: build completes.

- [ ] **Step 5: Commit**

```bash
git add src/app/features/public/components/public-header/public-header.component.css src/app/features/public/components/login-modal/login-modal.component.css src/app/features/public/usuario/usuario-layout/usuario-layout.page.css
git commit -m "style(frontend): remover fuentes locales divergentes"
```

---

### Task 4: Crear Utilidades Globales De Pantalla

**Files:**

- Modify: `src/styles/components/_cards.scss`
- Modify: `src/styles/components/_buttons.scss`
- Modify: `src/styles/components/_forms.scss`
- Modify: `src/styles/base/_utilities.scss`

- [ ] **Step 1: Agregar clases de pagina reutilizables**

Add to `src/styles/base/_utilities.scss`:

```scss
.sz-page-shell {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
}

.sz-page-heading {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.sz-page-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: 0;
}

.sz-page-description {
  margin: 0;
  max-width: 760px;
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.5;
}
```

- [ ] **Step 2: Asegurar botones consistentes**

Review `src/styles/components/_buttons.scss` and ensure active button classes include:

```scss
.btn {
  min-height: 40px;
  border-radius: 8px;
  font-family: inherit;
  font-weight: 700;
}
```

- [ ] **Step 3: Asegurar cards consistentes**

Review `src/styles/components/_cards.scss` and ensure active card classes include:

```scss
.card {
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
}
```

- [ ] **Step 4: Asegurar formularios consistentes**

Review `src/styles/components/_forms.scss` and ensure form controls include:

```scss
.form-input,
.form-select,
.form-textarea {
  border-radius: 8px;
  font-family: inherit;
}
```

- [ ] **Step 5: Validar**

Run:

```bash
pnpm build
```

Expected: build completes.

- [ ] **Step 6: Commit**

```bash
git add src/styles/base/_utilities.scss src/styles/components/_buttons.scss src/styles/components/_cards.scss src/styles/components/_forms.scss
git commit -m "style(frontend): agregar utilidades visuales globales"
```

---

### Task 5: Normalizar Layout Publico Activo

**Files:**

- Modify: `src/app/features/public/components/public-header/public-header.component.css`
- Modify: `src/app/features/public/components/public-footer/public-footer.component.css`
- Modify: `src/app/features/public/inicio/inicio.page.*`
- Modify: `src/app/features/public/informacion/informacion.page.*`
- Modify: `src/app/features/public/nosotros/nosotros.page.*`
- Modify: `src/app/features/public/faq/faq.page.*`
- Modify: `src/app/features/public/contacto/contacto.page.*`
- Modify: `src/app/features/public/politicas/politicas.page.*`
- Modify: `src/app/features/public/denuncia/denuncia.page.*`
- Modify: `src/app/features/public/mis-casos/mis-casos.page.*`

- [ ] **Step 1: Reemplazar wrappers divergentes por estructura comun**

For each active public page, ensure the root content uses:

```html
<main class="sz-page-shell public-page-shell">
  <section class="sz-page-heading">
    <h1 class="sz-page-title">SafeZone</h1>
    <p class="sz-page-description">Plataforma confidencial para registrar denuncias y consultar el avance de casos.</p>
  </section>
  <section class="card">
    <div class="card-body">
      <p>Contenido principal de la pagina activa.</p>
    </div>
  </section>
</main>
```

If a page already has a special hero, keep the hero but align typography to `.sz-page-title` and `.sz-page-description`.

- [ ] **Step 2: Quitar estilos de hero que cambian familia tipografica**

Search:

```bash
rg -n "font-serif|font-sans|font-family" src/app/features/public
```

Replace active-page typography classes that force non-global fonts with global utilities or inherited font.

- [ ] **Step 3: Corregir `/mis-casos` input hardcodeado**

In `src/app/features/public/mis-casos/mis-casos.page.html`, replace:

```html
value="SZ-2024-8842"
```

with:

```html
placeholder="Ingresa tu codigo de seguimiento"
```

Do not implement backend lookup in this task.

- [ ] **Step 4: Validar responsive manual**

Run frontend if needed:

```bash
pnpm start
```

Check active public pages at:

- 360px
- 768px
- 1024px
- 1440px

Expected: no text overlap, no horizontal overflow, consistent font.

- [ ] **Step 5: Automated validation**

Run:

```bash
pnpm exec ng test
pnpm build
```

Expected: tests and build pass.

- [ ] **Step 6: Commit**

```bash
git add src/app/features/public src/styles.scss
git commit -m "style(public): normalizar paginas publicas activas"
```

---

### Task 6: Normalizar Portal De Victima

**Files:**

- Modify: `src/app/features/public/usuario/usuario-layout/usuario-layout.page.*`
- Modify: `src/app/features/public/usuario/usuario-dashboard/usuario-dashboard.page.*`
- Modify: `src/app/features/public/usuario/denuncias/denuncias.page.*`
- Modify: `src/app/features/public/usuario/casos/casos.page.*`
- Modify: `src/app/features/public/usuario/citas/citas.page.*`
- Modify: `src/app/features/public/usuario/evidencias/evidencias.page.*`
- Modify: `src/app/features/public/usuario/notificaciones/notificaciones.page.*`
- Modify: `src/app/features/public/usuario/perfil/perfil.page.*`

- [ ] **Step 1: Aplicar contenedor comun**

Each victim portal page should start with:

```html
<section class="sz-page-heading">
  <h2 class="sz-page-title">Mis denuncias</h2>
  <p class="sz-page-description">Listado de denuncias registradas por la cuenta de victima.</p>
</section>
```

- [ ] **Step 2: Convertir placeholders en estados vacios consistentes**

Use this structure in empty pages:

```html
<div class="empty-state">
  <span class="material-symbols-outlined" aria-hidden="true">folder_open</span>
  <p>No hay informacion disponible para esta seccion.</p>
</div>
```

Use existing localized text per page.

- [ ] **Step 3: Mantener el wizard compacto de denuncias**

Do not remove the current compact wizard. Align its colors/radius/font with global classes only.

- [ ] **Step 4: Validar responsive**

Check `/usuario/denuncias` at:

- 360px
- 768px
- 1024px
- 1440px

Expected: wizard cards collapse cleanly, buttons do not overflow, no nested-card visual clutter.

- [ ] **Step 5: Run tests**

```bash
pnpm exec ng test --include src/app/features/public/usuario/denuncias/denuncias.page.spec.ts
pnpm exec ng test
pnpm build
```

Expected: tests and build pass.

- [ ] **Step 6: Commit**

```bash
git add src/app/features/public/usuario
git commit -m "style(victima): normalizar portal de usuario"
```

---

### Task 7: Normalizar Vistas Internas

**Files:**

- Modify: `src/app/core/layout/main-layout/main-layout.component.*`
- Modify: `src/app/core/layout/sidebar/sidebar.component.*`
- Modify: `src/app/core/layout/topbar/topbar.component.*`
- Modify: `src/app/features/interno/**/*.html`
- Modify: `src/app/features/interno/**/*.scss`

- [ ] **Step 1: Alinear encabezados internos**

Every internal page should use:

```html
<section class="sz-page-heading">
  <h1 class="sz-page-title">Titulo</h1>
  <p class="sz-page-description">Descripcion corta.</p>
</section>
```

- [ ] **Step 2: Alinear cards/formularios/tablas**

Replace local ad-hoc blocks with existing global classes:

```html
<section class="card">
  <div class="card-header">
    <h2>Predenuncias pendientes</h2>
  </div>
  <div class="card-body">
    <p>Listado operativo de registros por revisar.</p>
  </div>
</section>
```

Use `.btn`, `.form-input`, `.form-select`, `.form-textarea`, `.badge`.

- [ ] **Step 3: Eliminar inline styles evitables**

Run:

```bash
rg -n "style=\"" src/app/features/interno src/app/core/layout
```

Move repeated styles into component SCSS or global utilities. Keep inline style only for one-off icon font variation if needed.

- [ ] **Step 4: Validar**

Run:

```bash
pnpm exec ng test
pnpm build
```

Expected: tests and build pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/core/layout src/app/features/interno
git commit -m "style(interno): normalizar vistas administrativas"
```

---

### Task 8: Auditar Y Aislar Componentes Legacy

**Files:**

- Read: `src/app/app.routes.ts`
- Read: `src/app/features/public/public.routes.ts`
- Read: `src/app/features/admin/admin.routes.ts`
- Read: `src/app/features/usuario/usuario.routes.ts`
- Modify only if route is unused and safe: legacy files under `src/app/features/public/pages/**`, `src/app/features/admin/**`, `src/app/features/usuario/**`

- [ ] **Step 1: Mapear imports de rutas**

Run:

```bash
rg -n "loadComponent|component:|children|path:" src/app/app.routes.ts src/app/features/**/*.routes.ts src/app/features/**/*.ts
```

Expected: determine whether `features/admin/**`, `features/usuario/**`, and `features/public/pages/**` are active or legacy.

- [ ] **Step 2: Si son legacy, documentar antes de eliminar**

Create or update:

```text
docs/superpowers/plans/2026-06-17-normalizacion-visual-frontend.md
```

Add a section named `Legacy Confirmado` listing files not reachable from active routes.

- [ ] **Step 3: No borrar sin build/test**

If deleting legacy files, delete only unreachable route/component files and then run:

```bash
pnpm exec ng test
pnpm build
```

Expected: tests and build pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/features docs/superpowers/plans/2026-06-17-normalizacion-visual-frontend.md
git commit -m "chore(frontend): aislar vistas legacy no usadas"
```

---

### Task 9: QA Visual Final

**Files:**

- No required code changes unless QA finds regressions.

- [ ] **Step 1: Ejecutar app**

```bash
pnpm start
```

Expected: app running at `http://127.0.0.1:4200`.

- [ ] **Step 2: Revisar rutas publicas**

Open:

- `http://127.0.0.1:4200/inicio`
- `http://127.0.0.1:4200/informacion`
- `http://127.0.0.1:4200/nosotros`
- `http://127.0.0.1:4200/faq`
- `http://127.0.0.1:4200/contacto`
- `http://127.0.0.1:4200/politicas`
- `http://127.0.0.1:4200/denuncia`
- `http://127.0.0.1:4200/mis-casos`

Expected: consistent typography, card radius, button style, spacing, and no horizontal overflow.

- [ ] **Step 3: Revisar portal victima**

Open:

- `http://127.0.0.1:4200/usuario/denuncias`
- `http://127.0.0.1:4200/usuario/casos`
- `http://127.0.0.1:4200/usuario/citas`
- `http://127.0.0.1:4200/usuario/evidencias`
- `http://127.0.0.1:4200/usuario/notificaciones`
- `http://127.0.0.1:4200/usuario/perfil`

Expected: same shell and text scale across all portal pages.

- [ ] **Step 4: Revisar internas**

Open:

- `http://127.0.0.1:4200/dashboard`
- `http://127.0.0.1:4200/predenuncias`
- `http://127.0.0.1:4200/denuncias`
- `http://127.0.0.1:4200/casos`
- `http://127.0.0.1:4200/victimas`
- `http://127.0.0.1:4200/citas`
- `http://127.0.0.1:4200/evidencias`
- `http://127.0.0.1:4200/reportes`
- `http://127.0.0.1:4200/auditoria`
- `http://127.0.0.1:4200/usuarios`
- `http://127.0.0.1:4200/configuracion`

Expected: internal pages use same admin shell and shared component classes.

- [ ] **Step 5: Validacion final**

```bash
pnpm exec ng test
pnpm build
git status --short
```

Expected: tests pass, build passes, and status only contains intentional files.

- [ ] **Step 6: Commit final si hubo fixes de QA**

```bash
git add src docs
git commit -m "fix(frontend): corregir regresiones visuales globales"
```

---

## Riesgos Y Controles

- Riesgo: cambiar tipografias puede alterar alturas y causar overflow. Control: revisar 360, 768, 1024 y 1440px.
- Riesgo: paginas legacy aun pueden estar conectadas por rutas secundarias. Control: auditar rutas antes de eliminar.
- Riesgo: mezclar normalizacion visual con funcionalidad pendiente. Control: commits separados por zona y no agregar endpoints nuevos en esta tarea.
- Riesgo: estilos globales pueden afectar pantallas internas. Control: ejecutar build/test despues de cada task y QA visual por rutas.

## Orden De Commits Recomendado

1. `style(frontend): unificar tipografia global`
2. `style(frontend): remover fuentes locales divergentes`
3. `style(frontend): agregar utilidades visuales globales`
4. `style(public): normalizar paginas publicas activas`
5. `style(victima): normalizar portal de usuario`
6. `style(interno): normalizar vistas administrativas`
7. `chore(frontend): aislar vistas legacy no usadas`
8. `fix(frontend): corregir regresiones visuales globales`

## Criterio De Cierre

- No quedan fuentes activas divergentes excepto `JetBrains Mono` para codigos.
- Las rutas activas comparten jerarquia tipografica y espaciado.
- Botones, cards, formularios, tablas y estados vacios usan clases globales o estilos equivalentes.
- `pnpm exec ng test` pasa.
- `pnpm build` pasa.
- QA visual manual no muestra overflow, texto cortado ni diferencias fuertes de fuente entre modulos.

## Estado De Implementacion

Actualizado el 2026-06-17:

- Completado: fuente global Inter y uso de JetBrains Mono limitado a codigos/identificadores.
- Completado: remocion de fuentes locales divergentes en header, footer, modales y paginas publicas embebidas.
- Completado: utilidades visuales globales para page headings, empty states, scroll panels, stepper, modales, icon buttons y barras.
- Completado: portal de victima con shell, heading, tabs y card de contenido consistentes.
- Completado: vistas internas ajustadas para remover estilos embebidos de tamanos, scroll, stepper, dots y barras.
- Completado: `mis-casos` ya no muestra un codigo prellenado en el input de consulta.
- Validado: `pnpm exec ng test` pasa con 7 archivos y 15 pruebas.
- Validado: `pnpm build` pasa correctamente.
- Pendiente menor: en `/mis-casos` quedan estilos inline solo para `font-variation-settings` de iconos Material Symbols.
