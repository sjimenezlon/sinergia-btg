"use client";

import { useState, useEffect, useMemo } from "react";
import RevealSection from "@/components/RevealSection";

/* ════════════════════════════ DATA ════════════════════════════ */

const AGENDA = [
  { time: "0:00–0:15", label: "Caso: Analista M&A 3× más rápido", color: "#00E5A0" },
  { time: "0:15–0:40", label: "Anatomía del asistente profesional", color: "#5B52D5" },
  { time: "0:40–1:05", label: "Claude Projects + Artifacts", color: "#E85A1F" },
  { time: "1:05–1:25", label: "Custom GPTs + Code Interpreter", color: "#3A7BD5" },
  { time: "1:25–1:45", label: "Taller: Asistente DD M&A", color: "#D4AF4C" },
  { time: "1:45–2:00", label: "Pitch + entrega", color: "#22C55E" },
];

const ASSISTANT_LAYERS = [
  {
    id: "model",
    layer: "1 · Modelo base",
    title: "El cerebro razonante",
    desc: "El LLM que piensa: Claude 4.6 Opus, GPT-5.4, Gemini 3.1. Decide la calidad del análisis, la latencia y el costo por token.",
    finance: "Para due diligence en M&A: Claude Opus (1M ctx + Extended Thinking). Para modelación cuantitativa: GPT-5.4 o o3.",
    color: "#E85A1F",
    icon: "◉",
  },
  {
    id: "knowledge",
    layer: "2 · Knowledge base",
    title: "La biblioteca permanente",
    desc: "Los documentos que el modelo consulta en cada conversación: normativa SFC, memos internos, modelos financieros, tesis de inversión.",
    finance: "Un Project de Claude con 40 PDFs del data room del target + term sheets + research sectorial = cerebro con memoria documental.",
    color: "#5B52D5",
    icon: "◆",
  },
  {
    id: "instructions",
    layer: "3 · Custom instructions",
    title: "El manual de operación",
    desc: "Reglas persistentes que el modelo sigue en cada respuesta: rol, tono, formato, restricciones de privacidad, output template.",
    finance: "\"Actúa como analista senior de M&A BTG. No menciones datos de clientes. Responde en formato memo con secciones: tesis / riesgos / comparables.\"",
    color: "#3A7BD5",
    icon: "◈",
  },
  {
    id: "tools",
    layer: "4 · Tools / conectores",
    title: "Las manos del asistente",
    desc: "Habilidades que puede invocar: Code Interpreter (Python), búsqueda web, MCP a bases de datos, Artifacts, generación de imágenes.",
    finance: "Sube un Excel de comparables → corre Python → calcula múltiplos promedio → genera gráfico → devuelve memo. Todo en un turno.",
    color: "#00E5A0",
    icon: "⚡",
  },
  {
    id: "memory",
    layer: "5 · Memoria persistente",
    title: "La biografía del usuario",
    desc: "Lo que el modelo aprende sobre ti entre sesiones: clientes clave, formatos preferidos, estilo de redacción, errores del pasado.",
    finance: "El asistente ya sabe que tus memos usan 4 secciones, que Colfondos es un cliente prioritario, y que nunca incluyas cifras no auditadas.",
    color: "#D4AF4C",
    icon: "★",
  },
  {
    id: "output",
    layer: "6 · Surface de entrega",
    title: "Dónde aparece el resultado",
    desc: "Artifacts (documento vivo), Canvas (editor colaborativo), chat plano, export a Word/PDF, o push a Slack/Teams.",
    finance: "El memo final no llega como texto en el chat — llega como Artifact editable, versionable, con el formato corporativo BTG listo para enviar.",
    color: "#9B59B6",
    icon: "▣",
  },
];

