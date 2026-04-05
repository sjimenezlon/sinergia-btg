"use client";

import { useState, useEffect, useCallback } from "react";
import RevealSection from "@/components/RevealSection";

/* ────────────────────────── DATA ────────────────────────── */

const AGENDA = [
  { time: "0:00–0:15", label: "Caso BTG: IA en M&A", color: "#00E5A0" },
  { time: "0:15–0:40", label: "Taxonomía IA & Transformers", color: "#5B52D5" },
  { time: "0:40–1:00", label: "Tokenización & Modelos", color: "#5B52D5" },
  { time: "1:00–1:40", label: "Config Lab: System Prompts", color: "#E85A1F" },
  { time: "1:40–2:00", label: "Reto: 3 LLMs 1 Prompt", color: "#22C55E" },
];

const TAXONOMY_NODES = [
  {
    id: "ia",
    label: "Inteligencia Artificial",
    short: "IA",
    x: 50,
    y: 12,
    detail:
      "Sistemas que simulan capacidades cognitivas humanas. En BTG: scoring crediticio, detección de fraude, sistemas expertos para compliance.",
    example: "Motor de reglas para Know Your Customer (KYC)",
    year: "1956",
  },
  {
    id: "ml",
    label: "Machine Learning",
    short: "ML",
    x: 50,
    y: 35,
    detail:
      "Algoritmos que aprenden de datos sin ser programados explícitamente. En BTG: modelos de riesgo, predicción de churn, clustering de clientes.",
    example: "Modelo XGBoost para scoring de crédito corporativo",
    year: "1997",
  },
  {
    id: "dl",
    label: "Deep Learning",
    short: "DL",
    x: 50,
    y: 58,
    detail:
      "Redes neuronales profundas con múltiples capas. En BTG: análisis de sentimiento de mercado, detección de anomalías en transacciones, NLP sobre reportes.",
    example: "LSTM para predicción de volatilidad en renta variable",
    year: "2012",
  },
  {
    id: "genai",
    label: "IA Generativa",
    short: "GenAI",
    x: 50,
    y: 81,
    detail:
      "Modelos que generan contenido nuevo: texto, código, imágenes, datos sintéticos. En BTG: due diligence automatizada, generación de memos de inversión, análisis de contratos.",
    example: "LLM que resume 847 documentos de due diligence en 8 horas",
    year: "2022",
  },
];

const TRANSFORMER_TOKENS = [
  "Análisis",
  "de",
  "riesgo",
  "para",
  "emisión",
  "de",
  "bonos",
  "Ecopetrol",
];

// Simulated attention weights (row = source, col = target)
const ATTENTION_WEIGHTS: number[][] = [
  [0.1, 0.05, 0.35, 0.05, 0.15, 0.05, 0.1, 0.15],
  [0.3, 0.02, 0.2, 0.08, 0.1, 0.08, 0.12, 0.1],
  [0.25, 0.05, 0.1, 0.05, 0.15, 0.05, 0.2, 0.15],
  [0.1, 0.1, 0.1, 0.05, 0.25, 0.05, 0.2, 0.15],
  [0.15, 0.05, 0.2, 0.05, 0.08, 0.05, 0.3, 0.12],
  [0.1, 0.05, 0.1, 0.05, 0.25, 0.05, 0.25, 0.15],
  [0.1, 0.05, 0.2, 0.05, 0.25, 0.05, 0.08, 0.22],
  [0.12, 0.03, 0.18, 0.05, 0.15, 0.05, 0.22, 0.2],
];

const PIPELINE_STEPS = [
  { label: "Input Tokens", icon: "T", color: "#00E5A0" },
  { label: "Embeddings", icon: "E", color: "#3A7BD5" },
  { label: "Self-Attention xN", icon: "A", color: "#5B52D5" },
  { label: "Feed Forward", icon: "F", color: "#E85A1F" },
  { label: "Output Tokens", icon: "O", color: "#22C55E" },
];

const TOKEN_COLORS = [
  "#00E5A0",
  "#5B52D5",
  "#E85A1F",
  "#3A7BD5",
  "#22C55E",
  "#D4AF4C",
  "#9B59B6",
  "#E74C3C",
];

const MODELS = [
  {
    name: "GPT-5.4",
    provider: "OpenAI",
    icon: "◈",
    color: "#22C55E",
    context: 1000000,
    costIn: 2.5,
    costOut: 10,
    desc: "El modelo flagship de OpenAI. Razonamiento avanzado, herramientas nativas, visión multimodal.",
    tags: ["Multimodal", "Herramientas", "Razonamiento"],
    strengths: "Mejor en código, matemáticas, razonamiento largo",
    weakness: "Costo alto en outputs extensos",
  },
  {
    name: "Claude 4.6",
    provider: "Anthropic",
    icon: "◉",
    color: "#E85A1F",
    context: 1000000,
    costIn: 3,
    costOut: 15,
    desc: "Contexto de 1M tokens. Ideal para análisis de documentos largos, due diligence, y compliance financiero.",
    tags: ["1M Contexto", "Documentos", "Seguro"],
    strengths: "Documentos largos, instrucciones complejas, seguridad",
    weakness: "Más conservador en creatividad libre",
  },
  {
    name: "Gemini 3.1",
    provider: "Google",
    icon: "◆",
    color: "#3A7BD5",
    context: 2000000,
    costIn: 1.25,
    costOut: 5,
    desc: "Contexto de 2M tokens. Integración nativa con Google Workspace, búsqueda web, y datos estructurados.",
    tags: ["2M Contexto", "Google Suite", "Búsqueda"],
    strengths: "Integración Workspace, costo-beneficio, multimodal",
    weakness: "Menos consistente en instrucciones complejas",
  },
  {
    name: "Llama 4",
    provider: "Meta",
    icon: "◇",
    color: "#9B59B6",
    context: 512000,
    costIn: 0,
    costOut: 0,
    desc: "Open-source de Meta. Desplegable on-premise para datos sensibles. Ideal para banca con restricciones de soberanía de datos.",
    tags: ["Open Source", "On-Premise", "Gratis"],
    strengths: "Privacidad total, sin dependencia de terceros, gratis",
    weakness: "Requiere infraestructura propia para producción",
  },
  {
    name: "DeepSeek R1",
    provider: "DeepSeek",
    icon: "◎",
    color: "#D4AF4C",
    context: 128000,
    costIn: 0.55,
    costOut: 2.19,
    desc: "Modelo chino especializado en razonamiento y matemáticas. Cadenas de pensamiento transparentes, excelente costo-beneficio.",
    tags: ["Razonamiento", "Bajo Costo", "Chain-of-Thought"],
    strengths: "Razonamiento matemático, costo ultra bajo",
    weakness: "Restricciones geopolíticas, menos pruebas en español",
  },
  {
    name: "Copilot M365",
    provider: "Microsoft",
    icon: "◐",
    color: "#00E5A0",
    context: 128000,
    costIn: 30,
    costOut: 30,
    desc: "IA integrada en Microsoft 365. Acceso directo a correo, Teams, SharePoint, Excel. Licencia por usuario/mes.",
    tags: ["M365", "Enterprise", "$30/user/mes"],
    strengths: "Integracion nativa con herramientas de trabajo",
    weakness: "Costo alto por usuario, funcionalidad limitada vs. API directa",
  },
];

const PRESETS: Record<
  string,
  { label: string; color: string; system: string; temp: number; model: string }
> = {
  analyst: {
    label: "Analyst",
    color: "#00E5A0",
    system:
      "Eres un analista senior de banca de inversión en BTG Pactual Colombia. Respondes con precisión, citas fuentes, y estructuras tus respuestas con headers claros. Priorizas datos cuantitativos y comparables de mercado. Formato: markdown con tablas cuando aplique.",
    temp: 0.3,
    model: "Claude 4.6",
  },
  research: {
    label: "Research",
    color: "#3A7BD5",
    system:
      "Eres un investigador de equity research para mercados emergentes latinoamericanos. Produces análisis tipo sell-side con tesis de inversión, drivers, riesgos y target price. Usas múltiplos comparables (EV/EBITDA, P/E, P/BV). Tono profesional pero accesible.",
    temp: 0.5,
    model: "GPT-5.4",
  },
  compliance: {
    label: "Compliance",
    color: "#E85A1F",
    system:
      "Eres un oficial de cumplimiento especializado en regulación financiera colombiana (SFC, URF) y estándares internacionales (Basilea, FATF/GAFI). Identificas riesgos regulatorios, citas normas específicas, y propones controles. Nunca das consejo legal definitivo, siempre recomiendas consultar al área jurídica.",
    temp: 0.1,
    model: "Claude 4.6",
  },
  creative: {
    label: "Creative",
    color: "#9B59B6",
    system:
      "Eres un estratega de comunicaciones de BTG Pactual. Produces contenido para presentaciones a C-suite, propuestas de valor para clientes institucionales, y narrativas de marca. Tono: sofisticado, conciso, impactante. Usas datos para respaldar narrativas.",
    temp: 0.9,
    model: "Gemini 3.1",
  },
};

