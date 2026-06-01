"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import RevealSection from "@/components/RevealSection";

/* ════════════════════════════ PALETA CLAUDE ════════════════════════════ */
const CORAL = "#E07856"; // acento Claude (coral cálido)
const CORAL_SOFT = "#F0A88A";

/* ════════════════════════════ DATA ════════════════════════════ */

const INDICE = [
  { id: "historia", label: "Historia", icon: "📜", color: CORAL },
  { id: "hoy", label: "Qué es hoy", icon: "✦", color: "#00E5A0" },
  { id: "modelos", label: "Modelos", icon: "◈", color: "#5B52D5" },
  { id: "modos", label: "Modos de uso", icon: "🎛️", color: "#3A7BD5" },
  { id: "skills", label: "Skills", icon: "🧩", color: "#D4AF4C" },
  { id: "agentes", label: "Agentes", icon: "🤖", color: "#22C55E" },
  { id: "orquestacion", label: "Orquestación", icon: "🕸️", color: "#E07856" },
  { id: "correr", label: "App vs Local", icon: "💻", color: "#E85A1F" },
  { id: "memoria", label: "Memoria", icon: "🧠", color: "#7B73E8" },
  { id: "recursos", label: "Anthropic hoy", icon: "🎓", color: "#00E5A0" },
  { id: "beneficios", label: "Beneficios", icon: "🎯", color: CORAL },
];

/* ── Línea de tiempo ── */
const TIMELINE = [
  {
    year: "2021",
    title: "Nace Anthropic",
    color: "#7a82a0",
    tag: "Fundación",
    body: "Un grupo de investigadores (liderados por Dario y Daniela Amodei) funda Anthropic como laboratorio de seguridad en IA. La tesis: construir modelos potentes pero confiables, gobernables y honestos. De ahí sale Constitutional AI, el método con el que Claude aprende a comportarse a partir de principios explícitos en vez de solo refuerzo humano.",
    btg: "El ADN de seguridad es lo que vuelve a Claude apto para un banco: alineación, rechazo de instrucciones dañinas y trazabilidad del razonamiento.",
  },
  {
    year: "2023",
    title: "Primeros Claude",
    color: "#9B7BD5",
    tag: "Claude 1 · 2 · Instant",
    body: "Claude 1 (marzo) y Claude 2 (julio) llegan con algo raro para la época: 100K tokens de contexto. Podías pegar un prospecto entero o un contrato y pedir resumen. Claude Instant aparece como variante rápida y económica. En noviembre, Claude 2.1 sube a 200K de contexto.",
    btg: "El contexto largo fue desde el inicio el caso de uso financiero: leer un 10-K, un memo de crédito o un reglamento completo sin trocearlo.",
  },
  {
    year: "2024",
    title: "Familia Claude 3 + 3.5",
    color: "#5B52D5",
    tag: "Haiku · Sonnet · Opus",
    body: "En marzo llega la familia Claude 3 en tres tamaños (Haiku, Sonnet, Opus) y por primera vez con visión: lee imágenes, gráficos y PDFs escaneados. En junio, Claude 3.5 Sonnet da un salto de calidad y estrena Artifacts en claude.ai. En octubre llegan 3.5 Haiku, el 'computer use' (Claude operando un computador) y se publica MCP, el estándar abierto para conectar herramientas.",
    btg: "Aquí Claude pasa de 'chat' a herramienta de trabajo: interpreta un estado financiero en imagen, genera un modelo en Artifacts y se conecta a sistemas internos vía MCP.",
  },
  {
    year: "2025",
    title: "Razonamiento + Claude 4",
    color: "#E07856",
    tag: "3.7 · Opus 4 · Sonnet 4",
    body: "Febrero: Claude 3.7 Sonnet introduce el razonamiento extendido (el modelo 'piensa' antes de responder) y debuta Claude Code. Mayo: la generación Claude 4 (Opus 4 y Sonnet 4) convierte el coding agéntico en algo serio — Claude planea, edita, prueba y commitea por su cuenta. Claude Code pasa a disponibilidad general.",
    btg: "El momento en que un analista deja de copiar y pegar código: describe lo que necesita y Claude construye el pipeline, lo prueba y lo documenta.",
  },
  {
    year: "2025–26",
    title: "La línea 4.X madura",
    color: "#00C8A0",
    tag: "Skills · Agentes · MCP",
    body: "La generación 4.X consolida tres piezas que cambian el modo de trabajar: Skills (capacidades modulares que Claude carga bajo demanda), el Agent SDK (construir agentes propios) y la memoria persistente. MCP se vuelve el estándar para conectar Claude a Drive, Gmail, bases de datos y sistemas internos.",
    btg: "Deja de ser 'un modelo' y se vuelve una plataforma: skills de compliance, agentes de monitoreo, memoria de cada cliente y conectores a los sistemas del banco.",
  },
  {
    year: "Jun 2026",
    title: "Hoy",
    color: CORAL,
    tag: "Opus 4.8 · Sonnet 4.6 · Haiku 4.5",
    body: "La familia actual: Opus 4.8 (máxima capacidad, hasta 1M de contexto), Sonnet 4.6 (el caballo de batalla) y Haiku 4.5 (veloz y económico). Claude Code corre en terminal, escritorio, web e IDE; los agentes, las skills y la memoria son ciudadanos de primera clase.",
    btg: "El stack que verás en esta lección es exactamente el que un equipo de BTG puede adoptar hoy para análisis, automatización y desarrollo asistido.",
  },
];

/* ── Modelos ── */
const MODELOS = [
  {
    id: "opus",
    name: "Claude Opus 4.8",
    tier: "Máxima capacidad",
    icon: "◆",
    color: "#E07856",
    speed: 2,
    depth: 5,
    cost: 5,
    pitch: "El modelo más inteligente. Razonamiento profundo, coding agéntico de varios pasos y los análisis más difíciles. Hasta 1M de tokens de contexto.",
    use: [
      "Due diligence sobre cientos de páginas",
      "Modelado financiero complejo de varios pasos",
      "Construir el agente o pipeline desde cero",
      "Revisión legal/compliance con matices",
    ],
    when: "Cuando el costo del error es alto y necesitas lo mejor.",
  },
  {
    id: "sonnet",
    name: "Claude Sonnet 4.6",
    tier: "Balance",
    icon: "◈",
    color: "#5B52D5",
    speed: 4,
    depth: 4,
    cost: 3,
    pitch: "El caballo de batalla: casi la inteligencia de Opus a una fracción del costo y mucho más rápido. El default para el día a día.",
    use: [
      "Redacción de memos e informes",
      "Análisis de datos recurrente",
      "Desarrollo asistido cotidiano",
      "Resúmenes de research y correos",
    ],
    when: "El 80% del trabajo diario. Empieza aquí.",
  },
  {
    id: "haiku",
    name: "Claude Haiku 4.5",
    tier: "Veloz y económico",
    icon: "▪",
    color: "#00E5A0",
    speed: 5,
    depth: 3,
    cost: 1,
    pitch: "Respuestas casi instantáneas a bajo costo. Pensado para volumen alto y tareas bien acotadas dentro de un flujo automatizado.",
    use: [
      "Clasificar y etiquetar miles de transacciones",
      "Extraer campos de documentos en lote",
      "Respuestas en tiempo real (chat de soporte)",
      "Primer filtro dentro de un agente",
    ],
    when: "Cuando importa la velocidad y el volumen, no el matiz.",
  },
];

/* ── Selector inteligente (mini-quiz) ── */
const TAREAS_QUIZ = [
  { t: "Leer 300 páginas de un prospecto y encontrar riesgos ocultos", rec: "opus" },
  { t: "Redactar el resumen ejecutivo del comité de hoy", rec: "sonnet" },
  { t: "Etiquetar 50.000 transacciones como sospechosas / normales", rec: "haiku" },
  { t: "Construir un agente que monitoree precios y alerte", rec: "opus" },
  { t: "Responder dudas de un asesor sobre un fondo (chat interno)", rec: "haiku" },
  { t: "Analizar el P&L del trimestre y proponer hipótesis", rec: "sonnet" },
];