const CLAUDE_PROJECT_STAGES = [
  {
    stage: "Crear",
    title: "Abrir un Project por mandato",
    body: "Sidebar → Projects → New. Nombre: 'M&A · Target LatAm Retail Q2'. Un Project por cada operación activa — no mezcles data rooms.",
    visual: "◉",
    tip: "Regla BTG: nombre = código de proyecto + fecha. Facilita auditoría.",
    color: "#E85A1F",
  },
  {
    stage: "Cargar",
    title: "Subir el data room",
    body: "Drag & drop hasta 200K tokens de docs: CIM, modelo financiero, term sheet, legal opinion, audits últimos 3 años, contratos materiales.",
    visual: "📁",
    tip: "PDFs escaneados con OCR funcionan. Excel se convierte a CSV internamente.",
    color: "#5B52D5",
  },
  {
    stage: "Instruir",
    title: "Custom instructions del Project",
    body: "\"Rol: analista senior IB. Audiencia: MD y equipo deal. Cada respuesta incluye: tesis, riesgos identificados, fuentes citadas con página.\"",
    visual: "▣",
    tip: "El modelo citará sección y página del documento fuente. Auditable.",
    color: "#3A7BD5",
  },
  {
    stage: "Dialogar",
    title: "Conversar como con un MD",
    body: "\"¿Cuáles son los 3 riesgos macro del target en el último audit?\", \"Compara múltiplos EBITDA con los 5 comps del sector\", \"Redacta sección de riesgos del IC memo\".",
    visual: "💬",
    tip: "Si el Project está bien cargado, no necesitas repetir contexto jamás.",
    color: "#00E5A0",
  },
  {
    stage: "Generar",
    title: "Artifacts como output",
    body: "Pide: 'genera el IC memo completo como Artifact'. El documento aparece en panel lateral, editable, con versiones, listo para exportar a Word.",
    visual: "⚡",
    tip: "Artifacts viven dentro del Project — se actualizan con la conversación.",
    color: "#D4AF4C",
  },
  {
    stage: "Recordar",
    title: "Memory + continuidad",
    body: "Semanas después, al abrir el Project, Claude recuerda el tono del equipo, los riesgos ya identificados, y el estilo del memo. Cero re-onboarding.",
    visual: "★",
    tip: "Si cambias MD responsable, edita memory → nuevo estilo sin perder data.",
    color: "#9B59B6",
  },
];

const ARTIFACT_TYPES = [
  {
    type: "Memo / Documento",
    use: "IC memos, notas de research, term sheets iniciales, due diligence reports.",
    example: "Memo de inversión de 8 páginas con tesis, mercado, financials, riesgos.",
    icon: "📄",
    color: "#E85A1F",
  },
  {
    type: "Dashboard interactivo",
    use: "Deal trackers, pipelines, comparación de comps, portfolio views.",
    example: "Dashboard React con tablas filtrables de 20 comps + gráficos de múltiplos.",
    icon: "📊",
    color: "#5B52D5",
  },
  {
    type: "Código ejecutable",
    use: "Modelación DCF, Monte Carlo, scrapers, conectores a APIs de mercado.",
    example: "Notebook Python que calcula VPN de 3 escenarios con sensibilidades.",
    icon: "⌨",
    color: "#3A7BD5",
  },
  {
    type: "Visualización",
    use: "Charts, diagramas de flujo de deal, timelines, waterfall DCF.",
    example: "Gráfico waterfall que descompone EV → Equity value con los 6 ajustes.",
    icon: "📈",
    color: "#00E5A0",
  },
  {
    type: "Presentación",
    use: "Investment committees, pitch decks, roadshows, board materials.",
    example: "Slides HTML de 12 páginas con tesis, waterfall y comps — editables.",
    icon: "🎯",
    color: "#D4AF4C",
  },
  {
    type: "Formulario / Herramienta",
    use: "Calculadoras, formularios KYC, checklists de compliance.",
    example: "Calculadora DCF interactiva con sliders de WACC y terminal growth.",
    icon: "▣",
    color: "#9B59B6",
  },
];

const GPT_BLUEPRINT = [
  {
    step: "1 · Identity",
    field: "Name & description",
    content: "BTG DD Analyst v1",
    detail: "Nombre corto. La descripción define el 'contrato' del GPT: qué hace y qué NO hace.",
    color: "#E85A1F",
  },
  {
    step: "2 · Instructions",
    field: "System prompt (hasta 8K caracteres)",
    content: "Rol: analista DD para M&A LatAm. Todas las respuestas estructuradas: TESIS / RIESGOS / COMPS / NEXT STEPS. Cita siempre el documento fuente y la página. Nunca inventes cifras. Si no hay fuente, responde: 'no disponible en el data room'.",
    detail: "El system prompt es el ADN. Aquí defines tono, restricciones, formato y safeguards.",
    color: "#5B52D5",
  },
  {
    step: "3 · Knowledge",
    field: "Files subidos al GPT",
    content: "20 PDFs del data room + templates BTG de IC memo + manual interno de comps.",
    detail: "Hasta 20 archivos. Se indexan vectorialmente y el GPT los consulta por similitud.",
    color: "#3A7BD5",
  },
  {
    step: "4 · Capabilities",
    field: "Tools habilitadas",
    content: "Code Interpreter: ON (para análisis Excel) · Web browsing: OFF (no queremos mezclar con web) · DALL·E: OFF · File search: ON",
    detail: "Cada capability tiene implicación de privacidad. En finanzas: apagar browsing por defecto.",
    color: "#00E5A0",
  },
  {
    step: "5 · Actions",
    field: "APIs externas (opcional)",
    content: "Action custom → API interna de BTG para consultar comps históricos tokenizados.",
    detail: "Via OpenAPI spec, el GPT puede llamar APIs con auth. Power user.",
    color: "#D4AF4C",
  },
  {
    step: "6 · Share",
    field: "Distribución",
    content: "Solo 'Only me' durante pruebas → 'Anyone with a link' para equipo → Business workspace para compartir interno.",
    detail: "En plan Business: los GPTs del workspace quedan gobernados con zero-retention.",
    color: "#9B59B6",
  },
];

