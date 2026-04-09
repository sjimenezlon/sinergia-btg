"use client";

import { useState, useCallback } from "react";
import RevealSection from "@/components/RevealSection";

/* ────────────────────────── DATA ────────────────────────── */

const AGENDA = [
  { time: "0:00–0:15", label: "Caso: El stack IA de JPMorgan", color: "#00E5A0" },
  { time: "0:15–0:40", label: "Taxonomía de herramientas IA", color: "#5B52D5" },
  { time: "0:40–1:10", label: "LLMs comparados en acción", color: "#7B73E8" },
  { time: "1:10–1:40", label: "Taller: Tu stack personalizado", color: "#E85A1F" },
  { time: "1:40–2:00", label: "Reto: Pitch de herramientas", color: "#22C55E" },
];

const TOOL_CATEGORIES = [
  {
    id: "general",
    label: "Asistentes Generales",
    icon: "◉",
    color: "#00E5A0",
    desc: "LLMs conversacionales para análisis, redacción, investigación y razonamiento. La navaja suiza de la IA.",
    tools: [
      { name: "Claude", provider: "Anthropic", highlight: "1M tokens de contexto. Ideal para documentos largos, due diligence, compliance. Modo Projects para bases de conocimiento.", color: "#E85A1F" },
      { name: "ChatGPT", provider: "OpenAI", highlight: "GPT-5.4 con herramientas nativas. Custom GPTs para crear asistentes sin código. Integración con navegador y DALL·E.", color: "#22C55E" },
      { name: "Gemini", provider: "Google", highlight: "2M tokens de contexto. Integración nativa con Gmail, Docs, Sheets, Drive. Ideal si la empresa usa Google Workspace.", color: "#3A7BD5" },
    ],
  },
  {
    id: "coding",
    label: "Programación Asistida",
    icon: "⌨",
    color: "#5B52D5",
    desc: "Herramientas que ayudan a escribir, entender y depurar código. Desde autocompletado hasta agentes autónomos.",
    tools: [
      { name: "Cursor", provider: "Cursor Inc.", highlight: "Editor de código con IA integrada. Entiende todo tu proyecto. Ideal para construir prototipos y automatizaciones rápidas.", color: "#5B52D5" },
      { name: "GitHub Copilot", provider: "GitHub/Microsoft", highlight: "Autocompletado inteligente en VS Code. Sugerencias en línea mientras escribes. Ideal para desarrolladores profesionales.", color: "#22C55E" },
      { name: "Claude Code", provider: "Anthropic", highlight: "Agente de código en terminal. Lee tu repositorio completo, ejecuta comandos, crea commits. Para tareas complejas de desarrollo.", color: "#E85A1F" },
    ],
  },
  {
    id: "automation",
    label: "Automatización",
    icon: "⚡",
    color: "#E85A1F",
    desc: "Plataformas para conectar herramientas y eliminar trabajo manual. Desde flujos simples hasta orquestación de IA.",
    tools: [
      { name: "n8n", provider: "n8n GmbH", highlight: "Open-source, self-hosted. +400 integraciones. Nodos de IA nativos. Ideal para pipelines de datos financieros sin vendor lock-in.", color: "#E85A1F" },
      { name: "Power Automate", provider: "Microsoft", highlight: "Integración profunda con M365 y Dynamics. RPA incluido. Ideal si la empresa ya tiene licencias Microsoft.", color: "#3A7BD5" },
      { name: "Make (Integromat)", provider: "Make", highlight: "Visual, intuitivo, potente. Bueno para integraciones entre apps SaaS. Alternativa a n8n más amigable pero menos flexible.", color: "#9B59B6" },
    ],
  },
  {
    id: "research",
    label: "Investigación y Análisis",
    icon: "📊",
    color: "#3A7BD5",
    desc: "Herramientas especializadas para research documental, análisis de datos y generación de insights.",
    tools: [
      { name: "NotebookLM", provider: "Google", highlight: "Sube PDFs, reportes, earnings calls. El modelo responde SOLO con información de tus documentos. Reduce alucinaciones.", color: "#3A7BD5" },
      { name: "Perplexity", provider: "Perplexity AI", highlight: "Búsqueda conversacional con fuentes citadas. Ideal para research de mercado en tiempo real con verificación de fuentes.", color: "#22C55E" },
      { name: "DBeaver + IA", provider: "DBeaver", highlight: "Cliente SQL con asistente IA que genera queries en lenguaje natural. Ideal para analistas que consultan bases de datos.", color: "#D4AF4C" },
    ],
  },
  {
    id: "enterprise",
    label: "Ecosistemas Enterprise",
    icon: "🏢",
    color: "#9B59B6",
    desc: "Plataformas corporativas que integran IA en las herramientas que los empleados ya usan diariamente.",
    tools: [
      { name: "Microsoft Copilot", provider: "Microsoft", highlight: "$30/usuario/mes. IA en Word, Excel, PowerPoint, Teams, Outlook. Accede a datos internos del tenant M365.", color: "#3A7BD5" },
      { name: "Google Duet AI", provider: "Google", highlight: "IA en Gmail, Docs, Sheets, Meet. Ideal para empresas Google Workspace. Competidor directo de Copilot.", color: "#22C55E" },
      { name: "Copilot Studio", provider: "Microsoft", highlight: "Plataforma para crear agentes virtuales personalizados. Conecta con SharePoint, bases de datos, APIs internas.", color: "#5B52D5" },
    ],
  },
];

