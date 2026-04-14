"use client";

import { useState, useCallback, useEffect } from "react";
import RevealSection from "@/components/RevealSection";

/* ════════════════════════════ DATA ════════════════════════════ */

const AGENDA = [
  { time: "0:00–0:15", label: "Caso: El stack IA de JPMorgan", color: "#00E5A0" },
  { time: "0:15–0:35", label: "Taxonomía + Timeline", color: "#5B52D5" },
  { time: "0:35–1:00", label: "LLMs & Agentes comparados", color: "#7B73E8" },
  { time: "1:00–1:20", label: "Ecosistemas & MCP", color: "#E85A1F" },
  { time: "1:20–1:45", label: "Taller: Tu stack IA", color: "#D4AF4C" },
  { time: "1:45–2:00", label: "Reto: Pitch + Demo", color: "#22C55E" },
];

const TIMELINE = [
  { year: "2022", event: "ChatGPT lanza la era GenAI", detail: "GPT-3.5 abre el acceso masivo a LLMs. 100M usuarios en 2 meses.", color: "#22C55E", icon: "◈" },
  { year: "2023", event: "GPT-4 + Claude 2 + Plugins", detail: "Multimodalidad, razonamiento avanzado, y la primera ola de herramientas conectadas.", color: "#3A7BD5", icon: "◉" },
  { year: "2024", event: "MCP + Agentes + Open Source", detail: "Anthropic lanza MCP. Llama 3 democratiza. Claude 3.5 Sonnet domina coding. Devin aparece.", color: "#5B52D5", icon: "◆" },
  { year: "2025", event: "Claude Code + v0 + AI Builders", detail: "Agentes autónomos de código. v0, Bolt, Lovable crean apps desde texto. Copilot en todo M365.", color: "#E85A1F", icon: "◎" },
  { year: "2026", event: "IA agéntica + MCP ubicuo", detail: "Agentes multi-paso en producción. MCP conecta LLMs a todo. Claude 4.6 Opus con 1M tokens. GPT-5.4. Gemini 3.1 con 2M.", color: "#00E5A0", icon: "★" },
];

const TOOL_CATEGORIES = [
  {
    id: "general", label: "Asistentes Generales", icon: "◉", color: "#00E5A0",
    desc: "LLMs conversacionales para análisis, redacción, investigación y razonamiento.",
    tools: [
      { name: "Claude", provider: "Anthropic", highlight: "1M tokens. Projects con knowledge base. Artifacts para visualizar outputs. El más seguro para finanzas.", color: "#E85A1F", badge: "TOP BTG" },
      { name: "ChatGPT", provider: "OpenAI", highlight: "GPT-5.4 con Canvas, DALL·E, plugins, browsing. Custom GPTs sin código. El ecosistema más amplio.", color: "#22C55E", badge: "" },
      { name: "Gemini", provider: "Google", highlight: "2M tokens (el mayor). Integración nativa Workspace. NotebookLM incluido. Deep Research para investigación autónoma.", color: "#3A7BD5", badge: "" },
      { name: "Perplexity", provider: "Perplexity AI", highlight: "Search-first AI. Respuestas con fuentes citadas en tiempo real. Ideal para research de mercado verificable.", color: "#9B59B6", badge: "NEW" },
    ],
  },
  {
    id: "agents", label: "Agentes IA Autónomos", icon: "🤖", color: "#9B59B6",
    desc: "La frontera 2026: agentes que ejecutan tareas complejas de forma autónoma — planifican, ejecutan, iteran.",
    tools: [
      { name: "Claude Code", provider: "Anthropic", highlight: "Agente de código en terminal. Lee repos completos, ejecuta tests, crea PRs, debuggea. Usa Claude 4.6 Opus.", color: "#E85A1F", badge: "AGENTE" },
      { name: "Codex Agent", provider: "OpenAI", highlight: "Agente cloud que ejecuta tareas de código en sandbox. Crea branches, corre tests, genera PRs automáticamente.", color: "#22C55E", badge: "AGENTE" },
      { name: "Devin", provider: "Cognition", highlight: "El primer 'ingeniero de software IA'. Planifica, codifica, debuggea y despliega. Integrado con Slack y GitHub.", color: "#3A7BD5", badge: "AGENTE" },
      { name: "Computer Use", provider: "Anthropic", highlight: "Claude controla un computador: clicks, teclado, navegación. Automatiza cualquier tarea con interfaz gráfica.", color: "#D4AF4C", badge: "FRONTIER" },
    ],
  },
  {
    id: "builders", label: "App Builders IA", icon: "⚡", color: "#E85A1F",
    desc: "Crea aplicaciones completas desde una descripción en texto. Sin código, deploy instantáneo.",
    tools: [
      { name: "v0", provider: "Vercel", highlight: "Genera UI/apps React desde prompts. Preview en tiempo real. Deploy a Vercel en un click. Ideal para dashboards financieros.", color: "#22C55E", badge: "HOT" },
      { name: "Bolt", provider: "StackBlitz", highlight: "App builder full-stack en el navegador. Genera frontend + backend + base de datos. Edición en tiempo real.", color: "#3A7BD5", badge: "NEW" },
      { name: "Lovable", provider: "Lovable", highlight: "De idea a app desplegada en minutos. Supabase integrado. Ideal para MVPs y prototipos internos rápidos.", color: "#E85A1F", badge: "NEW" },
      { name: "Replit Agent", provider: "Replit", highlight: "Agente que construye apps completas desde conversación. Ambiente de desarrollo cloud con deploy incluido.", color: "#D4AF4C", badge: "AGENTE" },
    ],
  },
  {
    id: "coding", label: "Coding Assistants", icon: "⌨", color: "#5B52D5",
    desc: "Herramientas que potencian a desarrolladores: autocompletado, refactoring, debugging, pair programming con IA.",
    tools: [
      { name: "Cursor", provider: "Cursor Inc.", highlight: "El IDE más popular con IA. Chat + Composer + Tab completion. Entiende todo tu proyecto. Multi-modelo.", color: "#5B52D5", badge: "TOP" },
      { name: "GitHub Copilot", provider: "GitHub", highlight: "Autocompletado + chat + agent mode. Integrado en VS Code y JetBrains. El más usado en enterprise.", color: "#22C55E", badge: "" },
      { name: "Windsurf", provider: "Codeium", highlight: "IDE con Cascade: flujo agéntico de edición. Competidor directo de Cursor con enfoque en flujos complejos.", color: "#00E5A0", badge: "NEW" },
      { name: "Augment", provider: "Augment", highlight: "IA que entiende codebases masivos (millones de líneas). Ideal para enterprise con código legacy complejo.", color: "#3A7BD5", badge: "ENTERPRISE" },
    ],
  },
  {
    id: "automation", label: "Automatización", icon: "🔄", color: "#D4AF4C",
    desc: "Plataformas para conectar herramientas, eliminar trabajo manual, y orquestar flujos con IA.",
    tools: [
      { name: "n8n", provider: "n8n GmbH", highlight: "Open-source, self-hosted. +400 integraciones. Nodos de IA nativos. El favorito para pipelines financieros.", color: "#E85A1F", badge: "TOP BTG" },
      { name: "Power Automate", provider: "Microsoft", highlight: "RPA + cloud flows. Integración profunda M365 y Dynamics. AI Builder para IA sin código.", color: "#3A7BD5", badge: "" },
      { name: "Make (Integromat)", provider: "Make", highlight: "Visual, intuitivo. 2000+ integraciones SaaS. Bueno para flujos inter-app no técnicos.", color: "#9B59B6", badge: "" },
      { name: "Zapier", provider: "Zapier", highlight: "El más simple. 7000+ apps. Central de IA para crear bots y automatizaciones con LLMs integrados.", color: "#22C55E", badge: "" },
    ],
  },
  {
    id: "research", label: "Research & Análisis", icon: "📊", color: "#3A7BD5",
    desc: "Herramientas especializadas para investigación documental, análisis de datos y generación de insights.",
    tools: [
      { name: "NotebookLM", provider: "Google", highlight: "Sube PDFs/docs → responde SOLO con tus fuentes. Audio Overview convierte docs en podcast. Cero alucinaciones.", color: "#3A7BD5", badge: "TOP" },
      { name: "Elicit", provider: "Elicit", highlight: "Research científico automatizado. Busca papers, extrae datos, sintetiza. Ideal para research de mercado riguroso.", color: "#22C55E", badge: "NEW" },
      { name: "Consensus", provider: "Consensus", highlight: "Motor de búsqueda de papers con IA. Respuestas basadas en evidencia científica con fuentes citadas.", color: "#5B52D5", badge: "" },
      { name: "Julius AI", provider: "Julius", highlight: "Análisis de datos desde chat. Sube CSV/Excel → visualizaciones, regresiones, insights automáticos. Sin código.", color: "#D4AF4C", badge: "DATA" },
    ],
  },
  {
    id: "enterprise", label: "Ecosistemas Enterprise", icon: "🏢", color: "#7B73E8",
    desc: "Plataformas que integran IA en las herramientas corporativas que los empleados ya usan.",
    tools: [
      { name: "Microsoft Copilot", provider: "Microsoft", highlight: "$30/user/mes. IA en Word, Excel, PowerPoint, Teams, Outlook. Accede a datos del tenant M365.", color: "#3A7BD5", badge: "ENTERPRISE" },
      { name: "Google Duet AI", provider: "Google", highlight: "IA en Gmail, Docs, Sheets, Meet. Gemini integrado en todo Workspace.", color: "#22C55E", badge: "ENTERPRISE" },
      { name: "Copilot Studio", provider: "Microsoft", highlight: "Crea agentes virtuales custom. Conecta SharePoint, BD, APIs internas. Low-code agent builder.", color: "#5B52D5", badge: "" },
      { name: "Amazon Q", provider: "AWS", highlight: "Asistente IA para empresas en AWS. Conecta a S3, bases de datos, código. Ideal para equipos técnicos en cloud.", color: "#E85A1F", badge: "NEW" },
    ],
  },
];

