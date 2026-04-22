"use client";

import { useEffect, useMemo, useState } from "react";
import RevealSection from "@/components/RevealSection";

/* ════════════════════════════ DATA ════════════════════════════ */

const AGENDA = [
  { time: "0:00–0:10", label: "De GPTs a IDEs: el analista programador", color: "#E85A1F" },
  { time: "0:10–0:35", label: "Cursor: modos, context + .cursorrules", color: "#5B52D5" },
  { time: "0:35–0:55", label: "Claude Code + agentes de terminal", color: "#00E5A0" },
  { time: "0:55–1:20", label: "GitHub Copilot: PRs, Actions, revisión", color: "#3A7BD5" },
  { time: "1:20–1:45", label: "Taller: dashboard.html financiero", color: "#D4AF4C" },
  { time: "1:45–2:00", label: "Demo + GitHub Pages + retrospectiva", color: "#22C55E" },
];

/* ¿Qué es un IDE? — datos */
const IDE_PANELS = [
  { id: "explorer", name: "Explorador de archivos", icon: "📁", color: "#3A7BD5", desc: "Árbol del proyecto. Click = abrir archivo. Pinta modificaciones con color (git)." },
  { id: "editor",   name: "Editor con syntax",       icon: "✎",  color: "#5B52D5", desc: "Colorea palabras clave, autocompleta, marca errores en rojo. Soporta muchos lenguajes." },
  { id: "terminal", name: "Terminal integrada",      icon: "▶",  color: "#00E5A0", desc: "Bash/PowerShell embebido. Corres python, pytest, git sin cambiar de ventana." },
  { id: "debugger", name: "Debugger",                icon: "🐞", color: "#E85A1F", desc: "Breakpoints, variables en vivo, paso-a-paso. No necesitas print() para entender errores." },
  { id: "git",      name: "Control de versiones",    icon: "⎇",  color: "#D4AF4C", desc: "Stage, commit, push, pull. Diff visual entre versiones. Branches con un clic." },
  { id: "ai",       name: "Panel de IA (nuevo)",     icon: "✦",  color: "#7B73E8", desc: "Chat con contexto del repo, Composer multi-archivo, agentes. Solo IDEs modernos (Cursor, VS Code + Copilot)." },
];

const IDE_TIMELINE = [
  { year: "1971", name: "ed (Unix)",   desc: "Editor de línea. Pura CLI.",               color: "#555" },
  { year: "1991", name: "Notepad",     desc: "Solo texto. Sin color. Sin autocompletado.", color: "#7a82a0" },
  { year: "2003", name: "Eclipse",     desc: "Primer IDE masivo: debugger + refactor.",    color: "#5B52D5" },
  { year: "2015", name: "VS Code",     desc: "Editor ligero + ecosistema de extensiones.", color: "#3A7BD5" },
  { year: "2021", name: "Copilot",     desc: "Autocompletado con GPT dentro de VS Code.",  color: "#22C55E" },
  { year: "2023", name: "Cursor",      desc: "Fork de VS Code con IA en cada capa.",       color: "#00E5A0" },
  { year: "2026", name: "Cursor + Claude Code", desc: "Agentes que editan, prueban, commitean.", color: "#E85A1F" },
];

const IDE_VS = [
  { cat: "Autocompletado", editor: "Ninguno o básico", ide: "Contexto del archivo", aiide: "Contexto de todo el repo + multi-archivo" },
  { cat: "Errores",         editor: "Los ves al correr", ide: "Marcados en rojo mientras escribes", aiide: "Explicados + solución sugerida" },
  { cat: "Refactor",        editor: "Find & replace manual", ide: "Rename symbol seguro", aiide: "‘renombra y propaga a tests’ con lenguaje natural" },
  { cat: "Git",             editor: "Terminal externa", ide: "Panel visual con diff", aiide: "Mensaje de commit sugerido + PR auto" },
  { cat: "Onboarding",      editor: "Horas leyendo código", ide: "Go-to-definition + outline", aiide: "‘explícame cómo funciona este módulo’ en 20s" },
];

/* Primer ejercicio guiado — más pedagógico que los 3 labs */
const PRIMER_EJERCICIO_STEPS = [
  {
    n: 1,
    title: "Instalar Cursor",
    what: "Descarga Cursor desde cursor.com (gratis con trial de Pro). Disponible para macOS, Windows y Linux. Peso: ~250 MB.",
    ui: "download",
    tip: "Si ya usas VS Code, Cursor importa tus extensiones y settings en 1 clic — cero fricción.",
    code: null,
    keypress: null,
  },
  {
    n: 2,
    title: "Abrir una carpeta nueva",
    what: "Crea en tu disco una carpeta btg-portafolio/. En Cursor: File → Open Folder → selecciónala. El sidebar izquierdo mostrará el Explorador vacío.",
    ui: "welcome",
    tip: "Regla de oro: una carpeta = un proyecto = un repo git. Nunca abras tu home completo.",
    code: null,
    keypress: null,
  },
  {
    n: 3,
    title: "Crear tu primer archivo",
    what: "En el Explorador, click derecho → New File → portafolio.py. Archivo vacío en el editor.",
    ui: "newfile",
    tip: "Nómbralo siempre con extensión. Cursor detecta el lenguaje por la extensión (.py → Python).",
    code: "# portafolio.py",
    keypress: null,
  },
  {
    n: 4,
    title: "Tab Completion · dejar que Cursor complete",
    what: "Escribe solo 'def calcular_retorno(' y presiona Enter. Cursor sugerirá un cuerpo completo de función basado en el nombre. Acepta con Tab.",
    ui: "tab",
    tip: "Tab = aceptar. Esc = rechazar. Si rechazas, Cursor aprende del contexto y vuelve a sugerir mejor.",
    code: `def calcular_retorno(precio_inicial, precio_final):
    """Retorna el retorno porcentual entre dos precios."""
    return (precio_final - precio_inicial) / precio_inicial * 100`,
    keypress: "Tab",
  },
  {
    n: 5,
    title: "Cursor Chat · preguntarle al código",
    what: "Presiona ⌘+L (Mac) o Ctrl+L (Win). Se abre un chat lateral. Pregunta: '¿Qué hace esta función? ¿Cómo la pruebo con los precios de Ecopetrol de enero a marzo?'",
    ui: "chat",
    tip: "El chat ve el archivo abierto automáticamente. No necesitas pegar el código.",
    code: null,
    keypress: "⌘ + L",
  },
  {
    n: 6,
    title: "Composer · pedir cambios multi-archivo",
    what: "Presiona ⌘+I. Se abre Composer. Prompt: 'Añade una función calcular_retorno_portafolio que reciba lista de activos con peso y retorno, y devuelva el retorno ponderado. Crea también test_portafolio.py con 3 casos.'",
    ui: "composer",
    tip: "Composer planea antes de editar. Siempre revisa el diff propuesto antes de aceptar.",
    code: null,
    keypress: "⌘ + I",
  },
  {
    n: 7,
    title: "Correr el script en la terminal integrada",
    what: "View → Terminal (o ⌃+`). Escribe: python portafolio.py. Ves el output abajo. Luego pytest test_portafolio.py — Cursor te muestra pass/fail con colores.",
    ui: "terminal",
    tip: "La terminal hereda el Python del proyecto. Si falla, pídele a Cursor Chat: 'arregla este error'.",
    code: `$ python portafolio.py
Retorno Ecopetrol Q1: 4.21%
$ pytest test_portafolio.py
======== 3 passed in 0.08s ========`,
    keypress: "⌃ + `",
  },
  {
    n: 8,
    title: "Commit con mensaje generado por IA",
    what: "Source Control panel (⌃+⇧+G). Click en Generate Commit Message con ✦. Cursor propone: 'feat: add portfolio return calculation with tests'. Commit + push.",
    ui: "git",
    tip: "El mensaje sigue Conventional Commits automáticamente. Úsalo para mantener histórico limpio.",
    code: "feat: add portfolio return calculation with tests",
    keypress: "⌃ + ⇧ + G",
  },
];

const OBJETIVOS = [
  { icon: "◉", title: "Cursor como IDE con IA", detail: "Chat contextual sobre todo el repo, Composer multi-archivo, Agent mode autónomo." },
  { icon: "🤖", title: "Claude Code en terminal", detail: "Agentes de ingeniería que editan, compilan y prueban sin abandonar la CLI." },
  { icon: "⚡", title: "GitHub Copilot pro", detail: "Autocomplete + PR reviews + Actions + documentación generada desde lenguaje natural." },
  { icon: "📊", title: "Dashboard financiero HTML", detail: "Un archivo .html autocontenido con Chart.js, Tailwind y datos del portafolio." },
  { icon: "🎯", title: "Criterio de uso", detail: "Saber cuándo abrir Cursor, cuándo Claude Code y cuándo solo Copilot." },
];

const CURSOR_MODES = [
  {
    id: "chat",
    name: "Chat",
    icon: "💬",
    color: "#3A7BD5",
    desc: "Conversación lateral con acceso al archivo abierto. Útil para preguntas puntuales, refactor local, explicación de código.",
    trigger: "⌘ + L · selecciona un archivo o bloque",
    btg: "Explicar un script legacy de portafolios, generar 3 variantes de una fórmula de volatilidad anualizada.",
  },
  {
    id: "composer",
    name: "Composer",
    icon: "📝",
    color: "#5B52D5",
    desc: "Modo multi-archivo: el modelo planea y edita varios archivos a la vez. Ideal para features, refactors y migraciones.",
    trigger: "⌘ + I · describe el cambio deseado",
    btg: "'Añade manejo de errores + logging a los 6 módulos del pipeline de P&L diario'.",
  },
  {
    id: "agent",
    name: "Agent",
    icon: "🤖",
    color: "#00E5A0",
    desc: "Agente autónomo: planifica, ejecuta comandos (pip install, tests, git), corrige errores y entrega el feature terminado.",
    trigger: "⌘ + I → toggle Agent",
    btg: "'Crea un repo nuevo con FastAPI + endpoint /precios que consuma yfinance, añade tests y un Dockerfile'.",
  },
  {
    id: "inline",
    name: "Inline Edit",
    icon: "✦",
    color: "#E85A1F",
    desc: "Edición dentro del archivo abierto sin abrir chat. Selecciona código, describes el cambio, ves diff inline.",
    trigger: "⌘ + K · selección + prompt corto",
    btg: "Selecciona una función mal nombrada, ⌘+K 'renombra y añade docstring PEP257'.",
  },
  {
    id: "tab",
    name: "Tab completion",
    icon: "⇥",
    color: "#D4AF4C",
    desc: "Autocompletado agresivo: predice bloques completos, no solo la siguiente línea. Acepta con Tab, rechaza con Esc.",
    trigger: "Tab · mientras escribes",
    btg: "Escribe 'def calcular_var(' y Cursor sugiere la función completa con historical VaR y paramétrico.",
  },
];

const CURSOR_RULES = `# .cursorrules — BTG Pactual · Portafolio Analytics

Eres un analista cuantitativo senior de BTG Pactual Colombia.

# Stack obligatorio
- Python 3.11 · pandas · plotly · yfinance · openpyxl · FastAPI
- snake_case para funciones · SCREAMING_SNAKE para constantes
- Moneda base: COP · validar tipos en todos los inputs
- Tests: pytest con fixtures · coverage mínimo 80%
- Comentarios en español · docstrings en inglés (PEP257)

# Convenciones de dominio
- DataFrames con columnas: [ticker, precio, peso, retorno_30d, vol_anual]
- Fechas siempre en ISO 8601 (YYYY-MM-DD)
- Nunca hardcodear tickers — leerlos de config.yaml
- Jamás loggear datos de cliente · usar mask_pii() en toda traza

# Salidas
- Funciones puras cuando sea posible · efectos laterales aislados
- Manejo de errores con try/except específico · nunca Exception genérico
- Si el usuario pide un gráfico → devolver plotly.Figure · no plt
`;

const CLAUDE_CODE = [
  { step: "Arranque", cmd: "claude", out: "Sesión interactiva en la raíz del repo. Lee CLAUDE.md para instrucciones de proyecto.", color: "#E85A1F" },
  { step: "Plan", cmd: "> Implementa VaR histórico y paramétrico en analisis_riesgo.py", out: "Claude explora el repo, propone plan con 5 pasos y pide confirmación.", color: "#5B52D5" },
  { step: "Ejecuta", cmd: "✓ read portafolio.py  ✓ write analisis_riesgo.py  ✓ pytest -k riesgo", out: "Edita archivos, corre tests, corrige en iteraciones autónomas.", color: "#00E5A0" },
  { step: "Commit", cmd: "> Ok, haz commit con mensaje conventional", out: "git add + commit convencional: 'feat(riesgo): añade VaR histórico y paramétrico'.", color: "#D4AF4C" },
  { step: "Revisa", cmd: "> Genera resumen de la sesión para el PR", out: "Markdown con diff summary, tests añadidos, coverage y follow-ups sugeridos.", color: "#3A7BD5" },
];

const COPILOT_CAPS = [
  { id: "complete", tag: "Autocomplete", name: "Copilot in editor", color: "#3A7BD5", icon: "✦", desc: "Sugerencias de línea y bloque dentro de VS Code, JetBrains, Visual Studio, Neovim. Hoy soporta Claude, GPT-5 y modelos propios.", btg: "Escribir scripts de ETL de precios en 40% menos tiempo." },
  { id: "chat", tag: "Copilot Chat", name: "Chat contextual", color: "#5B52D5", icon: "💬", desc: "Pestaña lateral con el repo como contexto. Resuelve preguntas sobre código, arquitectura, tests, dependencias.", btg: "'¿Qué función genera el reporte diario de P&L?' — Copilot explica con links al archivo." },
  { id: "pr", tag: "Copilot PR", name: "Pull Request reviewer", color: "#22C55E", icon: "◈", desc: "Resume el PR, detecta bugs, sugiere tests faltantes, propone descripción y checklist antes del merge.", btg: "Cada PR a main llega con summary generado + 3 sugerencias de mejora." },
  { id: "actions", tag: "Copilot Actions", name: "GitHub Actions en lenguaje natural", color: "#E85A1F", icon: "⚙", desc: "Describe el CI/CD deseado y Copilot genera el YAML. Desde tests hasta deploy a GitHub Pages.", btg: "'Cada push a main corre pytest + valida con mypy + despliega dashboard.html a Pages'." },
  { id: "docs", tag: "Copilot Docs", name: "Documentación automática", color: "#D4AF4C", icon: "📘", desc: "Genera README, docstrings, comentarios inline y páginas de docs.md basado en el código real del repo.", btg: "README completo con badges, quickstart y ejemplos en 30s." },
  { id: "cli", tag: "Copilot CLI", name: "Terminal asistida", color: "#7B73E8", icon: "▶", desc: "gh copilot suggest — traduce intención a comandos shell, git o gh sin buscar en Stack Overflow.", btg: "'Crea un branch feature/var, commitea los cambios y abre PR asignado al MD'." },
];

const GIT_FLOW = [
  { n: 1, stage: "Branch", action: "git switch -c feature/analisis-riesgo", gloss: "Nunca se trabaja sobre main. Un branch por feature o análisis." },
  { n: 2, stage: "Commits", action: "git commit -m 'feat(riesgo): añade VaR histórico'", gloss: "Conventional commits: feat / fix / docs / refactor. Auditable en auditoría interna." },
  { n: 3, stage: "Push", action: "git push -u origin feature/analisis-riesgo", gloss: "Sube el branch. El origin es GitHub Enterprise BTG — no github.com público." },
  { n: 4, stage: "PR", action: "gh pr create --fill", gloss: "Copilot genera título, descripción, checklist. Asigna reviewers automáticamente por CODEOWNERS." },
  { n: 5, stage: "CI", action: ".github/workflows/ci.yml", gloss: "GitHub Action corre tests, linting, type-check. Copilot escribió el YAML por ti." },
  { n: 6, stage: "Review", action: "Copilot PR review + humano", gloss: "Copilot deja comentarios iniciales, un senior valida. Merge con squash." },
  { n: 7, stage: "Deploy", action: "Action → GitHub Pages", gloss: "dashboard.html disponible en URL pública o interna — shareable con MDs." },
];

const DASHBOARD_PROMPT = `Crea un archivo dashboard.html autocontenido (sin servidor) para un
dashboard de portafolio de inversión de BTG Pactual Colombia.

Requisitos:
- Usa Chart.js 4.x desde CDN para los gráficos
- Usa Tailwind CSS desde CDN para los estilos
- Paleta de colores: negro (#000), gris oscuro (#1a1a1a), gris medio
  (#555), blanco (#fff). Sin colores corporativos externos.
- Los datos del portafolio van en un objeto JS al inicio del script
- Incluir: gráfico de dona (composición %), barras horizontales
  (retorno 30d), tabla con ticker, nombre, peso %, precio,
  retorno_30d, retorno_90d, volatilidad
- KPIs en cards: retorno portafolio 30d, volatilidad ponderada,
  Sharpe ratio aproximado
- Totalmente responsive. Funciona al abrir en browser sin conexión
  (solo CDN)
- Comentarios en español explicando cada sección`;

const DASHBOARD_PORTFOLIO = [
  { ticker: "ECO",  name: "Ecopetrol",        peso: 22, precio: 2140, r30: 4.2,  r90: 9.1,  vol: 28 },
  { ticker: "PFB",  name: "Bancolombia PFB",  peso: 18, precio: 29540, r30: 2.1, r90: 6.4,  vol: 22 },
  { ticker: "GEB",  name: "Grupo Energía B.", peso: 15, precio: 2310, r30: 1.8,  r90: 5.2,  vol: 17 },
  { ticker: "NUTR", name: "Grupo Nutresa",    peso: 14, precio: 56200, r30: -1.3, r90: 3.1, vol: 19 },
  { ticker: "ISA",  name: "ISA",              peso: 17, precio: 18420, r30: 3.6, r90: 8.4,  vol: 21 },
  { ticker: "CEM",  name: "Cementos Argos",   peso: 14, precio: 3520,  r30: -0.4, r90: 2.3, vol: 24 },
];

type S6Step = { n: number; action: string; detail: string; output: string };
type S6Exercise = {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  duration: string;
  color: string;
  accent: string;
  icon: string;
  tool: string;
  objective: string;
  prereq: string;
  steps: S6Step[];
  evidence: string[];
  common: { ok: string; trap: string };
};

const EJERCICIOS: S6Exercise[] = [
  {
    id: "ex1",
    tag: "Ejercicio 1",
    title: "Cursor + .cursorrules para análisis financiero",
    subtitle: "IDE con IA productivo desde el primer commit",
    duration: "15 min",
    color: "#5B52D5",
    accent: "#7B73E8",
    icon: "◈",
    tool: "Cursor + Claude Sonnet 4.6",
    objective: "Configurar Cursor como IDE principal y producir portafolio.py con manejo de errores, tipos y tests — en menos de 15 minutos.",
    prereq: "Cursor instalado · cuenta gratis Cursor Pro Trial · Python 3.11 local · carpeta btg-portafolio/ vacía.",
    steps: [
      { n: 1, action: "Crear proyecto + .cursorrules", detail: "mkdir btg-portafolio && cd btg-portafolio && cursor . — dentro del editor crea .cursorrules y pega las reglas de dominio BTG (stack, convenciones, moneda).", output: ".cursorrules de 14 líneas cargado al contexto automáticamente" },
      { n: 2, action: "Abrir Composer ⌘+I", detail: "Prompt: 'Crea portafolio.py con una clase Portafolio que tome lista de dicts {ticker, peso, precio}, valide pesos, calcule valor total y retornos. pytest en tests/test_portafolio.py'.", output: "2 archivos creados · tests + clase · 180 LOC" },
      { n: 3, action: "Correr los tests", detail: "En terminal integrado: pytest -v. Si algún test falla, Cursor detecta el error y ofrece fix. Agent Mode puede resolverlo sin intervención.", output: "6 passed in 0.12s · coverage 94%" },
      { n: 4, action: "Inline edit ⌘+K", detail: "Selecciona la función calcular_retorno, ⌘+K 'añade validación de fechas y soporte multi-moneda (COP, USD)'.", output: "Diff inline con 12 líneas añadidas · aceptar con Enter" },
      { n: 5, action: "Commit + push", detail: "git init && git add -A && git commit -m 'feat: clase Portafolio con tests'. git remote add origin <repo BTG>. git push.", output: "Repositorio inicial en GitHub BTG listo para PRs" },
    ],
    evidence: [
      "portafolio.py con docstrings y type hints",
      "tests/test_portafolio.py con 6+ casos incluyendo edge cases",
      ".cursorrules commiteado (el contexto viaja con el repo)",
    ],
    common: {
      ok: "Con .cursorrules cargado, el modelo respeta convenciones sin repetir prompts. Commitéalo en el repo.",
      trap: "No uses Agent Mode en repos productivos sin revisar diffs — siempre revisa antes de aceptar.",
    },
  },
  {
    id: "ex2",
    tag: "Ejercicio 2",
    title: "Claude Code para módulo de riesgo",
    subtitle: "Agente de terminal que edita + prueba + commitea",
    duration: "20 min",
    color: "#00E5A0",
    accent: "#22C55E",
    icon: "🤖",
    tool: "Claude Code (CLI)",
    objective: "Generar analisis_riesgo.py con VaR histórico, VaR paramétrico, CVaR y drawdown, todo con tests pasando y un PR con resumen automático.",
    prereq: "Claude Code instalado (npm install -g @anthropic-ai/claude-code) · API key Anthropic · repo del ejercicio 1.",
    steps: [
      { n: 1, action: "Abrir sesión Claude Code", detail: "En raíz del repo: claude. La CLI lee CLAUDE.md si existe — crea uno con contexto del dominio financiero.", output: "Sesión interactiva lista · Claude ya leyó portafolio.py" },
      { n: 2, action: "Pedir el feature", detail: "'Implementa analisis_riesgo.py con VaR histórico 95%, VaR paramétrico, CVaR y drawdown máximo. Usa numpy + pandas. Tests en tests/test_riesgo.py.'", output: "Plan de 6 pasos mostrado · solicita confirmación" },
      { n: 3, action: "Observar edición autónoma", detail: "Claude escribe el módulo, crea tests, corre pytest. Si algún test falla, entra en loop de corrección hasta verde.", output: "✓ 9 passed · coverage 91% · 280 LOC nuevas" },
      { n: 4, action: "Review + merge", detail: "git diff — revisa los cambios. Pide a Claude: 'Haz un branch feature/riesgo, commitea y abre el PR con descripción completa'.", output: "PR #12 creado con título, descripción, checklist y labels" },
      { n: 5, action: "Session summary", detail: "Pide: 'Resume la sesión en markdown con decisiones arquitectónicas, cobertura y follow-ups sugeridos'.", output: "SESSION.md en /docs · listo para onboarding del equipo" },
    ],
    evidence: [
      "analisis_riesgo.py con 4 funciones de riesgo documentadas",
      "tests/test_riesgo.py con 9+ casos (edge: serie vacía, NaN, un solo dato)",
      "PR #12 abierto con descripción generada por Claude Code",
    ],
    common: {
      ok: "Claude Code corre tests automáticamente después de cada edición. Si quieres más velocidad → pídele no correr tests y tú los corres al final.",
      trap: "No le des acceso a producción o branches protegidos — configúralo en modo read-only fuera de tu branch.",
    },
  },
  {
    id: "ex3",
    tag: "Ejercicio 3",
    title: "Dashboard financiero + GitHub Pages",
    subtitle: "HTML inteligente + CI/CD generado por Copilot",
    duration: "25 min",
    color: "#D4AF4C",
    accent: "#E85A1F",
    icon: "📊",
    tool: "Cursor + GitHub Copilot + Pages",
    objective: "Producir dashboard.html autocontenido con Chart.js + Tailwind + 6 activos, y desplegarlo a GitHub Pages mediante GitHub Action generada por Copilot.",
    prereq: "Repositorio del ejercicio 1 + 2 · GitHub Copilot activo · permisos de GitHub Pages en el repo BTG.",
    steps: [
      { n: 1, action: "Prompt a Cursor Composer", detail: "Pega el prompt completo (ver bloque inferior) con paleta negro/gris/blanco, Chart.js CDN, Tailwind CDN, datos inline del portafolio.", output: "dashboard.html de ~340 LOC con 3 gráficos + tabla + 3 KPIs" },
      { n: 2, action: "Abrir local + validar", detail: "open dashboard.html en navegador. Verificar: dona proporcional, barras con signo correcto, tabla ordenable, responsive en móvil.", output: "Render correcto en desktop y mobile · zero errores consola" },
      { n: 3, action: "Copilot PR review", detail: "Commit → push → abrir PR. Copilot deja 3 comentarios: accesibilidad (alt text), semántica (<thead>), y una mejora de performance (defer en CDN scripts).", output: "PR con 3 sugerencias + resumen automático generado" },
      { n: 4, action: "Generar GitHub Action", detail: "Archivo vacío .github/workflows/pages.yml. Prompt a Copilot: 'Workflow que en cada push a main despliegue dashboard.html a GitHub Pages'.", output: "pages.yml de 18 líneas con actions/upload-pages-artifact + deploy-pages" },
      { n: 5, action: "Deploy + share", detail: "Merge del PR → Action corre en 25s → URL pública generada. Compartir al canal de Teams IB con un clic.", output: "https://btg.github.io/portafolio-analytics · dashboard live" },
    ],
    evidence: [
      "dashboard.html funcionando sin backend ni build step",
      ".github/workflows/pages.yml generado por Copilot",
      "URL de GitHub Pages activa compartida con stakeholders",
    ],
    common: {
      ok: "Un HTML autocontenido es la forma más rápida de hacer demos a MDs — no requiere deploy ni auth.",
      trap: "No pongas datos reales de clientes en un HTML público — usa GitHub Pages privadas o mock data.",
    },
  },
];