/* ── Modos de uso ── */
const MODOS = [
  {
    id: "chat",
    name: "Chat (claude.ai)",
    icon: "💬",
    color: "#3A7BD5",
    head: "La puerta de entrada",
    body: "Conversación en navegador, escritorio (Mac/Windows) y móvil. Subes archivos, imágenes y PDFs; Claude responde, analiza y crea. Es donde la mayoría empieza.",
    bullets: [
      "Sube un Excel o PDF y pregúntale directamente",
      "Funciona offline-friendly: tu sesión, tu contexto",
      "Mismo Claude en web, desktop y celular",
    ],
    btg: "Un asesor pega el estado de cuenta de un cliente y pide tres escenarios de rebalanceo.",
  },
  {
    id: "projects",
    name: "Proyectos",
    icon: "📂",
    color: "#5B52D5",
    head: "Contexto que persiste",
    body: "Un Proyecto agrupa instrucciones + documentos de conocimiento que Claude consulta en cada conversación dentro de él. No vuelves a explicar el contexto.",
    bullets: [
      "Carga políticas, plantillas y glosario una sola vez",
      "Instrucciones personalizadas por proyecto",
      "Cada chat del proyecto hereda ese conocimiento",
    ],
    btg: "Proyecto 'Comité de Crédito': sube la política de riesgo y las plantillas; cada caso nuevo se evalúa con ese marco.",
  },
  {
    id: "artifacts",
    name: "Artifacts",
    icon: "🎨",
    color: "#00E5A0",
    head: "Lo que crea, cobra vida",
    body: "Cuando Claude genera código, una app o un documento, aparece en un panel propio editable y ejecutable en vivo, junto al chat.",
    bullets: [
      "Dashboards y calculadoras que corren al instante",
      "Iteras pidiendo cambios en lenguaje natural",
      "Compartes el artifact como mini-app",
    ],
    btg: "Pide una calculadora de VaR; el artifact corre en el navegador y la ajustas hablando.",
  },
  {
    id: "code",
    name: "Claude Code",
    icon: "⌨️",
    color: "#E85A1F",
    head: "El agente de ingeniería",
    body: "Claude trabajando dentro de tu terminal / IDE: lee el repo, planea, edita varios archivos, corre pruebas y hace commit. (Lo viste hands-on en la Sesión 6.)",
    bullets: [
      "Vive donde vive el código del equipo",
      "Lee CLAUDE.md para las reglas del proyecto",
      "Ejecuta, prueba y corrige por su cuenta",
    ],
    btg: "Un quant le pide implementar VaR histórico y paramétrico; Claude Code lo construye, prueba y commitea.",
  },
  {
    id: "api",
    name: "API / SDK",
    icon: "🔌",
    color: "#D4AF4C",
    head: "Claude dentro de tus sistemas",
    body: "La API de Anthropic embebe a Claude en productos propios: prompt caching, tool use, batch, streaming y el Agent SDK para construir agentes a medida.",
    bullets: [
      "Integras Claude en una app interna del banco",
      "Eliges el modelo por tarea para optimizar costo",
      "Prompt caching abarata contextos repetidos",
    ],
    btg: "Un microservicio de KYC llama a Haiku para clasificar y a Opus solo en los casos límite.",
  },
  {
    id: "mcp",
    name: "Conectores (MCP)",
    icon: "🧷",
    color: "#7B73E8",
    head: "Claude conectado al mundo",
    body: "MCP (Model Context Protocol) es el estándar abierto para que Claude hable con herramientas externas: Drive, Gmail, Calendar, bases de datos y sistemas internos.",
    bullets: [
      "Un estándar, muchos conectores reutilizables",
      "Claude lee y actúa sobre tus fuentes reales",
      "Permisos explícitos por herramienta",
    ],
    btg: "Conectado a Drive y al data warehouse, Claude arma el reporte mensual leyendo las fuentes directamente.",
  },
];

/* ── Skills: estructura de carpeta ── */
const SKILL_FILES = [
  { name: "compliance-sfc/", indent: 0, type: "dir", desc: "Carpeta de la skill — su nombre la identifica." },
  { name: "SKILL.md", indent: 1, type: "md", desc: "El corazón: instrucciones + cuándo usarse. Claude lee solo el encabezado hasta que la necesita." },
  { name: "checklist_sfc.md", indent: 1, type: "ref", desc: "Recurso de referencia que la skill abre bajo demanda." },
  { name: "scripts/", indent: 1, type: "dir", desc: "Código que la skill puede ejecutar." },
  { name: "validar_reporte.py", indent: 2, type: "py", desc: "Script reutilizable para validar formato del reporte regulatorio." },
];

/* ── Agentes: el loop ── */
const AGENT_LOOP = [
  { n: 1, label: "Objetivo", icon: "🎯", color: "#E07856", body: "Le das una meta, no pasos: 'detecta operaciones inusuales de ayer y prepara el reporte'." },
  { n: 2, label: "Planea", icon: "🧭", color: "#5B52D5", body: "Claude descompone la meta en pasos y decide qué herramientas usar." },
  { n: 3, label: "Actúa", icon: "⚙️", color: "#3A7BD5", body: "Llama herramientas (consulta la BD, corre un script, lee un archivo) vía MCP o tools." },
  { n: 4, label: "Observa", icon: "👁️", color: "#D4AF4C", body: "Lee el resultado de cada acción y evalúa si avanza hacia la meta." },
  { n: 5, label: "Itera", icon: "🔁", color: "#22C55E", body: "Corrige, reintenta o profundiza. Repite el ciclo hasta cumplir el objetivo." },
  { n: 6, label: "Entrega", icon: "📦", color: CORAL, body: "Cierra con el resultado: el reporte listo, el código probado, las alertas enviadas." },
];

/* ── Orquestación: patrones de Anthropic ── */
const ORQUESTACION = [
  {
    id: "augmented",
    name: "El LLM aumentado",
    kind: "Bloque base",
    icon: "🧱",
    color: "#7a82a0",
    desc: "El ladrillo de todo: un modelo conectado a recuperación de datos (retrieval), herramientas (tools) y memoria. Todo lo demás se construye combinando este bloque.",
    btg: "Claude con acceso al data warehouse, a una herramienta de cálculo de riesgo y a la memoria del cliente: ya no responde de memoria, responde con datos reales.",
  },
  {
    id: "chaining",
    name: "Encadenamiento",
    kind: "Workflow",
    icon: "🔗",
    color: "#3A7BD5",
    desc: "Descompone la tarea en pasos fijos en secuencia; cada llamada usa la salida de la anterior y puede haber una compuerta (✓) que valida antes de seguir. Más precisión a cambio de latencia.",
    btg: "Extraer cifras del 10-K → validarlas contra el modelo → redactar el memo. Si la validación falla, no avanza.",
  },
  {
    id: "routing",
    name: "Enrutamiento",
    kind: "Workflow",
    icon: "🔀",
    color: "#00E5A0",
    desc: "Clasifica la entrada y la manda al flujo especializado correcto. Separa preocupaciones: cada caso usa un prompt optimizado en vez de uno gigante que intenta todo.",
    btg: "La bandeja de solicitudes de clientes: el router decide si es crédito, inversión o queja, y cada una entra a su flujo experto.",
  },
  {
    id: "parallel",
    name: "Paralelización",
    kind: "Workflow",
    icon: "⚡",
    color: "#D4AF4C",
    desc: "Corre subtareas independientes a la vez (sectioning) o repite la misma tarea varias veces y vota (voting). Gana velocidad y robustez.",
    btg: "Analizar un emisor por riesgo, normativa y mercado en paralelo y consolidar — o tres pasadas de detección de fraude con voto mayoritario.",
  },
  {
    id: "orchestrator",
    name: "Orquestador-trabajadores",
    kind: "Workflow",
    icon: "🎯",
    color: "#E07856",
    desc: "Un LLM central descompone una tarea de complejidad imprevisible, delega en trabajadores dinámicos (no predefinidos) y sintetiza el resultado. Es como trabajan los agentes de código de Anthropic.",
    btg: "Diligencia de un M&A: el orquestador decide en vivo qué documentos hay que leer, reparte a trabajadores y arma el informe final.",
  },
  {
    id: "evaluator",
    name: "Evaluador-optimizador",
    kind: "Workflow",
    icon: "♻️",
    color: "#5B52D5",
    desc: "Un LLM genera, otro evalúa y da feedback; iteran hasta cumplir el criterio. Ideal cuando hay un estándar claro de 'bien hecho'.",
    btg: "Redactar el reporte regulatorio: un Claude escribe, otro lo critica contra el checklist de la SFC, y repite hasta aprobar.",
  },
  {
    id: "autonomous",
    name: "Agente autónomo",
    kind: "Agente",
    icon: "🤖",
    color: "#22C55E",
    desc: "El LLM dirige su propio proceso: planea, actúa con herramientas, observa el feedback del entorno y repite en bucle hasta lograr la meta. Para problemas abiertos sin pasos predecibles.",
    btg: "Un agente de monitoreo de mercado que decide solo qué consultar y cuándo alertar, reaccionando a datos en vivo.",
  },
];

