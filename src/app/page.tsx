import Link from "next/link";

const bloques = [
  {
    num: "M01",
    name: "Fundamentos",
    fase: "Entender / Explorar",
    hours: "4h · 2 sesiones",
    color: "#00E5A0",
    desc: "¿Qué es la IA? Conceptos, capacidades, taxonomía y transformers. IA en el sector financiero: sesgos en scoring crediticio, regulación SFC, ciberseguridad en banca de inversión.",
    topics: ["Taxonomía IA", "Transformers", "LLMs", "Sesgo crediticio", "EU AI Act", "Ciberseguridad"],
  },
  {
    num: "M02",
    name: "Herramientas y aplicaciones",
    fase: "Hacer",
    hours: "8h · 4 sesiones",
    color: "#3A7BD5",
    desc: "Prompt engineering para análisis financiero, asistentes IA especializados en due diligence, NotebookLM y Copilot M365 para research y productividad, programación asistida con Cursor y Claude Code.",
    topics: ["Prompt Engineering", "Claude Projects", "Custom GPTs", "NotebookLM", "Copilot M365", "Cursor"],
  },
  {
    num: "M03",
    name: "Automatizaciones",
    fase: "Transformar",
    hours: "12h · 6 sesiones",
    color: "#D4AF4C",
    desc: "n8n para pipelines de monitoreo financiero, Power Platform para apps internas, Copilot Studio para agentes de compliance, IA agéntica en trading y KYC/AML, ecosistema FinTech 2026.",
    topics: ["n8n", "Power Apps", "Power Automate", "AI Builder", "Copilot Studio", "IA agéntica", "FinTech"],
  },
  {
    num: "M04",
    name: "Soluciones para el negocio",
    fase: "Aplicar",
    hours: "6h · 3 sesiones",
    color: "#9B59B6",
    desc: "IA aplicada a las líneas de negocio de BTG Pactual (IB, WM, AM, S&T, compliance, tech), protección de datos y gobernanza, gestión del riesgo tecnológico bajo DORA, EU AI Act y normativa SFC.",
    topics: ["JTBD BTG", "DORA", "EU AI Act", "DAMA-DMBOK", "Compliance IA", "Gestión de riesgo"],
  },
  {
    num: "M05",
    name: "Aprender haciendo",
    fase: "Apropiar",
    hours: "8h · 4 sesiones",
    color: "#E85A1F",
    desc: "Proyecto integrador por equipos: desarrollo del MVP con mentoría técnica, refinamiento, testing y pitch, Demo Day con liderazgo BTG Pactual (máx. 5 proyectos por grupo).",
    topics: ["MVP", "Mentoría técnica", "Testing", "Pitch", "Demo Day", "Certificación"],
  },
];

