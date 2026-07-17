"use client";

import { useEffect, useMemo, useState } from "react";
import RevealSection from "@/components/RevealSection";

/* ════════════════════════════ DATA ════════════════════════════ */

const AGENDA = [
  { time: "0:00–0:10", label: "Repaso S7 + setup · de ejecutores a inteligencia", color: "#742774" },
  { time: "0:10–0:50", label: "Copilot Studio · agentes virtuales con knowledge curado", color: "#0F6CBD" },
  { time: "0:50–1:25", label: "AI Builder · modelos prebuilt y custom (form, sentiment, prediction)", color: "#C239B3" },
  { time: "1:25–1:55", label: "Power BI · analítica, Q&A y Copilot generador de reportes", color: "#F2C811" },
  { time: "1:55–2:00", label: "Mapa integrador · cierre del módulo herramientas", color: "#00E5A0" },
];

const OBJETIVOS = [
  { icon: "◊", title: "Diseñas un agente Copilot", detail: "Distingues topic, knowledge source y action. Sales con un árbol de conversación bocetado para tu caso." },
  { icon: "✦", title: "Eliges modelo IA", detail: "Sabes cuándo usar prebuilt (form, sentiment, OCR) y cuándo entrenar custom. Conoces los créditos AI Builder." },
  { icon: "◉", title: "Activas Q&A en Power BI", detail: "Preguntas en lenguaje natural a tu dataset y entiendes cuándo Copilot in PBI genera el reporte por ti." },
  { icon: "◎", title: "Conectas los 5 pilares", detail: "Mapeas un caso real BTG donde PowerApps captura, Automate procesa, AI Builder enriquece, Copilot conversa y Power BI presenta." },
  { icon: "$", title: "Negocias licencias bien", detail: "Sabes qué viene en M365, qué requiere AI Builder credits y qué exige Premium per-user — sin que te vendan de más." },
];

/* ═════ COPILOT STUDIO ═════ */

const COPILOT_QUE_ES = [
  { icon: "◊", title: "Plataforma low-code", detail: "Construyes agentes conversacionales en una UI visual · ningún código requerido para 80% de los casos." },
  { icon: "📚", title: "Knowledge tipado", detail: "Apuntas a SharePoint, websites, archivos, Dataverse o APIs custom · el agente cita la fuente y limita su scope." },
  { icon: "🌳", title: "Topics como árboles", detail: "Cada intención del usuario se modela como un topic con triggers, slots, mensajes y branching — no es un solo prompt." },
  { icon: "⚡", title: "Actions con Power Automate", detail: "Cuando el agente necesita ejecutar (consultar saldo, abrir ticket, transferir), llama un cloud flow · no improvisa." },
  { icon: "🛡", title: "Guardrails configurables", detail: "Content filters · authentication M365 · data residency · auditoría completa de cada conversación." },
  { icon: "📱", title: "Multi-canal", detail: "El mismo agente despliega en Teams, web, Slack, móvil, voz · una construcción → muchos canales." },
];

const COPILOT_TREE = {
  root: { label: "Hola, soy Bruno · asistente WM BTG", color: "#0F6CBD" },
  topics: [
    {
      id: "saldo",
      label: "Saldo y posiciones",
      color: "#742774",
      icon: "💰",
      flow: [
        { type: "trigger", text: "Frases: 'mi saldo', 'cuánto tengo', 'posiciones', 'AUM hoy'" },
        { type: "auth", text: "Verificar usuario con Microsoft Entra · MFA si > USD 1M" },
        { type: "slot", text: "Slot: ¿qué portafolio? (si tiene varios)" },
        { type: "action", text: "Action: 'GetPortfolioBalance' (Power Automate → SQL DW)" },
        { type: "response", text: "Tu portafolio Conservador A tiene COP 1,240 MM al cierre de ayer · 64% RF, 28% RV, 8% caja. ¿Quieres ver el detalle?" },
        { type: "branch", text: "Branch: detalle / cambiar portafolio / contactar banker" },
      ],
    },
    {
      id: "transfer",
      label: "Iniciar transferencia",
      color: "#0066FF",
      icon: "↻",
      flow: [
        { type: "trigger", text: "Frases: 'transferir', 'mover', 'enviar dinero'" },
        { type: "auth", text: "MFA obligatorio · approval dual si > USD 50,000" },
        { type: "slot", text: "Slots: cuenta origen, destino, monto, divisa, fecha" },
        { type: "validate", text: "Validar contra Listas OFAC/Clinton vía conector" },
        { type: "action", text: "Action: 'CreateTransferRequest' → routing a backoffice" },
        { type: "response", text: "Solicitud T-2026-1837 creada · pendiente aprobación supervisor · ETA 2h hábil" },
      ],
    },
    {
      id: "report",
      label: "Reporte personalizado",
      color: "#C239B3",
      icon: "📊",
      flow: [
        { type: "trigger", text: "Frases: 'reporte', 'cómo va mi inversión', 'rendimiento'" },
        { type: "slot", text: "Slot: ¿qué período? (mes, trimestre, YTD, custom)" },
        { type: "action", text: "Action: 'GeneratePortfolioReport' → AI Builder + Power BI export" },
        { type: "response", text: "Tu rendimiento YTD es +8.4% (+2.1% vs benchmark COLCAP). Te envío el PDF al correo registrado." },
      ],
    },
    {
      id: "human",
      label: "Hablar con persona",
      color: "#22C55E",
      icon: "👤",
      flow: [
        { type: "trigger", text: "Frases: 'humano', 'asesor', 'no entiendes', repetidos errores" },
        { type: "action", text: "Action: 'EscalateToBanker' → routing por skill + tiempo de espera" },
        { type: "response", text: "Te conecto con tu banker Sara (disponible en ~3 min) · mientras tanto te dejo aquí con tu última conversación." },
      ],
    },
  ],
};