const COMPARATIVA = [
  {
    tool: "Cursor",
    color: "#5B52D5",
    icon: "◈",
    when: "Proyectos nuevos · greenfield · features completos",
    pros: ["Context del repo completo", "Composer multi-archivo", "Agent mode autónomo", "Modelos múltiples (Claude, GPT)"],
    cons: ["Licencia aparte ($20/mes)", "Curva de aprendizaje de atajos"],
    fit: "Analista que escribe código nuevo cada semana · equipo quant.",
  },
  {
    tool: "Claude Code",
    color: "#00E5A0",
    icon: "🤖",
    when: "Tareas operativas · refactors · tests · PRs",
    pros: ["Vive en la terminal", "Edita + prueba + commitea", "CLAUDE.md persistente", "Modo read-only por defecto en branches protegidos"],
    cons: ["Requiere comodidad con terminal", "API key separada (cuota)"],
    fit: "Analista/dev que opera muchos repos y tareas de mantenimiento.",
  },
  {
    tool: "GitHub Copilot",
    color: "#3A7BD5",
    icon: "✦",
    when: "Día a día · PRs · Actions · docs en repos ya existentes",
    pros: ["Integrado a VS Code/JetBrains", "PR review automático", "Actions en lenguaje natural", "Modelos múltiples (GPT-5, Claude, propios)"],
    cons: ["Menos contexto que Cursor", "Menos autonomía que Claude Code"],
    fit: "Todo el equipo · default corporativo · rige sobre Copilot Chat + PR review.",
  },
];

const ENTREGABLES = [
  { n: 1, item: "portafolio.py", detail: "Clase con validación, tipos, docstrings PEP257 y manejo de errores." },
  { n: 2, item: "analisis_riesgo.py", detail: "VaR histórico + VaR paramétrico + CVaR + drawdown con tests." },
  { n: 3, item: "dashboard.html", detail: "Dashboard autocontenido con 6 activos, KPIs, dona, barras, tabla y exportar CSV." },
  { n: 4, item: "Repo GitHub profesional", detail: "README + PR con descripción Copilot + GitHub Action de validación." },
  { n: 5, item: "URL GitHub Pages", detail: "Dashboard activo público o privado-BTG, compartible por enlace." },
  { n: 6, item: "Reflexión 150 palabras", detail: "¿Qué tareas de tu área en BTG podrían automatizarse con este stack?" },
];

/* ════════════════════════════ ECOSISTEMA · PANORAMA ABRIL 2026 ════════════════════════════ */

const ECOSISTEMA_CATS = [
  {
    id: "ide_ai",
    name: "IDEs AI-first",
    icon: "◈",
    color: "#5B52D5",
    headline: "Editores diseñados alrededor de la IA",
    desc: "El chat, el agente y el tab-completion son parte del núcleo — no plugins. Son la apuesta más fuerte del mercado en 2026.",
  },
  {
    id: "ide_plugin",
    name: "IDE clásico + asistente IA",
    icon: "⊕",
    color: "#3A7BD5",
    headline: "La IA entra como extensión",
    desc: "Si tu equipo vive en IntelliJ, CLion, VS Code o AWS, la IA se suma sin cambiar el flujo. Usual en bancos con stack corporativo.",
  },
  {
    id: "chat",
    name: "Chats & agentes",
    icon: "💬",
    color: "#00D4E5",
    headline: "Conversación libre y autonomía",
    desc: "Desde chat puntual hasta agentes que reciben un ticket de Jira y devuelven un PR. El front-door de la IA generativa.",
  },
  {
    id: "data_doc",
    name: "Datos, docs & diseño",
    icon: "◉",
    color: "#D4AF4C",
    headline: "Conectores del mundo real",
    desc: "Bases de datos, PDFs complejos, mockups de Figma: todo lo que no es código puro pero hay que consumir desde IA.",
  },
  {
    id: "automation",
    name: "Automatización & orquestación",
    icon: "⚡",
    color: "#E85A1F",
    headline: "Pegamento entre sistemas",
    desc: "Módulo 03. Cuando la IA deja de ser una ventana y pasa a ser un componente dentro de un workflow empresarial.",
  },
];

type EcoTool = {
  id: string;
  name: string;
  vendor: string;
  cat: string;
  logo: string;
  tagline: string;
  detail: string;
  btg: string;
  example: string;
  price: string;
  status: "core" | "pro" | "corporate" | "emerging" | "local" | "open" | "next-module" | "sunset";
};

const ECOSISTEMA_TOOLS: EcoTool[] = [
  /* IDEs AI-first */
  {
    id: "cursor", name: "Cursor", vendor: "Anysphere (USA)", cat: "ide_ai", logo: "▲",
    tagline: "Fork de VS Code con IA en cada capa.",
    detail: "Tab completion con todo el repo como contexto, Composer multi-archivo y Agent mode autónomo. Mezcla Claude 4.7, GPT-5.3-Codex, Gemini 3 Pro. Desde junio 2025 usa modelo de créditos: cada plan trae un pool mensual en USD equivalente al precio.",
    btg: "Feature nuevo desde cero · refactor de repos legacy · onboarding rápido de analistas nuevos.",
    example: "Abril 2026 · un analista de renta fija pide: 'añade optimización Markowitz al módulo portafolio.py y escribe tests'. Composer planea, edita 4 archivos y corre pytest en 6 min.",
    price: "Hobby gratis · Pro USD 20 · Pro+ USD 60 · Ultra USD 200 · Teams USD 40/user",
    status: "core",
  },
  {
    id: "claude-code", name: "Claude Code (CLI + VS Code)", vendor: "Anthropic (USA)", cat: "ide_ai", logo: "◆",
    tagline: "Agente de ingeniería con memoria, skills y hooks.",
    detail: "Claude Opus 4.7 con contexto 1M. Skills (carpetas con SKILL.md reutilizables), hooks que disparan en eventos del IDE, worktrees con un comando, PreCompact hooks para bloquear compactación. CLI + extensión VS Code. Background plugin monitors para agentes paralelos.",
    btg: "Auditorías sobre muchos repos · runbooks automáticos · tareas largas sin supervisión · scripts ad-hoc sobre data warehouse.",
    example: "Abril 2026 · 'audita 9 repos de microservicios por CVEs abiertos, genera reporte markdown con recomendaciones'. Claude Code corre 25 min solo y regresa con PR propuesto por repo.",
    price: "Incluido en Claude Max USD 100/mes · API pago-por-uso · Claude Pro USD 20 con límites",
    status: "core",
  },
  {
    id: "kiro", name: "Kiro", vendor: "Amazon Web Services", cat: "ide_ai", logo: "△",
    tagline: "IDE AI-first de AWS con workflow por specs.",
    detail: "Spec-driven development: describes el feature en lenguaje natural → Kiro genera requirements.md, architecture.md, test plan y recién después el código. Hooks event-driven (on save, PR open). Routea entre Claude Sonnet (specs) y Amazon Nova (throughput) vía Bedrock. Estable desde ene 2026.",
    btg: "Microservicios en Lambda · migraciones a AWS · teams con Landing Zone ya montada · compliance trazable (specs versionados).",
    example: "Abril 2026 · un spec de 2 párrafos sobre endpoint de KYC genera requirements doc, plan arquitectónico y código Lambda + CDK + tests listos para merge.",
    price: "Free tier generoso · Pro desde USD 19/user (rollout 2026)",
    status: "emerging",
  },
  {
    id: "firebase-studio", name: "Firebase Studio", vendor: "Google", cat: "ide_ai", logo: "◇",
    tagline: "SUNSET 19-mar-2026 · migrar a AI Studio o Antigravity.",
    detail: "El IDE en navegador sucesor de Project IDX fue sunset el 19 de marzo de 2026. Workspaces existentes siguen accesibles hasta el 22-mar-2027, pero la creación de nuevos workspaces se desactiva el 22-jun-2026. Google movió la apuesta a AI Studio (vibe coding con Gemini 3) y Antigravity (agent-first).",
    btg: "Migrar proyectos vivos antes de jun-2026 · sustituir por Google AI Studio (rapid prototyping) o Antigravity (agent-first).",
    example: "Abril 2026 · cualquier proyecto nuevo que hubiera ido a Firebase Studio en 2025 hoy se abre en Antigravity o AI Studio — el runtime Firebase (Hosting, Functions) sigue vigente.",
    price: "Deprecated · usar AI Studio (gratis) o Antigravity (preview)",
    status: "sunset",
  },
  {
    id: "antigravity", name: "Google Antigravity", vendor: "Google", cat: "ide_ai", logo: "◉",
    tagline: "IDE agent-first con Gemini 3 Pro + Claude Opus 4.6 built-in.",
    detail: "Lanzado 18-nov-2025 junto a Gemini 3. No es un chatbot en sidebar: dos surfaces — Editor View (autocompletado + inline) y Manager Surface donde orquestas agentes en paralelo con navegador Chrome embebido. 76.2% en SWE-bench Verified. 6% de adopción global a abril 2026.",
    btg: "Tareas que se benefician de paralelismo — un agente documenta, otro prueba, otro implementa · POCs con multi-agente.",
    example: "Abril 2026 · un dev abre 3 agentes en paralelo desde Manager: uno escribe tests Jest, otro documenta con markdown, otro implementa un endpoint de pricing. Los ve avanzar asíncronos.",
    price: "Public preview gratis para individuos a abril 2026",
    status: "emerging",
  },

  /* IDE plugin */
  {
    id: "copilot-cli", name: "GitHub Copilot (IDE + CLI + coding agent)", vendor: "GitHub · Microsoft", cat: "ide_plugin", logo: "✦",
    tagline: "El default corporativo. Coding agent autónomo desde mar 2026.",
    detail: "Copilot en VS Code y JetBrains + `gh copilot suggest/explain` + Copilot Workspace + coding agent autónomo (determina qué archivos editar, corre terminal, itera sobre errores). Modelos seleccionables: GPT-5.3, Claude Opus 4.7, Gemini 3. Premium requests por plan.",
    btg: "Estándar del equipo · PRs con Copilot Code Review · audit trail empresarial · fixes de tests sin supervisión.",
    example: "Abril 2026 · abres un PR en GitHub Enterprise, Copilot Code Review comenta 12 líneas con sugerencias accionables y el coding agent corrige los tests rotos antes del merge.",
    price: "Free · Pro USD 10 · Pro+ USD 39 (1.500 premium reqs) · Business USD 19/user · Enterprise USD 39/user",
    status: "corporate",
  },
  {
    id: "gemini-code", name: "Gemini Code Assist", vendor: "Google Cloud", cat: "ide_plugin", logo: "★",
    tagline: "Plugin para VS Code, IntelliJ y Cloud Workstations.",
    detail: "Autocompletado con Gemini 3, chat contextual, scanning SAST, conectores directos a BigQuery y Cloud Storage. Tier gratis de 180k completions/mes (de los más generosos del mercado). Standard con retención de datos controlada y data residency.",
    btg: "Alternativa corporate-friendly a Copilot · equipos con stack GCP · compliance con residencia de datos por región.",
    example: "Abril 2026 · migración de un pipeline Python a Dataflow: Gemini Code Assist samplea datos reales desde BigQuery y ajusta la función de transformación según el schema actual.",
    price: "Gratis hasta 180k comp/mes · Standard USD 19/user · Enterprise custom",
    status: "corporate",
  },
  {
    id: "jetbrains-ai", name: "JetBrains AI Assistant + Junie", vendor: "JetBrains (Checa)", cat: "ide_plugin", logo: "◼",
    tagline: "IA nativa en IntelliJ, PyCharm, CLion. Junie CLI en beta mar 2026.",
    detail: "Chat contextual, edición multi-archivo y Junie (agent mode). Modelo-agnóstico: Claude, GPT, Gemini, local. Aprovecha el indexador semántico de JetBrains — el mejor para refactors tipados. Consumo basado en créditos: 1 AI Credit = USD 1. Junie CLI (beta mar 2026) opera desde terminal.",
    btg: "Quants en PyCharm · devs Kotlin/Java en IntelliJ · motores C++ en CLion. Refactors tipados sin romper el índice del proyecto.",
    example: "Abril 2026 · 'migra este risk engine a Python 3.13 y mueve a asyncio donde corresponda'. Junie consulta el índice, propone el refactor tipado, corre mypy y los tests.",
    price: "AI Pro USD 10/mes o USD 100/año · AI Ultimate USD 30/mes (USD 60/org) · créditos USD 1 c/u",
    status: "pro",
  },
  {
    id: "clion", name: "CLion", vendor: "JetBrains", cat: "ide_plugin", logo: "◾",
    tagline: "IDE profesional de C/C++ con AI Assistant.",
    detail: "Refactors tipados sobre C++20/23, CMake, Bazel. Integración con CUDA y toolchains remotas. Con AI Assistant: explicación de templates, generación de Catch2/GoogleTest, análisis de lifetimes.",
    btg: "Mesa cuantitativa con motores de pricing de baja latencia en C++ · risk engines tick-by-tick · análisis de performance con perf + flamegraphs.",
    example: "Abril 2026 · en el pricing engine, CLion + AI Assistant explica un template variadic de 80 líneas y genera Catch2 para cada especialización. El quant acepta 6 de 8 tests.",
    price: "USD 249/año Individual · USD 499/año Company · All Products Pack USD 779/año",
    status: "pro",
  },
  {
    id: "amazon-q", name: "Amazon Q Business + Developer", vendor: "AWS", cat: "ide_plugin", logo: "◧",
    tagline: "Asistente empresarial con RAG sobre datos internos.",
    detail: "Q Business indexa S3, SharePoint, Confluence, Jira, Gmail y responde preguntas con permisos heredados. Q Developer entra en VS Code/IntelliJ para código + transformación de legacy (Java 8 → 21, COBOL → Java, .NET upgrades). Pro trae IP indemnity, SSO, analytics.",
    btg: "Chatbot corporativo con procedimientos internos · transformación de mainframe legacy · auditoría IAM.",
    example: "Abril 2026 · Q Business responde 'cuáles son los pasos para aprobar un nuevo emisor' leyendo 340 pp de procedimientos en SharePoint con permisos heredados por rol.",
    price: "Q Business Lite USD 3/user · Q Business Pro USD 20/user · Q Developer Pro USD 19/user (1.000 agentic req + 4.000 LOC/mes)",
    status: "corporate",
  },

  /* Chats & agentes */
  {
    id: "chatgpt", name: "ChatGPT", vendor: "OpenAI", cat: "chat", logo: "◉",
    tagline: "Chat universal. Nuevo tier Pro USD 100/mes desde 9-abr-2026.",
    detail: "GPT-5.2 para general y GPT-5.3-Codex para coding/agentic. Canvas (edición de docs y código), Code Interpreter, Deep Research, conectores a Drive/SharePoint, ChatGPT Agent (tareas con navegador). Tier Pro USD 100 anunciado el 9-abr-2026 con 5× límites vs Plus y 10× Codex vs Plus hasta 31-may.",
    btg: "Análisis ad-hoc · memos financieros · presentaciones · drafts rápidos · agentes con navegador para investigación web.",
    example: "Abril 2026 · un AVP sube el Excel de comisiones a Code Interpreter: 'compara vs mes anterior, grafica outliers y dame memo de 1 página'. GPT-5.2 entrega en 90 s.",
    price: "Free (con ads) · Go USD 8 · Plus USD 20 · Pro USD 100 (nuevo abr 2026) · Pro USD 200",
    status: "core",
  },
  {
    id: "gemini", name: "Gemini (App + Workspace)", vendor: "Google", cat: "chat", logo: "✶",
    tagline: "Gemini 3 liberado 15-abr-2026. Nativo en Docs, Sheets, Slides.",
    detail: "Gemini 3 Pro en preview desde 15-abr-2026 y Gemini 3 Flash como default en la app. Gemini 3.1 Flash-Lite en preview (mar 2026). Contexto 2M tokens, Deep Think en Ultra para razonamiento profundo. Embebido en Workspace (Docs/Sheets/Slides/Gmail) y Chrome (Win/Mac).",
    btg: "Equipos en Google Workspace · análisis de Sheets muy grandes · síntesis de correos · research docs con citación.",
    example: "Abril 2026 · en Sheets de análisis de M&A con 200 targets, Gemini 3 identifica los 10 más alineados al thesis y genera ficha individual por cada uno.",
    price: "Gratis (app con Flash) · Google AI Pro USD 20/mes · Google AI Ultra USD 250/mes (Deep Think) · Workspace Business USD 24/user",
    status: "corporate",
  },
  {
    id: "ada", name: "ADA (Asistente Digital Avanzado)", vendor: "Plataforma interna (banca)", cat: "chat", logo: "◆",
    tagline: "Capa gobernada de IA generativa corporativa.",
    detail: "Patrón banca: orquestador propio que expone modelos de frontera (Claude, GPT, Gemini) con guardrails, masking de PII, logs de auditoría, control de costos y asignación por área. No es un modelo — es el control-tower. Único canal aprobado por seguridad para data P-II/III.",
    btg: "Único canal autorizado para data sensible · uniforma costos y controles entre áreas · registro y trazabilidad de prompts.",
    example: "Abril 2026 · un analista sube matriz de riesgo con datos de clientes. ADA la enruta a Claude con masking de PII automático. La respuesta llega anonimizada con log de auditoría.",
    price: "Licenciamiento interno · pass-through de tokens del modelo subyacente",
    status: "corporate",
  },
  {
    id: "devin", name: "Devin 2.0", vendor: "Cognition AI (USA)", cat: "chat", logo: "◎",
    tagline: "Devin 2.0 (abr 2025) bajó a USD 20/mes pay-as-you-go.",
    detail: "Agente de software autónomo con su propia VM (navegador, editor, terminal). Le asignas un ticket de Jira/Linear y devuelve un PR. 1 ACU ≈ 15 min de trabajo activo. Devin 2.0 (abril 2025) bajó el entry de USD 500 a USD 20/mes Core pay-as-you-go. Equipos grandes pagan Team USD 500/mes con 250 ACUs.",
    btg: "Offload de mantenimiento · upgrades de dependencias · bug-fixes menores · refactors mecánicos en lote.",
    example: "Abril 2026 · ticket 'sube pandas 2.0 → 2.3 en 11 repos'. Devin abre 11 PRs con tests verdes en 3 h. Costo ~12 ACUs × USD 2.25 = USD 27.",
    price: "Core USD 20/mes + USD 2.25/ACU · Team USD 500/mes (250 ACUs + USD 2/extra) · Enterprise VPC custom",
    status: "emerging",
  },
  {
    id: "notebooklm", name: "NotebookLM", vendor: "Google", cat: "chat", logo: "◐",
    tagline: "Research anclado a fuentes. Mindmaps + video overviews + quizzes.",
    detail: "Cargas PDFs, videos YouTube, audios, webs, Slides. NotebookLM responde solo con lo cargado y cita — anti-alucinación por diseño. Studio: audio overviews (9 idiomas), video overviews, mindmaps interactivos, slide decks, infográficos, quizzes, flashcards. Plus: +100 notebooks y >50 fuentes por notebook.",
    btg: "Due diligence · estudios sectoriales · síntesis de reportes · onboarding a sectores nuevos · compliance training.",
    example: "Abril 2026 · cargo 40 reportes sectoriales de utilities LatAm. Pido mindmap + audio overview en español. Resultado: síntesis auditada con citas para comité.",
    price: "Gratis · NotebookLM Plus USD 20/mes · incluido en Google AI Pro/Ultra",
    status: "open",
  },
  {
    id: "deepseek", name: "DeepSeek-V3.2 (local)", vendor: "DeepSeek AI (CN)", cat: "chat", logo: "◑",
    tagline: "Open weights con calidad frontera. Pensamiento + tool use integrados.",
    detail: "DeepSeek-V3.2 (dic 2025) es el flagship actual con DeepSeek Sparse Attention (DSA) para eficiencia, y es el primer modelo de la casa que integra thinking directamente con tool use. Performance comparable a GPT-5 en benchmarks. R2 especializado en razonamiento. Corre con Ollama, vLLM, SGLang.",
    btg: "Casos P-III+ donde no puede salir data · POCs on-prem · cargas masivas de resumen y clasificación a bajo costo.",
    example: "Abril 2026 · on-prem con 4 H100. Procesamos memos P-III con DeepSeek-V3.2 en Ollama — cero tokens salen de la red BTG, latencia ~350 ms/query.",
    price: "Open weights gratis · costo = infra GPU propia · API DeepSeek ~10× más barata que GPT-5",
    status: "local",
  },

  /* Datos, docs & diseño */
  {
    id: "dbeaver", name: "DBeaver (Ultimate / Enterprise)", vendor: "DBeaver Corp", cat: "data_doc", logo: "▣",
    tagline: "IDE universal de BD con AI Chat desde Lite.",
    detail: "Conecta ~80 motores: Oracle, PostgreSQL, Snowflake, Redshift, MS SQL, MongoDB, BigQuery. AI Chat disponible en Lite/Enterprise/Ultimate. Pro y Enterprise integran OpenAI, GitHub Copilot, Azure OpenAI y Google Gemini para text-to-SQL, troubleshooting y exploración de esquemas.",
    btg: "Analistas y data engineers consultando el datawarehouse · queries ad-hoc · modelado visual · migraciones entre motores.",
    example: "Abril 2026 · analista conectado a Snowflake: 'dame el top 10 de clientes por AUM del último trimestre'. DBeaver AI genera el SQL con los joins correctos contra el modelo estrella.",
    price: "Community gratis · Lite USD 11/mes · Pro/Ultimate USD 100–200/año (estimado) · Enterprise custom",
    status: "pro",
  },
  {
    id: "figma-mcp", name: "Figma MCP Server (Dev Mode)", vendor: "Figma", cat: "data_doc", logo: "◈",
    tagline: "Conector Model Context Protocol. Cursor/VS Code/Claude Code/Codex/Windsurf.",
    detail: "Dos modalidades: remote server (recomendado) o desktop. Expone frames, design tokens, variables, componentes y FigJam al IDE. Genera código con Code Connect mapeado a componentes reales. Puede escribir directo al canvas (crear/actualizar contenido Figma desde el IDE).",
    btg: "Implementar dashboards del equipo de producto · mantener consistencia con el design system BTG · cerrar gap design→code.",
    example: "Abril 2026 · el equipo de diseño entrega el nuevo panel de treasury en Figma. En Cursor: '@figma — implementa este frame'. React + tokens + spacing respetados al primer intento.",
    price: "Incluido en Figma Dev Mode (todos los planes de pago)",
    status: "open",
  },
  {
    id: "llama-parse", name: "LlamaParse v2", vendor: "LlamaIndex", cat: "data_doc", logo: "▤",
    tagline: "Parsing de PDFs complejos. v2 dic 2025 — más barato y preciso.",
    detail: "Tablas anidadas, charts, formularios, estados financieros escaneados → Markdown, JSON estructurado o CSVs. Modo premium con LLM para documentos difíciles. v2 (dic 2025): mejor accuracy, menor latencia, nuevos precios por modo. Integra directo con RAG sobre LlamaIndex.",
    btg: "Prospectos de emisión · memorias anuales · estados financieros escaneados · KID/KIID de fondos · reportes regulatorios.",
    example: "Abril 2026 · prospecto de 180 pp con tablas anidadas en modo premium: 10.800 créditos ≈ USD 13,5. Salida Markdown estructurada lista para embeddings.",
    price: "10.000 créditos gratis/mes · 1.000 créditos = USD 1,25 · premium 60 créditos/pg",
    status: "pro",
  },
  {
    id: "docling", name: "Docling (Linux Foundation)", vendor: "IBM Research · AAIF", cat: "data_doc", logo: "▥",
    tagline: "Donado a Linux Foundation en 2026. Granite-Docling 258M built-in.",
    detail: "PDF, DOCX, PPTX, XLSX, HTML, WAV, MP3, WebVTT, imágenes, LaTeX → Markdown/JSON. Heron layout model (dic 2025) y Granite-Docling 258M VLM (Apache 2.0). En 2026: donado al Linux Foundation (AAIF) + OpenShift Operator con Red Hat targeting bancos.",
    btg: "Alternativa a LlamaParse cuando el documento no puede salir de la red · pipelines batch on-prem · compliance con datos sensibles.",
    example: "Abril 2026 · pipeline on-prem con OpenShift Operator de Red Hat (partnership IBM). Procesa 5.000 PDFs/día de extractos bancarios sin salir de la red BTG.",
    price: "Apache 2.0 · costo = CPU/GPU propia · Red Hat OpenShift Operator según contrato RHEL",
    status: "local",
  },

  /* Automation */
  {
    id: "n8n", name: "n8n", vendor: "n8n GmbH (Berlín)", cat: "automation", logo: "⚡",
    tagline: "Orquestador low-code self-hostable. Módulo 03.",
    detail: "+500 nodos nativos: Outlook, SharePoint, Snowflake, Slack, Jira, HTTP, bases de datos, LLMs (OpenAI, Anthropic, Gemini, local). Cron, webhooks, bifurcación lógica, manejo de errores. Desde 2026: sin límites de workflows activos en ningún plan — solo se paga por ejecuciones.",
    btg: "Módulo 03 del curso. Pegamento entre IA + sistemas: alertas de riesgo, aprobaciones, notificaciones, pipelines de ingesta documental.",
    example: "Abril 2026 · cron nocturno n8n: lee nuevos PDFs en SharePoint → Docling los parsea → ADA resume con Claude → escribe ficha en Snowflake → notifica research en Slack.",
    price: "Self-hosted gratis · Starter EUR 24 · Pro EUR 60 · Business EUR 800 · Startup Program USD 400/mes · Enterprise custom",
    status: "next-module",
  },
];