const LLM_COMPARISON = [
  {
    name: "Claude 4.6 Opus", provider: "Anthropic", icon: "◉", color: "#E85A1F",
    context: 1000000, costIn: 15, costOut: 75,
    strengths: ["Documentos largos (1M tokens)", "Instrucciones complejas", "Seguridad y compliance", "Artifacts y Projects", "MCP nativo"],
    weaknesses: ["Costo premium", "Sin búsqueda web nativa"],
    bestFor: "Due diligence, compliance, contratos, documentos extensos",
    btgArea: "Investment Banking, Compliance",
    tier: "FLAGSHIP",
  },
  {
    name: "Claude 4.6 Sonnet", provider: "Anthropic", icon: "◉", color: "#E85A1F",
    context: 200000, costIn: 3, costOut: 15,
    strengths: ["Mejor balance costo/calidad", "Rápido", "Excelente en código", "Mismo ecosistema que Opus"],
    weaknesses: ["200K contexto (vs 1M de Opus)", "Menos potente en razonamiento largo"],
    bestFor: "Tareas diarias, código, análisis rápidos, automatizaciones",
    btgArea: "Todos los equipos (uso diario)",
    tier: "BEST VALUE",
  },
  {
    name: "GPT-5.4", provider: "OpenAI", icon: "◈", color: "#22C55E",
    context: 1000000, costIn: 2.5, costOut: 10,
    strengths: ["Razonamiento avanzado", "Custom GPTs", "Canvas (edición en vivo)", "Ecosistema más amplio", "DALL·E integrado"],
    weaknesses: ["Menos consistente en instrucciones largas", "Privacidad concerns"],
    bestFor: "Modelación financiera, código, Custom GPTs, creatividad",
    btgArea: "Asset Management, Trading",
    tier: "FLAGSHIP",
  },
  {
    name: "Gemini 3.1 Ultra", provider: "Google", icon: "◆", color: "#3A7BD5",
    context: 2000000, costIn: 1.25, costOut: 5,
    strengths: ["2M tokens (el mayor)", "Google Workspace nativo", "Deep Research", "Búsqueda web integrada", "NotebookLM"],
    weaknesses: ["Menos consistente en tareas complejas", "Menor adopción enterprise LatAm"],
    bestFor: "Research documental, integración Workspace, volúmenes masivos",
    btgArea: "Research, Wealth Management",
    tier: "CONTEXT KING",
  },
  {
    name: "DeepSeek R1", provider: "DeepSeek", icon: "◎", color: "#D4AF4C",
    context: 128000, costIn: 0.55, costOut: 2.19,
    strengths: ["Razonamiento matemático top", "Chain-of-thought transparente", "Costo ultra bajo", "Open weights"],
    weaknesses: ["Jurisdicción China", "Menor soporte español", "Contexto limitado"],
    bestFor: "Análisis cuantitativo, matemáticas financieras, costo-beneficio extremo",
    btgArea: "Trading, Risk Analytics",
    tier: "BUDGET",
  },
  {
    name: "Llama 4", provider: "Meta", icon: "◇", color: "#9B59B6",
    context: 512000, costIn: 0, costOut: 0,
    strengths: ["100% privado (on-premise)", "Sin costos API", "Fine-tuning total", "Soberanía de datos"],
    weaknesses: ["Requiere infra GPU", "Menor rendimiento vs cerrados", "Necesita equipo técnico"],
    bestFor: "Datos ultra-sensibles, soberanía de datos, modelos custom internos",
    btgArea: "Operaciones internas, datos clasificados",
    tier: "ON-PREMISE",
  },
];

const ROLE_PROFILES = [
  {
    id: "analyst", label: "Analista IB", area: "Investment Banking", color: "#00E5A0", icon: "📈",
    needs: "Due diligence, memos de inversión, modelación financiera, análisis de contratos",
    stack: [
      { tool: "Claude Projects", why: "1M contexto para data rooms. Knowledge base permanente.", primary: true },
      { tool: "NotebookLM", why: "Research con cero alucinaciones sobre earnings calls y reportes.", primary: true },
      { tool: "Cursor", why: "Modelos financieros en Python rápidamente.", primary: false },
      { tool: "n8n", why: "Automatizar extracción de datos para comparables.", primary: false },
      { tool: "v0", why: "Dashboards de tracking de deals sin depender de TI.", primary: false },
    ],
  },
  {
    id: "trader", label: "Trader / S&T", area: "Sales & Trading", color: "#E85A1F", icon: "⚡",
    needs: "Análisis real-time, alertas, señales, resumen morning meetings, monitoreo volatilidad",
    stack: [
      { tool: "ChatGPT + Browsing", why: "Noticias de mercado en tiempo real con análisis instantáneo.", primary: true },
      { tool: "DeepSeek R1", why: "Cálculos cuantitativos y modelación matemática a bajo costo.", primary: true },
      { tool: "n8n", why: "Pipelines: API mercado → LLM → alerta en Teams.", primary: false },
      { tool: "Julius AI", why: "Análisis de datos de trading sin código.", primary: false },
      { tool: "Cursor", why: "Scripts de análisis con pandas y visualización.", primary: false },
    ],
  },
  {
    id: "compliance", label: "Compliance", area: "Compliance & Risk", color: "#D4AF4C", icon: "⚖",
    needs: "Normas SFC, monitoreo SARLAFT, reportes regulatorios, revisión contratos, KYC/AML",
    stack: [
      { tool: "Claude Projects", why: "Toda la normativa SFC indexada. Responde citando circulares.", primary: true },
      { tool: "Llama 4 (on-prem)", why: "Datos sensibles sin enviar a terceros.", primary: true },
      { tool: "Power Automate", why: "Flujos de aprobación y reportes regulatorios.", primary: false },
      { tool: "DBeaver + IA", why: "Consultas a BD de transacciones en lenguaje natural.", primary: false },
      { tool: "Copilot Studio", why: "Agente virtual para consultas de compliance del equipo.", primary: false },
    ],
  },
  {
    id: "advisor", label: "Asesor WM", area: "Wealth Management", color: "#5B52D5", icon: "💼",
    needs: "Reportes para clientes, research productos, propuestas de inversión, comunicación HNW",
    stack: [
      { tool: "Gemini + Workspace", why: "Genera reportes en Docs desde datos en Sheets automáticamente.", primary: true },
      { tool: "Claude", why: "Análisis profundo de portafolios con razonamiento estructurado.", primary: true },
      { tool: "Microsoft Copilot", why: "Presentaciones PowerPoint y correos Outlook automatizados.", primary: false },
      { tool: "NotebookLM", why: "Research de productos con fuentes verificables.", primary: false },
      { tool: "Perplexity", why: "Datos de mercado actualizados con fuentes citadas.", primary: false },
    ],
  },
  {
    id: "ops", label: "Tech / Ops", area: "Tecnología & Operaciones", color: "#22C55E", icon: "🔧",
    needs: "Automatización, integración sistemas, desarrollo herramientas internas, monitoreo",
    stack: [
      { tool: "Claude Code", why: "Agente de desarrollo: lee repos, ejecuta tests, crea PRs.", primary: true },
      { tool: "n8n", why: "Orquestación: APIs + BD + LLMs en un solo flujo.", primary: true },
      { tool: "Copilot Studio", why: "Agentes virtuales para helpdesk interno.", primary: false },
      { tool: "GitHub Copilot", why: "Autocompletado para el equipo de desarrollo.", primary: false },
      { tool: "v0 / Bolt", why: "Prototipos de herramientas internas en minutos.", primary: false },
    ],
  },
];

const CRITERIA = [
  { id: "security", label: "Seguridad", icon: "🔒", color: "#E74C3C", desc: "¿Datos salen de la org? ¿Cifrado? ¿SOC2? ¿Habeas Data?" },
  { id: "cost", label: "Costo", icon: "💰", color: "#D4AF4C", desc: "¿Por usuario, por API call, flat fee? ¿Escala bien?" },
  { id: "integration", label: "Integración", icon: "🔗", color: "#3A7BD5", desc: "¿API? ¿MCP? ¿SSO? ¿Se conecta a herramientas existentes?" },
  { id: "learning", label: "Curva", icon: "📚", color: "#22C55E", desc: "¿Tiempo hasta ser productivo? ¿Requiere skills técnicos?" },
  { id: "compliance", label: "Regulación", icon: "📋", color: "#9B59B6", desc: "¿SFC? ¿SOC2? ¿GDPR? ¿Certificaciones enterprise?" },
  { id: "output", label: "Calidad Output", icon: "✨", color: "#00E5A0", desc: "¿Resultados para el caso de uso específico?" },
];

const DIAG_QUESTIONS = [
  { q: "¿Cuál es tu rol principal en BTG Pactual?", opts: [
    { id: "analyst", label: "Investment Banking / M&A" },
    { id: "advisor", label: "Wealth Management / Advisory" },
    { id: "trader", label: "Sales & Trading / Research" },
    { id: "compliance", label: "Compliance / Risk / Legal" },
    { id: "ops", label: "Tecnología / Operaciones" },
  ]},
  { q: "¿Qué nivel de experiencia tienes con IA?", opts: [
    { id: "beginner", label: "He usado ChatGPT casualmente" },
    { id: "intermediate", label: "Uso IA regularmente en mi trabajo" },
    { id: "advanced", label: "Construyo soluciones con IA" },
  ]},
  { q: "¿Qué ecosistema tecnológico usa tu equipo?", opts: [
    { id: "microsoft", label: "Microsoft 365 (Outlook, Teams, SharePoint)" },
    { id: "google", label: "Google Workspace (Gmail, Docs, Drive)" },
    { id: "hybrid", label: "Híbrido / Otro" },
  ]},
  { q: "¿Tu prioridad #1 al adoptar IA?", opts: [
    { id: "productivity", label: "Productividad (más en menos tiempo)" },
    { id: "quality", label: "Calidad (análisis más profundos)" },
    { id: "automation", label: "Automatizar procesos repetitivos" },
    { id: "innovation", label: "Innovar (crear soluciones nuevas)" },
  ]},
];

const DIAG_RESULTS: Record<string, { title: string; color: string; stack: string[]; tip: string }> = {
  analyst: { title: "Stack Investment Banking", color: "#00E5A0", stack: ["Claude Projects", "NotebookLM", "Cursor", "n8n", "v0"], tip: "Tu prioridad: analizar grandes volúmenes con precisión. Claude Projects (1M tokens) + NotebookLM (cero alucinaciones) son tu core." },
  advisor: { title: "Stack Wealth Management", color: "#5B52D5", stack: ["Gemini + Workspace", "Claude", "Copilot M365", "NotebookLM", "Perplexity"], tip: "Genera reportes y comunicación personalizada. La integración con tu ecosistema Office/Google es clave." },
  trader: { title: "Stack Sales & Trading", color: "#E85A1F", stack: ["ChatGPT", "DeepSeek R1", "n8n", "Julius AI", "Cursor"], tip: "Velocidad y cálculo cuantitativo. Automatiza alertas y monitoreo con n8n + LLMs." },
  compliance: { title: "Stack Compliance & Risk", color: "#D4AF4C", stack: ["Claude Projects", "Llama 4 (on-prem)", "Power Automate", "DBeaver + IA", "Copilot Studio"], tip: "Seguridad no-negociable. Modelos on-premise para datos sensibles + Claude para normativa." },
  ops: { title: "Stack Tecnología", color: "#22C55E", stack: ["Claude Code", "n8n", "Copilot Studio", "GitHub Copilot", "v0 / Bolt"], tip: "Eres el habilitador. Tu stack combina desarrollo avanzado + orquestación para potenciar todos los equipos." },
};

/* ═══════════ NEURO · Fin del prompt engineering ═══════════ */

const MEMORY_SYSTEMS = [
  {
    id: "working",
    brain: "Memoria de trabajo",
    region: "Córtex prefrontal dorsolateral",
    brainDesc: "Sostiene ~7 ítems durante segundos. Es el 'escritorio mental' donde razonas aquí y ahora.",
    llm: "Context window",
    llmDesc: "Los tokens que el modelo ve en esta conversación. Claude 4.6 Opus: 1M tokens ≈ 750k palabras sostenidas simultáneamente.",
    analogy: "Tu escritorio vs. el context window: ambos son temporales, finitos, pero el del modelo es 100,000× mayor que el tuyo.",
    color: "#00E5A0",
    icon: "◉",
  },
  {
    id: "episodic",
    brain: "Memoria episódica",
    region: "Hipocampo",
    brainDesc: "Consolida experiencias vividas en memorias recuperables. Sin hipocampo no hay 'ayer'.",
    llm: "Projects, Memory tools, custom instructions",
    llmDesc: "El modelo guarda hechos, preferencias y documentos que reaparecen en cada conversación nueva. Es el 'hipocampo externo' del LLM.",
    analogy: "Tú recuerdas que tu hija odia el brócoli. Claude recuerda que BTG nunca pega datos de clientes en prompts. Misma función.",
    color: "#5B52D5",
    icon: "◆",
  },
  {
    id: "semantic",
    brain: "Memoria semántica",
    region: "Córtex temporal + parietal",
    brainDesc: "Conocimiento del mundo: capitales, fórmulas, gramática. No recuerdas cuándo lo aprendiste, solo que lo sabes.",
    llm: "Pesos del modelo (pre-training)",
    llmDesc: "Trillones de parámetros entrenados con toda la web, libros, código. Es conocimiento destilado, no consultado.",
    analogy: "Cuando sabes que París es la capital de Francia sin 'buscarlo', es igual a cuando Claude sabe Black-Scholes sin googlearlo.",
    color: "#E85A1F",
    icon: "★",
  },
];

