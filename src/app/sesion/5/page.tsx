"use client";

import { useState, useEffect, useMemo } from "react";
import RevealSection from "@/components/RevealSection";

/* ════════════════════════════ DATA ════════════════════════════ */

const AGENDA = [
  { time: "0:00–0:15", label: "Ecosistemas en guerra: Google vs Microsoft", color: "#3A7BD5" },
  { time: "0:15–0:40", label: "NotebookLM + Audio Overview", color: "#00E5A0" },
  { time: "0:40–1:00", label: "Gemini 3.1 + Workspace", color: "#5B52D5" },
  { time: "1:00–1:25", label: "Copilot M365 en Word, Excel, PPT, Teams", color: "#7B73E8" },
  { time: "1:25–1:45", label: "Taller: Briefing + Pitch", color: "#D4AF4C" },
  { time: "1:45–2:00", label: "Demo + decisión ecosistema", color: "#E85A1F" },
];

const ECOSYSTEMS = [
  {
    id: "google",
    name: "Google / Gemini",
    color: "#3A7BD5",
    icon: "◆",
    ground: "Workspace + Chrome",
    killer: "Contexto 2M tokens + Deep Research + NotebookLM nativo",
    strengths: [
      "2M tokens (el mayor del mercado)",
      "Deep Research: investigación autónoma con citas",
      "NotebookLM incluido: cero alucinaciones",
      "Integración nativa Gmail/Docs/Sheets/Drive",
      "Búsqueda web en tiempo real",
    ],
    weaknesses: [
      "Menos adopción enterprise en LatAm",
      "Workspace aún no domina en BTG",
      "Canvas menos maduro que Copilot en Office",
    ],
    priceTag: "$20/mes Pro · $30/user Workspace",
    btgFit: "Wealth Management, Research, Asset Management — donde research documental es la prioridad.",
  },
  {
    id: "microsoft",
    name: "Microsoft / Copilot",
    color: "#7B73E8",
    icon: "🏢",
    ground: "M365 + Teams + SharePoint",
    killer: "Ya vive dentro de Outlook, Teams, Word, Excel y PowerPoint",
    strengths: [
      "Cero fricción: ya tienes M365, solo activas licencia",
      "Lee el tenant: correos, archivos, reuniones",
      "Respeta permisos y sensitivity labels existentes",
      "Copilot Studio para agentes low-code corporativos",
      "Governance enterprise madura (Purview, DLP)",
    ],
    weaknesses: [
      "$30/user/mes — el más caro del mercado",
      "Requiere M365 E3/E5 previo",
      "No hay 'Deep Research' tan potente",
      "Context window 128K (vs 1M–2M en Claude/Gemini)",
    ],
    priceTag: "$30/user/mes (sobre licencia M365)",
    btgFit: "Investment Banking, Compliance, Operaciones — donde el día a día ya transcurre en Outlook + Teams + SharePoint.",
  },
];

const NOTEBOOKLM_FLOW = [
  {
    step: "1 · Sources",
    title: "Sube hasta 300 fuentes",
    detail: "PDFs, Docs, URLs, YouTube transcripts, pastes de texto. El notebook las indexa y desde ese momento el modelo responde SOLO desde esas fuentes.",
    example: "Data room target · 3 earnings calls · 5 research notes sector · 10 noticias regulatorias",
    icon: "📁",
    color: "#00E5A0",
  },
  {
    step: "2 · Study Guide",
    title: "Resumen estructurado automático",
    detail: "NotebookLM genera una guía con preguntas frecuentes, timeline de eventos, glosario de conceptos y mapa de los puntos clave de todas las fuentes.",
    example: "Para el target: timeline de hitos 2020–2026 · glosario con 18 conceptos clave · FAQ con 22 preguntas tipo IC",
    icon: "📚",
    color: "#5B52D5",
  },
  {
    step: "3 · Mind Map",
    title: "Visualización de relaciones",
    detail: "Mapa visual interactivo que conecta conceptos, entidades y temas entre todas las fuentes. Útil para encontrar ángulos no obvios del análisis.",
    example: "Mapa muestra que 4 de las 5 fuentes mencionan el mismo riesgo cambiario que no aparece en el CIM oficial.",
    icon: "🧠",
    color: "#3A7BD5",
  },
  {
    step: "4 · Audio Overview",
    title: "Podcast de 10–20 minutos",
    detail: "Dos hosts AI tienen una conversación podcast sobre tus fuentes. Ideal para onboarding de un MD al tema mientras va en el carro al aeropuerto.",
    example: "Podcast de 14 min sobre el target: historia, tesis, riesgos, comps, conclusión — ambos hosts discuten escenarios.",
    icon: "🎙",
    color: "#E85A1F",
  },
  {
    step: "5 · Video Overview",
    title: "Explainer video con slides",
    detail: "Video de ~5 min con slides narrados que explican el contenido clave de las fuentes. Útil para compartir con stakeholders no-técnicos.",
    example: "Video explicativo con 15 slides: tesis de inversión, mercado, números, próximos pasos — listo para compartir.",
    icon: "🎬",
    color: "#D4AF4C",
  },
  {
    step: "6 · Chat cited",
    title: "Preguntas con citas verificables",
    detail: "Cada respuesta incluye números de cita [1][2] que abren el passage exacto de la fuente original. Cero alucinaciones, 100% auditable.",
    example: "\"¿Cuáles son los covenants del bono 2028?\" → respuesta con cita a página 47 del prospectus.",
    icon: "💬",
    color: "#9B59B6",
  },
];

const GEMINI_FEATURES = [
  {
    id: "context",
    name: "Contexto 2M tokens",
    icon: "◆",
    color: "#3A7BD5",
    detail: "Gemini 3.1 Ultra procesa hasta 2 millones de tokens en una sola consulta — el mayor del mercado. Equivale a subir 3,000 páginas o 50 horas de audio a la vez.",
    btg: "Sube el data room completo + 5 años de earnings calls + research del sector. El modelo tiene TODO presente al responder.",
  },
  {
    id: "deep",
    name: "Deep Research",
    icon: "🔬",
    color: "#5B52D5",
    detail: "Modo especial: le das un tema, Gemini planifica 50+ búsquedas en web, lee fuentes, sintetiza y entrega un reporte estructurado con todas las citas. Dura 5–15 min.",
    btg: "\"Research completo del sector retail LatAm con comps, tendencias 2026, regulación por país\" → reporte de 15 páginas con 80 citas.",
  },
  {
    id: "workspace",
    name: "Integración Workspace",
    icon: "🔗",
    color: "#00E5A0",
    detail: "Gemini lee y escribe en Gmail, Docs, Sheets, Drive, Slides, Meet. \"Genera resumen del correo de X\", \"redacta borrador en Docs desde este brief\", \"analiza la hoja de posiciones\".",
    btg: "Un Gem conectado al Drive del equipo genera el briefing semanal automatizado leyendo research de múltiples folders.",
  },
  {
    id: "gems",
    name: "Gems personalizados",
    icon: "💎",
    color: "#D4AF4C",
    detail: "Equivalente a Custom GPTs en Gemini. Defines rol, instrucciones, knowledge y se invoca con @nombre desde cualquier chat. Se comparte con el Workspace.",
    btg: "Gem 'Analista Deal Colombia' con templates BTG + research sectorial + tone of voice. El equipo entero lo usa sin entrenar prompts.",
  },
  {
    id: "deepthink",
    name: "Deep Think mode",
    icon: "🧠",
    color: "#E85A1F",
    detail: "Modo razonamiento extendido. Multiplica el compute en inferencia: Gemini 'piensa' durante minutos antes de responder. Ideal para análisis complejos multi-paso.",
    btg: "Evaluación de tesis de inversión con 5 escenarios macro, 12 riesgos y 8 comps — razonado explícitamente.",
  },
  {
    id: "canvas",
    name: "Canvas",
    icon: "▣",
    color: "#22C55E",
    detail: "Editor lateral para documentos y código donde tú y Gemini editan en vivo. Versiones, comentarios línea por línea, export directo a Docs.",
    btg: "Redactas un memo DD en Canvas con Gemini, lo refinas en vivo, y al terminar lo exportas directo a Google Docs corporativo.",
  },
];

const COPILOT_APPS = [
  {
    app: "Word",
    icon: "📝",
    color: "#2B579A",
    use: "Drafting + resumen + rewrite",
    examples: [
      "\"Redacta un memo de inversión a partir de este brief + este modelo\"",
      "\"Resume este due diligence report de 60 páginas en 1 página ejecutiva\"",
      "\"Reescribe esta sección en tono de IC memo\"",
    ],
    btg: "Primer draft de memos IC en 5 min a partir del data room ya en SharePoint.",
  },
  {
    app: "Excel",
    icon: "📊",
    color: "#217346",
    use: "Análisis + fórmulas + insights",
    examples: [
      "\"Detecta outliers en esta tabla de transacciones\"",
      "\"Agrupa por sector y calcula múltiplos promedio\"",
      "\"Sugiere una visualización para mostrar la evolución mensual\"",
    ],
    btg: "Limpieza de datasets de posiciones, normalización de comps, creación de pivots instantáneos.",
  },
  {
    app: "PowerPoint",
    icon: "🎯",
    color: "#D24726",
    use: "Slides desde docs + diseño",
    examples: [
      "\"Genera un deck desde este memo Word\"",
      "\"Reorganiza este slide — hazlo más ejecutivo\"",
      "\"Sugiere diseño para estos 3 escenarios del DCF\"",
    ],
    btg: "Pitch decks IC desde el memo Word en minutos, con diseño corporativo BTG aplicado automáticamente.",
  },
  {
    app: "Teams",
    icon: "💼",
    color: "#6264A7",
    use: "Reuniones + resumen + acciones",
    examples: [
      "\"Resume la reunión y extrae action items\"",
      "\"¿Qué decidimos sobre el deal X en la reunión de ayer?\"",
      "\"Draft email de follow-up con los acuerdos\"",
    ],
    btg: "Nunca más tomar notas: Copilot graba, transcribe, resume, extrae decisiones y genera follow-ups.",
  },
  {
    app: "Outlook",
    icon: "📧",
    color: "#0078D4",
    use: "Correos + triaje + drafts",
    examples: [
      "\"Resume los 50 correos de hoy por prioridad\"",
      "\"Draft respuesta al correo del cliente X — tono formal\"",
      "\"¿Qué pendientes tengo de esta semana en correo?\"",
    ],
    btg: "Triaje matutino: 50 correos → 5 priorizados + drafts de respuesta ya preparados.",
  },
  {
    app: "SharePoint",
    icon: "🗂",
    color: "#0078D4",
    use: "Búsqueda + BizChat",
    examples: [
      "\"Busca todos los memos sobre el sector Retail LatAm\"",
      "\"¿Cuál fue la última versión del modelo DCF de Colfondos?\"",
      "\"Listado de contratos vigentes con cláusula de exclusividad\"",
    ],
    btg: "BizChat lee el tenant completo respetando permisos — respuestas con citas a correos, archivos y reuniones.",
  },
];

