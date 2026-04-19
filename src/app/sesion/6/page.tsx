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

/* ════════════════════════════ COMPONENT ════════════════════════════ */

export default function Sesion6() {
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
            Módulo 02 &middot; Herramientas &middot; Sesión 6 de 5+
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
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-6">Agenda &middot; Sesión 6</p>
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

          {/* Versus tabs */}
          <div className="grid md:grid-cols-2 gap-3 mb-6">
            {ECOSYSTEMS.map((e) => (
              <button
                key={e.id}
                onClick={() => setActiveEcosystem(e.id)}
                className="text-left rounded-2xl p-5 border transition-all"
                style={{
                  background: activeEcosystem === e.id ? `${e.color}15` : "#151A3A",
                  borderColor: activeEcosystem === e.id ? `${e.color}60` : "rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{e.icon}</span>
                  <div>
                    <p className="text-xl font-bold text-white-f">{e.name}</p>
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">Anclado a: {e.ground}</p>
                  </div>
                </div>
                <p className="text-sm italic leading-relaxed" style={{ color: e.color }}>&quot;{e.killer}&quot;</p>
              </button>
            ))}
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

          {/* Audio Overview showcase */}
          <div className="mt-8 bg-gradient-to-br from-orange/10 to-cyan/10 border border-orange/30 rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange to-red grid place-items-center text-2xl shrink-0">🎙</div>
              <div className="flex-1">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-orange mb-1">Feature killer · Audio Overview</p>
                <p className="text-white-f text-lg leading-snug mb-3">
                  Dos hosts AI conversan sobre <em>tus</em> fuentes durante 10–20 min. Se interrumpen, se corrigen, introducen analogías. Suena como un podcast profesional.
                </p>
                <div className="flex items-center gap-3 bg-[#0D1229] rounded-full px-4 py-2.5 border border-orange/20">
                  <span className="w-3 h-3 rounded-full bg-orange animate-pulse-dot" />
                  <p className="font-mono text-xs text-white-f">▶ Host A: &quot;So let&apos;s dive in — this is fascinating stuff about the target&apos;s cash flow profile...&quot;</p>
                  <p className="font-mono text-[0.65rem] text-muted ml-auto">14:32</p>
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
            <div className="p-6 md:p-8 grid md:grid-cols-[1.5fr_1fr] gap-6">
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-3">Prompts que funcionan</p>
                <div className="space-y-2">
                  {COPILOT_APPS[activeApp].examples.map((p, i) => (
                    <div key={i} className="bg-[#151A3A] border border-white/[0.06] rounded-lg px-4 py-3 font-mono text-xs text-white-f leading-relaxed">
                      {p}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br rounded-xl p-4 border" style={{
                background: `linear-gradient(135deg, ${COPILOT_APPS[activeApp].color}15, transparent)`,
                borderColor: `${COPILOT_APPS[activeApp].color}30`,
              }}>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-2" style={{ color: COPILOT_APPS[activeApp].color }}>Aplicación BTG</p>
                <p className="text-sm text-white-f leading-relaxed italic">{COPILOT_APPS[activeApp].btg}</p>
              </div>
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