const SIMULATED_RESPONSES: Record<string, string> = {
  analyst:
    "## Análisis: Emisión de Bonos Ecopetrol 2026\n\n### Contexto de Mercado\nEcopetrol enfrenta un entorno de tasas mixto. El spread soberano de Colombia se ubica en ~320bps sobre UST, mientras que Ecopetrol cotiza a ~380bps.\n\n| Métrica | Valor |\n|---|---|\n| Rating S&P | BB+ (Perspectiva Estable) |\n| Deuda Neta/EBITDA | 1.8x |\n| Cobertura de Intereses | 6.2x |\n| Capex 2026E | USD 5.2B |\n\n### Recomendación\nLa emisión es viable en el tramo 7-10Y a un spread estimado de 360-400bps. Se recomienda bookbuilding con ancla institucional en USD 500M.\n\n**Riesgos clave:** precio del Brent <$65, downgrade soberano, riesgo regulatorio transición energética.",
  research:
    "## Tesis de Inversión: Bancolombia (CIB)\n\n**Rating: OVERWEIGHT | Target: COP 42,800 (+23%)**\n\n### Drivers\n1. **NIM expansion:** +45bps YoY por repricing de cartera comercial\n2. **Calidad de activos:** Costo de riesgo convergiendo a 1.8% (vs 2.3% actual)\n3. **Digital:** Nequi alcanza 22M usuarios, monetización acelerándose\n\n### Comparables\n| Banco | P/BV | ROE | P/E 2026E |\n|---|---|---|---|\n| Bancolombia | 0.9x | 14.2% | 6.8x |\n| Davivienda | 0.7x | 11.8% | 7.2x |\n| Banco de Bogotá | 0.8x | 12.5% | 7.0x |\n| LatAm Promedio | 1.2x | 15.1% | 8.5x |\n\nBancolombia cotiza con descuento de 25% vs. pares LatAm. Catalizadores: resultados Q2, potencial inclusión en índice MSCI EM.",
  compliance:
    "## Alerta Regulatoria: Uso de IA en Decisiones Crediticias\n\n### Marco Normativo Aplicable\n- **Circular Básica Jurídica SFC** (Título I, Cap. XII): Debida diligencia y SARLAFT\n- **Circular Externa 029/2024 SFC:** Lineamientos para uso de IA en entidades vigiladas\n- **EU AI Act (Ref.):** Clasificación de IA en servicios financieros como alto riesgo\n\n### Riesgos Identificados\n1. **Sesgo algorítmico:** Modelos entrenados con datos históricos pueden perpetuar discriminación crediticia (Ley 1581/2012, art. 4)\n2. **Explicabilidad:** SFC requiere que decisiones crediticias sean explicables al cliente\n3. **Soberanía de datos:** Modelos cloud pueden transferir datos personales fuera de jurisdicción colombiana\n\n### Controles Recomendados\n- Auditoría de sesgo trimestral con métricas de disparate impact\n- Human-in-the-loop obligatorio para decisiones > $500M COP\n- Registro de prompts y respuestas para trazabilidad (retención 10 años)\n\n**Nota:** Este análisis no constituye concepto jurídico. Consultar con la Vicepresidencia Jurídica.",
  creative:
    "## Propuesta: \"Inteligencia que Mueve Capitales\"\n\n### Narrativa Central\nEn un mercado donde 847 documentos definen una operación de M&A, la diferencia entre 60 horas y 8 horas no es eficiencia — es ventaja competitiva.\n\nBTG Pactual no adopta tecnología. La transforma en capacidad institucional.\n\n### Key Messages para C-Suite\n\n> \"Cada analista de BTG tendrá acceso a la capacidad cognitiva equivalente a un equipo de 10 personas. No para reemplazar talento, sino para amplificarlo.\"\n\n### Métricas de Impacto (Proyección Q3 2026)\n- **87%** reducción en tiempo de due diligence documental\n- **100%** cobertura de documentos vs. ~60% manual\n- **3.2x** incremento en deals evaluados por equipo\n\n### Siguiente Paso\nPiloto con el equipo de IB para la próxima operación de M&A. Timeline: 4 semanas. Inversión: $0 adicional (herramientas ya licenciadas).",
};

/* ─────────────────── HELPER: SIMULATED TOKENIZER ──────────────── */

function simulateTokenize(text: string): { token: string; id: number }[] {
  if (!text.trim()) return [];
  const pieces: string[] = [];
  const words = text.split(/(\s+)/);
  for (const w of words) {
    if (/^\s+$/.test(w)) {
      pieces.push(w);
      continue;
    }
    // crude BPE-ish split
    if (w.length <= 4) {
      pieces.push(w);
    } else {
      const mid = Math.ceil(w.length * 0.6);
      pieces.push(w.slice(0, mid));
      pieces.push(w.slice(mid));
    }
  }
  return pieces
    .filter((p) => p.trim().length > 0)
    .map((p) => ({
      token: p,
      id: Math.abs(
        p.split("").reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0)
      ) % 100000,
    }));
}

/* ────────────────────────── COMPONENT ────────────────────────── */