const ECO_STATUS_BADGES: Record<EcoTool["status"], { label: string; color: string }> = {
  core: { label: "Stack central sesión 6", color: "#5B52D5" },
  pro: { label: "Pago · equipos pro", color: "#3A7BD5" },
  corporate: { label: "Corporate-friendly", color: "#00D4E5" },
  emerging: { label: "Emergente 2026", color: "#E85A1F" },
  local: { label: "On-prem / privado", color: "#22C55E" },
  open: { label: "Open / freemium", color: "#D4AF4C" },
  "next-module": { label: "Módulo 03 →", color: "#F97316" },
  sunset: { label: "Sunset 2026 ⚠", color: "#6B7280" },
};

/* Primeros ejercicios · quick wins con el ecosistema */
const ECO_EJERCICIOS = [
  {
    n: 1,
    title: "Onboarding a un sector en 15 min",
    level: "⭐",
    time: "15 min",
    tools: [
      { name: "NotebookLM", color: "#00D4E5" },
    ],
    context: "Es tu primer día en el equipo de Renta Fija. Mañana 8 am tienes reunión con el portfolio manager y quieres hablar con criterio sobre utilities colombianas sin parecer improvisado.",
    why: "NotebookLM responde solo con las fuentes que cargas y cita la página exacta — imposible alucinar y defendible ante un MD.",
    steps: [
      { s: "1", t: "Entra a notebooklm.google.com y crea un notebook: 'Utilities Colombia 2026'." },
      { s: "2", t: "Carga 5 fuentes: último reporte trimestral de ISA, EPM y Celsia (PDF de sus IR), un informe sectorial de research (Credicorp o Davivienda) y un video de YouTube de análisis del sector." },
      { s: "3", t: "Click en Studio → 'Audio Overview' en español. Escúchalo mientras caminas o almuerzas." },
      { s: "4", t: "Studio → 'Mind Map'. Recorre las ramas de CAPEX, regulación, tarifa, financiamiento." },
      { s: "5", t: "Haz 3 preguntas en el chat: (a) ¿cuáles son los 3 riesgos regulatorios del sector en 2026?, (b) ¿cómo afecta la tasa BanRep al CAPEX de estas empresas?, (c) ¿qué emisor lidera inversión este año y por qué? Verifica que cada respuesta traiga cita." },
    ],
    deliverable: "Link compartible al notebook + 1 captura del mindmap + una frase de 2 líneas que vas a decir en la reunión.",
    cost: "USD 0 (tier gratis NotebookLM)",
    color: "#00D4E5",
  },
  {
    n: 2,
    title: "Dashboard de portafolio desde Excel en 20 min",
    level: "⭐⭐",
    time: "20 min",
    tools: [
      { name: "ChatGPT (Code Interpreter)", color: "#5B52D5" },
      { name: "Canvas", color: "#7B73E8" },
    ],
    context: "Son las 2:30 pm. Tu jefe te pasa el Excel del portafolio (120 posiciones) y pide 'algo visual' para el comité de las 4:00. Nunca has hecho un dashboard de esa cartera.",
    why: "Code Interpreter corre Python real en sandbox, lee tu Excel, grafica y te da HTML autocontenido — sin instalar nada ni pedirle nada a infraestructura.",
    steps: [
      { s: "1", t: "En ChatGPT Plus, nuevo chat. Sube el archivo portafolio_abril.xlsx (drag & drop)." },
      { s: "2", t: "Prompt: 'Calcula AUM total, AUM por sector, top 10 posiciones por peso, distribución por rating (IG vs HY) y duración ponderada del portafolio. Devuelve tabla resumen.'" },
      { s: "3", t: "Pide gráficos: 'Grafica dona de sector, barras horizontales por rating, scatter de duration vs yield, y marca outliers > 2σ en rojo.'" },
      { s: "4", t: "Pide empaquetado: 'Genera un dashboard.html autocontenido con Chart.js (CDN), paleta dark minimal, título BTG Portfolio Analytics — Abril 2026 y timestamp.'" },
      { s: "5", t: "Descarga el HTML, ábrelo en Chrome, cruza 2 números con el Excel original (AUM total y top 1). Corrige en el chat si algo no cuadra." },
    ],
    deliverable: "dashboard.html funcional + 1 párrafo de 3 líneas identificando qué corregiste en el prompt hasta cuadrar los números.",
    cost: "USD 20/mes ChatGPT Plus (o Pro $100)",
    color: "#5B52D5",
  },
  {
    n: 3,
    title: "Ficha de emisor desde prospecto PDF en 25 min",
    level: "⭐⭐⭐",
    time: "25 min",
    tools: [
      { name: "LlamaParse v2", color: "#D4AF4C" },
      { name: "Claude / ChatGPT", color: "#E85A1F" },
    ],
    context: "Llega el prospecto de emisión de un nuevo corporativo colombiano — 180 páginas, con tablas anidadas y estados financieros escaneados. El comité de crédito es mañana 9 am y necesitas una ficha de 1 página con lo esencial.",
    why: "Leer 180 páginas toma 4 h y se escapan detalles. LlamaParse v2 en modo premium desglosa tablas y estructura en ~10 min, y el LLM extrae exactamente los campos que necesitas.",
    steps: [
      { s: "1", t: "Entra a cloud.llamaindex.ai/parse. Crea cuenta (trae 10k créditos gratis/mes). Sube el prospecto en modo 'Premium' (60 créditos/pg = ~10.800 créditos ≈ USD 13 si agotas el tier gratis)." },
      { s: "2", t: "Espera el output (~10 min para 180 pp). Descarga el Markdown estructurado." },
      { s: "3", t: "En Claude o ChatGPT, pega el Markdown con este prompt: 'De este prospecto extrae en JSON: emisor, monto emisión COP, plazo, tasa cupón, uso de fondos, principales covenants (lista), EBITDA últimos 3 años, deuda/EBITDA, cobertura de intereses y rating. Si un campo no aparece, marca null.'" },
      { s: "4", t: "Pide la ficha ejecutiva: 'Con ese JSON, genera una ficha markdown de máximo 1 página con encabezado, KPIs financieros, 5 covenants clave, 3 riesgos identificados y un semáforo rojo/ámbar/verde justificado.'" },
      { s: "5", t: "Pide comparación con peer: 'Compara esta emisión con Promigas 2024 en plazo, cupón, covenants y D/EBITDA. Señala las 3 diferencias más relevantes para el comité.'" },
    ],
    deliverable: "Ficha.md de 1 página + tabla comparativa vs peer + los 3 riesgos listados con página del prospecto como evidencia.",
    cost: "USD 0 si cabes en tier gratis · ~USD 13 en premium · + API de Claude/ChatGPT",
    color: "#D4AF4C",
  },
];

/* 3 extras con DeepSeek — quick wins sin APIs pagas */
const ECO_EJERCICIOS_DEEPSEEK = [
  {
    n: 4,
    title: "Hola DeepSeek · chat web comparativo",
    level: "⭐",
    time: "8 min",
    tag: "Sin setup",
    tools: [
      { name: "chat.deepseek.com", color: "#22C55E" },
      { name: "ChatGPT (comparación)", color: "#6B7280" },
    ],
    context: "Tu equipo evalúa alternativas a ChatGPT porque los costos de token se dispararon. En 8 min tienes que dar una opinión informada en el daily.",
    why: "DeepSeek-V3.2 es open weights y comparable a GPT-5 en muchos benchmarks, con API ~10× más barata. Vale la pena tenerlo en el radar aunque el equipo siga en ChatGPT.",
    steps: [
      { s: "1", t: "Abre chat.deepseek.com en una pestaña y chatgpt.com en otra. DeepSeek no pide login en la primera interacción." },
      { s: "2", t: "Pega la misma pregunta en ambos: 'Explícame en 150 palabras la estructura de capital típica de una emisión corporativa colombiana 2026 — senior secured, senior unsecured, subordinada, híbrida — con rangos de spread orientativos.'" },
      { s: "3", t: "Compara tres dimensiones en una tabla: precisión de las cifras, claridad del español técnico y adaptación al contexto local colombiano." },
      { s: "4", t: "Prueba con una 2ª tarea: 'Traduce este párrafo de prospecto de inglés a español manteniendo precisión financiera: [pega un párrafo real de un KID/KIID]'." },
    ],
    deliverable: "Tabla comparativa 2 columnas × 3 filas + un veredicto de 3 líneas de qué tarea asignar a cada modelo en tu día a día.",
    cost: "USD 0",
    color: "#22C55E",
  },
  {
    n: 5,
    title: "DeepSeek offline en tu laptop",
    level: "⭐",
    time: "12 min",
    tag: "On-prem casero",
    tools: [
      { name: "Ollama", color: "#22C55E" },
      { name: "deepseek-r1:7b", color: "#16A34A" },
    ],
    context: "Compliance dice que cierta data no puede enviarse a APIs externas. Demuestras que tu propia laptop puede correr un modelo de razonamiento decente sin tocar internet.",
    why: "Ollama + DeepSeek-R1 7B pesa 4.7 GB y corre en Apple Silicon o cualquier laptop con 16 GB RAM. Es la prueba viva de que P-III+ tiene un camino sin salir de la red.",
    steps: [
      { s: "1", t: "Mac: `curl -fsSL https://ollama.com/install.sh | sh`. Windows: descarga desde ollama.com. 30 segundos." },
      { s: "2", t: "Terminal: `ollama pull deepseek-r1:7b`. Descarga ~4.7 GB (3-5 min en fibra). Si tu equipo no tiene GPU, descarga también `deepseek-r1:1.5b` (1.1 GB) como fallback." },
      { s: "3", t: "Corre: `ollama run deepseek-r1:7b`. Pregunta: 'Escribe una función Python que calcule VaR histórico al 95% de confianza a partir de una serie de retornos. Incluye docstring y manejo del caso series < 30 observaciones.'" },
      { s: "4", t: "Desconecta el WiFi completamente. Repite la pregunta con otro parámetro (VaR al 99%). Confirma que sigue respondiendo — 100% local." },
      { s: "5", t: "Vuelve a conectar. Prueba: `ollama run deepseek-r1:7b 'en una frase, ¿qué es CETIP?'`. El modelo chino también entiende contexto brasileño." },
    ],
    deliverable: "Screenshot de la terminal con WiFi apagado respondiendo + el snippet Python de VaR copiado a un archivo .py.",
    cost: "USD 0 · ~5 GB de disco",
    color: "#16A34A",
  },
  {
    n: 6,
    title: "Resumen ejecutivo de circular regulatoria",
    level: "⭐",
    time: "10 min",
    tag: "TL;DR accionable",
    tools: [
      { name: "chat.deepseek.com", color: "#22C55E" },
    ],
    context: "Salió una circular nueva de la SFC de 14 páginas sobre un cambio regulatorio. El MD vuela a Bogotá en 1 h y quiere el TL;DR para la reunión con la junta.",
    why: "DeepSeek-V3.2 maneja bien español técnico regulatorio y da respuestas estructuradas sin cuenta ni pago. Para lecturas rápidas de circulares SFC o URF es la herramienta más liviana del ecosistema.",
    steps: [
      { s: "1", t: "Ve a sfc.gov.co o urf.gov.co, descarga la circular más reciente (o usa una que ya tengas). Copia el texto completo (Ctrl+A, Ctrl+C del PDF)." },
      { s: "2", t: "En chat.deepseek.com pega: 'Eres el chief of staff de un MD en banca. Resume esta circular SFC en 5 bullets de máximo 22 palabras cada uno, para una reunión con la junta en 1 hora. Incluye: fecha de entrada en vigor, impacto directo para un banco universal colombiano y 1 acción recomendada. [pega texto]'." },
      { s: "3", t: "Pide una derivada: 'Ahora genera un mensaje interno de Slack de 3 líneas para tesorería con el cambio más material y un email de 4 líneas para el comité de riesgo.'" },
      { s: "4", t: "Valida: abre la circular original y confirma que los bullets citan artículos o páginas reales. Si no, agrega al prompt: 'sé específico citando artículo y página exacta'." },
    ],
    deliverable: "5 bullets + mensaje Slack + email comité en un solo archivo md listo para compartir.",
    cost: "USD 0",
    color: "#15803D",
  },
];

/* 4 en línea con DeepSeek + Kimi — cero setup, puro navegador */
const ECO_EJERCICIOS_ONLINE = [
  {
    n: 7,
    title: "Benchmark triple en vivo · ChatGPT vs DeepSeek vs Kimi",
    level: "⭐",
    time: "10 min",
    tag: "3 pestañas",
    tools: [
      { name: "chatgpt.com", color: "#10A37F" },
      { name: "chat.deepseek.com", color: "#22C55E" },
      { name: "kimi.com", color: "#16A34A" },
    ],
    context: "El equipo de research evalúa qué modelo usar para queries diarias. En 10 min corres un benchmark práctico con preguntas tipo BTG y decides dónde asignar cada uno.",
    why: "Los benchmarks públicos se hacen viejos rápido. Vale más un ejercicio propio de 3 preguntas reales que 10 métricas académicas. Y estos 3 modelos tienen tier gratis — no hay excusa para no probarlos.",
    steps: [
      { s: "1", t: "Abre 3 pestañas: chatgpt.com, chat.deepseek.com y kimi.com (login Google en Kimi para evitar el SMS chino)." },
      { s: "2", t: "Pregunta de cifras (idéntica en las 3): 'Calcula la duración modificada y convexidad de un TES B 2032, cupón 7.25% anual, precio 92.50, base 365. Muestra las fórmulas.'" },
      { s: "3", t: "Pregunta cualitativa local: '¿Qué riesgos específicos tiene un bono perpetuo Tier 1 (AT1) de un banco colombiano vs uno brasileño en abril 2026? Considera regulación SFC vs Bacen.'" },
      { s: "4", t: "Pregunta de español técnico: 'Resume las reglas de provisión de la Circular Externa 100 de la SFC en 5 bullets de máximo 20 palabras cada uno.'" },
      { s: "5", t: "Arma la matriz 3×3 (modelos × preguntas) con puntaje 1-5 en precisión, español técnico y citas." },
    ],
    deliverable: "Matriz 3×3 + una recomendación de 3 líneas: qué tarea asignar a cada modelo en tu día a día.",
    cost: "USD 0 en los 3",
    color: "#10A37F",
  },
  {
    n: 8,
    title: "Memoria anual de 280 pp en Kimi · todo en una conversación",
    level: "⭐",
    time: "15 min",
    tag: "Long context",
    tools: [
      { name: "kimi.com", color: "#16A34A" },
      { name: "Thinking mode", color: "#16A34A" },
    ],
    context: "Llega la memoria anual 2025 de un emisor del portafolio (p. ej. Ecopetrol, ISA, Bancolombia) — 280 páginas. Tu reunión con el portfolio manager es en 20 minutos y quiere saber si la tesis sigue intacta.",
    why: "Kimi K2.5 soporta 256K tokens ≈ 524 páginas en una sola conversación. Una memoria anual entera cabe sin chunking, sin RAG, sin embeddings — solo drag & drop.",
    steps: [
      { s: "1", t: "Entra a kimi.com y haz login con Google (evita el flujo de teléfono chino). La UI está en inglés por defecto pero responde perfectamente en español." },
      { s: "2", t: "Descarga la memoria anual del IR del emisor (buscar 'Memoria anual 2025' + emisor). Arrastra el PDF a la caja del chat. Click en 'Thinking' para activar el modo razonamiento." },
      { s: "3", t: "Prompt: 'Extrae los 10 principales factores de riesgo declarados. Para cada uno: página de referencia, categoría (operacional/financiero/regulatorio/estratégico) y si el documento reporta materialización o mitigación durante el año.'" },
      { s: "4", t: "Follow-up: 'Compara los factores de riesgo 2024 vs 2025 en la sección de cambios. ¿Qué desapareció y qué es nuevo? Tabla con columnas año-a-año.'" },
      { s: "5", t: "Último prompt: 'Dame 3 preguntas que haría un analista sénior en la próxima call con el CFO del emisor, basadas en estos cambios.'" },
    ],
    deliverable: "Tabla con 10 riesgos + diff 2024→2025 + 3 preguntas para la llamada. Todo sobre una sola conversación de Kimi.",
    cost: "USD 0",
    color: "#16A34A",
  },
  {
    n: 9,
    title: "Balance en PDF → ratios listos · DeepSeek file upload",
    level: "⭐",
    time: "12 min",
    tag: "File upload",
    tools: [
      { name: "chat.deepseek.com", color: "#22C55E" },
      { name: "DeepThink", color: "#22C55E" },
    ],
    context: "Un emisor entrega balance trimestral de 15 páginas como PDF el miércoles tarde. Necesitas 8 ratios clave con evidencia de línea para el comité de inversiones del jueves 9 am.",
    why: "El file upload de DeepSeek (hasta 10 MB: PDF/DOCX/PPTX/XLSX) + modo DeepThink da transparencia: el modelo muestra de qué línea sacó cada número. Eso es auditable cuando el comité te pregunte.",
    steps: [
      { s: "1", t: "Ve a chat.deepseek.com. Click en el clip (abajo a la izquierda de la caja) y sube el PDF del balance. No se requiere cuenta para archivos menores." },
      { s: "2", t: "Activa 'DeepThink' (botón junto al clip). Esto fuerza razonamiento paso a paso." },
      { s: "3", t: "Prompt: 'De este balance calcula: razón corriente, prueba ácida, endeudamiento total, deuda financiera neta / EBITDA, cobertura de intereses, ROE, ROA, margen EBITDA. Devuelve tabla markdown con valor, fórmula y la línea exacta del balance de donde viene cada componente.'" },
      { s: "4", t: "Valida: abre el PDF original y verifica 2 cifras clave (activo total y deuda financiera neta). Si algo no cuadra, pégalo al chat: 'la cifra X de la línea Y es Z, no lo que dijiste — recalcula'." },
      { s: "5", t: "Follow-up: 'Compara estos ratios con los promedios del sector en Colombia 2026 y señala las 3 métricas más alejadas de la mediana sectorial con semáforo 🟢🟡🔴.'" },
    ],
    deliverable: "Tabla de 8 ratios con trazabilidad de línea + semáforo vs sector + 3 líneas de recomendación para el comité.",
    cost: "USD 0",
    color: "#22C55E",
  },
  {
    n: 10,
    title: "Due diligence express · web search DeepSeek + Kimi",
    level: "⭐",
    time: "12 min",
    tag: "Web search",
    tools: [
      { name: "DeepSeek DeepThink + Search", color: "#22C55E" },
      { name: "Kimi Thinking + Search", color: "#16A34A" },
    ],
    context: "A las 3 pm te avisan: tienes primera llamada con un emisor que no conocías, mañana 9 am. En 12 minutos tienes que saber lo material público y tener preguntas punzantes listas.",
    why: "Web search integrada + modo razonamiento en ambos modelos hace lo que antes era una hora de Google + Bloomberg. Usar dos fuentes en paralelo reduce el riesgo de que uno alucine citas.",
    steps: [
      { s: "1", t: "En chat.deepseek.com activa el botón globo (web search) y DeepThink. Pregunta: 'Dossier ejecutivo del emisor [NOMBRE] a abril 2026: eventos materiales últimos 12 meses, rating vigente (S&P/Moody/Fitch), últimas revisiones, cambios en gobierno corporativo y noticias negativas si existen. Cita URL exacta de cada dato.'" },
      { s: "2", t: "En paralelo, en kimi.com activa Web Search y Thinking. Haz la misma pregunta palabra por palabra." },
      { s: "3", t: "Pide a ambos: 'Ahora dame 5 preguntas punzantes que haría un analista sénior en la primera llamada con el CFO, basadas en lo que encontraste. Ordénalas de más a menos material.'" },
      { s: "4", t: "Cruza las dos respuestas: ¿qué fuente encontró cada uno? ¿alguno citó un URL inventado? Click en cada URL y verifica que exista." },
      { s: "5", t: "Consolida el dossier final en un archivo .md con: (a) 5 hechos materiales con link verificado, (b) rating actual, (c) 3 riesgos rojos y (d) las 5 preguntas para la llamada." },
    ],
    deliverable: "Dossier 1-página .md con URLs verificadas + 5 preguntas para la llamada de mañana.",
    cost: "USD 0 en los 2",
    color: "#15803D",
  },
];