const LLM_COMPARISON = [
  {
    name: "Claude 4.6 Opus",
    provider: "Anthropic",
    icon: "◉",
    color: "#E85A1F",
    context: 1000000,
    costIn: 15,
    costOut: 75,
    strengths: ["Documentos largos (1M tokens)", "Instrucciones complejas", "Seguridad y compliance", "Análisis de contratos"],
    weaknesses: ["Costo más alto", "Sin búsqueda web nativa"],
    bestFor: "Due diligence, compliance, análisis de contratos, documentos extensos",
    btgArea: "Investment Banking, Compliance",
  },
  {
    name: "GPT-5.4",
    provider: "OpenAI",
    icon: "◈",
    color: "#22C55E",
    context: 1000000,
    costIn: 2.5,
    costOut: 10,
    strengths: ["Razonamiento avanzado", "Herramientas nativas", "Custom GPTs", "Ecosistema más amplio"],
    weaknesses: ["Menos consistente en instrucciones largas", "Datos de entrenamiento con sesgo US"],
    bestFor: "Modelación financiera, código, razonamiento cuantitativo, Custom GPTs",
    btgArea: "Asset Management, Trading",
  },
  {
    name: "Gemini 3.1 Ultra",
    provider: "Google",
    icon: "◆",
    color: "#3A7BD5",
    context: 2000000,
    costIn: 1.25,
    costOut: 5,
    strengths: ["2M tokens de contexto", "Integración Google Workspace", "Búsqueda web", "Mejor costo-beneficio"],
    weaknesses: ["Menos consistente en instrucciones complejas", "Menor adopción enterprise"],
    bestFor: "Research documental, integración Workspace, análisis de grandes volúmenes",
    btgArea: "Research, Wealth Management",
  },
  {
    name: "DeepSeek R1",
    provider: "DeepSeek",
    icon: "◎",
    color: "#D4AF4C",
    context: 128000,
    costIn: 0.55,
    costOut: 2.19,
    strengths: ["Razonamiento matemático superior", "Chain-of-thought transparente", "Costo ultra bajo", "Open weights"],
    weaknesses: ["Jurisdicción China", "Menor soporte en español", "Contexto limitado"],
    bestFor: "Análisis cuantitativo, matemáticas financieras, costo-beneficio extremo",
    btgArea: "Trading, Risk Analytics",
  },
  {
    name: "Llama 4",
    provider: "Meta",
    icon: "◇",
    color: "#9B59B6",
    context: 512000,
    costIn: 0,
    costOut: 0,
    strengths: ["100% privado (on-premise)", "Sin costos de API", "Personalizable (fine-tuning)", "Soberanía de datos total"],
    weaknesses: ["Requiere infraestructura GPU", "Menor rendimiento que modelos cerrados", "Necesita equipo técnico"],
    bestFor: "Datos ultra-sensibles, soberanía de datos, custom models internos",
    btgArea: "Operaciones internas, datos clasificados",
  },
];

