# Lista de perros 🐶

La idea de este proyecto es dar un pequeño repaso sobre conexiones a una API y sobre eventos. Es una pequeña aplicación web que muestra imágenes de perros aleatorias (obtenidas desde [dog.ceo](https://dog.ceo/dog-api/)) y permite marcarlas como "me gusta" o "no me gusta".

Este repositorio es la **base de trabajo** para la Evaluación Parcial N°1 de Ingeniería DevOps (DOY0101). A partir de este punto, cada pareja debe construir su propio flujo de trabajo colaborativo aplicando Git, GitHub y GitHub Actions.

---

## 🚀 Cómo levantar el proyecto localmente

No requiere instalación de dependencias. Basta con abrir `index.html` en el navegador, o servirlo con cualquier servidor estático simple, por ejemplo:

```bash
npx serve .
```

---

## 🌳 Estrategia de ramificación

Se optó por **GitFlow** en lugar de Trunk-Based Development.

Justificación: aunque el proyecto es pequeño y el equipo es de una sola persona (ver sección Autores), el objetivo de esta evaluación es precisamente practicar un flujo con roles bien diferenciados por rama (integración vs. producción vs. cambios en curso), algo que GitFlow modela de forma explícita:

- `main` refleja siempre el estado estable/productivo de la app.
- `develop` es la rama de integración donde conviven los cambios ya terminados antes de promoverlos a producción.
- Cada `feature/<nombre>` aísla un cambio funcional en desarrollo, sin afectar `develop` hasta que está listo y pasó su propia revisión (PR).
- `hotfix/<nombre>` permite corregir un bug de producción directamente desde `main`, sin arrastrar cambios a medio terminar que puedan estar en `develop`.

Trunk-Based Development habría sido razonable si el equipo fuera más grande y necesitara integrar cambios muy frecuentemente (varias veces al día) con ramas de vida muy corta. Para el ritmo de esta evaluación (features puntuales, revisadas una por una), GitFlow da más trazabilidad: cada rama documenta por sí sola qué tipo de cambio contiene y en qué etapa del ciclo está.

---

## 📝 Convenciones de commits

Se usa el formato de **Conventional Commits**: `<tipo>: <resumen breve>`, seguido de un cuerpo que explica **qué** cambia y **por qué**.

Tipos usados en este repo:
- `feat:` una funcionalidad nueva (ej. `feat: agrega contador de likes y dislikes en pantalla`)
- `fix:` corrección de un bug (ej. `fix: maneja errores de red al obtener un perrito aleatorio`)
- `ci:` cambios de integración continua (ej. `ci: agrega workflow básico de validación con GitHub Actions`)
- `merge:` resolución de conflictos de fusión

Se eligió este formato porque permite entender el propósito de un commit solo con leer su primera línea, sin tener que abrir el diff — algo que la pauta de esta evaluación pide explícitamente ("commits que sean descriptivos").

---

## 🔀 Convenciones de naming de ramas

- `main` — código en producción.
- `develop` — integración de cambios ya terminados.
- `feature/<nombre-descriptivo>` — una funcionalidad nueva y autocontenida (ej. `feature/contador-likes`, `feature/reiniciar-historial`).
- `hotfix/<nombre-descriptivo>` — corrección urgente sobre producción (ej. `hotfix/manejo-error-fetch`).

El nombre después de la barra describe el *qué*, no el *quién* ni la fecha, para que cualquiera pueda entender el propósito de la rama sin más contexto.

---

## 🔍 Estrategia de revisión (Pull Requests)

Todo cambio (feature o hotfix) se integra mediante Pull Request, nunca con push directo a `develop` o `main`. Cada PR incluye:
- Qué cambia y por qué (secciones "Qué hace" / "Por qué" en la descripción).
- Un checklist de autorevisión (sintaxis válida, no rompe funcionalidad existente, probado manualmente en navegador).

Al trabajar en solitario (ver Autores), la revisión formal de un tercero se reemplaza por esta autorevisión estructurada antes de cada merge, más la validación automática del workflow de CI en los casos que aplica.

---

## ⚙️ Automatización (CI/CD)

Se configuró `.github/workflows/ci.yml`, que se dispara:
- En cada `push` a `develop`.
- En cada `pull request` hacia `main`.

El workflow corre dos validaciones:
1. `htmlhint` sobre `index.html` (con `.htmlhintrc` propio, que desactiva la regla `src-not-empty` porque el `<img src="">` vacío es intencional: el JS le asigna la URL de la foto en tiempo de ejecución).
2. `node --check` sobre `index.js`, para detectar errores de sintaxis antes de integrar el cambio.

Rol dentro de un proceso CI/CD real: esto simula el primer gate de un pipeline — antes de fusionar cualquier cambio hacia `main` (producción), se verifica automáticamente que el código no tenga errores evidentes. En un proyecto real este mismo punto se extendería con tests automatizados, linters más estrictos y, eventualmente, un paso de build/deploy.

---

## 📁 Estructura de carpetas

```
Lista-de-perros-eva-ea1/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .htmlhintrc
├── index.html
├── index.js
├── style.css
└── README.md
```

---

## 🧾 Bitácora de comandos Git

Resumen del flujo de trabajo aplicado (detalle completo en el historial de commits y Pull Requests del repositorio):

1. `git clone` del repositorio base entregado por el docente.
2. `gh repo fork` + `git remote set-url origin <fork>` — se trabajó sobre un fork propio para tener permisos de escritura completos.
3. `git checkout -b develop` desde `main` — rama de integración.
4. Por cada feature: `git checkout -b feature/<nombre>` desde `develop`, cambios, `git add`/`git commit` descriptivo, `git push -u origin <rama>`, `gh pr create` hacia `develop`, revisión con checklist, `gh pr merge`.
5. Para el hotfix: `git checkout -b hotfix/manejo-error-fetch` desde `main` (no desde `develop`, para no arrastrar cambios en curso), mismo ciclo de commit/push/PR pero apuntando a `main`, y luego un segundo PR del mismo branch hacia `develop` (back-merge) para no perder el fix ahí.
6. Ese back-merge generó conflictos en `index.js` y `style.css` porque ambas ramas agregaban código en zonas cercanas (listeners de botones, reglas CSS) sin pisarse funcionalmente — se resolvieron manteniendo ambos bloques y se documentó en el commit de merge.
7. PR de release `develop → main` para promover todo lo validado (features + CI) a producción, lo que además sirvió para demostrar el disparo del workflow por `pull_request` hacia `main`.

---

## 👥 Autores

- Jonathan Larraguibel — desarrollo completo (rúbrica permite trabajo individual para esta evaluación, según lo indicado por el docente en clase ante dificultades de coordinación de parejas).

---

## 🤖 Declaración de uso de Inteligencia Artificial

Para la ejecución de este proyecto, integré Claude Code (Anthropic) a mi flujo de trabajo como asistente de desarrollo. Me apoyé en la herramienta para generar fragmentos rápidos de HTML/CSS/JS, armar el esquema de GitHub Actions. Sin embargo, el control del proyecto, la validación exhaustiva antes de cada commit, las decisiones de diseño y la justificación de la estrategia de ramas son de mi autoría exclusiva tras refinar cada sugerencia. Tal como exige la evaluación, la reflexión personal posterior fue escrita 100% por mí, sin uso de IA.

---

## 🪞 Reflexión personal

El desarrollo de esta evaluación ha marcado un punto de inflexión en mi formación como desarrollador. En esta etapa de la carrera, el desafío ya no es solo lograr que el código funcione, sino aprender a gestionarlo e integrarlo como en un entorno profesional real.

Aplicar GitFlow de forma individual parecía un exceso al principio, pero resultó ser un gran ejercicio de disciplina técnica. Me obligó a planificar antes de programar y a entender el inmenso valor de aislar desarrollos (features) y emergencias (hotfixes). De hecho, resolver los conflictos manuales al hacer el back-merge desde main hacia develop fue la prueba empírica de por qué mantener este orden es vital para no perder trabajo.

Por otro lado, configurar las validaciones automáticas con GitHub Actions me permitió materializar el concepto de Integración Continua (CI). Ver cómo un pipeline asume las revisiones de sintaxis (HTML/JS) demuestra cómo la automatización nos libera para enfocarnos en la lógica del negocio.

Finalmente, aunque me apoyé en asistentes de código para agilizar la escritura, este proyecto me dejó una lección clara: las herramientas asisten, pero el criterio técnico no se delega. La estrategia de ramas, las convenciones estrictas y la resolución de conflictos dependieron enteramente de mi capacidad de análisis.

---

*Proyecto original: repaso de conexión a API y manejo de eventos en JavaScript. Adaptado como base para la Evaluación Parcial N°1, DOY0101 — Ingeniería DevOps.*