const COPILOT_CASOS = [
  {
    n: 1,
    title: "Asistente IB · investigación de emisores",
    color: "#0F6CBD",
    icon: "🏢",
    persona: "Analista IB",
    knowledge: "10k+ informes de research interno · macroeconómicos · términos de mandatos vigentes",
    actions: ["Buscar emisor en Bloomberg", "Comparar contra peers", "Generar one-pager en Word"],
    win: "Analista pasa de 4h de búsqueda a 25 min · cita siempre la fuente original",
  },
  {
    n: 2,
    title: "Mesa de ayuda IT interno",
    color: "#742774",
    icon: "🛠",
    persona: "Empleado BTG con problema técnico",
    knowledge: "ServiceNow KB · runbooks ITIL · histórico de tickets resueltos",
    actions: ["Reiniciar VPN remoto", "Crear ticket Sev3", "Reservar sala de TI"],
    win: "60% de tickets nivel 1 resueltos sin abrir caso · TI libera capacity para Sev1/Sev2",
  },
  {
    n: 3,
    title: "Compliance · consultas internas",
    color: "#DC2626",
    icon: "⚖",
    persona: "Empleado con duda regulatoria",
    knowledge: "Manual de compliance BTG · circulares SFC · políticas Habeas Data · listas restringidas",
    actions: ["Verificar cliente en lista", "Levantar caso de revisión", "Enviar al oficial de cumplimiento"],
    win: "Respuestas inmediatas a preguntas básicas · auditable · descarga al oficial humano para casos complejos",
  },
  {
    n: 4,
    title: "Cliente WM móvil · auto-servicio",
    color: "#22C55E",
    icon: "📱",
    persona: "Cliente WM con duda fuera de hora",
    knowledge: "Información del cliente (Dataverse) · productos del banco · FAQs WM",
    actions: ["Consultar saldo", "Pedir asesor", "Solicitar reporte"],
    win: "24/7 disponible · libera asesores para conversaciones de alto valor · NPS sube 12 puntos",
  },
];

/* ═════ AI BUILDER ═════ */

const AIB_PREBUILT = [
  {
    id: "form",
    name: "Form Processing",
    icon: "📋",
    color: "#C239B3",
    use: "Extrae campos estructurados de PDFs/imágenes (facturas, contratos, formularios).",
    btg: "Procesar mandatos firmados, cédulas, certificados de ingreso · feeder de KYC en seconds.",
    accuracy: "94-98% en docs estandarizados · cae a 70% en handwriting libre",
    credits: "1 credit por página procesada (~USD 0.02 por página)",
  },
  {
    id: "sentiment",
    name: "Sentiment Analysis",
    icon: "💬",
    color: "#0EA5E9",
    use: "Clasifica texto en positivo/neutro/negativo · soporta español.",
    btg: "Triage de tickets de banca personal · alerta cuando un cliente WM escribe negativo.",
    accuracy: "85-90% en casos estándar · más bajo en sarcasmo y jerga financiera",
    credits: "1 credit por 100 unidades de texto",
  },
  {
    id: "ocr",
    name: "Read Text (OCR)",
    icon: "👁",
    color: "#7C3AED",
    use: "Extrae todo el texto de una imagen o PDF escaneado.",
    btg: "Digitalización de archivo histórico · cheques · documentos de auditoría papel.",
    accuracy: "Excelente en docs limpios · degrada con baja resolución",
    credits: "1 credit por página",
  },
  {
    id: "category",
    name: "Text Classification",
    icon: "🏷",
    color: "#F59E0B",
    use: "Clasifica texto en categorías que tú defines (custom + pre-entrenado).",
    btg: "Routing de tickets · clasificación de noticias por sector · etiquetado de research.",
    accuracy: "Custom-trained: 88-95% con >100 ejemplos por clase",
    credits: "Entrenamiento + 1 credit por clasificación",
  },
  {
    id: "language",
    name: "Language Detection",
    icon: "🌐",
    color: "#3A7BD5",
    use: "Identifica el idioma de un texto en 100+ idiomas.",
    btg: "Routing automático de correos a equipo correcto (PT, ES, EN) · gateway multi-país BTG.",
    accuracy: ">99% para textos > 50 caracteres",
    credits: "Mínimo · 0.1 credit por texto",
  },
  {
    id: "translation",
    name: "Translation",
    icon: "🔁",
    color: "#22C55E",
    use: "Traduce entre 100+ idiomas con calidad neural · contexto financiero soportado.",
    btg: "Traducción masiva de research · comunicación con counterparts en EU/Asia.",
    accuracy: "Cercana a humana en pares es-en, pt-en · revisar términos técnicos",
    credits: "1 credit por 1000 caracteres",
  },
  {
    id: "prediction",
    name: "Prediction (custom)",
    icon: "🎯",
    color: "#DC2626",
    use: "Predicción binaria/multi-clase basada en data tabular tuya · auto-ML.",
    btg: "Churn de cliente WM · probabilidad de mora · clasificación de riesgo crediticio simple.",
    accuracy: "Depende de tus datos · típicamente 75-85% en casos balanceados",
    credits: "Entrenamiento (~USD 50-200) + predicciones (~1 credit cada 100)",
  },
  {
    id: "object",
    name: "Object Detection (image)",
    icon: "🔍",
    color: "#EC4899",
    use: "Detecta objetos custom en imágenes · entrenas con tus categorías.",
    btg: "Inspección de instalaciones (data centers, cajeros) · validación de logos en docs.",
    accuracy: "85%+ con >50 imágenes por clase y buena variedad",
    credits: "Entrenamiento + 1 credit por imagen analizada",
  },
];

const AIB_FLOW = [
  { step: "1. Pick", label: "Elige modelo", desc: "Prebuilt si tu caso es estándar · custom si necesitas tus propias categorías o tu dataset." },
  { step: "2. Train", label: "Entrena (si custom)", desc: "Subes ejemplos etiquetados · AI Builder entrena con AutoML · típicamente 30-60 min." },
  { step: "3. Test", label: "Evalúa", desc: "Probar con casos held-out · revisar matriz de confusión · iterar etiquetas si <85%." },
  { step: "4. Publish", label: "Publica", desc: "Modelo queda disponible en environment · accesible desde Power Apps, Automate, Copilot Studio." },
  { step: "5. Use", label: "Úsalo en flujo", desc: "Llamas el modelo desde un cloud flow o un app · output va a tu pipeline." },
  { step: "6. Monitor", label: "Monitorea", desc: "AI Builder muestra accuracy real en producción · alerta si cae · re-entrenas con nueva data." },
];

