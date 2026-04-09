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