const CODE_INTERPRETER_CASES = [
  {
    caso: "Análisis de comparables",
    input: "Excel con 15 transacciones del sector",
    prompt: "\"Calcula la media y mediana de EV/EBITDA, excluye outliers (IQR 1.5), genera boxplot.\"",
    output: "Tabla limpia + boxplot + resumen: 'Mediana 8.2x, rango 6.1–11.3x tras limpieza'.",
    time: "45 seg",
    value: "Sustituye 2 horas de Excel manual",
    color: "#E85A1F",
  },
  {
    caso: "Extracción de datos de PDFs",
    input: "PDF de earnings call transcript (120 pág)",
    prompt: "\"Extrae todas las guidance numéricas por segmento y arma tabla comparativa con Q anterior.\"",
    output: "CSV con 24 filas · 6 columnas · comparación Q-o-Q · %Δ calculado.",
    time: "2 min",
    value: "Sustituye 3–4 horas de lectura + copia manual",
    color: "#5B52D5",
  },
  {
    caso: "DCF con sensibilidades",
    input: "Assumptions base + ranges de WACC y g",
    prompt: "\"Corre DCF con WACC 8–12%, g 2–4%, genera matriz de sensibilidad y tornado chart.\"",
    output: "Matriz 5×5 de enterprise values + tornado chart con 8 drivers clave.",
    time: "90 seg",
    value: "Sustituye 2 horas en Excel con FO arrays",
    color: "#3A7BD5",
  },
  {
    caso: "Limpieza de portafolio",
    input: "Excel con 1,200 posiciones y tickers mal formateados",
    prompt: "\"Normaliza tickers, agrupa por sector GICS, calcula exposición por país.\"",
    output: "Dataset limpio + tabla pivote de exposición + gráfico stacked bar.",
    time: "3 min",
    value: "Sustituye medio día de data wrangling",
    color: "#00E5A0",
  },
];

const DD_WORKFLOW = [
  {
    fase: "1 · Ingesta",
    task: "Cargar data room completo al Project",
    tool: "Claude Projects",
    time: "10 min",
    output: "Knowledge base indexada con 40 PDFs + 8 Excels",
    color: "#E85A1F",
  },
  {
    fase: "2 · Mapeo",
    task: "Generar tabla de contenido del data room con lagunas",
    tool: "Claude + Artifacts",
    time: "5 min",
    output: "Tabla con docs presentes / faltantes / prioridad de request",
    color: "#5B52D5",
  },
  {
    fase: "3 · Red flags",
    task: "Identificar riesgos legales, financieros y operacionales",
    tool: "Extended Thinking",
    time: "15 min",
    output: "Lista priorizada de 12 red flags con cita a documento fuente",
    color: "#3A7BD5",
  },
  {
    fase: "4 · Comps",
    task: "Armar tabla de 8 comparables con múltiplos normalizados",
    tool: "Code Interpreter",
    time: "20 min",
    output: "Excel con comps + múltiplos + valoración implícita del target",
    color: "#00E5A0",
  },
  {
    fase: "5 · Memo",
    task: "Redactar IC memo preliminar estilo BTG",
    tool: "Claude + Artifacts",
    time: "25 min",
    output: "Memo de 10 páginas listo para review del MD",
    color: "#D4AF4C",
  },
  {
    fase: "6 · Q&A",
    task: "Sesión de preguntas del IC con el asistente",
    tool: "Claude Projects",
    time: "continua",
    output: "El asistente responde en vivo durante la reunión con citas",
    color: "#9B59B6",
  },
];

const TOOL_COMPARE = [
  {
    name: "Claude Projects",
    icon: "◉",
    color: "#E85A1F",
    scores: { finance: 5, docs: 5, code: 4, collab: 4, privacy: 5, cost: 3 },
    best: "Due diligence, compliance, documentos largos, memory persistente.",
  },
  {
    name: "ChatGPT Custom GPTs",
    icon: "◈",
    color: "#22C55E",
    scores: { finance: 4, docs: 4, code: 5, collab: 3, privacy: 3, cost: 4 },
    best: "Modelación financiera con Code Interpreter, custom GPTs compartibles.",
  },
  {
    name: "Gemini Gems",
    icon: "◆",
    color: "#3A7BD5",
    scores: { finance: 3, docs: 5, code: 3, collab: 5, privacy: 4, cost: 5 },
    best: "Research multi-fuente, integración Workspace, volúmenes masivos.",
  },
  {
    name: "Copilot M365",
    icon: "🏢",
    color: "#7B73E8",
    scores: { finance: 3, docs: 4, code: 2, collab: 5, privacy: 5, cost: 2 },
    best: "Dentro de Office/Outlook/Teams, workflows corporativos sin salir de app.",
  },
];

