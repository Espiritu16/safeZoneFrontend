# SafeZone - Plataforma de Denuncias y Seguimiento de Casos de Violencia Familiar

**SafeZone** es una plataforma web enterprise moderna diseñada para la gestión, seguimiento y protección de casos de violencia familiar en Lima Metropolitana. Este sistema está orientado a entidades gubernamentales (MIMP, comisarías, Poder Judicial), personal administrativo, psicólogos, defensores legales y víctimas, garantizando accesibilidad, confidencialidad, rapidez y sensibilidad humana.

El frontend del proyecto está construido con **Angular 21 (Standalone Components)**, estructurado bajo un diseño modular limpio y escalable con estilos avanzados en **SCSS** (totalmente preparados para Dart Sass 3.0.0).

---

## 🎨 Inspiración y Estética Visual
El diseño de SafeZone está enfocado en ofrecer una experiencia de usuario institucional pero moderna, combinando elementos inspirados en plataformas como **Linear**, **Vercel** y **Stripe Dashboard**:
*   **Aesthetics Premium**: Uso de micro-animaciones en CSS, bordes suaves y gradients armónicos.
*   **Glassmorphism**: Efectos de desenfoque translúcido (`backdrop-filter`) en barras superiores y menús de navegación.
*   **Simulador de Carga (Skeletons)**: Indicadores de progreso animados que mejoran el feedback visual del usuario al transicionar entre vistas o al presionar "Simular Carga".

---

## 🛠️ Arquitectura y Estructura de Directorios
El proyecto se ha reestructurado separando la lógica monolítica original en componentes independientes y lazy-loaded guiándose por patrones de diseño de gran escala:

```
src/app/
├── app.config.ts          # Configuración del bootstrapping global de Angular
├── app.routes.ts          # Configuración de enrutamiento SPA y Lazy Loading
├── app.ts                 # Componente raíz del portal (RouterOutlet limpio)
├── core/                  # Recursos transversales no compartidos
│   ├── guards/            # Guardianes de ruta (auth.guard.ts)
│   ├── layout/            # Contenedor estructural (main-layout, sidebar, topbar)
│   └── services/          # Gestión de estado global con Angular Signals
│       ├── auth.service.ts
│       ├── cases.service.ts
│       ├── appointments.service.ts
│       ├── evidence.service.ts
│       ├── toast.service.ts
│       ├── loading.service.ts
│       └── layout.service.ts
├── shared/                # Recursos y componentes reutilizables
│   └── components/        # Contenedores globales de Toasts y Loader superior
└── features/              # Módulos y páginas funcionales (Lazy-Loaded)
    ├── auth/login/        # Página de autenticación con simulación
    ├── dashboard/         # Métricas, KPIs y alertas de monitoreo
    ├── denuncias/         # Formulario de denuncias multi-step
    ├── casos/             # Bandeja de expedientes con flujo Kanban
    ├── victimas/          # Historial clínico y timeline de evolución
    ├── citas/             # Calendario de citas psicosociales/legales
    ├── evidencias/        # Bóveda digital de archivos con previsualizador
    ├── reportes/          # Visualización de analíticas y gráficos SVG
    ├── auditoria/         # Logs de acciones de usuario y seguridad
    └── configuracion/     # Ajustes y simulación de reglas del sistema
```

---

## 🔐 Simulador de Autenticación y Roles
Para facilitar la evaluación visual del portal sin requerir bases de datos o APIs activas, el componente de inicio de sesión incorpora un **detector automático de roles por palabra clave**:

Al ingresar credenciales en el [login](file:///c:/Users/user/Documents/CICLO7/WEB%20INTEGRADO/ProyectoFinal/safezone-frontend/src/app/features/auth/login/login.component.ts), el sistema detecta el usuario y configura el panel y navegación correspondientes:

| Usuario de Prueba / Palabra Clave | Rol Activado |
| :--- | :--- |
| `admin` / `admin_safezone` | **Administrador** |
| `psic` / `cabrera` / `rojas` | **Psicólogo** |
| `recep` / `lima` | **Recepcionista** (Default) |
| `defens` / `legal` / `abog` | **Defensor Legal** |
| `vict` / `maria` | **Víctima** |
| `soport` / `tec` | **Soporte Técnico** |

*Nota: Una vez dentro del panel, se puede alternar el rol de manera dinámica en tiempo real utilizando el selector de la barra superior.*

---

## 🚀 Comandos de Desarrollo

### Instalar Dependencias
```bash
npm install
```

### Servidor de Desarrollo
Para levantar el servidor local en `http://localhost:4200/`:
```bash
npm start
# o alternativamente: npx ng serve
```

### Compilar para Producción
Para validar y compilar el proyecto optimizado en la carpeta `dist/`:
```bash
npm run build
```

### Pruebas Unitarias
Para correr la suite de pruebas unitarias configuradas con **Vitest**:
```bash
npm run test
```