const BRAIN_LLM_MAP = [
  { brain: "Área de Broca", role: "Producción del lenguaje", llm: "Decoder / generación de tokens", color: "#00E5A0" },
  { brain: "Área de Wernicke", role: "Comprensión del lenguaje", llm: "Encoder / attention sobre input", color: "#5B52D5" },
  { brain: "Córtex prefrontal", role: "Razonamiento, planificación", llm: "Chain-of-thought, reasoning tokens", color: "#E85A1F" },
  { brain: "Sistema límbico", role: "Valor, prioridad emocional", llm: "RLHF — alineación con preferencias humanas", color: "#D4AF4C" },
  { brain: "Plasticidad sináptica", role: "Aprender con la experiencia", llm: "Fine-tuning + memoria persistente", color: "#3A7BD5" },
];

const DUAL_PROCESS = [
  {
    system: "Sistema 1",
    speed: "Rápido · Automático · Inconsciente",
    brain: "Ganglios basales, cerebelo, córtex posterior",
    brainDesc: "Pattern-matching instantáneo. Reconoces una cara, lees una palabra, calculas 2+2 sin esfuerzo.",
    llmOld: "Forward pass directo — el modelo escupe tokens en el orden en que salen",
    llmNew: "Respuesta sin bloque de reasoning: Claude 4.6 Sonnet sin thinking, GPT-5.4 base, Gemini 3.1 Flash",
    kahneman: "Kahneman lo llamó 'pensar rápido'. Es barato, casi siempre correcto, pero falla en problemas novedosos.",
    color: "#22C55E",
    icon: "⚡",
  },
  {
    system: "Sistema 2",
    speed: "Lento · Deliberado · Consciente",
    brain: "Córtex prefrontal dorsolateral + red de control ejecutivo",
    brainDesc: "Razonamiento explícito. Multiplicas 17×24 en la cabeza, resuelves un sudoku, evalúas una hipótesis.",
    llmOld: "(No existía en 2022) — había que simularlo con 'piensa paso a paso' en el prompt",
    llmNew: "Reasoning tokens internos: Claude 4.6 Opus con Extended Thinking, o3, Gemini 3.1 Deep Think, DeepSeek R1",
    kahneman: "'Pensar despacio'. Caro, lento, pero resuelve lo que Sistema 1 no puede. Los modelos razonantes lo internalizaron.",
    color: "#5B52D5",
    icon: "◆",
  },
];

const REASONING_MECHANICS = [
  {
    title: "Test-time compute scaling",
    subtitle: "Pensar más tiempo = mejor respuesta",
    body: "En 2024 OpenAI descubrió una segunda ley de escala: darle más tokens de pensamiento interno al modelo en inferencia mejora el resultado tanto como entrenarlo con más datos. o1 resuelve problemas de matemáticas olímpicas porque piensa durante minutos antes de responder.",
    number: "10×–100×",
    numberLabel: "tokens internos antes de responder",
    color: "#E85A1F",
  },
  {
    title: "Reasoning tokens invisibles",
    subtitle: "El modelo piensa en un scratchpad privado",
    body: "Claude 4.6 Opus con Extended Thinking genera un bloque de razonamiento que el usuario puede ver pero que no cuenta como respuesta. Es el equivalente a que tú murmures en voz alta mientras resuelves un problema: verbalizar ayuda a pensar.",
    number: "64K",
    numberLabel: "tokens de thinking en Opus",
    color: "#5B52D5",
  },
  {
    title: "Autoverificación y backtracking",
    subtitle: "El modelo se corrige a sí mismo",
    body: "Un modelo razonante revisa su propia cadena de pensamiento, detecta errores, vuelve atrás y prueba otra ruta. Esto era imposible con GPT-3.5: una vez empezaba a escribir mal, seguía mal. o3 y Opus abandonan ramas muertas igual que un matemático tachando una demostración.",
    number: "40%",
    numberLabel: "reducción de alucinaciones vs. modelos base",
    color: "#00E5A0",
  },
  {
    title: "Inference = consciencia computacional",
    subtitle: "Default Mode Network ↔ reasoning loop",
    body: "En neurociencia, la Default Mode Network se activa cuando dejas la mente divagar y es la base del pensamiento reflexivo. Los modelos razonantes tienen un análogo: un loop interno donde exploran posibilidades antes de comprometerse con una respuesta. No es conciencia — es iteración estructurada.",
    number: "γ 40Hz",
    numberLabel: "oscilaciones gamma en razonamiento humano",
    color: "#3A7BD5",
  },
];

const REASONING_MODELS = [
  {
    name: "Claude 4.6 Opus",
    mode: "Extended Thinking",
    how: "Activas un toggle o pides 'piensa antes de responder'. Genera hasta 64K tokens de razonamiento visibles antes de la respuesta final.",
    strength: "Problemas largos de múltiples pasos, due diligence, revisión de contratos",
    btg: "Investment Banking: evaluar una tesis de inversión razonando sobre 20 fuentes simultáneamente",
    color: "#E85A1F",
  },
  {
    name: "OpenAI o3",
    mode: "Reasoning nativo (siempre on)",
    how: "No hay toggle: siempre piensa antes de responder. Tiempo de inferencia variable (segundos a minutos) según la dificultad.",
    strength: "Matemáticas, física, programación competitiva, lógica formal",
    btg: "Trading cuantitativo: modelación de derivados y validación de estrategias",
    color: "#22C55E",
  },
  {
    name: "Gemini 3.1 Deep Think",
    mode: "Deep Think mode",
    how: "Modo opcional que multiplica el compute. Combina razonamiento + búsqueda web + análisis de documentos largos en paralelo.",
    strength: "Research multi-fuente, investigación con citas, análisis de mercado",
    btg: "Wealth Management: briefing de research sobre un sector con 50 fuentes citadas",
    color: "#3A7BD5",
  },
  {
    name: "DeepSeek R1",
    mode: "Chain-of-thought transparente",
    how: "Muestra cada paso del razonamiento en texto plano. Open-weights: puedes inspeccionar cómo piensa y correrlo on-premise.",
    strength: "Costo mínimo, razonamiento matemático, auditoría total del proceso",
    btg: "Risk: validar cálculos sensibles con trazabilidad completa del razonamiento",
    color: "#D4AF4C",
  },
];

const BEFORE_AFTER = [
  {
    era: "2022–2023 · Era del prompt engineering",
    color: "#E85A1F",
    model: "GPT-3.5, Claude 1, Llama 2",
    problem: "Modelos que completaban texto sin razonar. Necesitaban 'coaching' elaborado.",
    practice: [
      "\"Eres un experto en finanzas con 30 años de experiencia...\"",
      "Few-shot: pegar 5 ejemplos antes de la pregunta real",
      "Chain-of-thought manual: \"piensa paso a paso\"",
      "Trucos mágicos: \"I will tip $200\", \"take a deep breath\"",
    ],
    why: "El modelo no razonaba. El prompt era una prótesis cognitiva que compensaba lo que le faltaba por dentro.",
  },
  {
    era: "2025–2026 · Era de la memoria + razonamiento",
    color: "#00E5A0",
    model: "Claude 4.6 Opus, GPT-5.4, o3, Gemini 3.1",
    problem: "Modelos que razonan nativamente, recuerdan al usuario y aprenden de la conversación.",
    practice: [
      "Context engineering: qué documentos, datos y memoria carga el modelo",
      "Relación continua: Projects, memory files, custom instructions",
      "Instrucciones directas — el modelo ya piensa paso a paso solo",
      "Verificación y evaluación, no persuasión",
    ],
    why: "El razonamiento vive dentro del modelo. El usuario diseña el contexto y la relación, no la magia verbal.",
  },
];

/* ═══════════ SETUP · Tutoriales abril 2026 ═══════════ */