const ROLE_PROFILES = [
  {
    id: "analyst",
    label: "Analista IB",
    area: "Investment Banking",
    color: "#00E5A0",
    icon: "📈",
    needs: "Análisis de documentos largos, due diligence, memos de inversión, modelación financiera, comparables",
    recommended: [
      { tool: "Claude Projects", why: "1M contexto para data rooms completos. System prompt de analista permanente." },
      { tool: "NotebookLM", why: "Research sobre earnings calls y reportes anuales con cero alucinaciones." },
      { tool: "Cursor", why: "Construir modelos financieros en Python rápidamente con asistencia IA." },
      { tool: "n8n", why: "Automatizar extracción de datos de múltiples fuentes para comparables." },
    ],
  },
  {
    id: "trader",
    label: "Trader / S&T",
    area: "Sales & Trading",
    color: "#E85A1F",
    icon: "⚡",
    needs: "Análisis de mercado en tiempo real, alertas, señales de trading, resumen de morning meetings, monitoreo de volatilidad",
    recommended: [
      { tool: "ChatGPT + Plugins", why: "Búsqueda web en tiempo real para noticias de mercado y análisis rápido." },
      { tool: "DeepSeek R1", why: "Cálculos cuantitativos y modelación matemática a bajo costo." },
      { tool: "n8n", why: "Pipelines de monitoreo: API de mercado → análisis LLM → alerta en Teams." },
      { tool: "Cursor", why: "Scripts de análisis de datos con pandas y visualización rápida." },
    ],
  },
  {
    id: "compliance",
    label: "Compliance Officer",
    area: "Compliance & Risk",
    color: "#D4AF4C",
    icon: "⚖️",
    needs: "Análisis de normas, monitoreo SARLAFT, reportes regulatorios, revisión de contratos, KYC/AML",
    recommended: [
      { tool: "Claude Projects", why: "Sube toda la normativa SFC. El modelo responde citando circulares específicas." },
      { tool: "Llama 4 (on-premise)", why: "Para análisis de datos sensibles sin enviar información a terceros." },
      { tool: "Power Automate", why: "Automatizar flujos de aprobación y reportes regulatorios periódicos." },
      { tool: "DBeaver + IA", why: "Consultas a bases de datos de transacciones con lenguaje natural." },
    ],
  },
  {
    id: "advisor",
    label: "Asesor WM",
    area: "Wealth Management",
    color: "#5B52D5",
    icon: "💼",
    needs: "Reportes personalizados para clientes, research de productos, propuestas de inversión, comunicación con clientes HNW",
    recommended: [
      { tool: "Gemini + Workspace", why: "Genera borradores de reportes directamente en Google Docs desde datos en Sheets." },
      { tool: "Claude", why: "Análisis profundo de portafolios con contexto largo y razonamiento estructurado." },
      { tool: "Microsoft Copilot", why: "Si usa M365: genera presentaciones en PowerPoint y correos en Outlook automáticamente." },
      { tool: "NotebookLM", why: "Research sobre productos de inversión y comparativas con fuentes verificables." },
    ],
  },
  {
    id: "ops",
    label: "Operaciones / Tech",
    area: "Operaciones & Tecnología",
    color: "#22C55E",
    icon: "🔧",
    needs: "Automatización de procesos, integración de sistemas, monitoreo, documentación técnica, desarrollo de herramientas internas",
    recommended: [
      { tool: "Claude Code", why: "Agente de código completo: lee repos, ejecuta tests, crea PRs. Para desarrollo avanzado." },
      { tool: "n8n", why: "Orquestación de procesos: conecta APIs, bases de datos, y LLMs en un solo flujo." },
      { tool: "Copilot Studio", why: "Agentes virtuales para helpdesk interno y autoservicio de empleados." },
      { tool: "GitHub Copilot", why: "Autocompletado en VS Code para el equipo de desarrollo." },
    ],
  },
];

const CRITERIA = [
  { id: "security", label: "Seguridad y Privacidad", icon: "🔒", desc: "¿Los datos salen de la organización? ¿Hay cifrado? ¿Cumple con Habeas Data?" },
  { id: "cost", label: "Costo y Licenciamiento", icon: "💰", desc: "¿Por usuario, por API call, o flat fee? ¿Hay free tier? ¿Escala bien?" },
  { id: "integration", label: "Integración", icon: "🔗", desc: "¿Se conecta con las herramientas existentes? ¿API disponible? ¿SSO?" },
  { id: "learning", label: "Curva de Aprendizaje", icon: "📚", desc: "¿Cuánto tiempo toma ser productivo? ¿Requiere conocimiento técnico?" },
  { id: "compliance", label: "Conformidad Regulatoria", icon: "📋", desc: "¿Cumple con SFC, SOC2, GDPR? ¿Tiene certificaciones enterprise?" },
  { id: "output", label: "Calidad del Output", icon: "✨", desc: "¿Qué tan buenos son los resultados para el caso de uso específico?" },
];

const DIAGNOSTIC_QUESTIONS = [
  {
    question: "¿Cuál es tu rol principal en BTG Pactual?",
    options: [
      { id: "ib", label: "Investment Banking / M&A" },
      { id: "wm", label: "Wealth Management / Advisory" },
      { id: "am", label: "Asset Management / Research" },
      { id: "st", label: "Sales & Trading" },
      { id: "cr", label: "Compliance / Risk / Legal" },
      { id: "tech", label: "Tecnología / Operaciones" },
    ],
  },
  {
    question: "¿Qué nivel de experiencia tienes con herramientas de IA?",
    options: [
      { id: "beginner", label: "Principiante — He usado ChatGPT casualmente" },
      { id: "intermediate", label: "Intermedio — Uso IA regularmente en mi trabajo" },
      { id: "advanced", label: "Avanzado — Construyo soluciones con IA" },
    ],
  },
  {
    question: "¿Qué ecosistema tecnológico usa tu equipo?",
    options: [
      { id: "microsoft", label: "Microsoft 365 (Outlook, Teams, SharePoint)" },
      { id: "google", label: "Google Workspace (Gmail, Docs, Drive)" },
      { id: "hybrid", label: "Híbrido / Otro" },
    ],
  },
  {
    question: "¿Cuál es tu prioridad #1 al adoptar herramientas de IA?",
    options: [
      { id: "productivity", label: "Aumentar productividad (hacer más en menos tiempo)" },
      { id: "quality", label: "Mejorar calidad (análisis más profundos)" },
      { id: "automation", label: "Automatizar procesos repetitivos" },
      { id: "innovation", label: "Innovar (crear soluciones nuevas)" },
    ],
  },
];