const sesiones = [
  { n: 1, title: "¿Qué es la IA? Del mito a la máquina", sub: "Historia, taxonomía y del dato al lenguaje natural", mod: "M01", active: true },
  { n: 2, title: "IA en el sector financiero", sub: "Responsabilidad y ciberseguridad en banca de inversión", mod: "M01", active: true },
  { n: 3, title: "Prompt engineering: comunicarse con la IA", sub: "Técnicas avanzadas y criterios para elegir la herramienta correcta", mod: "M02", active: true },
  { n: 4, title: "Asistentes IA para finanzas", sub: "Flujos profesionales de análisis y creación", mod: "M02", active: true },
  { n: 5, title: "Gemini, NotebookLM y Microsoft Copilot", sub: "Investigación documental, productividad y ecosistema M365", mod: "M02", active: true },
  { n: 6, title: "Cursor, Claude Code y GitHub Copilot", sub: "Programación asistida por IA", mod: "M02", active: false },
  { n: 7, title: "n8n: automatización sin código", sub: "Conectar herramientas y eliminar trabajo manual", mod: "M03", active: false },
  { n: 8, title: "n8n + IA: automatización inteligente", sub: "LLMs integrados a flujos de automatización", mod: "M03", active: false },
  { n: 9, title: "Power Platform: Power Apps + Power Automate", sub: "Aplicaciones low-code y automatización de procesos", mod: "M03", active: false },
  { n: 10, title: "Power Platform: Copilot Studio, AI Builder y Power BI", sub: "Agentes virtuales, modelos de IA y analítica con lenguaje natural", mod: "M03", active: false },
  { n: 11, title: "IA agéntica en finanzas", sub: "Agentes autónomos para trading, compliance y experiencia de cliente", mod: "M03", active: false },
  { n: 12, title: "Ecosistema FinTech 2026: mapa de fuerzas", sub: "Del open banking a los agentes financieros autónomos", mod: "M03", active: false },
  { n: 13, title: "IA aplicada a líneas de negocio de BTG Pactual", sub: "Definición del proyecto con JTBD (IB, WM, AM, S&T, operaciones, compliance, tech)", mod: "M04", active: false },
  { n: 14, title: "IA y protección de datos: riesgos y mitigación", sub: "Usar IA sin comprometer información sensible", mod: "M04", active: false },
  { n: 15, title: "Gestión del riesgo tecnológico y compliance IA", sub: "DORA, EU AI Act, Habeas Data, SFC y confianza institucional", mod: "M04", active: false },
  { n: 16, title: "Desarrollo del prototipo — parte 1", sub: "Construcción del MVP con mentoría técnica", mod: "M05", active: false },
  { n: 17, title: "Desarrollo del prototipo — parte 2", sub: "Integración de datos y resolución de bloqueos", mod: "M05", active: false },
  { n: 18, title: "Refinamiento, testing y pitch", sub: "Corrección de errores, documentación y estructura de pitch ejecutivo", mod: "M05", active: false },
  { n: 19, title: "Demo Day: presentación y cierre", sub: "Presentación por equipos, panel evaluador y certificación", mod: "M05", active: false },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        <div className="hero-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_50%,rgba(0,229,160,0.06),transparent),radial-gradient(ellipse_40%_60%_at_80%_30%,rgba(58,123,213,0.04),transparent)] pointer-events-none" />

        <div className="relative z-10 animate-fadeUp">
          <div className="inline-flex items-center gap-2 bg-[rgba(91,82,213,0.15)] border border-[rgba(91,82,213,0.3)] rounded-full px-5 py-2 text-[0.78rem] font-medium text-purple-light mb-8">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse-dot" />
            NODO x EAFIT — Laboratorio BTG Pactual Colombia
          </div>
        </div>

        <h1 className="relative z-10 text-[clamp(2.4rem,5.5vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-white-f mb-6 animate-fadeUp-1">
          IA Generativa para
          <br />
          <span className="bg-gradient-to-r from-purple-light to-orange-light bg-clip-text text-transparent">
            Servicios Financieros
          </span>
        </h1>

        <p className="relative z-10 text-lg text-muted max-w-[640px] font-light mb-10 animate-fadeUp-2">
          Laboratorio interactivo de IA generativa y automatizaciones
          contextualizado a banca de inversión, wealth management y servicios
          financieros para BTG Pactual Colombia.
        </p>

        <div className="relative z-10 flex gap-4 animate-fadeUp-3">
          <Link
            href="/sesion/1"
            className="px-8 py-3 rounded-xl bg-purple text-white font-semibold text-sm hover:bg-purple-light transition-all shadow-lg shadow-[rgba(91,82,213,0.3)]"
          >
            Comenzar Sesión 1
          </Link>
          <Link
            href="/sesion/2"
            className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white-f font-semibold text-sm hover:bg-white/10 transition-all"
          >
            Sesión 2
          </Link>
        </div>
      </section>

      {/* BLOQUES */}
      <section className="px-6 py-16 max-w-7xl mx-auto" id="bloques">
        <div className="mb-10">
          <div className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-cyan mb-2 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-cyan" />
            Arquitectura del programa
          </div>
          <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-bold text-white-f leading-tight mb-3">
            5 bloques, una ruta integral
          </h2>
          <p className="text-muted max-w-[680px] text-[0.92rem]">
            El programa sigue una progresión natural:{" "}
            <em className="text-cyan not-italic font-medium">
              Entender &rarr; Hacer &rarr; Transformar &rarr; Aplicar &rarr; Apropiar
            </em>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {bloques.map((b) => (
            <div
              key={b.num}
              className="relative bg-card border border-white/[0.06] rounded-xl p-6 hover:border-[rgba(0,229,160,0.2)] hover:-translate-y-1 transition-all overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: b.color }}
              />
              <div className="font-mono text-[0.58rem] tracking-widest mb-1" style={{ color: b.color }}>
                {b.num}
              </div>
              <h3 className="text-white-f font-bold text-base mb-1">{b.name}</h3>
              <div className="font-mono text-[0.65rem] text-muted mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: b.color }} />
                {b.hours}
              </div>
              <p className="text-[0.82rem] text-txt mb-4">{b.desc}</p>
              <div className="flex flex-wrap gap-1">
                {b.topics.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[0.58rem] px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded-sm text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SESIONES */}
      <section className="px-6 py-16 max-w-7xl mx-auto bg-deep">
        <div className="mb-10">
          <div className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-cyan mb-2 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-cyan" />
            Sesión a sesión
          </div>
          <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-bold text-white-f leading-tight mb-3">
            Mapa completo del laboratorio
          </h2>
        </div>

        <div className="space-y-2">
          {sesiones.map((s) => (
            <div
              key={s.n}
              className={`grid grid-cols-[60px_1fr] md:grid-cols-[60px_1fr_auto] gap-0 border rounded-lg overflow-hidden transition-all ${
                s.active
                  ? "border-[rgba(0,229,160,0.2)] bg-card hover:border-[rgba(0,229,160,0.3)]"
                  : "border-white/[0.06] bg-[rgba(21,26,58,0.5)]"
              }`}
            >
              <div className="grid place-items-center bg-white/[0.02] border-r border-white/[0.06] font-mono text-[0.7rem] font-semibold text-muted py-4">
                S{String(s.n).padStart(2, "0")}
              </div>
              <div className="p-4">
                <div className="text-[0.88rem] font-semibold text-white-f mb-0.5">{s.title}</div>
                <div className="text-[0.72rem] text-muted italic">{s.sub}</div>
              </div>
              <div className="hidden md:flex items-center px-4 gap-2">
                <span className="text-[0.6rem] font-mono text-muted/70">{s.mod}</span>
                {s.active ? (
                  <Link
                    href={`/sesion/${s.n}`}
                    className="text-[0.72rem] font-semibold px-4 py-1.5 rounded-full bg-[rgba(0,229,160,0.12)] text-cyan border border-[rgba(0,229,160,0.2)] hover:bg-[rgba(0,229,160,0.2)] transition-all"
                  >
                    Abrir laboratorio
                  </Link>
                ) : (
                  <span className="text-[0.65rem] font-mono text-muted/50 uppercase tracking-wider">
                    Próximamente
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* METODOLOGÍA */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="mb-10">
          <div className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-cyan mb-2 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-cyan" />
            Metodología
          </div>
          <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-bold text-white-f leading-tight mb-3">
            Estructura de cada sesión
          </h2>
          <p className="text-muted max-w-[680px] text-[0.92rem]">
            Cada sesión tiene una duración de 2 horas. El material previo se envía 48 horas antes en formato PDF o video.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "🎯", name: "Contexto", time: "15 min", desc: "Caso real del sector financiero que introduce el tema", color: "#06B6D4" },
            { icon: "💡", name: "Concepto", time: "25 min", desc: "Explicación con ejemplos de banca de inversión", color: "#5B52D5" },
            { icon: "🛠️", name: "Práctica guiada", time: "40 min", desc: "Taller paso a paso con la herramienta del día", color: "#E85A1F" },
            { icon: "⚡", name: "Reto + Cierre", time: "30 min", desc: "Mini reto por equipos y socialización de resultados", color: "#22C55E" },
          ].map((m) => (
            <div key={m.name} className="bg-card border border-white/[0.06] rounded-xl p-5 text-center">
              <div className="text-2xl mb-3">{m.icon}</div>
              <div className="text-sm font-bold text-white-f mb-1">{m.name}</div>
              <div className="font-mono text-[0.65rem] mb-2" style={{ color: m.color }}>{m.time}</div>
              <div className="text-[0.78rem] text-muted">{m.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[0.75rem] text-muted">
          <strong className="text-purple-light">SINERGIA</strong> — IA Generativa + Automatizaciones para Servicios Financieros
        </div>
        <div className="font-mono text-[0.6rem] text-white/20 tracking-widest">
          NODO x Universidad EAFIT &middot; BTG Pactual Colombia &middot; 2026
        </div>
      </footer>
    </>
  );
}