const SETUP_GUIDES = [
  {
    id: "claude",
    name: "Claude",
    provider: "Anthropic",
    url: "claude.ai",
    plan: "Free · Pro $20 · Max $100/$200 · Team $25–30/user · Enterprise",
    color: "#E85A1F",
    icon: "◉",
    tagline: "El más seguro para finanzas, 1M tokens, memoria persistente nativa",
    steps: [
      { title: "Crear cuenta y elegir plan", body: "Entra a claude.ai → Sign up con email corporativo. Pro ($20/mes) ya incluye Projects ilimitados, memoria, Claude Code en terminal, Google Workspace y remote MCP. Max ($100 por 5× Pro, $200 por 20× Pro) para power users. Team ($25 anual / $30 mensual por usuario) añade workspace compartido y zero-retention. Enterprise para BTG." },
      { title: "Custom Instructions globales", body: "Settings → Profile → 'What should Claude know about you'. Escribe tu rol, área de BTG, estilo de respuesta preferido y restricciones de datos. Esto persiste en TODA conversación." },
      { title: "Crear tu primer Project", body: "Sidebar → Projects → New Project. Sube hasta 200K tokens de docs (normativa SFC, modelos financieros, templates). Claude los trata como 'knowledge base' permanente." },
      { title: "Activar Memory tool", body: "En Projects → Settings → Memory: ON. Claude guarda hechos que aprende sobre ti y tus proyectos entre sesiones. Aparece como archivos editables — puedes borrar memorias específicas." },
      { title: "Conectar MCP servers", body: "Settings → Connectors → añade MCP servers (Google Drive, GitHub, Notion, bases de datos). Claude accede directo sin copiar-pegar. Requiere Team+." },
      { title: "Extended Thinking", body: "En cualquier conversación: toggle 'Extended thinking' (o escribe 'piensa con cuidado antes de responder'). Usa reasoning tokens internos antes de contestar. Ideal para due diligence." },
      { title: "Artifacts y Computer Use", body: "Claude genera documentos, dashboards y código ejecutable en Artifacts (panel lateral). Computer Use (Enterprise) le permite operar tu navegador: formularios, descargas, screenshots." },
    ],
    btgTip: "Crea un Project por cada mandato activo. Sube data room, tesis y normativa. El modelo responde con contexto completo sin que repitas nada.",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    provider: "OpenAI",
    url: "chatgpt.com",
    plan: "Free · Go $8 · Plus $20 · Pro $200 · Business $25–30 · Enterprise",
    color: "#22C55E",
    icon: "◈",
    tagline: "El ecosistema más amplio: GPTs custom, Canvas, Sora, Agent Mode",
    steps: [
      { title: "Suscripción y selección de modelo", body: "chatgpt.com → Upgrade. Go ($8) tier económico, Plus ($20) el estándar con GPT-5.4 Thinking y Deep Research (10/mes), Pro ($200) con razonamiento y Sora ilimitados + Agent Mode avanzado, Business ($25 anual / $30 mensual por usuario) con zero-retention, Enterprise para BTG. Selector superior: GPT-5.4 base, GPT-5.4 Thinking u o3 para razonamiento profundo." },
      { title: "Customize ChatGPT", body: "Perfil → Customize ChatGPT. Dos campos: 'What would you like ChatGPT to know' (quién eres) y 'How would you like to respond' (estilo). Aplica a todo el historial." },
      { title: "Memory ON", body: "Settings → Personalization → Memory: ON. ChatGPT recuerda entre chats: tus clientes clave, formatos preferidos, jerga de BTG. Puedes listar y borrar memorias individualmente." },
      { title: "Crear un Custom GPT", body: "Explore GPTs → Create. Define nombre, instrucciones, knowledge files (hasta 20 PDFs) y tools (browsing, DALL·E, code interpreter). Comparte con tu equipo Team con link privado." },
      { title: "Canvas para edición colaborativa", body: "En una conversación: pide 'abre en Canvas'. Editor lateral para documentos y código donde tú y el modelo editan en vivo, con versiones y comentarios línea por línea." },
      { title: "Modo Agentic (Operator)", body: "Settings → Beta → Operator: ON. ChatGPT navega páginas, llena formularios y ejecuta flujos en un navegador virtual. Supervisado: te pide confirmación en cada paso crítico." },
      { title: "Code Interpreter + archivos", body: "Sube CSVs, Excels o PDFs directamente al chat. El modelo corre Python real en sandbox: análisis estadísticos, gráficos, limpieza de datos, regresiones." },
    ],
    btgTip: "Un Custom GPT 'Analista BTG' con tus plantillas de memo y normativa interna convierte a todo el equipo en usuarios expertos sin entrenarlos en prompts.",
  },
  {
    id: "gemini",
    name: "Gemini",
    provider: "Google",
    url: "gemini.google.com",
    plan: "Google AI Pro $20 · Ultra $250 · Workspace Business $20–30/user",
    color: "#3A7BD5",
    icon: "◆",
    tagline: "2M tokens, integración nativa Workspace, Deep Research ilimitado",
    steps: [
      { title: "Activar Google AI Pro o Workspace with Gemini", body: "El nombre 'Gemini Advanced' se retiró: ahora es Google AI Pro ($20/mes) — incluye Gemini 3.1 Pro, Deep Research ilimitado, NotebookLM Plus y 2TB. Para razonamiento máximo: Google AI Ultra ($250/mes) con Gemini 3.1 Ultra + Deep Think. Si BTG usa Workspace: pide al admin activar Workspace with Gemini (Business $20 / Enterprise $30 por usuario) con data-privacy garantizada." },
      { title: "Elegir modelo", body: "Selector superior: Gemini 3.1 Ultra (razonamiento máximo), Flash (velocidad) o Deep Think (chain-of-thought extendido). Para research financiero: Ultra + Deep Think." },
      { title: "Crear un Gem personalizado", body: "Sidebar → Gems → New Gem. Equivalente a un GPT custom: nombre, instrucciones, knowledge. Se invoca con @gem_name desde cualquier chat de Gemini." },
      { title: "Conectar Workspace", body: "Extensions → activa Gmail, Drive, Docs, Calendar, Maps. Puedes pedir 'busca el contrato X en Drive y resumime las cláusulas de exclusividad' y lo hace sin salir del chat." },
      { title: "Deep Research", body: "En el selector de modo: Deep Research. Le das un tema, planifica 50+ búsquedas, lee fuentes, sintetiza un reporte con citas. Dura 5–15 min y corre asíncrono." },
      { title: "NotebookLM (incluido)", body: "notebooklm.google.com con tu misma cuenta. Sube hasta 50 fuentes por notebook. Pregunta SOLO sobre esas fuentes (cero alucinaciones). Genera 'Audio Overviews' tipo podcast." },
      { title: "Gemini en Sheets y Docs", body: "Sidebar 'Help me write/organize'. En Sheets: 'agrupa por sector y calcula media'. En Docs: genera borradores a partir de un brief. En Meet: resumen automático + action items." },
    ],
    btgTip: "Para Wealth Management: un Gem conectado a Drive con el research interno + Deep Research semanal sobre los tickers del mandato = briefing automatizado sin infra.",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    provider: "Perplexity AI",
    url: "perplexity.ai",
    plan: "Free · Pro $20/mes · Enterprise $40/user",
    color: "#9B59B6",
    icon: "◷",
    tagline: "Search-first: respuestas con fuentes citadas en tiempo real",
    steps: [
      { title: "Upgrade a Pro", body: "perplexity.ai → Pro. Desbloquea Pro Search (búsquedas multi-paso), selector de modelo (Claude, GPT-5, o3, Gemini) y 600 consultas Pro/día." },
      { title: "Crear un Space", body: "Sidebar → Spaces → New. Equivale a un Project: tema, instrucciones, archivos subidos y enfoque de búsqueda. Ideal para seguir un mandato o sector específico." },
      { title: "Focus modes", body: "Antes de cada pregunta: Web (default), Academic (papers), YouTube, Reddit, Writing (sin búsqueda). Para research regulatorio: Academic + Web." },
      { title: "Pro Search multi-paso", body: "Con Pro ON, Perplexity descompone la pregunta, hace varias búsquedas encadenadas y unifica el resultado. Ideal para 'comparar los últimos earnings de X, Y, Z'." },
      { title: "Seleccionar modelo de síntesis", body: "Settings → AI Model: elige Claude 4.6 Sonnet, GPT-5.4, o3 o Gemini 3.1 para que sea quien redacte la respuesta sobre las fuentes encontradas." },
      { title: "Enterprise: zero-retention y SSO", body: "Plan Enterprise añade SOC2, SSO, sin entrenamiento con tus datos, y una API unificada para integrar en workflows internos." },
    ],
    btgTip: "Para research de mercado: un Space 'Sector X' con focus Academic + Pro Search genera notas con todas las fuentes verificables en minutos.",
  },
  {
    id: "copilot",
    name: "Microsoft 365 Copilot",
    provider: "Microsoft",
    url: "m365.cloud.microsoft",
    plan: "$30/user/mes (requiere licencia M365 E3/E5)",
    color: "#7B73E8",
    icon: "🏢",
    tagline: "IA dentro de Word, Excel, PowerPoint, Teams, Outlook, SharePoint",
    steps: [
      { title: "Licenciamiento", body: "Admin Center → Copilot → asignar licencias. Requiere M365 E3/E5 o Business Premium previo. Copilot puede leer el tenant completo (SharePoint, OneDrive, Teams, Exchange)." },
      { title: "Configurar permisos de datos", body: "Admin: define sensitivity labels y DLP. Copilot respeta los permisos de cada usuario — no expone archivos a quien no tenía acceso antes." },
      { title: "Copilot Chat (BizChat)", body: "copilot.microsoft.com con cuenta corporativa. Busca across tenant: '¿qué decidimos sobre el deal X en los últimos correos y reuniones?'. Responde con citas a correos/archivos." },
      { title: "Copilot en Word / PowerPoint", body: "Ribbon → Copilot → 'Draft with' a partir de otro documento. PowerPoint: genera slides desde un Word. Refínalo con prompts naturales." },
      { title: "Copilot en Excel", body: "Excel → Copilot → análisis automático de tablas, fórmulas en lenguaje natural, detección de outliers, visualizaciones sugeridas. Requiere tablas formateadas." },
      { title: "Copilot Studio (agentes)", body: "copilotstudio.microsoft.com → crea agentes low-code que consultan SharePoint, Dataverse o APIs internas. Deploy en Teams como bot para helpdesk interno." },
    ],
    btgTip: "Copilot brilla cuando ya vives en Outlook + Teams + SharePoint. El ROI está en 'resume esta reunión y genera action items' × 500 personas × todos los días.",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    provider: "DeepSeek AI",
    url: "chat.deepseek.com",
    plan: "Chat gratis · API $0.55/$2.19 por M tokens (R1) · 1M tokens gratis/mes",
    color: "#D4AF4C",
    icon: "◎",
    tagline: "Razonamiento matemático top, open-weights, 96% más barato que o3",
    steps: [
      { title: "Crear cuenta en chat.deepseek.com", body: "Sign up con email o Google. El chat web es gratuito sin límites estrictos. Para API: platform.deepseek.com → API Keys. Las cuentas nuevas reciben 1 millón de tokens gratis al mes." },
      { title: "Elegir modelo", body: "En el chat, toggle 'DeepThink (R1)' para razonamiento profundo con chain-of-thought visible, o déjalo off para V3.2 en tareas generales. 'Search' activa búsqueda web integrada. Coder está disponible vía API para programación." },
      { title: "Chain-of-thought transparente", body: "Con R1 activo, el modelo muestra cada paso de su razonamiento en un bloque desplegable antes de la respuesta final. Puedes auditar cálculos línea a línea — crítico para risk y compliance donde necesitas trazabilidad total." },
      { title: "API OpenAI-compatible", body: "Endpoint: https://api.deepseek.com. Usa el SDK de OpenAI con base_url cambiado — código existente funciona sin refactor. Modelos: deepseek-chat (V3.2) y deepseek-reasoner (R1). Cache hits bajan el input a $0.14/M tokens." },
      { title: "Correr local u on-prem", body: "R1 y V3 son open-weights en Hugging Face. Las versiones distilled (1.5B–70B) corren en laptops con Ollama: ollama pull deepseek-r1:70b. El modelo completo (671B MoE) requiere clúster multi-GPU." },
      { title: "Consideraciones de jurisdicción", body: "DeepSeek es empresa china. Para datos sensibles BTG no uses el chat web ni la API oficial — descarga los pesos y córrelo on-premise o en tu cloud (AWS, Azure, GCP). Así obtienes el costo y el razonamiento sin exponer datos a jurisdicción china." },
    ],
    btgTip: "Para trading cuantitativo y risk: R1 on-prem te da razonamiento matemático competitivo con o3 a costo cero de API y con trazabilidad total de cada cálculo.",
  },
  {
    id: "kimi",
    name: "Kimi K2.5",
    provider: "Moonshot AI",
    url: "kimi.com",
    plan: "Chat gratis · API vía platform.moonshot.ai · también en AWS Bedrock y NVIDIA NIM",
    color: "#9B59B6",
    icon: "◐",
    tagline: "1T parámetros MoE, 256K contexto, Agent Swarm con 100 agentes en paralelo",
    steps: [
      { title: "Acceder al chat", body: "kimi.com (global) ofrece chat gratuito con Kimi K2.5. Launched el 27 de enero de 2026. Soporta entrada multimodal nativa (imágenes, PDFs, texto). Para inglés/español funciona perfectamente; la versión .cn es solo chino." },
      { title: "Activar modo Thinking", body: "Toggle 'Thinking' en la interfaz de chat. K2.5 tiene dos modos: non-thinking (respuesta rápida estilo Sistema 1) y thinking (razonamiento deliberativo estilo Sistema 2). El modo thinking activa hasta 32K tokens de deliberación interna." },
      { title: "Aprovechar los 256K tokens", body: "Sube documentos largos directamente al chat — K2.5 maneja 256K tokens de contexto (≈500 páginas). Ideal para leer data rooms completos, contratos extensos o múltiples reportes simultáneamente sin fragmentar." },
      { title: "Agent Swarm para tareas complejas", body: "En tareas multi-paso, K2.5 puede coordinar hasta 100 agentes especializados en paralelo (su feature diferencial). Acelera 4.5× ejecuciones largas: research multi-fuente, análisis comparativo de sectores, due diligence distribuida." },
      { title: "API Moonshot", body: "platform.moonshot.ai → crea API key. Endpoint compatible con OpenAI SDK. Modelos: kimi-k2.5, kimi-k2-thinking (razonamiento), kimi-k2-turbo (velocidad). Documentación en inglés, SLA comercial disponible." },
      { title: "Deploy enterprise", body: "K2.5 está disponible en AWS Bedrock y NVIDIA NIM — útil si BTG ya tiene contratos con alguno. Los pesos completos están en Hugging Face (moonshotai/Kimi-K2.5) para self-hosted con vLLM o SGLang." },
    ],
    btgTip: "Cuando necesites paralelizar — research de 20 empresas comparables, análisis de 50 earnings calls — Agent Swarm ejecuta lo que a un LLM tradicional le tomaría una hora en minutos.",
  },
  {
    id: "local",
    name: "Llama 4 on-prem",
    provider: "Meta · Ollama",
    url: "ollama.com",
    plan: "Gratis · requiere hardware GPU",
    color: "#D4AF4C",
    icon: "◇",
    tagline: "Datos ultra-sensibles sin salir del perímetro BTG",
    steps: [
      { title: "Elegir el tamaño del modelo", body: "Llama 4 viene en 8B, 70B y 405B parámetros. 70B corre en 1× H100 (80GB). 405B requiere clúster. Para la mayoría de casos BTG: 70B Instruct." },
      { title: "Instalar Ollama (dev/POC)", body: "curl -fsSL https://ollama.com/install.sh | sh. Luego: ollama pull llama4:70b. Sirve el modelo en localhost:11434 con API compatible con OpenAI." },
      { title: "Deploy enterprise con vLLM", body: "Para producción: vLLM + Kubernetes. Soporta batching continuo, cuantización INT8/FP8 y throughput 10× Ollama. Expón detrás de un gateway con auth." },
      { title: "Frontend: Open WebUI o LibreChat", body: "Open WebUI replica la UX de ChatGPT apuntando a tu modelo local. Soporta RAG con tus PDFs, memoria, user management y logs de auditoría." },
      { title: "RAG sobre datos internos", body: "Combina vLLM + Qdrant/pgvector + LlamaIndex. Indexa docs internos (normativa, memos, investigaciones) y el modelo responde citando fuentes sin que los datos salgan de la red BTG." },
      { title: "Fine-tuning con LoRA", body: "Si necesitas estilo BTG o jerga específica: LoRA sobre ~1000 ejemplos curados. 4 horas en 1× H100. Produce adaptadores de ~200MB que cargas encima del modelo base." },
    ],
    btgTip: "Compliance + datos de clientes nunca deben tocar APIs externas. Un 70B local + RAG resuelve el 80% de casos de uso sin comprometer soberanía.",
  },
];

