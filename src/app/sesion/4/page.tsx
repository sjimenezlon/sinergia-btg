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
    desc: "El LLM que piensa: Claude 4.7 Opus, GPT-5.4, Gemini 3.1. Decide la calidad del análisis, la latencia y el costo por token.",
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

/* ═════════ Plataformas IA · estado mayo 2026 ═════════ */

const TOOLS: Record<string, {
  name: string; short: string; mark: string; color: string; url: string; tier: string; ctx: string; fit: string;
}> = {
  claude: {
    name: "Claude (Anthropic)",
    short: "Claude",
    mark: "C",
    color: "#D97757",
    url: "https://claude.ai/new",
    tier: "Free · Pro $20",
    ctx: "200K (1M en Pro)",
    fit: "Documentos largos · Projects · Artifacts · análisis confiable con citas.",
  },
  chatgpt: {
    name: "ChatGPT (OpenAI)",
    short: "ChatGPT",
    mark: "G",
    color: "#10A37F",
    url: "https://chatgpt.com/",
    tier: "Free · Plus $20",
    ctx: "128K",
    fit: "Code Interpreter (Excel + Python) · Custom GPTs · ecosistema más amplio.",
  },
  gemini: {
    name: "Gemini (Google)",
    short: "Gemini",
    mark: "✦",
    color: "#4285F4",
    url: "https://gemini.google.com/app",
    tier: "Free · Advanced $20",
    ctx: "1M",
    fit: "Deep Research · integración Workspace · multimodalidad nativa.",
  },
  notebooklm: {
    name: "NotebookLM (Google)",
    short: "NotebookLM",
    mark: "N",
    color: "#7B61FF",
    url: "https://notebooklm.google.com/",
    tier: "Free",
    ctx: "Hasta 50 fuentes",
    fit: "Research multi-fuente con citas literales · genera Audio Overview en podcast.",
  },
  deepseek: {
    name: "DeepSeek",
    short: "DeepSeek",
    mark: "◆",
    color: "#4D6BFE",
    url: "https://chat.deepseek.com/",
    tier: "Free",
    ctx: "128K",
    fit: "Razonamiento matemático sólido · respuesta rápida · útil para segunda opinión.",
  },
  mistral: {
    name: "Mistral · Le Chat",
    short: "Le Chat",
    mark: "▲",
    color: "#FF7000",
    url: "https://chat.mistral.ai/chat",
    tier: "Free · Pro €15",
    ctx: "128K",
    fit: "Modelo europeo · respuesta veloz · interfaz limpia · code execution incluido.",
  },
  kimi: {
    name: "Kimi (Moonshot AI)",
    short: "Kimi",
    mark: "✶",
    color: "#1D8278",
    url: "https://www.kimi.com/",
    tier: "Free",
    ctx: "2M",
    fit: "El más generoso en contexto · ideal para libros enteros, transcripts largos, data rooms voluminosos.",
  },
};

/* ═════════ Galería: 6 flujos en finanzas ═════════ */

const FINANCE_CASES = [
  {
    id: "dd",
    num: "01",
    title: "Análisis express de un data room M&A",
    line: "Banca de inversión",
    icon: "◉",
    color: "#E85A1F",
    primary: "claude",
    alt: ["gemini", "kimi"],
    files: [
      { name: "Cementos Portales · CIM", file: "01-cementos-portales-cim.docx", kind: "Word", size: "38 KB" },
    ],
    problem: "Recibes el data room de un target el viernes y el MD pide un memo preliminar el lunes.",
    workflow: [
      "Descarga el CIM en Word de la galería.",
      "Abre Claude (Free funciona; Pro habilita Projects con memoria).",
      "Sube el archivo + pega el prompt orientador.",
      "Pídele que genere el memo como Artifact, exportable a Word.",
    ],
    output: "IC memo preliminar con tesis, riesgos, comparables y citas a página · listo para revisar con el MD.",
    why: "Claude tiene el mejor desempeño en docs largos y devuelve respuestas con citas verificables. Kimi 2M resuelve cuando el data room pesa decenas de archivos.",
    prompt: `Eres un analista senior de banca de inversión LatAm. Analiza el documento adjunto (CIM de Cementos Portales) y entrega un memo de inversión preliminar con esta estructura:

1) TESIS DE INVERSIÓN (3 bullets)
2) TOP 5 RED FLAGS (cada uno con cita a sección o página)
3) RANGOS DE VALORACIÓN implícitos según múltiplos sectoriales
4) PREGUNTAS PARA EL MANAGEMENT
5) RECOMENDACIÓN: avanzar a Round 2 / pedir información / declinar

Reglas:
- No inventes cifras. Si un dato no está en el documento, escribe "no disponible en el data room".
- Cita siempre la sección o número del CIM.
- Devuelve el memo como Artifact editable.`,
    metric: { v: "−83%", k: "tiempo DD" },
  },
  {
    id: "dcf",
    num: "02",
    title: "Valoración DCF con sensibilidades",
    line: "Equity research / Valoración",
    icon: "📊",
    color: "#3A7BD5",
    primary: "chatgpt",
    alt: ["claude", "gemini", "mistral"],
    files: [
      { name: "DCF · 5 emisores Colcap", file: "02-dcf-emisores-colcap.xlsx", kind: "Excel", size: "7 KB" },
    ],
    problem: "Equity research necesita refrescar valoración de 5 emisores con matriz de sensibilidad y tornado de drivers.",
    workflow: [
      "Descarga el Excel con assumptions de los 5 emisores.",
      "Abre ChatGPT (Free ya incluye Code Interpreter limitado; Plus libera el límite).",
      "Sube el Excel + pega el prompt.",
      "El modelo corre Python → tabla resumen + matriz 5×5 + tornado chart.",
    ],
    output: "Excel limpio con valoración implícita por emisor, matriz de sensibilidad y gráfico tornado descargable.",
    why: "ChatGPT y Mistral Le Chat ejecutan código en sandbox sin que tengas que salir del chat. Devuelven el archivo procesado listo para pegar al deck.",
    prompt: `Tienes adjunto un Excel con assumptions de 5 emisores del Colcap. Para cada uno:

1) Proyecta EBITDA a 5 años usando un CAGR razonable por sector (justifica brevemente).
2) Calcula Free Cash Flow asumiendo Capex = 60% de la depreciación y working capital constante.
3) Construye una matriz 5x5 de Enterprise Value variando WACC (−200 a +200 bps) y g terminal (2% a 4%).
4) Identifica el emisor con MAYOR sensibilidad al WACC.
5) Genera un tornado chart con los 5 drivers más relevantes para ese emisor.
6) Devuelve un Excel descargable con: hoja "Resumen" (EV implícito por emisor), hoja "Sensibilidad" (matriz), hoja "Tornado" (datos del gráfico).

Sé explícito con los supuestos. Si necesitas asumir algo, indícalo en una columna "Notas".`,
    metric: { v: "−91%", k: "vs Excel manual" },
  },
  {
    id: "podcast",
    num: "03",
    title: "Briefing sectorial en formato podcast",
    line: "Macro / Equity research",
    icon: "🎧",
    color: "#7B61FF",
    primary: "notebooklm",
    alt: ["gemini"],
    files: [
      { name: "Pack de fuentes · Telco LatAm", file: "03-fuentes-telco-latam.docx", kind: "Word", size: "38 KB" },
    ],
    problem: "El head de research pide un briefing del sector telco LatAm para mañana — y otro analista ya tomó el slot del taxi al aeropuerto.",
    workflow: [
      "Descarga el pack de 18 fuentes telco.",
      "Abre NotebookLM (gratis con cuenta Google), crea un Notebook nuevo.",
      "Sube el documento como fuente · agrega 5 PDFs propios si quieres.",
      "Pídele briefing escrito + Audio Overview de 12-15 minutos.",
    ],
    output: "Briefing de 1 página con citas literales + podcast personalizado de 12-15 min para escuchar camino al cliente.",
    why: "NotebookLM cita la fuente literal — no alucina. Audio Overview convierte el research en formato consumible mientras manejas. Único en su clase y gratis.",
    prompt: `Sobre las fuentes de este Notebook (sector telco LatAm Q1 2026):

1) Brief de 1 página con la tesis sectorial dominante.
2) Mapa de tesis CONVERGENTES vs. DIVERGENTES entre los analistas (Itaú, BTG, JP Morgan, BNP).
3) Identifica 3 catalysts que podrían mover precios en H2 2026.
4) Lista 5 contradicciones que vale la pena verificar con management.
5) Cita la fuente literal en cada afirmación.

Después, generar Audio Overview enfocado en lo accionable para un PM (no en explicar el sector desde cero).`,
    metric: { v: "30 fuentes", k: "→ 1 podcast" },
  },
  {
    id: "long",
    num: "04",
    title: "Lectura de earnings call de 18.000 palabras",
    line: "Equity / Risk",
    icon: "✶",
    color: "#1D8278",
    primary: "kimi",
    alt: ["claude", "gemini"],
    files: [
      { name: "Earnings call · Banco Andino Q1-26", file: "04-banco-andino-earnings-call.docx", kind: "Word", size: "41 KB" },
    ],
    problem: "Tienes 90 minutos antes del comité de inversiones para extraer todo lo material de un transcript que tarda 2 horas en leerse.",
    workflow: [
      "Descarga el transcript completo en Word.",
      "Abre Kimi (gratis · soporta hasta 2M tokens).",
      "Sube el documento + pega el prompt.",
      "Pide tabla estructurada con KPIs + tesis + cambios vs. trimestre anterior.",
    ],
    output: "Tabla de 12 KPIs · top 5 frases del CEO · 3 contradicciones detectadas · 4 preguntas no respondidas en Q&A.",
    why: "Kimi K2 maneja 2M tokens de contexto y es gratis — supera a Claude (1M Pro) y Gemini en puro tamaño. Cuando el documento pasa de 80 páginas, Kimi es la opción más económica.",
    prompt: `Adjunto el transcript del earnings call Q1-2026 de Banco Andino. Necesito en formato tabla:

A) KPIs FINANCIEROS: utilidad neta, ROE, NIM, eficiencia, mora 90+, costo de riesgo, LCR, CET1. Valor + variación YoY + comentario textual del CFO.

B) GUIDANCE 2026: rangos provistos para cartera, ROE, costo de riesgo, eficiencia.

C) CALIDAD DE LA RESPUESTA: identifica 3 preguntas en el Q&A donde el CEO/CFO esquivó la respuesta o dio answer poco satisfactoria.

D) RIESGOS: lista las 5 cosas que más me preocuparían como inversor.

E) CONTRADICCIONES: pares de afirmaciones que no cuadran entre sí dentro del mismo documento (ej: CEO dice X, CFO dice Y).

Cita la sección o párrafo del cual extraes cada afirmación.`,
    metric: { v: "2 min", k: "vs 2 horas leyendo" },
  },
  {
    id: "compare",
    num: "05",
    title: "Triangular respuesta con 3 modelos distintos",
    line: "Risk / Equity research",
    icon: "▲",
    color: "#FF7000",
    primary: "mistral",
    alt: ["deepseek", "claude", "chatgpt"],
    files: [
      { name: "Comps · Cementeras LatAm", file: "05-comps-cementeras-latam.xlsx", kind: "Excel", size: "6 KB" },
    ],
    problem: "Una sola IA puede equivocarse y nadie lo nota. Cuando la decisión vale millones, el costo de cruzar 3 modelos es cero.",
    workflow: [
      "Descarga el Excel con 8 cementeras LatAm.",
      "Abre 3 pestañas: Mistral Le Chat, DeepSeek, Claude (todos free).",
      "Pega el MISMO prompt en las 3 + sube el archivo.",
      "Compara: ¿coinciden en mediana, mín y máx? ¿alguno alucina cifras?",
    ],
    output: "Tabla con 3 valoraciones lado a lado + análisis de divergencias + recomendación final fundamentada.",
    why: "Mistral Le Chat es europeo y veloz; DeepSeek razona muy bien en cuantitativo; Claude es conservador y cita fuente. Si los 3 convergen, alta confianza. Si divergen, tienes que profundizar.",
    prompt: `Adjunto Excel con comparables del sector cemento LatAm (8 empresas). Tarea:

1) Calcula múltiplos normalizados (EV/EBITDA, P/E, EV/Sales) descartando outliers con regla IQR 1.5×.
2) Reporta mediana, promedio y rango por múltiplo.
3) Aplica los múltiplos a Cementos Portales (target sintético): Revenue 2025 USD 175M, EBITDA 2025 USD 26M, Net Debt USD 89M.
4) Devuelve rango de Enterprise Value y Equity Value implícito.
5) Indica QUÉ múltiplo deberíamos usar y por qué (tu opinión, justificada).

Después responde: ¿qué tan seguro estás de tu respuesta del 1 al 10? ¿Qué información adicional pediría un MD para validarla?`,
    metric: { v: "3 modelos", k: "1 prompt" },
  },
  {
    id: "assistant",
    num: "06",
    title: "Asistente reusable de Wealth Management",
    line: "Wealth Management",
    icon: "✦",
    color: "#9B59B6",
    primary: "gemini",
    alt: ["claude", "chatgpt"],
    files: [
      { name: "Portafolio modelo · 80 posiciones", file: "06-portafolio-wealth-modelo.xlsx", kind: "Excel", size: "9 KB" },
    ],
    problem: "Cada asesor explica el portafolio a sus clientes con palabras distintas. Quieres un asistente que dé respuestas consistentes con la voz BTG.",
    workflow: [
      "Descarga el portafolio modelo de WM.",
      "Abre Gemini (free) y crea un Gem dedicado · o usa un Project en Claude / Custom GPT.",
      "Pega las instrucciones de sistema + sube el portafolio como knowledge.",
      "Cualquier asesor puede preguntar: \"¿qué le digo a un cliente conservador sobre Ecopetrol?\"",
    ],
    output: "Asistente compartible con voz consistente · disponible 24/7 · consulta el portafolio modelo en cada respuesta.",
    why: "Gemini Gems son gratis y se comparten con un link. Custom GPTs son más potentes pero requieren Plus. Claude Projects es la opción premium con mejor manejo de docs largos.",
    prompt: `Eres "BTG Wealth Companion", un asistente para asesores patrimoniales BTG.

Reglas duras:
- Nunca des recomendaciones de compra/venta personalizadas. Eres explicativo, no transaccional.
- Cada respuesta debe ser apta para que un asesor la use frente a un cliente: clara, en español, sin jerga innecesaria.
- Cuando te pregunten sobre un activo del portafolio adjunto, basa la respuesta en sus datos reales (peso, retorno, volatilidad, rating).
- Si la pregunta es sobre un activo que NO está en el portafolio, dilo explícitamente.
- Cierra siempre con un disclaimer de 1 línea: "Esta información es educativa; toda decisión debe pasar por su asesor BTG y por análisis de perfil de riesgo."

Formato de salida sugerido:
- Tres frases simples del activo.
- Una métrica clave.
- Un riesgo a mencionar.
- El disclaimer.`,
    metric: { v: "1 asistente", k: "todo el equipo WM" },
  },
];

/* ═════════ Preguntas orientadoras ═════════ */