const BRIEFING_WORKFLOW = [
  {
    tool: "NotebookLM",
    role: "Ingesta documental",
    action: "Subir 20 fuentes: research bank × 5 · earnings calls × 8 · noticias × 7",
    output: "Knowledge base indexada con citas verificables · Study guide · Mind map",
    color: "#00E5A0",
    icon: "📚",
  },
  {
    tool: "Gemini Deep Research",
    role: "Research autónomo complementario",
    action: "\"Research del sector retail LatAm, tendencias 2026 y regulación\"",
    output: "Reporte de 15 páginas con 80 citas web + timeline de eventos regulatorios",
    color: "#5B52D5",
    icon: "🔬",
  },
  {
    tool: "NotebookLM Audio Overview",
    role: "Audio brief para carro",
    action: "Generar podcast de 15 min sobre las 20 fuentes + el reporte Gemini",
    output: "MP3 con 2 hosts discutiendo tesis, riesgos y escenarios — listo para iPhone",
    color: "#E85A1F",
    icon: "🎙",
  },
  {
    tool: "Copilot Word",
    role: "Draft del IC memo",
    action: "\"Redacta memo IC estilo BTG a partir del reporte y el Study Guide\"",
    output: "Memo de 10 páginas con tesis / riesgos / comps / next steps",
    color: "#2B579A",
    icon: "📝",
  },
  {
    tool: "Copilot PowerPoint",
    role: "Pitch deck ejecutivo",
    action: "\"Genera deck de 12 slides desde este memo Word\"",
    output: "Pitch deck con diseño BTG aplicado, gráficos y tesis — listo para IC",
    color: "#D24726",
    icon: "🎯",
  },
  {
    tool: "Copilot Teams",
    role: "Q&A en vivo en la reunión IC",
    action: "Durante el IC, Copilot en Teams responde preguntas consultando SharePoint",
    output: "Respuestas con cita a documento exacto durante la deliberación",
    color: "#6264A7",
    icon: "💼",
  },
];

const DECISION_MATRIX = [
  { scenario: "Research profundo sobre un sector", tool: "NotebookLM + Gemini Deep Research", color: "#00E5A0", why: "Cero alucinaciones + búsqueda autónoma web." },
  { scenario: "Briefing en carro para MD antes de reunión", tool: "NotebookLM Audio Overview", color: "#E85A1F", why: "Un podcast de 15 min > 40 páginas de research." },
  { scenario: "Resumen de reunión + action items", tool: "Copilot Teams", color: "#6264A7", why: "Ya graba, transcribe y resume nativamente." },
  { scenario: "Primer draft de IC memo", tool: "Copilot Word + docs en SharePoint", color: "#2B579A", why: "Lee el tenant completo sin fricción." },
  { scenario: "Análisis de Excel con outliers", tool: "Copilot Excel", color: "#217346", why: "Fórmulas complejas en lenguaje natural." },
  { scenario: "Pitch deck IC desde memo", tool: "Copilot PowerPoint", color: "#D24726", why: "Formato corporativo BTG aplicado." },
  { scenario: "Triaje matutino de correos", tool: "Copilot Outlook", color: "#0078D4", why: "50 correos → 5 priorizados + drafts." },
  { scenario: "Dashboard interactivo para comité", tool: "Gemini + Canvas", color: "#3A7BD5", why: "Más libertad visual que Copilot para dashboards." },
];

const TALLER_STEPS = [
  { n: 1, title: "Escoge un sector", desc: "Retail LatAm, fintech, real estate — uno que conozcas bien." },
  { n: 2, title: "NotebookLM · crea notebook", desc: "Sube 5–10 fuentes reales o simuladas (PDFs, URLs, YouTube)." },
  { n: 3, title: "Audio Overview", desc: "Genera el podcast de 10 min. Escucha al menos 3 minutos." },
  { n: 4, title: "Gemini Deep Research", desc: "Pide un reporte complementario del sector (tendencias 2026)." },
  { n: 5, title: "Copilot Word o Google Docs", desc: "Genera un briefing de 2 páginas con tesis + riesgos." },
  { n: 6, title: "Pitch deck 6 slides", desc: "Copilot PowerPoint o Gemini Canvas — formato ejecutivo." },
  { n: 7, title: "Demo 2 min", desc: "Muestra el output + decide qué ecosistema adoptarías en BTG y por qué." },
];

/* M365 Copilot live demo — apps en rotación */
const M365_APPS = [
  {
    id: "word",
    name: "Word",
    color: "#2B579A",
    icon: "W",
    subtitle: "Memo ejecutivo — IC Cementos Portales",
    doc: "IC_Memo_Cementos_Portales.docx",
    ribbon: ["Inicio", "Insertar", "Diseño", "Disposición", "Referencias", "Correspondencia", "Revisar"],
    copilotPrompt: "Resume en 3 bullets los red flags del data room para la carátula del memo.",
    copilotOutput: [
      "DSO deteriorado: 45d → 78d (2022–2025). Liquidez estructural comprometida.",
      "Covenant Net Debt/EBITDA 3.42× vs límite 3.50× — margen 0.08×.",
      "Contingencia DIAN COP 8.2B no provisionada en EEFF del target.",
    ],
    suggestions: ["Reescribir tono más ejecutivo", "Añadir sensibilidades", "Generar resumen para el board"],
  },
  {
    id: "excel",
    name: "Excel",
    color: "#217346",
    icon: "X",
    subtitle: "Modelo DCF — Cementos Portales",
    doc: "DCF_Cementos_Portales.xlsx",
    ribbon: ["Inicio", "Insertar", "Dibujar", "Disposición", "Fórmulas", "Datos", "Revisar"],
    copilotPrompt: "Explica por qué el FCF year 3 cae 22% y sugiere sensibilidad.",
    copilotOutput: [
      "Caída driven por ciclo expansivo de capex (+COP 340B) en planta Cartagena.",
      "Recomiendo sensibilidad ±10% en working capital y ±50bps en WACC.",
      "Sugerencia: añadir escenario bear con capex diferido 12 meses.",
    ],
    suggestions: ["Crear gráfico tornado", "Añadir escenario bear", "Copiar como reporte Word"],
  },
  {
    id: "ppt",
    name: "PowerPoint",
    color: "#B7472A",
    icon: "P",
    subtitle: "Pitch deck comité — slide 7 de 14",
    doc: "Pitch_Comite_V3.pptx",
    ribbon: ["Inicio", "Insertar", "Diseño", "Transiciones", "Animaciones", "Presentación"],
    copilotPrompt: "Genera speaker notes para esta slide de red flags (90 segundos).",
    copilotOutput: [
      "Introducir: identificamos 3 riesgos materiales del target.",
      "DSO ha empeorado 73% en 3 años — señal de presión de ventas.",
      "Covenant breach a 1 trimestre de distancia, riesgo real de aceleración.",
      "DIAN notificó en febrero, no está en EEFF. Ajuste de 1.4% EBITDA.",
    ],
    suggestions: ["Cambiar diseño a versión ejecutiva", "Generar slide resumen", "Sugerir transiciones"],
  },
  {
    id: "outlook",
    name: "Outlook",
    color: "#0078D4",
    icon: "O",
    subtitle: "Triaje · Bandeja de entrada · 42 correos",
    doc: "Bandeja de entrada",
    ribbon: ["Inicio", "Enviar/recibir", "Carpeta", "Ver", "Ayuda"],
    copilotPrompt: "¿Qué correos requieren acción hoy antes de las 3pm?",
    copilotOutput: [
      "KPMG — firma electrónica del Term Sheet modificado (urgente, hoy 2pm).",
      "Legal BTG — confirmación sobre cláusula de earn-out Portales.",
      "CFO target — respondió sobre DIAN, necesitas confirmar call de mañana.",
    ],
    suggestions: ["Borrador respuesta KPMG", "Agendar call CFO", "Marcar 3 correos como leídos"],
  },
];

/* NotebookLM Audio Overview — datos del podcast */
const PODCAST = {
  title: "Briefing ejecutivo · Adquisición Cementos Portales",
  subtitle: "Generado por NotebookLM · 15 fuentes · hosts sintéticos Ana + Diego",
  totalSec: 754, // 12:34
  sources: [
    { n: "CIM Target", type: "PDF", pages: 42 },
    { n: "Audit KPMG 2024", type: "PDF", pages: 112 },
    { n: "Term Sheet Draft", type: "PDF", pages: 8 },
    { n: "Legal Opinion", type: "PDF", pages: 23 },
    { n: "Financials 2021–25", type: "XLSX", pages: 14 },
    { n: "Research Cemex", type: "PDF", pages: 34 },
    { n: "Research Argos", type: "PDF", pages: 28 },
    { n: "Bloomberg Comps", type: "PDF", pages: 9 },
    { n: "Email DIAN 12-feb", type: "PDF", pages: 3 },
    { n: "Contratos Key Clients", type: "PDF", pages: 67 },
    { n: "Proyecciones 5Y", type: "XLSX", pages: 22 },
    { n: "Esquema Estructura", type: "PDF", pages: 6 },
    { n: "Brief Estrategia", type: "PDF", pages: 11 },
    { n: "FAQ Comité", type: "PDF", pages: 5 },
    { n: "Slides Pitch V3", type: "PPTX", pages: 18 },
  ],
  chapters: [
    { start: 0,   label: "Thesis de inversión",        gist: "Plataforma cemento + energía · TIR objetivo 22%" },
    { start: 134, label: "Análisis financiero",         gist: "EBITDA en deterioro · working capital stress" },
    { start: 348, label: "Red flags materiales",        gist: "DSO · covenant breach · contingencia DIAN" },
    { start: 502, label: "Precio y estructura",         gist: "COP 2.4B @ 8× EBITDA · earn-out 15% a 3 años" },
    { start: 615, label: "Recomendación al Comité",     gist: "Proceder con 3 condicionantes pre-closing" },
  ],
};