/* ════════════════════════════ COMPONENT ════════════════════════════ */

export default function Sesion4() {
  const [activeCategory, setActiveCategory] = useState<string>("general");
  const [activeLLM, setActiveLLM] = useState<number>(0);
  const [activeRole, setActiveRole] = useState<string>("analyst");
  const [diagStep, setDiagStep] = useState(0);
  const [diagAnswers, setDiagAnswers] = useState<string[]>([]);
  const [diagComplete, setDiagComplete] = useState(false);
  const [activeEcosystem, setActiveEcosystem] = useState<string>("microsoft");
  const [activeTimeline, setActiveTimeline] = useState<number>(4);
  const [activeMemory, setActiveMemory] = useState<string>("working");
  const [activeEra, setActiveEra] = useState<number>(1);
  const [activeDual, setActiveDual] = useState<number>(1);
  const [activeReasoningModel, setActiveReasoningModel] = useState<number>(0);
  const [activeSetup, setActiveSetup] = useState<string>("claude");
  const [activeSetupStep, setActiveSetupStep] = useState<number>(0);

  /* Cost calculator */
  const [calcTokens, setCalcTokens] = useState(100000);
  const [calcCalls, setCalcCalls] = useState(50);

  /* Hero counter */
  const [heroCount, setHeroCount] = useState(0);
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => { i++; setHeroCount(i); if (i >= 6) clearInterval(iv); }, 200);
    return () => clearInterval(iv);
  }, []);

  const handleDiagAnswer = useCallback((id: string) => {
    const newA = [...diagAnswers, id];
    setDiagAnswers(newA);
    if (diagStep < DIAG_QUESTIONS.length - 1) setDiagStep(diagStep + 1);
    else setDiagComplete(true);
  }, [diagStep, diagAnswers]);

  const resetDiag = useCallback(() => { setDiagStep(0); setDiagAnswers([]); setDiagComplete(false); }, []);

  const diagResult = diagComplete ? DIAG_RESULTS[diagAnswers[0]] || DIAG_RESULTS.analyst : null;
  const activeRoleData = ROLE_PROFILES.find(r => r.id === activeRole)!;

  /* Cost estimate for each model */
  const inputTokens = calcTokens;
  const outputTokens = Math.round(calcTokens * 0.3);
  const dailyCost = (model: typeof LLM_COMPARISON[0]) => {
    const cost = ((inputTokens * model.costIn + outputTokens * model.costOut) / 1_000_000) * calcCalls;
    return cost;
  };

  return (
    <div className="min-h-screen bg-[#080C1F]">
      {/* ═══════════════ 1. HERO ═══════════════ */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden">
        <div className="hero-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_40%,rgba(0,229,160,0.07),transparent),radial-gradient(ellipse_40%_50%_at_70%_60%,rgba(91,82,213,0.06),transparent)] pointer-events-none" />

        {/* Floating tool icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {["◉","⌨","⚡","📊","🤖","🏢","◈"].map((icon, i) => (
            <div key={i} className="absolute animate-float text-2xl opacity-10" style={{
              left: `${10 + i * 13}%`, top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.7}s`, animationDuration: `${3 + i * 0.5}s`,
            }}>{icon}</div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-4 animate-fadeUp">
            Módulo 02 &middot; Herramientas &middot; Sesión 4 de 5
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white-f leading-tight mb-6 animate-fadeUp-1">
            Ecosistema de herramientas IA:{" "}
            <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
              mapa 2026
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 animate-fadeUp-2">
            30+ herramientas, agentes autónomos, app builders, MCP.
            El mapa completo para elegir tu stack según tu rol en BTG.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fadeUp-3">
            {[
              { val: heroCount >= 1 ? "30+" : "—", label: "Herramientas", icon: "◈", color: "#5B52D5" },
              { val: heroCount >= 2 ? "7" : "—", label: "Categorías", icon: "◆", color: "#3A7BD5" },
              { val: heroCount >= 3 ? "6" : "—", label: "LLMs", icon: "◉", color: "#E85A1F" },
              { val: heroCount >= 4 ? "5" : "—", label: "Agentes", icon: "🤖", color: "#9B59B6" },
              { val: heroCount >= 5 ? "4" : "—", label: "App Builders", icon: "⚡", color: "#22C55E" },
              { val: heroCount >= 6 ? "5" : "—", label: "Perfiles", icon: "◷", color: "#D4AF4C" },
            ].map((s) => (
              <div key={s.label} className="bg-[#151A3A] border border-white/[0.06] rounded-2xl px-5 py-3 min-w-[100px] transition-all hover:scale-105" style={{ borderColor: `${s.color}20` }}>
                <span className="text-lg" style={{ color: s.color }}>{s.icon}</span>
                <p className="text-xl font-bold text-white-f mt-1">{s.val}</p>
                <p className="text-[0.6rem] text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 2. AGENDA ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-12">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-6">Agenda &middot; Sesión 4</p>
          <div className="flex flex-col sm:flex-row gap-2">
            {AGENDA.map((a, i) => (
              <div key={i} className="flex-1 rounded-xl p-4 border border-white/[0.06] transition-all hover:scale-[1.02]" style={{
                background: `linear-gradient(135deg, ${a.color}12, ${a.color}06)`, borderColor: `${a.color}30`,
              }}>
                <p className="font-mono text-xs font-semibold mb-1" style={{ color: a.color }}>{a.time}</p>
                <p className="text-sm text-white-f font-medium">{a.label}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 2.5 NEURO · Fin del prompt engineering ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-3">Neurociencia &middot; Memoria &middot; Lenguaje</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            El <span className="bg-gradient-to-r from-orange to-purple bg-clip-text text-transparent">fin del prompt engineering</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-12">
            Los modelos de 2026 razonan, recuerdan al usuario y aprenden con él. El &quot;truco&quot; del prompt perfecto era una prótesis de la era pre-razonamiento. Para entender por qué, hay que mirar el cerebro.
          </p>

          {/* 3 memory systems */}
          <div className="mb-16">
            <p className="font-mono text-xs text-cyan uppercase tracking-wider mb-4">◉ Los tres sistemas de memoria — cerebro ↔ LLM</p>
            <div className="grid md:grid-cols-3 gap-3 mb-6">
              {MEMORY_SYSTEMS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMemory(m.id)}
                  className={`text-left rounded-2xl p-5 border transition-all ${
                    activeMemory === m.id ? "scale-[1.02]" : "opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    background: activeMemory === m.id ? `${m.color}15` : "#151A3A",
                    borderColor: activeMemory === m.id ? `${m.color}60` : "rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl" style={{ color: m.color }}>{m.icon}</span>
                    <p className="font-mono text-[0.6rem] text-muted uppercase tracking-wider">{m.region}</p>
                  </div>
                  <p className="text-lg font-bold text-white-f leading-tight">{m.brain}</p>
                  <p className="font-mono text-[0.7rem] mt-2" style={{ color: m.color }}>↓ {m.llm}</p>
                </button>
              ))}
            </div>

            {MEMORY_SYSTEMS.filter((m) => m.id === activeMemory).map((m) => (
              <div key={m.id} className="bg-[#0D1229] border rounded-2xl p-6 md:p-8" style={{ borderColor: `${m.color}30` }}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="font-mono text-[0.65rem] uppercase tracking-wider mb-2" style={{ color: m.color }}>Cerebro humano</p>
                    <p className="text-white-f font-semibold mb-1">{m.brain} &middot; <span className="text-muted font-normal">{m.region}</span></p>
                    <p className="text-sm text-muted">{m.brainDesc}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[0.65rem] uppercase tracking-wider mb-2" style={{ color: m.color }}>Modelo de lenguaje</p>
                    <p className="text-white-f font-semibold mb-1">{m.llm}</p>
                    <p className="text-sm text-muted">{m.llmDesc}</p>
                  </div>
                </div>
                <div className="border-t border-white/[0.06] pt-4">
                  <p className="text-xs font-mono uppercase tracking-wider text-muted mb-1">Analogía</p>
                  <p className="text-white-f">{m.analogy}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Brain ↔ LLM map */}
          <div className="mb-16">
            <p className="font-mono text-xs text-cyan uppercase tracking-wider mb-4">◆ El lenguaje como sistema operativo del cerebro</p>
            <p className="text-sm text-muted mb-6 max-w-3xl">
              En los 1860s, Paul Broca demostró que lesionar una zona del córtex frontal izquierdo borraba la capacidad de producir lenguaje. Wernicke halló luego el área de la comprensión. Los transformers replican computacionalmente ese reparto: <span className="text-white-f">encoder para entender, decoder para generar, attention como puente</span>.
            </p>
            <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
              <div className="grid grid-cols-3 gap-px bg-white/[0.04]">
                <div className="bg-[#0D1229] px-4 py-3 font-mono text-[0.65rem] text-muted uppercase tracking-wider">Región cerebral</div>
                <div className="bg-[#0D1229] px-4 py-3 font-mono text-[0.65rem] text-muted uppercase tracking-wider">Función</div>
                <div className="bg-[#0D1229] px-4 py-3 font-mono text-[0.65rem] text-muted uppercase tracking-wider">Equivalente en el LLM</div>
                {BRAIN_LLM_MAP.map((row, i) => (
                  <div key={`row-${i}`} className="contents">
                    <div className="bg-[#151A3A] px-4 py-4">
                      <span className="text-sm font-semibold" style={{ color: row.color }}>{row.brain}</span>
                    </div>
                    <div className="bg-[#151A3A] px-4 py-4 text-sm text-muted">{row.role}</div>
                    <div className="bg-[#151A3A] px-4 py-4 text-sm text-white-f">{row.llm}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dual process — Kahneman */}
          <div className="mb-16">
            <p className="font-mono text-xs text-cyan uppercase tracking-wider mb-4">◈ Sistema 1 / Sistema 2 — Kahneman llevado a los LLMs</p>
            <p className="text-sm text-muted mb-6 max-w-3xl">
              Daniel Kahneman ganó el Nobel por mostrar que el cerebro opera con dos sistemas: uno rápido e intuitivo (S1) y otro lento y deliberativo (S2). Durante 15 años fue una idea de psicología. En 2024–2025, OpenAI, Anthropic y Google la implementaron literalmente en los modelos.
            </p>
            <div className="flex gap-2 mb-6">
              {DUAL_PROCESS.map((d, i) => (
                <button
                  key={d.system}
                  onClick={() => setActiveDual(i)}
                  className="flex-1 rounded-xl px-4 py-4 border transition-all text-left"
                  style={{
                    background: activeDual === i ? `${d.color}15` : "#151A3A",
                    borderColor: activeDual === i ? `${d.color}60` : "rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl" style={{ color: d.color }}>{d.icon}</span>
                    <p className="text-base font-bold text-white-f">{d.system}</p>
                  </div>
                  <p className="font-mono text-[0.6rem] text-muted uppercase tracking-wider">{d.speed}</p>
                </button>
              ))}
            </div>
            {DUAL_PROCESS.filter((_, i) => i === activeDual).map((d) => (
              <div key={d.system} className="bg-[#0D1229] border rounded-2xl p-6 md:p-8" style={{ borderColor: `${d.color}30` }}>
                <div className="grid md:grid-cols-2 gap-6 mb-5">
                  <div>
                    <p className="font-mono text-[0.65rem] uppercase tracking-wider mb-2" style={{ color: d.color }}>En el cerebro</p>
                    <p className="text-white-f font-semibold mb-1">{d.brain}</p>
                    <p className="text-sm text-muted">{d.brainDesc}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[0.65rem] uppercase tracking-wider mb-2" style={{ color: d.color }}>En el LLM (2026)</p>
                    <p className="text-white-f font-semibold mb-1">{d.llmNew}</p>
                    <p className="text-sm text-muted italic opacity-70">Antes (2022): {d.llmOld}</p>
                  </div>
                </div>
                <div className="border-t border-white/[0.06] pt-4">
                  <p className="text-xs font-mono uppercase tracking-wider text-muted mb-1">Kahneman</p>
                  <p className="text-white-f">{d.kahneman}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reasoning mechanics */}
          <div className="mb-16">
            <p className="font-mono text-xs text-cyan uppercase tracking-wider mb-4">★ Cómo razonan realmente los modelos por dentro</p>
            <p className="text-sm text-muted mb-6 max-w-3xl">
              No es magia ni consciencia. Son cuatro mecanismos medibles que explican por qué un modelo razonante puede resolver problemas donde GPT-3.5 simplemente alucinaba.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {REASONING_MECHANICS.map((r) => (
                <div key={r.title} className="bg-[#151A3A] border rounded-2xl p-6 transition-all hover:scale-[1.01]" style={{ borderColor: `${r.color}25` }}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-lg font-bold text-white-f leading-tight">{r.title}</p>
                      <p className="font-mono text-[0.65rem] mt-1 uppercase tracking-wider" style={{ color: r.color }}>{r.subtitle}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold" style={{ color: r.color }}>{r.number}</p>
                      <p className="text-[0.55rem] text-muted leading-tight max-w-[100px]">{r.numberLabel}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{r.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reasoning models landscape */}
          <div className="mb-16">
            <p className="font-mono text-xs text-cyan uppercase tracking-wider mb-4">◉ Los modelos razonantes de 2026 — quién hace qué</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
              {REASONING_MODELS.map((m, i) => (
                <button
                  key={m.name}
                  onClick={() => setActiveReasoningModel(i)}
                  className="rounded-xl px-3 py-3 border transition-all text-left"
                  style={{
                    background: activeReasoningModel === i ? `${m.color}15` : "#151A3A",
                    borderColor: activeReasoningModel === i ? `${m.color}60` : "rgba(255,255,255,0.06)",
                  }}
                >
                  <p className="text-sm font-bold text-white-f leading-tight">{m.name}</p>
                  <p className="font-mono text-[0.55rem] mt-1 uppercase tracking-wider" style={{ color: m.color }}>{m.mode}</p>
                </button>
              ))}
            </div>
            {REASONING_MODELS.filter((_, i) => i === activeReasoningModel).map((m) => (
              <div key={m.name} className="bg-[#0D1229] border rounded-2xl p-6 md:p-8" style={{ borderColor: `${m.color}30` }}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-mono text-[0.65rem] uppercase tracking-wider mb-2" style={{ color: m.color }}>Cómo se activa</p>
                    <p className="text-sm text-white-f leading-relaxed">{m.how}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[0.65rem] uppercase tracking-wider mb-2" style={{ color: m.color }}>Dónde brilla</p>
                    <p className="text-sm text-white-f leading-relaxed">{m.strength}</p>
                  </div>
                </div>
                <div className="border-t border-white/[0.06] pt-4 mt-5">
                  <p className="text-xs font-mono uppercase tracking-wider text-muted mb-1">Caso BTG</p>
                  <p className="text-white-f">{m.btg}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Before / After eras */}
          <div className="mb-16">
            <p className="font-mono text-xs text-cyan uppercase tracking-wider mb-4">★ De prompt engineering a relación continua</p>
            <div className="flex gap-2 mb-6">
              {BEFORE_AFTER.map((era, i) => (
                <button
                  key={i}
                  onClick={() => setActiveEra(i)}
                  className="flex-1 rounded-xl px-4 py-3 border transition-all text-left"
                  style={{
                    background: activeEra === i ? `${era.color}15` : "#151A3A",
                    borderColor: activeEra === i ? `${era.color}60` : "rgba(255,255,255,0.06)",
                  }}
                >
                  <p className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: era.color }}>{era.model}</p>
                  <p className={`text-sm font-semibold mt-1 ${activeEra === i ? "text-white-f" : "text-muted"}`}>{era.era}</p>
                </button>
              ))}
            </div>
            {BEFORE_AFTER.filter((_, i) => i === activeEra).map((era) => (
              <div key={era.era} className="bg-[#0D1229] border rounded-2xl p-6 md:p-8" style={{ borderColor: `${era.color}30` }}>
                <p className="text-white-f mb-5">{era.problem}</p>
                <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted mb-3">Práctica cotidiana</p>
                <div className="grid md:grid-cols-2 gap-2 mb-6">
                  {era.practice.map((p, i) => (
                    <div key={i} className="flex gap-3 items-start bg-[#151A3A] rounded-lg px-4 py-3 border border-white/[0.04]">
                      <span className="font-mono text-xs mt-0.5" style={{ color: era.color }}>▸</span>
                      <p className="text-sm text-white-f">{p}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/[0.06] pt-4">
                  <p className="text-xs font-mono uppercase tracking-wider text-muted mb-1">Por qué funcionaba (o no)</p>
                  <p className="text-white-f italic">{era.why}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Closing insight */}
          <div className="bg-gradient-to-br from-orange/10 to-purple/10 border border-orange/30 rounded-2xl p-6 md:p-8">
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-orange mb-3">La nueva pregunta</p>
            <p className="text-xl md:text-2xl text-white-f leading-snug mb-4">
              Ya no es <span className="line-through text-muted">&quot;¿cuál es el prompt perfecto?&quot;</span>. Ahora es: <span className="text-orange">¿qué memoria, qué contexto y qué relación estoy construyendo con este modelo a lo largo del tiempo?</span>
            </p>
            <p className="text-sm text-muted">
              En BTG: un Project de Claude con la normativa SFC, el histórico de decisiones de inversión y las preferencias del equipo vale más que mil prompts &quot;mágicos&quot;. El modelo ya sabe razonar — tu trabajo es darle una biografía útil.
            </p>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 2.6 SETUP · Tutoriales abril 2026 ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-3">Tutoriales &middot; Abril 2026</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            Configura tu <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">stack de IA</span> en 30 minutos
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10">
            Paso a paso real, con las UIs y opciones tal como están en abril de 2026. Elige una herramienta, revisa los 6–7 pasos críticos y aplícalos en vivo.
          </p>

          {/* Tool selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
            {SETUP_GUIDES.map((g) => (
              <button
                key={g.id}
                onClick={() => { setActiveSetup(g.id); setActiveSetupStep(0); }}
                className="rounded-xl px-3 py-4 border transition-all text-center"
                style={{
                  background: activeSetup === g.id ? `${g.color}15` : "#151A3A",
                  borderColor: activeSetup === g.id ? `${g.color}60` : "rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-2xl" style={{ color: g.color }}>{g.icon}</p>
                <p className="text-sm font-bold text-white-f mt-1 leading-tight">{g.name}</p>
                <p className="font-mono text-[0.55rem] text-muted mt-0.5">{g.provider}</p>
              </button>
            ))}
          </div>

          {SETUP_GUIDES.filter((g) => g.id === activeSetup).map((g) => (
            <div key={g.id} className="bg-[#0D1229] border rounded-2xl overflow-hidden" style={{ borderColor: `${g.color}30` }}>
              {/* Header */}
              <div className="px-6 md:px-8 py-6 border-b border-white/[0.06]" style={{ background: `linear-gradient(135deg, ${g.color}15, transparent)` }}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl" style={{ color: g.color }}>{g.icon}</span>
                      <h3 className="text-2xl font-bold text-white-f">{g.name}</h3>
                      <span className="font-mono text-xs text-muted">{g.provider}</span>
                    </div>
                    <p className="text-sm text-white-f italic">{g.tagline}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs text-muted">URL</p>
                    <p className="font-mono text-sm font-semibold" style={{ color: g.color }}>{g.url}</p>
                    <p className="font-mono text-[0.65rem] text-muted mt-1">{g.plan}</p>
                  </div>
                </div>
              </div>

              {/* Steps layout: left list + right detail */}
              <div className="grid md:grid-cols-[280px_1fr]">
                <div className="border-r border-white/[0.06] p-4 max-h-[480px] overflow-y-auto">
                  {g.steps.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSetupStep(i)}
                      className="w-full text-left rounded-lg px-3 py-3 mb-1 transition-all flex items-start gap-3"
                      style={{
                        background: activeSetupStep === i ? `${g.color}15` : "transparent",
                        borderLeft: activeSetupStep === i ? `2px solid ${g.color}` : "2px solid transparent",
                      }}
                    >
                      <span className="font-mono text-xs font-bold shrink-0 w-5" style={{ color: g.color }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={`text-xs leading-snug ${activeSetupStep === i ? "text-white-f font-semibold" : "text-muted"}`}>
                        {s.title}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="p-6 md:p-8">
                  {g.steps.map((s, i) =>
                    i === activeSetupStep ? (
                      <div key={i}>
                        <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted mb-2">
                          Paso {String(i + 1).padStart(2, "0")} de {String(g.steps.length).padStart(2, "0")}
                        </p>
                        <h4 className="text-2xl font-bold text-white-f mb-4 leading-tight">{s.title}</h4>
                        <p className="text-base text-muted leading-relaxed mb-6">{s.body}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setActiveSetupStep(Math.max(0, activeSetupStep - 1))}
                            disabled={activeSetupStep === 0}
                            className="font-mono text-xs px-4 py-2 rounded-lg border border-white/[0.08] text-muted disabled:opacity-30 hover:text-white-f hover:border-white/20"
                          >
                            ← Anterior
                          </button>
                          <button
                            onClick={() => setActiveSetupStep(Math.min(g.steps.length - 1, activeSetupStep + 1))}
                            disabled={activeSetupStep === g.steps.length - 1}
                            className="font-mono text-xs px-4 py-2 rounded-lg border disabled:opacity-30"
                            style={{ borderColor: `${g.color}60`, color: g.color }}
                          >
                            Siguiente →
                          </button>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>

              {/* BTG tip */}
              <div className="px-6 md:px-8 py-5 border-t border-white/[0.06]" style={{ background: `${g.color}08` }}>
                <p className="font-mono text-[0.6rem] uppercase tracking-wider mb-1" style={{ color: g.color }}>Tip para BTG</p>
                <p className="text-sm text-white-f">{g.btgTip}</p>
              </div>
            </div>
          ))}

          {/* Global checklist */}
          <div className="mt-10 bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6 md:p-8">
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-cyan mb-3">Checklist mínimo común a todas</p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Usar cuenta corporativa con SSO (nunca personal para datos BTG)",
                "Activar plan con zero-retention / sin training on your data",
                "Custom instructions con tu rol, área y restricciones",
                "Activar memoria persistente y revisarla mensualmente",
                "Crear al menos un Project/GPT/Gem/Space por línea de trabajo",
                "Habilitar razonamiento extendido para due diligence y decisiones",
                "Revisar qué conectores/MCP activó el admin",
                "Nunca pegar datos de clientes sin verificar la política del plan",
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start bg-[#0D1229] rounded-lg px-4 py-3 border border-white/[0.04]">
                  <span className="font-mono text-xs text-cyan shrink-0 mt-0.5">☐</span>
                  <p className="text-sm text-white-f">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 3. CASE STUDY ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-6">Caso de Estudio &middot; JPMorgan Chase</p>
          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-cyan/10 to-purple/10 px-8 py-6 border-b border-white/[0.06]">
              <h2 className="text-2xl font-bold text-white-f">El stack de IA más grande de Wall Street</h2>
              <p className="text-muted mt-1">$17B en tecnología, 2,000+ ingenieros IA, 300+ casos de uso en producción</p>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { val: "$17B", label: "Inversión Tech", sub: "Presupuesto anual", color: "#00E5A0" },
                  { val: "2K+", label: "Ingenieros IA", sub: "Equipo dedicado", color: "#5B52D5" },
                  { val: "300+", label: "Casos de uso", sub: "IA en producción", color: "#E85A1F" },
                  { val: "LLM Suite", label: "Herramienta", sub: "Asistente propio", color: "#D4AF4C" },
                ].map((m) => (
                  <div key={m.label} className="text-center p-4 bg-[#0D1229] rounded-xl border border-white/[0.04]">
                    <p className="text-xl font-bold" style={{ color: m.color }}>{m.val}</p>
                    <p className="text-white-f font-semibold mt-1 text-xs">{m.label}</p>
                    <p className="text-[0.6rem] text-muted mt-0.5">{m.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-3 mb-6">
                {[
                  { area: "Trading", tools: "ML internos + LLMs", use: "Sentimiento, volatilidad, ejecución algorítmica", color: "#E85A1F" },
                  { area: "Compliance", tools: "LLM Suite + MCP", use: "Contratos, AML, reportes regulatorios auto", color: "#D4AF4C" },
                  { area: "Wealth Mgmt", tools: "Asistente IA + CRM", use: "Resúmenes para clientes, propuestas, alertas", color: "#5B52D5" },
                ].map((item) => (
                  <div key={item.area} className="rounded-xl p-4 border" style={{
                    background: `${item.color}08`, borderColor: `${item.color}25`,
                  }}>
                    <p className="font-semibold text-sm" style={{ color: item.color }}>{item.area}</p>
                    <p className="font-mono text-[0.6rem] text-muted mb-1">{item.tools}</p>
                    <p className="text-xs text-white-f">{item.use}</p>
                  </div>
                ))}
              </div>

              <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4">
                <p className="text-sm text-white-f">
                  <strong className="text-cyan">Para BTG:</strong> No necesitas $17B. Con Claude + n8n + Power Platform puedes replicar los casos de uso más impactantes a una fracción del costo. La clave: <strong>selección estratégica</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 4. TIMELINE ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">Evolución &middot; 2022 → 2026</p>
          <h2 className="text-2xl font-bold text-white-f mb-8">La evolución de las herramientas IA</h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#22C55E]/40 via-[#5B52D5]/40 to-[#00E5A0]/40" />

            <div className="space-y-6">
              {TIMELINE.map((t, i) => (
                <button key={i} onClick={() => setActiveTimeline(i)}
                  className={`relative w-full text-left transition-all cursor-pointer ${
                    i % 2 === 0 ? "md:pr-[52%]" : "md:pl-[52%]"
                  }`}>
                  {/* Node */}
                  <div className={`absolute left-6 md:left-1/2 top-4 -translate-x-1/2 w-5 h-5 rounded-full border-2 z-10 transition-all ${
                    activeTimeline === i ? "scale-150" : ""
                  }`} style={{
                    background: activeTimeline === i ? t.color : "#0D1229",
                    borderColor: t.color,
                    boxShadow: activeTimeline === i ? `0 0 15px ${t.color}50` : "none",
                  }} />

                  {/* Card */}
                  <div className={`ml-14 md:ml-0 rounded-xl p-5 border transition-all ${
                    activeTimeline === i ? "scale-[1.02]" : "bg-[#151A3A] border-white/[0.06]"
                  }`} style={activeTimeline === i ? {
                    background: `${t.color}12`, borderColor: `${t.color}40`,
                  } : undefined}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl" style={{ color: t.color }}>{t.icon}</span>
                      <span className="font-mono text-sm font-bold" style={{ color: t.color }}>{t.year}</span>
                      {t.year === "2026" && (
                        <span className="px-2 py-0.5 rounded text-[0.55rem] font-mono bg-cyan/20 text-cyan animate-pulse-dot">HOY</span>
                      )}
                    </div>
                    <p className="text-white-f font-semibold text-sm">{t.event}</p>
                    {activeTimeline === i && (
                      <p className="text-xs text-muted mt-2 animate-fadeUp">{t.detail}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 5. TOOL TAXONOMY ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">Taxonomía &middot; Herramientas IA 2026</p>
          <h2 className="text-2xl font-bold text-white-f mb-2">7 categorías, 30+ herramientas</h2>
          <p className="text-muted mb-8 max-w-3xl">Incluye la frontera: agentes autónomos, app builders, y herramientas de research especializadas.</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {TOOL_CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                  activeCategory === cat.id ? "scale-[1.02]" : "border-white/[0.06] bg-[#151A3A] hover:border-white/[0.12]"
                }`}
                style={activeCategory === cat.id ? { background: `${cat.color}15`, borderColor: `${cat.color}50`, color: cat.color } : undefined}>
                <span className="mr-1">{cat.icon}</span>{cat.label}
              </button>
            ))}
          </div>

          {(() => {
            const cat = TOOL_CATEGORIES.find(c => c.id === activeCategory)!;
            return (
              <div className="animate-fadeUp">
                <p className="text-muted text-sm mb-6">{cat.desc}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {cat.tools.map((tool) => (
                    <div key={tool.name} className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-all hover:scale-[1.01]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm" style={{
                          background: `${tool.color}20`, color: tool.color,
                        }}>{tool.name.charAt(0)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-white-f font-semibold text-sm">{tool.name}</p>
                            {tool.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[0.5rem] font-mono" style={{
                                background: tool.badge === "TOP BTG" ? "#00E5A020" : tool.badge === "AGENTE" ? "#9B59B620" : tool.badge === "FRONTIER" ? "#E74C3C20" : tool.badge === "HOT" ? "#E85A1F20" : "#3A7BD520",
                                color: tool.badge === "TOP BTG" ? "#00E5A0" : tool.badge === "AGENTE" ? "#9B59B6" : tool.badge === "FRONTIER" ? "#E74C3C" : tool.badge === "HOT" ? "#E85A1F" : "#3A7BD5",
                              }}>{tool.badge}</span>
                            )}
                          </div>
                          <p className="text-[0.6rem] text-muted">{tool.provider}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">{tool.highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </section>
      </RevealSection>

      {/* ═══════════════ 6. LLM COMPARISON + COST CALC ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">Comparativa &middot; 6 Modelos de Lenguaje</p>
          <h2 className="text-2xl font-bold text-white-f mb-8">LLMs cara a cara + calculadora de costos</h2>

          <div className="flex flex-wrap gap-2 mb-8">
            {LLM_COMPARISON.map((llm, i) => (
              <button key={llm.name} onClick={() => setActiveLLM(i)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border flex items-center gap-1.5 ${
                  activeLLM === i ? "scale-[1.02]" : "border-white/[0.06] bg-[#151A3A]"
                }`}
                style={activeLLM === i ? { background: `${llm.color}15`, borderColor: `${llm.color}50`, color: llm.color } : undefined}>
                {llm.icon} {llm.name.split(" ").slice(0, 2).join(" ")}
                <span className="text-[0.5rem] px-1 py-0.5 rounded ml-1" style={{
                  background: `${llm.color}15`, color: llm.color,
                }}>{llm.tier}</span>
              </button>
            ))}
          </div>

          {(() => {
            const llm = LLM_COMPARISON[activeLLM];
            return (
              <div className="grid lg:grid-cols-2 gap-6 animate-fadeUp">
                <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{llm.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white-f">{llm.name}</h3>
                      <p className="text-xs text-muted">{llm.provider} &middot; <span style={{ color: llm.color }}>{llm.tier}</span></p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-5">
                    <div className="bg-[#0D1229] rounded-xl p-3 text-center border border-white/[0.04]">
                      <p className="text-lg font-bold text-white-f">{llm.context >= 1000000 ? `${(llm.context/1000000).toFixed(0)}M` : `${(llm.context/1000).toFixed(0)}K`}</p>
                      <p className="text-[0.55rem] text-muted">Contexto</p>
                    </div>
                    <div className="bg-[#0D1229] rounded-xl p-3 text-center border border-white/[0.04]">
                      <p className="text-lg font-bold text-white-f">${llm.costIn}</p>
                      <p className="text-[0.55rem] text-muted">$/M input</p>
                    </div>
                    <div className="bg-[#0D1229] rounded-xl p-3 text-center border border-white/[0.04]">
                      <p className="text-lg font-bold text-white-f">${llm.costOut}</p>
                      <p className="text-[0.55rem] text-muted">$/M output</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="font-mono text-xs text-cyan mb-2">FORTALEZAS</p>
                    <div className="space-y-1">
                      {llm.strengths.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <span className="text-cyan">✓</span><span className="text-white-f">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-red mb-2">LIMITACIONES</p>
                    <div className="space-y-1">
                      {llm.weaknesses.map((w, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <span className="text-red">✕</span><span className="text-muted">{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 bg-[#0D1229] rounded-xl p-3 border border-white/[0.04]">
                    <p className="text-xs"><strong style={{ color: llm.color }}>Mejor para:</strong> <span className="text-muted">{llm.bestFor}</span></p>
                    <p className="text-xs mt-1"><strong className="text-purple-light">Áreas BTG:</strong> <span className="text-muted">{llm.btgArea}</span></p>
                  </div>
                </div>

                {/* Cost calculator + context bars */}
                <div className="space-y-6">
                  {/* Cost calculator */}
                  <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                    <p className="font-mono text-xs text-orange mb-4">CALCULADORA DE COSTOS — USO DIARIO</p>
                    <div className="space-y-4 mb-6">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted">Tokens por consulta</span>
                          <span className="font-mono text-white-f">{(calcTokens/1000).toFixed(0)}K</span>
                        </div>
                        <input type="range" min={10000} max={500000} step={10000} value={calcTokens}
                          onChange={(e) => setCalcTokens(Number(e.target.value))} className="w-full" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted">Consultas por día</span>
                          <span className="font-mono text-white-f">{calcCalls}</span>
                        </div>
                        <input type="range" min={5} max={200} step={5} value={calcCalls}
                          onChange={(e) => setCalcCalls(Number(e.target.value))} className="w-full" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {LLM_COMPARISON.map((m, i) => {
                        const cost = dailyCost(m);
                        const maxCost = Math.max(...LLM_COMPARISON.map(dailyCost));
                        return (
                          <div key={m.name} className={`flex items-center gap-2 p-2 rounded-lg transition-all ${activeLLM === i ? "bg-white/[0.03]" : ""}`}>
                            <span className="font-mono text-[0.6rem] text-muted w-20 shrink-0 truncate">{m.name.split(" ")[0]} {m.name.split(" ")[1]}</span>
                            <div className="flex-1 h-4 rounded-full bg-white/[0.04]">
                              <div className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2" style={{
                                width: `${Math.max(3, (cost / maxCost) * 100)}%`,
                                background: activeLLM === i ? m.color : `${m.color}60`,
                              }}>
                                {cost > 0.1 && <span className="text-[0.5rem] font-mono text-white-f">${cost.toFixed(2)}</span>}
                              </div>
                            </div>
                            <span className="font-mono text-[0.6rem] text-muted w-16 text-right">${cost.toFixed(2)}/día</span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[0.6rem] text-muted mt-3">* Costos estimados API. No incluye licencias enterprise.</p>
                  </div>

                  {/* Context comparison */}
                  <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                    <p className="font-mono text-xs text-muted mb-4">Ventana de contexto comparada</p>
                    <div className="space-y-2">
                      {LLM_COMPARISON.map((m, i) => {
                        const maxCtx = Math.max(...LLM_COMPARISON.map(x => x.context));
                        return (
                          <div key={m.name} className="flex items-center gap-2">
                            <span className="font-mono text-[0.6rem] text-muted w-16 shrink-0 truncate">{m.name.split(" ")[0]}</span>
                            <div className="flex-1 h-3 rounded-full bg-white/[0.04]">
                              <div className="h-full rounded-full transition-all duration-500" style={{
                                width: `${(m.context / maxCtx) * 100}%`,
                                background: i === activeLLM ? m.color : `${m.color}40`,
                              }} />
                            </div>
                            <span className="font-mono text-[0.6rem] text-muted w-10 text-right">
                              {m.context >= 1000000 ? `${(m.context/1000000).toFixed(0)}M` : `${(m.context/1000).toFixed(0)}K`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>
      </RevealSection>

      {/* ═══════════════ 7. CRITERIA + ECOSYSTEMS ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">Selección Estratégica</p>
          <h2 className="text-2xl font-bold text-white-f mb-6">6 criterios + ecosistemas enterprise</h2>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
            {CRITERIA.map((c) => (
              <div key={c.id} className="bg-[#151A3A] border border-white/[0.06] rounded-xl p-4 text-center hover:border-white/[0.12] transition-all hover:scale-105">
                <span className="text-xl">{c.icon}</span>
                <p className="text-white-f font-semibold text-xs mt-2">{c.label}</p>
                <p className="text-[0.55rem] text-muted mt-1">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Ecosystem comparison */}
          <div className="flex gap-3 mb-6">
            {[
              { id: "microsoft", label: "Microsoft 365 + Copilot", color: "#3A7BD5" },
              { id: "google", label: "Google Workspace + Gemini", color: "#22C55E" },
            ].map((eco) => (
              <button key={eco.id} onClick={() => setActiveEcosystem(eco.id)}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer border ${
                  activeEcosystem === eco.id ? "scale-[1.01]" : "border-white/[0.06] bg-[#151A3A]"
                }`}
                style={activeEcosystem === eco.id ? { background: `${eco.color}15`, borderColor: `${eco.color}50`, color: eco.color } : undefined}>
                {eco.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 animate-fadeUp">
            <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
              <p className="font-mono text-xs mb-4" style={{ color: activeEcosystem === "microsoft" ? "#3A7BD5" : "#22C55E" }}>HERRAMIENTAS IA</p>
              <div className="space-y-2">
                {(activeEcosystem === "microsoft" ? [
                  { app: "Word + Copilot", use: "Memos, contratos, reportes desde instrucciones naturales" },
                  { app: "Excel + Copilot", use: "Fórmulas complejas, análisis de datos, tablas dinámicas auto" },
                  { app: "PowerPoint + Copilot", use: "Pitch books y propuestas desde un brief" },
                  { app: "Teams + Copilot", use: "Resumen reuniones, action items, transcripción real-time" },
                  { app: "Copilot Studio", use: "Agentes virtuales custom con datos internos" },
                ] : [
                  { app: "Docs + Gemini", use: "Genera, resume, reformatea documentos automáticamente" },
                  { app: "Sheets + Gemini", use: "Fórmulas inteligentes, categorización, análisis natural" },
                  { app: "NotebookLM", use: "Research con tus docs. Cero alucinaciones. Audio Overview." },
                  { app: "Meet + Gemini", use: "Transcripción, resúmenes, notas con action items" },
                  { app: "Deep Research", use: "Investigación autónoma: genera reportes de 30+ fuentes" },
                ]).map((item) => (
                  <div key={item.app} className="bg-[#0D1229] rounded-lg p-3 border border-white/[0.04]">
                    <p className="text-white-f font-semibold text-xs">{item.app}</p>
                    <p className="text-[0.6rem] text-muted mt-0.5">{item.use}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
              <p className="font-mono text-xs mb-4" style={{ color: activeEcosystem === "microsoft" ? "#3A7BD5" : "#22C55E" }}>EVALUACIÓN BTG</p>
              <div className="space-y-4">
                {(activeEcosystem === "microsoft" ? [
                  { k: "Costo", v: "$30/user/mes. 100 usuarios: $36K/año." },
                  { k: "Ventaja clave", v: "Integración nativa con herramientas existentes. SSO. Compliance enterprise." },
                  { k: "Limitación", v: "Funcionalidad IA menor vs APIs directas. Alto costo por usuario masivo." },
                  { k: "Veredicto", v: "Ideal si BTG usa M365. Valor en adopción masiva, no calidad individual." },
                ] : [
                  { k: "Costo", v: "$20-30/user/mes. NotebookLM gratuito." },
                  { k: "Ventaja clave", v: "2M tokens contexto. NotebookLM único. Deep Research. Mejor costo-beneficio." },
                  { k: "Limitación", v: "Menor adopción enterprise LatAm. Integración limitada on-premise." },
                  { k: "Veredicto", v: "NotebookLM es indispensable sin importar el ecosistema principal." },
                ]).map((item) => (
                  <div key={item.k}>
                    <p className="text-white-f text-xs font-semibold">{item.k}</p>
                    <p className="text-[0.6rem] text-muted">{item.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 8. ROLE PROFILES ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">Stack por Rol &middot; BTG Pactual</p>
          <h2 className="text-2xl font-bold text-white-f mb-8">El stack óptimo según tu función</h2>

          <div className="flex flex-wrap gap-2 mb-8">
            {ROLE_PROFILES.map((role) => (
              <button key={role.id} onClick={() => setActiveRole(role.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                  activeRole === role.id ? "scale-[1.02]" : "border-white/[0.06] bg-[#151A3A]"
                }`}
                style={activeRole === role.id ? { background: `${role.color}15`, borderColor: `${role.color}50`, color: role.color } : undefined}>
                <span className="mr-1">{role.icon}</span>{role.label}
              </button>
            ))}
          </div>

          <div className="animate-fadeUp">
            <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{activeRoleData.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-white-f">{activeRoleData.label}</h3>
                  <p className="text-[0.6rem] text-muted">{activeRoleData.area}</p>
                </div>
              </div>
              <p className="text-xs text-muted"><strong className="text-white-f">Necesidades:</strong> {activeRoleData.needs}</p>
            </div>

            <div className="space-y-3">
              {activeRoleData.stack.map((rec, i) => (
                <div key={i} className={`bg-[#151A3A] border rounded-xl p-5 transition-all hover:scale-[1.005] ${
                  rec.primary ? "border-white/[0.08]" : "border-white/[0.04]"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0" style={{
                      background: rec.primary ? `${activeRoleData.color}25` : "rgba(255,255,255,0.04)",
                      color: rec.primary ? activeRoleData.color : "#7a82a0",
                    }}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white-f font-semibold text-sm">{rec.tool}</p>
                        {rec.primary && <span className="px-1.5 py-0.5 rounded text-[0.5rem] font-mono bg-cyan/15 text-cyan">CORE</span>}
                      </div>
                      <p className="text-xs text-muted mt-0.5">{rec.why}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 9. DIAGNOSTIC + CHALLENGE ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16 pb-32">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">Taller &middot; Autodiagnóstico</p>
          <h2 className="text-2xl font-bold text-white-f mb-8">Diseña tu stack personalizado</h2>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              {!diagComplete ? (
                <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <p className="font-mono text-xs text-muted">Pregunta {diagStep + 1}/{DIAG_QUESTIONS.length}</p>
                    <div className="flex gap-1">
                      {DIAG_QUESTIONS.map((_, i) => (
                        <div key={i} className={`w-8 h-1.5 rounded-full ${
                          i < diagStep ? "bg-cyan" : i === diagStep ? "bg-purple" : "bg-white/[0.06]"
                        }`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-white-f font-semibold text-lg mb-6">{DIAG_QUESTIONS[diagStep].q}</p>
                  <div className="space-y-3">
                    {DIAG_QUESTIONS[diagStep].opts.map((opt) => (
                      <button key={opt.id} onClick={() => handleDiagAnswer(opt.id)}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all cursor-pointer border border-white/[0.06] text-muted hover:border-purple/40 hover:bg-purple/5 hover:text-white-f">
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : diagResult ? (
                <div className="bg-[#151A3A] border rounded-2xl p-6 animate-fadeUp glow-cyan" style={{ borderColor: `${diagResult.color}40` }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: diagResult.color }}>Tu Stack Recomendado</p>
                      <h3 className="text-xl font-bold text-white-f">{diagResult.title}</h3>
                    </div>
                    <button onClick={resetDiag} className="px-3 py-1 rounded-lg text-xs font-mono border border-white/[0.08] text-muted hover:text-white-f cursor-pointer">Reiniciar</button>
                  </div>
                  <div className="space-y-2 mb-6">
                    {diagResult.stack.map((tool, i) => (
                      <div key={i} className="flex items-center gap-3 bg-[#0D1229] rounded-xl p-3 border border-white/[0.04]">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs" style={{
                          background: `${diagResult.color}20`, color: diagResult.color,
                        }}>{i + 1}</div>
                        <p className="text-white-f font-semibold text-sm">{tool}</p>
                        {i < 2 && <span className="ml-auto px-1.5 py-0.5 rounded text-[0.5rem] font-mono bg-cyan/15 text-cyan">CORE</span>}
                      </div>
                    ))}
                  </div>
                  <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4">
                    <p className="text-xs text-white-f">{diagResult.tip}</p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <p className="font-mono text-xs text-orange mb-2">RETO — PITCH + DEMO EN VIVO</p>
              {[
                { n: 1, title: "Completa el autodiagnóstico", desc: "4 preguntas para tu stack personalizado." },
                { n: 2, title: "Abre tu herramienta #1", desc: "Crea cuenta free si no la tienes. Explora 10 min." },
                { n: 3, title: "Resuelve un caso real", desc: "Usa la herramienta con un problema de tu trabajo diario." },
                { n: 4, title: "Pitch de 2 minutos", desc: "Herramienta + por qué + demo en vivo. El mejor pitch gana." },
              ].map((step) => (
                <div key={step.n} className="flex gap-4 bg-[#151A3A] border border-white/[0.06] rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple to-purple-dark flex items-center justify-center shrink-0">
                    <span className="text-white-f font-bold text-sm">{step.n}</span>
                  </div>
                  <div>
                    <p className="text-white-f font-semibold text-sm">{step.title}</p>
                    <p className="text-xs text-muted mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>
    </div>
  );
}