const SCORE_LABELS: Record<keyof typeof TOOL_COMPARE[0]["scores"], string> = {
  finance: "Finanzas",
  docs: "Docs largos",
  code: "Código",
  collab: "Colaboración",
  privacy: "Privacidad",
  cost: "Costo",
};

const TALLER_STEPS = [
  { n: 1, title: "Elige el target", desc: "Usa un caso real o ficticio: LatAm retail, fintech, o sector que conozcas." },
  { n: 2, title: "Crea Project o GPT", desc: "Claude Projects si tienes Pro, o Custom GPT en ChatGPT." },
  { n: 3, title: "Sube 3–5 documentos", desc: "Data room simulado: CIM, estados financieros, comps sector." },
  { n: 4, title: "Instrucciones DD", desc: "System prompt estilo analista senior BTG con formato IC memo." },
  { n: 5, title: "Genera red flags", desc: "Pide los 5 top riesgos con cita al documento fuente." },
  { n: 6, title: "IC memo Artifact", desc: "Genera memo de 6 páginas como Artifact editable." },
  { n: 7, title: "Pitch 90 seg", desc: "Presenta al equipo: tesis + cómo el asistente aceleró el proceso." },
];

/* ════════════════════════════ COMPONENT ════════════════════════════ */

export default function Sesion5() {
  const [activeLayer, setActiveLayer] = useState<string>("model");
  const [activeStage, setActiveStage] = useState<number>(0);
  const [activeArtifact, setActiveArtifact] = useState<number>(0);
  const [gptStep, setGptStep] = useState<number>(0);
  const [activeCase, setActiveCase] = useState<number>(0);
  const [activeCompare, setActiveCompare] = useState<number>(0);

  /* Hero counter */
  const [heroCount, setHeroCount] = useState(0);
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => { i++; setHeroCount(i); if (i >= 5) clearInterval(iv); }, 200);
    return () => clearInterval(iv);
  }, []);

  /* Auto-advance workflow */
  const [wfStep, setWfStep] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setWfStep((s) => (s + 1) % DD_WORKFLOW.length), 2500);
    return () => clearInterval(iv);
  }, []);

  const activeLayerData = useMemo(() => ASSISTANT_LAYERS.find((l) => l.id === activeLayer)!, [activeLayer]);

  return (
    <div className="min-h-screen bg-[#080C1F]">
      {/* ═══════════════ 1. HERO ═══════════════ */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden">
        <div className="hero-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_40%,rgba(232,90,31,0.08),transparent),radial-gradient(ellipse_40%_50%_at_70%_60%,rgba(91,82,213,0.07),transparent)] pointer-events-none" />

        {/* Floating doc icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {["📄","📊","⌨","🎯","⚡","◉","📈","▣"].map((icon, i) => (
            <div key={i} className="absolute animate-float text-2xl opacity-[0.08]" style={{
              left: `${8 + i * 11}%`, top: `${15 + (i % 4) * 22}%`,
              animationDelay: `${i * 0.6}s`, animationDuration: `${3 + i * 0.4}s`,
            }}>{icon}</div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-4 animate-fadeUp">
            Módulo 02 &middot; Herramientas &middot; Sesión 5 de 5
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white-f leading-tight mb-6 animate-fadeUp-1">
            Asistentes IA para{" "}
            <span className="bg-gradient-to-r from-orange to-purple bg-clip-text text-transparent">
              finanzas profesionales
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 animate-fadeUp-2">
            De un chat genérico a un analista 24/7 con memoria, knowledge base y superpoderes de Code Interpreter.
            Proyectos, Artifacts, Custom GPTs y flujos de due diligence M&A.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fadeUp-3">
            {[
              { val: heroCount >= 1 ? "6" : "—", label: "Capas asistente", icon: "◆", color: "#E85A1F" },
              { val: heroCount >= 2 ? "1M" : "—", label: "Tokens Claude", icon: "◉", color: "#5B52D5" },
              { val: heroCount >= 3 ? "6" : "—", label: "Tipos Artifact", icon: "▣", color: "#3A7BD5" },
              { val: heroCount >= 4 ? "3×" : "—", label: "Speed DD", icon: "⚡", color: "#00E5A0" },
              { val: heroCount >= 5 ? "4" : "—", label: "Plataformas", icon: "🎯", color: "#D4AF4C" },
            ].map((s) => (
              <div key={s.label} className="bg-[#151A3A] border rounded-2xl px-5 py-3 min-w-[110px] transition-all hover:scale-105" style={{ borderColor: `${s.color}25` }}>
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

      {/* ═══════════════ 3. CASO DE ENTRADA ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-8 items-center">
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-cyan mb-3">Caso real · Banca de inversión 2026</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white-f leading-tight mb-4">
                El analista que hace en <span className="text-cyan">2 horas</span> lo que antes tomaba <span className="text-orange">2 días</span>
              </h2>
              <p className="text-muted text-base leading-relaxed mb-4">
                Un asociado de IB en LatAm recibe el data room del target un viernes 6pm. Históricamente, le tomaría todo el fin de semana leer los 40 PDFs, extraer KPIs, armar comps y redactar el primer draft del memo.
              </p>
              <p className="text-white-f text-base leading-relaxed mb-4">
                En 2026, carga todo el data room a un <span className="text-orange font-semibold">Claude Project</span>, instruye el asistente con el template BTG, y en 2 horas tiene: red flags identificados con cita a página, tabla de 8 comps normalizada vía Code Interpreter, y un IC memo preliminar como Artifact listo para review.
              </p>
              <p className="text-cyan text-sm italic">
                No reemplaza al analista — le da tiempo para pensar la tesis en vez de copiar datos.
              </p>
            </div>
            <div className="bg-[#0D1229] border border-cyan/20 rounded-2xl p-6 glow-cyan">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-cyan mb-4">Time allocation · antes vs ahora</p>
              {[
                { task: "Lectura + data entry", before: 70, after: 10, color: "#E85A1F" },
                { task: "Análisis + comps", before: 20, after: 25, color: "#5B52D5" },
                { task: "Redacción memo", before: 10, after: 20, color: "#3A7BD5" },
                { task: "Tesis + judgment", before: 0, after: 45, color: "#00E5A0" },
              ].map((b) => (
                <div key={b.task} className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white-f">{b.task}</span>
                    <span className="font-mono text-muted">
                      <span className="line-through opacity-50">{b.before}%</span>{" "}
                      <span style={{ color: b.color }}>→ {b.after}%</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div className="h-full transition-all duration-[1200ms]" style={{ width: `${b.after}%`, background: b.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 4. ANATOMÍA DEL ASISTENTE ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-3">Anatomía</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            Las <span className="bg-gradient-to-r from-orange to-purple bg-clip-text text-transparent">6 capas</span> de un asistente profesional
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10">
            Un &quot;chat IA&quot; es solo la punta del iceberg. Lo que convierte un modelo genérico en un <em>analista confiable</em> son las capas que lo rodean.
          </p>

          <div className="grid md:grid-cols-[1fr_1.5fr] gap-6">
            {/* Left: stack of layers */}
            <div className="space-y-2">
              {ASSISTANT_LAYERS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLayer(l.id)}
                  className="w-full text-left rounded-xl p-4 border transition-all flex items-center gap-3"
                  style={{
                    background: activeLayer === l.id ? `${l.color}15` : "#151A3A",
                    borderColor: activeLayer === l.id ? `${l.color}60` : "rgba(255,255,255,0.06)",
                  }}
                >
                  <span className="text-2xl" style={{ color: l.color }}>{l.icon}</span>
                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted">{l.layer}</p>
                    <p className="text-sm font-semibold text-white-f">{l.title}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Right: detail */}
            <div className="bg-[#0D1229] border rounded-2xl p-6 md:p-8 sticky top-20 self-start" style={{ borderColor: `${activeLayerData.color}30` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl grid place-items-center text-3xl" style={{ background: `${activeLayerData.color}18`, color: activeLayerData.color }}>
                  {activeLayerData.icon}
                </div>
                <div>
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest" style={{ color: activeLayerData.color }}>{activeLayerData.layer}</p>
                  <h3 className="text-2xl font-bold text-white-f">{activeLayerData.title}</h3>
                </div>
              </div>
              <p className="text-white-f mb-4 leading-relaxed">{activeLayerData.desc}</p>
              <div className="border-t border-white/[0.06] pt-4">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-2">Aplicación BTG</p>
                <p className="text-sm text-white-f italic leading-relaxed">{activeLayerData.finance}</p>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 5. CLAUDE PROJECT STAGES ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-3">Claude Projects</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            El flujo <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">6 pasos</span> para tu primer Project
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10">
            De data room en disco local a un asistente DD funcional en 45 minutos.
          </p>

          {/* Stage tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CLAUDE_PROJECT_STAGES.map((s, i) => (
              <button
                key={s.stage}
                onClick={() => setActiveStage(i)}
                className="flex-1 min-w-[100px] rounded-xl px-3 py-3 border transition-all text-left"
                style={{
                  background: activeStage === i ? `${s.color}15` : "#151A3A",
                  borderColor: activeStage === i ? `${s.color}60` : "rgba(255,255,255,0.06)",
                }}
              >
                <p className="font-mono text-[0.55rem] uppercase tracking-wider text-muted">Paso {i + 1}</p>
                <p className="text-sm font-bold text-white-f mt-1">{s.stage}</p>
              </button>
            ))}
          </div>

          <div className="bg-[#0D1229] border rounded-2xl overflow-hidden" style={{ borderColor: `${CLAUDE_PROJECT_STAGES[activeStage].color}30` }}>
            <div className="grid md:grid-cols-[1.5fr_1fr]">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg grid place-items-center text-2xl" style={{
                    background: `${CLAUDE_PROJECT_STAGES[activeStage].color}18`,
                    color: CLAUDE_PROJECT_STAGES[activeStage].color,
                  }}>
                    {CLAUDE_PROJECT_STAGES[activeStage].visual}
                  </div>
                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest" style={{ color: CLAUDE_PROJECT_STAGES[activeStage].color }}>
                      {CLAUDE_PROJECT_STAGES[activeStage].stage}
                    </p>
                    <h3 className="text-xl font-bold text-white-f">{CLAUDE_PROJECT_STAGES[activeStage].title}</h3>
                  </div>
                </div>
                <p className="text-white-f leading-relaxed mb-4">{CLAUDE_PROJECT_STAGES[activeStage].body}</p>
                <div className="bg-cyan/5 border border-cyan/20 rounded-lg px-4 py-3">
                  <p className="font-mono text-[0.6rem] uppercase tracking-wider text-cyan mb-1">Tip BTG</p>
                  <p className="text-sm text-white-f">{CLAUDE_PROJECT_STAGES[activeStage].tip}</p>
                </div>
              </div>
              <div className="p-6 md:p-8 border-l border-white/[0.04]" style={{ background: `linear-gradient(135deg, ${CLAUDE_PROJECT_STAGES[activeStage].color}08, transparent)` }}>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-4">Progreso</p>
                <div className="space-y-2">
                  {CLAUDE_PROJECT_STAGES.map((s, i) => (
                    <div key={s.stage} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 grid place-items-center text-[0.65rem] font-mono shrink-0" style={{
                        borderColor: i <= activeStage ? s.color : "rgba(255,255,255,0.1)",
                        background: i <= activeStage ? `${s.color}25` : "transparent",
                        color: i <= activeStage ? s.color : "#7a82a0",
                      }}>
                        {i < activeStage ? "✓" : i + 1}
                      </div>
                      <p className={`text-xs ${i === activeStage ? "text-white-f font-semibold" : "text-muted"}`}>{s.stage}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 6. ARTIFACTS ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-3">Artifacts</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            El output ya no es <span className="line-through text-muted">texto en el chat</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10">
            Los <span className="text-white-f">Artifacts</span> son documentos vivos que aparecen en panel lateral: memos, dashboards, código ejecutable, charts, presentaciones. Versionables, editables, exportables.
          </p>

          <div className="grid md:grid-cols-3 gap-3 mb-6">
            {ARTIFACT_TYPES.map((a, i) => (
              <button
                key={a.type}
                onClick={() => setActiveArtifact(i)}
                className="text-left rounded-2xl p-5 border transition-all"
                style={{
                  background: activeArtifact === i ? `${a.color}15` : "#151A3A",
                  borderColor: activeArtifact === i ? `${a.color}60` : "rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{a.icon}</span>
                  <p className="text-sm font-bold text-white-f">{a.type}</p>
                </div>
                <p className="text-xs text-muted leading-relaxed">{a.use}</p>
              </button>
            ))}
          </div>

          <div className="bg-[#0D1229] border rounded-2xl p-6 md:p-8" style={{ borderColor: `${ARTIFACT_TYPES[activeArtifact].color}30` }}>
            <div className="grid md:grid-cols-[1fr_1.5fr] gap-6 items-center">
              <div className="text-center py-8 rounded-xl" style={{ background: `linear-gradient(135deg, ${ARTIFACT_TYPES[activeArtifact].color}20, transparent)` }}>
                <div className="text-7xl mb-3">{ARTIFACT_TYPES[activeArtifact].icon}</div>
                <p className="font-mono text-xs uppercase tracking-widest" style={{ color: ARTIFACT_TYPES[activeArtifact].color }}>
                  {ARTIFACT_TYPES[activeArtifact].type}
                </p>
              </div>
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-2">Ejemplo BTG</p>
                <p className="text-white-f text-lg leading-relaxed mb-4">{ARTIFACT_TYPES[activeArtifact].example}</p>
                <div className="border-t border-white/[0.06] pt-4">
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-2">Cuándo usarlo</p>
                  <p className="text-sm text-muted leading-relaxed">{ARTIFACT_TYPES[activeArtifact].use}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 7. GPT BUILDER ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-3">Custom GPTs</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            Construye <span className="bg-gradient-to-r from-orange to-purple bg-clip-text text-transparent">&quot;BTG DD Analyst&quot;</span> paso a paso
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10">
            ChatGPT permite crear asistentes compartibles en minutos. Este es el blueprint real para un GPT de due diligence M&A.
          </p>

          {/* Progress bar */}
          <div className="flex gap-1 mb-6">
            {GPT_BLUEPRINT.map((b, i) => (
              <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{
                background: i <= gptStep ? b.color : "rgba(255,255,255,0.06)",
              }} />
            ))}
          </div>

          <div className="bg-[#0D1229] border rounded-2xl overflow-hidden" style={{ borderColor: `${GPT_BLUEPRINT[gptStep].color}30` }}>
            {/* Header */}
            <div className="px-6 md:px-8 py-5 border-b border-white/[0.06] flex items-center justify-between gap-4" style={{
              background: `linear-gradient(90deg, ${GPT_BLUEPRINT[gptStep].color}15, transparent)`,
            }}>
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest" style={{ color: GPT_BLUEPRINT[gptStep].color }}>
                  {GPT_BLUEPRINT[gptStep].step}
                </p>
                <h3 className="text-xl font-bold text-white-f mt-1">{GPT_BLUEPRINT[gptStep].field}</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setGptStep((s) => Math.max(0, s - 1))}
                  disabled={gptStep === 0}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono border border-white/[0.08] text-muted hover:text-white-f disabled:opacity-30 cursor-pointer"
                >
                  ← Anterior
                </button>
                <button
                  onClick={() => setGptStep((s) => Math.min(GPT_BLUEPRINT.length - 1, s + 1))}
                  disabled={gptStep === GPT_BLUEPRINT.length - 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono border border-white/[0.08] text-white-f hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                  style={{ background: `${GPT_BLUEPRINT[gptStep].color}20`, borderColor: `${GPT_BLUEPRINT[gptStep].color}40` }}
                >
                  Siguiente →
                </button>
              </div>
            </div>
            {/* Body */}
            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-3">Contenido a escribir</p>
                <div className="bg-[#151A3A] rounded-xl p-4 border border-white/[0.06] font-mono text-xs text-white-f leading-relaxed whitespace-pre-wrap">
                  {GPT_BLUEPRINT[gptStep].content}
                </div>
              </div>
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-3">Por qué importa</p>
                <p className="text-sm text-white-f leading-relaxed">{GPT_BLUEPRINT[gptStep].detail}</p>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 8. CODE INTERPRETER CASES ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-3">Code Interpreter</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            Python en sandbox: <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">4 casos reales</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10">
            Sube archivos, el modelo corre código Python real y devuelve análisis + visualizaciones. Funciona en ChatGPT (Code Interpreter) y Claude (Artifacts + Computer Use).
          </p>

          {/* Case selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {CODE_INTERPRETER_CASES.map((c, i) => (
              <button
                key={c.caso}
                onClick={() => setActiveCase(i)}
                className="rounded-xl p-3 border transition-all text-left"
                style={{
                  background: activeCase === i ? `${c.color}15` : "#151A3A",
                  borderColor: activeCase === i ? `${c.color}60` : "rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-sm font-bold text-white-f leading-tight">{c.caso}</p>
                <p className="font-mono text-[0.55rem] mt-1 uppercase tracking-wider" style={{ color: c.color }}>{c.time}</p>
              </button>
            ))}
          </div>

          <div className="bg-[#0D1229] border rounded-2xl p-6 md:p-8" style={{ borderColor: `${CODE_INTERPRETER_CASES[activeCase].color}30` }}>
            <div className="grid md:grid-cols-3 gap-4 mb-5">
              {[
                { label: "Input", value: CODE_INTERPRETER_CASES[activeCase].input, icon: "↓" },
                { label: "Prompt", value: CODE_INTERPRETER_CASES[activeCase].prompt, icon: "◉" },
                { label: "Output", value: CODE_INTERPRETER_CASES[activeCase].output, icon: "↑" },
              ].map((x) => (
                <div key={x.label} className="bg-[#151A3A] rounded-xl p-4 border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-lg" style={{ color: CODE_INTERPRETER_CASES[activeCase].color }}>{x.icon}</span>
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">{x.label}</p>
                  </div>
                  <p className="text-sm text-white-f leading-relaxed">{x.value}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.06] pt-4 flex flex-wrap gap-6 items-center">
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-1">Tiempo total</p>
                <p className="text-xl font-bold" style={{ color: CODE_INTERPRETER_CASES[activeCase].color }}>{CODE_INTERPRETER_CASES[activeCase].time}</p>
              </div>
              <div className="flex-1 min-w-[240px]">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-1">Valor para BTG</p>
                <p className="text-sm text-white-f italic">{CODE_INTERPRETER_CASES[activeCase].value}</p>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 9. DD WORKFLOW ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-3">Workflow DD</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            Due diligence M&A <span className="bg-gradient-to-r from-orange to-cyan bg-clip-text text-transparent">en 6 fases</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10">
            Una orquestación realista del asistente — desde ingesta del data room hasta el Q&A del investment committee.
          </p>

          <div className="grid md:grid-cols-6 gap-3">
            {DD_WORKFLOW.map((w, i) => (
              <div
                key={w.fase}
                className="rounded-xl p-4 border transition-all"
                style={{
                  background: i === wfStep ? `${w.color}15` : "#151A3A",
                  borderColor: i === wfStep ? `${w.color}60` : "rgba(255,255,255,0.06)",
                  transform: i === wfStep ? "translateY(-4px)" : "none",
                }}
              >
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1" style={{ color: w.color }}>{w.fase}</p>
                <p className="text-sm font-bold text-white-f leading-tight mb-3">{w.task}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[0.55rem] font-mono text-muted uppercase">🛠</span>
                    <span className="text-[0.65rem] text-white-f">{w.tool}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[0.55rem] font-mono text-muted uppercase">⏱</span>
                    <span className="text-[0.65rem]" style={{ color: w.color }}>{w.time}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/[0.04]">
                  <p className="text-[0.65rem] text-muted leading-snug">{w.output}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-br from-orange/10 to-purple/10 border border-orange/30 rounded-2xl p-6 md:p-8">
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-orange mb-2">Total end-to-end</p>
            <p className="text-2xl md:text-3xl text-white-f leading-snug">
              75 minutos desde recibir el data room hasta tener un IC memo preliminar.{" "}
              <span className="text-orange">Antes: 2–3 días.</span>
            </p>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 10. COMPARATIVA ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-3">Comparativa</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            ¿Claude Projects, <span className="text-green">GPTs</span>, <span className="text-blue">Gems</span> o <span className="text-purple-light">Copilot</span>?
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10">
            Radar de capacidades: selecciona una plataforma y compara su perfil para decisiones reales de finanzas.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {TOOL_COMPARE.map((t, i) => (
              <button
                key={t.name}
                onClick={() => setActiveCompare(i)}
                className="rounded-xl p-3 border transition-all text-center"
                style={{
                  background: activeCompare === i ? `${t.color}15` : "#151A3A",
                  borderColor: activeCompare === i ? `${t.color}60` : "rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-2xl" style={{ color: t.color }}>{t.icon}</p>
                <p className="text-sm font-bold text-white-f mt-1 leading-tight">{t.name}</p>
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-[1.2fr_1fr] gap-6">
            <div className="bg-[#0D1229] border rounded-2xl p-6 md:p-8" style={{ borderColor: `${TOOL_COMPARE[activeCompare].color}30` }}>
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-4">Perfil de capacidades (1–5)</p>
              <div className="space-y-3">
                {(Object.keys(TOOL_COMPARE[activeCompare].scores) as (keyof typeof TOOL_COMPARE[0]["scores"])[]).map((k) => {
                  const score = TOOL_COMPARE[activeCompare].scores[k];
                  return (
                    <div key={k}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-white-f">{SCORE_LABELS[k]}</span>
                        <span className="font-mono text-xs" style={{ color: TOOL_COMPARE[activeCompare].color }}>{score}/5</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <div key={n} className="flex-1 h-2 rounded" style={{
                            background: n <= score ? TOOL_COMPARE[activeCompare].color : "rgba(255,255,255,0.06)",
                          }} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#0D1229] border rounded-2xl p-6 md:p-8" style={{ borderColor: `${TOOL_COMPARE[activeCompare].color}30` }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl" style={{ color: TOOL_COMPARE[activeCompare].color }}>{TOOL_COMPARE[activeCompare].icon}</span>
                <h3 className="text-xl font-bold text-white-f">{TOOL_COMPARE[activeCompare].name}</h3>
              </div>
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-2">Sweet spot</p>
              <p className="text-sm text-white-f leading-relaxed">{TOOL_COMPARE[activeCompare].best}</p>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 11. TALLER ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-10">
            <div>
              <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-3">Taller final · 20 min</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white-f leading-tight mb-4">
                Construye <span className="bg-gradient-to-r from-orange to-cyan bg-clip-text text-transparent">tu asistente DD M&A</span>
              </h2>
              <p className="text-muted mb-6 leading-relaxed">
                Siguiendo los 7 pasos, dejas la sesión con un asistente funcional al que puedes subirle tu próximo data room el lunes.
              </p>

              <div className="bg-gradient-to-br from-orange/10 to-purple/10 border border-orange/30 rounded-2xl p-5">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-orange mb-2">Entregable</p>
                <p className="text-white-f leading-relaxed">
                  Un Project (Claude) o Custom GPT (ChatGPT) funcional + 1 IC memo generado + pitch de 90 segundos al equipo.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {TALLER_STEPS.map((s) => (
                <div key={s.n} className="flex gap-4 bg-[#151A3A] border border-white/[0.06] rounded-2xl p-4">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange to-purple flex items-center justify-center shrink-0">
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