/* Casos reales abril 2026 — cómo se combinan varias herramientas */
const CASOS_ECOSISTEMA = [
  {
    n: 1,
    title: "Ingesta automática de prospectos de emisión",
    scenario: "Un emisor entrega prospecto de 220 pp el jueves tarde. Hay que sacar ficha, riesgos y comparables para el comité del viernes.",
    flow: [
      { tool: "n8n", role: "Trigger en SharePoint detecta el nuevo PDF" },
      { tool: "LlamaParse v2", role: "Parsing premium (tablas anidadas) → Markdown" },
      { tool: "ADA + Claude", role: "Resumen estructurado + extracción de covenants" },
      { tool: "Snowflake", role: "Ficha persiste en tabla de emisores" },
      { tool: "Slack", role: "Notificación al equipo de research con link" },
    ],
    impact: "4 min vs 3 h manuales · auditable · replicable a todos los emisores del pipeline",
    color: "#5B52D5",
  },
  {
    n: 2,
    title: "Dashboard financiero de cero a desplegado",
    scenario: "El equipo de producto diseñó un panel de treasury en Figma. Hay que llevarlo a producción.",
    flow: [
      { tool: "Figma MCP", role: "Frame del panel expuesto como contexto MCP" },
      { tool: "Cursor (Composer)", role: "Lee design tokens y genera React + Chart.js" },
      { tool: "GitHub Copilot", role: "Review del PR + descripción auto" },
      { tool: "GitHub Actions", role: "CI/CD despliega a GitHub Pages" },
    ],
    impact: "45 min de Figma a URL compartible · respeta tokens y spacing al primer intento",
    color: "#00E5A0",
  },
  {
    n: 3,
    title: "Auditoría cross-repo de dependencias (CISO request)",
    scenario: "El CISO pregunta: ¿qué versiones de log4j tenemos en producción y qué CVEs nos afectan?",
    flow: [
      { tool: "Claude Code CLI", role: "Corre sobre 34 repos con skill de inventario" },
      { tool: "OSV-Scanner", role: "Cruce con base de CVEs" },
      { tool: "Claude Code", role: "Genera reporte markdown + remediación sugerida" },
      { tool: "Devin (opcional)", role: "Abre PRs de upgrade en los 9 repos críticos" },
    ],
    impact: "22 min de inventario + humano firma · riesgo material reducido en una tarde",
    color: "#3A7BD5",
  },
  {
    n: 4,
    title: "Migración legacy Java 8 → Java 21",
    scenario: "120k líneas de código de un sistema de liquidación corren en Java 8 — EOL de soporte es este año.",
    flow: [
      { tool: "Amazon Q Developer", role: "Code transformation (bulk Java 8 → 21)" },
      { tool: "Junie (JetBrains)", role: "Verifica tests tipados y refactor con índice semántico" },
      { tool: "GitHub Copilot", role: "Code Review antes del merge + sugerencias defensivas" },
      { tool: "DBeaver AI", role: "Valida queries SQL con el nuevo driver JDBC" },
    ],
    impact: "8 días en lugar de 3 meses · menos riesgo porque cada paso es reversible y auditado",
    color: "#E85A1F",
  },
  {
    n: 5,
    title: "Research sectorial gobernado (thesis paper)",
    scenario: "El equipo necesita tesis sobre data centers en LatAm para pitch de inversión el próximo mes.",
    flow: [
      { tool: "NotebookLM", role: "60 fuentes cargadas: reports, presentaciones, papers, videos" },
      { tool: "NotebookLM Studio", role: "Mindmap + audio overview ES + video overview" },
      { tool: "ChatGPT Canvas", role: "Redacción del memo con GPT-5.2" },
      { tool: "Gemini en Docs", role: "Layout final, gráficos y formato BTG" },
    ],
    impact: "1 día de proceso vs 2 semanas · cada afirmación citada contra fuente original",
    color: "#D4AF4C",
  },
  {
    n: 6,
    title: "Alertas de riesgo on-prem (data P-III)",
    scenario: "Movimientos anómalos en portafolios con data clasificada P-III que no puede salir de la red.",
    flow: [
      { tool: "Docling (local)", role: "Parsea reportes diarios de custodia (on-prem)" },
      { tool: "DeepSeek-V3.2 (Ollama)", role: "Clasificación + resumen con modelo local" },
      { tool: "n8n (self-hosted)", role: "Orquesta pipeline y genera alertas" },
      { tool: "ADA", role: "Escala a analista si umbral cruzado (con log de auditoría)" },
    ],
    impact: "Cero tokens fuera de la red · misma latencia que un flujo SaaS · compliance total",
    color: "#22C55E",
  },
];

const ECO_DECISION = [
  { trigger: "Tienes el repo abierto en VS Code y necesitas un feature nuevo", tool: "Cursor", color: "#5B52D5" },
  { trigger: "Necesitas operar sobre muchos repos o correr tareas largas solo", tool: "Claude Code", color: "#00E5A0" },
  { trigger: "El equipo ya vive en GitHub + quieres governance corporativo", tool: "GitHub Copilot", color: "#3A7BD5" },
  { trigger: "Tu IDE es IntelliJ o PyCharm y no lo vas a soltar", tool: "JetBrains AI + Junie", color: "#0EA5E9" },
  { trigger: "Necesitas chat con acceso a procedimientos internos BTG", tool: "ADA · Amazon Q · Gemini WS", color: "#00D4E5" },
  { trigger: "Quieres una VM que trabaje sola en un ticket de Jira", tool: "Devin", color: "#E85A1F" },
  { trigger: "Tienes que ingerir un prospecto de emisión de 300 pp", tool: "LlamaParse · Docling", color: "#D4AF4C" },
  { trigger: "La data no puede salir de la red — P-III+", tool: "DeepSeek local + Docling", color: "#22C55E" },
  { trigger: "El diseño del dashboard está en Figma y hay que implementarlo", tool: "Figma MCP + Cursor", color: "#7B73E8" },
  { trigger: "Hay que mover un proceso que se repite todos los días", tool: "n8n (Módulo 03)", color: "#F97316" },
];

/* ════════════════════════════ COMPONENT ════════════════════════════ */