export default function Sesion1() {
  /* ----- Taxonomy ----- */
  const [activeTaxNode, setActiveTaxNode] = useState<string | null>(null);

  /* ----- Transformer ----- */
  const [selectedToken, setSelectedToken] = useState<number | null>(null);

  /* ----- Tokenizer ----- */
  const [tokenizerText, setTokenizerText] = useState(
    "BTG Pactual Colombia lidera la estructuración de la emisión de bonos verdes por COP 500 mil millones para financiar proyectos de energía renovable."
  );
  const tokens = simulateTokenize(tokenizerText);
  const charCount = tokenizerText.length;
  const tokenCount = tokens.length;
  const costEstimate = ((tokenCount / 1_000_000) * 3).toFixed(6);

  /* ----- Models ----- */
  const [activeModel, setActiveModel] = useState<number | null>(null);
  const [calcTokens, setCalcTokens] = useState(50000);
  const [calcOutputRatio, setCalcOutputRatio] = useState(30);

  /* ----- Config Lab ----- */
  const [preset, setPreset] = useState<string>("analyst");
  const [systemPrompt, setSystemPrompt] = useState(PRESETS.analyst.system);
  const [labModel, setLabModel] = useState(PRESETS.analyst.model);
  const [temperature, setTemperature] = useState(PRESETS.analyst.temp);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [topP, setTopP] = useState(0.95);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [displayedText, setDisplayedText] = useState("");

  const handlePreset = useCallback((key: string) => {
    setPreset(key);
    const p = PRESETS[key];
    setSystemPrompt(p.system);
    setTemperature(p.temp);
    setLabModel(p.model);
    setGeneratedText("");
    setDisplayedText("");
  }, []);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setDisplayedText("");
    const full = SIMULATED_RESPONSES[preset] || SIMULATED_RESPONSES.analyst;
    setGeneratedText(full);
    let i = 0;
    const iv = setInterval(() => {
      i += 3;
      if (i >= full.length) {
        setDisplayedText(full);
        setIsGenerating(false);
        clearInterval(iv);
      } else {
        setDisplayedText(full.slice(0, i));
      }
    }, 12);
  }, [preset]);

  /* ----- Quiz ----- */
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  /* ----- Copy prompt ----- */
  const [copied, setCopied] = useState(false);
  const CHALLENGE_PROMPT = `Eres un analista de banca de inversión en BTG Pactual Colombia.

Contexto: Ecopetrol planea emitir bonos verdes por USD 1.5B a 10 años.

Tarea:
1. Evalúa las condiciones actuales del mercado de deuda corporativa LatAm.
2. Identifica los 3 principales riesgos para esta emisión.
3. Recomienda un rango de spread sobre UST con justificación.
4. Sugiere la estructura óptima (tramo, moneda, covenants clave).

Formato: Memo ejecutivo de máximo 500 palabras con tabla de comparables.`;

  const copyPrompt = useCallback(() => {
    navigator.clipboard.writeText(CHALLENGE_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  /* ─── Temperature label ─── */
  const tempLabel =
    temperature <= 0.3
      ? "Frío — Preciso y determinista"
      : temperature <= 0.7
      ? "Tibio — Balanceado"
      : temperature <= 1.2
      ? "Caliente — Creativo"
      : "Muy caliente — Experimental";
  const tempColor =
    temperature <= 0.3
      ? "#3A7BD5"
      : temperature <= 0.7
      ? "#22C55E"
      : temperature <= 1.2
      ? "#E85A1F"
      : "#E74C3C";

  /* ─────────────────── COST CALCULATOR ──────────────── */
  const inputTokens = calcTokens;
  const outputTokens = Math.round(calcTokens * (calcOutputRatio / 100));

  return (
    <div className="min-h-screen bg-[#080C1F]">
      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden">
        <div className="hero-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_40%,rgba(0,229,160,0.07),transparent),radial-gradient(ellipse_40%_50%_at_70%_60%,rgba(91,82,213,0.06),transparent)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-4 animate-fadeUp">
            Módulo 01 &middot; Fundamentos &middot; Sesión 1 de 2
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white-f leading-tight mb-6 animate-fadeUp-1">
            ¿Qué es la IA?{" "}
            <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
              Del mito a la máquina
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 animate-fadeUp-2">
            Historia, taxonomía, y desmitificación de la IA. Transformers,
            tokenización, y tu primer Config Lab con modelos de lenguaje.
          </p>

          {/* Meta stats */}
          <div className="flex flex-wrap justify-center gap-6 animate-fadeUp-3">
            {[
              { val: "4h", label: "Módulo completo", icon: "◷" },
              { val: "80%", label: "Práctica", icon: "⚡" },
              { val: "3", label: "LLMs en vivo", icon: "◉" },
              { val: "6", label: "Herramientas", icon: "◈" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-[#151A3A] border border-white/[0.06] rounded-2xl px-6 py-4 min-w-[130px]"
              >
                <span className="text-2xl">{s.icon}</span>
                <p className="text-2xl font-bold text-white-f mt-1">{s.val}</p>
                <p className="text-xs text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 2. AGENDA BAR ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-12">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-6">
            Agenda &middot; Sesión 1
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            {AGENDA.map((a, i) => (
              <div
                key={i}
                className="flex-1 rounded-xl p-4 border border-white/[0.06] transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${a.color}12, ${a.color}06)`,
                  borderColor: `${a.color}30`,
                }}
              >
                <p
                  className="font-mono text-xs font-semibold mb-1"
                  style={{ color: a.color }}
                >
                  {a.time}
                </p>
                <p className="text-sm text-white-f font-medium">{a.label}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════════ 3. CASE STUDY ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-6">
            Caso de Estudio &middot; BTG Pactual
          </p>
          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-cyan/10 to-purple/10 px-8 py-6 border-b border-white/[0.06]">
              <h2 className="text-2xl font-bold text-white-f">
                Due Diligence en operación M&A
              </h2>
              <p className="text-muted mt-1">
                Escenario real: adquisición de empresa del sector energía
              </p>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    val: "847",
                    label: "Documentos",
                    sub: "Contratos, financieros, legales, ambientales",
                  },
                  {
                    val: "72h",
                    label: "Deadline",
                    sub: "Ventana crítica de exclusividad",
                  },
                  {
                    val: "3",
                    label: "Analistas",
                    sub: "Equipo IB asignado al deal",
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="text-center p-6 bg-[#0D1229] rounded-xl border border-white/[0.04]"
                  >
                    <p className="text-3xl font-bold text-cyan">{m.val}</p>
                    <p className="text-white-f font-semibold mt-1">
                      {m.label}
                    </p>
                    <p className="text-xs text-muted mt-1">{m.sub}</p>
                  </div>
                ))}
              </div>

              {/* Comparison */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-red/20 bg-red/5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full bg-red" />
                    <h3 className="font-semibold text-white-f">Sin IA</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted">
                    <li className="flex items-start gap-2">
                      <span className="text-red mt-0.5">✕</span>
                      <span>
                        <strong className="text-white-f">60+</strong>{" "}
                        persona-horas de revisión manual
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red mt-0.5">✕</span>
                      <span>
                        Cobertura parcial:{" "}
                        <strong className="text-white-f">~60%</strong> de
                        documentos leidos en detalle
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red mt-0.5">✕</span>
                      <span>
                        Riesgo de omisión de cláusulas críticas por fatiga
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red mt-0.5">✕</span>
                      <span>
                        Inconsistencias entre analistas en criterios de revisión
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 rounded-xl border border-cyan/20 bg-cyan/5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full bg-cyan animate-pulse-dot" />
                    <h3 className="font-semibold text-white-f">
                      Con IA configurada
                    </h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan mt-0.5">✓</span>
                      <span>
                        <strong className="text-white-f">8 horas</strong> con
                        LLM de contexto largo (1M tokens)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan mt-0.5">✓</span>
                      <span>
                        <strong className="text-white-f">100%</strong> cobertura
                        documental
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan mt-0.5">✓</span>
                      <span>
                        Extracción sistemática de riesgos, obligaciones y
                        cláusulas clave
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan mt-0.5">✓</span>
                      <span>
                        Criterios uniformes + trazabilidad de cada hallazgo
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════════ 4. TAXONOMY TREE ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-6">
            Taxonomía &middot; Del concepto general a la IA generativa
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Tree visual */}
            <div className="relative bg-[#151A3A] border border-white/[0.06] rounded-2xl p-8 min-h-[420px]">
              {/* Connection lines */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {TAXONOMY_NODES.slice(0, -1).map((node, i) => (
                  <line
                    key={i}
                    x1={node.x}
                    y1={node.y + 5}
                    x2={TAXONOMY_NODES[i + 1].x}
                    y2={TAXONOMY_NODES[i + 1].y - 3}
                    stroke="rgba(91,82,213,0.3)"
                    strokeWidth="0.3"
                    strokeDasharray="1,1"
                  />
                ))}
              </svg>

              {TAXONOMY_NODES.map((node, i) => {
                const isGenAI = node.id === "genai";
                const isActive = activeTaxNode === node.id;
                const size = 100 - i * 12;
                return (
                  <button
                    key={node.id}
                    onClick={() =>
                      setActiveTaxNode(isActive ? null : node.id)
                    }
                    className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 rounded-2xl border px-6 py-3 cursor-pointer ${
                      isActive
                        ? "border-purple bg-purple/20 scale-105 shadow-lg shadow-purple/20"
                        : isGenAI
                        ? "border-cyan/40 bg-cyan/10 animate-glowPulse"
                        : "border-white/[0.08] bg-[#0D1229] hover:border-purple/40 hover:bg-purple/5"
                    }`}
                    style={{
                      top: `${node.y}%`,
                      width: `${size}%`,
                      maxWidth: "320px",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p
                          className={`font-mono text-xs ${
                            isGenAI ? "text-cyan" : "text-purple-light"
                          }`}
                        >
                          {node.year}
                        </p>
                        <p className="text-white-f font-semibold text-sm">
                          {node.label}
                        </p>
                      </div>
                      <span
                        className={`text-lg ${
                          isGenAI ? "text-cyan" : "text-purple-light"
                        }`}
                      >
                        {isActive ? "−" : "+"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detail panel */}
            <div className="flex items-center">
              {activeTaxNode ? (
                <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-8 w-full animate-fadeUp">
                  {(() => {
                    const node = TAXONOMY_NODES.find(
                      (n) => n.id === activeTaxNode
                    )!;
                    return (
                      <>
                        <div className="flex items-center gap-3 mb-4">
                          <span
                            className={`w-3 h-3 rounded-full ${
                              node.id === "genai" ? "bg-cyan" : "bg-purple"
                            } animate-pulse-dot`}
                          />
                          <h3 className="text-xl font-bold text-white-f">
                            {node.label}
                          </h3>
                        </div>
                        <p className="text-muted leading-relaxed mb-6">
                          {node.detail}
                        </p>
                        <div className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04]">
                          <p className="font-mono text-xs text-orange mb-2">
                            EJEMPLO BTG PACTUAL
                          </p>
                          <p className="text-white-f text-sm font-medium">
                            {node.example}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center w-full py-12">
                  <p className="text-3xl mb-3">←</p>
                  <p className="text-muted text-sm">
                    Haz clic en un nodo para explorar
                  </p>
                  <p className="text-muted/50 text-xs mt-2">
                    El nodo de IA Generativa brilla porque es nuestro foco
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════════ 5. TRANSFORMER VISUALIZATION ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">
            Arquitectura &middot; Transformers
          </p>
          <h2 className="text-2xl font-bold text-white-f mb-2">
            Self-Attention: cómo un modelo &quot;entiende&quot; relaciones
          </h2>
          <p className="text-muted mb-8 max-w-3xl">
            El mecanismo de atención permite que cada token &quot;mire&quot; a
            todos los demás para entender contexto. Haz clic en un token para
            ver sus pesos de atención.
          </p>

          {/* Token bar */}
          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-8 mb-6">
            <p className="font-mono text-xs text-muted mb-4">
              Frase de ejemplo (haz clic en cualquier token):
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {TRANSFORMER_TOKENS.map((t, i) => {
                const isSelected = selectedToken === i;
                const attention =
                  selectedToken !== null
                    ? ATTENTION_WEIGHTS[selectedToken][i]
                    : 0;
                const bgOpacity =
                  selectedToken !== null
                    ? isSelected
                      ? 1
                      : Math.max(0.1, attention * 3)
                    : 0.3;
                return (
                  <button
                    key={i}
                    onClick={() =>
                      setSelectedToken(isSelected ? null : i)
                    }
                    className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 cursor-pointer border ${
                      isSelected
                        ? "border-cyan bg-cyan/30 text-white-f scale-110 shadow-lg shadow-cyan/20"
                        : selectedToken !== null
                        ? "border-purple/40 text-white-f"
                        : "border-white/[0.08] text-white-f hover:border-purple/40"
                    }`}
                    style={{
                      backgroundColor: isSelected
                        ? undefined
                        : selectedToken !== null
                        ? `rgba(91, 82, 213, ${bgOpacity})`
                        : undefined,
                      borderWidth:
                        selectedToken !== null && !isSelected
                          ? `${Math.max(1, attention * 8)}px`
                          : undefined,
                    }}
                  >
                    {t}
                    {selectedToken !== null && !isSelected && (
                      <span className="ml-2 text-[0.65rem] text-purple-light">
                        {(attention * 100).toFixed(0)}%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedToken !== null && (
              <div className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04] mb-6 animate-fadeUp">
                <p className="font-mono text-xs text-cyan mb-2">
                  Atencion desde &quot;{TRANSFORMER_TOKENS[selectedToken]}&quot;
                </p>
                <div className="flex gap-1 items-end h-24">
                  {TRANSFORMER_TOKENS.map((t, i) => {
                    const w = ATTENTION_WEIGHTS[selectedToken][i];
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full rounded-t transition-all duration-500"
                          style={{
                            height: `${w * 250}%`,
                            background:
                              i === selectedToken
                                ? "#00E5A0"
                                : `rgba(91, 82, 213, ${0.3 + w * 2})`,
                          }}
                        />
                        <p className="text-[0.6rem] text-muted mt-1 truncate w-full text-center">
                          {t}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="text-xs text-muted">
              <strong className="text-white-f">Interpretación:</strong> El token
              &quot;riesgo&quot; presta más atención a &quot;Análisis&quot; y
              &quot;bonos&quot; — el modelo aprende que el riesgo se vincula con
              el análisis de instrumentos financieros. Este mecanismo es lo que
              hace a los Transformers superiores a arquitecturas anteriores.
            </p>
          </div>

          {/* Pipeline */}
          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-8">
            <p className="font-mono text-xs text-muted mb-6">
              Pipeline de un Transformer:
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
              {PIPELINE_STEPS.map((step, i) => (
                <div key={i} className="flex items-center flex-1 w-full sm:w-auto">
                  <div
                    className="flex-1 rounded-xl p-4 text-center border border-white/[0.06] hover:scale-105 transition-transform"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}15, ${step.color}05)`,
                      borderColor: `${step.color}30`,
                    }}
                  >
                    <span
                      className="text-2xl font-bold font-mono"
                      style={{ color: step.color }}
                    >
                      {step.icon}
                    </span>
                    <p className="text-xs text-white-f mt-1 font-medium">
                      {step.label}
                    </p>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <span className="text-muted/30 text-xl mx-2 hidden sm:block">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Anatomía de un Transformer (detailed diagram) ── */}
          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-8 mt-6">
            <p className="font-mono text-xs text-orange mb-2 uppercase tracking-widest">
              Diagrama &middot; Anatomía completa
            </p>
            <h3 className="text-xl font-bold text-white-f mb-6">
              Anatomía de un Transformer
            </h3>

            <div className="flex flex-col items-center gap-3">
              {/* INPUT */}
              <div className="w-full max-w-2xl">
                <div className="rounded-xl border border-cyan/30 bg-cyan/5 p-4">
                  <p className="font-mono text-[0.65rem] text-cyan uppercase tracking-widest mb-2">Input</p>
                  <p className="text-white-f text-sm mb-3">
                    &quot;Análisis de riesgo para emisión de bonos Ecopetrol&quot;
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Análisis","de","riesgo","para","emisión","de","bonos","Ecopetrol"].map((t,i) => (
                      <span key={i} className="px-2 py-1 rounded bg-cyan/15 border border-cyan/20 font-mono text-xs text-cyan">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              <span className="text-muted/40 text-2xl">↓</span>

              {/* EMBEDDING */}
              <div className="w-full max-w-2xl">
                <div className="rounded-xl border border-[#3A7BD5]/30 bg-[#3A7BD5]/5 p-4">
                  <p className="font-mono text-[0.65rem] text-[#3A7BD5] uppercase tracking-widest mb-2">
                    Token Embeddings — cada token se convierte en un vector de números
                  </p>
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 32 }).map((_, i) => {
                      const v = (Math.sin(i * 2.1 + 0.3) * 0.5 + 0.5);
                      return (
                        <div key={i} className="h-5 rounded-sm" style={{
                          background: `rgba(58, 123, 213, ${0.1 + v * 0.6})`,
                        }} />
                      );
                    })}
                  </div>
                  <p className="text-muted/50 text-[0.6rem] mt-2 font-mono">
                    [0.23, -0.87, 0.14, 0.92, -0.33, ...] x 4096 dimensiones
                  </p>
                </div>
              </div>

              <span className="text-muted/40 text-lg">+</span>

              {/* POSITIONAL ENCODING */}
              <div className="w-full max-w-2xl">
                <div className="rounded-xl border border-[#D4AF4C]/30 bg-[#D4AF4C]/5 p-4">
                  <p className="font-mono text-[0.65rem] text-[#D4AF4C] uppercase tracking-widest mb-2">
                    Positional Encoding — el modelo sabe el orden de las palabras
                  </p>
                  <div className="flex gap-0.5 h-8 items-end">
                    {Array.from({ length: 40 }).map((_, i) => {
                      const h = Math.abs(Math.sin(i * 0.4)) * 100;
                      return (
                        <div key={i} className="flex-1 rounded-t-sm" style={{
                          height: `${Math.max(10, h)}%`,
                          background: `rgba(212, 175, 76, ${0.2 + Math.abs(Math.sin(i * 0.4)) * 0.5})`,
                        }} />
                      );
                    })}
                  </div>
                  <p className="text-muted/50 text-[0.6rem] mt-2">
                    Ondas sinusoidales que codifican la posición: token 1, token 2, ... token N
                  </p>
                </div>
              </div>

              <span className="text-muted/40 text-2xl">↓</span>

              {/* ATTENTION BLOCK (expanded) */}
              <div className="w-full max-w-2xl">
                <div className="rounded-xl border border-[#5B52D5]/30 bg-[#5B52D5]/5 p-4">
                  <p className="font-mono text-[0.65rem] text-[#5B52D5] uppercase tracking-widest mb-3">
                    Multi-Head Self-Attention
                  </p>

                  {/* Q K V */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "Query (Q)", desc: "¿Qué estoy buscando?", color: "#E85A1F" },
                      { label: "Key (K)", desc: "¿Qué información tengo?", color: "#5B52D5" },
                      { label: "Value (V)", desc: "¿Cuál es el contenido?", color: "#00E5A0" },
                    ].map((m) => (
                      <div key={m.label} className="rounded-lg p-3 border" style={{
                        background: `${m.color}10`,
                        borderColor: `${m.color}30`,
                      }}>
                        <p className="font-mono text-xs font-bold" style={{ color: m.color }}>{m.label}</p>
                        <p className="text-muted text-[0.65rem] mt-1">{m.desc}</p>
                        <div className="grid grid-cols-4 gap-0.5 mt-2">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div key={i} className="h-3 rounded-sm" style={{
                              background: `${m.color}${Math.floor(15 + Math.random() * 40).toString(16)}`,
                            }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Attention = softmax(QK^T / sqrt(d)) * V */}
                  <div className="bg-[#0D1229] rounded-lg p-3 border border-white/[0.04] mb-3">
                    <p className="font-mono text-xs text-white-f text-center">
                      Attention(Q, K, V) = softmax(Q &middot; K<sup>T</sup> / &radic;d<sub>k</sub>) &middot; V
                    </p>
                  </div>

                  {/* Heatmap */}
                  <p className="font-mono text-[0.6rem] text-muted mb-2">Matriz de atención (scores):</p>
                  <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(8, 1fr)" }}>
                    {Array.from({ length: 64 }).map((_, i) => {
                      const row = Math.floor(i / 8);
                      const col = i % 8;
                      const w = ATTENTION_WEIGHTS[row]?.[col] ?? 0.1;
                      return (
                        <div key={i} className="aspect-square rounded-sm" style={{
                          background: w > 0.2 ? `rgba(91, 82, 213, ${0.2 + w * 2.5})` : `rgba(91, 82, 213, ${0.05 + w})`,
                        }} />
                      );
                    })}
                  </div>
                  <p className="text-muted/50 text-[0.6rem] mt-1">
                    Cada celda muestra cuánta atención presta un token a otro. Más oscuro = más atención.
                  </p>
                </div>
              </div>

              <span className="text-muted/40 text-2xl">↓</span>

              {/* FEED FORWARD */}
              <div className="w-full max-w-2xl">
                <div className="rounded-xl border border-[#E85A1F]/30 bg-[#E85A1F]/5 p-4 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[0.65rem] text-[#E85A1F] uppercase tracking-widest">Feed Forward Network</p>
                    <p className="text-muted text-xs mt-1">Procesamiento no-lineal de cada posición independientemente</p>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-4 h-8 rounded bg-[#E85A1F]/20 border border-[#E85A1F]/30" />
                    <div className="w-4 h-12 rounded bg-[#E85A1F]/30 border border-[#E85A1F]/30" />
                    <div className="w-4 h-8 rounded bg-[#E85A1F]/20 border border-[#E85A1F]/30" />
                  </div>
                </div>
              </div>

              {/* RESIDUAL + LAYER NORM */}
              <div className="w-full max-w-2xl flex items-center gap-3">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple/40 to-transparent" />
                <span className="font-mono text-[0.6rem] text-muted px-3 py-1 rounded-full border border-white/[0.06] bg-[#0D1229]">
                  + Residual &amp; LayerNorm
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple/40 to-transparent" />
              </div>

              {/* STACK */}
              <div className="w-full max-w-2xl">
                <div className="rounded-xl border border-white/[0.1] bg-white/[0.02] p-4 text-center relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#151A3A] border border-white/[0.1] font-mono text-xs text-muted">
                    &times;N capas
                  </div>
                  <div className="flex justify-center gap-1 mt-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="w-6 h-10 rounded border border-white/[0.08]" style={{
                        background: `linear-gradient(180deg, rgba(91,82,213,${0.05 + i * 0.03}), rgba(0,229,160,${0.02 + i * 0.02}))`,
                      }} />
                    ))}
                  </div>
                  <p className="text-muted text-xs mt-3">
                    GPT-5.4: 120 capas &middot; Claude 4.6: 96 capas &middot; Gemini 3.1: 80 capas
                  </p>
                </div>
              </div>

              <span className="text-muted/40 text-2xl">↓</span>

              {/* OUTPUT */}
              <div className="w-full max-w-2xl">
                <div className="rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/5 p-4">
                  <p className="font-mono text-[0.65rem] text-[#22C55E] uppercase tracking-widest mb-2">
                    Output — Distribución de probabilidad sobre vocabulario
                  </p>
                  <div className="flex gap-1 items-end h-16 mb-2">
                    {[
                      { t: "Ecopetrol", p: 0.42 },
                      { t: "bonos", p: 0.18 },
                      { t: "Colombia", p: 0.12 },
                      { t: "corporativo", p: 0.08 },
                      { t: "de", p: 0.06 },
                      { t: "BB+", p: 0.05 },
                      { t: "...", p: 0.03 },
                    ].map((item, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div className="w-full rounded-t transition-all" style={{
                          height: `${item.p * 150}%`,
                          background: i === 0 ? "#22C55E" : `rgba(34, 197, 94, ${0.15 + item.p})`,
                        }} />
                        <p className="text-[0.5rem] text-muted mt-1 truncate w-full text-center font-mono">{item.t}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#0D1229] rounded-lg p-2 border border-white/[0.04] text-center">
                    <p className="text-xs text-white-f">
                      Siguiente token predicho: <strong className="text-[#22C55E] font-mono">&quot;Ecopetrol&quot;</strong>
                      <span className="text-muted ml-2">(p=0.42)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Cómo aprende un LLM ── */}
          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-8 mt-6">
            <p className="font-mono text-xs text-orange mb-2 uppercase tracking-widest">
              Proceso &middot; Entrenamiento
            </p>
            <h3 className="text-xl font-bold text-white-f mb-6">
              ¿Cómo aprende un LLM?
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Phase 1 */}
              <div className="rounded-xl border border-[#3A7BD5]/30 bg-[#3A7BD5]/5 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#3A7BD5]/20 border border-[#3A7BD5]/40 flex items-center justify-center">
                    <span className="text-[#3A7BD5] font-bold text-sm">1</span>
                  </div>
                  <p className="text-[#3A7BD5] font-semibold text-sm">Pre-entrenamiento</p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex gap-2 text-xs text-muted">
                    <span>📚</span><span>Internet, libros, código, reportes financieros</span>
                  </div>
                  <div className="flex items-center justify-center py-2">
                    <span className="text-muted text-lg">↓</span>
                  </div>
                  <div className="flex gap-2 text-xs text-muted">
                    <span>🧠</span><span>El modelo absorbe patrones del lenguaje</span>
                  </div>
                </div>

                <div className="bg-[#0D1229] rounded-lg p-3 border border-white/[0.04]">
                  <p className="font-mono text-xs text-muted mb-1">Objetivo: predecir la siguiente palabra</p>
                  <p className="text-white-f text-sm font-mono">
                    &quot;El EBITDA de Ecopetrol fue de <span className="px-2 py-0.5 rounded bg-[#3A7BD5]/20 border border-[#3A7BD5]/30 text-[#3A7BD5]">___</span>&quot;
                  </p>
                </div>

                <div className="mt-3 text-[0.6rem] text-muted/50">
                  ~10 billones de tokens &middot; Meses de entrenamiento &middot; Millones de USD en GPUs
                </div>
              </div>

              {/* Phase 2 */}
              <div className="rounded-xl border border-[#5B52D5]/30 bg-[#5B52D5]/5 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#5B52D5]/20 border border-[#5B52D5]/40 flex items-center justify-center">
                    <span className="text-[#5B52D5] font-bold text-sm">2</span>
                  </div>
                  <p className="text-[#5B52D5] font-semibold text-sm">Fine-tuning + RLHF</p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="bg-[#0D1229] rounded-lg p-3 border border-white/[0.04] space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[#22C55E]">👍</span>
                      <p className="text-xs text-white-f">&quot;El rating de Ecopetrol es BB+ según S&P.&quot;</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#E74C3C]">👎</span>
                      <p className="text-xs text-muted line-through">&quot;Ecopetrol es la mejor inversión del mundo.&quot;</p>
                    </div>
                  </div>
                </div>

                <p className="text-muted text-xs leading-relaxed">
                  Evaluadores humanos califican las respuestas. El modelo aprende qué respuestas son <strong className="text-white-f">útiles, seguras y honestas</strong>.
                </p>

                <div className="mt-3 text-[0.6rem] text-muted/50">
                  RLHF = Reinforcement Learning from Human Feedback
                </div>
              </div>

              {/* Phase 3 */}
              <div className="rounded-xl border border-[#00E5A0]/30 bg-[#00E5A0]/5 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#00E5A0]/20 border border-[#00E5A0]/40 flex items-center justify-center">
                    <span className="text-[#00E5A0] font-bold text-sm">3</span>
                  </div>
                  <p className="text-[#00E5A0] font-semibold text-sm">Prompt (Inferencia)</p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="bg-[#0D1229] rounded-lg p-3 border border-white/[0.04]">
                    <p className="font-mono text-[0.6rem] text-muted mb-1">Usuario escribe:</p>
                    <p className="text-xs text-white-f">&quot;Evalúa el perfil crediticio de Ecopetrol para una emisión de bonos verdes.&quot;</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-muted text-lg">↓</span>
                  </div>
                  <div className="bg-[#0D1229] rounded-lg p-3 border border-[#00E5A0]/20">
                    <p className="font-mono text-[0.6rem] text-[#00E5A0] mb-1">Modelo genera:</p>
                    <p className="text-xs text-white-f">&quot;Ecopetrol presenta un perfil crediticio BB+ con Deuda/EBITDA de 1.8x...&quot;</p>
                  </div>
                </div>

                <div className="bg-[#00E5A0]/10 rounded-lg p-3 border border-[#00E5A0]/20">
                  <p className="text-xs text-[#00E5A0] font-semibold text-center">
                    Aquí es donde BTG interactúa con el modelo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════════ 5B. QUE ES UN TOKEN ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">
            Concepto clave &middot; Tokens
          </p>
          <h2 className="text-2xl font-bold text-white-f mb-2">
            ¿Qué es un token?
          </h2>
          <p className="text-muted mb-8 max-w-3xl">
            Un LLM no lee palabras completas — lee <strong className="text-white-f">tokens</strong>, fragmentos
            de texto que pueden ser palabras, partes de palabras, signos de puntuación o números.
            Piensa en ellos como los ladrillos de LEGO con los que el modelo construye significado.
          </p>

          {/* LEGO metaphor */}
          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-1">
                {["#00E5A0","#5B52D5","#E85A1F","#3A7BD5","#22C55E"].map((c,i) => (
                  <div key={i} className="w-8 h-8 rounded-md border-2 border-white/20" style={{ background: c }} />
                ))}
              </div>
              <p className="text-white-f text-sm">
                Un token es como un <strong className="text-cyan">ladrillo de LEGO</strong> — el LLM construye significado ensamblando piezas.
                Cada pieza tiene un color (significado) y una forma (ID numérico) que el modelo reconoce.
              </p>
            </div>

            {/* Progressive tokenization */}
            <div className="space-y-6">
              {/* Step 1: Original text */}
              <div>
                <p className="font-mono text-[0.65rem] text-muted uppercase tracking-widest mb-2">
                  1. Texto original
                </p>
                <div className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04]">
                  <p className="text-white-f font-mono text-sm">
                    BTG Pactual lidera la emisión de bonos verdes en Latinoamérica.
                  </p>
                </div>
              </div>

              {/* Step 2: Split into words */}
              <div className="flex items-center gap-3">
                <span className="text-muted text-xl">↓</span>
                <span className="font-mono text-[0.65rem] text-muted uppercase tracking-widest">
                  Separación en palabras
                </span>
              </div>
              <div>
                <p className="font-mono text-[0.65rem] text-muted uppercase tracking-widest mb-2">
                  2. Palabras
                </p>
                <div className="flex flex-wrap gap-2">
                  {["BTG","Pactual","lidera","la","emisión","de","bonos","verdes","en","Latinoamérica","."].map((w,i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white-f font-mono text-sm">
                      {w}
                    </span>
                  ))}
                </div>
              </div>

              {/* Step 3: Subword tokens */}
              <div className="flex items-center gap-3">
                <span className="text-muted text-xl">↓</span>
                <span className="font-mono text-[0.65rem] text-muted uppercase tracking-widest">
                  BPE (Byte Pair Encoding) subdivide palabras infrecuentes
                </span>
              </div>
              <div>
                <p className="font-mono text-[0.65rem] text-muted uppercase tracking-widest mb-2">
                  3. Tokens (subpalabras)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { t: "BT", c: "#00E5A0" }, { t: "G", c: "#00E5A0" },
                    { t: " Pact", c: "#5B52D5" }, { t: "ual", c: "#5B52D5" },
                    { t: " lider", c: "#E85A1F" }, { t: "a", c: "#E85A1F" },
                    { t: " la", c: "#3A7BD5" },
                    { t: " emisi", c: "#22C55E" }, { t: "ón", c: "#22C55E" },
                    { t: " de", c: "#3A7BD5" },
                    { t: " bon", c: "#D4AF4C" }, { t: "os", c: "#D4AF4C" },
                    { t: " verd", c: "#9B59B6" }, { t: "es", c: "#9B59B6" },
                    { t: " en", c: "#3A7BD5" },
                    { t: " Latin", c: "#E74C3C" }, { t: "oam", c: "#E74C3C" }, { t: "érica", c: "#E74C3C" },
                    { t: ".", c: "#6B7280" },
                  ].map((tk, i) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-1.5 rounded-md font-mono text-sm border border-white/[0.06]"
                      style={{ background: `${tk.c}18`, color: tk.c }}>
                      {tk.t.replace(/ /g, "\u00B7")}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted/60 mt-2">
                  * El punto medio (·) representa un espacio. Los tokenizadores codifican espacios como parte del token.
                </p>
              </div>

              {/* Step 4: IDs */}
              <div className="flex items-center gap-3">
                <span className="text-muted text-xl">↓</span>
                <span className="font-mono text-[0.65rem] text-muted uppercase tracking-widest">
                  Cada token se mapea a un ID numérico del vocabulario
                </span>
              </div>
              <div>
                <p className="font-mono text-[0.65rem] text-muted uppercase tracking-widest mb-2">
                  4. IDs numéricos (lo que realmente procesa el modelo)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[33, 42, 7412, 940, 48826, 64, 2751, 15723, 357, 84, 6301, 437, 9047, 288, 479, 50782, 78204, 42910, 13].map((id, i) => (
                    <span key={i} className="px-2.5 py-1.5 rounded-md bg-[#0D1229] border border-white/[0.04] font-mono text-xs text-cyan">
                      {id}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-side: token count comparison */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
              <p className="font-mono text-xs text-cyan mb-4">PALABRA CORTA / FRECUENTE</p>
              <div className="space-y-4">
                <div>
                  <p className="text-muted text-xs mb-1">Palabra:</p>
                  <span className="px-4 py-2 rounded-lg bg-cyan/10 border border-cyan/30 text-cyan font-mono text-lg font-bold">
                    Ecopetrol
                  </span>
                </div>
                <div>
                  <p className="text-muted text-xs mb-1">Tokens:</p>
                  <div className="flex gap-1.5">
                    <span className="px-3 py-1.5 rounded-md bg-cyan/15 border border-cyan/20 font-mono text-sm text-cyan">
                      Eco
                    </span>
                    <span className="px-3 py-1.5 rounded-md bg-cyan/15 border border-cyan/20 font-mono text-sm text-cyan">
                      pet
                    </span>
                    <span className="px-3 py-1.5 rounded-md bg-cyan/15 border border-cyan/20 font-mono text-sm text-cyan">
                      rol
                    </span>
                  </div>
                  <p className="text-white-f font-mono text-sm mt-2">= <strong>3 tokens</strong></p>
                </div>
              </div>
            </div>

            <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
              <p className="font-mono text-xs text-orange mb-4">PALABRA LARGA / INFRECUENTE</p>
              <div className="space-y-4">
                <div>
                  <p className="text-muted text-xs mb-1">Palabra:</p>
                  <span className="px-4 py-2 rounded-lg bg-orange/10 border border-orange/30 text-orange font-mono text-lg font-bold">
                    descarbonización
                  </span>
                </div>
                <div>
                  <p className="text-muted text-xs mb-1">Tokens:</p>
                  <div className="flex gap-1.5">
                    <span className="px-3 py-1.5 rounded-md bg-orange/15 border border-orange/20 font-mono text-sm text-orange">
                      des
                    </span>
                    <span className="px-3 py-1.5 rounded-md bg-orange/15 border border-orange/20 font-mono text-sm text-orange">
                      carbon
                    </span>
                    <span className="px-3 py-1.5 rounded-md bg-orange/15 border border-orange/20 font-mono text-sm text-orange">
                      izaci
                    </span>
                    <span className="px-3 py-1.5 rounded-md bg-orange/15 border border-orange/20 font-mono text-sm text-orange">
                      ón
                    </span>
                  </div>
                  <p className="text-white-f font-mono text-sm mt-2">= <strong>4 tokens</strong></p>
                </div>
              </div>
            </div>
          </div>

          {/* Everything is a token */}
          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
            <p className="font-mono text-xs text-purple-light mb-4">TODO SE TOKENIZA: ESPACIOS, PUNTUACIÓN Y NÚMEROS</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04] text-center">
                <p className="text-muted text-xs mb-2">Espacios</p>
                <div className="flex justify-center gap-1">
                  <span className="px-2 py-1 rounded bg-purple/20 border border-purple/30 font-mono text-sm text-purple">·</span>
                  <span className="px-2 py-1 rounded bg-purple/20 border border-purple/30 font-mono text-sm text-purple">\n</span>
                  <span className="px-2 py-1 rounded bg-purple/20 border border-purple/30 font-mono text-sm text-purple">\t</span>
                </div>
              </div>
              <div className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04] text-center">
                <p className="text-muted text-xs mb-2">Puntuación</p>
                <div className="flex justify-center gap-1">
                  <span className="px-2 py-1 rounded bg-orange/20 border border-orange/30 font-mono text-sm text-orange">.</span>
                  <span className="px-2 py-1 rounded bg-orange/20 border border-orange/30 font-mono text-sm text-orange">,</span>
                  <span className="px-2 py-1 rounded bg-orange/20 border border-orange/30 font-mono text-sm text-orange">$</span>
                  <span className="px-2 py-1 rounded bg-orange/20 border border-orange/30 font-mono text-sm text-orange">%</span>
                </div>
              </div>
              <div className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04] text-center">
                <p className="text-muted text-xs mb-2">Números</p>
                <div className="flex justify-center gap-1">
                  <span className="px-2 py-1 rounded bg-cyan/20 border border-cyan/30 font-mono text-sm text-cyan">500</span>
                  <span className="px-2 py-1 rounded bg-cyan/20 border border-cyan/30 font-mono text-sm text-cyan">,</span>
                  <span className="px-2 py-1 rounded bg-cyan/20 border border-cyan/30 font-mono text-sm text-cyan">000</span>
                </div>
                <p className="text-muted/50 text-[0.6rem] mt-1">500,000 = 3 tokens</p>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════════ 6. TOKENIZER ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">
            Laboratorio &middot; Tokenización
          </p>
          <h2 className="text-2xl font-bold text-white-f mb-2">
            Cómo un LLM &quot;ve&quot; tu texto
          </h2>
          <p className="text-muted mb-8 max-w-3xl">
            Los modelos no leen palabras — leen tokens. Cada token es un
            fragmento que el modelo procesa. Escribe cualquier texto para ver
            cómo se tokeniza.
          </p>

          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-8">
            <textarea
              value={tokenizerText}
              onChange={(e) => setTokenizerText(e.target.value)}
              className="w-full bg-[#0D1229] border border-white/[0.08] rounded-xl p-4 text-white-f text-sm font-mono resize-none focus:outline-none focus:border-purple/50 transition-colors"
              rows={3}
              placeholder="Escribe texto para tokenizar..."
            />

            {/* Token chips */}
            <div className="flex flex-wrap gap-1.5 mt-6 min-h-[60px]">
              {tokens.map((tk, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono animate-tokenPop border border-white/[0.06]"
                  style={{
                    animationDelay: `${i * 30}ms`,
                    background: `${TOKEN_COLORS[i % TOKEN_COLORS.length]}18`,
                    color: TOKEN_COLORS[i % TOKEN_COLORS.length],
                  }}
                >
                  {tk.token}
                  <span className="text-[0.6rem] opacity-50">{tk.id}</span>
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-[#0D1229] rounded-xl p-4 text-center border border-white/[0.04]">
                <p className="text-2xl font-bold text-cyan">{tokenCount}</p>
                <p className="text-xs text-muted">Tokens</p>
              </div>
              <div className="bg-[#0D1229] rounded-xl p-4 text-center border border-white/[0.04]">
                <p className="text-2xl font-bold text-purple">{charCount}</p>
                <p className="text-xs text-muted">Caracteres</p>
              </div>
              <div className="bg-[#0D1229] rounded-xl p-4 text-center border border-white/[0.04]">
                <p className="text-2xl font-bold text-orange">${costEstimate}</p>
                <p className="text-xs text-muted">
                  Costo estimado (Claude Sonnet)
                </p>
              </div>
            </div>

            <p className="text-xs text-muted/60 mt-4">
              * Simulacion aproximada. Los tokenizadores reales (tiktoken, SentencePiece) usan BPE con vocabularios de 100K+ tokens.
              Precio referencia: $3 USD / 1M input tokens para Claude Sonnet.
            </p>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════════ 7. MODEL PANORAMA ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">
            Panorama &middot; Modelos de Lenguaje 2026
          </p>
          <h2 className="text-2xl font-bold text-white-f mb-8">
            6 modelos que debes conocer
          </h2>

          {/* Model cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {MODELS.map((m, i) => (
              <button
                key={i}
                onClick={() => setActiveModel(activeModel === i ? null : i)}
                className={`text-left bg-[#151A3A] border rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
                  activeModel === i
                    ? "border-purple scale-[1.02] shadow-lg shadow-purple/10"
                    : "border-white/[0.06] hover:border-white/[0.12]"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl" style={{ color: m.color }}>
                    {m.icon}
                  </span>
                  <div>
                    <p className="text-white-f font-semibold">{m.name}</p>
                    <p className="text-xs text-muted">{m.provider}</p>
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed mb-3 line-clamp-2">
                  {m.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {m.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[0.65rem] font-mono border border-white/[0.08] text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          {activeModel !== null && (
            <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-8 mb-8 animate-fadeUp">
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="text-3xl"
                  style={{ color: MODELS[activeModel].color }}
                >
                  {MODELS[activeModel].icon}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white-f">
                    {MODELS[activeModel].name}
                  </h3>
                  <p className="text-sm text-muted">
                    {MODELS[activeModel].provider}
                  </p>
                </div>
              </div>
              <p className="text-muted leading-relaxed mb-6">
                {MODELS[activeModel].desc}
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04]">
                  <p className="font-mono text-xs text-cyan mb-2">
                    FORTALEZAS
                  </p>
                  <p className="text-sm text-white-f">
                    {MODELS[activeModel].strengths}
                  </p>
                </div>
                <div className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04]">
                  <p className="font-mono text-xs text-orange mb-2">
                    LIMITACIONES
                  </p>
                  <p className="text-sm text-white-f">
                    {MODELS[activeModel].weakness}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Comparison table */}
          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl overflow-hidden mb-8">
            <div className="px-8 py-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-bold text-white-f">
                Tabla comparativa
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-muted">
                    <th className="text-left px-6 py-3 font-mono text-xs">
                      Modelo
                    </th>
                    <th className="text-left px-6 py-3 font-mono text-xs">
                      Contexto
                    </th>
                    <th className="text-left px-6 py-3 font-mono text-xs">
                      Input $/1M
                    </th>
                    <th className="text-left px-6 py-3 font-mono text-xs">
                      Output $/1M
                    </th>
                    <th className="text-left px-6 py-3 font-mono text-xs">
                      Mejor para
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MODELS.map((m, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-3">
                        <span className="text-white-f font-medium">
                          {m.name}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-mono text-xs">
                        {m.context >= 1000000
                          ? `${m.context / 1000000}M`
                          : `${m.context / 1000}K`}
                      </td>
                      <td className="px-6 py-3 font-mono text-xs">
                        {m.costIn === 0
                          ? "Gratis"
                          : m.name === "Copilot M365"
                          ? "$30/user/mes"
                          : `$${m.costIn}`}
                      </td>
                      <td className="px-6 py-3 font-mono text-xs">
                        {m.costOut === 0
                          ? "Gratis"
                          : m.name === "Copilot M365"
                          ? "—"
                          : `$${m.costOut}`}
                      </td>
                      <td className="px-6 py-3 text-xs text-muted">
                        {m.strengths.split(",")[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Ventana de contexto explicada ── */}
          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-8 mb-8">
            <p className="font-mono text-xs text-orange mb-2 uppercase tracking-widest">
              Concepto clave &middot; Contexto
            </p>
            <h3 className="text-xl font-bold text-white-f mb-2">
              Ventana de contexto explicada
            </h3>
            <p className="text-muted text-sm mb-6">
              La ventana de contexto es la cantidad máxima de texto que un LLM puede &quot;ver&quot; a la vez.
              Imagina una ventana deslizándose sobre un documento largo — el modelo solo puede leer lo que está dentro de la ventana.
            </p>

            {/* Visual scale */}
            <div className="space-y-4 mb-8">
              {[
                { tokens: "128K", pages: "~300 págs", equiv: "1 novela corta", width: "6.4%", color: "#E85A1F", icon: "📖" },
                { tokens: "512K", pages: "~1,200 págs", equiv: "3 informes anuales de Ecopetrol", width: "25.6%", color: "#9B59B6", icon: "📊" },
                { tokens: "1M", pages: "~2,500 págs", equiv: "1 data room completo de M&A", width: "50%", color: "#5B52D5", icon: "🏢" },
                { tokens: "2M", pages: "~5,000 págs", equiv: "2 data rooms + historial crediticio", width: "100%", color: "#00E5A0", icon: "🏦" },
              ].map((item) => (
                <div key={item.tokens} className="flex items-center gap-4">
                  <span className="text-lg w-8 text-center shrink-0">{item.icon}</span>
                  <span className="font-mono text-xs w-16 shrink-0" style={{ color: item.color }}>{item.tokens}</span>
                  <div className="flex-1">
                    <div className="h-8 rounded-full bg-[#0D1229] border border-white/[0.04] overflow-hidden">
                      <div className="h-full rounded-full flex items-center px-3 transition-all duration-700" style={{
                        width: item.width,
                        background: `linear-gradient(90deg, ${item.color}40, ${item.color}20)`,
                        borderRight: `2px solid ${item.color}`,
                      }}>
                        <span className="text-[0.6rem] text-white-f font-mono whitespace-nowrap">{item.pages}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted w-64 shrink-0 hidden sm:block">{item.equiv}</span>
                </div>
              ))}
            </div>

            {/* BTG document examples */}
            <div className="bg-[#0D1229] rounded-xl p-6 border border-white/[0.04]">
              <p className="font-mono text-xs text-cyan mb-4 uppercase tracking-widest">
                ¿Cuántos documentos de BTG caben en la ventana?
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { doc: "Contrato típico", tokens: "~15K tokens", icon: "📄", color: "#3A7BD5", pct: "1.5%" },
                  { doc: "Estado financiero", tokens: "~25K tokens", icon: "📈", color: "#22C55E", pct: "2.5%" },
                  { doc: "Historial crediticio", tokens: "~5K tokens", icon: "💳", color: "#D4AF4C", pct: "0.5%" },
                  { doc: "Data room M&A completo", tokens: "~2-5M tokens", icon: "🗄", color: "#E85A1F", pct: "200-500%" },
                ].map((d) => (
                  <div key={d.doc} className="rounded-xl p-4 border" style={{
                    background: `${d.color}08`,
                    borderColor: `${d.color}25`,
                  }}>
                    <span className="text-2xl">{d.icon}</span>
                    <p className="text-white-f text-sm font-medium mt-2">{d.doc}</p>
                    <p className="font-mono text-xs mt-1" style={{ color: d.color }}>{d.tokens}</p>
                    <div className="mt-2 h-1.5 rounded-full bg-[#0D1229] overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${Math.min(100, parseFloat(d.pct))}%`,
                        background: d.color,
                      }} />
                    </div>
                    <p className="text-muted/50 text-[0.6rem] mt-1">{d.pct} de ventana 1M</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted/60 mt-4">
                * Un data room completo de M&A puede exceder la ventana de contexto de la mayoría de modelos.
                Para estos casos se usan técnicas como RAG (Retrieval-Augmented Generation) o procesamiento por partes.
              </p>
            </div>
          </div>

          {/* Context window bars */}
          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-8 mb-8">
            <h3 className="text-lg font-bold text-white-f mb-6">
              Ventana de contexto (tokens)
            </h3>
            <div className="space-y-3">
              {MODELS.sort((a, b) => b.context - a.context).map((m) => {
                const maxCtx = 2000000;
                const pct = (m.context / maxCtx) * 100;
                return (
                  <div key={m.name} className="flex items-center gap-4">
                    <span className="text-xs text-muted w-28 shrink-0 font-mono">
                      {m.name}
                    </span>
                    <div className="flex-1 h-6 bg-[#0D1229] rounded-full overflow-hidden border border-white/[0.04]">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${m.color}, ${m.color}80)`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted w-16 text-right font-mono">
                      {m.context >= 1000000
                        ? `${m.context / 1000000}M`
                        : `${m.context / 1000}K`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cost calculator */}
          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white-f mb-6">
              Calculadora de costo
            </h3>
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-xs text-muted block mb-2">
                  Tokens de entrada:{" "}
                  <span className="text-white-f font-mono">
                    {inputTokens.toLocaleString()}
                  </span>
                </label>
                <input
                  type="range"
                  min={1000}
                  max={1000000}
                  step={1000}
                  value={calcTokens}
                  onChange={(e) => setCalcTokens(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-muted block mb-2">
                  Ratio output/input:{" "}
                  <span className="text-white-f font-mono">
                    {calcOutputRatio}%
                  </span>{" "}
                  ({outputTokens.toLocaleString()} tokens)
                </label>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={calcOutputRatio}
                  onChange={(e) => setCalcOutputRatio(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {MODELS.filter((m) => m.name !== "Copilot M365").map((m) => {
                const costInTotal = (inputTokens / 1_000_000) * m.costIn;
                const costOutTotal = (outputTokens / 1_000_000) * m.costOut;
                const total = costInTotal + costOutTotal;
                return (
                  <div
                    key={m.name}
                    className="bg-[#0D1229] rounded-xl p-4 text-center border border-white/[0.04]"
                  >
                    <p className="text-xs text-muted mb-1">{m.name}</p>
                    <p className="text-lg font-bold font-mono" style={{ color: m.color }}>
                      ${total === 0 ? "0.00" : total.toFixed(4)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════════ 7B. SYSTEM vs USER PROMPT ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">
            Concepto clave &middot; Capas del prompt
          </p>
          <h2 className="text-2xl font-bold text-white-f mb-2">
            System Prompt vs User Prompt
          </h2>
          <p className="text-muted mb-8 max-w-3xl">
            Cada interacción con un LLM tiene capas. Entender la diferencia entre system prompt,
            contexto y user prompt es clave para obtener resultados profesionales y consistentes.
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Nested boxes diagram */}
            <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
              <p className="font-mono text-xs text-muted mb-4">Estructura de capas:</p>

              {/* System prompt - outer */}
              <div className="rounded-xl border-2 border-[#5B52D5]/50 bg-[#5B52D5]/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-[#5B52D5]" />
                  <p className="font-mono text-xs text-[#5B52D5] uppercase tracking-widest">System Prompt</p>
                </div>
                <p className="text-muted text-xs mb-4">
                  Define el rol, reglas, personalidad y límites del modelo.
                  El usuario final normalmente no lo ve.
                </p>

                {/* Context - middle */}
                <div className="rounded-xl border-2 border-[#3A7BD5]/50 bg-[#3A7BD5]/5 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-[#3A7BD5]" />
                    <p className="font-mono text-xs text-[#3A7BD5] uppercase tracking-widest">Contexto / Ejemplos</p>
                  </div>
                  <p className="text-muted text-xs mb-4">
                    Datos de referencia, formato esperado, few-shot examples.
                  </p>

                  {/* User prompt - inner */}
                  <div className="rounded-xl border-2 border-[#00E5A0]/50 bg-[#00E5A0]/5 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-[#00E5A0] animate-pulse-dot" />
                      <p className="font-mono text-xs text-[#00E5A0] uppercase tracking-widest">User Prompt</p>
                    </div>
                    <p className="text-muted text-xs">
                      La instrucción específica del usuario. Cambia con cada interacción.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BTG Example */}
            <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
              <p className="font-mono text-xs text-muted mb-4">Ejemplo BTG Pactual:</p>

              <div className="space-y-3">
                {/* System */}
                <div className="rounded-xl border border-[#5B52D5]/30 bg-[#5B52D5]/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5B52D5]" />
                    <p className="font-mono text-[0.65rem] text-[#5B52D5] uppercase">System</p>
                  </div>
                  <p className="text-white-f text-sm font-mono leading-relaxed">
                    &quot;Eres un analista senior de riesgo en BTG Pactual Colombia.
                    Respondes con datos cuantitativos, citas rating agencies, y
                    estructuras tu respuesta como memo ejecutivo. Nunca das recomendación
                    de inversión directa.&quot;
                  </p>
                </div>

                {/* Context */}
                <div className="rounded-xl border border-[#3A7BD5]/30 bg-[#3A7BD5]/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3A7BD5]" />
                    <p className="font-mono text-[0.65rem] text-[#3A7BD5] uppercase">Contexto</p>
                  </div>
                  <p className="text-white-f text-sm font-mono leading-relaxed">
                    &quot;Datos de la emisión: Monto: USD 1.5B &middot; Plazo: 10Y &middot;
                    Rating actual: BB+ (S&P) &middot; Emisor: Ecopetrol &middot;
                    Tipo: Bono verde &middot; Spread soberano: 320bps&quot;
                  </p>
                </div>

                {/* User */}
                <div className="rounded-xl border border-[#00E5A0]/30 bg-[#00E5A0]/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00E5A0] animate-pulse-dot" />
                    <p className="font-mono text-[0.65rem] text-[#00E5A0] uppercase">User</p>
                  </div>
                  <p className="text-white-f text-sm font-mono leading-relaxed">
                    &quot;Evalúa el perfil crediticio de Ecopetrol y recomienda un rango de spread para la emisión.&quot;
                  </p>
                </div>
              </div>

              {/* Key insight */}
              <div className="mt-4 bg-[#0D1229] rounded-xl p-4 border border-white/[0.04]">
                <p className="text-xs text-muted leading-relaxed">
                  <strong className="text-white-f">Insight:</strong> El system prompt se configura una vez
                  y se reutiliza. El contexto cambia según el deal. El user prompt cambia con cada pregunta.
                  Esta separación permite <strong className="text-cyan">consistencia</strong> en el tono y formato,
                  con <strong className="text-cyan">flexibilidad</strong> en cada consulta.
                </p>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════════ 8. CONFIG LAB ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">
            Config Lab &middot; System Prompts
          </p>
          <h2 className="text-2xl font-bold text-white-f mb-2">
            Configura tu LLM como un profesional
          </h2>
          <p className="text-muted mb-8 max-w-3xl">
            El system prompt es la instrucción maestra que define el comportamiento
            del modelo. Combínalo con temperatura, modelo, y límites para
            obtener resultados predecibles y útiles.
          </p>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Controls */}
            <div className="space-y-6">
              {/* Presets */}
              <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                <p className="font-mono text-xs text-muted mb-3">
                  Presets de configuración:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(PRESETS).map(([key, p]) => (
                    <button
                      key={key}
                      onClick={() => handlePreset(key)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                        preset === key
                          ? "text-white-f scale-[1.02]"
                          : "border-white/[0.06] text-muted hover:border-white/[0.12]"
                      }`}
                      style={
                        preset === key
                          ? {
                              background: `${p.color}20`,
                              borderColor: `${p.color}60`,
                              color: p.color,
                            }
                          : undefined
                      }
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* System Prompt */}
              <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                <p className="font-mono text-xs text-muted mb-3">
                  System Prompt:
                </p>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full bg-[#0D1229] border border-white/[0.08] rounded-xl p-4 text-white-f text-sm font-mono resize-none focus:outline-none focus:border-purple/50 transition-colors"
                  rows={5}
                />
              </div>

              {/* Model Selector */}
              <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                <p className="font-mono text-xs text-muted mb-3">Modelo:</p>
                <div className="grid grid-cols-3 gap-2">
                  {["GPT-5.4", "Claude 4.6", "Gemini 3.1"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setLabModel(m)}
                      className={`px-3 py-2 rounded-xl text-sm font-mono transition-all cursor-pointer border ${
                        labModel === m
                          ? "border-purple bg-purple/20 text-white-f"
                          : "border-white/[0.06] text-muted hover:border-white/[0.12]"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6 space-y-5">
                {/* Temperature */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-mono text-xs text-muted">Temperature</p>
                    <span
                      className="font-mono text-sm font-bold"
                      style={{ color: tempColor }}
                    >
                      {temperature.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={2}
                    step={0.1}
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs mt-1" style={{ color: tempColor }}>
                    {tempLabel}
                  </p>
                </div>

                {/* Max tokens */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-mono text-xs text-muted">Max Tokens</p>
                    <span className="font-mono text-sm text-white-f">
                      {maxTokens.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={256}
                    max={8192}
                    step={256}
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Top P */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-mono text-xs text-muted">Top P</p>
                    <span className="font-mono text-sm text-white-f">
                      {topP.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={topP}
                    onChange={(e) => setTopP(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Temperature explainer */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Frío",
                    range: "0.0–0.3",
                    color: "#3A7BD5",
                    desc: "Compliance, datos, tablas. Respuestas repetibles y factuales.",
                    icon: "❄",
                  },
                  {
                    label: "Tibio",
                    range: "0.4–0.7",
                    color: "#22C55E",
                    desc: "Análisis, research, resumen. Balance creatividad-precisión.",
                    icon: "◉",
                  },
                  {
                    label: "Caliente",
                    range: "0.8–1.5",
                    color: "#E85A1F",
                    desc: "Brainstorming, narrativa, estrategia. Más diversidad léxica.",
                    icon: "★",
                  },
                ].map((t) => (
                  <div
                    key={t.label}
                    className="bg-[#151A3A] border border-white/[0.06] rounded-xl p-4"
                  >
                    <span className="text-xl">{t.icon}</span>
                    <p
                      className="font-semibold text-sm mt-2"
                      style={{ color: t.color }}
                    >
                      {t.label}
                    </p>
                    <p className="font-mono text-[0.65rem] text-muted">
                      {t.range}
                    </p>
                    <p className="text-xs text-muted mt-2">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Output */}
            <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan animate-pulse-dot" />
                  <p className="font-mono text-xs text-muted">
                    Respuesta simulada &middot; {labModel}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[0.65rem] font-mono text-muted">
                  <span>T: {temperature.toFixed(1)}</span>
                  <span>|</span>
                  <span>Top P: {topP.toFixed(2)}</span>
                  <span>|</span>
                  <span>Max: {maxTokens}</span>
                </div>
              </div>

              <div className="flex-1 bg-[#0D1229] rounded-xl p-6 border border-white/[0.04] overflow-y-auto max-h-[600px] min-h-[300px]">
                {displayedText ? (
                  <div className="text-sm text-white-f leading-relaxed whitespace-pre-wrap font-mono">
                    {displayedText}
                    {isGenerating && <span className="typing-cursor" />}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted text-sm">
                    Presiona &quot;Generar&quot; para ver la respuesta simulada
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`mt-4 w-full py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                  isGenerating
                    ? "bg-purple/30 text-muted cursor-wait"
                    : "bg-gradient-to-r from-purple to-purple-dark text-white-f hover:shadow-lg hover:shadow-purple/20 hover:scale-[1.01]"
                }`}
              >
                {isGenerating ? "Generando..." : "Generar respuesta"}
              </button>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════════ 9. CHALLENGE ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16 pb-32">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">
            Reto &middot; 3 LLMs, 1 Prompt
          </p>
          <h2 className="text-2xl font-bold text-white-f mb-8">
            Compara modelos en acción
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Steps */}
            <div className="space-y-4">
              {[
                {
                  n: 1,
                  title: "Copia el prompt",
                  desc: "Usa el template de abajo. Es un memo de análisis de emisión de bonos para Ecopetrol.",
                },
                {
                  n: 2,
                  title: "Envia a 3 modelos",
                  desc: "Usa ChatGPT (GPT-5.4), Claude.ai (Claude 4.6) y Gemini. Misma temperatura: 0.3.",
                },
                {
                  n: 3,
                  title: "Compara resultados",
                  desc: "Evalúa: estructura, precisión de datos, tono profesional, y actionability del output.",
                },
                {
                  n: 4,
                  title: "Documenta hallazgos",
                  desc: "Captura de pantalla + 3 bullets sobre diferencias clave. Compartir en el grupo.",
                },
              ].map((step) => (
                <div
                  key={step.n}
                  className="flex gap-4 bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple to-purple-dark flex items-center justify-center shrink-0">
                    <span className="text-white-f font-bold text-sm">
                      {step.n}
                    </span>
                  </div>
                  <div>
                    <p className="text-white-f font-semibold">{step.title}</p>
                    <p className="text-sm text-muted mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {/* Prompt template */}
              <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-mono text-xs text-muted">
                    Prompt template
                  </p>
                  <button
                    onClick={copyPrompt}
                    className="px-3 py-1 rounded-lg text-xs font-mono border border-white/[0.08] text-muted hover:text-white-f hover:border-purple/40 transition-all cursor-pointer"
                  >
                    {copied ? "Copiado ✓" : "Copiar"}
                  </button>
                </div>
                <pre className="bg-[#0D1229] rounded-xl p-4 text-sm text-white-f font-mono whitespace-pre-wrap border border-white/[0.04] max-h-[300px] overflow-y-auto">
                  {CHALLENGE_PROMPT}
                </pre>
              </div>

              {/* Quiz */}
              <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                <p className="font-mono text-xs text-orange mb-3">
                  QUICK QUIZ
                </p>
                <p className="text-white-f font-semibold mb-4">
                  ¿Qué temperatura usarías para generar un informe de compliance
                  regulatorio?
                </p>
                <div className="space-y-2">
                  {[
                    { id: 0, label: "Temperature 0.9 — Máximo creatividad" },
                    {
                      id: 1,
                      label:
                        "Temperature 0.1 — Mínima variabilidad, máxima precisión",
                    },
                    { id: 2, label: "Temperature 1.5 — Experimental" },
                    {
                      id: 3,
                      label: "Temperature 0.5 — Balance general",
                    },
                  ].map((opt) => {
                    const isCorrect = opt.id === 1;
                    const isSelected = quizAnswer === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setQuizAnswer(opt.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all cursor-pointer border ${
                          isSelected
                            ? isCorrect
                              ? "border-cyan bg-cyan/10 text-cyan"
                              : "border-red bg-red/10 text-red"
                            : "border-white/[0.06] text-muted hover:border-white/[0.12]"
                        }`}
                      >
                        {opt.label}
                        {isSelected && isCorrect && (
                          <span className="ml-2">✓ Correcto</span>
                        )}
                        {isSelected && !isCorrect && (
                          <span className="ml-2">✕ Intenta de nuevo</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {quizAnswer === 1 && (
                  <div className="mt-4 bg-cyan/5 border border-cyan/20 rounded-xl p-4 animate-fadeUp">
                    <p className="text-sm text-white-f">
                      <strong>Correcto.</strong> Para compliance regulatorio
                      necesitas la mínima variabilidad posible. Temperature 0.1
                      asegura respuestas consistentes, factuales, y
                      reproducibles — exactamente lo que requiere un entorno
                      regulado como el de la SFC.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </RevealSection>
    </div>
  );
}