/* ── Recursos publicados por Anthropic (jun 2026) ── */
const RECURSOS = [
  { icon: "🎓", title: "Anthropic Academy", color: "#E07856", desc: "Plataforma oficial de formación (lanzada mar-2026). ~17 cursos gratis en 5 tracks, con certificados: Claude Code, API, MCP, Agent Skills, sub-agentes y fiabilidad.", url: "https://www.anthropic.com/learn", cta: "anthropic.com/learn" },
  { icon: "🤖", title: "Building Effective Agents", color: "#22C55E", desc: "La guía de ingeniería que define workflows vs. agentes y los patrones de orquestación. Principio rector: empieza simple, agrega complejidad solo si mejora el resultado.", url: "https://www.anthropic.com/engineering/building-effective-agents", cta: "Guía de ingeniería" },
  { icon: "🧷", title: "Model Context Protocol", color: "#7B73E8", desc: "El estándar abierto para conectar Claude a herramientas. Tres primitivas: tools, resources y prompts. Cursos para construir servidores y clientes MCP.", url: "https://modelcontextprotocol.io", cta: "modelcontextprotocol.io" },
  { icon: "🧩", title: "Agent Skills", color: "#D4AF4C", desc: "Cómo crear, configurar y compartir Skills: instrucciones en markdown que Claude aplica automáticamente a la tarea correcta, y se distribuyen entre equipos.", url: "https://www.anthropic.com/news/skills", cta: "Skills" },
  { icon: "🪟", title: "Context Engineering", color: "#3A7BD5", desc: "Tratar el contexto como recurso finito: gestionar la ventana, compactar, usar sub-agentes y recuperación just-in-time para sistemas fiables.", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents", cta: "Context engineering" },
  { icon: "💻", title: "Claude Code + Cowork", color: "#00E5A0", desc: "Buenas prácticas de Claude Code y el nuevo agente de escritorio Cowork: del repo en terminal al agente que trabaja contigo en el escritorio.", url: "https://www.anthropic.com/claude-code", cta: "Claude Code" },
];

/* ── App vs Local ── */
const APP_LOCAL = {
  app: {
    title: "En la aplicación",
    icon: "☁️",
    color: "#3A7BD5",
    sub: "claude.ai · escritorio · móvil",
    rows: [
      ["Instalación", "Ninguna — abres el navegador o la app"],
      ["Quién la usa", "Todo el equipo: analistas, asesores, negocio"],
      ["Datos", "Subes archivos a la conversación / proyecto"],
      ["Conectores", "Drive, Gmail, Calendar con un clic (MCP)"],
      ["Ideal para", "Análisis, redacción, research, prototipos"],
      ["Curva", "Cero — es chatear"],
    ],
  },
  local: {
    title: "En local (Claude Code)",
    icon: "💻",
    color: "#E85A1F",
    sub: "terminal · IDE · tu máquina",
    rows: [
      ["Instalación", "npm install -g @anthropic-ai/claude-code"],
      ["Quién lo usa", "Desarrolladores, quants, data teams"],
      ["Datos", "Trabaja sobre tus archivos y repos reales"],
      ["Conectores", "Lee el repo, corre comandos, usa MCP local"],
      ["Ideal para", "Construir, probar y automatizar software"],
      ["Curva", "Conoces la terminal → 10 minutos"],
    ],
  },
};

/* ── Memoria: capas ── */
const MEMORIA = [
  {
    id: "contexto",
    name: "Ventana de contexto",
    icon: "🪟",
    color: "#3A7BD5",
    short: "Lo que cabe en una conversación",
    body: "Todo lo que Claude 've' en un momento dado: hasta 200K tokens (≈500 páginas) y hasta 1M en Opus 4.8. Dentro de la conversación lo recuerda todo perfectamente.",
    btg: "Pegas un contrato de 400 páginas y preguntas por cualquier cláusula sin trocearlo.",
  },
  {
    id: "compactacion",
    name: "Compactación",
    icon: "🗜️",
    color: "#5B52D5",
    short: "Cuando la charla se alarga",
    body: "Si una sesión crece más que la ventana, Claude resume lo anterior y sigue trabajando sin perder el hilo. No tienes que 'cerrar y reabrir'.",
    btg: "Una sesión larga de análisis no se rompe a mitad: se condensa y continúa.",
  },
  {
    id: "proyecto",
    name: "Memoria de proyecto",
    icon: "📂",
    color: "#00E5A0",
    short: "Conocimiento que persiste",
    body: "En la app, un Proyecto guarda instrucciones y documentos. En Claude Code, el archivo CLAUDE.md guarda las reglas del repo. Claude los relee siempre.",
    btg: "Las políticas de riesgo viven en el proyecto; cada caso nuevo se evalúa con ellas sin recordárselas.",
  },
  {
    id: "persistente",
    name: "Memoria persistente",
    icon: "🧠",
    color: "#7B73E8",
    short: "Recuerda entre sesiones",
    body: "Claude puede escribir hechos a una memoria de archivos que sobrevive de una conversación a la siguiente: preferencias, contexto de clientes, decisiones tomadas. Tú controlas qué se guarda.",
    btg: "Recuerda que 'el comité prefiere escenarios conservadores' sin que se lo repitas cada lunes.",
  },
];

/* ── Beneficios ── */
const BENEFICIOS = [
  { icon: "🛡️", title: "Diseñado para confiar", color: "#E07856", body: "Constitutional AI, rechazo de instrucciones dañinas y razonamiento auditable: apto para un entorno regulado." },
  { icon: "📚", title: "Contexto enorme", color: "#3A7BD5", body: "Hasta 1M de tokens: lee prospectos, contratos y reglamentos completos sin perder detalle." },
  { icon: "⚡", title: "Tres modelos, un criterio", color: "#00E5A0", body: "Opus para lo difícil, Sonnet para el día a día, Haiku para el volumen. Optimizas costo por tarea." },
  { icon: "🤖", title: "De chat a agente", color: "#22C55E", body: "El mismo Claude responde, construye software y opera flujos autónomos con herramientas reales." },
  { icon: "🧩", title: "Extensible", color: "#D4AF4C", body: "Skills, MCP y el Agent SDK lo adaptan a los procesos del banco sin reentrenar nada." },
  { icon: "🧠", title: "Aprende tu contexto", color: "#7B73E8", body: "Proyectos y memoria persistente: deja de repetir el contexto cada vez." },
];

/* ════════════════════════════ DIAGRAMAS SVG ════════════════════════════ */

function Box({ x, y, w = 82, h = 34, label, c }: { x: number; y: number; w?: number; h?: number; label: string; c: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="#0D1229" stroke={c} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill="#E8ECF8" style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>
        {label}
      </text>
    </g>
  );
}
function Arrow({ x1, y1, x2, y2, c, dash }: { x1: number; y1: number; x2: number; y2: number; c: string; dash?: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={1.6} markerEnd="url(#arr)" opacity={0.75} strokeDasharray={dash ? "4 3" : undefined} />;
}
function Lbl({ x, y, t }: { x: number; y: number; t: string }) {
  return <text x={x} y={y} textAnchor="middle" fill="#7a82a0" style={{ fontSize: 8.5, fontFamily: "var(--font-mono)" }}>{t}</text>;
}

function PatternSVG({ id, c }: { id: string; c: string }) {
  const common = (
    <defs>
      <marker id="arr" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto">
        <path d="M0,0 L7,3 L0,6 Z" fill={c} />
      </marker>
    </defs>
  );
  const svg = (children: ReactNode) => (
    <svg viewBox="0 0 460 160" className="w-full h-auto" key={id}>
      {common}
      {children}
    </svg>
  );

  switch (id) {
    case "augmented":
      return svg(<>
        <line x1={130} y1={33} x2={205} y2={70} stroke={c} strokeWidth={1.4} opacity={0.55} className="animate-nodeConnect" />
        <line x1={330} y1={33} x2={255} y2={70} stroke={c} strokeWidth={1.4} opacity={0.55} className="animate-nodeConnect" />
        <line x1={230} y1={118} x2={230} y2={98} stroke={c} strokeWidth={1.4} opacity={0.55} className="animate-nodeConnect" />
        <Box x={20} y={18} w={110} h={30} label="Retrieval" c={c} />
        <Box x={330} y={18} w={110} h={30} label="Tools" c={c} />
        <Box x={176} y={118} w={108} h={30} label="Memoria" c={c} />
        <Box x={191} y={62} w={78} h={38} label="LLM" c="#E07856" />
      </>);
    case "chaining":
      return svg(<>
        <Arrow x1={50} y1={80} x2={68} y2={80} c={c} />
        <Arrow x1={154} y1={80} x2={174} y2={80} c={c} />
        <Arrow x1={260} y1={80} x2={280} y2={80} c={c} />
        <Arrow x1={366} y1={80} x2={386} y2={80} c={c} />
        <Lbl x={164} y={72} t="✓" /><Lbl x={270} y={72} t="✓" />
        <Box x={6} y={63} w={44} h={34} label="In" c={c} />
        <Box x={70} y={63} w={84} h={34} label="Extraer" c={c} />
        <Box x={176} y={63} w={84} h={34} label="Validar" c={c} />
        <Box x={282} y={63} w={84} h={34} label="Redactar" c={c} />
        <Box x={388} y={63} w={64} h={34} label="Memo" c={c} />
      </>);
    case "routing":
      return svg(<>
        <Arrow x1={50} y1={80} x2={68} y2={80} c={c} />
        <Arrow x1={160} y1={74} x2={228} y2={33} c={c} />
        <Arrow x1={160} y1={80} x2={228} y2={80} c={c} />
        <Arrow x1={160} y1={86} x2={228} y2={127} c={c} />
        <Box x={6} y={63} w={44} h={34} label="In" c={c} />
        <Box x={70} y={63} w={90} h={34} label="Router" c="#E07856" />
        <Box x={230} y={18} w={150} h={30} label="Crédito" c={c} />
        <Box x={230} y={63} w={150} h={34} label="Inversión" c={c} />
        <Box x={230} y={112} w={150} h={30} label="Queja" c={c} />
      </>);
    case "parallel":
      return svg(<>
        <Arrow x1={50} y1={80} x2={128} y2={33} c={c} />
        <Arrow x1={50} y1={80} x2={128} y2={80} c={c} />
        <Arrow x1={50} y1={80} x2={128} y2={127} c={c} />
        <Arrow x1={228} y1={33} x2={300} y2={74} c={c} />
        <Arrow x1={228} y1={80} x2={298} y2={80} c={c} />
        <Arrow x1={228} y1={127} x2={300} y2={86} c={c} />
        <Box x={6} y={63} w={44} h={34} label="In" c={c} />
        <Box x={130} y={18} w={98} h={30} label="Riesgo" c={c} />
        <Box x={130} y={63} w={98} h={34} label="Normativa" c={c} />
        <Box x={130} y={112} w={98} h={30} label="Mercado" c={c} />
        <Box x={300} y={63} w={104} h={34} label="Síntesis" c="#E07856" />
      </>);
    case "orchestrator":
      return svg(<>
        <path d="M 118 60 q 0 -22 -24 -22 q -24 0 -24 22" fill="none" stroke={c} strokeWidth={1.3} opacity={0.6} strokeDasharray="4 3" markerEnd="url(#arr)" />
        <Lbl x={94} y={30} t="decide en vivo" />
        <Arrow x1={50} y1={80} x2={64} y2={80} c={c} />
        <Arrow x1={172} y1={74} x2={208} y2={33} c={c} />
        <Arrow x1={172} y1={80} x2={208} y2={80} c={c} />
        <Arrow x1={172} y1={86} x2={208} y2={127} c={c} />
        <Arrow x1={316} y1={33} x2={348} y2={74} c={c} />
        <Arrow x1={316} y1={80} x2={346} y2={80} c={c} />
        <Arrow x1={316} y1={127} x2={348} y2={86} c={c} />
        <Box x={6} y={63} w={44} h={34} label="Meta" c={c} />
        <Box x={66} y={63} w={104} h={34} label="Orquestador" c="#E07856" />
        <Box x={210} y={18} w={104} h={30} label="Worker" c={c} />
        <Box x={210} y={63} w={104} h={34} label="Worker" c={c} />
        <Box x={210} y={112} w={104} h={30} label="Worker" c={c} />
        <Box x={348} y={63} w={104} h={34} label="Síntesis" c="#E07856" />
      </>);
    case "evaluator":
      return svg(<>
        <Arrow x1={146} y1={72} x2={208} y2={72} c={c} />
        <Lbl x={177} y={64} t="borrador" />
        <path d="M 208 90 q -31 26 -62 0" fill="none" stroke={c} strokeWidth={1.5} opacity={0.75} markerEnd="url(#arr)" />
        <Lbl x={177} y={116} t="feedback" />
        <Arrow x1={316} y1={80} x2={356} y2={80} c={c} />
        <Lbl x={336} y={72} t="✓" />
        <Box x={40} y={63} w={104} h={34} label="Generador" c={c} />
        <Box x={210} y={63} w={104} h={34} label="Evaluador" c="#E07856" />
        <Box x={358} y={63} w={96} h={34} label="Final" c={c} />
      </>);
    case "autonomous":
      return svg(<>
        <path d="M 200 70 q 35 -20 70 0" fill="none" stroke={c} strokeWidth={1.6} opacity={0.8} markerEnd="url(#arr)" />
        <Lbl x={235} y={50} t="acción / tool" />
        <path d="M 270 92 q -35 22 -70 0" fill="none" stroke={c} strokeWidth={1.6} opacity={0.8} markerEnd="url(#arr)" />
        <Lbl x={235} y={120} t="feedback" />
        <Box x={90} y={62} w={110} h={38} label="Agente" c="#E07856" />
        <Box x={270} y={62} w={110} h={38} label="Entorno" c={c} />
        <Lbl x={230} y={150} t="bucle hasta cumplir la meta" />
      </>);
    default:
      return null;
  }
}

/* ════════════════════════════ COMPONENTE ════════════════════════════ */

export default function SesionClaude() {
  const [heroN, setHeroN] = useState(0);
  const [era, setEra] = useState(TIMELINE.length - 1);
  const [modelo, setModelo] = useState("sonnet");
  const [quiz, setQuiz] = useState<number | null>(null);
  const [modo, setModo] = useState("chat");
  const [skillOpen, setSkillOpen] = useState(false);
  const [loopStep, setLoopStep] = useState(0);
  const [vista, setVista] = useState<"app" | "local">("app");
  const [capa, setCapa] = useState("contexto");
  const [orq, setOrq] = useState("orchestrator");

  useEffect(() => {
    if (heroN >= 5) return;
    const t = setTimeout(() => setHeroN((n) => n + 1), 350);
    return () => clearTimeout(t);
  }, [heroN]);

  useEffect(() => {
    const iv = setInterval(() => setLoopStep((s) => (s + 1) % AGENT_LOOP.length), 1600);
    return () => clearInterval(iv);
  }, []);

  const modeloSel = MODELOS.find((m) => m.id === modelo)!;
  const capaSel = MEMORIA.find((c) => c.id === capa)!;
  const modoSel = MODOS.find((m) => m.id === modo)!;
  const orqSel = ORQUESTACION.find((o) => o.id === orq)!;
  const recModel = quiz !== null ? MODELOS.find((m) => m.id === TAREAS_QUIZ[quiz].rec)! : null;

  return (
    <div className="min-h-screen bg-[#080C1F]">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden">
        <div className="hero-grid" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 25% 40%, rgba(224,120,86,0.12), transparent), radial-gradient(ellipse 45% 55% at 78% 60%, rgba(91,82,213,0.10), transparent)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[0.78rem] font-medium mb-8 animate-fadeUp"
            style={{ background: "rgba(224,120,86,0.12)", border: "1px solid rgba(224,120,86,0.35)", color: CORAL_SOFT }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse-dot" style={{ background: CORAL }} />
            Lección especial · Conoce a Claude · Junio 2026
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white-f leading-tight mb-6 animate-fadeUp-1">
            Claude, de cabo a rabo
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${CORAL}, ${CORAL_SOFT}, #7B73E8)` }}
            >
              su historia, sus modos y sus beneficios
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 animate-fadeUp-2">
            Una lección única: qué es Claude, cómo nació, qué modelos existen y para qué sirve cada uno, qué son las
            skills, los agentes y la orquestación, cómo se corre en la app y en local, y cómo funciona su memoria —
            todo contextualizado a servicios financieros y BTG Pactual, sobre lo que Anthropic enseña hoy.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fadeUp-3">
            {[
              { val: heroN >= 1 ? "3" : "—", label: "Modelos vivos", color: "#5B52D5" },
              { val: heroN >= 2 ? "6" : "—", label: "Modos de uso", color: "#3A7BD5" },
              { val: heroN >= 3 ? "1M" : "—", label: "Tokens de contexto", color: CORAL },
              { val: heroN >= 4 ? "∞" : "—", label: "Skills y agentes", color: "#22C55E" },
              { val: heroN >= 5 ? "2021" : "—", label: "Desde", color: "#D4AF4C" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-[#151A3A] border rounded-2xl px-5 py-3 min-w-[110px] transition-all hover:scale-105"
                style={{ borderColor: `${s.color}30` }}
              >
                <p className="text-2xl font-bold text-white-f">{s.val}</p>
                <p className="text-[0.6rem] text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ÍNDICE ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-10">
          <p className="font-mono text-[0.72rem] uppercase tracking-widest mb-5" style={{ color: CORAL }}>
            En esta lección
          </p>
          <div className="flex flex-wrap gap-2">
            {INDICE.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 border transition-all hover:scale-[1.03]"
                style={{ background: `${s.color}10`, borderColor: `${s.color}30` }}
              >
                <span>{s.icon}</span>
                <span className="text-sm font-medium text-white-f">{s.label}</span>
              </a>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 1 · HISTORIA ═══════════════ */}
      <RevealSection>
        <section id="historia" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-20">
          <p className="font-mono text-[0.72rem] uppercase tracking-widest mb-3" style={{ color: CORAL }}>
            01 · Historia
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-white-f leading-tight mb-3">
            De laboratorio de seguridad a <span style={{ color: CORAL }}>plataforma de IA</span>
          </h2>
          <p className="text-muted max-w-2xl mb-10">
            Haz clic en cada hito. La historia de Claude es la historia de cómo un modelo de chat se volvió un colega
            que razona, construye y opera.
          </p>

          {/* línea de tiempo */}
          <div className="relative">
            <div className="absolute left-0 right-0 top-[26px] h-0.5 bg-white/10 hidden md:block" />
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 relative">
              {TIMELINE.map((t, i) => {
                const on = era === i;
                return (
                  <button
                    key={t.year}
                    onClick={() => setEra(i)}
                    className="flex flex-col items-center text-center group"
                  >
                    <span
                      className="w-[54px] h-[54px] rounded-full grid place-items-center font-mono text-[0.62rem] font-bold border-2 transition-all"
                      style={{
                        borderColor: on ? t.color : "rgba(255,255,255,0.15)",
                        background: on ? t.color : "#0D1229",
                        color: on ? "#080C1F" : "#7a82a0",
                        transform: on ? "scale(1.12)" : "scale(1)",
                        boxShadow: on ? `0 0 22px ${t.color}66` : "none",
                      }}
                    >
                      {t.year}
                    </span>
                    <span
                      className="text-[0.66rem] mt-2 leading-tight transition-colors"
                      style={{ color: on ? "#f0f2f8" : "#7a82a0" }}
                    >
                      {t.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* detalle */}
          <div
            className="mt-8 rounded-2xl border p-6 md:p-8 transition-all"
            style={{ background: `linear-gradient(135deg, ${TIMELINE[era].color}14, transparent)`, borderColor: `${TIMELINE[era].color}40` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs px-3 py-1 rounded-full font-semibold" style={{ background: `${TIMELINE[era].color}22`, color: TIMELINE[era].color }}>
                {TIMELINE[era].year}
              </span>
              <span className="font-mono text-[0.66rem] text-muted uppercase tracking-widest">{TIMELINE[era].tag}</span>
            </div>
            <h3 className="text-2xl font-bold text-white-f mb-3">{TIMELINE[era].title}</h3>
            <p className="text-txt leading-relaxed mb-5">{TIMELINE[era].body}</p>
            <div className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
              <span className="text-lg">🏦</span>
              <p className="text-[0.88rem] text-muted">
                <span className="font-semibold" style={{ color: TIMELINE[era].color }}>Para BTG:</span> {TIMELINE[era].btg}
              </p>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 2 · QUÉ ES HOY ═══════════════ */}
      <RevealSection>
        <section id="hoy" className="bg-deep scroll-mt-20">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <p className="font-mono text-[0.72rem] uppercase tracking-widest mb-3 text-cyan">02 · Qué es hoy</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white-f leading-tight mb-3">
              Claude en <span className="text-cyan">junio de 2026</span>
            </h2>
            <p className="text-muted max-w-2xl mb-10">
              Claude ya no es solo &ldquo;un chatbot&rdquo;. Es un sistema de IA que vive en cuatro lugares y resuelve cuatro tipos
              de trabajo. Lo mismo que responde una pregunta puede construir una app o operar un flujo completo.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: "💬", t: "Responde", d: "Análisis, redacción y research con contexto enorme.", c: "#3A7BD5" },
                { icon: "🎨", t: "Crea", d: "Código, apps y documentos vivos en Artifacts.", c: "#00E5A0" },
                { icon: "⌨️", t: "Construye", d: "Software real en tu terminal con Claude Code.", c: "#E85A1F" },
                { icon: "🤖", t: "Opera", d: "Flujos autónomos con herramientas vía agentes.", c: "#7B73E8" },
              ].map((x) => (
                <div key={x.t} className="bg-card border border-white/[0.06] rounded-2xl p-6 hover:-translate-y-1 transition-all" style={{ boxShadow: `inset 0 2px 0 ${x.c}` }}>
                  <div className="text-3xl mb-3">{x.icon}</div>
                  <h3 className="text-lg font-bold text-white-f mb-1" style={{ color: x.c }}>{x.t}</h3>
                  <p className="text-[0.85rem] text-muted">{x.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 3 · MODELOS ═══════════════ */}
      <RevealSection>
        <section id="modelos" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-20">
          <p className="font-mono text-[0.72rem] uppercase tracking-widest mb-3" style={{ color: "#5B52D5" }}>03 · Modelos</p>
          <h2 className="text-2xl md:text-4xl font-bold text-white-f leading-tight mb-3">
            Tres modelos, <span className="text-purple-light">un criterio de uso</span>
          </h2>
          <p className="text-muted max-w-2xl mb-10">
            No hay un &ldquo;mejor modelo&rdquo;: hay el correcto para cada tarea. Selecciona uno para ver para qué brilla.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {MODELOS.map((m) => {
              const on = modelo === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setModelo(m.id)}
                  className="text-left rounded-2xl border p-6 transition-all"
                  style={{
                    background: on ? `linear-gradient(135deg, ${m.color}1c, transparent)` : "#151A3A",
                    borderColor: on ? `${m.color}66` : "rgba(255,255,255,0.06)",
                    transform: on ? "translateY(-4px)" : "none",
                    boxShadow: on ? `0 12px 30px ${m.color}22` : "none",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl" style={{ color: m.color }}>{m.icon}</span>
                    <span className="font-mono text-[0.58rem] uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: `${m.color}1c`, color: m.color }}>
                      {m.tier}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white-f mb-2">{m.name}</h3>
                  <p className="text-[0.82rem] text-muted">{m.pitch}</p>
                </button>
              );
            })}
          </div>

          {/* detalle modelo */}
          <div className="rounded-2xl border border-white/[0.08] bg-card p-6 md:p-8">
            <div className="grid md:grid-cols-[1fr_1.3fr] gap-8">
              {/* barras */}
              <div>
                <h4 className="text-lg font-bold text-white-f mb-1">{modeloSel.name}</h4>
                <p className="text-[0.8rem] text-muted mb-5">{modeloSel.when}</p>
                {[
                  { label: "Velocidad", v: modeloSel.speed },
                  { label: "Profundidad", v: modeloSel.depth },
                  { label: "Costo relativo", v: modeloSel.cost },
                ].map((b) => (
                  <div key={b.label} className="mb-4">
                    <div className="flex justify-between text-[0.72rem] mb-1.5">
                      <span className="text-muted">{b.label}</span>
                      <span className="font-mono" style={{ color: modeloSel.color }}>{b.v}/5</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${b.v * 20}%`, background: modeloSel.color }} />
                    </div>
                  </div>
                ))}
              </div>
              {/* usos */}
              <div>
                <p className="font-mono text-[0.66rem] uppercase tracking-widest text-muted mb-3">Casos BTG ideales</p>
                <ul className="space-y-2.5">
                  {modeloSel.use.map((u) => (
                    <li key={u} className="flex items-start gap-3 text-[0.9rem] text-txt">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: modeloSel.color }} />
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* selector inteligente */}
          <div className="mt-10 rounded-2xl border p-6 md:p-8" style={{ borderColor: "rgba(224,120,86,0.3)", background: "rgba(224,120,86,0.05)" }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🧭</span>
              <h4 className="text-lg font-bold text-white-f">Selector inteligente</h4>
            </div>
            <p className="text-[0.85rem] text-muted mb-5">Elige una tarea real de banca y mira qué modelo recomendaría.</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {TAREAS_QUIZ.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setQuiz(i)}
                  className="text-left text-[0.8rem] px-4 py-2.5 rounded-xl border transition-all"
                  style={{
                    background: quiz === i ? "rgba(224,120,86,0.18)" : "rgba(255,255,255,0.03)",
                    borderColor: quiz === i ? "rgba(224,120,86,0.5)" : "rgba(255,255,255,0.08)",
                    color: quiz === i ? "#fff" : "#c5cae0",
                  }}
                >
                  {q.t}
                </button>
              ))}
            </div>
            {recModel && (
              <div className="rounded-xl border p-5 animate-fadeUp" style={{ borderColor: `${recModel.color}55`, background: `${recModel.color}12` }}>
                <p className="text-[0.72rem] text-muted mb-1">Recomendación</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl" style={{ color: recModel.color }}>{recModel.icon}</span>
                  <span className="text-lg font-bold text-white-f">{recModel.name}</span>
                </div>
                <p className="text-[0.85rem] text-txt">{recModel.when} {recModel.pitch}</p>
              </div>
            )}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 4 · MODOS DE USO ═══════════════ */}
      <RevealSection>
        <section id="modos" className="bg-deep scroll-mt-20">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <p className="font-mono text-[0.72rem] uppercase tracking-widest mb-3" style={{ color: "#3A7BD5" }}>04 · Modos de uso</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white-f leading-tight mb-3">
              El mismo Claude, <span style={{ color: "#3A7BD5" }}>seis formas de trabajarlo</span>
            </h2>
            <p className="text-muted max-w-2xl mb-10">
              Desde chatear en el navegador hasta embeberlo en un sistema interno. Explóralos.
            </p>

            <div className="grid md:grid-cols-[260px_1fr] gap-6">
              {/* tabs */}
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                {MODOS.map((m) => {
                  const on = modo === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setModo(m.id)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 border transition-all whitespace-nowrap md:whitespace-normal text-left flex-shrink-0"
                      style={{
                        background: on ? `${m.color}1a` : "rgba(255,255,255,0.02)",
                        borderColor: on ? `${m.color}55` : "rgba(255,255,255,0.06)",
                      }}
                    >
                      <span className="text-lg">{m.icon}</span>
                      <span className="text-[0.85rem] font-semibold" style={{ color: on ? "#fff" : "#7a82a0" }}>{m.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* panel */}
              <div className="rounded-2xl border bg-card p-6 md:p-8" style={{ borderColor: `${modoSel.color}33` }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{modoSel.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white-f">{modoSel.name}</h3>
                    <p className="text-[0.78rem]" style={{ color: modoSel.color }}>{modoSel.head}</p>
                  </div>
                </div>
                <p className="text-txt leading-relaxed mb-5">{modoSel.body}</p>
                <div className="grid sm:grid-cols-3 gap-3 mb-5">
                  {modoSel.bullets.map((b) => (
                    <div key={b} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-[0.78rem] text-muted">
                      {b}
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-3 rounded-xl p-4" style={{ background: `${modoSel.color}10` }}>
                  <span>🏦</span>
                  <p className="text-[0.85rem] text-txt"><span className="font-semibold" style={{ color: modoSel.color }}>Ejemplo BTG:</span> {modoSel.btg}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 5 · SKILLS ═══════════════ */}
      <RevealSection>
        <section id="skills" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-20">
          <p className="font-mono text-[0.72rem] uppercase tracking-widest mb-3" style={{ color: "#D4AF4C" }}>05 · Skills</p>
          <h2 className="text-2xl md:text-4xl font-bold text-white-f leading-tight mb-3">
            Skills: <span className="text-gold">capacidades que Claude carga cuando las necesita</span>
          </h2>
          <p className="text-muted max-w-3xl mb-10">
            Una <strong className="text-white-f">Skill</strong> es una carpeta con instrucciones (y opcionalmente scripts y
            recursos) que enseña a Claude a hacer una tarea concreta &ldquo;a tu manera&rdquo;. Claude solo lee el detalle cuando la
            tarea aparece — así no gasta contexto en capacidades que no usa. Es como darle a un analista un manual de
            procedimiento que abre justo cuando lo necesita.
          </p>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* estructura interactiva */}
            <div>
              <button
                onClick={() => setSkillOpen((o) => !o)}
                className="w-full flex items-center justify-between rounded-t-xl border border-white/[0.08] bg-[#0D1229] px-4 py-3 text-left"
              >
                <span className="font-mono text-[0.78rem] text-gold flex items-center gap-2">
                  <span>{skillOpen ? "📂" : "📁"}</span> compliance-sfc/
                </span>
                <span className="text-[0.7rem] text-muted">{skillOpen ? "ocultar" : "ver qué hay dentro"}</span>
              </button>
              <div className="border-x border-b border-white/[0.08] rounded-b-xl bg-[#0A0E22] p-4 font-mono text-[0.78rem] space-y-1">
                {(skillOpen ? SKILL_FILES.slice(1) : []).map((f, i) => (
                  <div
                    key={f.name}
                    className="flex items-start gap-2 animate-fadeUp"
                    style={{ paddingLeft: `${f.indent * 16}px`, animationDelay: `${i * 60}ms` }}
                  >
                    <span>
                      {f.type === "dir" ? "📁" : f.type === "md" ? "📄" : f.type === "py" ? "🐍" : "📑"}
                    </span>
                    <div>
                      <span className={f.type === "md" ? "text-gold" : "text-txt"}>{f.name}</span>
                      <p className="text-[0.68rem] text-muted font-sans mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
                {!skillOpen && <p className="text-muted text-[0.72rem]">Haz clic arriba para abrir la carpeta de la skill.</p>}
              </div>
            </div>

            {/* antes / después */}
            <div className="space-y-3">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
                <p className="font-mono text-[0.62rem] uppercase tracking-widest text-red mb-2">Sin skill</p>
                <p className="text-[0.85rem] text-muted">&ldquo;Te explico otra vez cómo validamos el reporte para la SFC: el formato es… los campos obligatorios son… recuerda que…&rdquo; — cada vez, desde cero.</p>
              </div>
              <div className="text-center text-muted text-lg">↓</div>
              <div className="rounded-xl border p-5" style={{ borderColor: "rgba(212,175,76,0.4)", background: "rgba(212,175,76,0.08)" }}>
                <p className="font-mono text-[0.62rem] uppercase tracking-widest text-gold mb-2">Con la skill</p>
                <p className="text-[0.85rem] text-txt">&ldquo;Valida este reporte para la SFC&rdquo; — Claude reconoce la tarea, abre la skill <span className="font-mono text-gold">compliance-sfc</span>, sigue el checklist y hasta corre el script de validación. Consistente, auditable, sin recordatorios.</p>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 6 · AGENTES ═══════════════ */}
      <RevealSection>
        <section id="agentes" className="bg-deep scroll-mt-20">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <p className="font-mono text-[0.72rem] uppercase tracking-widest mb-3 text-green">06 · Agentes</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white-f leading-tight mb-3">
              Agentes: de <span className="text-green">responder</span> a <span className="text-green">hacer</span>
            </h2>
            <p className="text-muted max-w-3xl mb-4">
              Un <strong className="text-white-f">agente</strong> es Claude trabajando en un bucle hacia una meta: planea,
              usa herramientas, mira el resultado y vuelve a intentar hasta lograrla. No le das pasos, le das un objetivo.
            </p>
            <p className="text-[0.82rem] text-muted max-w-3xl mb-10">
              La diferencia con una skill: la <span className="text-gold">skill</span> es <em>saber cómo</em> hacer algo;
              el <span className="text-green">agente</span> es <em>ir y hacerlo</em>, decidiendo los pasos sobre la marcha.
            </p>

            {/* loop */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {AGENT_LOOP.map((s, i) => {
                const on = loopStep === i;
                return (
                  <button
                    key={s.n}
                    onClick={() => setLoopStep(i)}
                    className="rounded-2xl border p-4 text-center transition-all"
                    style={{
                      background: on ? `${s.color}18` : "rgba(255,255,255,0.02)",
                      borderColor: on ? `${s.color}66` : "rgba(255,255,255,0.06)",
                      transform: on ? "scale(1.05)" : "scale(1)",
                      boxShadow: on ? `0 0 22px ${s.color}33` : "none",
                    }}
                  >
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <p className="font-mono text-[0.58rem] text-muted">PASO {s.n}</p>
                    <p className="text-[0.8rem] font-bold" style={{ color: on ? s.color : "#f0f2f8" }}>{s.label}</p>
                  </button>
                );
              })}
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-card p-6 md:p-8 mb-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{AGENT_LOOP[loopStep].icon}</span>
                <h3 className="text-xl font-bold" style={{ color: AGENT_LOOP[loopStep].color }}>
                  {AGENT_LOOP[loopStep].label}
                </h3>
              </div>
              <p className="text-txt leading-relaxed">{AGENT_LOOP[loopStep].body}</p>
            </div>

            {/* subagentes */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h4 className="text-base font-bold text-white-f mb-2">🪆 Subagentes</h4>
                <p className="text-[0.85rem] text-muted">Un agente principal puede delegar partes del trabajo a subagentes especializados que corren en paralelo — uno revisa riesgo, otro normativa, otro datos — y luego consolida. Más cobertura, menos cuellos de botella.</p>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h4 className="text-base font-bold text-white-f mb-2">🛠️ Agent SDK</h4>
                <p className="text-[0.85rem] text-muted">El mismo motor de Claude Code, abierto para que el banco construya sus propios agentes: un agente de conciliación, uno de monitoreo de mercado, uno de atención a asesores — con permisos y herramientas controladas.</p>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 6.5 · ORQUESTACIÓN ═══════════════ */}
      <RevealSection>
        <section id="orquestacion" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-20">
          <p className="font-mono text-[0.72rem] uppercase tracking-widest mb-3" style={{ color: CORAL }}>
            07 · Orquestación
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-white-f leading-tight mb-3">
            Orquestar: <span style={{ color: CORAL }}>componer varias llamadas en un sistema</span>
          </h2>
          <p className="text-muted max-w-3xl mb-4">
            Un solo prompt rara vez resuelve un proceso real. <strong className="text-white-f">Orquestación</strong> es
            cómo se conectan varias llamadas a Claude, herramientas y datos para formar un sistema confiable. Anthropic
            distingue dos familias:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mb-8">
            <div className="rounded-xl border p-4" style={{ borderColor: "#3A7BD555", background: "#3A7BD512" }}>
              <p className="text-[0.8rem] font-bold text-white-f mb-1">⚙️ Workflows</p>
              <p className="text-[0.8rem] text-muted">Los pasos están definidos en código. Predecibles y auditables — clave en banca.</p>
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: "#22C55E55", background: "#22C55E12" }}>
              <p className="text-[0.8rem] font-bold text-white-f mb-1">🤖 Agentes</p>
              <p className="text-[0.8rem] text-muted">El modelo dirige su propio proceso y elige las herramientas sobre la marcha.</p>
            </div>
          </div>

          {/* chips de patrones */}
          <div className="flex flex-wrap gap-2 mb-6">
            {ORQUESTACION.map((o) => {
              const on = orq === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => setOrq(o.id)}
                  className="flex items-center gap-2 rounded-xl px-3.5 py-2 border transition-all"
                  style={{
                    background: on ? `${o.color}1e` : "rgba(255,255,255,0.02)",
                    borderColor: on ? `${o.color}66` : "rgba(255,255,255,0.08)",
                    transform: on ? "translateY(-2px)" : "none",
                  }}
                >
                  <span>{o.icon}</span>
                  <span className="text-[0.8rem] font-semibold" style={{ color: on ? "#fff" : "#7a82a0" }}>{o.name}</span>
                </button>
              );
            })}
          </div>

          {/* diagrama + detalle */}
          <div className="grid md:grid-cols-[1.15fr_1fr] gap-6 items-stretch">
            <div className="rounded-2xl border bg-[#0A0E22] p-6 flex flex-col justify-center" style={{ borderColor: `${orqSel.color}40` }}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[0.62rem] uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: `${orqSel.color}1e`, color: orqSel.color }}>
                  {orqSel.kind}
                </span>
                <span className="font-mono text-[0.6rem] text-muted">diagrama</span>
              </div>
              <PatternSVG id={orqSel.id} c={orqSel.color} />
            </div>
            <div className="rounded-2xl border bg-card p-6 md:p-7" style={{ borderColor: `${orqSel.color}33` }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{orqSel.icon}</span>
                <h3 className="text-xl font-bold text-white-f">{orqSel.name}</h3>
              </div>
              <p className="text-txt leading-relaxed mb-5">{orqSel.desc}</p>
              <div className="flex items-start gap-3 rounded-xl p-4" style={{ background: `${orqSel.color}12` }}>
                <span>🏦</span>
                <p className="text-[0.85rem] text-txt"><span className="font-semibold" style={{ color: orqSel.color }}>Ejemplo BTG:</span> {orqSel.btg}</p>
              </div>
            </div>
          </div>

          {/* principio rector */}
          <div className="mt-8 rounded-2xl border p-6 flex items-start gap-4" style={{ borderColor: "rgba(224,120,86,0.35)", background: "rgba(224,120,86,0.06)" }}>
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-[0.9rem] font-bold text-white-f mb-1">El principio que repite Anthropic</p>
              <p className="text-[0.86rem] text-muted">
                Las mejores soluciones usan <span className="text-white-f">patrones simples y componibles</span>, no frameworks
                complejos. Empieza con lo más simple que funcione y agrega complejidad solo cuando <em>demuestre</em> que mejora
                el resultado. En un banco, eso también significa más control y más auditabilidad.
              </p>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 8 · APP VS LOCAL ═══════════════ */}
      <RevealSection>
        <section id="correr" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-20">
          <p className="font-mono text-[0.72rem] uppercase tracking-widest mb-3" style={{ color: "#E85A1F" }}>08 · Cómo se corre</p>
          <h2 className="text-2xl md:text-4xl font-bold text-white-f leading-tight mb-3">
            En la <span style={{ color: "#3A7BD5" }}>aplicación</span> y en <span style={{ color: "#E85A1F" }}>local</span>
          </h2>
          <p className="text-muted max-w-2xl mb-8">
            Dos puertas al mismo Claude. La app es para todo el mundo; lo local (Claude Code) es para quien construye.
          </p>

          {/* toggle */}
          <div className="inline-flex rounded-xl border border-white/[0.1] p-1 mb-6 bg-[#0D1229]">
            {(["app", "local"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVista(v)}
                className="px-5 py-2 rounded-lg text-[0.82rem] font-semibold transition-all"
                style={{
                  background: vista === v ? APP_LOCAL[v].color : "transparent",
                  color: vista === v ? "#080C1F" : "#7a82a0",
                }}
              >
                {APP_LOCAL[v].icon} {APP_LOCAL[v].title}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border bg-card overflow-hidden" style={{ borderColor: `${APP_LOCAL[vista].color}40` }}>
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3" style={{ background: `${APP_LOCAL[vista].color}12` }}>
              <span className="text-2xl">{APP_LOCAL[vista].icon}</span>
              <div>
                <h3 className="text-lg font-bold text-white-f">{APP_LOCAL[vista].title}</h3>
                <p className="font-mono text-[0.68rem]" style={{ color: APP_LOCAL[vista].color }}>{APP_LOCAL[vista].sub}</p>
              </div>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {APP_LOCAL[vista].rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[120px_1fr] md:grid-cols-[180px_1fr] gap-4 px-6 py-3.5">
                  <span className="text-[0.78rem] font-mono text-muted">{k}</span>
                  <span className="text-[0.88rem] text-txt">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[0.78rem] text-muted mt-4">
            El taller hands-on de instalación y comandos de Claude Code lo hiciste en la{" "}
            <Link href="/sesion/6" className="text-orange underline underline-offset-2">Sesión 6</Link>. Aquí lo ubicamos en el
            mapa: misma inteligencia, distinta puerta de entrada.
          </p>
        </section>
      </RevealSection>

      {/* ═══════════════ 8 · MEMORIA ═══════════════ */}
      <RevealSection>
        <section id="memoria" className="bg-deep scroll-mt-20">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <p className="font-mono text-[0.72rem] uppercase tracking-widest mb-3" style={{ color: "#7B73E8" }}>09 · Memoria</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white-f leading-tight mb-3">
              Cómo <span className="text-purple-light">recuerda</span> Claude
            </h2>
            <p className="text-muted max-w-3xl mb-10">
              La memoria de Claude tiene capas, de la más inmediata a la más duradera. Haz clic en cada una.
            </p>

            <div className="grid md:grid-cols-[280px_1fr] gap-6">
              <div className="space-y-2">
                {MEMORIA.map((c) => {
                  const on = capa === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCapa(c.id)}
                      className="w-full text-left rounded-xl px-4 py-3 border transition-all"
                      style={{
                        background: on ? `${c.color}1a` : "rgba(255,255,255,0.02)",
                        borderColor: on ? `${c.color}55` : "rgba(255,255,255,0.06)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span>{c.icon}</span>
                        <span className="text-[0.88rem] font-semibold" style={{ color: on ? "#fff" : "#c5cae0" }}>{c.name}</span>
                      </div>
                      <p className="text-[0.7rem] text-muted mt-0.5 ml-6">{c.short}</p>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl border bg-card p-6 md:p-8" style={{ borderColor: `${capaSel.color}40` }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{capaSel.icon}</span>
                  <h3 className="text-xl font-bold text-white-f">{capaSel.name}</h3>
                </div>
                <p className="text-txt leading-relaxed mb-5">{capaSel.body}</p>
                <div className="flex items-start gap-3 rounded-xl p-4" style={{ background: `${capaSel.color}12` }}>
                  <span>🏦</span>
                  <p className="text-[0.85rem] text-txt"><span className="font-semibold" style={{ color: capaSel.color }}>Para BTG:</span> {capaSel.btg}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 flex items-start gap-3">
              <span className="text-lg">🔒</span>
              <p className="text-[0.82rem] text-muted">
                <span className="text-white-f font-semibold">Control y gobernanza:</span> tú decides qué se guarda en la
                memoria persistente y qué no. En un banco esto es clave — la memoria es una herramienta de productividad,
                no un repositorio de datos sensibles. Las políticas de datos del banco siguen mandando.
              </p>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 10 · RECURSOS ANTHROPIC ═══════════════ */}
      <RevealSection>
        <section id="recursos" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-20">
          <p className="font-mono text-[0.72rem] uppercase tracking-widest mb-3 text-cyan">10 · Lo que enseña Anthropic hoy</p>
          <h2 className="text-2xl md:text-4xl font-bold text-white-f leading-tight mb-3">
            Aprende de <span className="text-cyan">la fuente</span>
          </h2>
          <p className="text-muted max-w-3xl mb-10">
            Esta lección está construida sobre lo que Anthropic publica y enseña a junio de 2026. Estos son los recursos
            oficiales para seguir profundizando — todos gratuitos.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RECURSOS.map((r) => (
              <a
                key={r.title}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-white/[0.06] bg-card p-6 hover:-translate-y-1 transition-all flex flex-col"
                style={{ boxShadow: `inset 0 2px 0 ${r.color}` }}
              >
                <div className="text-3xl mb-3">{r.icon}</div>
                <h3 className="text-base font-bold text-white-f mb-1.5" style={{ color: r.color }}>{r.title}</h3>
                <p className="text-[0.83rem] text-muted flex-1">{r.desc}</p>
                <span className="mt-4 text-[0.72rem] font-mono inline-flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: r.color }}>
                  {r.cta} <span>↗</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 11 · BENEFICIOS ═══════════════ */}
      <RevealSection>
        <section id="beneficios" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-20">
          <p className="font-mono text-[0.72rem] uppercase tracking-widest mb-3" style={{ color: CORAL }}>11 · Beneficios</p>
          <h2 className="text-2xl md:text-4xl font-bold text-white-f leading-tight mb-10">
            Por qué Claude, <span style={{ color: CORAL }}>para un banco</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFICIOS.map((b) => (
              <div key={b.title} className="rounded-2xl border border-white/[0.06] bg-card p-6 hover:-translate-y-1 transition-all" style={{ boxShadow: `inset 0 2px 0 ${b.color}` }}>
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="text-base font-bold text-white-f mb-1" style={{ color: b.color }}>{b.title}</h3>
                <p className="text-[0.85rem] text-muted">{b.body}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ CIERRE ═══════════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-24">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(224,120,86,0.08), transparent)" }}
          />
          <div className="relative bg-gradient-to-br from-[#0F1438] via-[#0D1229] to-[#080C1F] border border-white/[0.08] rounded-3xl p-8 md:p-12">
            <p className="font-mono text-[0.72rem] uppercase tracking-widest mb-3" style={{ color: CORAL }}>Cierre · Lección Claude</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
              Un colega que <span style={{ color: CORAL }}>razona</span>, <span className="text-purple-light">construye</span> y <span className="text-green">opera</span>
            </h2>
            <p className="text-lg text-muted max-w-3xl mb-8 leading-relaxed">
              Claude pasó de chatbot a plataforma: tres modelos para elegir por tarea, seis modos de uso, skills y agentes
              que lo extienden, y una memoria por capas que aprende tu contexto. Para BTG, eso es la diferencia entre
              &ldquo;una IA que responde&rdquo; y un sistema que se integra al trabajo real de banca de inversión, wealth y compliance.
            </p>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { k: "Elige", v: "El modelo correcto por tarea (Opus / Sonnet / Haiku)", c: "#5B52D5" },
                { k: "Extiende", v: "Skills + agentes + MCP a los procesos del banco", c: "#D4AF4C" },
                { k: "Conecta", v: "Esta lección con la S6 (Claude Code) y M03 (automatización)", c: "#22C55E" },
              ].map((s) => (
                <div key={s.k} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                  <p className="font-mono text-[0.58rem] uppercase tracking-widest mb-1.5" style={{ color: s.c }}>{s.k}</p>
                  <p className="text-[0.85rem] font-bold text-white-f leading-snug">{s.v}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/sesion/6" className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ background: "rgba(232,90,31,0.15)", color: "#FF7A42", border: "1px solid rgba(232,90,31,0.35)" }}>
                ← Sesión 6 · Programación asistida
              </Link>
              <Link href="/" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white-f bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                Volver al inicio
              </Link>
            </div>
          </div>
        </section>
      </RevealSection>
    </div>
  );
}