/* ════════════════════════════ COMPONENT ════════════════════════════ */

export default function Sesion5() {
  const [activeEcosystem, setActiveEcosystem] = useState<string>("google");
  const [activeNbStep, setActiveNbStep] = useState<number>(0);
  const [activeFeature, setActiveFeature] = useState<string>("context");
  const [activeApp, setActiveApp] = useState<number>(0);
  const [wfStep, setWfStep] = useState<number>(0);

  /* Hero counter */
  const [heroCount, setHeroCount] = useState(0);
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => { i++; setHeroCount(i); if (i >= 5) clearInterval(iv); }, 200);
    return () => clearInterval(iv);
  }, []);

  /* Auto-advance workflow */
  useEffect(() => {
    const iv = setInterval(() => setWfStep((s) => (s + 1) % BRIEFING_WORKFLOW.length), 3000);
    return () => clearInterval(iv);
  }, []);

  /* M365 Copilot live — cycling apps + progressive output */
  const [m365Idx, setM365Idx] = useState(0);
  const [m365Line, setM365Line] = useState(0);
  useEffect(() => {
    const current = M365_APPS[m365Idx];
    if (m365Line < current.copilotOutput.length) {
      const t = setTimeout(() => setM365Line((l) => l + 1), 900);
      return () => clearTimeout(t);
    }
    // Wait, then switch app
    const t = setTimeout(() => {
      setM365Idx((i) => (i + 1) % M365_APPS.length);
      setM365Line(0);
    }, 2500);
    return () => clearTimeout(t);
  }, [m365Line, m365Idx]);
  const m365Current = M365_APPS[m365Idx];

  /* Audio Overview player (simulado) */
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const iv = setInterval(() => {
      setElapsed((e) => (e + 2 >= PODCAST.totalSec ? 0 : e + 2));
    }, 120);
    return () => clearInterval(iv);
  }, [playing]);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const currentChapter = useMemo(() => {
    const arr = PODCAST.chapters;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (elapsed >= arr[i].start) return i;
    }
    return 0;
  }, [elapsed]);

  const ecoData = useMemo(() => ECOSYSTEMS.find((e) => e.id === activeEcosystem)!, [activeEcosystem]);
  const featureData = useMemo(() => GEMINI_FEATURES.find((f) => f.id === activeFeature)!, [activeFeature]);

  return (
    <div className="min-h-screen bg-[#080C1F]">
      {/* ═══════════════ 1. HERO ═══════════════ */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden">
        <div className="hero-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_25%_50%,rgba(58,123,213,0.09),transparent),radial-gradient(ellipse_40%_50%_at_75%_60%,rgba(123,115,232,0.08),transparent)] pointer-events-none" />

        {/* Split background decoration */}
        <div className="absolute top-20 left-0 right-0 h-[60vh] flex pointer-events-none opacity-[0.04]">
          <div className="flex-1 border-r border-white/10 text-[14rem] grid place-items-center text-blue font-bold">◆</div>
          <div className="flex-1 text-[14rem] grid place-items-center text-purple-light font-bold">🏢</div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-4 animate-fadeUp">
            Módulo 02 &middot; Herramientas &middot; Sesión 5 de 4+
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white-f leading-tight mb-6 animate-fadeUp-1">
            <span className="bg-gradient-to-r from-blue to-purple-light bg-clip-text text-transparent">Gemini</span>,{" "}
            <span className="text-cyan">NotebookLM</span> y{" "}
            <span className="bg-gradient-to-r from-purple-light to-purple bg-clip-text text-transparent">Copilot M365</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 animate-fadeUp-2">
            La guerra de ecosistemas en 2026. Research documental con cero alucinaciones, productividad dentro de Office, y el IA en cada app que ya usas todos los días.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fadeUp-3">
            {[
              { val: heroCount >= 1 ? "2M" : "—", label: "Tokens Gemini", icon: "◆", color: "#3A7BD5" },
              { val: heroCount >= 2 ? "300" : "—", label: "Fuentes NotebookLM", icon: "📚", color: "#00E5A0" },
              { val: heroCount >= 3 ? "6" : "—", label: "Apps Copilot", icon: "🏢", color: "#7B73E8" },
              { val: heroCount >= 4 ? "0%" : "—", label: "Alucinaciones*", icon: "◎", color: "#22C55E" },
              { val: heroCount >= 5 ? "2" : "—", label: "Ecosistemas", icon: "⚔", color: "#E85A1F" },
            ].map((s) => (
              <div key={s.label} className="bg-[#151A3A] border rounded-2xl px-5 py-3 min-w-[110px] transition-all hover:scale-105" style={{ borderColor: `${s.color}25` }}>
                <span className="text-lg" style={{ color: s.color }}>{s.icon}</span>
                <p className="text-xl font-bold text-white-f mt-1">{s.val}</p>
                <p className="text-[0.6rem] text-muted">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[0.6rem] font-mono text-muted mt-4 opacity-60">* Solo en NotebookLM — responde únicamente desde tus fuentes</p>
        </div>
      </section>

      {/* ═══════════════ 2. AGENDA ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-12">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-6">Agenda &middot; Sesión 5</p>
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

      {/* ═══════════════ 3. ECOSYSTEM WAR ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-3">Ecosistemas 2026</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            La guerra por <span className="bg-gradient-to-r from-blue to-purple-light bg-clip-text text-transparent">el escritorio del analista</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10">
            Google apuesta a que todo pase por Workspace + Gemini. Microsoft a que el centro de gravedad sigue siendo M365. La decisión en BTG depende de dónde ya vive tu equipo.
          </p>

          {/* Big VS visual */}
          <div className="relative grid grid-cols-[1fr_auto_1fr] items-stretch gap-3 mb-6">
            {ECOSYSTEMS.map((e, idx) => (
              <button
                key={e.id}
                onClick={() => setActiveEcosystem(e.id)}
                className="text-left rounded-2xl p-6 border transition-all relative overflow-hidden"
                style={{
                  background: activeEcosystem === e.id ? `linear-gradient(135deg, ${e.color}25, ${e.color}08)` : "#151A3A",
                  borderColor: activeEcosystem === e.id ? e.color : "rgba(255,255,255,0.06)",
                  boxShadow: activeEcosystem === e.id ? `0 15px 40px ${e.color}30` : "none",
                  order: idx === 0 ? 1 : 3,
                }}
              >
                <div className="absolute top-0 right-0 text-[9rem] opacity-[0.06] leading-none pointer-events-none">{e.icon}</div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 rounded-xl grid place-items-center text-3xl" style={{
                      background: `${e.color}20`,
                      border: `1px solid ${e.color}50`,
                    }}>{e.icon}</div>
                    <div>
                      <p className="text-xl font-bold text-white-f leading-tight">{e.name}</p>
                      <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mt-1">Anclado a: {e.ground}</p>
                    </div>
                  </div>
                  <p className="text-sm italic leading-relaxed" style={{ color: e.color }}>&quot;{e.killer}&quot;</p>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <span className="font-mono text-[0.55rem] px-2 py-1 rounded border" style={{ borderColor: `${e.color}40`, color: e.color }}>{e.priceTag.split(" ")[0]}</span>
                    <span className="font-mono text-[0.55rem] px-2 py-1 rounded bg-white/5 text-muted">{e.strengths.length} fortalezas</span>
                  </div>
                </div>
              </button>
            ))}
            <div className="grid place-items-center" style={{ order: 2 }}>
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-dashed grid place-items-center font-black text-lg md:text-xl text-white-f bg-[#0D1229]" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                VS
                <div className="absolute -inset-2 rounded-full border border-white/5 animate-pulse-dot" />
              </div>
            </div>
          </div>

          <div className="bg-[#0D1229] border rounded-2xl p-6 md:p-8" style={{ borderColor: `${ecoData.color}30` }}>
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-3" style={{ color: ecoData.color }}>✓ Fortalezas</p>
                <div className="space-y-2">
                  {ecoData.strengths.map((s, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="font-mono text-xs mt-0.5" style={{ color: ecoData.color }}>▸</span>
                      <p className="text-sm text-white-f">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-3 text-muted">✗ Limitaciones</p>
                <div className="space-y-2">
                  {ecoData.weaknesses.map((w, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="font-mono text-xs mt-0.5 text-muted">◦</span>
                      <p className="text-sm text-muted">{w}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 pt-5 border-t border-white/[0.06]">
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-1">Precio</p>
                <p className="text-sm font-mono" style={{ color: ecoData.color }}>{ecoData.priceTag}</p>
              </div>
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-1">Dónde encaja en BTG</p>
                <p className="text-sm text-white-f">{ecoData.btgFit}</p>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 4. NOTEBOOKLM DEEP DIVE ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-cyan uppercase tracking-widest mb-3">NotebookLM</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            Cero alucinaciones: el asistente que <span className="bg-gradient-to-r from-cyan to-orange bg-clip-text text-transparent">solo habla de tus fuentes</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10">
            Subes documentos, NotebookLM los indexa, y desde ese momento <em>solo responde desde lo que tú le diste</em>. Cada respuesta con citas clicables. Ideal para research regulatorio, due diligence y compliance.
          </p>

          {/* Step cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
            {NOTEBOOKLM_FLOW.map((f, i) => (
              <button
                key={f.step}
                onClick={() => setActiveNbStep(i)}
                className="rounded-xl px-3 py-4 border transition-all text-center"
                style={{
                  background: activeNbStep === i ? `${f.color}15` : "#151A3A",
                  borderColor: activeNbStep === i ? `${f.color}60` : "rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-2xl">{f.icon}</p>
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mt-2" style={{ color: f.color }}>{f.step}</p>
              </button>
            ))}
          </div>

          <div className="bg-[#0D1229] border rounded-2xl overflow-hidden" style={{ borderColor: `${NOTEBOOKLM_FLOW[activeNbStep].color}30` }}>
            <div className="px-6 md:px-8 py-5 border-b border-white/[0.06] flex items-center gap-4" style={{
              background: `linear-gradient(90deg, ${NOTEBOOKLM_FLOW[activeNbStep].color}15, transparent)`,
            }}>
              <div className="w-14 h-14 rounded-xl grid place-items-center text-3xl" style={{
                background: `${NOTEBOOKLM_FLOW[activeNbStep].color}18`,
              }}>
                {NOTEBOOKLM_FLOW[activeNbStep].icon}
              </div>
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest" style={{ color: NOTEBOOKLM_FLOW[activeNbStep].color }}>
                  {NOTEBOOKLM_FLOW[activeNbStep].step}
                </p>
                <h3 className="text-2xl font-bold text-white-f">{NOTEBOOKLM_FLOW[activeNbStep].title}</h3>
              </div>
            </div>
            <div className="p-6 md:p-8 grid md:grid-cols-[1fr_1fr] gap-6">
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-3">Qué hace</p>
                <p className="text-white-f leading-relaxed">{NOTEBOOKLM_FLOW[activeNbStep].detail}</p>
              </div>
              <div className="bg-[#151A3A] rounded-xl p-4 border border-white/[0.06]">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-cyan mb-2">Ejemplo BTG</p>
                <p className="text-sm text-white-f italic leading-relaxed">{NOTEBOOKLM_FLOW[activeNbStep].example}</p>
              </div>
            </div>
          </div>

          {/* Mock NotebookLM UI */}
          <div className="mt-10">
            <p className="font-mono text-xs text-cyan uppercase tracking-wider mb-4">◉ Cómo se ve un notebook real</p>
            <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-[#fafafa] shadow-[0_20px_60px_rgba(0,229,160,0.2)]">
              {/* Google-ish header */}
              <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="text-lg">📒</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Sector Retail LatAm · Q2 2026</p>
                    <p className="text-[0.65rem] text-gray-500">22 fuentes · última edición 14 abr 2026</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-600 text-[0.65rem] font-medium border border-blue-200">🎙 Generate Audio</span>
                  <span className="px-2.5 py-1 rounded bg-gray-100 text-gray-600 text-[0.65rem] font-medium">Share</span>
                </div>
              </div>
              <div className="grid grid-cols-[220px_1fr_220px] min-h-[380px] text-[0.7rem]">
                {/* Sources panel */}
                <div className="bg-white border-r border-gray-200 p-3">
                  <p className="font-semibold text-gray-900 mb-2 text-[0.7rem]">Sources (22)</p>
                  <div className="space-y-1">
                    {[
                      { n: "1", name: "CIM Target.pdf", c: "#00E5A0" },
                      { n: "2", name: "Earnings Q4 2025", c: "#5B52D5" },
                      { n: "3", name: "Audit KPMG 2024", c: "#E85A1F" },
                      { n: "4", name: "Research EAFIT Retail", c: "#3A7BD5" },
                      { n: "5", name: "SFC Circular 048", c: "#D4AF4C" },
                      { n: "6", name: "Bloomberg Retail Brief", c: "#9B59B6" },
                    ].map((s) => (
                      <div key={s.n} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50">
                        <div className="w-5 h-5 rounded grid place-items-center font-mono text-[0.55rem] font-bold text-white shrink-0" style={{ background: s.c }}>{s.n}</div>
                        <span className="text-[0.62rem] text-gray-800 truncate">{s.name}</span>
                      </div>
                    ))}
                    <div className="text-[0.55rem] text-gray-400 px-2 italic">+16 más...</div>
                  </div>
                </div>
                {/* Chat with citations */}
                <div className="p-4 bg-[#fafafa]">
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-lg px-3 py-2 text-[0.72rem] text-gray-800 ml-12">
                      ¿Cuáles son los 3 principales riesgos macro del target según las fuentes?
                    </div>
                    <div className="text-[0.72rem] text-gray-900 leading-relaxed">
                      <p className="font-semibold mb-1">Según las fuentes, los 3 riesgos macro más relevantes son:</p>
                      <p className="mb-2">
                        <span className="font-semibold">1. Exposición cambiaria sin hedge</span> — 42% de revenues en USD con costos 100% COP, lo que vulnerabiliza márgenes ante devaluación
                        <sup className="ml-1">
                          <span className="inline-block w-4 h-4 rounded bg-[#E85A1F] text-white text-[0.5rem] font-mono font-bold text-center leading-4">3</span>
                          <span className="inline-block w-4 h-4 rounded bg-[#00E5A0] text-white text-[0.5rem] font-mono font-bold text-center leading-4 ml-0.5">1</span>
                        </sup>
                      </p>
                      <p className="mb-2">
                        <span className="font-semibold">2. Deterioro del consumo</span> — el sector retail LatAm proyecta contracción de 2.3% real en 2026
                        <sup className="ml-1">
                          <span className="inline-block w-4 h-4 rounded bg-[#9B59B6] text-white text-[0.5rem] font-mono font-bold text-center leading-4">6</span>
                          <span className="inline-block w-4 h-4 rounded bg-[#3A7BD5] text-white text-[0.5rem] font-mono font-bold text-center leading-4 ml-0.5">4</span>
                        </sup>
                      </p>
                      <p>
                        <span className="font-semibold">3. Regulación precios</span> — circular SFC 048 impone techos a comisiones desde Q3 2026
                        <sup className="ml-1">
                          <span className="inline-block w-4 h-4 rounded bg-[#D4AF4C] text-white text-[0.5rem] font-mono font-bold text-center leading-4">5</span>
                        </sup>
                      </p>
                    </div>
                  </div>
                </div>
                {/* Studio panel */}
                <div className="bg-white border-l border-gray-200 p-3">
                  <p className="font-semibold text-gray-900 mb-2 text-[0.7rem]">Studio</p>
                  <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 mb-2">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-sm">🎙</span>
                      <p className="text-[0.6rem] font-semibold text-orange-700">Audio Overview</p>
                      <span className="ml-auto text-[0.5rem] font-mono text-orange-500 animate-pulse-dot">● Live</span>
                    </div>
                    <p className="text-[0.55rem] text-orange-600 leading-snug">Deep dive · 2 hosts · 14:32</p>
                  </div>
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 mb-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span>📚</span>
                      <p className="text-[0.6rem] font-semibold text-blue-700">Study Guide</p>
                    </div>
                    <p className="text-[0.52rem] text-blue-600">22 Q · timeline · glosario</p>
                  </div>
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span>🧠</span>
                      <p className="text-[0.6rem] font-semibold text-purple-700">Mind Map</p>
                    </div>
                    <p className="text-[0.52rem] text-purple-600">Relaciones entre fuentes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Overview showcase */}
          <div className="mt-8 bg-gradient-to-br from-orange/10 to-cyan/10 border border-orange/30 rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange to-red grid place-items-center text-2xl shrink-0">🎙</div>
              <div className="flex-1">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-orange mb-1">Feature killer · Audio Overview</p>
                <p className="text-white-f text-lg leading-snug mb-4">
                  Dos hosts AI conversan sobre <em>tus</em> fuentes durante 10–20 min. Se interrumpen, se corrigen, introducen analogías. Suena como un podcast profesional.
                </p>
                {/* Audio player mock */}
                <div className="bg-[#0D1229] rounded-2xl p-4 border border-orange/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange to-red grid place-items-center text-white cursor-pointer animate-glowPulse">▶</div>
                    <div className="flex-1">
                      <p className="font-semibold text-white-f text-xs">Target LatAm Retail · Deep dive</p>
                      <p className="font-mono text-[0.6rem] text-muted">Host A · Host B · 14:32 · Generado hoy 10:24am</p>
                    </div>
                    <span className="font-mono text-[0.6rem] text-muted">2:14 / 14:32</span>
                  </div>
                  {/* Waveform */}
                  <div className="flex items-center gap-[2px] h-12 mb-3">
                    {Array.from({ length: 60 }).map((_, i) => {
                      const played = i / 60 < 2.14 / 14.5;
                      const h = 20 + Math.abs(Math.sin(i * 0.8) * 22) + (i % 3) * 4;
                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-full transition-all"
                          style={{
                            height: `${Math.min(h, 44)}px`,
                            background: played ? "#E85A1F" : "rgba(232,90,31,0.25)",
                          }}
                        />
                      );
                    })}
                  </div>
                  {/* Transcript line */}
                  <div className="flex items-start gap-2 bg-white/[0.02] rounded-lg px-3 py-2">
                    <span className="font-mono text-[0.55rem] font-bold text-cyan shrink-0 mt-0.5">[A]</span>
                    <p className="text-[0.72rem] text-white-f italic leading-relaxed">
                      &quot;Let&apos;s dive in — this cash flow profile is fascinating. They&apos;re bleeding working capital but the unit economics are actually <em>improving</em>...&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 4B. AUDIO OVERVIEW PLAYER — KILLER FEATURE ═══════════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_30%,rgba(58,123,213,0.07),transparent)] pointer-events-none" />

          <div className="relative">
            <p className="font-mono text-[0.72rem] uppercase tracking-widest text-blue mb-3">Killer feature · Audio Overview</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-4">
              15 docs <span className="text-blue">→</span> <span className="bg-gradient-to-r from-blue to-cyan bg-clip-text text-transparent">podcast de 12 min</span>
            </h2>
            <p className="text-muted text-[0.95rem] max-w-2xl mb-10">
              El CEO escucha el briefing del deal en el carro camino al Comité. Dos hosts sintéticos hablan entre sí y citan las fuentes exactas. Cero alucinaciones — solo tus docs.
            </p>

            <div className="grid lg:grid-cols-[1.7fr_1fr] gap-6 items-start">
              {/* PLAYER CARD */}
              <div className="relative bg-gradient-to-br from-[#0B1B3D] via-[#0C1130] to-[#0E1A38] border border-blue/25 rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl shadow-blue/10">
                {/* Glow */}
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-purple/10 blur-3xl pointer-events-none" />

                <div className="relative">
                  {/* Brand */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue to-purple grid place-items-center text-xs font-bold text-white">◉</div>
                      <span className="font-mono text-[0.65rem] uppercase tracking-widest text-white-f/80">NotebookLM · Audio Overview</span>
                    </div>
                    <span className="flex items-center gap-1.5 text-[0.62rem] font-mono text-cyan">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" />
                      LIVE · generado hoy 08:47
                    </span>
                  </div>

                  {/* Cover + hosts */}
                  <div className="flex gap-4 mb-6">
                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-blue via-purple to-[#7B73E8] grid place-items-center text-white text-3xl shadow-lg flex-shrink-0">
                      🎙
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-cyan/90 border-2 border-[#0B1B3D] grid place-items-center text-[0.6rem] font-bold text-[#0B1B3D]">AI</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-white-f leading-tight mb-1 truncate">{PODCAST.title}</h3>
                      <p className="text-[0.78rem] text-muted mb-3">{PODCAST.subtitle}</p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full px-2.5 py-1 text-[0.65rem] text-white-f/80">
                          <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#E85A1F] to-[#D4AF4C] grid place-items-center text-[0.55rem] font-bold text-white">A</span>
                          Ana · Host
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full px-2.5 py-1 text-[0.65rem] text-white-f/80">
                          <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#3A7BD5] to-[#5B52D5] grid place-items-center text-[0.55rem] font-bold text-white">D</span>
                          Diego · Analyst
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Now speaking indicator */}
                  <div className="mb-4 flex items-center gap-3 text-[0.78rem]">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full grid place-items-center text-[0.55rem] font-bold text-white transition-all ${currentChapter % 2 === 0 ? "bg-gradient-to-br from-[#E85A1F] to-[#D4AF4C] scale-110 ring-2 ring-orange/40" : "bg-gradient-to-br from-[#3A7BD5] to-[#5B52D5] opacity-50"}`}>A</div>
                      <div className={`w-6 h-6 rounded-full grid place-items-center text-[0.55rem] font-bold text-white transition-all ${currentChapter % 2 === 1 ? "bg-gradient-to-br from-[#3A7BD5] to-[#5B52D5] scale-110 ring-2 ring-blue/40" : "bg-gradient-to-br from-[#3A7BD5] to-[#5B52D5] opacity-50"}`}>D</div>
                    </div>
                    <p className="text-white-f italic flex-1 leading-tight">&ldquo;{PODCAST.chapters[currentChapter].gist}&rdquo;</p>
                  </div>

                  {/* Waveform animado */}
                  <div className="relative h-16 flex items-center gap-[2px] mb-2 bg-[rgba(0,0,0,0.2)] rounded-xl px-3 py-2 border border-white/[0.04]">
                    {Array.from({ length: 72 }).map((_, i) => {
                      const progress = elapsed / PODCAST.totalSec;
                      const played = i / 72 < progress;
                      const h = 18 + Math.abs(Math.sin(i * 0.48 + Math.cos(i * 0.11) * 2)) * 28;
                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-full transition-all"
                          style={{
                            height: `${h}%`,
                            background: played
                              ? `linear-gradient(to top, #3A7BD5, #7B73E8)`
                              : "rgba(255,255,255,0.08)",
                            animation: playing && Math.abs(i / 72 - progress) < 0.05 ? "float 0.6s ease-in-out infinite" : undefined,
                            animationDelay: `${i * 0.03}s`,
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Tiempo */}
                  <div className="flex items-center justify-between font-mono text-[0.65rem] text-muted mb-5">
                    <span className="text-cyan">{fmt(elapsed)}</span>
                    <span>–{fmt(PODCAST.totalSec - elapsed)}</span>
                  </div>

                  {/* Controles */}
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <button className="w-10 h-10 rounded-full border border-white/[0.08] grid place-items-center text-muted hover:text-white-f hover:border-white/20 transition-all text-sm">⏮</button>
                    <button className="w-10 h-10 rounded-full border border-white/[0.08] grid place-items-center text-muted hover:text-white-f hover:border-white/20 transition-all text-[0.7rem] font-mono">−15s</button>
                    <button
                      onClick={() => setPlaying((p) => !p)}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-blue to-purple grid place-items-center text-white text-2xl shadow-lg shadow-blue/40 hover:scale-105 transition-all"
                    >
                      {playing ? "❚❚" : "▶"}
                    </button>
                    <button className="w-10 h-10 rounded-full border border-white/[0.08] grid place-items-center text-muted hover:text-white-f hover:border-white/20 transition-all text-[0.7rem] font-mono">+15s</button>
                    <button className="w-10 h-10 rounded-full border border-white/[0.08] grid place-items-center text-muted hover:text-white-f hover:border-white/20 transition-all text-sm">⏭</button>
                  </div>

                  {/* Capítulos */}
                  <div className="space-y-1">
                    {PODCAST.chapters.map((c, i) => {
                      const active = i === currentChapter;
                      return (
                        <button
                          key={i}
                          onClick={() => setElapsed(c.start)}
                          className={`w-full grid grid-cols-[60px_1fr_auto] gap-3 items-center px-3 py-2 rounded-lg text-left transition-all border ${active ? "bg-[rgba(58,123,213,0.12)] border-blue/30" : "bg-transparent border-transparent hover:bg-white/[0.03]"}`}
                        >
                          <span className={`font-mono text-[0.68rem] ${active ? "text-cyan" : "text-muted/60"}`}>{fmt(c.start)}</span>
                          <span className={`text-[0.8rem] font-semibold ${active ? "text-white-f" : "text-white-f/70"}`}>{c.label}</span>
                          {active && <span className="text-[0.58rem] font-mono text-cyan flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-cyan animate-pulse-dot" />NOW</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SIDEBAR · fuentes + valor percibido */}
              <div className="space-y-4">
                {/* Valor percibido */}
                <div className="bg-gradient-to-br from-[#0F1438] to-[#080C1F] border border-blue/30 rounded-2xl p-5">
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-blue mb-2">Por qué importa</p>
                  <h4 className="text-lg font-bold text-white-f leading-tight mb-3">
                    El comité escucha el deal <span className="text-cyan">antes</span> de que llegue al comité.
                  </h4>
                  <ul className="space-y-2 text-[0.78rem] text-white-f/90">
                    {[
                      "Los senior leen menos y escuchan más",
                      "14 min en el carro = lectura completa de 3,420 páginas",
                      "Dos voces debatiendo es más memorable que un memo",
                      "Cero alucinaciones: solo contenido de tus docs",
                    ].map((v) => (
                      <li key={v} className="flex gap-2">
                        <span className="text-cyan mt-0.5">✓</span>
                        <span className="leading-snug">{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Fuentes */}
                <div className="bg-[#0F1438] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-cyan">Fuentes del podcast</p>
                    <span className="font-mono text-[0.65rem] text-white-f font-bold">{PODCAST.sources.length}</span>
                  </div>
                  <div className="space-y-1 max-h-[260px] overflow-y-auto pr-1">
                    {PODCAST.sources.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-[0.72rem] py-1 border-b border-white/[0.04] last:border-0">
                        <span className={`font-mono text-[0.55rem] px-1.5 py-0.5 rounded-sm font-semibold ${s.type === "PDF" ? "bg-[rgba(232,90,31,0.12)] text-orange" : s.type === "XLSX" ? "bg-[rgba(34,197,94,0.12)] text-[#22C55E]" : "bg-[rgba(232,90,31,0.12)] text-[#E85A1F]"}`}>{s.type}</span>
                        <span className="flex-1 text-white-f/80 truncate">{s.n}</span>
                        <span className="font-mono text-[0.6rem] text-muted/60">{s.pages}p</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badge compliance */}
                <div className="bg-[rgba(0,229,160,0.06)] border border-[rgba(0,229,160,0.2)] rounded-xl p-4 flex items-center gap-3">
                  <span className="text-xl">🔒</span>
                  <div className="flex-1">
                    <p className="text-[0.75rem] font-semibold text-white-f leading-tight">NotebookLM Enterprise</p>
                    <p className="text-[0.68rem] text-muted leading-tight mt-0.5">Datos no se usan para entrenar. SOC2 Type II · ISO 27001.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 5. GEMINI FEATURES ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] uppercase tracking-widest text-blue mb-3">Gemini 3.1</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            El modelo con <span className="text-blue">el mayor contexto</span> del mercado
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10">
            2 millones de tokens, Deep Research autónomo, integración Workspace, Gems personalizados y modo Deep Think. Seis capacidades que lo hacen imbatible para research documental masivo.
          </p>

          <div className="grid md:grid-cols-3 gap-3 mb-6">
            {GEMINI_FEATURES.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFeature(f.id)}
                className="text-left rounded-2xl p-4 border transition-all"
                style={{
                  background: activeFeature === f.id ? `${f.color}15` : "#151A3A",
                  borderColor: activeFeature === f.id ? `${f.color}60` : "rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{f.icon}</span>
                  <p className="text-sm font-bold text-white-f leading-tight">{f.name}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-[#0D1229] border rounded-2xl p-6 md:p-8" style={{ borderColor: `${featureData.color}30` }}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl grid place-items-center text-4xl" style={{ background: `${featureData.color}18` }}>
                {featureData.icon}
              </div>
              <h3 className="text-2xl font-bold text-white-f">{featureData.name}</h3>
            </div>
            <p className="text-white-f leading-relaxed mb-5 text-base">{featureData.detail}</p>
            <div className="bg-[#151A3A] rounded-xl p-4 border border-white/[0.06]">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-2" style={{ color: featureData.color }}>Caso BTG</p>
              <p className="text-sm text-white-f italic leading-relaxed">{featureData.btg}</p>
            </div>
          </div>

          {/* Context window comparison */}
          <div className="mt-10">
            <p className="font-mono text-xs text-blue uppercase tracking-wider mb-4">◆ El ancho del contexto — visualizado</p>
            <div className="bg-[#0D1229] border border-blue/20 rounded-2xl p-6">
              <p className="text-muted text-sm mb-5">
                Cada barra = tokens simultáneos que el modelo puede tener &quot;a la vista&quot;. Un <em>data room</em> medio BTG = ~400K tokens.
              </p>
              <div className="space-y-3">
                {[
                  { name: "Gemini 3.1 Ultra", tokens: 2000000, color: "#3A7BD5", bar: 100, label: "2M", note: "2 años de earnings calls + 50 PDFs" },
                  { name: "Claude 4.7 Opus", tokens: 1000000, color: "#E85A1F", bar: 50, label: "1M", note: "Data room completo + histórico" },
                  { name: "GPT-5.4", tokens: 1000000, color: "#22C55E", bar: 50, label: "1M", note: "Empatado con Opus" },
                  { name: "Data room BTG típico", tokens: 400000, color: "#D4AF4C", bar: 20, label: "400K", note: "Referencia · lo que subes", dashed: true },
                  { name: "Claude Sonnet 4.6", tokens: 200000, color: "#7B73E8", bar: 10, label: "200K", note: "Tareas diarias" },
                  { name: "DeepSeek R1", tokens: 128000, color: "#D4AF4C", bar: 6.4, label: "128K", note: "Budget model" },
                  { name: "GPT-3.5 (2022)", tokens: 4096, color: "#7a82a0", bar: 0.2, label: "4K", note: "Cuando empezó todo", faded: true },
                ].map((m) => (
                  <div key={m.name}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className={`text-xs ${m.faded ? "text-muted" : "text-white-f"} ${m.dashed ? "italic" : ""}`}>{m.name}</span>
                      <span className="font-mono text-[0.7rem]" style={{ color: m.color }}>{m.label} tokens</span>
                    </div>
                    <div className="h-5 rounded bg-white/[0.03] relative overflow-hidden">
                      <div
                        className="h-full rounded transition-all duration-1000 flex items-center px-2"
                        style={{
                          width: `${m.bar}%`,
                          background: `linear-gradient(90deg, ${m.color}, ${m.color}60)`,
                          border: m.dashed ? `1px dashed ${m.color}` : "none",
                          opacity: m.faded ? 0.4 : 1,
                        }}
                      >
                        {m.bar > 15 && <span className="font-mono text-[0.55rem] text-white-f whitespace-nowrap">{m.note}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 6. COPILOT M365 ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] uppercase tracking-widest mb-3" style={{ color: "#7B73E8" }}>Microsoft 365 Copilot</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            IA dentro de cada <span className="bg-gradient-to-r from-purple-light to-blue bg-clip-text text-transparent">app que ya usas</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10">
            $30/user/mes. Lee tu tenant completo (SharePoint, OneDrive, Teams, Exchange) respetando los permisos existentes. No requiere cambiar workflow — solo activar la licencia.
          </p>

          {/* App tabs */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
            {COPILOT_APPS.map((a, i) => (
              <button
                key={a.app}
                onClick={() => setActiveApp(i)}
                className="rounded-xl px-3 py-4 border transition-all text-center"
                style={{
                  background: activeApp === i ? `${a.color}25` : "#151A3A",
                  borderColor: activeApp === i ? a.color : "rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-2xl">{a.icon}</p>
                <p className="text-sm font-bold text-white-f mt-1">{a.app}</p>
              </button>
            ))}
          </div>

          <div className="bg-[#0D1229] border rounded-2xl overflow-hidden" style={{ borderColor: `${COPILOT_APPS[activeApp].color}40` }}>
            <div className="px-6 md:px-8 py-5 border-b border-white/[0.06] flex items-center gap-4" style={{
              background: `linear-gradient(90deg, ${COPILOT_APPS[activeApp].color}20, transparent)`,
            }}>
              <div className="w-14 h-14 rounded-xl grid place-items-center text-3xl border" style={{
                background: `${COPILOT_APPS[activeApp].color}15`,
                borderColor: `${COPILOT_APPS[activeApp].color}40`,
              }}>
                {COPILOT_APPS[activeApp].icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white-f">Copilot en {COPILOT_APPS[activeApp].app}</h3>
                <p className="font-mono text-[0.65rem] uppercase tracking-wider mt-1" style={{ color: COPILOT_APPS[activeApp].color }}>
                  {COPILOT_APPS[activeApp].use}
                </p>
              </div>
            </div>
            <div className="p-6 md:p-8 grid md:grid-cols-[1fr_1.2fr] gap-6">
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-3">Prompts que funcionan</p>
                <div className="space-y-2">
                  {COPILOT_APPS[activeApp].examples.map((p, i) => (
                    <div key={i} className="bg-[#151A3A] border border-white/[0.06] rounded-lg px-4 py-3 font-mono text-xs text-white-f leading-relaxed">
                      {p}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg border" style={{
                  background: `${COPILOT_APPS[activeApp].color}10`,
                  borderColor: `${COPILOT_APPS[activeApp].color}30`,
                }}>
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-1" style={{ color: COPILOT_APPS[activeApp].color }}>Aplicación BTG</p>
                  <p className="text-xs text-white-f leading-relaxed italic">{COPILOT_APPS[activeApp].btg}</p>
                </div>
              </div>
              {/* Mock UI per app */}
              <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-white shadow-xl">
                {/* Title bar */}
                <div className="flex items-center justify-between px-3 py-2 text-white text-[0.62rem] font-semibold" style={{ background: COPILOT_APPS[activeApp].color }}>
                  <div className="flex items-center gap-1.5">
                    <span>{COPILOT_APPS[activeApp].icon}</span>
                    <span>{COPILOT_APPS[activeApp].app === "PowerPoint" ? "Presentation1" : COPILOT_APPS[activeApp].app === "Excel" ? "DealTracker.xlsx" : COPILOT_APPS[activeApp].app === "Teams" ? "Team · IB Deals" : "Document1"}</span>
                  </div>
                  <div className="flex gap-1 opacity-70">
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                  </div>
                </div>
                {/* Ribbon */}
                <div className="flex gap-0.5 px-1 py-1 bg-gray-50 border-b border-gray-200 text-[0.55rem] text-gray-600">
                  {["File", "Home", "Insert", "Data", "Review"].map((t, i) => (
                    <span key={t} className={`px-2 py-0.5 rounded ${i === 1 ? "bg-white border border-gray-200" : ""}`}>{t}</span>
                  ))}
                  <span className="ml-auto px-2 py-0.5 rounded font-bold text-white flex items-center gap-1" style={{ background: `linear-gradient(135deg, ${COPILOT_APPS[activeApp].color}, #9B59B6)` }}>
                    ✨ Copilot
                  </span>
                </div>
                {/* App-specific content */}
                <div className="p-3 bg-white min-h-[200px] text-[0.6rem]">
                  {COPILOT_APPS[activeApp].app === "Word" && (
                    <div className="text-gray-800">
                      <p className="text-center font-bold text-sm mb-2">IC MEMO · TARGET LATAM RETAIL</p>
                      <p className="text-center text-gray-500 mb-3 text-[0.55rem]">BTG Pactual · abril 2026</p>
                      <p className="font-semibold">1. Investment Thesis</p>
                      <div className="h-1 bg-gray-200 rounded w-full my-1" />
                      <div className="h-1 bg-gray-200 rounded w-[92%] my-1" />
                      <div className="h-1 bg-gray-200 rounded w-[85%] my-1" />
                      <p className="font-semibold mt-2">2. Key Risks</p>
                      <div className="h-1 bg-gray-200 rounded w-full my-1" />
                      <div className="h-1 bg-gray-200 rounded w-[78%] my-1" />
                      <div className="absolute mt-[-15px] ml-[60%] text-white font-bold px-1.5 py-0.5 rounded text-[0.5rem] shadow-lg" style={{ background: "#2B579A" }}>✨ Copilot drafting...</div>
                    </div>
                  )}
                  {COPILOT_APPS[activeApp].app === "Excel" && (
                    <div>
                      <div className="grid grid-cols-5 gap-0 text-[0.55rem] border border-gray-200">
                        {["Ticker", "EV/EBITDA", "EBITDA", "Growth", "Rating"].map((h) => (
                          <div key={h} className="bg-gray-100 px-1.5 py-1 font-semibold text-gray-700 border-r border-gray-200">{h}</div>
                        ))}
                        {[
                          ["ALIC.CO", "7.2x", "142", "8.1%", "A"],
                          ["EXIT.MX", "9.8x", "89", "12.3%", "BBB"],
                          ["RETL.BR", "6.5x", "234", "5.8%", "A-"],
                          ["CONS.CL", "11.1x", "67", "15.2%", "BB"],
                        ].map((row, i) => (
                          row.map((cell, j) => (
                            <div key={`${i}-${j}`} className={`px-1.5 py-1 border-r border-t border-gray-200 ${j === 1 && parseFloat(cell) > 10 ? "bg-red-50 text-red-700" : "text-gray-800"}`}>{cell}</div>
                          ))
                        ))}
                      </div>
                      <div className="mt-2 p-2 rounded bg-green-50 border border-green-200 text-[0.55rem] text-green-800">
                        <span className="font-bold">✨ Copilot:</span> Detecté 1 outlier (CONS.CL en 11.1x). Mediana: 8.5x, dentro del rango del sector.
                      </div>
                    </div>
                  )}
                  {COPILOT_APPS[activeApp].app === "PowerPoint" && (
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { c: "#D24726", l: "Cover" },
                        { c: "#E85A1F", l: "Thesis" },
                        { c: "#5B52D5", l: "Market" },
                        { c: "#3A7BD5", l: "Comps" },
                        { c: "#00E5A0", l: "DCF" },
                        { c: "#D4AF4C", l: "Risks" },
                        { c: "#9B59B6", l: "Next" },
                        { c: "#22C55E", l: "Close" },
                      ].map((s, i) => (
                        <div key={i} className="aspect-[4/3] rounded border border-gray-300 grid place-items-center font-mono text-[0.55rem] text-gray-700" style={{ background: `${s.c}15` }}>
                          <div className="text-center">
                            <div className="text-gray-400 text-[0.5rem]">{i + 1}/12</div>
                            <div className="font-semibold" style={{ color: s.c }}>{s.l}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {COPILOT_APPS[activeApp].app === "Teams" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 rounded bg-purple-50 border border-purple-200">
                        <div className="w-5 h-5 rounded-full bg-[#6264A7] text-white grid place-items-center text-[0.55rem] font-bold">MR</div>
                        <div className="flex-1">
                          <p className="text-[0.6rem] font-semibold text-gray-900">IC Deal Review · 45 min</p>
                          <p className="text-[0.5rem] text-gray-500">5 participantes · grabado</p>
                        </div>
                        <span className="text-[0.5rem] text-[#6264A7] font-semibold">✨ Summary</span>
                      </div>
                      <div className="rounded bg-gray-50 p-2 text-[0.55rem] text-gray-700">
                        <p className="font-bold mb-1">Action Items (Copilot):</p>
                        <p>• MR: Enviar comps ajustados por multiples normalizados — vie 17</p>
                        <p>• SJ: Solicitar updated Q4 financials al target</p>
                        <p>• AV: Review legal riesgo #3 (exclusividad)</p>
                      </div>
                    </div>
                  )}
                  {COPILOT_APPS[activeApp].app === "Outlook" && (
                    <div className="space-y-1.5">
                      <div className="p-2 rounded border-l-2 border-l-red-500 bg-red-50">
                        <p className="text-[0.55rem] font-semibold text-gray-900">🔴 MD Carlos · Deal memo feedback</p>
                        <p className="text-[0.5rem] text-gray-500">Urgente · requiere respuesta hoy</p>
                      </div>
                      <div className="p-2 rounded border-l-2 border-l-orange-500 bg-orange-50">
                        <p className="text-[0.55rem] font-semibold text-gray-900">🟠 Cliente BTG WM · Update portfolio</p>
                        <p className="text-[0.5rem] text-gray-500">Follow-up del lunes</p>
                      </div>
                      <div className="p-2 rounded border-l-2 border-l-gray-300 bg-gray-50">
                        <p className="text-[0.55rem] font-semibold text-gray-900">⚪ Newsletter Bloomberg · Daily brief</p>
                        <p className="text-[0.5rem] text-gray-500">Baja prioridad</p>
                      </div>
                      <div className="mt-2 p-2 rounded bg-blue-50 border border-blue-200 text-[0.55rem] text-blue-800">
                        <span className="font-bold">✨ Copilot:</span> 47 correos hoy · 5 requieren acción · 2 drafts listos
                      </div>
                    </div>
                  )}
                  {COPILOT_APPS[activeApp].app === "SharePoint" && (
                    <div>
                      <div className="flex gap-1.5 mb-2 items-center">
                        <span className="text-[0.55rem] text-gray-500">🔍</span>
                        <div className="flex-1 h-5 rounded border border-gray-300 bg-gray-50 px-2 text-[0.55rem] text-gray-700 grid items-center">memos Retail LatAm últimos 6 meses</div>
                      </div>
                      {[
                        { name: "IC Memo · Target LatAm", path: "IB/Deals/2026/Q2", date: "2026-04-14" },
                        { name: "Research Retail LatAm", path: "Research/Sector", date: "2026-04-02" },
                        { name: "Comps Retail Q1 2026", path: "IB/Comps", date: "2026-03-28" },
                      ].map((f) => (
                        <div key={f.name} className="flex items-center gap-2 py-1 border-b border-gray-100">
                          <span className="text-[0.55rem]">📄</span>
                          <div className="flex-1">
                            <p className="text-[0.6rem] text-gray-900 font-medium">{f.name}</p>
                            <p className="text-[0.5rem] text-gray-500">{f.path}</p>
                          </div>
                          <span className="text-[0.5rem] text-gray-500 font-mono">{f.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 6B. M365 COPILOT LIVE RIBBON ═══════════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_30%,rgba(0,120,212,0.05),transparent)] pointer-events-none" />

          <div className="relative">
            <p className="font-mono text-[0.72rem] uppercase tracking-widest text-[#3A7BD5] mb-3">Copilot M365 · en vivo</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-4">
              La IA vive donde <span className="bg-gradient-to-r from-[#2B579A] via-[#0078D4] to-[#217346] bg-clip-text text-transparent">ya trabajas</span>
            </h2>
            <p className="text-muted text-[0.95rem] max-w-2xl mb-8">
              Cuatro apps, una licencia. El Copilot lee el contexto del documento o correo abierto y sugiere en el panel derecho. Observa cómo cicla entre Word, Excel, PowerPoint y Outlook.
            </p>

            {/* App switcher tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {M365_APPS.map((app, i) => {
                const active = i === m365Idx;
                return (
                  <button
                    key={app.id}
                    onClick={() => { setM365Idx(i); setM365Line(0); }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-all ${active ? "text-white-f scale-[1.02]" : "text-muted/70 hover:text-white-f"}`}
                    style={{
                      background: active ? `${app.color}22` : "rgba(255,255,255,0.02)",
                      borderColor: active ? `${app.color}66` : "rgba(255,255,255,0.08)",
                    }}
                  >
                    <span
                      className="w-6 h-6 rounded grid place-items-center font-bold text-white text-[0.72rem]"
                      style={{ background: app.color }}
                    >
                      {app.icon}
                    </span>
                    {app.name}
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot ml-1" />}
                  </button>
                );
              })}
            </div>

            {/* App window mockup */}
            <div className="bg-[#1E1E1E] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl shadow-black/30">
              {/* Title bar */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#2D2D30]">
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-sm grid place-items-center font-bold text-white text-[0.6rem]"
                    style={{ background: m365Current.color }}
                  >
                    {m365Current.icon}
                  </div>
                  <span className="text-[0.72rem] text-white/80">{m365Current.doc} — {m365Current.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="w-6 h-6 rounded grid place-items-center text-white/40 hover:bg-white/10 text-[0.7rem]">—</button>
                  <button className="w-6 h-6 rounded grid place-items-center text-white/40 hover:bg-white/10 text-[0.7rem]">□</button>
                  <button className="w-6 h-6 rounded grid place-items-center text-white/40 hover:bg-white/10 text-[0.7rem]">✕</button>
                </div>
              </div>

              {/* Ribbon */}
              <div className="bg-[#252526] border-b border-white/[0.06] px-3 py-1.5 flex items-center gap-4 overflow-hidden">
                <div
                  className="text-[0.65rem] font-semibold px-2 py-0.5 rounded text-white"
                  style={{ background: m365Current.color }}
                >
                  Archivo
                </div>
                {m365Current.ribbon.map((r, i) => (
                  <span key={r} className={`text-[0.65rem] whitespace-nowrap ${i === 0 ? "text-white font-semibold" : "text-white/50"}`}>{r}</span>
                ))}
                <div className="ml-auto flex items-center gap-2 bg-[rgba(0,120,212,0.18)] border border-[#0078D4]/40 rounded-md px-2 py-1">
                  <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[#0078D4] to-[#7B73E8] grid place-items-center text-[0.55rem] font-bold text-white">✦</span>
                  <span className="text-[0.62rem] font-semibold text-white">Copilot</span>
                </div>
              </div>

              {/* Main grid: document area + copilot pane */}
              <div className="grid md:grid-cols-[1.6fr_1fr] min-h-[420px]">
                {/* DOCUMENT AREA */}
                <div className="bg-[#1B1B1C] p-5 border-r border-white/[0.05] overflow-hidden">
                  {m365Current.id === "word" && (
                    <div className="bg-white/95 rounded-sm p-8 text-[#1a1a1a] max-w-[90%] mx-auto shadow-lg min-h-[380px]">
                      <div className="text-center mb-5 pb-3 border-b-2 border-[#2B579A]">
                        <p className="font-mono text-[0.58rem] uppercase tracking-widest text-[#2B579A] mb-1">Investment Committee Memo</p>
                        <h4 className="text-lg font-bold">Adquisición · Cementos Portales</h4>
                        <p className="text-[0.65rem] text-gray-600 mt-0.5">Preparado por: María Ortega · IB Latam · 20-abr-2026</p>
                      </div>
                      <p className="text-[0.72rem] font-bold text-[#2B579A] mb-2 uppercase tracking-wide">Red flags materiales</p>
                      <div className="space-y-2 text-[0.72rem] leading-relaxed">
                        {m365Current.copilotOutput.slice(0, m365Line).map((line, i) => (
                          <div key={i} className="flex gap-2 animate-fadeUp">
                            <span className="font-bold text-[#B7472A]">{i + 1}.</span>
                            <span className="text-gray-800">{line}</span>
                          </div>
                        ))}
                        {m365Line > 0 && m365Line <= m365Current.copilotOutput.length && (
                          <span className="inline-block w-1.5 h-3.5 bg-[#2B579A] animate-blink align-middle" />
                        )}
                      </div>
                    </div>
                  )}

                  {m365Current.id === "excel" && (
                    <div className="bg-[#f3f3f3] rounded-sm text-[#1a1a1a] min-h-[380px]">
                      <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr] text-[0.62rem] font-mono border-b border-[#c0c0c0]">
                        {["", "A", "B", "C", "D"].map((h) => <div key={h} className="bg-[#e6e6e6] text-center py-1 border-r border-[#c0c0c0] font-semibold">{h}</div>)}
                      </div>
                      {[
                        ["1", "Concepto", "2025A", "2026E", "2027E"],
                        ["2", "Revenue", "850,420", "918,454", "982,745"],
                        ["3", "EBITDA", "127,563", "146,872", "157,239"],
                        ["4", "Margen EBITDA", "15.0%", "16.0%", "16.0%"],
                        ["5", "Capex", "(85,042)", "(425,000)", "(98,274)"],
                        ["6", "ΔWorking Cap", "(8,504)", "(12,300)", "(10,810)"],
                        ["7", "FCF", "34,017", "−290,428", "48,155"],
                        ["8", "Crecimiento FCF", "—", "−953%", "↑"],
                      ].map((row, r) => (
                        <div key={r} className={`grid grid-cols-[40px_1fr_1fr_1fr_1fr] text-[0.62rem] font-mono border-b border-[#d0d0d0] ${r === 6 ? "bg-[#fff9c4]" : r === 0 ? "bg-[#e6e6e6]" : "bg-white"}`}>
                          {row.map((c, i) => (
                            <div key={i} className={`text-center py-1 border-r border-[#c0c0c0] ${i === 0 ? "bg-[#e6e6e6] font-semibold" : ""} ${c.includes("−") ? "text-[#B7472A] font-semibold" : ""}`}>{c}</div>
                          ))}
                        </div>
                      ))}
                      <div className="p-3 bg-white border-t border-[#c0c0c0] text-[0.68rem] text-gray-700">
                        <span className="font-semibold text-[#217346]">💡 Copilot: </span>
                        {m365Line > 0 ? m365Current.copilotOutput.slice(0, m365Line).join(" · ") : "Analizando celda B7..."}
                        {m365Line > 0 && m365Line <= m365Current.copilotOutput.length && (
                          <span className="inline-block w-1 h-3 bg-[#217346] animate-blink align-middle ml-1" />
                        )}
                      </div>
                    </div>
                  )}

                  {m365Current.id === "ppt" && (
                    <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e] rounded-sm p-8 shadow-lg min-h-[380px] relative border-4 border-white/95">
                      <div className="absolute top-3 right-3 font-mono text-[0.55rem] text-white/40">7 / 14</div>
                      <div className="absolute top-3 left-3 text-[0.55rem] font-mono uppercase tracking-widest text-white/50">BTG Pactual · Confidential</div>
                      <h3 className="text-2xl font-bold text-white mt-8 mb-6">Red flags materiales</h3>
                      <div className="space-y-3">
                        {["DSO 45 → 78 días", "Covenant 3.42× vs 3.50×", "DIAN: COP 8.2B no provisionados"].map((r, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#B7472A] grid place-items-center text-white font-bold">{i + 1}</div>
                            <p className="text-white text-sm">{r}</p>
                          </div>
                        ))}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md px-3 py-2">
                        <p className="text-[0.55rem] font-mono text-white/60 uppercase mb-1">Speaker notes · generadas por Copilot</p>
                        <p className="text-[0.65rem] text-white/90 leading-snug">
                          {m365Current.copilotOutput.slice(0, m365Line).join(" ")}
                          {m365Line > 0 && m365Line <= m365Current.copilotOutput.length && (
                            <span className="inline-block w-1 h-3 bg-white/60 animate-blink align-middle ml-0.5" />
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {m365Current.id === "outlook" && (
                    <div className="bg-[#fafafa] rounded-sm min-h-[380px] text-[#1a1a1a]">
                      <div className="border-b border-gray-200 px-3 py-2 bg-[#f3f3f3] flex items-center gap-2">
                        <span className="text-[0.7rem] font-semibold">Bandeja de entrada</span>
                        <span className="font-mono text-[0.6rem] text-[#0078D4] bg-[#0078D4]/10 px-2 py-0.5 rounded-full">42 sin leer</span>
                      </div>
                      {[
                        { from: "KPMG · Auditoría", subj: "⚡ Urgente — firma Term Sheet modificado", time: "10:42", unread: true, flag: "#0078D4" },
                        { from: "Legal BTG", subj: "Re: Cláusula earn-out Portales", time: "10:15", unread: true, flag: "#0078D4" },
                        { from: "CFO Cementos Portales", subj: "Respuesta — contingencia DIAN", time: "09:58", unread: true, flag: "#B7472A" },
                        { from: "Nodo EAFIT", subj: "Recordatorio: sesión 5 mañana 8am", time: "08:22", unread: false, flag: null },
                        { from: "Bloomberg Alerts", subj: "Cemex guidance 2026", time: "07:15", unread: false, flag: null },
                      ].map((m, i) => (
                        <div key={i} className={`grid grid-cols-[160px_1fr_60px] gap-3 px-3 py-2 border-b border-gray-200 text-[0.68rem] ${m.unread ? "bg-white font-semibold" : "bg-gray-50 text-gray-600"}`}>
                          <span className="truncate">{m.from}</span>
                          <span className="truncate flex items-center gap-1.5">
                            {m.flag && <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.flag }} />}
                            {m.subj}
                          </span>
                          <span className="text-gray-500 text-right font-mono text-[0.6rem]">{m.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* COPILOT PANE */}
                <div className="bg-[#212122] p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/[0.06]">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0078D4] via-[#5B52D5] to-[#7B73E8] grid place-items-center text-white font-bold text-xs">✦</div>
                    <div className="flex-1">
                      <p className="text-[0.72rem] font-semibold text-white">Copilot</p>
                      <p className="text-[0.58rem] text-white/50">Con contexto de {m365Current.name}</p>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" />
                  </div>

                  {/* User prompt */}
                  <div className="bg-white/5 border border-white/[0.08] rounded-lg rounded-tr-sm p-2.5 mb-3 self-end ml-6 animate-fadeUp">
                    <p className="text-[0.7rem] text-white/90 leading-snug">{m365Current.copilotPrompt}</p>
                  </div>

                  {/* Copilot thinking + response */}
                  <div className="bg-gradient-to-br from-[rgba(0,120,212,0.1)] to-[rgba(91,82,213,0.08)] border border-[#0078D4]/25 rounded-lg rounded-tl-sm p-3 flex-1 min-h-[160px]">
                    {m365Line === 0 && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0078D4] animate-pulse-dot" style={{ animationDelay: "0s" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0078D4] animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0078D4] animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
                        <span className="text-[0.6rem] text-white/60 ml-1">Leyendo {m365Current.name}…</span>
                      </div>
                    )}
                    <div className="space-y-2 text-[0.68rem] text-white/90 leading-relaxed">
                      {m365Current.copilotOutput.slice(0, m365Line).map((line, i) => (
                        <div key={i} className="flex gap-2 animate-fadeUp">
                          <span className="text-[#0078D4] font-bold">•</span>
                          <span>{line}</span>
                        </div>
                      ))}
                      {m365Line > 0 && m365Line < m365Current.copilotOutput.length && (
                        <span className="inline-block w-1 h-3 bg-[#0078D4] animate-blink align-middle ml-1" />
                      )}
                    </div>
                  </div>

                  {/* Suggestion chips */}
                  <div className="mt-3 space-y-1.5">
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest text-white/40 mb-1">Sugerencias</p>
                    {m365Current.suggestions.map((s) => (
                      <button key={s} className="w-full text-left px-2.5 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-md text-[0.62rem] text-white/80 transition-all">
                        <span className="text-[#0078D4] mr-1">✦</span> {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Valor M365 */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { k: "Cero migración", v: "Vive en tu M365 actual", c: "#0078D4" },
                { k: "Respeta permisos", v: "Sensitivity labels + DLP", c: "#2B579A" },
                { k: "Contexto tenant", v: "Lee tus correos y docs", c: "#217346" },
                { k: "Licencia E5", v: "Incluido sin costo extra", c: "#B7472A" },
              ].map((s) => (
                <div key={s.k} className="bg-[#0F1438] border border-white/[0.06] rounded-xl p-3">
                  <p className="font-mono text-[0.55rem] uppercase tracking-wider mb-1" style={{ color: s.c }}>{s.k}</p>
                  <p className="text-[0.75rem] font-semibold text-white-f">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 7. BRIEFING WORKFLOW ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-3">Orquestación</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            Un briefing de inversión <span className="bg-gradient-to-r from-cyan to-purple-light bg-clip-text text-transparent">en 90 minutos</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10">
            Las 3 herramientas no compiten — se orquestan. Este es el flujo realista que un equipo BTG puede seguir un lunes por la mañana antes de un IC del jueves.
          </p>

          <div className="space-y-3">
            {BRIEFING_WORKFLOW.map((w, i) => (
              <div
                key={w.tool}
                className="rounded-2xl p-5 border transition-all flex gap-5 items-start"
                style={{
                  background: i === wfStep ? `${w.color}12` : "#151A3A",
                  borderColor: i === wfStep ? `${w.color}60` : "rgba(255,255,255,0.06)",
                  transform: i === wfStep ? "translateX(6px)" : "none",
                }}
              >
                <div className="w-12 h-12 rounded-xl grid place-items-center text-2xl shrink-0" style={{
                  background: `${w.color}20`,
                  color: w.color,
                }}>
                  {w.icon}
                </div>
                <div className="flex-1 grid md:grid-cols-[1fr_1.5fr_1.5fr] gap-4 items-start">
                  <div>
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted">Paso {i + 1}</p>
                    <p className="text-base font-bold text-white-f leading-tight">{w.tool}</p>
                    <p className="font-mono text-[0.65rem] mt-1" style={{ color: w.color }}>{w.role}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted mb-1">Acción</p>
                    <p className="text-xs text-white-f leading-snug italic">{w.action}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted mb-1">Output</p>
                    <p className="text-xs text-white-f leading-snug">{w.output}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 8. DECISION MATRIX ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-3">Matriz de decisión</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            ¿Cuál abro <span className="bg-gradient-to-r from-orange to-purple bg-clip-text text-transparent">según el caso</span>?
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10">
            Una cheat sheet para elegir la herramienta correcta en el momento correcto. No hay un ganador absoluto — hay usos óptimos.
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            {DECISION_MATRIX.map((d, i) => (
              <div key={i} className="bg-[#151A3A] border border-white/[0.06] rounded-xl p-4 transition-all hover:scale-[1.01]" style={{
                borderLeftColor: d.color,
                borderLeftWidth: 3,
              }}>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-1">Escenario</p>
                <p className="text-sm font-semibold text-white-f leading-snug mb-2">{d.scenario}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">→ Tool:</span>
                  <span className="text-xs font-bold" style={{ color: d.color }}>{d.tool}</span>
                </div>
                <p className="text-[0.7rem] text-muted leading-snug italic">{d.why}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 9. TALLER ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-10">
            <div>
              <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-3">Taller final · 20 min</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white-f leading-tight mb-4">
                Briefing sectorial + <span className="bg-gradient-to-r from-cyan to-purple-light bg-clip-text text-transparent">pitch ejecutivo</span>
              </h2>
              <p className="text-muted mb-6 leading-relaxed">
                Usas los tres — NotebookLM, Gemini y Copilot — en un flujo real. Sales con un briefing + podcast + pitch deck listos para un IC ficticio.
              </p>

              <div className="bg-gradient-to-br from-blue/10 to-purple-light/10 border border-blue/30 rounded-2xl p-5 mb-4">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-blue mb-2">Entregable</p>
                <p className="text-white-f leading-relaxed">
                  1 notebook con 5+ fuentes · 1 audio overview · 1 briefing en Docs/Word · 1 pitch de 6 slides + decisión de ecosistema con argumento.
                </p>
              </div>

              <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-5">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-cyan mb-2">Pregunta guía</p>
                <p className="text-white-f leading-relaxed italic">
                  &quot;Si mañana BTG tuviera que estandarizar en UN solo ecosistema para el equipo de research + IB: ¿Google o Microsoft? Defiende tu respuesta con 3 argumentos.&quot;
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {TALLER_STEPS.map((s) => (
                <div key={s.n} className="flex gap-4 bg-[#151A3A] border border-white/[0.06] rounded-2xl p-4">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue to-purple-light flex items-center justify-center shrink-0">
                    <span className="text-white-f font-bold text-sm">{s.n}</span>
                  </div>
                  <div>
                    <p className="text-white-f font-semibold text-sm">{s.title}</p>
                    <p className="text-xs text-muted mt-1">{s.desc}</p>
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