const ORIENTING_QUESTIONS = [
  {
    n: "01",
    q: "¿Qué decisión específica quiero acelerar?",
    hint: "No es \"usar IA\". Es \"reducir el tiempo del primer draft del IC memo de 8h a 2h\".",
    color: "#E85A1F",
  },
  {
    n: "02",
    q: "¿Quién es el usuario final y qué le falta hoy?",
    hint: "Asesor WM, analyst IB, MD, compliance officer. Cada uno tiene un cuello de botella distinto.",
    color: "#3A7BD5",
  },
  {
    n: "03",
    q: "¿Cuántos documentos voy a manejar y de qué tamaño?",
    hint: "Si pasa de 80 páginas → Kimi (2M). 30-80 → Claude o Gemini (1M). Menos de 30 → cualquiera.",
    color: "#7B61FF",
  },
  {
    n: "04",
    q: "¿Necesito ejecutar código (Excel, Python, gráficos)?",
    hint: "Si sí → ChatGPT (Code Interpreter) o Mistral Le Chat. Si solo es texto → cualquiera vale.",
    color: "#10A37F",
  },
  {
    n: "05",
    q: "¿La salida debe ser un archivo descargable?",
    hint: "Define formato: Word, Excel, PDF, audio. Eso filtra qué herramienta sirve.",
    color: "#D4AF4C",
  },
  {
    n: "06",
    q: "¿Cómo voy a verificar que el output es confiable?",
    hint: "Pídele citas a fuente. Cruza con un segundo modelo (DeepSeek, Mistral). Compara con un colega.",
    color: "#22C55E",
  },
  {
    n: "07",
    q: "¿Qué información NO puedo subir bajo ninguna circunstancia?",
    hint: "Datos de clientes reales, cédulas, montos individuales, secreto bancario. Cero. Solo data sintética.",
    color: "#FF5F57",
  },
  {
    n: "08",
    q: "¿Cómo se ve un demo exitoso en 5 minutos?",
    hint: "Si no lo puedes mostrar funcionando en vivo, no está listo. Define el guion del demo antes de construir.",
    color: "#9B59B6",
  },
];

/* ═════════ Sesión práctica · 2 a 4 horas ═════════ */

const MVP_AGENDA = [
  { time: "0:00–0:15", phase: "Kickoff", what: "Equipos de 2-3 · responder las 8 preguntas orientadoras", color: "#22C55E" },
  { time: "0:15–0:35", phase: "Elegir caso", what: "Seleccionar 1 de los 6 flujos · descargar archivos · abrir plataforma", color: "#3A7BD5" },
  { time: "0:35–2:05", phase: "Build sprint", what: "90 min iterando con la herramienta · ajustar prompts · refinar output", color: "#E85A1F" },
  { time: "2:05–2:35", phase: "Cruzar respuestas", what: "Llevar el mismo input a un segundo modelo · comparar · documentar diferencias", color: "#D4AF4C" },
  { time: "2:35–3:30", phase: "Pitch round", what: "5 min por equipo · demo en vivo · Q&A de pares", color: "#5B52D5" },
  { time: "3:30–4:00", phase: "Cierre", what: "Lecciones aprendidas · qué cambia el lunes · backlog del MVP", color: "#9B59B6" },
];

const MVP_TRACKS = [
  {
    id: "A",
    name: "Asistente DD M&A",
    line: "Investment Banking",
    color: "#E85A1F",
    icon: "◉",
    desafio: "Convierte el CIM de Cementos Portales en un memo preliminar listo para review del MD.",
    must: [
      "Subir el CIM (Word) a Claude · ChatGPT · Gemini · Kimi (la que prefieran)",
      "System prompt con rol, formato IC memo y restricciones de privacidad",
      "Identificar al menos 5 red flags con cita al documento",
      "Devolver memo de 2 páginas en formato Word descargable",
    ],
    nice: ["Tabla de comparables vía Code Interpreter", "Versión bilingüe (ES/EN)", "Lista de preguntas para management"],
    file: "01-cementos-portales-cim.docx",
    primaryTool: "claude",
    pitch: "Demo en vivo: pregunta del MD → asistente responde con citas → entregar memo en Word.",
  },
  {
    id: "B",
    name: "Valuation Bot DCF",
    line: "Equity Research",
    color: "#3A7BD5",
    icon: "📊",
    desafio: "Refresca la valoración de 5 emisores Colcap con matriz de sensibilidad y tornado chart.",
    must: [
      "Subir el Excel a ChatGPT, Mistral Le Chat o Gemini (las que tengan code execution)",
      "Construir matriz 5×5 de EV (WACC × g)",
      "Generar al menos 1 visualización (tornado, heatmap o waterfall)",
      "Descargar el Excel procesado con resultados",
    ],
    nice: ["Comparar resultado contra DeepSeek", "Slide HTML con la tesis", "Pequeño memo explicativo"],
    file: "02-dcf-emisores-colcap.xlsx",
    primaryTool: "chatgpt",
    pitch: "Cargar Excel real → mostrar matriz + tornado en menos de 2 minutos · descargar archivo.",
  },
  {
    id: "C",
    name: "Research con Audio Overview",
    line: "Macro / Sectorial",
    color: "#7B61FF",
    icon: "🎧",
    desafio: "Construye un briefing del sector telco LatAm con podcast personalizado para escuchar en el viaje.",
    must: [
      "Cargar el pack de 18 fuentes a NotebookLM",
      "Briefing escrito de 1 página con citas literales",
      "Audio Overview generado (mínimo 5 minutos)",
      "Mapa de tesis convergentes vs. divergentes",
    ],
    nice: ["Cruzar con Gemini Deep Research", "Detección de quotes contradictorios", "Mini deck de 3 slides"],
    file: "03-fuentes-telco-latam.docx",
    primaryTool: "notebooklm",
    pitch: "Reproducir 30 segundos del podcast + mostrar mapa consenso/disenso.",
  },
  {
    id: "D",
    name: "Asesor Earnings Calls",
    line: "Equity / Risk",
    color: "#1D8278",
    icon: "✶",
    desafio: "Convierte el transcript del earnings de Banco Andino en una página de KPIs y red flags.",
    must: [
      "Subir el transcript a Kimi, Claude o Gemini",
      "Tabla de 8+ KPIs con valor, variación YoY y comentario textual",
      "3 preguntas del Q&A donde la respuesta fue evasiva",
      "5 riesgos materiales con cita al transcript",
    ],
    nice: ["Comparar guidance con cierre del trimestre anterior", "Audio Overview en NotebookLM como bonus", "Detección de contradicciones entre CEO y CFO"],
    file: "04-banco-andino-earnings-call.docx",
    primaryTool: "kimi",
    pitch: "Mostrar la tabla + leer 1 cita textual del CEO + el riesgo más material.",
  },
  {
    id: "E",
    name: "Triangulación de Comps",
    line: "Valoración / Risk",
    color: "#FF7000",
    icon: "▲",
    desafio: "Llevar la misma pregunta de valoración a 3 modelos distintos y reportar acuerdos vs. desacuerdos.",
    must: [
      "Subir el Excel de comps a 3 plataformas (Mistral, DeepSeek, Claude/ChatGPT)",
      "Mismo prompt en las 3",
      "Tabla comparativa con sus rangos de valoración",
      "Análisis de en qué coinciden y en qué divergen",
    ],
    nice: ["Identificar qué modelo alucinó cifras", "Sumar Gemini como cuarta opinión", "Recomendación final fundamentada"],
    file: "05-comps-cementeras-latam.xlsx",
    primaryTool: "mistral",
    pitch: "Mostrar las 3 respuestas lado a lado · explicar la divergencia · cuál confiarías al MD.",
  },
];

/* ═════════ Ejemplo guiado · Cementos Portales en 4 plataformas ═════════ */

const GUIDED_PROMPT = `Eres "BTG DD Analyst", un analista senior de banca de inversión LatAm con 10 años de experiencia.

Trabajas en una transacción real: la Familia Portales mandató la venta del 100% de Cementos Portales S.A., productor regional de cemento con plantas en Colombia, Perú y Ecuador. Tienes el CIM completo cargado como contexto.

Tu trabajo: ayudar al MD a decidir si BTG Pactual avanza a Round 2 o declina la oportunidad.

Reglas duras:
1. NUNCA inventes cifras. Si un dato no aparece en el CIM, responde "no disponible en el data room".
2. CITA siempre la sección o tabla del CIM de donde extraes cada afirmación.
3. Estructura cada respuesta en 4 partes: TESIS · RIESGOS · COMPARABLES · NEXT STEPS.
4. Sé crítico. El MD prefiere un escéptico bien fundamentado que un cheerleader optimista.
5. Responde como analista senior, no como IA. Sin disclaimers innecesarios.

Al final de cada respuesta agrega: "Confianza (1–10): X. Una razón."`;

const GUIDED_QUESTIONS = [
  { n: "Q1", q: "¿Cuáles son los top 3 red flags materiales del target? Cita la sección del CIM en cada uno." },
  { n: "Q2", q: "El covenant Net Debt/EBITDA con Bancolombia es 3.50x y al cierre 2025 está en 3.42x. ¿Qué pasa si el EBITDA cae 10% en 2026? ¿Cuánto margen queda?" },
  { n: "Q3", q: "Usando múltiplos sectoriales típicos (EV/EBITDA 5x–9x para cementeras LatAm), estima el rango de Enterprise Value para Cementos Portales con su EBITDA 2025." },
  { n: "Q4", q: "Genera 5 preguntas precisas que el MD debe hacerle al CEO en la management presentation. Que cada una sea incómoda de responder." },
  { n: "Q5", q: "Recomendación binaria: ¿AVANZAMOS a Round 2 o DECLINAMOS? Justifica en 3 bullets. Si dudas, di que dudas — no hagas el político." },
];

const PLATFORM_GUIDE: Record<string, { free: string; pro: string; tip: string; flow: string[] }> = {
  chatgpt: {
    free: "Abre un chat nuevo · pega el system prompt · adjunta el .docx con el clip · empieza a preguntar.",
    pro: "Plus: My GPTs → Create. Pega el prompt en \"Instructions\" · sube el CIM en \"Knowledge\" · le pones nombre \"BTG DD Analyst v1\" · obtienes un GPT reusable que compartes con tu equipo.",
    tip: "Si subes el .docx en el chat se activa Advanced Data Analysis. Después de Q3 dile: \"corre el cálculo en Python y muéstralo paso a paso\". Devuelve el código ejecutado y verificable.",
    flow: [
      "chatgpt.com → New chat",
      "Pega el system prompt arriba",
      "Adjunta 01-cementos-portales-cim.docx",
      "Pega Q1 → revisa la respuesta",
      "Pega Q2 a Q5 una por una",
    ],
  },
  claude: {
    free: "Abre un chat nuevo · pega el system prompt · adjunta el .docx · empieza a preguntar. Funciona; pierdes contexto al cerrar.",
    pro: "Projects → New Project → en \"Custom instructions\" pega el prompt · sube el CIM como knowledge permanente · cada conversación nueva dentro del Project hereda el contexto sin re-cargar.",
    tip: "Después de Q5 dile: \"Genera el memo IC final como Artifact\". Lo abre en panel lateral, editable, con versiones, exportable a Word con un click.",
    flow: [
      "claude.ai → New chat (o Projects → New)",
      "Pega el system prompt",
      "Adjunta 01-cementos-portales-cim.docx",
      "Pega Q1 a Q5 una por una",
      "Cierra con: \"genera el memo IC como Artifact\"",
    ],
  },
  gemini: {
    free: "Gems es la opción correcta: Gemini → Gems → Create new Gem. Pega el system prompt en \"Instructions\" · sube el CIM como referencia. El Gem queda compartible con tu equipo.",
    pro: "Gemini Advanced: mismo flujo pero con ventana de 1M de tokens. Puedes sumar 5 PDFs adicionales (research sectorial, comps, regulación) sin temer al límite.",
    tip: "Después de Q4 di: \"abre Deep Research sobre las 5 preguntas y dame las respuestas verificadas con fuentes web\". Gemini cruza la información del CIM con datos públicos.",
    flow: [
      "gemini.google.com → Gems → Create",
      "Nombre: BTG DD Analyst",
      "Instructions: pega el system prompt",
      "Add files: sube el CIM",
      "Save y empieza a preguntar Q1 a Q5",
    ],
  },
  deepseek: {
    free: "chat.deepseek.com · pega el system prompt al inicio del chat · adjunta el .docx con el ícono de clip. No hay \"projects\" — el contexto vive en la conversación.",
    pro: "DeepSeek no tiene tier Pro de pago. Lo bueno: ningún paywall. Lo malo: si cierras el tab, pierdes el setup. Mantén la conversación abierta durante todo el ejercicio.",
    tip: "DeepSeek razona muy bien cuantitativo. En Q2 (estrés del covenant) y Q3 (valoración) suele ser el más detallado. Pídele que muestre los cálculos en pasos numerados.",
    flow: [
      "chat.deepseek.com → New chat",
      "Activa \"Deep Think\" si está disponible",
      "Pega el system prompt",
      "Adjunta el CIM",
      "Pega Q1 a Q5",
    ],
  },
};

const COMPARE_DIMENSIONS = [
  { d: "Citas a fuente", w: "¿Cita sección o tabla del CIM o se inventa?", color: "#E85A1F" },
  { d: "Detección de red flags", w: "¿Encontró los 3 que vimos en clase (DSO, covenant, DIAN)?", color: "#3A7BD5" },
  { d: "Cuantitativo", w: "¿Hace bien las matemáticas del estrés y la valoración?", color: "#22C55E" },
  { d: "Honestidad", w: "¿Dice \"no sé\" cuando corresponde o llena el vacío con humo?", color: "#D4AF4C" },
  { d: "UX del output", w: "¿Está estructurado, citable, listo para llevar al MD?", color: "#9B59B6" },
];

const LOVABLE_PROMPT = `Construye una landing page minimalista en Next.js + Tailwind para presentar los resultados de un análisis de Due Diligence comparando 4 plataformas de IA.

Contenido:
1) Header con nombre del target ("Cementos Portales S.A.") y badge de sector ("Cemento · LatAm").
2) Una grid responsive de 4 cards (una por plataforma: ChatGPT, Claude, Gemini, DeepSeek). Cada card muestra:
   - Marca de la plataforma con su color identitario
   - Top 3 red flags identificados (texto editable)
   - Rango de Enterprise Value estimado en USD
   - Score de confianza 1-10 con barra visual
3) Sección "Recomendación final BTG" con un badge grande (AVANZAR A R2 / DECLINAR) y 3 bullets de justificación.
4) Footer con la fecha del análisis y un disclaimer de "datos sintéticos · ejercicio educativo".
5) Tema dark con acento naranja #E85A1F y texto blanco.

Responsive, código limpio, listo para deploy en Vercel con un click.`;

const MVP_KIT = [
  { t: "Archivos sintéticos", d: "6 archivos (Excel y Word) listos para descargar desde la galería · sin PII.", icon: "📦" },
  { t: "Prompts probados", d: "Cada caso trae prompt copiable que ya funciona · ajusta solo los detalles del usuario.", icon: "✍" },
  { t: "Plataformas free", d: "Claude · ChatGPT · Gemini · NotebookLM · DeepSeek · Mistral · Kimi · acceso gratuito a todas.", icon: "🌐" },
  { t: "Cuentas Pro pool", d: "Para los equipos que quieran probar Projects (Claude Pro) o Code Interpreter sin límite (ChatGPT Plus).", icon: "🔑" },
  { t: "Mentoría on-demand", d: "2 facilitadores rotando entre equipos · resuelven bloqueos en menos de 5 min.", icon: "🧭" },
  { t: "Plantilla pitch", d: "Estructura simple para presentar en 5 min: problema · demo · qué cambió · siguiente paso.", icon: "🎯" },
];

/* Live chat demo — DD de M&A en tiempo real */
type ChatMsg =
  | { role: "user"; name: string; avatar: string; time: string; text: string; delay: number }
  | { role: "tool"; icon: string; text: string; delay: number }
  | { role: "assistant"; name: string; avatar: string; time: string; text: string; delay: number; citations?: string[] }
  | { role: "artifact"; title: string; subtitle: string; delay: number };