export default function Sesion6() {
  const [activeMode, setActiveMode] = useState<string>("composer");
  const modeData = useMemo(() => CURSOR_MODES.find((m) => m.id === activeMode)!, [activeMode]);

  /* IDE anatomy panel selector */
  const [activePanel, setActivePanel] = useState<string>("editor");
  const panelData = useMemo(() => IDE_PANELS.find((p) => p.id === activePanel)!, [activePanel]);

  /* Primer ejercicio — step by step */
  const [primerStep, setPrimerStep] = useState<number>(0);
  const [primerAuto, setPrimerAuto] = useState<boolean>(true);
  useEffect(() => {
    if (!primerAuto) return;
    const iv = setInterval(() => setPrimerStep((s) => (s + 1) % PRIMER_EJERCICIO_STEPS.length), 4200);
    return () => clearInterval(iv);
  }, [primerAuto]);
  const primerCurrent = PRIMER_EJERCICIO_STEPS[primerStep];

  const [activeCap, setActiveCap] = useState<string>("pr");
  const capData = useMemo(() => COPILOT_CAPS.find((c) => c.id === activeCap)!, [activeCap]);

  const [ccStep, setCcStep] = useState<number>(0);
  useEffect(() => {
    const iv = setInterval(() => setCcStep((s) => (s + 1) % CLAUDE_CODE.length), 2600);
    return () => clearInterval(iv);
  }, []);

  /* Ecosistema panorama — filtro de categorías */
  const [ecoCat, setEcoCat] = useState<string>("all");
  const [ecoHover, setEcoHover] = useState<string | null>(null);
  const ecoFiltered = useMemo(
    () => (ecoCat === "all" ? ECOSISTEMA_TOOLS : ECOSISTEMA_TOOLS.filter((t) => t.cat === ecoCat)),
    [ecoCat]
  );
  const ecoCounts = useMemo(() => {
    const m: Record<string, number> = { all: ECOSISTEMA_TOOLS.length };
    ECOSISTEMA_CATS.forEach((c) => { m[c.id] = ECOSISTEMA_TOOLS.filter((t) => t.cat === c.id).length; });
    return m;
  }, []);

  /* Ejercicios */
  const [exIdx, setExIdx] = useState(0);
  const [exStepIdx, setExStepIdx] = useState(0);
  const [exDone, setExDone] = useState<Record<string, number[]>>({ ex1: [], ex2: [], ex3: [] });
  const currentEx = EJERCICIOS[exIdx];
  const toggleStepDone = (stepN: number) => {
    setExDone((prev) => {
      const list = prev[currentEx.id] ?? [];
      const next = list.includes(stepN) ? list.filter((x) => x !== stepN) : [...list, stepN];
      return { ...prev, [currentEx.id]: next };
    });
  };
  const doneCount = (exDone[currentEx.id] ?? []).length;
  const progressPct = Math.round((doneCount / currentEx.steps.length) * 100);

  /* Hero counter */
  const [heroN, setHeroN] = useState(0);
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => { i++; setHeroN(i); if (i >= 5) clearInterval(iv); }, 220);
    return () => clearInterval(iv);
  }, []);

  /* Dashboard computations */
  const totalPeso = DASHBOARD_PORTFOLIO.reduce((s, a) => s + a.peso, 0);
  const retPortafolio = DASHBOARD_PORTFOLIO.reduce((s, a) => s + a.peso * a.r30, 0) / totalPeso;
  const volPonderada = Math.sqrt(DASHBOARD_PORTFOLIO.reduce((s, a) => s + a.peso * a.vol * a.vol, 0) / totalPeso);
  const sharpe = ((retPortafolio * 12) / volPonderada).toFixed(2);

  return (
    <div className="min-h-screen bg-[#080C1F]">
      {/* ═══════════════ 1. HERO ═══════════════ */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden">
        <div className="hero-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_25%_50%,rgba(91,82,213,0.1),transparent),radial-gradient(ellipse_40%_50%_at_75%_60%,rgba(0,229,160,0.08),transparent)] pointer-events-none" />

        {/* Code rain background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] font-mono text-[0.6rem] leading-tight text-cyan overflow-hidden select-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute whitespace-nowrap" style={{ left: `${(i * 7) % 100}%`, top: `${(i * 5) % 100}%`, transform: "rotate(-2deg)" }}>
              {`def calcular_${["var","ret","sharpe","port","drawdown"][i % 5]}(): return np.`}
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-4 animate-fadeUp">
            Módulo 02 · Herramientas · Sesión 6
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white-f leading-tight mb-6 animate-fadeUp-1">
            <span className="text-white-f">Programación</span>{" "}
            <span className="bg-gradient-to-r from-purple via-purple-light to-cyan bg-clip-text text-transparent">asistida por IA</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 animate-fadeUp-2">
            Del editor de texto al agente autónomo. El stack que un analista BTG usa hoy para generar código, tests, PRs y dashboards con IA — sin perder governance ni calidad. Con el panorama completo del ecosistema 2026.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fadeUp-3">
            {[
              { val: heroN >= 1 ? "5" : "—", label: "Modos Cursor", icon: "◈", color: "#5B52D5" },
              { val: heroN >= 2 ? "6" : "—", label: "Capacidades Copilot", icon: "✦", color: "#3A7BD5" },
              { val: heroN >= 3 ? "3" : "—", label: "Ejercicios hands-on", icon: "🤖", color: "#00E5A0" },
              { val: heroN >= 4 ? "6" : "—", label: "Entregables", icon: "◉", color: "#E85A1F" },
              { val: heroN >= 5 ? "1×" : "—", label: "HTML dashboard", icon: "📊", color: "#D4AF4C" },
            ].map((s) => (
              <div key={s.label} className="bg-[#151A3A] border rounded-2xl px-5 py-3 min-w-[110px] transition-all hover:scale-105" style={{ borderColor: `${s.color}25` }}>
                <span className="text-lg" style={{ color: s.color }}>{s.icon}</span>
                <p className="text-xl font-bold text-white-f mt-1">{s.val}</p>
                <p className="text-[0.6rem] text-muted">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[0.6rem] font-mono text-muted mt-4 opacity-60">* Sin dependencia de backend ni infraestructura — el dashboard corre en un navegador.</p>
        </div>
      </section>

      {/* ═══════════════ 2. AGENDA ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-12">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-6">Agenda · Sesión 6</p>
          <div className="flex flex-col sm:flex-row gap-2">
            {AGENDA.map((a, i) => (
              <div key={i} className="flex-1 rounded-xl p-4 border transition-all hover:scale-[1.02]" style={{
                background: `linear-gradient(135deg, ${a.color}12, ${a.color}06)`, borderColor: `${a.color}30`,
              }}>
                <p className="font-mono text-xs font-semibold mb-1" style={{ color: a.color }}>{a.time}</p>
                <p className="text-sm text-white-f font-medium">{a.label}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 3. OBJETIVOS ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-12">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-3">Objetivos de aprendizaje</p>
          <h2 className="text-2xl md:text-4xl font-bold text-white-f leading-tight mb-8">
            Al cerrar la sesión podrás <span className="bg-gradient-to-r from-purple-light to-cyan bg-clip-text text-transparent">mantener un repo BTG</span> con flujo profesional
          </h2>
          <div className="grid md:grid-cols-5 gap-3">
            {OBJETIVOS.map((o, i) => (
              <div key={i} className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-4 hover:border-white/[0.15] transition-all">
                <div className="text-2xl mb-2">{o.icon}</div>
                <p className="text-sm font-bold text-white-f leading-tight mb-1.5">{o.title}</p>
                <p className="text-[0.7rem] text-muted leading-snug">{o.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 3B. ¿QUÉ ES UN IDE? ═══════════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_30%,rgba(58,123,213,0.07),transparent),radial-gradient(ellipse_50%_60%_at_75%_70%,rgba(91,82,213,0.06),transparent)] pointer-events-none" />
          <div className="relative">
            <p className="font-mono text-[0.72rem] uppercase tracking-widest text-blue mb-3">Fundamentos · antes de Cursor</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
              ¿Qué es un <span className="bg-gradient-to-r from-blue via-purple-light to-cyan bg-clip-text text-transparent">IDE</span>?
            </h2>
            <p className="text-lg text-muted max-w-3xl mb-4">
              IDE = <span className="text-white-f font-semibold">Integrated Development Environment</span>. Un programa que reúne en una sola ventana todo lo necesario para escribir, correr y versionar código: editor, terminal, debugger, control de versiones y extensiones.
            </p>
            <p className="text-[0.85rem] text-muted max-w-3xl mb-10">
              <span className="text-cyan font-mono">Analogía BTG:</span> así como Excel + Bloomberg + correo + Teams conviven en tu escritorio, un IDE reúne editor de texto + consola Python + cliente Git + debugger en un solo lugar. Sin IDE, tendrías que saltar entre 4–5 apps.
            </p>

            {/* Anatomía visual: sidebar + editor area + panel */}
            <div className="grid lg:grid-cols-[260px_1fr] gap-6 mb-10">
              {/* Panel selector */}
              <div className="space-y-2">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-2">6 componentes clave</p>
                {IDE_PANELS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePanel(p.id)}
                    className="w-full flex items-center gap-3 rounded-xl p-3 border transition-all text-left"
                    style={{
                      background: activePanel === p.id ? `${p.color}18` : "#151A3A",
                      borderColor: activePanel === p.id ? `${p.color}80` : "rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="w-9 h-9 rounded-lg grid place-items-center text-lg shrink-0" style={{ background: `${p.color}22`, color: p.color }}>{p.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.78rem] font-bold text-white-f leading-tight truncate">{p.name}</p>
                      <p className="text-[0.62rem] text-muted">{p.id === "ai" ? "Nuevo · IDEs modernos" : "Desde los 2000s"}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Anatomía interactiva */}
              <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#1E1E1E] shadow-2xl">
                {/* Title bar */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-[#2D2D30] border-b border-white/[0.04]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-3 font-mono text-[0.62rem] text-white/50">btg-portafolio — portafolio.py</span>
                  <span className="ml-auto flex items-center gap-1.5 text-[0.58rem] font-mono" style={{ color: panelData.color }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: panelData.color }} />
                    {panelData.name}
                  </span>
                </div>

                {/* IDE layout: activity bar + explorer + editor + panel */}
                <div className="grid grid-cols-[40px_200px_1fr] min-h-[400px] relative">
                  {/* Activity bar (leftmost) */}
                  <div className="bg-[#333333] border-r border-black/30 flex flex-col items-center py-2 gap-2">
                    {[
                      { i: "📁", id: "explorer" },
                      { i: "🔍", id: null },
                      { i: "⎇",  id: "git" },
                      { i: "🐞", id: "debugger" },
                      { i: "✦",  id: "ai" },
                    ].map((it, idx) => {
                      const active = it.id === activePanel;
                      const highlight = it.id && activePanel === it.id;
                      return (
                        <button
                          key={idx}
                          onClick={() => it.id && setActivePanel(it.id)}
                          className={`w-9 h-9 grid place-items-center text-[0.85rem] rounded transition-all ${highlight ? "text-white" : "text-white/50 hover:text-white/80"}`}
                          style={{
                            background: active ? `${panelData.color}25` : "transparent",
                            borderLeft: active ? `2px solid ${panelData.color}` : "none",
                          }}
                        >
                          {it.i}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explorer */}
                  <div className={`bg-[#252526] border-r border-black/30 p-3 text-[0.68rem] transition-all ${activePanel === "explorer" ? "ring-2 ring-inset" : ""}`} style={{ boxShadow: activePanel === "explorer" ? `inset 0 0 0 2px ${panelData.color}55` : "none" }}>
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest text-white/40 mb-2">Explorador</p>
                    <div className="space-y-0.5 font-mono text-white/80">
                      <p className="text-white/90">▾ BTG-PORTAFOLIO</p>
                      <p className="pl-3">▾ src/</p>
                      <p className="pl-6 text-blue">📄 portafolio.py</p>
                      <p className="pl-6 flex items-center gap-1">📄 analisis_riesgo.py <span className="w-1 h-1 rounded-full bg-[#22C55E]" /></p>
                      <p className="pl-6 text-gold">📄 dashboard.html <span className="text-[0.55rem] text-[#E85A1F]">M</span></p>
                      <p className="pl-3">▾ tests/</p>
                      <p className="pl-6">📄 test_portafolio.py</p>
                      <p className="pl-3 text-white/50">📄 .cursorrules</p>
                      <p className="pl-3 text-white/50">📄 README.md</p>
                    </div>
                  </div>

                  {/* Editor + Panel */}
                  <div className="flex flex-col">
                    {/* Tabs */}
                    <div className="flex bg-[#252526] border-b border-black/30 text-[0.62rem] font-mono">
                      <span className="px-3 py-1.5 bg-[#1E1E1E] text-white border-r border-black/30 flex items-center gap-1.5">📄 portafolio.py <span className="text-white/40">×</span></span>
                      <span className="px-3 py-1.5 text-white/50">test_portafolio.py</span>
                    </div>
                    {/* Editor area */}
                    <div className={`flex-1 p-4 font-mono text-[0.7rem] leading-relaxed text-white/85 relative transition-all ${activePanel === "editor" ? "ring-2 ring-inset" : ""}`} style={{ boxShadow: activePanel === "editor" ? `inset 0 0 0 2px ${panelData.color}55` : "none" }}>
                      <div className="flex">
                        <div className="text-right pr-3 text-white/30 select-none">
                          {Array.from({ length: 10 }).map((_, i) => <p key={i}>{i + 1}</p>)}
                        </div>
                        <div className="flex-1">
                          <p><span className="text-[#C586C0]">def</span> <span className="text-[#DCDCAA]">calcular_retorno</span>(<span className="text-[#9CDCFE]">precio_ini</span>, <span className="text-[#9CDCFE]">precio_fin</span>):</p>
                          <p className="pl-4 text-white/50">&quot;&quot;&quot;Retorno porcentual entre dos precios.&quot;&quot;&quot;</p>
                          <p className="pl-4 relative">
                            <span className="text-[#C586C0]">return</span> (<span className="text-[#9CDCFE]">precio_fin</span> <span className="text-white/60">-</span> <span className="text-[#9CDCFE]">precio_ini</span>) <span className="text-white/60">/</span> <span className="text-[#9CDCFE]">precio_ini</span> <span className="text-white/60">*</span> <span className="text-[#B5CEA8]">100</span>
                            {activePanel === "editor" && <span className="inline-block w-1.5 h-3.5 ml-1 align-middle animate-blink bg-white" />}
                          </p>
                          <p className="h-3" />
                          <p><span className="text-[#C586C0]">def</span> <span className="text-[#DCDCAA]">retorno_portafolio</span>(<span className="text-[#9CDCFE]">activos</span>: <span className="text-[#4EC9B0]">list</span>) <span className="text-white/50">-&gt;</span> <span className="text-[#4EC9B0]">float</span>:</p>
                          <p className="pl-4">
                            <span className="text-[#C586C0]">return</span> <span className="text-[#DCDCAA]">sum</span>(<span className="text-[#9CDCFE]">a</span>[<span className="text-[#CE9178]">&quot;w&quot;</span>] <span className="text-white/60">*</span> <span className="text-[#9CDCFE]">a</span>[<span className="text-[#CE9178]">&quot;r&quot;</span>] <span className="text-[#C586C0]">for</span> <span className="text-[#9CDCFE]">a</span> <span className="text-[#C586C0]">in</span> <span className="text-[#9CDCFE]">activos</span>)
                          </p>
                        </div>
                      </div>
                      {/* Highlight the AI or debugger overlay */}
                      {activePanel === "ai" && (
                        <div className="absolute top-4 right-4 w-64 bg-[#2D2D30] border border-purple-light/40 rounded-lg p-3 shadow-xl">
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="w-5 h-5 rounded bg-gradient-to-br from-purple to-cyan grid place-items-center text-[0.6rem]">✦</span>
                            <span className="font-mono text-[0.62rem] text-white/80">Cursor Chat</span>
                          </div>
                          <p className="text-[0.66rem] text-white/70 leading-snug italic">&ldquo;¿Qué hace <span className="text-cyan">calcular_retorno</span>? ¿Cómo lo pruebo con precios de Ecopetrol?&rdquo;</p>
                        </div>
                      )}
                      {activePanel === "debugger" && (
                        <div className="absolute top-8 left-2 right-2 md:right-auto md:w-[70%] bg-[#2D2D30] border border-orange/40 rounded-lg p-2.5 shadow-xl">
                          <p className="font-mono text-[0.58rem] text-orange mb-1">● Breakpoint · línea 3</p>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[0.6rem] font-mono">
                            <span className="text-white/50">precio_ini</span><span className="text-white">2050.00</span>
                            <span className="text-white/50">precio_fin</span><span className="text-white">2140.00</span>
                            <span className="text-white/50">return</span><span className="text-cyan">4.39</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Bottom panel */}
                    <div className={`border-t border-black/30 bg-[#1E1E1E] transition-all ${["terminal","git"].includes(activePanel) ? "ring-2 ring-inset" : ""}`} style={{ boxShadow: ["terminal","git"].includes(activePanel) ? `inset 0 0 0 2px ${panelData.color}55` : "none" }}>
                      <div className="flex text-[0.6rem] font-mono bg-[#252526] border-b border-black/30">
                        {["Problems", "Output", "Terminal", "Git"].map((t) => {
                          const live = (activePanel === "terminal" && t === "Terminal") || (activePanel === "git" && t === "Git");
                          return (
                            <span key={t} className={`px-3 py-1 ${live ? "bg-[#1E1E1E] text-white border-t border-l border-r border-[#3A7BD5]" : "text-white/40"}`}>{t}{live && <span className="ml-1 w-1 h-1 rounded-full inline-block align-middle" style={{ background: panelData.color }} />}</span>
                          );
                        })}
                      </div>
                      <div className="p-3 text-[0.64rem] font-mono min-h-[80px]">
                        {activePanel === "terminal" && (
                          <>
                            <p className="text-white/60"><span className="text-[#00E5A0]">➜</span> btg-portafolio $ python portafolio.py</p>
                            <p className="text-white/80">Retorno Ecopetrol Q1: <span className="text-[#00E5A0]">4.21%</span></p>
                            <p className="text-white/60 mt-1"><span className="text-[#00E5A0]">➜</span> btg-portafolio $ pytest</p>
                            <p className="text-white/80">======= <span className="text-[#22C55E]">3 passed</span> in 0.08s =======</p>
                          </>
                        )}
                        {activePanel === "git" && (
                          <>
                            <p className="text-white/60 mb-1">On branch <span className="text-[#D4AF4C]">feature/retornos</span></p>
                            <p className="text-[#22C55E]">+ src/portafolio.py  <span className="text-white/40">(new file)</span></p>
                            <p className="text-[#E85A1F]">M src/dashboard.html</p>
                            <p className="text-white/50 mt-2">Copilot: <span className="text-white/80">&ldquo;feat(riesgo): add VaR y retorno ponderado&rdquo;</span></p>
                          </>
                        )}
                        {!["terminal","git"].includes(activePanel) && (
                          <p className="text-white/30 italic">Haz clic en Terminal o Git para ver este panel activo.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status bar */}
                <div className="flex items-center justify-between px-3 py-1 bg-[#3A7BD5] text-white text-[0.58rem] font-mono">
                  <div className="flex items-center gap-3">
                    <span>⎇ feature/retornos</span>
                    <span>●</span>
                    <span>Python 3.11</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>UTF-8</span>
                    <span>Ln 3, Col 42</span>
                    <span className="bg-white/20 px-1.5 rounded">✦ Cursor</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel explicativo del componente activo */}
            <div className="bg-[#0D1229] border rounded-2xl p-5 md:p-6 mb-10 flex flex-col md:flex-row gap-5" style={{ borderColor: `${panelData.color}40` }}>
              <div className="w-16 h-16 rounded-2xl grid place-items-center text-3xl shrink-0" style={{ background: `${panelData.color}22`, color: panelData.color, border: `1px solid ${panelData.color}50` }}>{panelData.icon}</div>
              <div className="flex-1">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-1" style={{ color: panelData.color }}>Componente</p>
                <h3 className="text-xl font-bold text-white-f mb-2">{panelData.name}</h3>
                <p className="text-[0.85rem] text-white-f/90 leading-relaxed">{panelData.desc}</p>
              </div>
            </div>

            {/* Evolución histórica */}
            <div className="mb-10">
              <p className="font-mono text-xs uppercase tracking-wider mb-4 text-purple-light">◆ Evolución · de Notepad a Cursor</p>
              <div className="relative bg-[#0D1229] border border-white/[0.06] rounded-2xl p-6 md:p-8">
                {/* Connector line */}
                <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-white/10 via-purple-light/30 to-cyan/50 md:hidden" />
                <div className="hidden md:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-white/10 via-purple-light/30 to-orange/50 -translate-y-1/2" />

                <div className="grid grid-cols-1 md:grid-cols-7 gap-3 relative">
                  {IDE_TIMELINE.map((t, i) => (
                    <div key={t.year} className="flex md:flex-col items-center gap-3 md:gap-2 relative">
                      <div className="w-14 h-14 rounded-full grid place-items-center font-mono text-xs font-bold shrink-0 border-2 relative z-10" style={{ background: "#080C1F", borderColor: t.color, color: t.color }}>{t.year}</div>
                      <div className="md:text-center flex-1 md:flex-none">
                        <p className="text-[0.78rem] font-bold text-white-f leading-tight">{t.name}</p>
                        <p className="text-[0.65rem] text-muted leading-snug mt-0.5">{t.desc}</p>
                      </div>
                      {i < IDE_TIMELINE.length - 1 && <span className="md:hidden text-white/20 ml-auto">↓</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comparativa Editor vs IDE vs AI-IDE */}
            <div>
              <p className="font-mono text-xs uppercase tracking-wider mb-4 text-cyan">◉ Editor de texto · IDE clásico · IDE con IA</p>
              <div className="bg-[#0D1229] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="grid grid-cols-[1fr_1fr_1fr_1.3fr] bg-white/[0.02] text-[0.65rem] font-mono uppercase tracking-widest text-muted border-b border-white/[0.06]">
                  <div className="px-4 py-3">Qué miras</div>
                  <div className="px-4 py-3 border-l border-white/[0.05]">Editor (Notepad)</div>
                  <div className="px-4 py-3 border-l border-white/[0.05] text-blue">IDE (VS Code)</div>
                  <div className="px-4 py-3 border-l border-white/[0.05] text-cyan">IDE con IA (Cursor)</div>
                </div>
                {IDE_VS.map((row, i) => (
                  <div key={row.cat} className={`grid grid-cols-[1fr_1fr_1fr_1.3fr] text-[0.78rem] ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                    <div className="px-4 py-3 text-white-f font-semibold border-t border-white/[0.04]">{row.cat}</div>
                    <div className="px-4 py-3 text-muted leading-snug border-t border-l border-white/[0.04]">{row.editor}</div>
                    <div className="px-4 py-3 text-white-f/80 leading-snug border-t border-l border-white/[0.04]">{row.ide}</div>
                    <div className="px-4 py-3 text-cyan leading-snug border-t border-l border-white/[0.04]">{row.aiide}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 4. CURSOR DEEP DIVE ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-purple-light uppercase tracking-widest mb-3">Cursor · IDE con IA nativa</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            No es VS Code <span className="text-muted line-through decoration-2">con extensión</span>{" "}
            <span className="bg-gradient-to-r from-purple to-cyan bg-clip-text text-transparent">es un IDE repensado</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10">
            Fork de VS Code con IA en cada capa: chat contextual, composer multi-archivo, agent autónomo, inline edits y tab completion agresivo. El modelo ve todo el repo, no solo el archivo abierto.
          </p>

          {/* Mode tabs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
            {CURSOR_MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                className="rounded-xl px-3 py-4 border transition-all text-center"
                style={{
                  background: activeMode === m.id ? `${m.color}20` : "#151A3A",
                  borderColor: activeMode === m.id ? m.color : "rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-2xl">{m.icon}</p>
                <p className="text-sm font-bold text-white-f mt-1">{m.name}</p>
              </button>
            ))}
          </div>

          {/* Selected mode card */}
          <div className="bg-[#0D1229] border rounded-2xl p-6 md:p-8" style={{ borderColor: `${modeData.color}40` }}>
            <div className="grid md:grid-cols-[1.3fr_1fr] gap-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl grid place-items-center text-3xl" style={{ background: `${modeData.color}20`, border: `1px solid ${modeData.color}60` }}>{modeData.icon}</div>
                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest" style={{ color: modeData.color }}>Modo</p>
                    <h3 className="text-2xl font-bold text-white-f leading-tight">{modeData.name}</h3>
                  </div>
                </div>
                <p className="text-white-f leading-relaxed mb-4">{modeData.desc}</p>
                <div className="bg-[#151A3A] rounded-xl p-4 border border-white/[0.06] mb-3">
                  <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted mb-1">Invocación</p>
                  <p className="font-mono text-[0.78rem]" style={{ color: modeData.color }}>{modeData.trigger}</p>
                </div>
                <div className="p-4 rounded-xl border" style={{ background: `${modeData.color}10`, borderColor: `${modeData.color}30` }}>
                  <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1.5" style={{ color: modeData.color }}>Aplicación BTG</p>
                  <p className="text-[0.78rem] text-white-f italic leading-snug">{modeData.btg}</p>
                </div>
              </div>

              {/* Mock editor */}
              <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#1E1E1E] shadow-2xl">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-[#2D2D30] border-b border-white/[0.04]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-3 font-mono text-[0.62rem] text-white/50">portafolio.py — btg-portafolio · {modeData.name}</span>
                </div>
                <div className="p-4 font-mono text-[0.68rem] leading-relaxed min-h-[260px] text-white/80">
                  <p><span className="text-[#C586C0]">def</span> <span className="text-[#DCDCAA]">calcular_retorno_portafolio</span>(<span className="text-[#9CDCFE]">activos</span>: <span className="text-[#4EC9B0]">list</span>) <span className="text-white/50">-&gt;</span> <span className="text-[#4EC9B0]">float</span>:</p>
                  <p className="text-white/50 pl-4">&quot;&quot;&quot;Retorno ponderado por peso del portafolio.&quot;&quot;&quot;</p>
                  <p className="pl-4"><span className="text-[#C586C0]">if</span> <span className="text-[#C586C0]">not</span> <span className="text-[#9CDCFE]">activos</span>:</p>
                  <p className="pl-8"><span className="text-[#C586C0]">raise</span> <span className="text-[#4EC9B0]">ValueError</span>(<span className="text-[#CE9178]">&quot;Portafolio vacío&quot;</span>)</p>
                  <p className="pl-4"><span className="text-[#9CDCFE]">total_peso</span> = <span className="text-[#DCDCAA]">sum</span>(<span className="text-[#9CDCFE]">a</span>[<span className="text-[#CE9178]">&quot;peso&quot;</span>] <span className="text-[#C586C0]">for</span> <span className="text-[#9CDCFE]">a</span> <span className="text-[#C586C0]">in</span> <span className="text-[#9CDCFE]">activos</span>)</p>
                  <p className="pl-4 relative">
                    <span className="text-[#C586C0]">return</span> <span className="text-[#DCDCAA]">sum</span>(<span className="text-[#9CDCFE]">a</span>[<span className="text-[#CE9178]">&quot;peso&quot;</span>] <span className="text-white/60">*</span> <span className="text-[#9CDCFE]">a</span>[<span className="text-[#CE9178]">&quot;retorno&quot;</span>] <span className="text-[#C586C0]">for</span> <span className="text-[#9CDCFE]">a</span> <span className="text-[#C586C0]">in</span> <span className="text-[#9CDCFE]">activos</span>) <span className="text-white/60">/</span> <span className="text-[#9CDCFE]">total_peso</span>
                    <span className="inline-block w-1.5 h-3.5 ml-1 align-middle animate-blink" style={{ background: modeData.color }} />
                  </p>
                  <div className="mt-4 px-2 py-1.5 rounded bg-white/[0.04] border-l-2" style={{ borderColor: modeData.color }}>
                    <p className="font-mono text-[0.58rem] mb-0.5" style={{ color: modeData.color }}>✦ {modeData.name} sugerencia</p>
                    <p className="text-[0.64rem] text-white/70">Detecté que no manejas pesos negativos — podría permitirlos con validación explícita o rechazarlos. ¿Qué prefieres?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* .cursorrules snippet */}
          <div className="mt-10">
            <p className="font-mono text-xs text-cyan uppercase tracking-wider mb-4">◉ El archivo .cursorrules que viaja con tu repo</p>
            <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#05070f] shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-[#0A0E1C]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded grid place-items-center bg-purple/20 text-purple-light text-[0.7rem] font-bold">.c</span>
                  <span className="font-mono text-[0.68rem] text-white/80">.cursorrules</span>
                  <span className="font-mono text-[0.55rem] px-1.5 py-0.5 rounded bg-cyan/10 text-cyan border border-cyan/30">14 reglas</span>
                </div>
                <span className="font-mono text-[0.58rem] text-white/40">raíz del repo · cargado automáticamente</span>
              </div>
              <pre className="p-5 font-mono text-[0.72rem] leading-relaxed text-white/85 whitespace-pre-wrap overflow-auto">{CURSOR_RULES}</pre>
            </div>
            <p className="text-[0.75rem] text-muted mt-3 italic">Commitear este archivo hace que cualquier analista del equipo tenga el mismo contexto de dominio sin repetir prompts.</p>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 4B. PRIMER EJERCICIO GUIADO EN CURSOR ═══════════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,rgba(91,82,213,0.08),transparent)] pointer-events-none" />
          <div className="relative">
            <p className="font-mono text-[0.72rem] uppercase tracking-widest text-purple-light mb-3">Ejercicio guiado · 10 minutos</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
              Tu <span className="bg-gradient-to-r from-purple-light to-cyan bg-clip-text text-transparent">primer archivo .py</span> en Cursor
            </h2>
            <p className="text-lg text-muted max-w-3xl mb-6">
              De instalar Cursor a tener un commit con mensaje generado por IA, en 8 pasos guiados. Sin experiencia previa en Python ni IDEs — solo necesitas 10 minutos y conexión a internet.
            </p>
            <div className="flex flex-wrap gap-2 mb-10">
              {["Instalación", "Tab Completion", "Chat ⌘+L", "Composer ⌘+I", "Terminal", "Git"].map((chip) => (
                <span key={chip} className="px-2.5 py-1 rounded-full bg-purple/10 border border-purple-light/25 text-[0.65rem] font-mono text-purple-light">{chip}</span>
              ))}
            </div>

            <div className="grid lg:grid-cols-[300px_1fr] gap-6">
              {/* Step timeline */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">Pasos</p>
                  <button
                    onClick={() => setPrimerAuto((a) => !a)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[0.62rem] font-mono transition-all"
                    style={{
                      background: primerAuto ? "rgba(91,82,213,0.15)" : "rgba(255,255,255,0.02)",
                      borderColor: primerAuto ? "rgba(123,115,232,0.5)" : "rgba(255,255,255,0.08)",
                      color: primerAuto ? "#7B73E8" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${primerAuto ? "bg-purple-light animate-pulse-dot" : "bg-white/30"}`} />
                    {primerAuto ? "Auto" : "Pausa"}
                  </button>
                </div>
                {PRIMER_EJERCICIO_STEPS.map((s, i) => {
                  const active = i === primerStep;
                  const past = i < primerStep;
                  return (
                    <button
                      key={s.n}
                      onClick={() => { setPrimerStep(i); setPrimerAuto(false); }}
                      className="w-full flex items-start gap-3 rounded-xl p-3 border transition-all text-left"
                      style={{
                        background: active ? "linear-gradient(135deg, rgba(91,82,213,0.18), rgba(0,229,160,0.06))" : "#151A3A",
                        borderColor: active ? "rgba(123,115,232,0.6)" : past ? "rgba(91,82,213,0.25)" : "rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-full grid place-items-center font-mono text-xs font-bold shrink-0"
                        style={{
                          background: active ? "#7B73E8" : past ? "rgba(91,82,213,0.3)" : "transparent",
                          border: `1.5px solid ${active ? "#7B73E8" : past ? "rgba(91,82,213,0.5)" : "rgba(255,255,255,0.15)"}`,
                          color: active ? "#080C1F" : past ? "#7B73E8" : "rgba(255,255,255,0.5)",
                        }}
                      >
                        {past ? "✓" : s.n}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[0.78rem] font-semibold leading-tight ${active ? "text-white-f" : past ? "text-white-f/70" : "text-muted"}`}>{s.title}</p>
                        {s.keypress && <p className="font-mono text-[0.6rem] text-cyan/70 mt-0.5">{s.keypress}</p>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Main stage */}
              <div className="space-y-4">
                {/* UI Mock por paso */}
                <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#1E1E1E] shadow-2xl relative">
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-[#2D2D30] border-b border-white/[0.04]">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                    <span className="ml-3 font-mono text-[0.62rem] text-white/50">
                      Paso {primerCurrent.n} de 8 · {primerCurrent.title}
                    </span>
                    {primerCurrent.keypress && (
                      <span className="ml-auto font-mono text-[0.58rem] bg-gradient-to-r from-purple/30 to-cyan/20 border border-purple-light/40 rounded px-2 py-0.5 text-purple-light animate-pulse-dot">
                        {primerCurrent.keypress}
                      </span>
                    )}
                  </div>

                  {/* DOWNLOAD mock */}
                  {primerCurrent.ui === "download" && (
                    <div className="p-8 min-h-[360px] bg-gradient-to-br from-[#1E1E1E] via-[#181825] to-[#0D1229] flex flex-col items-center justify-center text-center">
                      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple via-purple-light to-cyan grid place-items-center text-5xl mb-5 shadow-2xl shadow-purple/30">✦</div>
                      <p className="text-3xl font-bold text-white mb-1">Cursor</p>
                      <p className="text-sm text-white/60 mb-6">The AI Code Editor</p>
                      <div className="flex gap-2 mb-4">
                        {[
                          { os: "macOS", tag: "Universal · .dmg" },
                          { os: "Windows", tag: "x64 · .exe" },
                          { os: "Linux", tag: ".deb · .AppImage" },
                        ].map((d, idx) => (
                          <div key={d.os} className={`px-4 py-2.5 rounded-lg border text-left ${idx === 0 ? "bg-purple-light/15 border-purple-light/50" : "bg-white/[0.02] border-white/[0.08]"}`}>
                            <p className="font-mono text-[0.58rem] uppercase tracking-widest text-white/50">{d.os}</p>
                            <p className={`text-[0.72rem] ${idx === 0 ? "text-white font-semibold" : "text-white/70"}`}>{d.tag}</p>
                          </div>
                        ))}
                      </div>
                      <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple to-cyan text-white font-semibold text-sm shadow-lg shadow-purple/30">
                        ⬇ Descargar para macOS
                      </button>
                      <p className="font-mono text-[0.6rem] text-white/30 mt-4">cursor.com · Free Pro Trial 14 días</p>
                    </div>
                  )}

                  {/* WELCOME mock */}
                  {primerCurrent.ui === "welcome" && (
                    <div className="grid grid-cols-[200px_1fr] min-h-[360px]">
                      <div className="bg-[#252526] p-3">
                        <p className="font-mono text-[0.55rem] uppercase tracking-widest text-white/40 mb-2">Start</p>
                        <div className="space-y-1 text-[0.68rem]">
                          <p className="text-purple-light font-semibold">▸ Open Folder…</p>
                          <p className="text-white/60">▸ Clone Repository…</p>
                          <p className="text-white/60">▸ Connect to Remote…</p>
                        </div>
                        <p className="font-mono text-[0.55rem] uppercase tracking-widest text-white/40 mt-4 mb-2">Recent</p>
                        <p className="text-[0.62rem] text-white/50 italic">sin proyectos aún</p>
                      </div>
                      <div className="p-8 flex flex-col items-center justify-center text-center bg-[#1E1E1E]">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-light to-cyan grid place-items-center text-3xl mb-4">📁</div>
                        <p className="text-xl font-bold text-white mb-2">Abre una carpeta</p>
                        <p className="text-[0.75rem] text-white/50 max-w-xs mb-4 leading-snug">Cursor trabaja mejor cuando tiene todo el proyecto como contexto. Una carpeta = un repo = un proyecto.</p>
                        <div className="bg-[#2D2D30] border border-white/[0.08] rounded-lg px-4 py-2 font-mono text-[0.7rem] text-cyan">~/Documents/btg-portafolio/</div>
                        <p className="font-mono text-[0.58rem] text-white/30 mt-3">File → Open Folder… (⌘+O)</p>
                      </div>
                    </div>
                  )}

                  {/* NEWFILE mock */}
                  {primerCurrent.ui === "newfile" && (
                    <div className="grid grid-cols-[220px_1fr] min-h-[360px]">
                      <div className="bg-[#252526] p-3 text-[0.68rem] font-mono relative">
                        <p className="text-white/80 mb-1">▾ BTG-PORTAFOLIO</p>
                        <div className="relative">
                          <p className="text-purple-light pl-3 animate-fadeUp">📄 portafolio.py</p>
                          {/* Context menu mock */}
                          <div className="absolute top-5 left-4 bg-[#1E1E1E] border border-white/[0.12] rounded shadow-2xl w-48 py-1 text-[0.62rem] z-10">
                            <p className="px-3 py-1 text-white/80 hover:bg-purple/30 cursor-pointer">New File…</p>
                            <p className="px-3 py-1 text-white/60">New Folder…</p>
                            <p className="px-3 py-1 text-white/60">Reveal in Finder</p>
                            <div className="h-px bg-white/[0.08] my-1" />
                            <p className="px-3 py-1 text-white/60">Cut</p>
                            <p className="px-3 py-1 text-white/60">Copy</p>
                            <p className="px-3 py-1 text-white/60">Rename…</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 font-mono text-[0.72rem] text-white/80 bg-[#1E1E1E]">
                        <div className="flex text-[0.62rem] bg-[#252526] -m-6 mb-5 border-b border-black/30">
                          <span className="px-3 py-1.5 bg-[#1E1E1E] text-white border-r border-black/30 flex items-center gap-1.5">📄 portafolio.py <span className="text-white/40">×</span></span>
                        </div>
                        <div className="flex">
                          <div className="text-right pr-3 text-white/30 select-none w-8">1</div>
                          <p className="text-[#6A9955]">{primerCurrent.code}<span className="inline-block w-1.5 h-3.5 ml-1 align-middle animate-blink bg-white" /></p>
                        </div>
                        <p className="text-[0.6rem] text-white/40 mt-8 italic">Archivo nuevo · 1 línea · Python 3.11</p>
                      </div>
                    </div>
                  )}

                  {/* TAB COMPLETION mock */}
                  {primerCurrent.ui === "tab" && primerCurrent.code && (
                    <div className="p-6 font-mono text-[0.72rem] leading-relaxed min-h-[360px] bg-[#1E1E1E]">
                      <div className="flex">
                        <div className="text-right pr-3 text-white/30 select-none w-8">
                          <p>1</p><p>2</p><p>3</p><p>4</p>
                        </div>
                        <div className="flex-1 relative">
                          <p className="text-white/40">{"# portafolio.py"}</p>
                          <p className="h-3" />
                          <p className="text-white/80"><span className="text-[#C586C0]">def</span> <span className="text-[#DCDCAA]">calcular_retorno</span>(</p>
                          {/* Ghost suggestion */}
                          <div className="absolute left-0 right-0 top-12 bg-white/[0.03] border-l-2 border-purple-light rounded-r px-3 py-3">
                            <p className="text-white/40 italic text-[0.68rem]">
                              <span className="text-[#9CDCFE]">precio_inicial</span>, <span className="text-[#9CDCFE]">precio_final</span>):
                            </p>
                            <p className="text-white/40 italic text-[0.68rem] pl-4">&quot;&quot;&quot;Retorna el retorno porcentual entre dos precios.&quot;&quot;&quot;</p>
                            <p className="text-white/40 italic text-[0.68rem] pl-4">
                              <span className="text-[#C586C0]">return</span> (<span className="text-[#9CDCFE]">precio_final</span> - <span className="text-[#9CDCFE]">precio_inicial</span>) / <span className="text-[#9CDCFE]">precio_inicial</span> * <span className="text-[#B5CEA8]">100</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <kbd className="font-mono text-[0.6rem] bg-[#2D2D30] border border-white/[0.1] rounded px-2 py-1 text-cyan">Tab</kbd>
                        <span className="text-[0.6rem] text-white/60 self-center">aceptar</span>
                        <kbd className="font-mono text-[0.6rem] bg-[#2D2D30] border border-white/[0.1] rounded px-2 py-1 text-white/50">Esc</kbd>
                        <span className="text-[0.6rem] text-white/60 self-center">rechazar</span>
                      </div>
                    </div>
                  )}

                  {/* CHAT mock */}
                  {primerCurrent.ui === "chat" && (
                    <div className="grid grid-cols-[1.3fr_1fr] min-h-[360px]">
                      <div className="p-5 font-mono text-[0.7rem] bg-[#1E1E1E]">
                        <div className="flex text-[0.62rem] bg-[#252526] -m-5 mb-4 border-b border-black/30">
                          <span className="px-3 py-1.5 bg-[#1E1E1E] text-white border-r border-black/30">📄 portafolio.py</span>
                        </div>
                        <div className="flex">
                          <div className="text-right pr-3 text-white/30 select-none w-8">
                            <p>1</p><p>2</p><p>3</p>
                          </div>
                          <div>
                            <p><span className="text-[#C586C0]">def</span> <span className="text-[#DCDCAA]">calcular_retorno</span>(<span className="text-[#9CDCFE]">precio_inicial</span>, <span className="text-[#9CDCFE]">precio_final</span>):</p>
                            <p className="pl-4 text-white/50">&quot;&quot;&quot;Retorna el retorno porcentual entre dos precios.&quot;&quot;&quot;</p>
                            <p className="pl-4"><span className="text-[#C586C0]">return</span> (<span className="text-[#9CDCFE]">precio_final</span> - <span className="text-[#9CDCFE]">precio_inicial</span>) / <span className="text-[#9CDCFE]">precio_inicial</span> * <span className="text-[#B5CEA8]">100</span></p>
                          </div>
                        </div>
                      </div>
                      {/* Chat panel */}
                      <div className="bg-[#252526] border-l border-black/30 p-3 flex flex-col">
                        <div className="flex items-center gap-2 pb-2 mb-3 border-b border-white/[0.06]">
                          <span className="w-6 h-6 rounded bg-gradient-to-br from-purple to-cyan grid place-items-center text-[0.62rem] font-bold text-white">✦</span>
                          <p className="text-[0.7rem] font-semibold text-white">Chat</p>
                          <span className="ml-auto font-mono text-[0.55rem] text-white/40">claude-sonnet-4.6</span>
                        </div>
                        {/* User message */}
                        <div className="bg-purple-light/15 border border-purple-light/30 rounded-lg rounded-tr-sm p-2 mb-2 ml-4">
                          <p className="text-[0.68rem] text-white/90 leading-snug">¿Qué hace esta función? ¿Cómo la pruebo con precios de Ecopetrol?</p>
                        </div>
                        {/* Assistant reply */}
                        <div className="bg-[#1E1E1E] border border-white/[0.08] rounded-lg rounded-tl-sm p-2.5 text-[0.66rem] text-white/85 leading-snug">
                          <p>La función calcula el <span className="text-cyan font-semibold">cambio porcentual</span> entre dos precios.</p>
                          <p className="mt-1.5">Ejemplo Ecopetrol Q1 2026:</p>
                          <div className="bg-[#0D1229] rounded px-2 py-1 mt-1 font-mono text-[0.62rem]">
                            <p className="text-white/70">calcular_retorno(2050, 2140)</p>
                            <p className="text-cyan"># → 4.39</p>
                          </div>
                        </div>
                        <div className="mt-auto pt-3">
                          <div className="bg-[#1E1E1E] border border-white/[0.08] rounded-lg p-2 flex items-center gap-2">
                            <span className="text-white/30 text-[0.65rem]">Pregunta sobre este archivo…</span>
                            <span className="ml-auto inline-block w-1 h-3 bg-purple-light animate-blink" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* COMPOSER mock */}
                  {primerCurrent.ui === "composer" && (
                    <div className="min-h-[360px] bg-[#1E1E1E]">
                      {/* Big composer overlay */}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-7 h-7 rounded bg-gradient-to-br from-purple to-cyan grid place-items-center text-sm">✦</span>
                          <p className="text-[0.85rem] font-bold text-white">Composer</p>
                          <span className="font-mono text-[0.58rem] px-2 py-0.5 rounded bg-cyan/15 text-cyan border border-cyan/30">multi-archivo</span>
                        </div>
                        <div className="bg-[#2D2D30] border border-white/[0.08] rounded-lg p-3 mb-4">
                          <p className="text-[0.72rem] text-white/85 leading-relaxed italic">
                            &ldquo;Añade una función <span className="text-cyan not-italic">calcular_retorno_portafolio</span> que reciba lista de activos con peso y retorno, y devuelva el retorno ponderado. Crea también <span className="text-cyan not-italic">test_portafolio.py</span> con 3 casos.&rdquo;
                          </p>
                        </div>
                        {/* Proposed changes */}
                        <p className="font-mono text-[0.58rem] uppercase tracking-widest text-white/40 mb-2">Cambios propuestos · revisa antes de aceptar</p>
                        <div className="space-y-1.5">
                          <div className="bg-[#0D1229] border border-[#22C55E]/30 rounded-lg p-2.5 flex items-start gap-3">
                            <span className="text-[#22C55E] font-mono text-[0.65rem] shrink-0">+ editar</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[0.68rem] font-mono text-white/85">src/portafolio.py</p>
                              <p className="text-[0.6rem] text-white/50">+12 líneas · nueva función retorno_portafolio()</p>
                            </div>
                            <span className="font-mono text-[0.58rem] text-[#22C55E]">+12</span>
                          </div>
                          <div className="bg-[#0D1229] border border-[#3A7BD5]/30 rounded-lg p-2.5 flex items-start gap-3">
                            <span className="text-[#3A7BD5] font-mono text-[0.65rem] shrink-0">+ nuevo</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[0.68rem] font-mono text-white/85">tests/test_portafolio.py</p>
                              <p className="text-[0.6rem] text-white/50">+28 líneas · 3 casos pytest con fixtures</p>
                            </div>
                            <span className="font-mono text-[0.58rem] text-[#3A7BD5]">+28</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <button className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple to-cyan text-white text-[0.7rem] font-semibold">Aceptar todo</button>
                          <button className="px-4 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 text-[0.7rem]">Revisar diff</button>
                          <button className="px-4 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 text-[0.7rem]">Rechazar</button>
                          <span className="ml-auto font-mono text-[0.58rem] text-white/40">claude-sonnet-4.6 · 8.4s</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TERMINAL mock */}
                  {primerCurrent.ui === "terminal" && (
                    <div className="min-h-[360px] bg-[#1E1E1E] grid grid-rows-[1fr_auto]">
                      <div className="p-5 font-mono text-[0.72rem] text-white/30 italic">(editor en segundo plano — panel inferior activo)</div>
                      <div className="bg-[#05070f] border-t-2 border-cyan/40">
                        <div className="flex text-[0.6rem] font-mono bg-[#0A0E1C] border-b border-white/[0.06]">
                          <span className="px-3 py-1 text-white/40">Problems</span>
                          <span className="px-3 py-1 text-white/40">Output</span>
                          <span className="px-3 py-1 bg-[#05070f] text-cyan border-t border-l border-r border-cyan/40">Terminal <span className="w-1 h-1 rounded-full bg-cyan inline-block align-middle ml-1" /></span>
                        </div>
                        <div className="p-4 font-mono text-[0.72rem] leading-relaxed min-h-[180px]">
                          <p className="text-white/60"><span className="text-[#00E5A0]">➜</span> btg-portafolio (main) $ python portafolio.py</p>
                          <p className="text-white/85">Retorno Ecopetrol Q1: <span className="text-[#00E5A0]">4.21%</span></p>
                          <p className="text-white/60 mt-2"><span className="text-[#00E5A0]">➜</span> btg-portafolio (main) $ pytest test_portafolio.py</p>
                          <p className="text-white/70">============================= test session starts ==============================</p>
                          <p className="text-white/70">collected <span className="text-cyan">3 items</span></p>
                          <p className="text-white/85 mt-1">test_portafolio.py <span className="text-[#22C55E]">...</span>                                       <span className="text-[#22C55E]">[100%]</span></p>
                          <p className="text-[#22C55E] mt-1">============================== 3 passed in 0.08s ===============================</p>
                          <p className="text-white/60 mt-2"><span className="text-[#00E5A0]">➜</span> btg-portafolio (main) $ <span className="inline-block w-1.5 h-3.5 align-middle animate-blink bg-cyan" /></p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GIT mock */}
                  {primerCurrent.ui === "git" && (
                    <div className="grid grid-cols-[260px_1fr] min-h-[360px]">
                      {/* Source control panel */}
                      <div className="bg-[#252526] p-3">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-mono text-[0.58rem] uppercase tracking-widest text-white/70">Source Control</p>
                          <span className="font-mono text-[0.55rem] text-cyan">2 changes</span>
                        </div>
                        <div className="bg-[#1E1E1E] border border-gold/40 rounded-lg p-2 mb-2 flex items-center gap-2">
                          <span className="text-gold text-sm">✦</span>
                          <p className="text-[0.62rem] text-white/85 leading-tight italic flex-1">{primerCurrent.code}</p>
                        </div>
                        <button className="w-full bg-gradient-to-r from-purple to-cyan text-white text-[0.7rem] font-semibold rounded-lg py-1.5 mb-3">Commit</button>
                        <p className="font-mono text-[0.58rem] uppercase tracking-widest text-white/40 mb-1">Changes</p>
                        <div className="space-y-1 text-[0.62rem] font-mono">
                          <div className="flex items-center gap-2">
                            <span className="text-[#22C55E] w-4 text-center">A</span>
                            <span className="text-white/80 truncate flex-1">src/portafolio.py</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[#22C55E] w-4 text-center">A</span>
                            <span className="text-white/80 truncate flex-1">tests/test_portafolio.py</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-5 bg-[#1E1E1E] flex items-center justify-center">
                        <div className="max-w-sm text-center">
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gold to-orange grid place-items-center text-3xl mb-4">⎇</div>
                          <p className="text-lg font-bold text-white mb-2">Commit generado por IA</p>
                          <p className="text-[0.72rem] text-white/60 mb-3 leading-snug">Cursor analiza el diff y propone un mensaje en formato Conventional Commits. Acéptalo o edítalo.</p>
                          <div className="bg-[#0D1229] border border-white/[0.08] rounded-lg px-3 py-2 font-mono text-[0.72rem] text-cyan">
                            {primerCurrent.code}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status bar */}
                  <div className="flex items-center justify-between px-3 py-1 bg-[#7B73E8] text-white text-[0.58rem] font-mono">
                    <div className="flex items-center gap-3">
                      <span>⎇ main</span><span>●</span><span>Python 3.11</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>UTF-8</span>
                      <span className="bg-white/20 px-1.5 rounded">✦ Cursor</span>
                    </div>
                  </div>
                </div>

                {/* What to do + tip */}
                <div className="grid md:grid-cols-[1fr_240px] gap-3">
                  <div className="bg-[#0D1229] border border-purple-light/30 rounded-2xl p-4">
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-purple-light mb-2">Paso {primerCurrent.n} · qué hacer</p>
                    <p className="text-[0.88rem] text-white-f leading-relaxed">{primerCurrent.what}</p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan/10 to-blue/5 border border-cyan/25 rounded-2xl p-4">
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest text-cyan mb-1.5">💡 Tip</p>
                    <p className="text-[0.72rem] text-white-f/85 leading-snug">{primerCurrent.tip}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setPrimerStep((i) => Math.max(0, i - 1)); setPrimerAuto(false); }}
                    disabled={primerStep === 0}
                    className="w-9 h-9 rounded-lg grid place-items-center border border-white/[0.08] bg-white/[0.02] text-white/70 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 transition-all"
                  >◂</button>
                  <div className="flex-1 flex gap-1">
                    {PRIMER_EJERCICIO_STEPS.map((_, i) => (
                      <div
                        key={i}
                        onClick={() => { setPrimerStep(i); setPrimerAuto(false); }}
                        className="flex-1 h-1.5 rounded-full transition-all cursor-pointer"
                        style={{
                          background: i === primerStep ? "#7B73E8" : i < primerStep ? "rgba(123,115,232,0.4)" : "rgba(255,255,255,0.06)",
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => { setPrimerStep((i) => Math.min(PRIMER_EJERCICIO_STEPS.length - 1, i + 1)); setPrimerAuto(false); }}
                    disabled={primerStep === PRIMER_EJERCICIO_STEPS.length - 1}
                    className="w-9 h-9 rounded-lg grid place-items-center border border-white/[0.08] bg-white/[0.02] text-white/70 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 transition-all"
                  >▸</button>
                  <span className="font-mono text-[0.62rem] text-muted pl-2">{primerStep + 1} / {PRIMER_EJERCICIO_STEPS.length}</span>
                </div>
              </div>
            </div>

            {/* Résumé al completar */}
            <div className="mt-10 bg-gradient-to-br from-[rgba(123,115,232,0.08)] via-[rgba(0,229,160,0.04)] to-transparent border border-purple-light/25 rounded-2xl p-6 md:p-7">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-cyan mb-3">🎯 Qué dominaste al terminar</p>
              <div className="grid md:grid-cols-4 gap-3">
                {[
                  { k: "Proyecto", v: "Abrir carpeta como workspace y crear archivos" },
                  { k: "Escribir", v: "Tab completion con sugerencias en modo ghost text" },
                  { k: "Preguntar", v: "Chat contextual ⌘+L con referencias al archivo" },
                  { k: "Construir", v: "Composer ⌘+I para cambios multi-archivo con diff" },
                ].map((s) => (
                  <div key={s.k} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest text-purple-light mb-1">{s.k}</p>
                    <p className="text-[0.72rem] text-white-f leading-snug">{s.v}</p>
                  </div>
                ))}
              </div>
              <p className="text-[0.78rem] text-muted italic mt-5">
                <span className="text-cyan">→</span> En la siguiente sección verás Claude Code, que extiende esto a agentes autónomos en terminal. Y después, GitHub Copilot para mantener el flujo en repos de BTG.
              </p>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 5. CLAUDE CODE ═══════════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_30%,rgba(0,229,160,0.05),transparent)] pointer-events-none" />
          <div className="relative">
            <p className="font-mono text-[0.72rem] text-cyan uppercase tracking-widest mb-3">Claude Code · CLI agéntica</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
              El analista que <span className="bg-gradient-to-r from-cyan to-orange bg-clip-text text-transparent">vive en tu terminal</span>
            </h2>
            <p className="text-muted text-[0.95rem] max-w-3xl mb-10">
              Claude Code es una CLI de Anthropic que lee tu repo, planifica, edita archivos, corre tests, commitea y abre PRs. Funciona en cualquier editor — es un agente paralelo al IDE.
            </p>

            {/* Terminal simulation */}
            <div className="rounded-2xl overflow-hidden border border-cyan/25 bg-[#05070f] shadow-2xl shadow-cyan/10">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-[#0A0E1C] border-b border-white/[0.06]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                <span className="ml-3 font-mono text-[0.62rem] text-white/50">btg@nodo ~/btg-portafolio (feature/riesgo) $ claude</span>
                <span className="ml-auto flex items-center gap-1.5 text-[0.58rem] font-mono text-cyan">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" />sesión activa
                </span>
              </div>
              <div className="p-5 font-mono text-[0.72rem] leading-relaxed min-h-[320px]">
                {CLAUDE_CODE.map((s, i) => {
                  const active = i === ccStep;
                  const done = i < ccStep;
                  return (
                    <div key={i} className={`transition-all py-2 border-l-2 pl-3 mb-2 ${active ? "bg-white/[0.03]" : ""}`} style={{ borderColor: active ? s.color : done ? `${s.color}40` : "rgba(255,255,255,0.04)", opacity: done || active ? 1 : 0.35 }}>
                      <div className="flex items-start gap-3">
                        <span className={`font-mono text-[0.58rem] font-bold shrink-0 mt-0.5 px-1.5 py-0.5 rounded ${active ? "ring-1" : ""}`} style={{ background: `${s.color}15`, color: s.color }}>{s.step}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/90 text-[0.75rem] mb-1 font-mono">{s.cmd}</p>
                          <p className="text-white/50 text-[0.68rem] leading-snug italic">{s.out}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-4 py-2 border-t border-white/[0.04] bg-[#0A0E1C] flex items-center gap-2">
                <span className="font-mono text-[0.6rem] text-cyan">{">"}</span>
                <div className="flex-1 font-mono text-[0.65rem] text-white/40 italic">
                  {ccStep < CLAUDE_CODE.length - 1 ? "procesando…" : "Próximo turno · dime qué más quieres construir"}
                </div>
                <span className="inline-block w-1.5 h-3 bg-cyan animate-blink align-middle" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3 mt-6">
              {[
                { k: "CLAUDE.md", v: "Contexto persistente del repo (stack, dominio, convenciones) leído en cada sesión.", c: "#E85A1F" },
                { k: "Permisos", v: "Modo read-only fuera del branch actual. Sin acceso a producción por defecto.", c: "#22C55E" },
                { k: "Paralelo", v: "Corre mientras tú haces otra cosa. Ideal para refactors largos y migraciones.", c: "#3A7BD5" },
              ].map((c) => (
                <div key={c.k} className="bg-[#0F1438] border border-white/[0.06] rounded-xl p-4">
                  <p className="font-mono text-[0.58rem] uppercase tracking-widest mb-1.5" style={{ color: c.c }}>{c.k}</p>
                  <p className="text-[0.78rem] text-white-f leading-snug">{c.v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 6. GITHUB COPILOT ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-blue uppercase tracking-widest mb-3">GitHub Copilot · suite Git</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            El <span className="bg-gradient-to-r from-blue to-purple-light bg-clip-text text-transparent">default corporativo</span>{" "}
            para todo BTG
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10">
            No solo autocomplete. En 2026 Copilot es un sistema end-to-end: autocompletado, chat, revisión de PRs, generación de GitHub Actions y documentación automática. Todo integrado al tenant BTG Enterprise.
          </p>

          {/* Capability tabs */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
            {COPILOT_CAPS.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCap(c.id)}
                className="rounded-xl px-3 py-3 border transition-all text-center"
                style={{
                  background: activeCap === c.id ? `${c.color}20` : "#151A3A",
                  borderColor: activeCap === c.id ? c.color : "rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-xl">{c.icon}</p>
                <p className="text-[0.65rem] font-bold text-white-f mt-1 leading-tight">{c.tag}</p>
              </button>
            ))}
          </div>

          <div className="bg-[#0D1229] border rounded-2xl p-6 md:p-8" style={{ borderColor: `${capData.color}40` }}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl grid place-items-center text-3xl" style={{ background: `${capData.color}20`, color: capData.color }}>{capData.icon}</div>
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest" style={{ color: capData.color }}>{capData.tag}</p>
                <h3 className="text-2xl font-bold text-white-f">{capData.name}</h3>
              </div>
            </div>
            <p className="text-white-f leading-relaxed mb-5 text-base">{capData.desc}</p>
            <div className="bg-[#151A3A] rounded-xl p-4 border border-white/[0.06]">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-2" style={{ color: capData.color }}>Caso BTG</p>
              <p className="text-sm text-white-f italic leading-relaxed">{capData.btg}</p>
            </div>
          </div>

          {/* Git flow */}
          <div className="mt-10">
            <p className="font-mono text-xs text-blue uppercase tracking-wider mb-4">◆ Flujo profesional Git · un PR de riesgo de principio a fin</p>
            <div className="bg-[#0D1229] border border-blue/20 rounded-2xl p-6">
              <div className="space-y-2">
                {GIT_FLOW.map((g, i) => (
                  <div key={g.n} className="grid grid-cols-[auto_90px_1fr] gap-3 items-start bg-[#151A3A] border border-white/[0.04] rounded-xl px-4 py-3">
                    <div className="w-7 h-7 rounded-full bg-blue/20 grid place-items-center font-mono font-bold text-blue text-[0.75rem]">{g.n}</div>
                    <p className="font-mono text-xs font-bold text-blue">{g.stage}</p>
                    <div className="min-w-0">
                      <p className="font-mono text-[0.72rem] text-white-f/90 truncate">{g.action}</p>
                      <p className="text-[0.68rem] text-muted leading-snug mt-0.5">{g.gloss}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 7. DASHBOARD HTML ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-gold uppercase tracking-widest mb-3">HTML inteligentes</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            Un archivo <span className="bg-gradient-to-r from-gold to-orange bg-clip-text text-transparent">que es una app</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10">
            Un .html autocontenido con Chart.js y Tailwind desde CDN es suficiente para dashboards ejecutivos: sin backend, sin build, sin deploy. Abres en navegador, lo compartes por Teams, lo subes a SharePoint o a GitHub Pages.
          </p>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6">
            {/* Prompt */}
            <div className="rounded-2xl overflow-hidden border border-gold/25 bg-[#05070f] shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-[#0A0E1C]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded grid place-items-center bg-gold/20 text-gold text-[0.7rem] font-bold">≫</span>
                  <span className="font-mono text-[0.68rem] text-white/80">prompt · dashboard.html</span>
                </div>
                <span className="font-mono text-[0.58rem] text-gold">pegar en Cursor Composer o Copilot</span>
              </div>
              <pre className="p-5 font-mono text-[0.7rem] leading-relaxed text-white/85 whitespace-pre-wrap overflow-auto max-h-[440px]">{DASHBOARD_PROMPT}</pre>
            </div>

            {/* Live dashboard mock */}
            <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0a0a0a] shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-3 font-mono text-[0.62rem] text-white/50">dashboard.html · preview</span>
                </div>
                <span className="font-mono text-[0.58rem] text-gold">Chart.js · Tailwind · 340 LOC</span>
              </div>
              <div className="p-4 bg-black text-white min-h-[440px]">
                {/* KPI cards */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-[#1a1a1a] rounded-lg p-2.5 border border-white/[0.08]">
                    <p className="text-[0.55rem] uppercase tracking-widest text-white/40 mb-0.5">Retorno 30d</p>
                    <p className={`text-lg font-bold ${retPortafolio >= 0 ? "text-white" : "text-red-400"}`}>{retPortafolio.toFixed(2)}%</p>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-lg p-2.5 border border-white/[0.08]">
                    <p className="text-[0.55rem] uppercase tracking-widest text-white/40 mb-0.5">Vol. ponderada</p>
                    <p className="text-lg font-bold text-white">{volPonderada.toFixed(1)}%</p>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-lg p-2.5 border border-white/[0.08]">
                    <p className="text-[0.55rem] uppercase tracking-widest text-white/40 mb-0.5">Sharpe aprox.</p>
                    <p className="text-lg font-bold text-white">{sharpe}</p>
                  </div>
                </div>

                {/* Donut + bars */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {/* Donut */}
                  <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/[0.08]">
                    <p className="text-[0.58rem] uppercase tracking-widest text-white/50 mb-2">Composición del portafolio</p>
                    <div className="flex items-center justify-center">
                      <svg viewBox="-60 -60 120 120" className="w-[120px] h-[120px]">
                        {(() => {
                          let acc = 0;
                          return DASHBOARD_PORTFOLIO.map((a, i) => {
                            const start = acc / totalPeso;
                            acc += a.peso;
                            const end = acc / totalPeso;
                            const a1 = start * 2 * Math.PI - Math.PI / 2;
                            const a2 = end * 2 * Math.PI - Math.PI / 2;
                            const large = end - start > 0.5 ? 1 : 0;
                            const r = 45, rIn = 28;
                            const x1 = r * Math.cos(a1), y1 = r * Math.sin(a1);
                            const x2 = r * Math.cos(a2), y2 = r * Math.sin(a2);
                            const x3 = rIn * Math.cos(a2), y3 = rIn * Math.sin(a2);
                            const x4 = rIn * Math.cos(a1), y4 = rIn * Math.sin(a1);
                            const grey = 20 + i * 20;
                            return (
                              <path
                                key={a.ticker}
                                d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 ${large} 0 ${x4} ${y4} Z`}
                                fill={`rgb(${grey},${grey},${grey})`}
                                stroke="#000"
                                strokeWidth="1"
                              />
                            );
                          });
                        })()}
                      </svg>
                    </div>
                  </div>
                  {/* Bars */}
                  <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/[0.08]">
                    <p className="text-[0.58rem] uppercase tracking-widest text-white/50 mb-2">Retorno 30d por activo</p>
                    <div className="space-y-1">
                      {DASHBOARD_PORTFOLIO.map((a) => {
                        const max = 5;
                        const pct = Math.min(Math.abs(a.r30) / max, 1) * 100;
                        return (
                          <div key={a.ticker} className="grid grid-cols-[32px_1fr_34px] gap-1.5 items-center text-[0.58rem] font-mono">
                            <span className="text-white/70">{a.ticker}</span>
                            <div className="relative h-3 bg-white/[0.04] rounded-sm">
                              <div
                                className="absolute top-0 bottom-0 rounded-sm"
                                style={{
                                  width: `${pct}%`,
                                  background: a.r30 >= 0 ? "#fff" : "#555",
                                  left: a.r30 >= 0 ? "50%" : `${50 - pct}%`,
                                }}
                              />
                              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />
                            </div>
                            <span className={`text-right ${a.r30 >= 0 ? "text-white" : "text-white/50"}`}>{a.r30 > 0 ? "+" : ""}{a.r30.toFixed(1)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-[#1a1a1a] rounded-lg border border-white/[0.08] overflow-hidden">
                  <div className="grid grid-cols-[50px_1fr_50px_70px_60px] text-[0.55rem] font-mono uppercase tracking-widest text-white/40 border-b border-white/[0.05] px-2 py-1">
                    <span>Ticker</span><span>Nombre</span><span className="text-right">Peso</span><span className="text-right">Precio</span><span className="text-right">Vol</span>
                  </div>
                  {DASHBOARD_PORTFOLIO.map((a) => (
                    <div key={a.ticker} className="grid grid-cols-[50px_1fr_50px_70px_60px] text-[0.62rem] font-mono text-white/85 px-2 py-1 border-b border-white/[0.04] last:border-0">
                      <span className="text-white font-semibold">{a.ticker}</span>
                      <span className="truncate">{a.name}</span>
                      <span className="text-right">{a.peso}%</span>
                      <span className="text-right">${a.precio.toLocaleString("es-CO")}</span>
                      <span className="text-right text-white/60">{a.vol}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Why autocontenido */}
          <div className="mt-8 grid md:grid-cols-4 gap-3">
            {[
              { k: "Sin backend", v: "Abre en browser · no requiere servidor · ni auth.", c: "#D4AF4C" },
              { k: "Compartible", v: "Adjunto · Teams · SharePoint · GitHub Pages.", c: "#E85A1F" },
              { k: "Offline", v: "CDN cacheado = funciona sin internet tras la primera carga.", c: "#22C55E" },
              { k: "Auditable", v: "Todo el código visible en un solo archivo — cero caja negra.", c: "#5B52D5" },
            ].map((s) => (
              <div key={s.k} className="bg-[#151A3A] border border-white/[0.06] rounded-xl p-4">
                <p className="font-mono text-[0.58rem] uppercase tracking-widest mb-1.5" style={{ color: s.c }}>{s.k}</p>
                <p className="text-[0.75rem] text-white-f leading-snug">{s.v}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 8. EJERCICIOS PRÁCTICOS ═══════════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_25%_30%,rgba(91,82,213,0.08),transparent),radial-gradient(ellipse_60%_60%_at_80%_70%,rgba(0,229,160,0.07),transparent)] pointer-events-none" />
          <div className="relative">
            <p className="font-mono text-[0.72rem] text-cyan uppercase tracking-widest mb-3">Ejercicios prácticos · hands-on</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
              De Cursor al <span className="bg-gradient-to-r from-purple-light via-cyan to-gold bg-clip-text text-transparent">dashboard en producción</span>
            </h2>
            <p className="text-lg text-muted max-w-3xl mb-10">
              Tres laboratorios encadenados: configuras el IDE, generas el módulo de riesgo con Claude Code y despliegas un dashboard con Copilot Actions. Todo en un mismo repositorio BTG.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {EJERCICIOS.map((e, i) => {
                const active = i === exIdx;
                const done = (exDone[e.id] ?? []).length;
                const total = e.steps.length;
                return (
                  <button
                    key={e.id}
                    onClick={() => { setExIdx(i); setExStepIdx(0); }}
                    className="text-left rounded-2xl border p-4 transition-all relative overflow-hidden group"
                    style={{
                      background: active ? `linear-gradient(135deg, ${e.color}22, ${e.accent}08)` : "#151A3A",
                      borderColor: active ? `${e.color}80` : "rgba(255,255,255,0.06)",
                      boxShadow: active ? `0 10px 30px ${e.color}25` : "none",
                    }}
                  >
                    <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40" style={{ background: e.color }} />
                    <div className="relative flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl grid place-items-center text-2xl shrink-0" style={{ background: `${e.color}22`, color: e.color }}>{e.icon}</div>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[0.58rem] uppercase tracking-widest mb-0.5" style={{ color: e.color }}>{e.tag} · {e.duration}</p>
                        <p className="text-sm font-bold text-white-f leading-tight mb-1">{e.title}</p>
                        <p className="text-[0.68rem] text-muted leading-snug">{e.tool}</p>
                      </div>
                    </div>
                    <div className="relative mt-3 flex items-center gap-2">
                      <div className="h-1 flex-1 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full transition-all duration-500" style={{ width: `${(done / total) * 100}%`, background: e.color }} />
                      </div>
                      <span className="font-mono text-[0.6rem] text-muted shrink-0">{done}/{total}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-[#0D1229] border rounded-3xl overflow-hidden" style={{ borderColor: `${currentEx.color}35` }}>
              <div
                className="px-6 md:px-8 py-6 border-b border-white/[0.06] grid gap-5 md:grid-cols-[auto_1fr_auto] items-center"
                style={{ background: `linear-gradient(90deg, ${currentEx.color}15, transparent 70%)` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl grid place-items-center text-3xl" style={{ background: `${currentEx.color}20`, border: `1px solid ${currentEx.color}50` }}>{currentEx.icon}</div>
                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest" style={{ color: currentEx.color }}>{currentEx.tag} · {currentEx.duration}</p>
                    <h3 className="text-xl md:text-2xl font-bold text-white-f leading-tight">{currentEx.title}</h3>
                    <p className="text-[0.78rem] text-muted italic">{currentEx.subtitle}</p>
                  </div>
                </div>
                <div className="hidden md:block" />
                <div className="bg-[#151A3A] rounded-2xl px-4 py-3 border border-white/[0.06] min-w-[160px]">
                  <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted mb-1">Progreso</p>
                  <p className="text-xl font-bold font-mono" style={{ color: currentEx.color }}>{progressPct}%</p>
                  <div className="mt-1.5 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full transition-all duration-500" style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${currentEx.color}, ${currentEx.accent})` }} />
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-[1fr_1.1fr] gap-0">
                <div className="p-6 md:p-8 border-r border-white/[0.04]">
                  <div className="grid grid-cols-1 gap-3 mb-6">
                    <div className="bg-[#151A3A] border border-white/[0.05] rounded-xl p-4">
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1.5" style={{ color: currentEx.color }}>🎯 Objetivo</p>
                      <p className="text-[0.82rem] text-white-f leading-snug">{currentEx.objective}</p>
                    </div>
                    <div className="bg-white/[0.015] border border-white/[0.04] rounded-xl p-4">
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted mb-1.5">🔑 Prerrequisitos</p>
                      <p className="text-[0.75rem] text-muted leading-snug">{currentEx.prereq}</p>
                    </div>
                  </div>

                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-3">Pasos · marca a medida que los completas</p>
                  <div className="space-y-2">
                    {currentEx.steps.map((s, i) => {
                      const done = (exDone[currentEx.id] ?? []).includes(s.n);
                      const active = exStepIdx === i;
                      return (
                        <div
                          key={s.n}
                          onClick={() => setExStepIdx(i)}
                          className="group rounded-xl border p-3.5 cursor-pointer transition-all"
                          style={{
                            background: active ? `${currentEx.color}10` : "#151A3A",
                            borderColor: active ? `${currentEx.color}55` : done ? `${currentEx.accent}40` : "rgba(255,255,255,0.06)",
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={(ev) => { ev.stopPropagation(); toggleStepDone(s.n); }}
                              className="w-7 h-7 rounded-full grid place-items-center font-mono text-xs font-bold shrink-0 transition-all"
                              style={{
                                background: done ? currentEx.color : "transparent",
                                border: `1.5px solid ${done ? currentEx.color : `${currentEx.color}60`}`,
                                color: done ? "#080C1F" : currentEx.color,
                              }}
                            >
                              {done ? "✓" : s.n}
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[0.82rem] font-semibold leading-tight ${done ? "text-muted line-through" : "text-white-f"}`}>{s.action}</p>
                              <p className="text-[0.7rem] text-muted leading-snug mt-0.5">{s.detail}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 md:p-8 bg-[#080C1F]">
                  <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#05070f] shadow-2xl mb-5">
                    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06] bg-[#0A0E1C]">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                      <span className="ml-3 font-mono text-[0.62rem] text-white/50">{currentEx.tool} · paso {exStepIdx + 1} de {currentEx.steps.length}</span>
                      <span className="ml-auto flex items-center gap-1.5 text-[0.58rem] font-mono" style={{ color: currentEx.color }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: currentEx.color }} />
                        LIVE
                      </span>
                    </div>
                    <div className="p-4 font-mono text-[0.72rem] leading-relaxed min-h-[210px]">
                      <p className="text-white/40 mb-1">
                        <span style={{ color: currentEx.color }}>btg@nodo</span>
                        <span className="text-white/40"> ~/btg-portafolio</span>
                        <span className="text-white/40"> $</span>
                      </p>
                      <p className="text-white/80 mb-3">
                        <span style={{ color: currentEx.accent }}>▸ </span>
                        {currentEx.steps[exStepIdx].action}
                      </p>
                      <p className="text-white/60 mb-3 whitespace-pre-wrap">{currentEx.steps[exStepIdx].detail}</p>
                      <div className="border-t border-white/[0.05] pt-3 mt-2">
                        <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted mb-1.5">✦ Output esperado</p>
                        <p className="text-[0.78rem] leading-snug" style={{ color: currentEx.color }}>{currentEx.steps[exStepIdx].output}</p>
                      </div>
                    </div>
                    <div className="px-3 py-2 bg-[#0A0E1C] border-t border-white/[0.04] flex items-center gap-3">
                      <button
                        onClick={() => setExStepIdx((i) => Math.max(0, i - 1))}
                        disabled={exStepIdx === 0}
                        className="w-7 h-7 rounded grid place-items-center text-white/60 hover:text-white-f hover:bg-white/5 disabled:opacity-30 transition-all"
                      >◂</button>
                      <div className="flex-1 flex gap-1">
                        {currentEx.steps.map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 h-1 rounded-full transition-all cursor-pointer"
                            onClick={() => setExStepIdx(i)}
                            style={{ background: i === exStepIdx ? currentEx.color : i < exStepIdx ? `${currentEx.color}55` : "rgba(255,255,255,0.08)" }}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => setExStepIdx((i) => Math.min(currentEx.steps.length - 1, i + 1))}
                        disabled={exStepIdx === currentEx.steps.length - 1}
                        className="w-7 h-7 rounded grid place-items-center text-white/60 hover:text-white-f hover:bg-white/5 disabled:opacity-30 transition-all"
                      >▸</button>
                    </div>
                  </div>

                  <div className="rounded-xl border p-4 mb-3" style={{ borderColor: `${currentEx.accent}30`, background: `${currentEx.accent}08` }}>
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-2" style={{ color: currentEx.accent }}>✓ Evidencia de éxito · entregables</p>
                    <ul className="space-y-1.5">
                      {currentEx.evidence.map((e, i) => (
                        <li key={i} className="flex gap-2 items-start text-[0.75rem] text-white-f/85 leading-snug">
                          <span style={{ color: currentEx.accent }}>▸</span>
                          <span>{e}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex gap-3 items-start bg-[rgba(34,197,94,0.05)] border border-[rgba(34,197,94,0.2)] rounded-lg p-3">
                      <span className="text-sm">✅</span>
                      <p className="text-[0.72rem] text-white-f/85 leading-snug">{currentEx.common.ok}</p>
                    </div>
                    <div className="flex gap-3 items-start bg-[rgba(232,90,31,0.05)] border border-[rgba(232,90,31,0.2)] rounded-lg p-3">
                      <span className="text-sm">⚠</span>
                      <p className="text-[0.72rem] text-white-f/85 leading-snug">{currentEx.common.trap}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 9. COMPARATIVA ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-3">Comparativa · ¿cuándo usar cada una?</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            Tres herramientas, <span className="bg-gradient-to-r from-orange to-purple-light bg-clip-text text-transparent">un stack BTG</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10">
            No compiten — se complementan. Cursor para features nuevos, Claude Code para operación sobre muchos repos, Copilot como default del equipo. Úsalos juntos y maximizas la productividad.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {COMPARATIVA.map((c) => (
              <div key={c.tool} className="bg-[#0D1229] border rounded-2xl p-5 transition-all hover:-translate-y-1" style={{ borderColor: `${c.color}40` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl grid place-items-center text-2xl" style={{ background: `${c.color}22`, color: c.color }}>{c.icon}</div>
                  <div>
                    <p className="text-lg font-bold text-white-f leading-tight">{c.tool}</p>
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">{c.when}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1.5" style={{ color: c.color }}>✓ Fortalezas</p>
                  <ul className="space-y-1">
                    {c.pros.map((p, i) => (
                      <li key={i} className="flex gap-2 text-[0.72rem] text-white-f/85 leading-snug">
                        <span style={{ color: c.color }}>▸</span><span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted mb-1.5">✗ Limitaciones</p>
                  <ul className="space-y-1">
                    {c.cons.map((p, i) => (
                      <li key={i} className="flex gap-2 text-[0.7rem] text-muted leading-snug">
                        <span>◦</span><span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 border-t border-white/[0.06]">
                  <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted mb-1">Perfil ideal</p>
                  <p className="text-[0.72rem] text-white-f italic leading-snug">{c.fit}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 9B. PANORAMA ECOSISTEMA ABRIL 2026 ═══════════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_20%,rgba(91,82,213,0.08),transparent),radial-gradient(ellipse_50%_50%_at_80%_80%,rgba(0,212,229,0.06),transparent)] pointer-events-none" />

          <div className="relative">
            <p className="font-mono text-[0.72rem] text-purple-light uppercase tracking-widest mb-3">Panorama · abril 2026</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
              El ecosistema completo: <span className="bg-gradient-to-r from-purple-light via-cyan to-gold bg-clip-text text-transparent">21 herramientas, 5 categorías, 6 casos reales</span>
            </h2>
            <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
              Hasta aquí trabajamos con Cursor, Claude Code y GitHub Copilot — el núcleo. Pero el mercado se mueve rápido: Gemini 3 se liberó el 15-abr, Firebase Studio fue sunset el 19-mar, Devin 2.0 bajó a USD 20/mes. Este es el mapa vivo — con precios, ejemplos concretos y flujos end-to-end — que un analista BTG debería conocer a abril de 2026.
            </p>

            {/* Hero stats del ecosistema */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
              {[
                { n: "21", l: "Herramientas", c: "#5B52D5" },
                { n: "5", l: "Categorías", c: "#3A7BD5" },
                { n: "6", l: "Casos reales compuestos", c: "#00D4E5" },
                { n: "3", l: "On-prem (P-III+)", c: "#22C55E" },
                { n: "abr 26", l: "Datos verificados", c: "#E85A1F" },
              ].map((s) => (
                <div key={s.l} className="bg-[#151A3A] border rounded-2xl p-4 text-center" style={{ borderColor: `${s.c}25` }}>
                  <p className="text-2xl font-bold" style={{ color: s.c }}>{s.n}</p>
                  <p className="text-[0.65rem] text-muted uppercase tracking-widest mt-1">{s.l}</p>
                </div>
              ))}
            </div>

            {/* Categorías — tarjetas explicativas */}
            <div className="grid md:grid-cols-5 gap-3 mb-8">
              {ECOSISTEMA_CATS.map((c) => {
                const active = ecoCat === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setEcoCat(active ? "all" : c.id)}
                    className="text-left rounded-2xl p-4 border transition-all hover:-translate-y-0.5"
                    style={{
                      background: active ? `linear-gradient(135deg, ${c.color}22, ${c.color}08)` : "#0D1229",
                      borderColor: active ? c.color : `${c.color}25`,
                      boxShadow: active ? `0 0 0 1px ${c.color}40 inset` : undefined,
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-2xl" style={{ color: c.color }}>{c.icon}</div>
                      <span className="font-mono text-[0.6rem] px-2 py-0.5 rounded-full" style={{ background: `${c.color}15`, color: c.color }}>
                        {ecoCounts[c.id]}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white-f leading-tight mb-1">{c.name}</p>
                    <p className="text-[0.68rem] text-white-f/80 leading-snug mb-2 italic">{c.headline}</p>
                    <p className="text-[0.65rem] text-muted leading-snug">{c.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Filtro activo + all */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEcoCat("all")}
                  className="font-mono text-[0.65rem] px-3 py-1.5 rounded-full border transition-all"
                  style={{
                    background: ecoCat === "all" ? "rgba(255,255,255,0.08)" : "transparent",
                    borderColor: ecoCat === "all" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
                    color: ecoCat === "all" ? "#F5F7FF" : "#8892B0",
                  }}
                >
                  TODAS · {ECOSISTEMA_TOOLS.length}
                </button>
                <span className="text-[0.65rem] text-muted font-mono">
                  {ecoCat === "all" ? "→ mostrando ecosistema completo" : `→ filtrando: ${ECOSISTEMA_CATS.find((c) => c.id === ecoCat)?.name}`}
                </span>
              </div>
              <p className="font-mono text-[0.6rem] text-muted uppercase tracking-widest">
                Click en cualquier tarjeta de categoría para filtrar
              </p>
            </div>

            {/* Grid de herramientas */}
            <div className="grid md:grid-cols-2 gap-3">
              {ecoFiltered.map((t) => {
                const cat = ECOSISTEMA_CATS.find((c) => c.id === t.cat)!;
                const badge = ECO_STATUS_BADGES[t.status];
                const isHover = ecoHover === t.id;
                return (
                  <div
                    key={t.id}
                    onMouseEnter={() => setEcoHover(t.id)}
                    onMouseLeave={() => setEcoHover(null)}
                    className="relative bg-[#0D1229] border rounded-2xl p-5 transition-all"
                    style={{
                      borderColor: isHover ? cat.color : `${cat.color}20`,
                      boxShadow: isHover ? `0 8px 32px ${cat.color}22, 0 0 0 1px ${cat.color}55 inset` : undefined,
                      transform: isHover ? "translateY(-2px)" : undefined,
                    }}
                  >
                    {/* Left bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl" style={{ background: cat.color }} />

                    {/* Header */}
                    <div className="flex items-start gap-4 mb-3 pl-2">
                      <div
                        className="w-12 h-12 rounded-xl grid place-items-center text-2xl shrink-0"
                        style={{ background: `${cat.color}20`, color: cat.color, border: `1px solid ${cat.color}40` }}
                      >
                        {t.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-base font-bold text-white-f leading-tight">{t.name}</p>
                          <span
                            className="font-mono text-[0.54rem] px-1.5 py-0.5 rounded uppercase tracking-widest"
                            style={{ background: `${badge.color}18`, color: badge.color, border: `1px solid ${badge.color}35` }}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mt-0.5">
                          {t.vendor} · <span style={{ color: cat.color }}>{cat.name}</span>
                        </p>
                      </div>
                    </div>

                    {/* Tagline */}
                    <p className="text-[0.82rem] text-white-f/90 font-medium italic leading-snug mb-3 pl-2">
                      &ldquo;{t.tagline}&rdquo;
                    </p>

                    {/* Detail */}
                    <p className="text-[0.74rem] text-white-f/75 leading-relaxed mb-3 pl-2">
                      {t.detail}
                    </p>

                    {/* Example — abril 2026 */}
                    <div
                      className="pl-2 pr-2 py-2 mb-3 rounded-lg border-l-2"
                      style={{ borderColor: cat.color, background: `${cat.color}0A` }}
                    >
                      <p className="font-mono text-[0.54rem] uppercase tracking-widest mb-1" style={{ color: cat.color }}>
                        ▸ Ejemplo real
                      </p>
                      <p className="text-[0.72rem] text-white-f/85 leading-relaxed">{t.example}</p>
                    </div>

                    {/* BTG use + price */}
                    <div className="pl-2 space-y-2">
                      <div className="flex gap-2 items-start">
                        <span className="font-mono text-[0.55rem] text-gold uppercase tracking-widest shrink-0 mt-0.5">BTG</span>
                        <p className="text-[0.72rem] text-white-f/85 leading-snug">{t.btg}</p>
                      </div>
                      <div className="flex gap-2 items-start">
                        <span className="font-mono text-[0.55rem] text-cyan uppercase tracking-widest shrink-0 mt-0.5">$</span>
                        <p className="text-[0.72rem] text-muted leading-snug">{t.price}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ────── Casos reales · Cómo se combinan ────── */}
            <div className="mt-14">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-[0.7rem] text-cyan uppercase tracking-widest">Casos reales · abril 2026</span>
                <span className="h-[1px] flex-1 bg-gradient-to-r from-cyan/40 to-transparent" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white-f mb-3 leading-tight">
                El valor está en la <span className="bg-gradient-to-r from-cyan via-purple-light to-gold bg-clip-text text-transparent">combinación</span>
              </h3>
              <p className="text-[0.88rem] text-muted mb-6 max-w-3xl leading-relaxed">
                Ninguna herramienta sola resuelve un problema de negocio. Estos 6 casos muestran cómo se encadenan en flujos end-to-end que los analistas BTG pueden montar hoy — con tiempos, costos y salidas concretas.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {CASOS_ECOSISTEMA.map((c) => (
                  <div
                    key={c.n}
                    className="bg-[#0D1229] border rounded-2xl p-5 transition-all hover:-translate-y-0.5"
                    style={{ borderColor: `${c.color}30` }}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-9 h-9 rounded-lg grid place-items-center shrink-0 font-mono text-xs"
                        style={{ background: `${c.color}20`, color: c.color, border: `1px solid ${c.color}40` }}
                      >
                        {String(c.n).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[0.95rem] font-bold text-white-f leading-tight mb-1">{c.title}</p>
                        <p className="text-[0.72rem] text-white-f/70 leading-snug italic">&ldquo;{c.scenario}&rdquo;</p>
                      </div>
                    </div>

                    {/* Flujo */}
                    <div className="mt-4 mb-4">
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-2" style={{ color: c.color }}>Flujo end-to-end</p>
                      <div className="space-y-1.5">
                        {c.flow.map((step, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div
                              className="w-5 h-5 rounded-full grid place-items-center font-mono text-[0.55rem] shrink-0"
                              style={{ background: `${c.color}15`, color: c.color, border: `1px solid ${c.color}30` }}
                            >
                              {i + 1}
                            </div>
                            <div className="flex-1 min-w-0 flex items-baseline gap-2 flex-wrap">
                              <span className="font-mono text-[0.7rem] font-bold shrink-0" style={{ color: c.color }}>{step.tool}</span>
                              <span className="text-[0.7rem] text-white-f/70 leading-snug">{step.role}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Impact */}
                    <div
                      className="rounded-lg p-2.5 border"
                      style={{ background: `${c.color}12`, borderColor: `${c.color}30` }}
                    >
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1" style={{ color: c.color }}>⚡ Impacto</p>
                      <p className="text-[0.72rem] text-white-f/90 leading-snug">{c.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Matriz de decisión */}
            <div className="mt-14 bg-gradient-to-br from-[#0F1438] via-[#0D1229] to-[#080C1F] border border-white/[0.08] rounded-3xl p-7 md:p-9">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-[0.7rem] text-orange uppercase tracking-widest">Matriz de decisión</span>
                <span className="h-[1px] flex-1 bg-gradient-to-r from-orange/40 to-transparent" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white-f mb-3 leading-tight">
                Si tu situación es X… <span className="bg-gradient-to-r from-orange to-gold bg-clip-text text-transparent">entonces abre Y</span>
              </h3>
              <p className="text-[0.85rem] text-muted mb-6 max-w-3xl leading-relaxed">
                La peor decisión en IA es quedarse bloqueado eligiendo herramienta. Este cuadro te da el disparador primario: si el caso coincide, abre esa herramienta y muévete. Lo demás es afinación.
              </p>

              <div className="grid md:grid-cols-2 gap-2">
                {ECO_DECISION.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-xl p-3 border transition-all hover:scale-[1.01]"
                    style={{ background: `${d.color}08`, borderColor: `${d.color}25` }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg grid place-items-center font-mono text-xs shrink-0"
                      style={{ background: `${d.color}22`, color: d.color, border: `1px solid ${d.color}40` }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.78rem] text-white-f/90 leading-snug">{d.trigger}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted mb-0.5">→ abre</p>
                      <p className="text-[0.78rem] font-bold leading-tight" style={{ color: d.color }}>{d.tool}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Principios de elección */}
            <div className="mt-10 grid md:grid-cols-3 gap-3">
              {[
                {
                  k: "Regla 1 · criterio de datos",
                  v: "Antes de la herramienta, clasifica la data. P-I / II → cualquier SaaS. P-III+ → solo on-prem (DeepSeek local + Docling) o ADA con masking.",
                  c: "#22C55E",
                },
                {
                  k: "Regla 2 · el costo real no es la licencia",
                  v: "Es el costo de migrar flujos, retrenar al equipo y mantener governance. Una herramienta gratis mal adoptada cuesta más que Cursor Business.",
                  c: "#D4AF4C",
                },
                {
                  k: "Regla 3 · stack, no zoo",
                  v: "No colecciones herramientas. Elige 3–5 que cubren el 90% y domina esas. El otro 10% se resuelve con chat o con Claude Code en CLI.",
                  c: "#5B52D5",
                },
              ].map((r) => (
                <div key={r.k} className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-5">
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-2" style={{ color: r.c }}>{r.k}</p>
                  <p className="text-[0.82rem] text-white-f/90 leading-relaxed">{r.v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 9C. PRIMEROS EJERCICIOS · QUICK WINS ═══════════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_30%,rgba(0,212,229,0.06),transparent),radial-gradient(ellipse_50%_40%_at_80%_70%,rgba(212,175,76,0.05),transparent)] pointer-events-none" />

          <div className="relative">
            <p className="font-mono text-[0.72rem] text-cyan uppercase tracking-widest mb-3">Primeros ejercicios · quick wins</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
              10 tareas reales de BTG que <span className="bg-gradient-to-r from-cyan via-purple-light to-gold bg-clip-text text-transparent">ahora toman minutos</span>
            </h2>
            <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
              Antes de entrar al taller grande del dashboard, diez ejercicios cortos en tres tandas: tres con el stack core (NotebookLM, ChatGPT, LlamaParse), tres con DeepSeek (web, offline con Ollama y circular SFC) y cuatro en línea con DeepSeek + Kimi — sin descargas, sin tarjeta de crédito. ~2h 30 min en total, todo abrible desde tu laptop hoy.
            </p>

            {/* Leyenda */}
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">⭐ 15m · research</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">⭐⭐ 20m · dashboard</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">⭐⭐⭐ 25m · crédito</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-green-400 px-3 py-1.5 rounded-full bg-green-500/8 border border-green-500/25">⭐ 8m · chat DeepSeek</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-green-400 px-3 py-1.5 rounded-full bg-green-500/8 border border-green-500/25">⭐ 12m · Ollama offline</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-green-400 px-3 py-1.5 rounded-full bg-green-500/8 border border-green-500/25">⭐ 10m · circular SFC</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-emerald-300 px-3 py-1.5 rounded-full bg-emerald-500/8 border border-emerald-500/25">⭐ 10m · benchmark 3×</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-emerald-300 px-3 py-1.5 rounded-full bg-emerald-500/8 border border-emerald-500/25">⭐ 15m · Kimi 280pp</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-emerald-300 px-3 py-1.5 rounded-full bg-emerald-500/8 border border-emerald-500/25">⭐ 12m · balance PDF</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-emerald-300 px-3 py-1.5 rounded-full bg-emerald-500/8 border border-emerald-500/25">⭐ 12m · due diligence</span>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
              {ECO_EJERCICIOS.map((e) => (
                <div
                  key={e.n}
                  className="relative bg-[#0D1229] border rounded-2xl overflow-hidden flex flex-col"
                  style={{ borderColor: `${e.color}30` }}
                >
                  {/* Header ribbon */}
                  <div
                    className="px-5 py-4 flex items-start gap-3 border-b"
                    style={{
                      background: `linear-gradient(135deg, ${e.color}18, ${e.color}06)`,
                      borderColor: `${e.color}25`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl grid place-items-center shrink-0 text-xl font-bold"
                      style={{ background: `${e.color}25`, color: e.color, border: `1px solid ${e.color}50` }}
                    >
                      {String(e.n).padStart(2, "0")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[0.7rem]" style={{ color: e.color }}>{e.level}</span>
                        <span className="font-mono text-[0.55rem] uppercase tracking-widest text-muted">{e.time}</span>
                        <span className="font-mono text-[0.55rem] uppercase tracking-widest px-1.5 py-0.5 rounded" style={{ background: `${e.color}15`, color: e.color }}>
                          BTG · {e.n === 1 ? "Research" : e.n === 2 ? "Portafolio" : "Crédito"}
                        </span>
                      </div>
                      <p className="text-[0.95rem] font-bold text-white-f leading-tight">{e.title}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Tools */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {e.tools.map((tool) => (
                        <span
                          key={tool.name}
                          className="font-mono text-[0.58rem] uppercase tracking-wider px-2 py-1 rounded-md"
                          style={{ background: `${tool.color}18`, color: tool.color, border: `1px solid ${tool.color}35` }}
                        >
                          {tool.name}
                        </span>
                      ))}
                    </div>

                    {/* Context */}
                    <div className="mb-3">
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1" style={{ color: e.color }}>Contexto BTG</p>
                      <p className="text-[0.75rem] text-white-f/85 leading-relaxed italic">&ldquo;{e.context}&rdquo;</p>
                    </div>

                    {/* Why */}
                    <div className="mb-4 bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1 text-gold">Por qué esta combinación</p>
                      <p className="text-[0.72rem] text-white-f/80 leading-snug">{e.why}</p>
                    </div>

                    {/* Steps */}
                    <div className="mb-4">
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-2" style={{ color: e.color }}>Pasos</p>
                      <ol className="space-y-2">
                        {e.steps.map((step) => (
                          <li key={step.s} className="flex gap-2.5 items-start">
                            <span
                              className="w-5 h-5 rounded-full grid place-items-center font-mono text-[0.58rem] shrink-0 mt-0.5"
                              style={{ background: `${e.color}20`, color: e.color, border: `1px solid ${e.color}40` }}
                            >
                              {step.s}
                            </span>
                            <p className="text-[0.72rem] text-white-f/85 leading-relaxed flex-1">{step.t}</p>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Deliverable + cost */}
                    <div className="mt-auto space-y-2 pt-3 border-t border-white/[0.06]">
                      <div>
                        <p className="font-mono text-[0.55rem] uppercase tracking-widest text-cyan mb-1">Entregable</p>
                        <p className="text-[0.72rem] text-white-f/90 leading-snug">{e.deliverable}</p>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="font-mono text-[0.55rem] uppercase tracking-widest text-muted">Costo</span>
                        <span className="font-mono text-[0.65rem] text-white-f/70">{e.cost}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ────── Separador · 3 extras con DeepSeek ────── */}
            <div className="mt-16 mb-6">
              <div className="flex items-center gap-4">
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
                <span className="font-mono text-[0.68rem] uppercase tracking-widest text-green-400 px-4 py-1.5 rounded-full border border-green-500/25 bg-green-500/5">
                  + 3 extras · DeepSeek · sin tarjeta de crédito
                </span>
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white-f mb-3 leading-tight">
              Más simples: <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">solo navegador o tu laptop</span>
            </h3>
            <p className="text-[0.88rem] text-muted mb-6 max-w-3xl leading-relaxed">
              Tres quick wins adicionales centrados en DeepSeek — el modelo open weights que muchos equipos están probando para casos donde no vale pagar API o la data no debería salir de la red. Solo navegador o tu propia laptop, sin cuenta corporativa.
            </p>

            <div className="grid lg:grid-cols-3 gap-4">
              {ECO_EJERCICIOS_DEEPSEEK.map((e) => (
                <div
                  key={e.n}
                  className="relative bg-[#0D1229] border rounded-2xl overflow-hidden flex flex-col"
                  style={{ borderColor: `${e.color}30` }}
                >
                  {/* Header ribbon */}
                  <div
                    className="px-5 py-4 flex items-start gap-3 border-b"
                    style={{
                      background: `linear-gradient(135deg, ${e.color}20, ${e.color}08)`,
                      borderColor: `${e.color}25`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl grid place-items-center shrink-0 text-xl font-bold"
                      style={{ background: `${e.color}25`, color: e.color, border: `1px solid ${e.color}50` }}
                    >
                      {String(e.n).padStart(2, "0")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[0.7rem]" style={{ color: e.color }}>{e.level}</span>
                        <span className="font-mono text-[0.55rem] uppercase tracking-widest text-muted">{e.time}</span>
                        <span
                          className="font-mono text-[0.55rem] uppercase tracking-widest px-1.5 py-0.5 rounded"
                          style={{ background: `${e.color}15`, color: e.color }}
                        >
                          {e.tag}
                        </span>
                      </div>
                      <p className="text-[0.95rem] font-bold text-white-f leading-tight">{e.title}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Tools */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {e.tools.map((tool) => (
                        <span
                          key={tool.name}
                          className="font-mono text-[0.58rem] uppercase tracking-wider px-2 py-1 rounded-md"
                          style={{ background: `${tool.color}18`, color: tool.color, border: `1px solid ${tool.color}35` }}
                        >
                          {tool.name}
                        </span>
                      ))}
                    </div>

                    {/* Context */}
                    <div className="mb-3">
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1" style={{ color: e.color }}>Contexto BTG</p>
                      <p className="text-[0.75rem] text-white-f/85 leading-relaxed italic">&ldquo;{e.context}&rdquo;</p>
                    </div>

                    {/* Why */}
                    <div className="mb-4 bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1 text-gold">Por qué DeepSeek aquí</p>
                      <p className="text-[0.72rem] text-white-f/80 leading-snug">{e.why}</p>
                    </div>

                    {/* Steps */}
                    <div className="mb-4">
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-2" style={{ color: e.color }}>Pasos</p>
                      <ol className="space-y-2">
                        {e.steps.map((step) => (
                          <li key={step.s} className="flex gap-2.5 items-start">
                            <span
                              className="w-5 h-5 rounded-full grid place-items-center font-mono text-[0.58rem] shrink-0 mt-0.5"
                              style={{ background: `${e.color}20`, color: e.color, border: `1px solid ${e.color}40` }}
                            >
                              {step.s}
                            </span>
                            <p className="text-[0.72rem] text-white-f/85 leading-relaxed flex-1">{step.t}</p>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Deliverable + cost */}
                    <div className="mt-auto space-y-2 pt-3 border-t border-white/[0.06]">
                      <div>
                        <p className="font-mono text-[0.55rem] uppercase tracking-widest text-cyan mb-1">Entregable</p>
                        <p className="text-[0.72rem] text-white-f/90 leading-snug">{e.deliverable}</p>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="font-mono text-[0.55rem] uppercase tracking-widest text-muted">Costo</span>
                        <span className="font-mono text-[0.65rem]" style={{ color: e.color }}>{e.cost}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ────── Separador · 4 extras online (DeepSeek + Kimi) ────── */}
            <div className="mt-16 mb-6">
              <div className="flex items-center gap-4">
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                <span className="font-mono text-[0.68rem] uppercase tracking-widest text-emerald-300 px-4 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/5">
                  + 4 en línea · DeepSeek & Kimi · cero setup
                </span>
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white-f mb-3 leading-tight">
              Solo navegador: <span className="bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent">los modelos chinos gratis</span>
            </h3>
            <p className="text-[0.88rem] text-muted mb-6 max-w-3xl leading-relaxed">
              Cuatro quick wins 100% en el navegador — cero instalaciones, cero API keys, cero tarjetas de crédito. <span className="text-white-f font-medium">Kimi K2.5</span> (kimi.com) trae 256K tokens de contexto (≈ 524 páginas) para procesar memorias completas, y <span className="text-white-f font-medium">DeepSeek V3.2</span> (chat.deepseek.com) acepta file upload directo hasta 10 MB con modo razonamiento DeepThink. Ambos con web search integrada.
            </p>

            {/* Nota operativa de acceso */}
            <div className="mb-8 grid md:grid-cols-2 gap-3">
              <div className="bg-green-500/8 border border-green-500/25 rounded-xl p-4">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-green-300 mb-1">Acceso DeepSeek</p>
                <p className="text-[0.75rem] text-white-f/85 leading-snug">chat.deepseek.com · signup con email · sin verificación de teléfono · uso gratis sin cuotas explícitas · ideal para tareas con PDFs cortos.</p>
              </div>
              <div className="bg-emerald-500/8 border border-emerald-500/25 rounded-xl p-4">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-emerald-300 mb-1">Acceso Kimi</p>
                <p className="text-[0.75rem] text-white-f/85 leading-snug">kimi.com · login con Google (el flujo SMS chino es fricción innecesaria) · 256K tokens · modo Thinking y Agent gratis.</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              {ECO_EJERCICIOS_ONLINE.map((e) => (
                <div
                  key={e.n}
                  className="relative bg-[#0D1229] border rounded-2xl overflow-hidden flex flex-col"
                  style={{ borderColor: `${e.color}30` }}
                >
                  {/* Header ribbon */}
                  <div
                    className="px-5 py-4 flex items-start gap-3 border-b"
                    style={{
                      background: `linear-gradient(135deg, ${e.color}20, ${e.color}08)`,
                      borderColor: `${e.color}25`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl grid place-items-center shrink-0 text-xl font-bold"
                      style={{ background: `${e.color}25`, color: e.color, border: `1px solid ${e.color}50` }}
                    >
                      {String(e.n).padStart(2, "0")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[0.7rem]" style={{ color: e.color }}>{e.level}</span>
                        <span className="font-mono text-[0.55rem] uppercase tracking-widest text-muted">{e.time}</span>
                        <span
                          className="font-mono text-[0.55rem] uppercase tracking-widest px-1.5 py-0.5 rounded"
                          style={{ background: `${e.color}15`, color: e.color }}
                        >
                          {e.tag}
                        </span>
                      </div>
                      <p className="text-[0.95rem] font-bold text-white-f leading-tight">{e.title}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Tools */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {e.tools.map((tool) => (
                        <span
                          key={tool.name}
                          className="font-mono text-[0.58rem] uppercase tracking-wider px-2 py-1 rounded-md"
                          style={{ background: `${tool.color}18`, color: tool.color, border: `1px solid ${tool.color}35` }}
                        >
                          {tool.name}
                        </span>
                      ))}
                    </div>

                    {/* Context */}
                    <div className="mb-3">
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1" style={{ color: e.color }}>Contexto BTG</p>
                      <p className="text-[0.75rem] text-white-f/85 leading-relaxed italic">&ldquo;{e.context}&rdquo;</p>
                    </div>

                    {/* Why */}
                    <div className="mb-4 bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1 text-gold">Por qué esta combinación</p>
                      <p className="text-[0.72rem] text-white-f/80 leading-snug">{e.why}</p>
                    </div>

                    {/* Steps */}
                    <div className="mb-4">
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-2" style={{ color: e.color }}>Pasos</p>
                      <ol className="space-y-2">
                        {e.steps.map((step) => (
                          <li key={step.s} className="flex gap-2.5 items-start">
                            <span
                              className="w-5 h-5 rounded-full grid place-items-center font-mono text-[0.58rem] shrink-0 mt-0.5"
                              style={{ background: `${e.color}20`, color: e.color, border: `1px solid ${e.color}40` }}
                            >
                              {step.s}
                            </span>
                            <p className="text-[0.72rem] text-white-f/85 leading-relaxed flex-1">{step.t}</p>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Deliverable + cost */}
                    <div className="mt-auto space-y-2 pt-3 border-t border-white/[0.06]">
                      <div>
                        <p className="font-mono text-[0.55rem] uppercase tracking-widest text-cyan mb-1">Entregable</p>
                        <p className="text-[0.72rem] text-white-f/90 leading-snug">{e.deliverable}</p>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="font-mono text-[0.55rem] uppercase tracking-widest text-muted">Costo</span>
                        <span className="font-mono text-[0.65rem]" style={{ color: e.color }}>{e.cost}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Nota de cierre */}
            <div className="mt-8 bg-gradient-to-br from-cyan/10 to-emerald-500/5 border border-cyan/20 rounded-2xl p-5">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-cyan mb-2">Regla del instructor</p>
              <p className="text-[0.88rem] text-white-f/90 leading-relaxed">
                10 ejercicios, ~2h 30 min en total, pero no están pensados como checklist. Elige 2-3 que toquen el dolor más cercano: research sectorial si entraste a un equipo nuevo, dashboard si tu jefe siempre pide gráficos, ficha de emisor si estás en crédito, memoria anual completa en Kimi si analizas emisores, due diligence express con web search si estás en corporate o renta variable. Uno bien hecho vale más que los diez a medias.
              </p>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 10. TALLER + ENTREGABLES ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-[1.1fr_1fr] gap-10">
            <div>
              <p className="font-mono text-[0.72rem] text-gold uppercase tracking-widest mb-3">Taller final · 25 min</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white-f leading-tight mb-4">
                Repo BTG Portafolio Analytics <span className="bg-gradient-to-r from-gold to-orange bg-clip-text text-transparent">listo para producción</span>
              </h2>
              <p className="text-muted mb-6 leading-relaxed">
                Al final de la sesión entregas un repositorio GitHub con la clase Portafolio, el módulo de Riesgo, el dashboard HTML, la GitHub Action de CI/CD y el enlace público de GitHub Pages. Todo generado asistido por IA en 2 horas.
              </p>

              <div className="bg-gradient-to-br from-gold/10 to-orange/10 border border-gold/30 rounded-2xl p-5 mb-4">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-gold mb-2">Pregunta de reflexión</p>
                <p className="text-white-f leading-relaxed italic">
                  &ldquo;¿Qué tareas de tu área en BTG podrían automatizarse con este stack (Cursor + Claude Code + Copilot)? Escribe 150 palabras identificando 3 casos concretos y qué herramienta usarías en cada uno.&rdquo;
                </p>
              </div>

              <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-5">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-cyan mb-2">Criterios de éxito</p>
                <ul className="space-y-1.5 text-[0.78rem] text-white-f/90">
                  <li className="flex gap-2"><span className="text-cyan">✓</span><span>Tests pasan (coverage ≥ 80%).</span></li>
                  <li className="flex gap-2"><span className="text-cyan">✓</span><span>GitHub Action verde en main.</span></li>
                  <li className="flex gap-2"><span className="text-cyan">✓</span><span>Dashboard desplegado y compartible.</span></li>
                  <li className="flex gap-2"><span className="text-cyan">✓</span><span>PR con descripción Copilot auditable.</span></li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-1">Entregables · Sesión 6</p>
              {ENTREGABLES.map((e) => (
                <div key={e.n} className="flex gap-4 bg-[#151A3A] border border-white/[0.06] rounded-2xl p-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-orange flex items-center justify-center shrink-0">
                    <span className="text-white-f font-bold text-sm">{e.n}</span>
                  </div>
                  <div>
                    <p className="text-white-f font-semibold text-sm">{e.item}</p>
                    <p className="text-xs text-muted mt-1 leading-snug">{e.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 11. CIERRE MÓDULO ═══════════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(232,90,31,0.07),transparent)] pointer-events-none" />
          <div className="relative bg-gradient-to-br from-[#0F1438] via-[#0D1229] to-[#080C1F] border border-white/[0.08] rounded-3xl p-8 md:p-12">
            <p className="font-mono text-[0.72rem] text-cyan uppercase tracking-widest mb-3">Cierre · Módulo 02</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
              Research <span className="text-cyan">sin alucinaciones</span> + código <span className="text-purple-light">funcional</span>
            </h2>
            <p className="text-lg text-muted max-w-3xl mb-8 leading-relaxed">
              Las sesiones 5 y 6 cierran el bloque de herramientas con dos capacidades complementarias: el dominio del research documental (NotebookLM + Gemini + Copilot M365) y la capacidad de construir sistemas desde código asistido (Cursor + Claude Code + GitHub Copilot). El siguiente paso del programa es el Módulo 03 — <span className="text-white-f font-semibold">Automatizaciones</span> — donde estos sistemas se conectan entre sí con n8n y Power Platform.
            </p>

            <div className="grid md:grid-cols-3 gap-3">
              {[
                { k: "M02 · S5", v: "Research ecosystems + Modelos 2026", c: "#00E5A0" },
                { k: "M02 · S6", v: "Stack programación asistida", c: "#5B52D5" },
                { k: "Próximo · M03", v: "Automatizaciones n8n + Power Platform", c: "#E85A1F" },
              ].map((s) => (
                <div key={s.k} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                  <p className="font-mono text-[0.58rem] uppercase tracking-widest mb-1.5" style={{ color: s.c }}>{s.k}</p>
                  <p className="text-[0.85rem] font-bold text-white-f leading-snug">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>
    </div>
  );
}