/* ═════ POWER BI ═════ */

const PBI_FEATURES = [
  {
    id: "qna",
    name: "Q&A · Lenguaje natural",
    icon: "❓",
    color: "#F2C811",
    one: "Escribe una pregunta en español → Power BI genera la visualización.",
    detail: "El usuario pregunta '¿cuál fue el AUM por sector el último trimestre?' y Power BI selecciona la visualización adecuada (barras, líneas, mapa) y la genera en segundos. Funciona mejor cuando el dataset tiene jerarquías y métricas bien nombradas.",
    cost: "Incluido en Power BI Pro (USD 14/user/mes)",
  },
  {
    id: "copilot",
    name: "Copilot in Power BI",
    icon: "◊",
    color: "#C239B3",
    one: "Generador de reportes desde un prompt · diseño + DAX + insights automáticos.",
    detail: "Le dices a Copilot 'crea un reporte de ventas trimestrales con drilldown por región' y construye el reporte completo: visualizaciones, medidas DAX, filtros y narrativa textual. También genera resúmenes de insights ('los ingresos crecieron 12% pero margen cayó 3pp por costo de logística').",
    cost: "Power BI Premium per-user USD 24/user/mes · capacity USD 5k+/mes",
  },
  {
    id: "smart",
    name: "Smart Narratives",
    icon: "📝",
    color: "#0EA5E9",
    one: "Texto explicativo automático que se actualiza con la data.",
    detail: "Visualización inteligente que escribe párrafos en lenguaje natural describiendo lo que se ve: 'En el último trimestre, el sector financiero lideró con 34% del total. La región Andina creció 12% YoY mientras que Pacífico retrocedió 4%'. Útil para reportes ejecutivos donde el lector no quiere interpretar gráficos.",
    cost: "Incluido en Pro",
  },
  {
    id: "anomaly",
    name: "Anomaly Detection",
    icon: "⚠",
    color: "#DC2626",
    one: "Detección automática de outliers en series de tiempo.",
    detail: "Power BI corre algoritmos de anomalías sobre tus métricas y marca puntos atípicos con explicación: 'el 12 de marzo las transferencias subieron 340% por encima del esperado'. Útil para fraude, errores operativos, eventos macro.",
    cost: "Incluido en Pro",
  },
  {
    id: "key",
    name: "Key Influencers",
    icon: "🎯",
    color: "#22C55E",
    one: "Análisis automático de qué variables explican un outcome.",
    detail: "Le pasas una métrica (ej: probabilidad de churn) y Power BI corre regresión / decision tree para mostrarte qué factores la mueven más: 'clientes con < 6 meses de antigüedad tienen 3.2× más churn'. Ideal para análisis exploratorio.",
    cost: "Incluido en Pro",
  },
];

const PBI_QNA_EXAMPLES = [
  { q: "AUM total por banker · top 10 · este trimestre", chart: "Bar chart horizontal", color: "#F2C811" },
  { q: "Evolución mensual de net new money 2025-2026", chart: "Line chart con tendencia", color: "#0EA5E9" },
  { q: "Mapa de oficinas con AUM > 100B COP", chart: "Mapa de Colombia con burbujas", color: "#22C55E" },
  { q: "Distribución de clientes WM por rango de patrimonio", chart: "Histogram + KPI", color: "#7C3AED" },
  { q: "Comparar performance Renta Fija vs Renta Variable YTD", chart: "Multi-series line + KPI", color: "#DC2626" },
];

/* ═════ INTEGRACIÓN 5 PILARES ═════ */

const INTEGRACION_CASE = {
  title: "Caso integrado · 'Onboarding WM completo'",
  subtitle: "Cómo los 5 productos de Power Platform colaboran en un solo flujo de negocio",
  steps: [
    {
      n: 1,
      product: "Power Apps",
      color: "#742774",
      icon: "◩",
      label: "Captura",
      what: "Asesor llena Canvas App con datos del prospecto · sube foto de cédula y certificado de ingresos.",
    },
    {
      n: 2,
      product: "AI Builder",
      color: "#C239B3",
      icon: "✦",
      label: "Extrae",
      what: "Form processing extrae nombre, identificación, ingresos · OCR lee la cédula · validación cruzada automática.",
    },
    {
      n: 3,
      product: "Power Automate",
      color: "#0066FF",
      icon: "↻",
      label: "Orquesta",
      what: "Cloud flow valida con OFAC · crea registro en Dataverse · pide approvals · genera contratos vía DocuSign.",
    },
    {
      n: 4,
      product: "Copilot Studio",
      color: "#0F6CBD",
      icon: "◊",
      label: "Asiste",
      what: "Cliente recibe mensaje en Teams/Web · puede consultar el estado del proceso 24/7 · pide aclaraciones por chat.",
    },
    {
      n: 5,
      product: "Power BI",
      color: "#F2C811",
      icon: "◉",
      label: "Mide",
      what: "Dashboard ejecutivo · TAT por banker, conversion rate, dropouts, AUM ganado · Q&A en lenguaje natural para gerencia.",
    },
  ],
};