const LIVE_CHAT: ChatMsg[] = [
  {
    role: "user",
    name: "María · Analyst IB",
    avatar: "M",
    time: "09:12",
    text: "Acabo de cargar el data room de Cementos Portales (47 docs). Dame el top 3 de red flags materiales para el memo del IC del jueves.",
    delay: 1000,
  },
  {
    role: "tool",
    icon: "📂",
    text: "Leyendo 47 docs · CIM · Audit KPMG 2024 · Term Sheet · Legal Opinion · Financials 2021–25",
    delay: 1600,
  },
  {
    role: "tool",
    icon: "🧠",
    text: "Extended Thinking · 1M tokens activos · cross-referencing 3,420 páginas",
    delay: 1600,
  },
  {
    role: "tool",
    icon: "⚡",
    text: "Python en sandbox · calculando DSO histórico y ratio covenant",
    delay: 1400,
  },
  {
    role: "assistant",
    name: "Claude 4.7 Opus · DD Assistant BTG",
    avatar: "◉",
    time: "09:14",
    text: "**3 red flags materiales identificados**\n\n**1 · DSO en deterioro severo**\nDías de cobro pasaron de 45 (2022) a 78 (2025). Implica liquidez estructural comprometida o venta forzada a clientes de bajo rating crediticio.\n\n**2 · Covenant breach inminente**\nNet Debt / EBITDA actual: 3.42×. Covenant: 3.50×. Margen de solo 0.08×. Un trimestre débil lo revienta y gatilla aceleración.\n\n**3 · Contingencia DIAN no provisionada**\nLa DIAN notificó ajuste fiscal por COP 8.200M el 12-feb-2026. No aparece ni en los EEFF ni en el memo del target. Materialidad: 1.4% EBITDA.",
    citations: ["CIM p.34", "Audit KPMG p.112", "Term Sheet §4.2", "Legal Opinion §7"],
    delay: 3500,
  },
  {
    role: "artifact",
    title: "Matriz red flags · severidad × probabilidad",
    subtitle: "Artifact · 1 página · exportable a PDF o Excel",
    delay: 1400,
  },
];

/* ════════════════════════════ COMPONENT ════════════════════════════ */