const DIAGNOSTIC_RESULTS: Record<string, { title: string; color: string; stack: string[]; tip: string }> = {
  ib: { title: "Stack para Investment Banking", color: "#00E5A0", stack: ["Claude Projects", "NotebookLM", "Cursor", "n8n"], tip: "Tu prioridad es analizar grandes volúmenes de documentos con precisión. Claude Projects con 1M de contexto es tu herramienta principal." },
  wm: { title: "Stack para Wealth Management", color: "#5B52D5", stack: ["Gemini + Workspace", "Claude", "Microsoft Copilot", "NotebookLM"], tip: "Necesitas generar reportes y comunicación personalizada eficientemente. La integración con tu ecosistema Office/Google es clave." },
  am: { title: "Stack para Asset Management", color: "#3A7BD5", stack: ["Perplexity", "Claude", "Cursor + Python", "NotebookLM"], tip: "Research de mercado y análisis de datos son tu core. Combina búsqueda web con análisis profundo." },
  st: { title: "Stack para Sales & Trading", color: "#E85A1F", stack: ["ChatGPT", "DeepSeek R1", "n8n", "Cursor"], tip: "Velocidad y cálculo cuantitativo son tu ventaja. Automatiza alertas y monitoreo con n8n + LLMs." },
  cr: { title: "Stack para Compliance & Risk", color: "#D4AF4C", stack: ["Claude Projects", "Llama 4 (on-premise)", "Power Automate", "DBeaver + IA"], tip: "Seguridad y privacidad son no-negociables. Usa modelos on-premise para datos sensibles y Claude para análisis normativo." },
  tech: { title: "Stack para Tecnología", color: "#22C55E", stack: ["Claude Code", "n8n", "Copilot Studio", "GitHub Copilot"], tip: "Eres el habilitador. Tu stack debe incluir herramientas de desarrollo y orquestación para potenciar a todos los equipos." },
};

/* ────────────────────────── COMPONENT ────────────────────────── */