/* ═════ EJERCICIOS ═════ */
const EJERCICIOS = [
  {
    n: 1,
    title: "Tu primer agente Copilot Studio · 30 min",
    level: "⭐⭐",
    time: "30 min",
    tools: ["Copilot Studio", "SharePoint con 1-3 docs PDF"],
    context: "Vas a crear un agente que responde preguntas sobre el manual interno BTG (o cualquier set de PDFs) · cita siempre la fuente · escala a humano si no sabe.",
    why: "Cuando construyes tu primer agente con knowledge real, entiendes por qué Copilot Studio supera a un chatbot tradicional: scope controlado, citaciones, fallback inteligente.",
    steps: [
      "Entra a copilotstudio.microsoft.com · click 'Create' → 'New copilot' · idioma español Colombia.",
      "En 'Knowledge' agrega la carpeta SharePoint con tus PDFs · espera el indexado (~5 min).",
      "Crea un topic 'Consultas generales' con triggers tipo 'qué dice el manual sobre...', '¿puedes explicarme...?'.",
      "Configura el response para usar 'Generative answers' apuntando al knowledge.",
      "Crea un fallback topic 'Escalar' que se active con 'no entendí' o 'humano' · respuesta: redirige a Teams del banker.",
      "Click 'Test' a la derecha · prueba 5 preguntas · verifica que cite las fuentes correctas.",
      "Publica en canal Teams o Web · comparte link contigo mismo.",
    ],
    deliverable: "Agente funcionando + screenshot de 3 preguntas con citaciones correctas + 1 escalamiento.",
    cost: "USD 200/tenant/mes Copilot Studio (25k msgs incl.) · pay-as-you-go USD 0.01/msg standard · USD 0.04/msg premium",
    color: "#0F6CBD",
  },
  {
    n: 2,
    title: "AI Builder · clasifica tickets en 25 min",
    level: "⭐⭐",
    time: "25 min",
    tools: ["AI Builder", "Excel con ~30 tickets etiquetados"],
    context: "Entrenas un modelo custom de Text Classification con tus categorías reales (TI / RRHH / Finanzas / Compliance / Soporte WM) y lo conectas a un Power Automate que rute correos automáticamente.",
    why: "Pasar de 'la IA es magia' a 'entrené un modelo con mi data en 25 min y mejora la operación' es el momento donde ves utilidad real.",
    steps: [
      "Prepara Excel con 2 columnas: 'texto' y 'categoría' · ~30 ejemplos (6 por clase mínimo).",
      "Entra a make.powerapps.com → AI Builder → Models → 'Custom' → 'Text classification'.",
      "Sube el Excel · selecciona la columna de texto y la de categoría · 'Train'.",
      "Esperar ~10 min · ver accuracy. Si <85%, agregar 5 ejemplos más a las clases con peor recall y reentrenar.",
      "'Publish' el modelo · ahora aparece como acción en Power Automate.",
      "Crea cloud flow: trigger 'New email arrives' → action 'Predict' del modelo → switch sobre el output → mover a carpeta correspondiente.",
    ],
    deliverable: "Modelo publicado + flujo activo + 5 emails de prueba clasificados correctamente.",
    cost: "USD 0 con créditos M365 E5 · ~USD 50/mes con AI Builder add-on",
    color: "#C239B3",
  },
  {
    n: 3,
    title: "Power BI Q&A · pregunta y obtén el reporte",
    level: "⭐",
    time: "20 min",
    tools: ["Power BI Desktop", "1 dataset (puedes usar el de ejemplo 'Financial Sample')"],
    context: "Vas a configurar Q&A para que un usuario pueda preguntar en lenguaje natural y obtener el gráfico correcto · exploras Smart Narratives y Key Influencers como bonus.",
    why: "Power BI Q&A es la feature más subutilizada y más poderosa para ejecutivos · que ellos puedan preguntar sin necesitar un analista cambia el ciclo de decisión.",
    steps: [
      "Abre Power BI Desktop · carga 'Financial Sample' (file → import sample) o tu propio dataset.",
      "Insert visual → 'Q&A'. Te aparece una caja para preguntar.",
      "Prueba 5 preguntas: 'sales by country', 'profit by month line chart', 'top 10 products by revenue', 'compare 2025 vs 2026'.",
      "Si el resultado es raro: ve a 'Q&A setup' → 'teach Q&A' para enseñarle términos de tu dominio.",
      "Agrega un visual 'Smart Narrative' apuntando a una métrica · ver cómo genera el texto explicativo.",
      "Agrega 'Key Influencers' con churn (o cualquier métrica binaria) · ver qué variables la afectan más.",
      "Publica al servicio Power BI · comparte con un colega para validar.",
    ],
    deliverable: "Reporte con Q&A funcionando + Smart Narrative + Key Influencers · screenshot + link compartido.",
    cost: "USD 0 (Power BI Desktop gratis · publicación requiere Pro USD 14/user/mes)",
    color: "#F2C811",
  },
];

/* ════════════════════════════ COMPONENT ════════════════════════════ */