export default function Sesion4() {
  const [activeLayer, setActiveLayer] = useState<string>("model");
  const [activeStage, setActiveStage] = useState<number>(0);
  const [activeArtifact, setActiveArtifact] = useState<number>(0);
  const [gptStep, setGptStep] = useState<number>(0);
  const [activeCase, setActiveCase] = useState<number>(0);
  const [activeCompare, setActiveCompare] = useState<number>(0);
  const [activeFinanceCase, setActiveFinanceCase] = useState<string>("dd");
  const [activeTrack, setActiveTrack] = useState<string>("A");
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [guidedPlatform, setGuidedPlatform] = useState<string>("chatgpt");

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(key);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

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

  /* Live chat demo — auto-advance mensajes, loop cada 22s */
  const [chatVisible, setChatVisible] = useState(0);
  useEffect(() => {
    if (chatVisible >= LIVE_CHAT.length) {
      const reset = setTimeout(() => setChatVisible(0), 6000);
      return () => clearTimeout(reset);
    }
    const next = setTimeout(() => setChatVisible((v) => v + 1), LIVE_CHAT[chatVisible]?.delay ?? 1500);
    return () => clearTimeout(next);
  }, [chatVisible]);

  /* ROI counter animado (horas ahorradas / mes) */
  const [roiHours, setRoiHours] = useState(0);
  useEffect(() => {
    let n = 0;
    const iv = setInterval(() => {
      n += 4;
      setRoiHours(n);
      if (n >= 184) { setRoiHours(184); clearInterval(iv); }
    }, 30);
    return () => clearInterval(iv);
  }, []);

  const activeLayerData = useMemo(() => ASSISTANT_LAYERS.find((l) => l.id === activeLayer)!, [activeLayer]);
  const activeFinanceCaseData = useMemo(() => FINANCE_CASES.find((c) => c.id === activeFinanceCase)!, [activeFinanceCase]);
  const activeTrackData = useMemo(() => MVP_TRACKS.find((t) => t.id === activeTrack)!, [activeTrack]);

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

        {/* Orbital rings */}
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border border-orange/10" style={{ width: 520, height: 520, marginLeft: -260, marginTop: -260 }} />
            <div className="absolute inset-0 rounded-full border border-purple/10" style={{ width: 380, height: 380, marginLeft: -190, marginTop: -190 }} />
            <div className="absolute inset-0 rounded-full border border-cyan/8" style={{ width: 240, height: 240, marginLeft: -120, marginTop: -120 }} />
            {[
              { icon: "◉", color: "#E85A1F", r: 260, t: 14 },
              { icon: "📊", color: "#5B52D5", r: 190, t: 18 },
              { icon: "⚡", color: "#00E5A0", r: 260, t: 22 },
              { icon: "▣", color: "#3A7BD5", r: 120, t: 10 },
            ].map((o, i) => (
              <div key={i} className="absolute animate-orbit grid place-items-center text-xl opacity-40" style={{
                ["--orbit-r" as string]: `${o.r}px`,
                ["--orbit-t" as string]: `${o.t}s`,
                color: o.color,
                animationDelay: `${i * -3}s`,
              }}>{o.icon}</div>
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-4 animate-fadeUp">
            Módulo 02 &middot; Herramientas &middot; Sesión 4 de 4
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
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-6">Agenda &middot; Sesión 4</p>
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

      {/* ═══════════════ 3B. ANTES / AHORA — SPLIT VISUAL ═══════════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="mb-10">
            <p className="font-mono text-[0.72rem] uppercase tracking-widest text-orange mb-3">El salto · visualizado</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-3">
              <span className="text-muted/60 line-through decoration-2">Así se veía</span> &nbsp;&nbsp;<span className="text-orange">así se ve ahora</span>
            </h2>
            <p className="text-muted text-[0.9rem] max-w-2xl">
              El mismo analyst. El mismo deal. Dos mundos. Uno con 11 pestañas abiertas y post-its; otro con una conversación.
            </p>
          </div>

          <div className="grid md:grid-cols-[1fr_72px_1fr] gap-4 items-stretch">
            {/* ═══ ANTES ═══ */}
            <div className="relative bg-[#1A1208] border border-orange/15 rounded-2xl overflow-hidden">
              {/* Header bar grayscale */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.05] bg-[rgba(255,95,87,0.06)]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#FF5F57]/60" />
                  <div className="w-2 h-2 rounded-full bg-[#FEBC2E]/60" />
                  <div className="w-2 h-2 rounded-full bg-[#28C840]/60" />
                </div>
                <p className="font-mono text-[0.55rem] text-muted/60 uppercase tracking-wider">Analyst desk · 8:14 am · día 11</p>
                <span className="font-mono text-[0.55rem] text-[#FF5F57]">● RECORDING</span>
              </div>

              {/* Chaos content */}
              <div className="p-4 min-h-[360px] relative">
                {/* Floating browser tabs */}
                <div className="flex gap-1 mb-3 overflow-hidden">
                  {["CIM.pdf", "Financials.xlsx", "KPMG_Audit", "email chain", "Bloomberg", "Term Sheet"].map((t, i) => (
                    <div key={t} className={`font-mono text-[0.55rem] px-2 py-1 rounded-t-md border border-white/[0.05] border-b-0 text-muted/70 whitespace-nowrap ${i === 2 ? "bg-[#2A1D10] text-white-f/80" : "bg-white/[0.02]"}`}>
                      {t}
                    </div>
                  ))}
                  <div className="font-mono text-[0.55rem] px-1.5 py-1 rounded-t-md bg-white/[0.02] border border-white/[0.05] border-b-0 text-muted/50">+5</div>
                </div>

                {/* Fake Excel grid */}
                <div className="bg-white/[0.02] border border-white/[0.05] rounded p-2 mb-3">
                  <div className="grid grid-cols-6 gap-0 text-[0.55rem] font-mono text-muted/60">
                    {["", "A", "B", "C", "D", "E"].map((h, i) => (
                      <div key={i} className="border-b border-white/5 pb-0.5 pl-1 text-muted/40">{h}</div>
                    ))}
                    {["1", "Revenue", "85,400", "92,100", "#REF!", "..."].concat(
                      ["2", "EBITDA", "12,750", "13,400", "??", "..."],
                      ["3", "DSO días", "45", "62", "78 ⚠", "..."],
                      ["4", "Covenant", "3.12×", "3.28×", "3.42×", "..."]
                    ).map((c, i) => (
                      <div key={i} className={`border-b border-white/5 py-0.5 pl-1 ${c.includes("#REF") ? "bg-[#FF5F57]/10 text-[#FF5F57]" : c.includes("??") ? "bg-[#FEBC2E]/10 text-[#FEBC2E]" : c.includes("⚠") ? "text-orange" : "text-white-f/70"} truncate`}>{c}</div>
                    ))}
                  </div>
                </div>

                {/* Stack of papers */}
                <div className="relative mb-3 h-14">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="absolute bg-white/[0.04] border border-white/10 rounded" style={{
                      top: i * 3, left: i * 4, right: 60 - i * 6, height: 44,
                      transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (i + 0.5)}deg)`,
                    }}>
                      <div className="w-full h-1 bg-white/[0.06] mt-2 ml-2" style={{ width: "60%" }} />
                      <div className="w-full h-1 bg-white/[0.04] mt-1 ml-2" style={{ width: "40%" }} />
                      <div className="w-full h-1 bg-white/[0.04] mt-1 ml-2" style={{ width: "70%" }} />
                    </div>
                  ))}
                </div>

                {/* Post-it notes */}
                <div className="flex gap-2 mb-3">
                  <div className="bg-[#FEBC2E]/20 border border-[#FEBC2E]/30 rounded px-2 py-1 text-[0.55rem] text-[#FEBC2E] font-mono rotate-[-3deg]">¿DSO real?</div>
                  <div className="bg-[#FF5F57]/20 border border-[#FF5F57]/30 rounded px-2 py-1 text-[0.55rem] text-[#FF5F57] font-mono rotate-[2deg]">covenant!!</div>
                  <div className="bg-[#00E5A0]/20 border border-[#00E5A0]/30 rounded px-2 py-1 text-[0.55rem] text-[#00E5A0] font-mono rotate-[-1deg]">email DIAN?</div>
                </div>

                {/* Metrics row */}
                <div className="absolute bottom-3 left-4 right-4 grid grid-cols-3 gap-2 font-mono text-[0.6rem]">
                  <div className="bg-[rgba(255,95,87,0.08)] border border-[#FF5F57]/20 rounded px-2 py-1.5">
                    <p className="text-[#FF5F57] mb-0.5">Pestañas</p>
                    <p className="text-white-f font-bold text-sm">11</p>
                  </div>
                  <div className="bg-[rgba(254,188,46,0.08)] border border-[#FEBC2E]/20 rounded px-2 py-1.5">
                    <p className="text-[#FEBC2E] mb-0.5">Café del día</p>
                    <p className="text-white-f font-bold text-sm">4</p>
                  </div>
                  <div className="bg-[rgba(232,90,31,0.08)] border border-orange/20 rounded px-2 py-1.5">
                    <p className="text-orange mb-0.5">Días restantes</p>
                    <p className="text-white-f font-bold text-sm">3</p>
                  </div>
                </div>
              </div>

              {/* Footer badge */}
              <div className="border-t border-white/[0.05] px-4 py-2.5 bg-[rgba(255,95,87,0.04)] flex items-center justify-between">
                <span className="font-mono text-[0.62rem] text-[#FF5F57]/90 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F57] animate-pulse-dot" />
                  Stress level: alto
                </span>
                <span className="font-mono text-[0.62rem] text-muted/60">Tiempo DD: 2 semanas</span>
              </div>
            </div>

            {/* ═══ DIVIDER "→" ═══ */}
            <div className="hidden md:grid place-items-center">
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="font-mono text-[0.55rem] uppercase tracking-widest text-muted/50">Con asistente IA</div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange to-purple grid place-items-center text-white text-2xl shadow-lg shadow-orange/30 animate-glowPulse">→</div>
                  <div className="font-mono text-[0.6rem] text-cyan font-bold">−83%</div>
                  <div className="font-mono text-[0.5rem] text-muted/60 text-center leading-tight">tiempo<br />DD</div>
                </div>
              </div>
            </div>

            {/* Mobile divider */}
            <div className="md:hidden flex items-center justify-center py-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-orange" />
                <span className="font-mono text-[0.6rem] text-cyan font-bold">−83%</span>
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-purple" />
              </div>
            </div>

            {/* ═══ AHORA ═══ */}
            <div className="relative bg-gradient-to-br from-[#0A1238] to-[#0C1130] border border-cyan/25 rounded-2xl overflow-hidden shadow-xl shadow-cyan/5">
              {/* Header chat-style */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.05] bg-[rgba(0,229,160,0.05)]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                  <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                  <div className="w-2 h-2 rounded-full bg-[#28C840]" />
                </div>
                <p className="font-mono text-[0.55rem] text-cyan uppercase tracking-wider">claude.ai · proyecto DD</p>
                <span className="font-mono text-[0.55rem] text-cyan">● FOCUS</span>
              </div>

              {/* Clean chat */}
              <div className="p-4 min-h-[360px] flex flex-col">
                {/* Single user bubble */}
                <div className="flex gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#5B52D5] to-[#3A7BD5] grid place-items-center text-[0.55rem] font-bold text-white flex-shrink-0">M</div>
                  <div className="bg-[rgba(91,82,213,0.08)] border border-[rgba(91,82,213,0.15)] rounded-lg rounded-tl-sm px-3 py-2 text-[0.72rem] text-white-f/90 leading-snug">
                    Top 3 red flags del data room para el IC del jueves.
                  </div>
                </div>

                {/* Clean assistant response */}
                <div className="flex gap-2 mb-3 flex-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange to-[#D4AF4C] grid place-items-center text-[0.6rem] font-bold text-white flex-shrink-0">◉</div>
                  <div className="flex-1 bg-[rgba(232,90,31,0.06)] border border-[rgba(232,90,31,0.15)] rounded-lg rounded-tl-sm px-3 py-2.5">
                    <p className="text-[0.72rem] font-semibold text-orange mb-1.5">3 red flags materiales</p>
                    <div className="space-y-1.5 text-[0.68rem] text-white-f/80">
                      {[
                        { n: 1, t: "DSO deteriorado", c: "CIM p.34" },
                        { n: 2, t: "Covenant breach", c: "Term §4.2" },
                        { n: 3, t: "Contingencia DIAN", c: "Legal §7" },
                      ].map((r) => (
                        <div key={r.n} className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-orange/20 text-orange grid place-items-center text-[0.55rem] font-bold flex-shrink-0">{r.n}</span>
                          <span className="flex-1 font-semibold text-white-f/90">{r.t}</span>
                          <span className="font-mono text-[0.5rem] text-cyan bg-cyan/10 px-1.5 py-0.5 rounded">{r.c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clean metrics row */}
                <div className="mt-auto grid grid-cols-3 gap-2 font-mono text-[0.6rem]">
                  <div className="bg-[rgba(0,229,160,0.06)] border border-cyan/20 rounded px-2 py-1.5">
                    <p className="text-cyan mb-0.5">Pestañas</p>
                    <p className="text-white-f font-bold text-sm">1</p>
                  </div>
                  <div className="bg-[rgba(0,229,160,0.06)] border border-cyan/20 rounded px-2 py-1.5">
                    <p className="text-cyan mb-0.5">Café del día</p>
                    <p className="text-white-f font-bold text-sm">1</p>
                  </div>
                  <div className="bg-[rgba(0,229,160,0.06)] border border-cyan/20 rounded px-2 py-1.5">
                    <p className="text-cyan mb-0.5">Días restantes</p>
                    <p className="text-white-f font-bold text-sm">11</p>
                  </div>
                </div>
              </div>

              {/* Footer badge */}
              <div className="border-t border-white/[0.05] px-4 py-2.5 bg-[rgba(0,229,160,0.04)] flex items-center justify-between">
                <span className="font-mono text-[0.62rem] text-cyan uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" />
                  Stress level: controlado
                </span>
                <span className="font-mono text-[0.62rem] text-muted/60">Tiempo DD: 3 días</span>
              </div>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { k: "Horas totales", antes: "112h", ahora: "18h", color: "#E85A1F" },
              { k: "Docs revisados", antes: "47 manual", ahora: "47 cross-ref", color: "#5B52D5" },
              { k: "Fuentes citadas", antes: "~6 recordadas", ahora: "23 con página", color: "#3A7BD5" },
              { k: "Riesgo omisión", antes: "Alto", ahora: "Bajo", color: "#00E5A0" },
            ].map((m) => (
              <div key={m.k} className="bg-[#0F1438] border border-white/[0.06] rounded-xl p-3">
                <p className="font-mono text-[0.55rem] uppercase tracking-wider text-muted/70 mb-1.5">{m.k}</p>
                <div className="flex items-baseline gap-2 text-[0.75rem]">
                  <span className="text-muted/50 line-through">{m.antes}</span>
                  <span className="text-muted/30">→</span>
                  <span className="font-bold" style={{ color: m.color }}>{m.ahora}</span>
                </div>
              </div>
            ))}
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

          <div className="grid md:grid-cols-[1fr_1.2fr] gap-6">
            {/* Left: visual stack 3D-ish */}
            <div className="relative py-6">
              <div className="absolute left-1/2 top-6 bottom-6 w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              <div className="space-y-2">
                {ASSISTANT_LAYERS.map((l, idx) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLayer(l.id)}
                    className="w-full text-left rounded-xl p-4 border transition-all flex items-center gap-3 relative group"
                    style={{
                      background: activeLayer === l.id ? `linear-gradient(135deg, ${l.color}22, ${l.color}08)` : "#151A3A",
                      borderColor: activeLayer === l.id ? `${l.color}80` : "rgba(255,255,255,0.06)",
                      transform: activeLayer === l.id ? `translateX(${8}px) scale(1.02)` : `translateX(${idx * 4}px)`,
                      boxShadow: activeLayer === l.id ? `0 10px 30px ${l.color}25` : "none",
                    }}
                  >
                    <div className="w-12 h-12 rounded-lg grid place-items-center text-2xl shrink-0" style={{
                      background: `${l.color}18`,
                      color: l.color,
                      border: `1px solid ${l.color}35`,
                    }}>{l.icon}</div>
                    <div className="flex-1">
                      <p className="font-mono text-[0.55rem] uppercase tracking-wider" style={{ color: l.color }}>{l.layer}</p>
                      <p className="text-sm font-semibold text-white-f">{l.title}</p>
                    </div>
                    <span className="font-mono text-[0.55rem] text-muted opacity-0 group-hover:opacity-100 transition-opacity">▸</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: detail + stacked tower visual */}
            <div className="sticky top-20 self-start space-y-4">
              <div className="bg-[#0D1229] border rounded-2xl p-6 md:p-7 relative overflow-hidden" style={{ borderColor: `${activeLayerData.color}40` }}>
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${activeLayerData.color}, transparent 70%)` }} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-xl grid place-items-center text-3xl border" style={{
                      background: `${activeLayerData.color}18`,
                      color: activeLayerData.color,
                      borderColor: `${activeLayerData.color}40`,
                    }}>
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

              {/* Stacked tower mini viz */}
              <div className="bg-[#0D1229] border border-white/[0.06] rounded-2xl p-5">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-3">Stack completo</p>
                <div className="space-y-[3px]">
                  {ASSISTANT_LAYERS.slice().reverse().map((l) => (
                    <div key={l.id} className="h-6 rounded flex items-center px-3 gap-2 transition-all" style={{
                      background: `linear-gradient(90deg, ${l.color}${activeLayer === l.id ? "40" : "15"}, ${l.color}08)`,
                      border: `1px solid ${l.color}${activeLayer === l.id ? "60" : "20"}`,
                      width: `${70 + (ASSISTANT_LAYERS.indexOf(l) * 5)}%`,
                    }}>
                      <span style={{ color: l.color }}>{l.icon}</span>
                      <span className="font-mono text-[0.6rem] text-white-f">{l.title}</span>
                    </div>
                  ))}
                </div>
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

          {/* Mock Claude Projects UI */}
          <div className="mt-10">
            <p className="font-mono text-xs text-cyan uppercase tracking-wider mb-4">◉ Cómo se ve en claude.ai</p>
            <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-[#1a1a1a] shadow-[0_20px_60px_rgba(232,90,31,0.15)]">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0f0f0f] border-b border-white/[0.06]">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                <div className="ml-4 flex-1 max-w-sm bg-[#2a2a2a] rounded-md px-3 py-1 text-[0.65rem] font-mono text-muted">🔒 claude.ai/projects/ma-latam-retail-q2</div>
              </div>
              <div className="grid grid-cols-[180px_1fr_280px] min-h-[380px] text-[0.72rem]">
                {/* Sidebar */}
                <div className="bg-[#0f0f0f] border-r border-white/[0.06] p-3">
                  <div className="flex items-center gap-2 mb-4 px-2">
                    <div className="w-6 h-6 rounded bg-orange/80 grid place-items-center text-xs font-bold text-white">C</div>
                    <span className="font-semibold text-white-f text-xs">Projects</span>
                  </div>
                  <div className="space-y-1">
                    <div className="px-2 py-1.5 rounded bg-orange/20 border border-orange/30 text-orange font-mono text-[0.65rem]">◉ M&amp;A LatAm Retail Q2</div>
                    <div className="px-2 py-1.5 rounded text-muted font-mono text-[0.65rem] hover:bg-white/5">◇ Research Sector Fintech</div>
                    <div className="px-2 py-1.5 rounded text-muted font-mono text-[0.65rem] hover:bg-white/5">◇ Compliance SFC</div>
                    <div className="px-2 py-1.5 rounded text-muted font-mono text-[0.65rem] hover:bg-white/5">◇ IC Memos Template</div>
                  </div>
                  <p className="font-mono text-[0.55rem] text-muted uppercase tracking-wider mt-5 mb-2 px-2">Knowledge (42)</p>
                  <div className="space-y-1">
                    {["CIM Target.pdf", "Financials 2021-25", "Term Sheet Draft", "Audit KPMG 2024", "Comps Retail.xlsx"].map((f) => (
                      <div key={f} className="px-2 py-1 text-[0.6rem] text-muted flex items-center gap-1.5 truncate">
                        <span className="text-orange">📄</span>{f}
                      </div>
                    ))}
                    <div className="px-2 py-1 text-[0.55rem] text-muted italic">+37 más</div>
                  </div>
                </div>
                {/* Chat */}
                <div className="p-5 flex flex-col gap-4 bg-[#171717]">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#2a2a2a] grid place-items-center text-xs shrink-0">👤</div>
                    <div className="bg-[#2a2a2a] rounded-lg px-3 py-2 text-white-f text-[0.72rem] leading-relaxed">
                      Identifica los 3 top red flags financieros del target con cita a página.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-orange/30 grid place-items-center text-xs shrink-0">◉</div>
                    <div className="flex-1 text-white-f text-[0.72rem] leading-relaxed">
                      <p className="mb-2"><span className="font-semibold text-orange">1. Deterioro de working capital</span> — DSO creció de 45 a 78 días entre 2022 y 2024 <span className="font-mono text-[0.6rem] text-cyan">[CIM p.34]</span></p>
                      <p className="mb-2"><span className="font-semibold text-orange">2. Riesgo cambiario sin hedge</span> — 42% revenue USD, costos 100% COP <span className="font-mono text-[0.6rem] text-cyan">[Audit p.12]</span></p>
                      <p><span className="font-semibold text-orange">3. Covenant breach latente</span> — Net Debt/EBITDA 3.8x vs techo 4.0x <span className="font-mono text-[0.6rem] text-cyan">[Term Sheet §4.2]</span></p>
                      <div className="mt-3 inline-flex items-center gap-2 px-2 py-1 rounded bg-cyan/10 border border-cyan/30 text-[0.55rem] font-mono text-cyan animate-pulse-dot">⚡ Artifact generándose...</div>
                    </div>
                  </div>
                </div>
                {/* Artifact panel */}
                <div className="bg-[#0f0f0f] border-l border-white/[0.06] p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[0.55rem] uppercase tracking-wider text-muted">Artifact</span>
                    <span className="font-mono text-[0.55rem] text-cyan">v3</span>
                  </div>
                  <div className="rounded bg-[#1a1a1a] border border-white/[0.06] p-3 text-[0.55rem]">
                    <p className="font-bold text-white-f mb-1">IC Memo · Target LatAm Retail</p>
                    <p className="text-muted leading-snug mb-2">Draft generado · abril 2026</p>
                    <div className="space-y-1">
                      <div className="h-1 bg-orange/40 rounded w-full" />
                      <div className="h-1 bg-orange/40 rounded w-[85%]" />
                      <div className="h-1 bg-orange/40 rounded w-[92%]" />
                      <div className="h-1 bg-orange/20 rounded w-[70%]" />
                      <div className="h-1 bg-orange/20 rounded w-[80%]" />
                    </div>
                    <div className="grid grid-cols-3 gap-1 mt-3">
                      <div className="h-6 bg-orange/20 rounded" />
                      <div className="h-6 bg-purple/20 rounded" />
                      <div className="h-6 bg-cyan/20 rounded" />
                    </div>
                    <p className="font-mono text-[0.5rem] text-muted mt-2">10 páginas · 4 charts · 8 citas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 5B. ASISTENTE EN ACCIÓN — LIVE CHAT DEMO ═══════════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_30%,rgba(232,90,31,0.05),transparent)] pointer-events-none" />

          <div className="relative">
            <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-3">Demo en vivo · DD M&amp;A</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-4">
              47 docs. <span className="text-orange">3 red flags.</span> <span className="text-cyan">2 minutos.</span>
            </h2>
            <p className="text-muted text-[0.95rem] max-w-2xl mb-10">
              Así responde un asistente bien configurado cuando un analyst sube el data room del target y pide red flags para el comité de inversiones.
              Este chat corre en loop — obsérvalo de principio a fin.
            </p>

            <div className="grid lg:grid-cols-[1.55fr_1fr] gap-6 items-start">
              {/* CHAT WINDOW */}
              <div className="bg-[#0C1130] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl shadow-orange/10">
                {/* Chat header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05] bg-[rgba(232,90,31,0.04)]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5A0] animate-pulse-dot" />
                    <p className="font-mono text-[0.65rem] text-muted">claude.ai/projects/cementos-portales-dd</p>
                  </div>
                  <div className="font-mono text-[0.6rem] text-muted/60">· Live demo</div>
                </div>

                {/* Messages */}
                <div className="p-5 space-y-3 min-h-[520px] max-h-[620px] overflow-hidden flex flex-col justify-end bg-gradient-to-b from-transparent to-[rgba(232,90,31,0.02)]">
                  {LIVE_CHAT.slice(0, chatVisible).map((m, i) => {
                    const isLast = i === chatVisible - 1;
                    if (m.role === "user") {
                      return (
                        <div key={i} className="flex gap-3 animate-fadeUp">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5B52D5] to-[#3A7BD5] grid place-items-center text-white font-bold text-sm flex-shrink-0">{m.avatar}</div>
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-xs font-semibold text-white-f">{m.name}</span>
                              <span className="font-mono text-[0.6rem] text-muted/70">{m.time}</span>
                            </div>
                            <div className="bg-[rgba(91,82,213,0.12)] border border-[rgba(91,82,213,0.2)] rounded-xl rounded-tl-sm px-4 py-2.5 text-[0.85rem] text-white-f leading-relaxed">
                              {m.text}
                              {isLast && <span className="inline-block w-1.5 h-4 bg-[#5B52D5] ml-1 align-middle animate-blink" />}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    if (m.role === "tool") {
                      return (
                        <div key={i} className="flex gap-3 animate-fadeUp ml-12">
                          <div className="flex items-center gap-2 bg-[rgba(0,229,160,0.08)] border border-[rgba(0,229,160,0.2)] rounded-full px-3 py-1.5 text-[0.72rem] text-white-f">
                            <span className="text-sm">{m.icon}</span>
                            <span>{m.text}</span>
                            {isLast && <span className="w-1 h-1 rounded-full bg-[#00E5A0] animate-pulse-dot" />}
                          </div>
                        </div>
                      );
                    }
                    if (m.role === "assistant") {
                      return (
                        <div key={i} className="flex gap-3 animate-fadeUp">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E85A1F] to-[#D4AF4C] grid place-items-center text-white font-bold text-base flex-shrink-0">{m.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-xs font-semibold text-orange">{m.name}</span>
                              <span className="font-mono text-[0.6rem] text-muted/70">{m.time}</span>
                            </div>
                            <div className="bg-[rgba(232,90,31,0.08)] border border-[rgba(232,90,31,0.2)] rounded-xl rounded-tl-sm px-4 py-3 text-[0.85rem] text-white-f leading-relaxed whitespace-pre-line">
                              {m.text.split("\n").map((ln, k) => {
                                if (ln.startsWith("**") && ln.endsWith("**")) {
                                  return <div key={k} className="font-bold text-white-f text-[0.9rem] my-2 first:mt-0">{ln.replaceAll("**", "")}</div>;
                                }
                                return <div key={k}>{ln}</div>;
                              })}
                              {isLast && <span className="inline-block w-1.5 h-4 bg-orange ml-1 align-middle animate-blink" />}
                              {m.citations && (
                                <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                                  {m.citations.map((c) => (
                                    <span key={c} className="font-mono text-[0.6rem] px-2 py-0.5 bg-cyan/10 border border-cyan/20 rounded-sm text-cyan">
                                      📎 {c}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    // artifact
                    return (
                      <div key={i} className="flex gap-3 animate-fadeUp ml-12">
                        <div className="flex-1 bg-gradient-to-br from-[rgba(0,229,160,0.1)] to-[rgba(58,123,213,0.08)] border border-[rgba(0,229,160,0.25)] rounded-xl p-3.5 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[rgba(0,229,160,0.15)] border border-[rgba(0,229,160,0.3)] grid place-items-center text-cyan text-lg">▣</div>
                          <div className="flex-1">
                            <p className="text-[0.85rem] font-semibold text-white-f">{m.title}</p>
                            <p className="font-mono text-[0.6rem] text-muted">{m.subtitle}</p>
                          </div>
                          <button className="text-[0.65rem] font-mono px-3 py-1 rounded-md bg-cyan/15 border border-cyan/30 text-cyan hover:bg-cyan/25 transition-all">ABRIR</button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing indicator when preparing next message */}
                  {chatVisible > 0 && chatVisible < LIVE_CHAT.length && (
                    <div className="flex gap-3 ml-12 opacity-70">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse-dot" style={{ animationDelay: "0s" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat footer input */}
                <div className="px-5 py-3 border-t border-white/[0.05] bg-[rgba(15,20,55,0.5)] flex items-center gap-2">
                  <div className="flex-1 text-[0.75rem] text-muted/50 font-mono">Preguntar al DD Assistant…</div>
                  <div className="flex gap-1.5">
                    <span className="font-mono text-[0.55rem] px-2 py-0.5 bg-white/[0.04] border border-white/[0.08] rounded-sm text-muted/60">📂 47 docs</span>
                    <span className="font-mono text-[0.55rem] px-2 py-0.5 bg-white/[0.04] border border-white/[0.08] rounded-sm text-muted/60">⚡ Python</span>
                    <span className="font-mono text-[0.55rem] px-2 py-0.5 bg-white/[0.04] border border-white/[0.08] rounded-sm text-muted/60">🧠 Extended</span>
                  </div>
                </div>
              </div>

              {/* IMPACT SIDEBAR */}
              <div className="space-y-4">
                {/* Headline ROI */}
                <div className="relative bg-gradient-to-br from-[#0F1438] to-[#080C1F] border border-orange/30 rounded-2xl p-6 overflow-hidden">
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-orange/10 blur-3xl" />
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-orange mb-2">Horas ahorradas · mes</p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-5xl font-bold text-white-f tabular-nums">{roiHours}</span>
                    <span className="text-lg text-orange font-mono">h</span>
                  </div>
                  <p className="text-[0.75rem] text-muted">Equipo de 6 analysts en IB. DD M&amp;A típica 3 deals/mes.</p>
                  <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[0.6rem] text-muted/70 uppercase tracking-wider mb-0.5">Antes</p>
                      <p className="text-sm font-bold text-white/50 line-through">2 semanas</p>
                    </div>
                    <div>
                      <p className="text-[0.6rem] text-cyan uppercase tracking-wider mb-0.5">Con asistente</p>
                      <p className="text-sm font-bold text-cyan">3 días</p>
                    </div>
                  </div>
                </div>

                {/* What just happened */}
                <div className="bg-[#0F1438] border border-white/[0.06] rounded-2xl p-5">
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-cyan mb-3">Qué pasó bajo el capó</p>
                  <ul className="space-y-2.5 text-[0.78rem] text-white-f">
                    {[
                      { k: "Leyó", v: "3,420 páginas en 47 docs" },
                      { k: "Comparó", v: "DSO histórico vs 2 peers" },
                      { k: "Ejecutó", v: "Python para calcular ratio covenant" },
                      { k: "Cruzó", v: "CIM + KPMG + Legal + email DIAN" },
                      { k: "Citó", v: "4 fuentes con página exacta" },
                      { k: "Generó", v: "Artifact exportable en 1 click" },
                    ].map((s) => (
                      <li key={s.k} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange mt-1.5 flex-shrink-0" />
                        <span className="leading-snug"><span className="font-mono text-[0.7rem] text-orange mr-1.5">{s.k}</span>{s.v}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Credibility strip */}
                <div className="bg-[rgba(0,229,160,0.06)] border border-[rgba(0,229,160,0.2)] rounded-xl p-4 flex items-center gap-3">
                  <span className="text-xl">🎯</span>
                  <div className="flex-1">
                    <p className="text-[0.75rem] font-semibold text-white-f leading-tight">El analyst no lee menos.</p>
                    <p className="text-[0.7rem] text-muted leading-tight mt-0.5">Verifica lo que importa — el asistente le dice dónde mirar primero.</p>
                  </div>
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
            <div className="grid md:grid-cols-[1fr_1.3fr] gap-6 items-center">
              {/* Mini mockup per type */}
              <div className="rounded-xl p-4 border border-white/[0.06]" style={{ background: `linear-gradient(135deg, ${ARTIFACT_TYPES[activeArtifact].color}12, transparent)` }}>
                {activeArtifact === 0 && (
                  <div className="bg-[#fafafa] rounded-lg p-4 text-[0.6rem] text-[#1a1a1a] space-y-1.5">
                    <p className="font-bold text-[#E85A1F]">IC MEMO · TARGET LATAM RETAIL</p>
                    <p className="text-[0.5rem] text-gray-500">abril 2026 · BTG Pactual</p>
                    <div className="h-px bg-gray-300 my-2" />
                    <p className="font-bold">1. Investment Thesis</p>
                    <div className="h-1 bg-gray-300 rounded w-full" />
                    <div className="h-1 bg-gray-300 rounded w-[92%]" />
                    <div className="h-1 bg-gray-300 rounded w-[85%]" />
                    <p className="font-bold mt-2">2. Key Risks</p>
                    <div className="h-1 bg-gray-300 rounded w-[95%]" />
                    <div className="h-1 bg-gray-300 rounded w-[78%]" />
                    <p className="font-bold mt-2">3. Comparable Companies</p>
                    <div className="grid grid-cols-3 gap-1 mt-1">
                      <div className="h-8 bg-[#E85A1F]/20 rounded" />
                      <div className="h-8 bg-[#5B52D5]/20 rounded" />
                      <div className="h-8 bg-[#00E5A0]/20 rounded" />
                    </div>
                  </div>
                )}
                {activeArtifact === 1 && (
                  <div className="bg-[#0a0a0a] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-mono text-[0.55rem] text-white">Deal Tracker · Q2 2026</p>
                      <span className="text-[0.5rem] text-[#5B52D5]">Live</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 mb-2">
                      {[
                        { v: "12", l: "Active", c: "#5B52D5" },
                        { v: "$2.1B", l: "Pipeline", c: "#00E5A0" },
                        { v: "4", l: "Closing", c: "#E85A1F" },
                      ].map((k) => (
                        <div key={k.l} className="rounded p-1.5" style={{ background: `${k.c}20` }}>
                          <p className="font-bold text-[0.65rem]" style={{ color: k.c }}>{k.v}</p>
                          <p className="text-[0.45rem] text-muted uppercase">{k.l}</p>
                        </div>
                      ))}
                    </div>
                    <svg viewBox="0 0 200 60" className="w-full h-14">
                      <polyline points="0,50 30,35 60,40 90,25 120,30 150,15 180,20 200,10" fill="none" stroke="#5B52D5" strokeWidth="2" />
                      <polyline points="0,50 30,35 60,40 90,25 120,30 150,15 180,20 200,10" fill="url(#g1)" stroke="none" strokeWidth="0" />
                      <defs>
                        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#5B52D5" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#5B52D5" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )}
                {activeArtifact === 2 && (
                  <div className="bg-[#0a0a0a] rounded-lg p-3 font-mono text-[0.55rem]">
                    <div className="flex gap-1 mb-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500/60" />
                      <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                      <span className="w-2 h-2 rounded-full bg-green-500/60" />
                      <span className="ml-2 text-muted text-[0.5rem]">dcf_model.py</span>
                    </div>
                    <p><span className="text-[#c678dd]">import</span> <span className="text-[#e06c75]">numpy</span> <span className="text-[#c678dd]">as</span> np</p>
                    <p><span className="text-[#c678dd]">def</span> <span className="text-[#61afef]">dcf</span>(fcf, wacc, g, n):</p>
                    <p className="pl-3">pv = <span className="text-[#98c379]">sum</span>(f / (<span className="text-[#d19a66]">1</span> + wacc)**i</p>
                    <p className="pl-12"><span className="text-[#c678dd]">for</span> i, f <span className="text-[#c678dd]">in</span> enumerate(fcf, <span className="text-[#d19a66]">1</span>))</p>
                    <p className="pl-3">tv = fcf[-<span className="text-[#d19a66]">1</span>]*(<span className="text-[#d19a66]">1</span>+g)/(wacc-g)</p>
                    <p className="pl-3"><span className="text-[#c678dd]">return</span> pv + tv/(<span className="text-[#d19a66]">1</span>+wacc)**n</p>
                    <p className="mt-2 text-[#98c379]"># EV = $428M · Equity = $382M</p>
                    <div className="mt-2 h-1 bg-[#3A7BD5]/40 rounded" />
                  </div>
                )}
                {activeArtifact === 3 && (
                  <div className="bg-[#0a0a0a] rounded-lg p-3">
                    <p className="font-mono text-[0.55rem] text-white-f mb-2">EV Waterfall · $MM</p>
                    <svg viewBox="0 0 200 100" className="w-full">
                      {[
                        { x: 0, h: 80, c: "#00E5A0", l: "EV" },
                        { x: 35, h: -15, y: 5, c: "#E85A1F", l: "Debt" },
                        { x: 70, h: -10, y: 20, c: "#E85A1F", l: "Tax" },
                        { x: 105, h: -8, y: 30, c: "#E85A1F", l: "Min" },
                        { x: 140, h: 8, y: 30, c: "#22C55E", l: "Cash" },
                        { x: 175, h: 55, c: "#5B52D5", l: "Eq" },
                      ].map((b, i) => (
                        <g key={i}>
                          <rect x={b.x} y={b.y ?? (100 - b.h)} width="25" height={Math.abs(b.h)} fill={b.c} opacity="0.7" />
                          <text x={b.x + 12} y="96" fill="#7a82a0" fontSize="5" textAnchor="middle" fontFamily="monospace">{b.l}</text>
                        </g>
                      ))}
                      <line x1="0" y1="90" x2="200" y2="90" stroke="#333" strokeWidth="0.5" />
                    </svg>
                  </div>
                )}
                {activeArtifact === 4 && (
                  <div className="bg-gradient-to-br from-[#0a0a0a] to-[#151A3A] rounded-lg p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-mono text-[0.55rem] text-white-f">Pitch · IC 04/15</p>
                      <span className="font-mono text-[0.5rem] text-muted">3/12</span>
                    </div>
                    <div className="bg-[#151A3A] rounded p-3 border border-[#D4AF4C]/20">
                      <p className="font-bold text-[#D4AF4C] text-[0.65rem] mb-1">Investment Thesis</p>
                      <p className="text-[0.55rem] text-white-f mb-2">Consolidador regional de retail con 18% EBITDA margin.</p>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="h-6 bg-[#D4AF4C]/20 rounded" />
                        <div className="h-6 bg-[#5B52D5]/20 rounded" />
                      </div>
                      <div className="h-8 bg-[#E85A1F]/15 rounded mt-1" />
                    </div>
                  </div>
                )}
                {activeArtifact === 5 && (
                  <div className="bg-[#0a0a0a] rounded-lg p-3">
                    <p className="font-mono text-[0.55rem] text-white-f mb-2">DCF Calculator</p>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[0.5rem] text-muted mb-0.5"><span>WACC</span><span className="text-[#9B59B6]">10.5%</span></div>
                        <div className="h-1.5 rounded bg-white/5 relative">
                          <div className="absolute left-0 top-0 h-full rounded bg-[#9B59B6]" style={{ width: "50%" }} />
                          <div className="absolute top-1/2 w-2.5 h-2.5 rounded-full bg-[#9B59B6] border border-white" style={{ left: "calc(50% - 5px)", transform: "translateY(-50%)" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[0.5rem] text-muted mb-0.5"><span>Terminal g</span><span className="text-[#9B59B6]">3.0%</span></div>
                        <div className="h-1.5 rounded bg-white/5 relative">
                          <div className="absolute left-0 top-0 h-full rounded bg-[#9B59B6]" style={{ width: "40%" }} />
                          <div className="absolute top-1/2 w-2.5 h-2.5 rounded-full bg-[#9B59B6] border border-white" style={{ left: "calc(40% - 5px)", transform: "translateY(-50%)" }} />
                        </div>
                      </div>
                      <div className="mt-3 p-2 rounded bg-[#9B59B6]/15 border border-[#9B59B6]/30">
                        <p className="font-mono text-[0.5rem] text-muted">Enterprise Value</p>
                        <p className="font-bold text-sm text-[#9B59B6]">$428.3M</p>
                      </div>
                    </div>
                  </div>
                )}
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

            {/* Visual output per case */}
            <div className="bg-[#0a0f1f] rounded-xl p-5 border border-white/[0.04] mb-5">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-3">Visualización generada</p>
              {activeCase === 0 && (
                <svg viewBox="0 0 400 140" className="w-full h-36">
                  <line x1="40" y1="20" x2="40" y2="120" stroke="#2a2a2a" strokeWidth="1" />
                  <line x1="40" y1="120" x2="380" y2="120" stroke="#2a2a2a" strokeWidth="1" />
                  {[6.1, 7.0, 8.2, 9.5, 11.3].map((v, i) => {
                    const y = 40 + i * 12;
                    return (
                      <g key={i}>
                        <line x1="80" y1={y} x2="340" y2={y} stroke="#E85A1F" strokeOpacity="0.15" strokeWidth="1" />
                      </g>
                    );
                  })}
                  <rect x="120" y="48" width="200" height="30" fill="#E85A1F" fillOpacity="0.25" stroke="#E85A1F" strokeWidth="1.5" />
                  <line x1="200" y1="48" x2="200" y2="78" stroke="#E85A1F" strokeWidth="2" />
                  <line x1="80" y1="63" x2="120" y2="63" stroke="#E85A1F" strokeWidth="1" />
                  <line x1="320" y1="63" x2="360" y2="63" stroke="#E85A1F" strokeWidth="1" />
                  <line x1="80" y1="55" x2="80" y2="71" stroke="#E85A1F" strokeWidth="1" />
                  <line x1="360" y1="55" x2="360" y2="71" stroke="#E85A1F" strokeWidth="1" />
                  <text x="80" y="135" fill="#7a82a0" fontSize="9" textAnchor="middle" fontFamily="monospace">6.1x</text>
                  <text x="200" y="135" fill="#E85A1F" fontSize="10" textAnchor="middle" fontFamily="monospace">8.2x median</text>
                  <text x="360" y="135" fill="#7a82a0" fontSize="9" textAnchor="middle" fontFamily="monospace">11.3x</text>
                  <text x="200" y="30" fill="#f0f2f8" fontSize="10" textAnchor="middle" fontFamily="monospace">EV/EBITDA · 15 comps</text>
                </svg>
              )}
              {activeCase === 1 && (
                <div className="space-y-1.5">
                  <div className="grid grid-cols-[120px_repeat(4,1fr)] gap-2 text-[0.65rem] font-mono">
                    <div className="text-muted">Segmento</div>
                    <div className="text-muted text-right">Q1 25</div>
                    <div className="text-muted text-right">Q1 26</div>
                    <div className="text-muted text-right">Guidance Q2 26</div>
                    <div className="text-muted text-right">Δ</div>
                  </div>
                  {[
                    { seg: "Retail", a: 142, b: 168, g: 182, d: "+8%" },
                    { seg: "Wholesale", a: 89, b: 94, g: 98, d: "+4%" },
                    { seg: "Digital", a: 31, b: 48, g: 62, d: "+29%" },
                    { seg: "International", a: 22, b: 28, g: 35, d: "+25%" },
                  ].map((r) => (
                    <div key={r.seg} className="grid grid-cols-[120px_repeat(4,1fr)] gap-2 text-[0.7rem] items-center">
                      <div className="text-white-f">{r.seg}</div>
                      <div className="text-muted text-right">${r.a}M</div>
                      <div className="text-muted text-right">${r.b}M</div>
                      <div className="text-white-f text-right font-semibold">${r.g}M</div>
                      <div className="text-[#5B52D5] text-right font-mono font-bold">{r.d}</div>
                    </div>
                  ))}
                </div>
              )}
              {activeCase === 2 && (
                <svg viewBox="0 0 400 140" className="w-full h-36">
                  {["WACC", "Revenue g", "EBITDA margin", "Terminal g", "Capex", "WC days", "Tax rate", "Currency"].map((label, i) => {
                    const y = 15 + i * 14;
                    const width = [80, 65, 55, 45, 35, 28, 20, 15][i];
                    return (
                      <g key={i}>
                        <rect x={200 - width} y={y} width={width * 2} height="10" fill="#3A7BD5" fillOpacity={0.35 + (8 - i) * 0.04} rx="2" />
                        <text x="10" y={y + 8} fill="#f0f2f8" fontSize="8" fontFamily="monospace">{label}</text>
                        <text x={200 + width + 4} y={y + 8} fill="#3A7BD5" fontSize="8" fontFamily="monospace">±{width}M</text>
                      </g>
                    );
                  })}
                  <line x1="200" y1="10" x2="200" y2="130" stroke="#f0f2f8" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="200" y="138" fill="#7a82a0" fontSize="7" textAnchor="middle" fontFamily="monospace">Base: EV $428M</text>
                </svg>
              )}
              {activeCase === 3 && (
                <div className="grid grid-cols-2 gap-3">
                  <svg viewBox="0 0 180 120" className="w-full">
                    <text x="90" y="12" fill="#f0f2f8" fontSize="9" textAnchor="middle" fontFamily="monospace">Exposición por sector</text>
                    {[
                      { label: "Tech", v: 28, c: "#00E5A0" },
                      { label: "Finan", v: 22, c: "#5B52D5" },
                      { label: "Cons", v: 18, c: "#E85A1F" },
                      { label: "Health", v: 14, c: "#3A7BD5" },
                      { label: "Energy", v: 10, c: "#D4AF4C" },
                      { label: "Other", v: 8, c: "#7a82a0" },
                    ].reduce<{ items: React.ReactNode[]; cum: number }>((acc, s, i) => {
                      const width = s.v * 1.6;
                      const el = (
                        <g key={i}>
                          <rect x={acc.cum} y="25" width={width} height="15" fill={s.c} fillOpacity="0.7" />
                          <text x={acc.cum + width / 2} y="52" fill="#f0f2f8" fontSize="6" textAnchor="middle" fontFamily="monospace">{s.label}</text>
                          <text x={acc.cum + width / 2} y="60" fill={s.c} fontSize="6" textAnchor="middle" fontFamily="monospace">{s.v}%</text>
                        </g>
                      );
                      return { items: [...acc.items, el], cum: acc.cum + width };
                    }, { items: [], cum: 10 }).items}
                  </svg>
                  <svg viewBox="0 0 180 120" className="w-full">
                    <text x="90" y="12" fill="#f0f2f8" fontSize="9" textAnchor="middle" fontFamily="monospace">Por país</text>
                    {[
                      { label: "COL", v: 48, c: "#00E5A0" },
                      { label: "BRA", v: 22, c: "#5B52D5" },
                      { label: "MEX", v: 12, c: "#E85A1F" },
                      { label: "CHL", v: 10, c: "#3A7BD5" },
                      { label: "Other", v: 8, c: "#D4AF4C" },
                    ].map((c, i) => {
                      const y = 25 + i * 16;
                      return (
                        <g key={i}>
                          <rect x="40" y={y} width={c.v * 2.5} height="10" fill={c.c} fillOpacity="0.7" />
                          <text x="35" y={y + 8} fill="#f0f2f8" fontSize="7" textAnchor="end" fontFamily="monospace">{c.label}</text>
                          <text x={42 + c.v * 2.5} y={y + 8} fill={c.c} fontSize="7" fontFamily="monospace">{c.v}%</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}
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
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-4">Radar de capacidades (1–5)</p>
              {(() => {
                const keys = Object.keys(TOOL_COMPARE[activeCompare].scores) as (keyof typeof TOOL_COMPARE[0]["scores"])[];
                const cx = 175, cy = 175, maxR = 130;
                const angle = (i: number) => (i / keys.length) * Math.PI * 2 - Math.PI / 2;
                const point = (r: number, i: number) => `${cx + Math.cos(angle(i)) * r},${cy + Math.sin(angle(i)) * r}`;
                const color = TOOL_COMPARE[activeCompare].color;
                return (
                  <svg viewBox="0 0 350 350" className="w-full max-w-[360px] mx-auto">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <polygon
                        key={lvl}
                        points={keys.map((_, i) => point((maxR / 5) * lvl, i)).join(" ")}
                        fill="none"
                        stroke="#ffffff"
                        strokeOpacity="0.08"
                        strokeWidth="1"
                      />
                    ))}
                    {keys.map((_, i) => (
                      <line key={i} x1={cx} y1={cy} x2={point(maxR, i).split(",")[0]} y2={point(maxR, i).split(",")[1]} stroke="#ffffff" strokeOpacity="0.08" />
                    ))}
                    {/* All 4 tools as faint overlays */}
                    {TOOL_COMPARE.map((t, idx) => {
                      const scoreVals = keys.map((k) => t.scores[k]);
                      const poly = keys.map((_, i) => point((scoreVals[i] / 5) * maxR, i)).join(" ");
                      const isActive = idx === activeCompare;
                      return (
                        <polygon
                          key={t.name}
                          points={poly}
                          fill={isActive ? `${t.color}40` : "transparent"}
                          stroke={isActive ? t.color : `${t.color}25`}
                          strokeWidth={isActive ? 2.5 : 1}
                          strokeLinejoin="round"
                        />
                      );
                    })}
                    {/* Active dots */}
                    {keys.map((k, i) => {
                      const v = TOOL_COMPARE[activeCompare].scores[k];
                      const [px, py] = point((v / 5) * maxR, i).split(",");
                      return <circle key={k} cx={px} cy={py} r={4} fill={color} />;
                    })}
                    {/* Labels */}
                    {keys.map((k, i) => {
                      const [lx, ly] = point(maxR + 18, i).split(",");
                      return (
                        <text key={k} x={lx} y={ly} fill="#c5cae0" fontSize="11" textAnchor="middle" dominantBaseline="middle" fontFamily="monospace">
                          {SCORE_LABELS[k]}
                        </text>
                      );
                    })}
                  </svg>
                );
              })()}
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {TOOL_COMPARE.map((t, i) => (
                  <div key={t.name} className="flex items-center gap-1.5" style={{ opacity: i === activeCompare ? 1 : 0.35 }}>
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: t.color }} />
                    <span className="font-mono text-[0.6rem] text-white-f">{t.name.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0D1229] border rounded-2xl p-6 md:p-8" style={{ borderColor: `${TOOL_COMPARE[activeCompare].color}30` }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl" style={{ color: TOOL_COMPARE[activeCompare].color }}>{TOOL_COMPARE[activeCompare].icon}</span>
                <h3 className="text-xl font-bold text-white-f">{TOOL_COMPARE[activeCompare].name}</h3>
              </div>
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-2">Sweet spot</p>
              <p className="text-sm text-white-f leading-relaxed mb-5">{TOOL_COMPARE[activeCompare].best}</p>

              {/* Score pills */}
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-3">Breakdown</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(TOOL_COMPARE[activeCompare].scores) as (keyof typeof TOOL_COMPARE[0]["scores"])[]).map((k) => {
                  const v = TOOL_COMPARE[activeCompare].scores[k];
                  return (
                    <div key={k} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg" style={{ background: `${TOOL_COMPARE[activeCompare].color}0F` }}>
                      <span className="text-[0.68rem] text-white-f">{SCORE_LABELS[k]}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <div key={n} className="w-1 h-3 rounded-sm" style={{
                            background: n <= v ? TOOL_COMPARE[activeCompare].color : "rgba(255,255,255,0.08)",
                          }} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 10B. PLATAFORMAS DISPONIBLES ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] uppercase tracking-widest text-cyan mb-3">Estado mayo 2026 · plataformas free / freemium</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-4">
            7 asistentes <span className="bg-gradient-to-r from-cyan to-orange bg-clip-text text-transparent">que abrimos en clase</span>
          </h2>
          <p className="text-muted text-base max-w-3xl mb-10 leading-relaxed">
            Cada uno con su sweet spot. Todos accesibles con cuenta gratuita o tier de prueba. Sin instalaciones locales, sin servidores, sin tarjeta de crédito para arrancar.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {Object.entries(TOOLS).map(([k, t]) => (
              <a
                key={k}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#0F1438] border rounded-xl p-3 transition-all hover:-translate-y-1"
                style={{ borderColor: `${t.color}25` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-8 h-8 rounded-lg grid place-items-center font-bold text-base"
                    style={{ background: `${t.color}25`, color: t.color }}
                  >
                    {t.mark}
                  </div>
                  <span className="font-mono text-[0.5rem] tracking-widest text-muted/60 group-hover:text-white-f">↗</span>
                </div>
                <p className="text-[0.78rem] font-semibold text-white-f mb-0.5 leading-tight">{t.short}</p>
                <p className="font-mono text-[0.55rem] text-muted/70 mb-1.5">{t.tier}</p>
                <p className="font-mono text-[0.55rem]" style={{ color: t.color }}>ctx {t.ctx}</p>
              </a>
            ))}
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            <div className="bg-[#0D1229] border border-cyan/20 rounded-xl p-4">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-cyan mb-1.5">Regla simple</p>
              <p className="text-[0.78rem] text-white-f/85 leading-relaxed">Si el documento pasa de 80 páginas, ve a <span className="font-bold">Kimi</span>. Si necesitas correr código en Excel, ve a <span className="font-bold">ChatGPT</span> o <span className="font-bold">Mistral</span>.</p>
            </div>
            <div className="bg-[#0D1229] border border-orange/20 rounded-xl p-4">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-orange mb-1.5">Para citas verificables</p>
              <p className="text-[0.78rem] text-white-f/85 leading-relaxed"><span className="font-bold">NotebookLM</span> cita la fuente literal. <span className="font-bold">Claude</span> también lo hace bien con docs largos.</p>
            </div>
            <div className="bg-[#0D1229] border border-purple/20 rounded-xl p-4">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-purple-light mb-1.5">Segunda opinión</p>
              <p className="text-[0.78rem] text-white-f/85 leading-relaxed">Cuando la decisión es material, corre el mismo prompt en <span className="font-bold">DeepSeek</span> + <span className="font-bold">Mistral</span> + <span className="font-bold">Claude</span> y compara.</p>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 10C. GALERÍA · 6 FLUJOS EN FINANZAS ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] uppercase tracking-widest text-cyan mb-3">Galería · 6 flujos con archivos descargables</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-4">
            Cada caso trae <span className="bg-gradient-to-r from-cyan to-orange bg-clip-text text-transparent">archivo + prompt + plataforma</span>
          </h2>
          <p className="text-muted text-base max-w-3xl mb-10 leading-relaxed">
            Descarga el Excel o Word, copia el prompt, abre la plataforma y sube el archivo. En menos de 5 minutos tienes un demo funcionando con datos sintéticos pensados para banca.
          </p>

          {/* Selector de casos */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
            {FINANCE_CASES.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveFinanceCase(c.id)}
                className="rounded-xl p-3 border transition-all text-left"
                style={{
                  background: activeFinanceCase === c.id ? `${c.color}18` : "#151A3A",
                  borderColor: activeFinanceCase === c.id ? `${c.color}70` : "rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[0.55rem] tracking-widest text-muted/70">{c.num}</span>
                  <span className="text-lg" style={{ color: c.color }}>{c.icon}</span>
                </div>
                <p className="text-[0.7rem] font-semibold text-white-f leading-tight">{c.title.split(" ").slice(0, 4).join(" ")}…</p>
                <p className="font-mono text-[0.55rem] text-muted/70 mt-1">{c.line}</p>
              </button>
            ))}
          </div>

          {/* Detalle del caso activo */}
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-6">
            {/* Workflow + descarga + prompt */}
            <div className="bg-[#0D1229] border rounded-2xl p-6 md:p-8" style={{ borderColor: `${activeFinanceCaseData.color}30` }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest" style={{ color: activeFinanceCaseData.color }}>
                    Caso {activeFinanceCaseData.num} · {activeFinanceCaseData.line}
                  </p>
                  <h3 className="text-2xl font-bold text-white-f mt-2 leading-tight">{activeFinanceCaseData.title}</h3>
                </div>
                <span className="text-3xl flex-shrink-0 ml-4" style={{ color: activeFinanceCaseData.color }}>{activeFinanceCaseData.icon}</span>
              </div>

              {/* Problem */}
              <p className="text-[0.85rem] text-white-f/85 leading-relaxed italic mb-5 pl-3 border-l-2" style={{ borderColor: activeFinanceCaseData.color }}>
                &ldquo;{activeFinanceCaseData.problem}&rdquo;
              </p>

              {/* Plataformas sugeridas */}
              <div className="mb-5">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted/70 mb-2">Plataforma recomendada · alternativas</p>
                <div className="flex flex-wrap gap-2">
                  {[activeFinanceCaseData.primary, ...activeFinanceCaseData.alt].map((tk, idx) => {
                    const tool = TOOLS[tk];
                    if (!tool) return null;
                    const primary = idx === 0;
                    return (
                      <a
                        key={tk}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all hover:scale-105"
                        style={{
                          background: primary ? `${tool.color}25` : `${tool.color}10`,
                          borderColor: primary ? `${tool.color}70` : `${tool.color}30`,
                        }}
                      >
                        <span
                          className="w-5 h-5 rounded grid place-items-center text-[0.7rem] font-bold"
                          style={{ background: tool.color, color: "#fff" }}
                        >
                          {tool.mark}
                        </span>
                        <span className="text-[0.75rem] font-semibold" style={{ color: tool.color }}>{tool.short}</span>
                        {primary && <span className="font-mono text-[0.55rem] text-white-f/60">★</span>}
                        <span className="text-[0.6rem] text-muted/60 group-hover:text-white-f">↗</span>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Descarga */}
              <div className="mb-5">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted/70 mb-2">Archivo para descargar</p>
                <div className="space-y-2">
                  {activeFinanceCaseData.files.map((f) => (
                    <a
                      key={f.file}
                      href={`/sesion-4/${f.file}`}
                      download
                      className="group flex items-center gap-3 px-4 py-3 rounded-lg border transition-all hover:scale-[1.01]"
                      style={{
                        background: `${activeFinanceCaseData.color}10`,
                        borderColor: `${activeFinanceCaseData.color}40`,
                      }}
                    >
                      <span
                        className="w-10 h-10 rounded-lg grid place-items-center text-base font-bold"
                        style={{ background: `${activeFinanceCaseData.color}25`, color: activeFinanceCaseData.color }}
                      >
                        {f.kind === "Excel" ? "📊" : "📄"}
                      </span>
                      <div className="flex-1">
                        <p className="text-[0.85rem] font-semibold text-white-f">{f.name}</p>
                        <p className="font-mono text-[0.6rem] text-muted/70">{f.kind} · {f.size} · {f.file}</p>
                      </div>
                      <span
                        className="font-mono text-[0.65rem] px-2 py-1 rounded uppercase tracking-widest font-bold group-hover:scale-110 transition-transform"
                        style={{ background: activeFinanceCaseData.color, color: "#000" }}
                      >
                        ↓ descargar
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Workflow steps */}
              <div className="mb-5">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted/70 mb-2">Cómo seguirlo · 4 pasos</p>
                <ol className="space-y-2">
                  {activeFinanceCaseData.workflow.map((step, i) => (
                    <li key={i} className="flex gap-3 text-[0.82rem] text-white-f/85 leading-relaxed">
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full grid place-items-center text-[0.6rem] font-mono font-bold"
                        style={{ background: `${activeFinanceCaseData.color}20`, color: activeFinanceCaseData.color }}
                      >
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Prompt copiable */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted/70">Prompt listo · copia y pega</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activeFinanceCaseData.prompt);
                      setCopiedPrompt(activeFinanceCaseData.id);
                      setTimeout(() => setCopiedPrompt(null), 2000);
                    }}
                    className="font-mono text-[0.6rem] tracking-widest uppercase px-3 py-1 rounded-md font-bold transition-all"
                    style={{
                      background: copiedPrompt === activeFinanceCaseData.id ? "#22C55E" : activeFinanceCaseData.color,
                      color: copiedPrompt === activeFinanceCaseData.id ? "#000" : "#000",
                    }}
                  >
                    {copiedPrompt === activeFinanceCaseData.id ? "✓ copiado" : "⎘ copiar"}
                  </button>
                </div>
                <pre
                  className="bg-[#080C1F] border rounded-lg p-4 font-mono text-[0.7rem] text-white-f/85 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto"
                  style={{ borderColor: `${activeFinanceCaseData.color}30` }}
                >
                  {activeFinanceCaseData.prompt}
                </pre>
              </div>
            </div>

            {/* Sidebar: por qué + métrica + output */}
            <div className="space-y-4">
              <div
                className="rounded-2xl p-6 text-center"
                style={{
                  background: `linear-gradient(135deg, ${activeFinanceCaseData.color}25, ${activeFinanceCaseData.color}08)`,
                  border: `1px solid ${activeFinanceCaseData.color}40`,
                }}
              >
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted mb-2">Impacto</p>
                <p className="text-5xl font-bold leading-none mb-2" style={{ color: activeFinanceCaseData.color }}>
                  {activeFinanceCaseData.metric.v}
                </p>
                <p className="font-mono text-[0.65rem] text-white-f/80 uppercase tracking-wider">
                  {activeFinanceCaseData.metric.k}
                </p>
              </div>

              <div className="bg-[#0D1229] border border-white/[0.06] rounded-2xl p-5">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted/70 mb-2">Output esperado</p>
                <p className="text-[0.82rem] text-white-f/90 leading-relaxed">{activeFinanceCaseData.output}</p>
              </div>

              <div className="bg-[#0D1229] border border-white/[0.06] rounded-2xl p-5">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted/70 mb-2">¿Por qué esa plataforma?</p>
                <p className="text-[0.82rem] text-white-f/85 leading-relaxed italic">{activeFinanceCaseData.why}</p>
              </div>

              {/* Plataforma primaria card */}
              {(() => {
                const primary = TOOLS[activeFinanceCaseData.primary];
                if (!primary) return null;
                return (
                  <a
                    href={primary.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-2xl p-5 border transition-all hover:-translate-y-1"
                    style={{
                      background: `linear-gradient(135deg, ${primary.color}20, ${primary.color}05)`,
                      borderColor: `${primary.color}40`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="w-10 h-10 rounded-lg grid place-items-center text-lg font-bold"
                        style={{ background: primary.color, color: "#fff" }}
                      >
                        {primary.mark}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white-f">{primary.name}</p>
                        <p className="font-mono text-[0.6rem] text-muted/80">{primary.tier} · ctx {primary.ctx}</p>
                      </div>
                      <span className="font-mono text-[0.65rem] text-white-f/60">abrir ↗</span>
                    </div>
                    <p className="text-[0.72rem] text-white-f/80 leading-relaxed">{primary.fit}</p>
                  </a>
                );
              })()}
            </div>
          </div>

          {/* Mini cards de los otros casos */}
          <div className="mt-10">
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-4">Resumen de los 6 flujos</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {FINANCE_CASES.map((c) => {
                const tool = TOOLS[c.primary];
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveFinanceCase(c.id)}
                    className="text-left bg-[#0F1438] border rounded-xl p-4 transition-all hover:-translate-y-0.5"
                    style={{ borderColor: activeFinanceCase === c.id ? `${c.color}50` : "rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl" style={{ color: c.color }}>{c.icon}</span>
                        <span className="font-mono text-[0.55rem] tracking-widest text-muted/70">{c.num}</span>
                      </div>
                      {tool && (
                        <span
                          className="w-5 h-5 rounded grid place-items-center text-[0.65rem] font-bold"
                          style={{ background: `${tool.color}25`, color: tool.color }}
                        >
                          {tool.mark}
                        </span>
                      )}
                    </div>
                    <p className="text-[0.78rem] font-semibold text-white-f leading-snug mb-2">{c.title}</p>
                    <p className="font-mono text-[0.55rem] text-muted/70">{c.line}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 10D. EJEMPLO GUIADO · 4 PLATAFORMAS ═══════════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(232,90,31,0.06),transparent),radial-gradient(ellipse_40%_40%_at_30%_70%,rgba(0,229,160,0.05),transparent)] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="font-mono text-[0.6rem] tracking-widest uppercase px-2.5 py-1 rounded-full bg-orange/15 text-orange border border-orange/30">
                ✦ Ejemplo guiado en clase
              </span>
              <span className="font-mono text-[0.6rem] tracking-widest uppercase text-cyan">mismo target · mismo prompt · 4 plataformas</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-4">
              Construye el mismo asistente DD en{" "}
              <span className="bg-gradient-to-r from-orange via-cyan to-purple-light bg-clip-text text-transparent">
                ChatGPT, Claude, Gemini y DeepSeek
              </span>
            </h2>
            <p className="text-lg text-muted max-w-3xl leading-relaxed mb-10">
              El target: <span className="text-white-f font-semibold">Cementos Portales S.A.</span> El input: el CIM completo. El prompt: el mismo. Las preguntas: las mismas. Lo único que cambia es la plataforma — y eso es lo que vamos a comparar.
            </p>

            {/* Three-step header: archivo + prompt + 4 plataformas */}
            <div className="grid md:grid-cols-3 gap-3 mb-10">
              <div className="bg-[#0D1229] border border-orange/30 rounded-2xl p-5">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-orange mb-3">Paso 1 · El input</p>
                <a
                  href="/sesion-4/01-cementos-portales-cim.docx"
                  download
                  className="flex items-center gap-3 group"
                >
                  <span className="w-10 h-10 rounded-lg bg-orange/25 grid place-items-center text-base">📄</span>
                  <div className="flex-1">
                    <p className="text-[0.85rem] font-semibold text-white-f group-hover:text-orange transition-colors">Cementos Portales · CIM</p>
                    <p className="font-mono text-[0.6rem] text-muted/70">Word · 38 KB · descargar</p>
                  </div>
                </a>
              </div>

              <div className="bg-[#0D1229] border border-cyan/30 rounded-2xl p-5">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-cyan mb-3">Paso 2 · El prompt</p>
                <button
                  onClick={() => copyToClipboard(GUIDED_PROMPT, "guided-prompt")}
                  className="flex items-center gap-3 w-full group"
                >
                  <span className="w-10 h-10 rounded-lg bg-cyan/25 grid place-items-center text-base">✍</span>
                  <div className="flex-1 text-left">
                    <p className="text-[0.85rem] font-semibold text-white-f group-hover:text-cyan transition-colors">
                      {copiedPrompt === "guided-prompt" ? "✓ copiado" : "Copiar system prompt"}
                    </p>
                    <p className="font-mono text-[0.6rem] text-muted/70">~480 palabras · 5 reglas duras</p>
                  </div>
                </button>
              </div>

              <div className="bg-[#0D1229] border border-purple/30 rounded-2xl p-5">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-purple-light mb-3">Paso 3 · Las plataformas</p>
                <div className="flex items-center gap-2">
                  {["chatgpt", "claude", "gemini", "deepseek"].map((tk) => {
                    const tool = TOOLS[tk];
                    return (
                      <a
                        key={tk}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg grid place-items-center font-bold text-sm hover:scale-110 transition-transform"
                        style={{ background: tool.color, color: "#fff" }}
                        title={tool.name}
                      >
                        {tool.mark}
                      </a>
                    );
                  })}
                </div>
                <p className="font-mono text-[0.6rem] text-muted/70 mt-2">4 pestañas · 4 setups · 1 tarde</p>
              </div>
            </div>

            {/* System prompt expandible */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-orange">El system prompt único</p>
                <button
                  onClick={() => copyToClipboard(GUIDED_PROMPT, "prompt-block")}
                  className="font-mono text-[0.6rem] tracking-widest uppercase px-3 py-1 rounded-md font-bold transition-all"
                  style={{
                    background: copiedPrompt === "prompt-block" ? "#22C55E" : "#E85A1F",
                    color: "#000",
                  }}
                >
                  {copiedPrompt === "prompt-block" ? "✓ copiado" : "⎘ copiar"}
                </button>
              </div>
              <pre className="bg-[#080C1F] border border-orange/30 rounded-xl p-5 font-mono text-[0.72rem] text-white-f/90 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                {GUIDED_PROMPT}
              </pre>
            </div>

            {/* 5 preguntas estandarizadas */}
            <div className="mb-10">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-cyan mb-3">Las 5 preguntas que todos hacen · en este orden</p>
              <div className="space-y-2">
                {GUIDED_QUESTIONS.map((q) => (
                  <div key={q.n} className="bg-[#0F1438] border border-white/[0.06] rounded-xl p-4 flex items-start gap-4 hover:border-cyan/25 transition-all group">
                    <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan/15 text-cyan grid place-items-center font-mono font-bold text-sm">
                      {q.n}
                    </span>
                    <p className="flex-1 text-[0.85rem] text-white-f/90 leading-relaxed">{q.q}</p>
                    <button
                      onClick={() => copyToClipboard(q.q, `q-${q.n}`)}
                      className="font-mono text-[0.55rem] tracking-widest uppercase px-2 py-1 rounded font-bold transition-all opacity-50 group-hover:opacity-100"
                      style={{
                        background: copiedPrompt === `q-${q.n}` ? "#22C55E" : "rgba(255,255,255,0.06)",
                        color: copiedPrompt === `q-${q.n}` ? "#000" : "#fff",
                      }}
                    >
                      {copiedPrompt === `q-${q.n}` ? "✓" : "⎘"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Selector de plataforma + setup detallado */}
            <div className="mb-10">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-3">Setup específico por plataforma</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                {["chatgpt", "claude", "gemini", "deepseek"].map((tk) => {
                  const tool = TOOLS[tk];
                  const active = guidedPlatform === tk;
                  return (
                    <button
                      key={tk}
                      onClick={() => setGuidedPlatform(tk)}
                      className="rounded-xl p-4 border transition-all text-left"
                      style={{
                        background: active ? `${tool.color}20` : "#151A3A",
                        borderColor: active ? `${tool.color}80` : "rgba(255,255,255,0.06)",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="w-9 h-9 rounded-lg grid place-items-center font-bold text-base"
                          style={{ background: tool.color, color: "#fff" }}
                        >
                          {tool.mark}
                        </span>
                        <div className="flex-1">
                          <p className="text-[0.85rem] font-bold text-white-f">{tool.short}</p>
                          <p className="font-mono text-[0.55rem] text-muted/70">{tool.tier}</p>
                        </div>
                      </div>
                      <p className="font-mono text-[0.55rem] text-muted/70">ctx {tool.ctx}</p>
                    </button>
                  );
                })}
              </div>

              {(() => {
                const tool = TOOLS[guidedPlatform];
                const guide = PLATFORM_GUIDE[guidedPlatform];
                if (!tool || !guide) return null;
                return (
                  <div
                    className="rounded-2xl p-6 md:p-8 border"
                    style={{
                      background: `linear-gradient(135deg, ${tool.color}10, transparent 70%)`,
                      borderColor: `${tool.color}40`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <span
                        className="w-12 h-12 rounded-xl grid place-items-center font-bold text-lg"
                        style={{ background: tool.color, color: "#fff" }}
                      >
                        {tool.mark}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white-f">{tool.name}</h3>
                        <p className="text-[0.75rem] text-muted">{tool.fit}</p>
                      </div>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[0.65rem] tracking-widest uppercase px-3 py-2 rounded-lg font-bold"
                        style={{ background: tool.color, color: "#fff" }}
                      >
                        abrir ↗
                      </a>
                    </div>

                    <div className="grid md:grid-cols-[1fr_1fr] gap-4 mb-5">
                      <div className="bg-[#0D1229] border border-white/[0.06] rounded-xl p-4">
                        <p className="font-mono text-[0.55rem] uppercase tracking-widest text-cyan mb-2">Setup · plan FREE</p>
                        <p className="text-[0.8rem] text-white-f/85 leading-relaxed">{guide.free}</p>
                      </div>
                      <div className="bg-[#0D1229] border border-white/[0.06] rounded-xl p-4">
                        <p className="font-mono text-[0.55rem] uppercase tracking-widest text-orange mb-2">Setup · plan PRO</p>
                        <p className="text-[0.8rem] text-white-f/85 leading-relaxed">{guide.pro}</p>
                      </div>
                    </div>

                    <div className="bg-[#0D1229] border rounded-xl p-4 mb-5" style={{ borderColor: `${tool.color}30` }}>
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-2" style={{ color: tool.color }}>Tip que aprovecha la plataforma</p>
                      <p className="text-[0.8rem] text-white-f/90 leading-relaxed italic">{guide.tip}</p>
                    </div>

                    <div>
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted mb-2">Flujo en 5 pasos</p>
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                        {guide.flow.map((step, i) => (
                          <div key={i} className="bg-[#151A3A] border border-white/[0.06] rounded-lg p-3">
                            <span
                              className="font-mono text-[0.6rem] font-bold mb-1.5 inline-block px-1.5 py-0.5 rounded"
                              style={{ background: `${tool.color}25`, color: tool.color }}
                            >
                              {i + 1}
                            </span>
                            <p className="text-[0.7rem] text-white-f/85 leading-snug">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Tabla de comparación */}
            <div className="mb-10">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-purple-light mb-3">Cómo comparar las 4 respuestas</p>
              <div className="bg-[#0D1229] border border-purple/25 rounded-2xl p-6">
                <p className="text-[0.85rem] text-white-f/85 leading-relaxed mb-5">
                  Después de correr las 5 preguntas en las 4 plataformas, cada equipo llena una tabla comparativa con estas 5 dimensiones. La idea no es elegir &ldquo;la mejor&rdquo; en abstracto, sino entender qué plataforma sirve para qué decisión.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                  {COMPARE_DIMENSIONS.map((c, i) => (
                    <div
                      key={c.d}
                      className="flex items-start gap-3 bg-[#080C1F] border border-white/[0.06] rounded-xl p-4"
                    >
                      <span
                        className="flex-shrink-0 w-8 h-8 rounded-lg grid place-items-center font-mono font-bold text-xs"
                        style={{ background: `${c.color}20`, color: c.color }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="text-[0.85rem] font-semibold text-white-f mb-1">{c.d}</p>
                        <p className="text-[0.72rem] text-muted leading-snug">{c.w}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mini tabla visual */}
                <div className="overflow-x-auto">
                  <table className="w-full text-[0.7rem]">
                    <thead>
                      <tr className="border-b border-white/[0.08]">
                        <th className="text-left py-2 pr-3 text-muted font-mono text-[0.55rem] uppercase tracking-widest">Dimensión</th>
                        {["chatgpt", "claude", "gemini", "deepseek"].map((tk) => {
                          const t = TOOLS[tk];
                          return (
                            <th key={tk} className="text-center py-2 px-2 font-mono text-[0.55rem] uppercase tracking-widest" style={{ color: t.color }}>
                              {t.short}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARE_DIMENSIONS.map((c) => (
                        <tr key={c.d} className="border-b border-white/[0.04]">
                          <td className="py-3 pr-3 text-white-f/90">{c.d}</td>
                          {["chatgpt", "claude", "gemini", "deepseek"].map((tk) => (
                            <td key={tk} className="py-3 px-2 text-center">
                              <div className="inline-flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <span key={n} className="w-2 h-3 rounded-sm bg-white/[0.08]" />
                                ))}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="font-mono text-[0.55rem] text-muted/60 italic mt-3">
                    Plantilla en blanco · cada equipo la llena con su evaluación 1–5 por dimensión.
                  </p>
                </div>
              </div>
            </div>

            {/* Bonus Lovable / Vercel */}
            <div className="bg-gradient-to-br from-[#080C1F] via-[#0D1229] to-[#080C1F] border border-orange/40 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="font-mono text-[0.6rem] tracking-widest uppercase px-2.5 py-1 rounded-full bg-orange/20 text-orange border border-orange/40">
                  ★ Bonus
                </span>
                <span className="font-mono text-[0.6rem] tracking-widest uppercase text-muted">solo si terminan a tiempo</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white-f leading-tight mb-3">
                Empaqueta el resultado en una <span className="text-orange">página web pública</span>
              </h3>
              <p className="text-muted text-[0.95rem] leading-relaxed max-w-3xl mb-6">
                Una vez tengan las 4 respuestas y la tabla comparativa, copien el siguiente prompt en <a href="https://lovable.dev/" target="_blank" rel="noopener noreferrer" className="text-orange font-semibold hover:underline">Lovable.dev</a> o <a href="https://v0.dev/" target="_blank" rel="noopener noreferrer" className="text-orange font-semibold hover:underline">v0.dev</a>. Genera una landing en menos de 2 minutos · click en &ldquo;Publish&rdquo; · queda live en Vercel para presentar al MD.
              </p>

              <div className="grid md:grid-cols-[2fr_1fr] gap-4 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest text-orange">Prompt para Lovable / v0.dev</p>
                    <button
                      onClick={() => copyToClipboard(LOVABLE_PROMPT, "lovable")}
                      className="font-mono text-[0.6rem] tracking-widest uppercase px-3 py-1 rounded-md font-bold transition-all"
                      style={{
                        background: copiedPrompt === "lovable" ? "#22C55E" : "#E85A1F",
                        color: "#000",
                      }}
                    >
                      {copiedPrompt === "lovable" ? "✓ copiado" : "⎘ copiar"}
                    </button>
                  </div>
                  <pre className="bg-[#080C1F] border border-orange/30 rounded-xl p-4 font-mono text-[0.7rem] text-white-f/85 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {LOVABLE_PROMPT}
                  </pre>
                </div>

                <div className="space-y-3">
                  <a
                    href="https://lovable.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#151A3A] border border-orange/30 rounded-xl p-4 hover:border-orange/60 transition-all"
                  >
                    <span className="w-10 h-10 rounded-lg bg-orange/25 grid place-items-center text-orange font-bold">L</span>
                    <div className="flex-1">
                      <p className="text-[0.85rem] font-bold text-white-f">Lovable.dev</p>
                      <p className="font-mono text-[0.6rem] text-muted/70">free · prompt → app web</p>
                    </div>
                    <span className="text-muted/60">↗</span>
                  </a>
                  <a
                    href="https://v0.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#151A3A] border border-cyan/30 rounded-xl p-4 hover:border-cyan/60 transition-all"
                  >
                    <span className="w-10 h-10 rounded-lg bg-cyan/25 grid place-items-center text-cyan font-bold">v0</span>
                    <div className="flex-1">
                      <p className="text-[0.85rem] font-bold text-white-f">v0.dev (Vercel)</p>
                      <p className="font-mono text-[0.6rem] text-muted/70">free · genera Next.js + deploy</p>
                    </div>
                    <span className="text-muted/60">↗</span>
                  </a>
                  <div className="bg-[#0F1438] border border-cyan/20 rounded-xl p-3">
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest text-cyan mb-1">Tip</p>
                    <p className="text-[0.7rem] text-white-f/80 leading-snug">Después de publicar en Lovable, conecta el repo a Vercel para que cada cambio quede live automáticamente.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 11A. PREGUNTAS ORIENTADORAS ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] uppercase tracking-widest text-orange mb-3">Antes de tocar la primera plataforma</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-4">
            8 preguntas que <span className="bg-gradient-to-r from-orange to-cyan bg-clip-text text-transparent">deciden el éxito</span> del MVP
          </h2>
          <p className="text-muted text-base max-w-3xl mb-10 leading-relaxed">
            Antes de elegir el caso, antes de copiar el prompt, antes de subir el archivo — siéntate 10 minutos con tu equipo y respondan estas preguntas. Lo que pasa después es radicalmente más rápido.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ORIENTING_QUESTIONS.map((q) => (
              <div
                key={q.n}
                className="group relative bg-[#0D1229] border rounded-2xl p-5 transition-all hover:-translate-y-0.5"
                style={{ borderColor: `${q.color}25` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl grid place-items-center font-mono font-bold text-base"
                    style={{ background: `${q.color}25`, color: q.color }}
                  >
                    {q.n}
                  </div>
                  <div className="flex-1">
                    <p className="text-[0.95rem] font-semibold text-white-f leading-snug mb-2">
                      {q.q}
                    </p>
                    <p className="text-[0.75rem] text-muted leading-relaxed italic">
                      {q.hint}
                    </p>
                  </div>
                </div>
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: q.color }}
                />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted text-sm italic max-w-2xl mx-auto">
              Si no puedes responder al menos 6 de las 8 con claridad, todavía no estás listo para construir. Vuelve a la pregunta 1.
            </p>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 11B. SESIÓN PRÁCTICA · MVP 2-4 H ═══════════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_30%,rgba(232,90,31,0.08),transparent),radial-gradient(ellipse_40%_50%_at_30%_70%,rgba(91,82,213,0.06),transparent)] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="font-mono text-[0.6rem] tracking-widest uppercase px-2.5 py-1 rounded-full bg-orange/15 text-orange border border-orange/30">
                ✦ Sesión práctica
              </span>
              <span className="font-mono text-[0.6rem] tracking-widest uppercase text-muted">2–4 horas · equipos de 2 a 3</span>
              <span className="font-mono text-[0.6rem] tracking-widest uppercase text-cyan">sin instalaciones · todo desde el navegador</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-4">
              Construye un <span className="bg-gradient-to-r from-orange via-purple-light to-cyan bg-clip-text text-transparent">MVP funcional</span> antes del cierre
            </h2>
            <p className="text-lg text-muted max-w-3xl leading-relaxed mb-10">
              Cada equipo elige uno de los 5 tracks, descarga el archivo de la galería, abre la plataforma recomendada y construye un demo en vivo. La sesión cierra con pitches de 5 minutos por equipo.
            </p>

            {/* Cronograma extendido */}
            <div className="mb-10">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-3">Cronograma · 4 horas</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
                {MVP_AGENDA.map((a) => (
                  <div
                    key={a.phase}
                    className="rounded-xl p-3 border"
                    style={{
                      background: `linear-gradient(135deg, ${a.color}12, ${a.color}06)`,
                      borderColor: `${a.color}30`,
                    }}
                  >
                    <p className="font-mono text-[0.6rem] font-semibold mb-1" style={{ color: a.color }}>{a.time}</p>
                    <p className="text-xs font-bold text-white-f mb-1">{a.phase}</p>
                    <p className="text-[0.65rem] text-muted leading-snug">{a.what}</p>
                  </div>
                ))}
              </div>
              <p className="font-mono text-[0.6rem] text-muted mt-3 italic">
                Versión corta de 2h: comprimir &quot;Cruzar respuestas&quot; a 10 min y reducir build a 60 min.
              </p>
            </div>

            {/* Selector de tracks */}
            <div className="mb-6">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-orange mb-3">Elige tu track</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {MVP_TRACKS.map((t) => {
                  const tool = TOOLS[t.primaryTool];
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTrack(t.id)}
                      className="rounded-xl p-3 border transition-all text-left"
                      style={{
                        background: activeTrack === t.id ? `${t.color}18` : "#151A3A",
                        borderColor: activeTrack === t.id ? `${t.color}70` : "rgba(255,255,255,0.06)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[0.6rem] font-bold" style={{ color: t.color }}>Track {t.id}</span>
                        <span className="text-base" style={{ color: t.color }}>{t.icon}</span>
                      </div>
                      <p className="text-[0.72rem] font-semibold text-white-f leading-tight">{t.name}</p>
                      <p className="font-mono text-[0.55rem] text-muted/70 mt-1">{t.line}</p>
                      {tool && (
                        <div className="flex items-center gap-1 mt-2">
                          <span
                            className="w-3.5 h-3.5 rounded grid place-items-center text-[0.55rem] font-bold"
                            style={{ background: tool.color, color: "#fff" }}
                          >
                            {tool.mark}
                          </span>
                          <span className="font-mono text-[0.55rem] text-muted/80">{tool.short}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detalle del track activo */}
            <div
              className="rounded-2xl p-6 md:p-8 border mb-10"
              style={{
                background: `linear-gradient(135deg, ${activeTrackData.color}10, transparent 70%)`,
                borderColor: `${activeTrackData.color}40`,
              }}
            >
              <div className="grid md:grid-cols-[1fr_1.4fr] gap-8">
                {/* Header + desafío */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl" style={{ color: activeTrackData.color }}>{activeTrackData.icon}</span>
                    <div>
                      <p className="font-mono text-[0.55rem] tracking-widest uppercase" style={{ color: activeTrackData.color }}>
                        Track {activeTrackData.id} · {activeTrackData.line}
                      </p>
                      <h3 className="text-2xl font-bold text-white-f leading-tight">{activeTrackData.name}</h3>
                    </div>
                  </div>

                  <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted/70 mb-1.5">El desafío</p>
                  <p className="text-[0.95rem] text-white-f/90 leading-relaxed mb-5 italic">&quot;{activeTrackData.desafio}&quot;</p>

                  {/* Archivo + plataforma · acciones rápidas */}
                  <div className="space-y-2 mb-3">
                    <a
                      href={`/sesion-4/${activeTrackData.file}`}
                      download
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:scale-[1.01]"
                      style={{
                        background: `${activeTrackData.color}10`,
                        borderColor: `${activeTrackData.color}40`,
                      }}
                    >
                      <span
                        className="w-9 h-9 rounded-lg grid place-items-center text-base"
                        style={{ background: `${activeTrackData.color}25`, color: activeTrackData.color }}
                      >
                        {activeTrackData.file.endsWith(".xlsx") ? "📊" : "📄"}
                      </span>
                      <div className="flex-1">
                        <p className="text-[0.78rem] font-semibold text-white-f">Archivo del track</p>
                        <p className="font-mono text-[0.6rem] text-muted/70">{activeTrackData.file}</p>
                      </div>
                      <span
                        className="font-mono text-[0.6rem] px-2 py-1 rounded uppercase font-bold"
                        style={{ background: activeTrackData.color, color: "#000" }}
                      >
                        ↓
                      </span>
                    </a>

                    {(() => {
                      const tool = TOOLS[activeTrackData.primaryTool];
                      if (!tool) return null;
                      return (
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:scale-[1.01]"
                          style={{
                            background: `${tool.color}10`,
                            borderColor: `${tool.color}40`,
                          }}
                        >
                          <span
                            className="w-9 h-9 rounded-lg grid place-items-center text-sm font-bold"
                            style={{ background: tool.color, color: "#fff" }}
                          >
                            {tool.mark}
                          </span>
                          <div className="flex-1">
                            <p className="text-[0.78rem] font-semibold text-white-f">Plataforma sugerida</p>
                            <p className="font-mono text-[0.6rem] text-muted/70">{tool.name} · {tool.tier}</p>
                          </div>
                          <span
                            className="font-mono text-[0.6rem] px-2 py-1 rounded uppercase font-bold"
                            style={{ background: tool.color, color: "#fff" }}
                          >
                            ↗
                          </span>
                        </a>
                      );
                    })()}
                  </div>

                  <div
                    className="rounded-xl p-4"
                    style={{ background: `${activeTrackData.color}10`, border: `1px solid ${activeTrackData.color}30` }}
                  >
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1.5" style={{ color: activeTrackData.color }}>Pitch en 5 minutos</p>
                    <p className="text-[0.78rem] text-white-f/90">{activeTrackData.pitch}</p>
                  </div>
                </div>

                {/* Must-haves & Nice-to-haves */}
                <div className="space-y-5">
                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-orange mb-3 flex items-center gap-2">
                      <span className="w-4 h-px bg-orange" />
                      Must-haves del MVP
                    </p>
                    <ul className="space-y-2">
                      {activeTrackData.must.map((m, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <span
                            className="flex-shrink-0 w-5 h-5 rounded-full grid place-items-center text-[0.65rem] mt-0.5"
                            style={{ background: `${activeTrackData.color}20`, color: activeTrackData.color }}
                          >
                            ✓
                          </span>
                          <span className="text-[0.85rem] text-white-f/90 leading-relaxed">{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-cyan mb-3 flex items-center gap-2">
                      <span className="w-4 h-px bg-cyan" />
                      Nice-to-haves (bonus)
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {activeTrackData.nice.map((n) => (
                        <span
                          key={n}
                          className="text-[0.7rem] px-2.5 py-1 rounded-md bg-cyan/10 border border-cyan/20 text-cyan"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kit del participante */}
            <div className="mb-10">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-purple-light mb-3">Kit de arranque</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {MVP_KIT.map((k) => (
                  <div key={k.t} className="bg-[#151A3A] border border-white/[0.06] rounded-xl p-4 hover:border-purple/30 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{k.icon}</span>
                      <p className="text-sm font-semibold text-white-f">{k.t}</p>
                    </div>
                    <p className="text-[0.75rem] text-muted leading-relaxed">{k.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reglas de la dinámica (sin rúbrica) */}
            <div className="grid md:grid-cols-3 gap-4 mb-10">
              <div className="bg-[#0D1229] border border-cyan/20 rounded-xl p-5">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-cyan mb-2">Regla 1 · Equipo mixto</p>
                <p className="text-[0.85rem] text-white-f/90 leading-relaxed">
                  2 a 3 personas de áreas distintas. Mezclar IB + Tech + Compliance da los mejores MVPs.
                </p>
              </div>
              <div className="bg-[#0D1229] border border-orange/20 rounded-xl p-5">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-orange mb-2">Regla 2 · Solo data sintética</p>
                <p className="text-[0.85rem] text-white-f/90 leading-relaxed">
                  Usar solo los archivos descargados. Nada de data real BTG, clientes, cédulas o montos individuales.
                </p>
              </div>
              <div className="bg-[#0D1229] border border-purple/20 rounded-xl p-5">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-purple-light mb-2">Regla 3 · Demo en vivo</p>
                <p className="text-[0.85rem] text-white-f/90 leading-relaxed">
                  Pitch de 5 min mostrando la plataforma funcionando. Si no se puede demostrar, no se cuenta.
                </p>
              </div>
            </div>

            {/* CTA cierre */}
            <div className="text-center bg-gradient-to-br from-orange/15 via-purple/10 to-cyan/15 border border-orange/30 rounded-2xl p-8">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-orange mb-3">Entregable final</p>
              <p className="text-xl md:text-2xl font-bold text-white-f leading-snug max-w-3xl mx-auto">
                Cada equipo cierra con un <span className="text-orange">demo en vivo</span>, el <span className="text-cyan">prompt refinado</span> y un <span className="text-purple-light">plan de adopción a 30 días</span>.
              </p>
              <p className="text-muted text-sm mt-3">
                Los mejores MVPs avanzan al Demo Day del Bloque 5 · Aprender haciendo.
              </p>
            </div>
          </div>
        </section>
      </RevealSection>
    </div>
  );
}