export default function Sesion4() {
  /* Category */
  const [activeCategory, setActiveCategory] = useState<string>("general");

  /* LLM Comparison */
  const [activeLLM, setActiveLLM] = useState<number>(0);

  /* Role Profiles */
  const [activeRole, setActiveRole] = useState<string>("analyst");

  /* Diagnostic */
  const [diagStep, setDiagStep] = useState(0);
  const [diagAnswers, setDiagAnswers] = useState<string[]>([]);
  const [diagComplete, setDiagComplete] = useState(false);

  const handleDiagAnswer = useCallback((answerId: string) => {
    const newAnswers = [...diagAnswers, answerId];
    setDiagAnswers(newAnswers);
    if (diagStep < DIAGNOSTIC_QUESTIONS.length - 1) {
      setDiagStep(diagStep + 1);
    } else {
      setDiagComplete(true);
    }
  }, [diagStep, diagAnswers]);

  const resetDiag = useCallback(() => {
    setDiagStep(0);
    setDiagAnswers([]);
    setDiagComplete(false);
  }, []);

  /* Ecosystem comparison */
  const [activeEcosystem, setActiveEcosystem] = useState<string>("microsoft");

  const diagResult = diagComplete ? DIAGNOSTIC_RESULTS[diagAnswers[0]] || DIAGNOSTIC_RESULTS.ib : null;
  const activeRoleData = ROLE_PROFILES.find(r => r.id === activeRole)!;

  return (
    <div className="min-h-screen bg-[#080C1F]">
      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden">
        <div className="hero-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_40%,rgba(0,229,160,0.07),transparent),radial-gradient(ellipse_40%_50%_at_70%_60%,rgba(91,82,213,0.06),transparent)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-4 animate-fadeUp">
            Módulo 02 &middot; Herramientas y Aplicaciones &middot; Sesión 4 de 5
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white-f leading-tight mb-6 animate-fadeUp-1">
            Ecosistema de herramientas IA:{" "}
            <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
              mapa y selección estratégica
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 animate-fadeUp-2">
            20+ herramientas, una taxonomía para elegir la correcta.
            Criterios de selección según tu rol en BTG Pactual.
          </p>

          <div className="flex flex-wrap justify-center gap-6 animate-fadeUp-3">
            {[
              { val: "20+", label: "Herramientas", icon: "◈" },
              { val: "5", label: "Categorías", icon: "◆" },
              { val: "5", label: "Perfiles de rol", icon: "◉" },
              { val: "6", label: "Criterios", icon: "◷" },
            ].map((s) => (
              <div key={s.label} className="bg-[#151A3A] border border-white/[0.06] rounded-2xl px-6 py-4 min-w-[130px]">
                <span className="text-2xl">{s.icon}</span>
                <p className="text-2xl font-bold text-white-f mt-1">{s.val}</p>
                <p className="text-xs text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 2. AGENDA ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-12">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-6">
            Agenda &middot; Sesión 4
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
                <p className="font-mono text-xs font-semibold mb-1" style={{ color: a.color }}>
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
            Caso de Estudio &middot; JPMorgan Chase
          </p>
          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-cyan/10 to-purple/10 px-8 py-6 border-b border-white/[0.06]">
              <h2 className="text-2xl font-bold text-white-f">
                El stack de IA más grande de Wall Street
              </h2>
              <p className="text-muted mt-1">
                Cómo JPMorgan invirtió $17B en tecnología y desplegó IA en cada línea de negocio
              </p>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                {[
                  { val: "$17B", label: "Inversión Tech", sub: "Presupuesto anual en tecnología" },
                  { val: "2,000+", label: "Ingenieros IA", sub: "Equipo dedicado a IA/ML" },
                  { val: "300+", label: "Casos de uso", sub: "Aplicaciones IA en producción" },
                  { val: "LLM Suite", label: "Herramienta interna", sub: "Asistente IA propio para empleados" },
                ].map((m) => (
                  <div key={m.label} className="text-center p-5 bg-[#0D1229] rounded-xl border border-white/[0.04]">
                    <p className="text-2xl font-bold text-cyan">{m.val}</p>
                    <p className="text-white-f font-semibold mt-1 text-sm">{m.label}</p>
                    <p className="text-xs text-muted mt-1">{m.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { area: "Trading", tool: "Modelos ML internos + LLMs", use: "Análisis de sentimiento en noticias, predicción de volatilidad, ejecución algorítmica", color: "#E85A1F" },
                  { area: "Compliance", tool: "LLM Suite (interno)", use: "Revisión de contratos, monitoreo AML, reportes regulatorios automatizados", color: "#D4AF4C" },
                  { area: "Wealth Mgmt", tool: "Asistente IA + CRM", use: "Resúmenes personalizados para clientes, generación de propuestas, alertas de portafolio", color: "#5B52D5" },
                ].map((item) => (
                  <div key={item.area} className="rounded-xl p-5 border" style={{
                    background: `${item.color}08`,
                    borderColor: `${item.color}25`,
                  }}>
                    <p className="font-semibold text-sm mb-1" style={{ color: item.color }}>{item.area}</p>
                    <p className="font-mono text-xs text-muted mb-2">{item.tool}</p>
                    <p className="text-sm text-white-f">{item.use}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-cyan/5 border border-cyan/20 rounded-xl p-4">
                <p className="text-sm text-white-f">
                  <strong className="text-cyan">Lección para BTG:</strong> No necesitas $17B. Con las herramientas
                  correctas (Claude, n8n, Power Platform), puedes replicar los casos de uso más impactantes
                  de JPMorgan a una fracción del costo. La clave es <strong>selección estratégica</strong>, no presupuesto.
                </p>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════════ 4. TOOL TAXONOMY ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">
            Taxonomía &middot; Herramientas IA
          </p>
          <h2 className="text-2xl font-bold text-white-f mb-2">
            5 categorías, 15+ herramientas
          </h2>
          <p className="text-muted mb-8 max-w-3xl">
            Selecciona una categoría para explorar las herramientas disponibles y sus
            casos de uso en banca de inversión.
          </p>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {TOOL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                  activeCategory === cat.id
                    ? "scale-[1.02]"
                    : "border-white/[0.06] bg-[#151A3A] hover:border-white/[0.12]"
                }`}
                style={activeCategory === cat.id ? {
                  background: `${cat.color}15`,
                  borderColor: `${cat.color}50`,
                  color: cat.color,
                } : undefined}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Category detail */}
          {(() => {
            const cat = TOOL_CATEGORIES.find(c => c.id === activeCategory)!;
            return (
              <div className="animate-fadeUp">
                <p className="text-muted mb-6">{cat.desc}</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {cat.tools.map((tool) => (
                    <div key={tool.name} className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm" style={{
                          background: `${tool.color}20`,
                          color: tool.color,
                        }}>
                          {tool.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white-f font-semibold text-sm">{tool.name}</p>
                          <p className="text-xs text-muted">{tool.provider}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted leading-relaxed">{tool.highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </section>
      </RevealSection>

      {/* ═══════════════════ 5. LLM COMPARISON ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">
            Comparativa &middot; Modelos de Lenguaje
          </p>
          <h2 className="text-2xl font-bold text-white-f mb-2">
            5 LLMs cara a cara
          </h2>
          <p className="text-muted mb-8 max-w-3xl">
            Cada modelo tiene fortalezas diferentes. Selecciona uno para ver el análisis detallado
            y recomendación de uso en BTG.
          </p>

          {/* Model selector */}
          <div className="flex flex-wrap gap-3 mb-8">
            {LLM_COMPARISON.map((llm, i) => (
              <button
                key={llm.name}
                onClick={() => setActiveLLM(i)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer border flex items-center gap-2 ${
                  activeLLM === i
                    ? "scale-[1.02]"
                    : "border-white/[0.06] bg-[#151A3A] hover:border-white/[0.12]"
                }`}
                style={activeLLM === i ? {
                  background: `${llm.color}15`,
                  borderColor: `${llm.color}50`,
                  color: llm.color,
                } : undefined}
              >
                <span className="text-lg">{llm.icon}</span>
                {llm.name}
              </button>
            ))}
          </div>

          {/* LLM detail */}
          {(() => {
            const llm = LLM_COMPARISON[activeLLM];
            return (
              <div className="grid lg:grid-cols-2 gap-6 animate-fadeUp">
                <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">{llm.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white-f">{llm.name}</h3>
                      <p className="text-sm text-muted">{llm.provider}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-[#0D1229] rounded-xl p-3 text-center border border-white/[0.04]">
                      <p className="text-lg font-bold text-white-f">{(llm.context / 1000).toFixed(0)}K</p>
                      <p className="text-[0.65rem] text-muted">Contexto</p>
                    </div>
                    <div className="bg-[#0D1229] rounded-xl p-3 text-center border border-white/[0.04]">
                      <p className="text-lg font-bold text-white-f">${llm.costIn}</p>
                      <p className="text-[0.65rem] text-muted">$/M input</p>
                    </div>
                    <div className="bg-[#0D1229] rounded-xl p-3 text-center border border-white/[0.04]">
                      <p className="text-lg font-bold text-white-f">${llm.costOut}</p>
                      <p className="text-[0.65rem] text-muted">$/M output</p>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="mb-4">
                    <p className="font-mono text-xs text-cyan mb-2">FORTALEZAS</p>
                    <div className="space-y-1.5">
                      {llm.strengths.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className="text-cyan">✓</span>
                          <span className="text-white-f">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weaknesses */}
                  <div>
                    <p className="font-mono text-xs text-red mb-2">LIMITACIONES</p>
                    <div className="space-y-1.5">
                      {llm.weaknesses.map((w, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className="text-red">✕</span>
                          <span className="text-muted">{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                    <p className="font-mono text-xs text-orange mb-3">MEJOR PARA</p>
                    <p className="text-white-f text-sm leading-relaxed">{llm.bestFor}</p>
                  </div>

                  <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                    <p className="font-mono text-xs text-purple-light mb-3">ÁREAS BTG RECOMENDADAS</p>
                    <p className="text-white-f text-sm font-semibold" style={{ color: llm.color }}>{llm.btgArea}</p>
                  </div>

                  {/* Context comparison bar */}
                  <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                    <p className="font-mono text-xs text-muted mb-4">Ventana de contexto comparada</p>
                    <div className="space-y-3">
                      {LLM_COMPARISON.map((m, i) => {
                        const maxCtx = Math.max(...LLM_COMPARISON.map(x => x.context));
                        const pct = (m.context / maxCtx) * 100;
                        return (
                          <div key={m.name} className="flex items-center gap-3">
                            <span className="font-mono text-xs text-muted w-24 shrink-0 truncate">{m.name.split(" ")[0]}</span>
                            <div className="flex-1 h-3 rounded-full bg-white/[0.04]">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${pct}%`,
                                  background: i === activeLLM ? m.color : `${m.color}40`,
                                }}
                              />
                            </div>
                            <span className="font-mono text-xs text-muted w-12 text-right">
                              {m.context >= 1000000 ? `${(m.context / 1000000).toFixed(0)}M` : `${(m.context / 1000).toFixed(0)}K`}
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

      {/* ═══════════════════ 6. SELECTION CRITERIA ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">
            Framework &middot; Criterios de Selección
          </p>
          <h2 className="text-2xl font-bold text-white-f mb-8">
            6 criterios para elegir la herramienta correcta
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {CRITERIA.map((c) => (
              <div key={c.id} className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-all">
                <span className="text-2xl">{c.icon}</span>
                <p className="text-white-f font-semibold mt-3">{c.label}</p>
                <p className="text-sm text-muted mt-2">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════════ 7. ECOSYSTEM COMPARISON ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">
            Ecosistemas &middot; Microsoft vs Google
          </p>
          <h2 className="text-2xl font-bold text-white-f mb-8">
            ¿Qué ecosistema potenciar con IA?
          </h2>

          <div className="flex gap-3 mb-8">
            {[
              { id: "microsoft", label: "Microsoft 365 + Copilot", color: "#3A7BD5" },
              { id: "google", label: "Google Workspace + Gemini", color: "#22C55E" },
            ].map((eco) => (
              <button
                key={eco.id}
                onClick={() => setActiveEcosystem(eco.id)}
                className={`flex-1 px-6 py-4 rounded-xl font-semibold text-sm transition-all cursor-pointer border ${
                  activeEcosystem === eco.id
                    ? "scale-[1.01]"
                    : "border-white/[0.06] bg-[#151A3A]"
                }`}
                style={activeEcosystem === eco.id ? {
                  background: `${eco.color}15`,
                  borderColor: `${eco.color}50`,
                  color: eco.color,
                } : undefined}
              >
                {eco.label}
              </button>
            ))}
          </div>

          {activeEcosystem === "microsoft" ? (
            <div className="grid md:grid-cols-2 gap-6 animate-fadeUp">
              <div className="bg-[#151A3A] border border-[#3A7BD5]/25 rounded-2xl p-6">
                <p className="font-mono text-xs text-[#3A7BD5] mb-4">HERRAMIENTAS IA</p>
                <div className="space-y-3">
                  {[
                    { app: "Word + Copilot", use: "Genera borradores de memos, contratos, reportes desde instrucciones en lenguaje natural" },
                    { app: "Excel + Copilot", use: "Fórmulas complejas con lenguaje natural, análisis de datos, tablas dinámicas automáticas" },
                    { app: "PowerPoint + Copilot", use: "Presentaciones de pitch books y propuestas desde un brief de texto" },
                    { app: "Teams + Copilot", use: "Resumen de reuniones, action items automáticos, transcripción en tiempo real" },
                    { app: "Outlook + Copilot", use: "Borradores de correo, resumen de hilos largos, priorización inteligente" },
                  ].map((item) => (
                    <div key={item.app} className="bg-[#0D1229] rounded-xl p-3 border border-white/[0.04]">
                      <p className="text-white-f font-semibold text-sm">{item.app}</p>
                      <p className="text-xs text-muted mt-1">{item.use}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#151A3A] border border-[#3A7BD5]/25 rounded-2xl p-6">
                <p className="font-mono text-xs text-[#3A7BD5] mb-4">EVALUACIÓN PARA BTG</p>
                <div className="space-y-4">
                  <div><p className="text-white-f text-sm font-semibold">Costo</p><p className="text-xs text-muted">$30 USD/usuario/mes. Para 100 usuarios: $36,000 USD/año.</p></div>
                  <div><p className="text-white-f text-sm font-semibold">Ventajas</p><p className="text-xs text-muted">Integración nativa con herramientas existentes. SSO/Azure AD. Compliance enterprise (SOC2, ISO27001). Acceso a datos internos del tenant.</p></div>
                  <div><p className="text-white-f text-sm font-semibold">Limitaciones</p><p className="text-xs text-muted">Funcionalidad IA limitada vs APIs directas. No siempre da los mejores resultados. Alto costo por usuario para despliegue masivo.</p></div>
                  <div><p className="text-white-f text-sm font-semibold">Veredicto</p><p className="text-xs text-cyan">Ideal si BTG ya usa M365. El valor está en la adopción masiva, no en la calidad individual de las respuestas.</p></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 animate-fadeUp">
              <div className="bg-[#151A3A] border border-[#22C55E]/25 rounded-2xl p-6">
                <p className="font-mono text-xs text-[#22C55E] mb-4">HERRAMIENTAS IA</p>
                <div className="space-y-3">
                  {[
                    { app: "Docs + Gemini", use: "Genera, resume y reformatea documentos. Escribe desde instrucciones o datos en Sheets." },
                    { app: "Sheets + Gemini", use: "Fórmulas inteligentes, categorización de datos, análisis con lenguaje natural." },
                    { app: "Gmail + Gemini", use: "Borradores contextuales, resúmenes de hilos, respuestas sugeridas." },
                    { app: "Meet + Gemini", use: "Transcripción, resúmenes de reunión, notas automáticas con action items." },
                    { app: "NotebookLM", use: "Research con documentos propios. Cero alucinaciones — solo responde con tus fuentes." },
                  ].map((item) => (
                    <div key={item.app} className="bg-[#0D1229] rounded-xl p-3 border border-white/[0.04]">
                      <p className="text-white-f font-semibold text-sm">{item.app}</p>
                      <p className="text-xs text-muted mt-1">{item.use}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#151A3A] border border-[#22C55E]/25 rounded-2xl p-6">
                <p className="font-mono text-xs text-[#22C55E] mb-4">EVALUACIÓN PARA BTG</p>
                <div className="space-y-4">
                  <div><p className="text-white-f text-sm font-semibold">Costo</p><p className="text-xs text-muted">$20-30 USD/usuario/mes (según plan). NotebookLM gratuito.</p></div>
                  <div><p className="text-white-f text-sm font-semibold">Ventajas</p><p className="text-xs text-muted">2M tokens de contexto (el más largo). NotebookLM es único en el mercado. Mejor costo-beneficio. Búsqueda web integrada.</p></div>
                  <div><p className="text-white-f text-sm font-semibold">Limitaciones</p><p className="text-xs text-muted">Menor adopción enterprise en LatAm vs Microsoft. Menos consistente en instrucciones complejas. Integración limitada con sistemas on-premise.</p></div>
                  <div><p className="text-white-f text-sm font-semibold">Veredicto</p><p className="text-xs text-cyan">Ideal para research y análisis documental. NotebookLM es una herramienta indispensable independientemente del ecosistema principal.</p></div>
                </div>
              </div>
            </div>
          )}
        </section>
      </RevealSection>

      {/* ═══════════════════ 8. ROLE PROFILES ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">
            Herramientas por Rol &middot; BTG Pactual
          </p>
          <h2 className="text-2xl font-bold text-white-f mb-2">
            El stack óptimo según tu función
          </h2>
          <p className="text-muted mb-8 max-w-3xl">
            Cada rol en BTG tiene necesidades diferentes. Selecciona tu perfil para ver
            las herramientas recomendadas y por qué.
          </p>

          {/* Role tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {ROLE_PROFILES.map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                  activeRole === role.id
                    ? "scale-[1.02]"
                    : "border-white/[0.06] bg-[#151A3A] hover:border-white/[0.12]"
                }`}
                style={activeRole === role.id ? {
                  background: `${role.color}15`,
                  borderColor: `${role.color}50`,
                  color: role.color,
                } : undefined}
              >
                <span className="mr-2">{role.icon}</span>
                {role.label}
              </button>
            ))}
          </div>

          {/* Role detail */}
          <div className="animate-fadeUp">
            <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{activeRoleData.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-white-f">{activeRoleData.label}</h3>
                  <p className="text-xs text-muted">{activeRoleData.area}</p>
                </div>
              </div>
              <p className="text-sm text-muted"><strong className="text-white-f">Necesidades:</strong> {activeRoleData.needs}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {activeRoleData.recommended.map((rec, i) => (
                <div key={i} className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{
                      background: `${activeRoleData.color}20`,
                      color: activeRoleData.color,
                    }}>
                      {i + 1}
                    </div>
                    <p className="text-white-f font-semibold">{rec.tool}</p>
                  </div>
                  <p className="text-sm text-muted">{rec.why}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════════ 9. DIAGNOSTIC + CHALLENGE ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16 pb-32">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">
            Taller &middot; Autodiagnóstico
          </p>
          <h2 className="text-2xl font-bold text-white-f mb-8">
            Diseña tu stack personalizado
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Diagnostic quiz */}
            <div>
              {!diagComplete ? (
                <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <p className="font-mono text-xs text-muted">
                      Pregunta {diagStep + 1} de {DIAGNOSTIC_QUESTIONS.length}
                    </p>
                    <div className="flex gap-1">
                      {DIAGNOSTIC_QUESTIONS.map((_, i) => (
                        <div key={i} className={`w-8 h-1.5 rounded-full ${
                          i < diagStep ? "bg-cyan" : i === diagStep ? "bg-purple" : "bg-white/[0.06]"
                        }`} />
                      ))}
                    </div>
                  </div>

                  <p className="text-white-f font-semibold text-lg mb-6">
                    {DIAGNOSTIC_QUESTIONS[diagStep].question}
                  </p>

                  <div className="space-y-3">
                    {DIAGNOSTIC_QUESTIONS[diagStep].options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleDiagAnswer(opt.id)}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all cursor-pointer border border-white/[0.06] text-muted hover:border-purple/40 hover:bg-purple/5 hover:text-white-f"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : diagResult ? (
                <div className="bg-[#151A3A] border rounded-2xl p-6 animate-fadeUp" style={{
                  borderColor: `${diagResult.color}40`,
                }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: diagResult.color }}>
                        Tu Stack Recomendado
                      </p>
                      <h3 className="text-xl font-bold text-white-f">{diagResult.title}</h3>
                    </div>
                    <button
                      onClick={resetDiag}
                      className="px-3 py-1 rounded-lg text-xs font-mono border border-white/[0.08] text-muted hover:text-white-f transition-all cursor-pointer"
                    >
                      Reiniciar
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {diagResult.stack.map((tool, i) => (
                      <div key={i} className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04] text-center">
                        <div className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center font-bold text-sm mb-2" style={{
                          background: `${diagResult.color}20`,
                          color: diagResult.color,
                        }}>
                          {i + 1}
                        </div>
                        <p className="text-white-f font-semibold text-sm">{tool}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4">
                    <p className="text-sm text-white-f">{diagResult.tip}</p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Challenge steps */}
            <div className="space-y-4">
              <p className="font-mono text-xs text-orange mb-2">RETO — PITCH DE HERRAMIENTAS</p>
              {[
                {
                  n: 1,
                  title: "Completa el autodiagnóstico",
                  desc: "Responde las 4 preguntas para recibir tu stack recomendado personalizado.",
                },
                {
                  n: 2,
                  title: "Investiga tu herramienta #1",
                  desc: "Abre la herramienta principal de tu stack. Crea una cuenta free si no la tienes. Explórala 10 minutos.",
                },
                {
                  n: 3,
                  title: "Prueba un caso real",
                  desc: "Usa la herramienta con un caso de tu trabajo diario. Documenta el input, el proceso y el output.",
                },
                {
                  n: 4,
                  title: "Pitch de 2 minutos",
                  desc: "Presenta a tu equipo: qué herramienta elegiste, por qué, y cómo la usarías en un caso concreto de BTG.",
                },
              ].map((step) => (
                <div key={step.n} className="flex gap-4 bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple to-purple-dark flex items-center justify-center shrink-0">
                    <span className="text-white-f font-bold text-sm">{step.n}</span>
                  </div>
                  <div>
                    <p className="text-white-f font-semibold">{step.title}</p>
                    <p className="text-sm text-muted mt-1">{step.desc}</p>
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