export default function Sesion8() {
  /* COPILOT TREE */
  const [activeTopic, setActiveTopic] = useState<string>("saldo");
  const currentTopic = useMemo(() => COPILOT_TREE.topics.find((t) => t.id === activeTopic)!, [activeTopic]);

  /* AI BUILDER */
  const [activeModel, setActiveModel] = useState<string>("form");
  const currentModel = useMemo(() => AIB_PREBUILT.find((m) => m.id === activeModel)!, [activeModel]);

  /* POWER BI */
  const [activePBI, setActivePBI] = useState<string>("qna");
  const currentPBI = useMemo(() => PBI_FEATURES.find((f) => f.id === activePBI)!, [activePBI]);

  /* Power BI Q&A simulator */
  const [pbiQuery, setPbiQuery] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setPbiQuery((q) => (q + 1) % PBI_QNA_EXAMPLES.length), 3500);
    return () => clearInterval(iv);
  }, []);

  /* HERO counter */
  const [heroN, setHeroN] = useState(0);
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => { i++; setHeroN(i); if (i >= 6) clearInterval(iv); }, 200);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen bg-[#080C1F]">
      {/* ═══════════════ 1. HERO ═══════════════ */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden">
        <div className="hero-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_25%_50%,rgba(15,108,189,0.10),transparent),radial-gradient(ellipse_40%_50%_at_75%_60%,rgba(242,200,17,0.08),transparent)] pointer-events-none" />

        <div className="absolute inset-0 pointer-events-none opacity-[0.05] font-mono text-[0.6rem] text-[#0F6CBD] overflow-hidden select-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="absolute" style={{ left: `${(i * 11) % 100}%`, top: `${(i * 7) % 100}%`, transform: `rotate(${(i % 3 - 1) * 6}deg)` }}>
              {`◊ ✦ ◉ 🤖 📊`}
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="font-mono text-[0.72rem] text-[#0F6CBD] uppercase tracking-widest mb-4 animate-fadeUp">
            Módulo 02 · Herramientas · Sesión 8
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white-f leading-tight mb-6 animate-fadeUp-1">
            <span className="text-white-f">Power Platform · parte 2:</span>{" "}
            <span className="bg-gradient-to-r from-[#0F6CBD] via-[#C239B3] to-[#F2C811] bg-clip-text text-transparent">Copilot Studio · AI Builder · Power BI</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 animate-fadeUp-2">
            Los 3 pilares inteligentes. Agentes que conversan con tu knowledge curado, modelos prebuilt que extraen y predicen, y analítica que responde a preguntas en español. Cierre del módulo herramientas con casos integrados BTG.
          </p>

          <div className="flex flex-wrap justify-center gap-3 animate-fadeUp-3">
            {[
              { val: heroN >= 1 ? "4" : "—", label: "Topics agente WM", icon: "◊", color: "#0F6CBD" },
              { val: heroN >= 2 ? "8" : "—", label: "Modelos AI Builder", icon: "✦", color: "#C239B3" },
              { val: heroN >= 3 ? "5" : "—", label: "Features Power BI IA", icon: "◉", color: "#F2C811" },
              { val: heroN >= 4 ? "5" : "—", label: "Casos Copilot Studio", icon: "🏢", color: "#742774" },
              { val: heroN >= 5 ? "5" : "—", label: "Productos integrados", icon: "◎", color: "#00E5A0" },
              { val: heroN >= 6 ? "3" : "—", label: "Hands-on guiados", icon: "✓", color: "#D4AF4C" },
            ].map((s) => (
              <div key={s.label} className="bg-[#151A3A] border rounded-2xl px-4 py-3 min-w-[110px] transition-all hover:scale-105" style={{ borderColor: `${s.color}25` }}>
                <span className="text-lg" style={{ color: s.color }}>{s.icon}</span>
                <p className="text-xl font-bold text-white-f mt-1">{s.val}</p>
                <p className="text-[0.6rem] text-muted">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[0.6rem] font-mono text-muted mt-4 opacity-60">* Features y precios verificados a julio 2026 · Copilot Studio v3 · AI Builder credits M365 E5 · Power BI Pro/PPU</p>
        </div>
      </section>

      {/* ═══════════════ 2. AGENDA ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-12">
          <p className="font-mono text-[0.72rem] text-[#0F6CBD] uppercase tracking-widest mb-6">Agenda · Sesión 8</p>
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
          <p className="font-mono text-[0.72rem] text-[#0F6CBD] uppercase tracking-widest mb-3">Objetivos de aprendizaje</p>
          <h2 className="text-2xl md:text-4xl font-bold text-white-f leading-tight mb-8">
            Sales con un agente bocetado, un modelo elegido y un dashboard <span className="bg-gradient-to-r from-[#0F6CBD] via-[#C239B3] to-[#F2C811] bg-clip-text text-transparent">que responde preguntas</span>
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

      {/* ═══════════════ 4. COPILOT STUDIO · QUÉ ES ═══════════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(15,108,189,0.07),transparent)] pointer-events-none" />

          <div className="relative">
            <p className="font-mono text-[0.72rem] text-[#0F6CBD] uppercase tracking-widest mb-3">Copilot Studio · agentes virtuales</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
              No es un chatbot · es un <span className="bg-gradient-to-r from-[#0F6CBD] to-[#742774] bg-clip-text text-transparent">agente con scope, memoria y acciones</span>
            </h2>
            <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
              La diferencia entre 'le pego un PDF a ChatGPT' y 'tengo un asistente que cita la fuente, ejecuta acciones y escala cuando no sabe'. Copilot Studio es la capa donde un caso de uso conversacional se vuelve sistema productivo en banca.
            </p>

            <div className="grid md:grid-cols-3 gap-3">
              {COPILOT_QUE_ES.map((c, i) => (
                <div key={i} className="bg-[#0D1229] border border-white/[0.06] rounded-2xl p-5 hover:border-[#0F6CBD]/40 transition-all">
                  <div className="text-2xl mb-2">{c.icon}</div>
                  <p className="text-base font-bold text-white-f leading-tight mb-2">{c.title}</p>
                  <p className="text-[0.78rem] text-white-f/80 leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 5. DEMO · ÁRBOL DE CONVERSACIÓN ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#0F6CBD] uppercase tracking-widest mb-3">Demo · árbol de conversación</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            'Bruno' · agente WM BTG <span className="bg-gradient-to-r from-[#0F6CBD] to-[#742774] bg-clip-text text-transparent">deconstruido</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            Click en cada topic para ver el flujo real: trigger → autenticación → slots → action → response. Esto es lo que diseñas en Copilot Studio antes de tocar código.
          </p>

          {/* Phone mock + tree */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Phone preview */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-[#0F1438] to-[#0D1229] border border-[#0F6CBD]/30 rounded-3xl p-4 max-w-[280px] mx-auto sticky top-24">
                <div className="bg-[#080C1F] border border-white/[0.06] rounded-2xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#0F6CBD] to-[#0066FF] px-3 py-2.5 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 grid place-items-center text-sm">◊</div>
                    <div>
                      <p className="text-[0.78rem] font-bold text-white">Bruno · BTG WM</p>
                      <p className="text-[0.55rem] text-white/70 font-mono">● en línea</p>
                    </div>
                  </div>
                  {/* Conversation */}
                  <div className="p-3 space-y-2 min-h-[400px]">
                    <div className="flex">
                      <div className="bg-[#1A1F3F] rounded-2xl rounded-tl-sm px-3 py-2 max-w-[80%]">
                        <p className="text-[0.7rem] text-white-f/95">{COPILOT_TREE.root.label}</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-[#0F6CBD] rounded-2xl rounded-br-sm px-3 py-2 max-w-[80%]">
                        <p className="text-[0.7rem] text-white">{currentTopic.icon} {currentTopic.label}</p>
                      </div>
                    </div>
                    {currentTopic.flow.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex">
                        <div className="bg-[#1A1F3F] rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%] border-l-2" style={{ borderColor: currentTopic.color }}>
                          <p className="font-mono text-[0.5rem] uppercase tracking-widest mb-0.5" style={{ color: currentTopic.color }}>{f.type}</p>
                          <p className="text-[0.65rem] text-white-f/90 leading-snug">{f.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Input mock */}
                  <div className="border-t border-white/[0.06] px-3 py-2 flex items-center gap-2">
                    <div className="flex-1 bg-[#0D1229] rounded-full px-3 py-1">
                      <p className="text-[0.6rem] text-muted italic">Escribe tu mensaje...</p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#0F6CBD] grid place-items-center text-xs text-white">↑</div>
                  </div>
                </div>
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted text-center mt-3">▾ Vista previa Teams · Web · Móvil</p>
              </div>
            </div>

            {/* Topics + flow detail */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {COPILOT_TREE.topics.map((t) => {
                  const active = activeTopic === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTopic(t.id)}
                      className="text-left rounded-xl p-3 border transition-all"
                      style={{
                        background: active ? `linear-gradient(135deg, ${t.color}28, ${t.color}08)` : "#0D1229",
                        borderColor: active ? t.color : `${t.color}30`,
                      }}
                    >
                      <span className="text-2xl">{t.icon}</span>
                      <p className="text-[0.78rem] font-bold text-white-f leading-tight mt-1">{t.label}</p>
                      <p className="font-mono text-[0.5rem] uppercase tracking-widest text-muted mt-0.5">topic</p>
                    </button>
                  );
                })}
              </div>

              <div className="bg-[#0D1229] border rounded-2xl p-5" style={{ borderColor: `${currentTopic.color}40` }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{currentTopic.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white-f">{currentTopic.label}</h3>
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">flujo del topic</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {currentTopic.flow.map((f, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-lg grid place-items-center font-mono text-[0.6rem] font-bold shrink-0" style={{ background: `${currentTopic.color}22`, color: currentTopic.color, border: `1px solid ${currentTopic.color}50` }}>
                        {i + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-0.5" style={{ color: currentTopic.color }}>{f.type}</p>
                        <p className="text-[0.78rem] text-white-f/90 leading-relaxed">{f.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 6. CASOS COPILOT STUDIO ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#0F6CBD] uppercase tracking-widest mb-3">Casos Copilot Studio · BTG</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            4 agentes <span className="bg-gradient-to-r from-[#0F6CBD] to-[#742774] bg-clip-text text-transparent">listos para diseñar la próxima semana</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            Cada caso con persona objetivo, knowledge a curar y actions a configurar. La diferencia entre un agente útil y uno frustrante está en el scope: claro, limitado y con escalamiento humano definido.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {COPILOT_CASOS.map((c) => (
              <div key={c.n} className="bg-[#0D1229] border rounded-2xl overflow-hidden flex flex-col" style={{ borderColor: `${c.color}30` }}>
                <div className="px-5 py-4 border-b flex items-start gap-3" style={{ background: `linear-gradient(135deg, ${c.color}18, ${c.color}06)`, borderColor: `${c.color}25` }}>
                  <div className="text-3xl">{c.icon}</div>
                  <div className="flex-1">
                    <span className="font-mono text-[0.55rem] uppercase tracking-widest" style={{ color: c.color }}>persona: {c.persona}</span>
                    <p className="text-[0.95rem] font-bold text-white-f leading-tight mt-1">{c.title}</p>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <div>
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1" style={{ color: c.color }}>▸ Knowledge</p>
                    <p className="text-[0.74rem] text-white-f/85 leading-relaxed">{c.knowledge}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1.5" style={{ color: c.color }}>▸ Actions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {c.actions.map((a, i) => (
                        <span key={i} className="font-mono text-[0.6rem] px-2 py-1 rounded-md" style={{ background: `${c.color}18`, color: c.color, border: `1px solid ${c.color}35` }}>{a}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto bg-[#22C55E]/10 border-l-2 border-[#22C55E] rounded-r-lg px-3 py-2">
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-0.5 text-[#22C55E]">▸ Win</p>
                    <p className="text-[0.78rem] text-white-f/95 font-semibold">{c.win}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 7. AI BUILDER · MODELOS ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#C239B3] uppercase tracking-widest mb-3">AI Builder · 8 modelos prebuilt</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            Modelos IA <span className="bg-gradient-to-r from-[#C239B3] to-[#7C3AED] bg-clip-text text-transparent">listos para usar o entrenar con tu data</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            Microsoft te da 8 capacidades estándar entrenadas en datos de empresa · puedes usarlas tal cual o entrenar tu versión custom con ejemplos propios. Sin código, sin sysadmin, sin pipeline ML que mantener.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {AIB_PREBUILT.map((m) => {
              const active = activeModel === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModel(m.id)}
                  className="text-left rounded-xl p-3 border transition-all"
                  style={{
                    background: active ? `linear-gradient(135deg, ${m.color}28, ${m.color}08)` : "#0D1229",
                    borderColor: active ? m.color : `${m.color}30`,
                  }}
                >
                  <div className="text-2xl mb-1">{m.icon}</div>
                  <p className="text-[0.78rem] font-bold text-white-f leading-tight">{m.name}</p>
                </button>
              );
            })}
          </div>

          <div className="bg-[#0D1229] border rounded-2xl p-6" style={{ borderColor: `${currentModel.color}40` }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl grid place-items-center text-2xl" style={{ background: `${currentModel.color}22`, color: currentModel.color, border: `1px solid ${currentModel.color}50` }}>
                {currentModel.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white-f leading-tight">{currentModel.name}</h3>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">Prebuilt + Custom training</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1.5" style={{ color: currentModel.color }}>▸ Qué hace</p>
                <p className="text-[0.85rem] text-white-f/90 leading-relaxed mb-4">{currentModel.use}</p>

                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1.5 text-gold">▸ Caso BTG</p>
                <p className="text-[0.85rem] text-white-f/90 leading-relaxed">{currentModel.btg}</p>
              </div>
              <div className="space-y-3">
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
                  <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1 text-cyan">▸ Accuracy</p>
                  <p className="text-[0.78rem] text-white-f/90 leading-snug">{currentModel.accuracy}</p>
                </div>
                <div className="bg-white/[0.03] border border-[#D4AF4C]/30 rounded-lg p-3">
                  <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1 text-gold">▸ Costo (credits)</p>
                  <p className="text-[0.78rem] text-white-f/90 leading-snug">{currentModel.credits}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Flujo de entrenar custom */}
          <div className="mt-8">
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-[#C239B3] mb-3">Flujo de modelo custom · 6 pasos</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {AIB_FLOW.map((f, i) => (
                <div key={i} className="bg-[#0D1229] border border-[#C239B3]/25 rounded-xl p-3 relative">
                  <p className="font-mono text-[0.55rem] uppercase tracking-widest text-[#C239B3] mb-1">{f.step}</p>
                  <p className="text-[0.75rem] font-bold text-white-f mb-1">{f.label}</p>
                  <p className="text-[0.65rem] text-white-f/75 leading-snug">{f.desc}</p>
                  {i < AIB_FLOW.length - 1 && <span className="hidden md:block absolute top-1/2 -right-2 -translate-y-1/2 text-muted pointer-events-none z-10">→</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 8. POWER BI · FEATURES IA ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#F2C811] uppercase tracking-widest mb-3">Power BI · IA dentro del dashboard</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            La analítica <span className="bg-gradient-to-r from-[#F2C811] to-[#C239B3] bg-clip-text text-transparent">deja de pedirle visualizaciones a un analista</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            Power BI 2026 trae 5 capacidades de IA listas para usar. Q&A en español, Copilot que genera reportes, narrativas automáticas, detección de anomalías y análisis de drivers. El usuario de negocio se vuelve autosuficiente para 80% de las preguntas.
          </p>

          <div className="grid md:grid-cols-5 gap-2 mb-6">
            {PBI_FEATURES.map((f) => {
              const active = activePBI === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActivePBI(f.id)}
                  className="text-left rounded-xl p-3 border transition-all"
                  style={{
                    background: active ? `linear-gradient(135deg, ${f.color}28, ${f.color}08)` : "#0D1229",
                    borderColor: active ? f.color : `${f.color}30`,
                  }}
                >
                  <div className="text-2xl mb-1">{f.icon}</div>
                  <p className="text-[0.74rem] font-bold text-white-f leading-tight">{f.name}</p>
                </button>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-[#0D1229] border rounded-2xl p-6" style={{ borderColor: `${currentPBI.color}40` }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{currentPBI.icon}</span>
                <h3 className="text-xl font-bold text-white-f">{currentPBI.name}</h3>
              </div>
              <p className="text-[0.85rem] text-white-f/95 font-semibold mb-3">{currentPBI.one}</p>
              <p className="text-[0.78rem] text-white-f/80 leading-relaxed mb-4">{currentPBI.detail}</p>
              <div className="bg-white/[0.03] border border-[#D4AF4C]/30 rounded-lg p-3">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-0.5 text-gold">▸ Costo</p>
                <p className="text-[0.78rem] text-white-f/90 font-mono">{currentPBI.cost}</p>
              </div>
            </div>

            {/* Q&A simulator */}
            <div className="bg-gradient-to-br from-[#F2C811]/8 to-[#0D1229] border border-[#F2C811]/30 rounded-2xl p-6">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[#F2C811] mb-3">Demo · Q&A en lenguaje natural</p>
              <div className="bg-[#080C1F] border border-white/[0.06] rounded-xl p-4 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#F2C811]">Q&A ❯</span>
                  <p className="text-[0.85rem] text-white-f font-mono">{PBI_QNA_EXAMPLES[pbiQuery].q}</p>
                </div>
              </div>
              <div className="bg-[#080C1F] border border-[#F2C811]/30 rounded-xl p-6 text-center">
                <div className="text-5xl mb-2" style={{ color: PBI_QNA_EXAMPLES[pbiQuery].color }}>📊</div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-1">Power BI generó:</p>
                <p className="text-[0.85rem] font-bold" style={{ color: PBI_QNA_EXAMPLES[pbiQuery].color }}>{PBI_QNA_EXAMPLES[pbiQuery].chart}</p>
              </div>
              <p className="text-[0.65rem] font-mono text-muted mt-3 italic">▾ Pregunta cambia automática cada 3.5s · 5 ejemplos del catálogo BTG WM</p>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 9. INTEGRACIÓN 5 PILARES ═══════════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(0,229,160,0.06),transparent)] pointer-events-none" />

          <div className="relative">
            <p className="font-mono text-[0.72rem] text-[#00E5A0] uppercase tracking-widest mb-3">Integración · los 5 productos juntos</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
              {INTEGRACION_CASE.title} · <span className="bg-gradient-to-r from-[#742774] via-[#0066FF] to-[#F2C811] bg-clip-text text-transparent">5 productos en sincronía</span>
            </h2>
            <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
              {INTEGRACION_CASE.subtitle}. Esta es la promesa real de Power Platform: no son 5 herramientas separadas, son un mismo ecosistema con conectores compartidos, seguridad unificada y data en Dataverse.
            </p>

            {/* Flow horizontal */}
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-2 min-w-max">
                {INTEGRACION_CASE.steps.map((s, i) => (
                  <div key={s.n} className="flex items-center gap-2">
                    <div className="bg-[#0D1229] border rounded-2xl p-4 w-[180px]" style={{ borderColor: `${s.color}40` }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl" style={{ color: s.color }}>{s.icon}</span>
                        <span className="font-mono text-[0.55rem] uppercase tracking-widest px-2 py-0.5 rounded" style={{ background: `${s.color}20`, color: s.color, border: `1px solid ${s.color}40` }}>
                          {s.label}
                        </span>
                      </div>
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1" style={{ color: s.color }}>{s.product}</p>
                      <p className="text-[0.7rem] text-white-f/85 leading-snug">{s.what}</p>
                    </div>
                    {i < INTEGRACION_CASE.steps.length - 1 && (
                      <div className="text-2xl text-muted">→</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-[#00E5A0]/10 via-[#0F1438] to-[#0D1229] border border-[#00E5A0]/30 rounded-xl p-5">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[#00E5A0] mb-2">▸ Por qué importa esta integración</p>
              <p className="text-[0.85rem] text-white-f/90 leading-relaxed">
                En el stack tradicional este caso requiere: 1 dev frontend, 1 dev backend, 1 ML engineer, 1 DBA, 1 BI dev, 6 semanas y un proyecto formal. En Power Platform: <span className="font-bold text-[#00E5A0]">2 personas con know-how lo arman en 2 semanas</span> · todo dentro del tenant BTG · gobernanza centralizada · auditoría built-in.
              </p>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 10. EJERCICIOS ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#D4AF4C] uppercase tracking-widest mb-3">Ejercicios prácticos · hands-on</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            3 hands-on para salir con un agente, un modelo IA y un <span className="bg-gradient-to-r from-[#D4AF4C] to-[#F2C811] bg-clip-text text-transparent">dashboard que responde preguntas</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            ~75 min en total · uno por producto. Al cerrar tienes evidencia de los 3 pilares funcionando con tu data y tu cuenta BTG. Llévalos a tu jefe el lunes.
          </p>

          <div className="grid lg:grid-cols-3 gap-4">
            {EJERCICIOS.map((e) => (
              <div key={e.n} className="bg-[#0D1229] border rounded-2xl overflow-hidden flex flex-col" style={{ borderColor: `${e.color}30` }}>
                <div className="px-5 py-4 border-b flex items-start gap-3" style={{ background: `linear-gradient(135deg, ${e.color}18, ${e.color}06)`, borderColor: `${e.color}25` }}>
                  <div className="w-11 h-11 rounded-xl grid place-items-center shrink-0 text-lg font-bold" style={{ background: `${e.color}25`, color: e.color, border: `1px solid ${e.color}50` }}>
                    {String(e.n).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[0.7rem]" style={{ color: e.color }}>{e.level}</span>
                      <span className="font-mono text-[0.55rem] uppercase tracking-widest text-muted">{e.time}</span>
                    </div>
                    <p className="text-[0.9rem] font-bold text-white-f leading-tight">{e.title}</p>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {e.tools.map((t) => (
                      <span key={t} className="font-mono text-[0.55rem] uppercase tracking-wider px-2 py-1 rounded-md" style={{ background: `${e.color}18`, color: e.color, border: `1px solid ${e.color}35` }}>{t}</span>
                    ))}
                  </div>
                  <div className="mb-3">
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1" style={{ color: e.color }}>Contexto</p>
                    <p className="text-[0.74rem] text-white-f/85 italic leading-relaxed">&ldquo;{e.context}&rdquo;</p>
                  </div>
                  <div className="mb-4 bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1 text-gold">Por qué importa</p>
                    <p className="text-[0.72rem] text-white-f/80 leading-snug">{e.why}</p>
                  </div>
                  <div className="mb-4">
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1.5" style={{ color: e.color }}>Pasos</p>
                    <ol className="space-y-2">
                      {e.steps.map((s, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <span className="w-5 h-5 rounded-full grid place-items-center font-mono text-[0.55rem] shrink-0 mt-0.5" style={{ background: `${e.color}20`, color: e.color, border: `1px solid ${e.color}40` }}>{i + 1}</span>
                          <p className="text-[0.72rem] text-white-f/85 leading-relaxed flex-1">{s}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
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
        </section>
      </RevealSection>

      {/* ═══════════════ 11. CIERRE DEL MÓDULO ═══════════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(15,108,189,0.08),transparent)] pointer-events-none" />

          <div className="relative bg-gradient-to-br from-[#0F1438] via-[#0D1229] to-[#080C1F] border border-white/[0.08] rounded-3xl p-8 md:p-12">
            <p className="font-mono text-[0.72rem] text-[#0F6CBD] uppercase tracking-widest mb-3">Cierre · Módulo 02 herramientas completo</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
              Research · Build · Ejecutar · <span className="bg-gradient-to-r from-[#742774] via-[#0F6CBD] to-[#F2C811] bg-clip-text text-transparent">Conversar · Medir</span>
            </h2>
            <p className="text-lg text-muted max-w-3xl mb-8 leading-relaxed">
              Con S5 a S8 ya tienes el ciclo completo: research sin alucinaciones (S5), programación asistida con 21 herramientas (S6), apps + automatización con apertura ciber (S7) y los 3 pilares inteligentes Copilot Studio + AI Builder + Power BI (S8). El Módulo 03 sube de nivel: ciberseguridad/LLMOps profundo y orquestación con n8n.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { k: "S5 · Research", v: "Ecosistemas + modelos 2026", c: "#00E5A0" },
                { k: "S6 · Build", v: "Stack de 21 herramientas", c: "#5B52D5" },
                { k: "S7 · Apps + Flows", v: "Power Apps + Power Automate", c: "#742774" },
                { k: "S8 · Inteligencia", v: "Copilot Studio + AI Builder + Power BI", c: "#0F6CBD" },
              ].map((s) => (
                <div key={s.k} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                  <p className="font-mono text-[0.58rem] uppercase tracking-widest mb-1.5" style={{ color: s.c }}>{s.k}</p>
                  <p className="text-[0.85rem] font-bold text-white-f leading-snug">{s.v}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-orange mb-2">Pregunta de cierre · 200 palabras</p>
              <p className="text-[0.88rem] text-white-f/90 italic leading-relaxed">
                &ldquo;Toma el proceso recurrente que identificaste al cerrar S7 y rediseña el flujo completo: cómo lo capturarías con Power Apps (canvas o model-driven), qué pasos automatizarías con Power Automate, qué modelo de AI Builder agregaría valor (form processing, sentiment, prediction), si vale la pena darle voz con Copilot Studio y qué mediría tu dashboard de Power BI con Q&A. 200 palabras, listo para pitch de 3 minutos al comité de digitalización BTG.&rdquo;
              </p>
            </div>
          </div>
        </section>
      </RevealSection>
    </div>
  );
}
