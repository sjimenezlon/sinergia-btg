"use client";

import { useState, useCallback } from "react";
import RevealSection from "@/components/RevealSection";

/* ────────────────────────── DATA ────────────────────────── */

const AGENDA = [
  { time: "0:00–0:15", label: "Caso: Morgan Stanley & IA", color: "#00E5A0" },
  { time: "0:15–0:40", label: "Anatomía de un prompt", color: "#5B52D5" },
  { time: "0:40–1:10", label: "Técnicas avanzadas", color: "#7B73E8" },
  { time: "1:10–1:40", label: "Taller: Asistente crediticio", color: "#E85A1F" },
  { time: "1:40–2:00", label: "Reto: Prompt Battle", color: "#22C55E" },
];

const PROMPT_LAYERS = [
  {
    id: "rol",
    label: "Rol",
    color: "#00E5A0",
    icon: "R",
    desc: "Define quién es el modelo. Establece expertise, tono y perspectiva.",
    bad: "Ayúdame con un análisis.",
    good: "Eres un analista senior de renta fija en BTG Pactual Colombia, especializado en emisiones de deuda corporativa en mercados emergentes.",
    tip: "Mientras más específico el rol, más contextualizada la respuesta. Incluye la empresa, el área y la especialización.",
  },
  {
    id: "contexto",
    label: "Contexto",
    color: "#3A7BD5",
    icon: "C",
    desc: "Proporciona la información de fondo necesaria para que el modelo entienda la situación.",
    bad: "Analiza esta empresa.",
    good: "Ecopetrol planea emitir bonos verdes por USD 1.5B a 10 años. El spread soberano de Colombia está en ~320bps sobre UST. Rating S&P actual: BB+ con perspectiva estable. EBITDA 2025: USD 12.3B.",
    tip: "Incluye datos cuantitativos, restricciones, y el estado actual. El modelo no sabe lo que tú no le dices.",
  },
  {
    id: "tarea",
    label: "Tarea",
    color: "#5B52D5",
    icon: "T",
    desc: "La instrucción específica de lo que quieres que haga. Clara, accionable, delimitada.",
    bad: "Dame tu opinión.",
    good: "1. Evalúa las condiciones del mercado de deuda LatAm.\n2. Identifica los 3 principales riesgos para esta emisión.\n3. Recomienda un rango de spread con justificación.\n4. Sugiere estructura óptima (tramo, moneda, covenants).",
    tip: "Numera las subtareas. Usa verbos de acción: evalúa, identifica, recomienda, compara, clasifica.",
  },
  {
    id: "formato",
    label: "Formato",
    color: "#E85A1F",
    icon: "F",
    desc: "Especifica cómo quieres recibir la respuesta: estructura, extensión, estilo.",
    bad: "",
    good: "Formato: Memo ejecutivo de máximo 500 palabras. Incluye tabla de comparables con columnas: Emisor, Rating, Spread, Monto, Plazo. Cierra con recomendación en bullet points.",
    tip: "Pide tablas, bullet points, headers, o formatos específicos. Si no especificas formato, el modelo decide por ti.",
  },
];

const TECHNIQUES = [
  {
    id: "zeroshot",
    label: "Zero-Shot",
    color: "#3A7BD5",
    icon: "0",
    desc: "Instrucción directa sin ejemplos. Funciona bien para tareas simples o cuando el modelo ya tiene suficiente conocimiento.",
    prompt: `Clasifica el siguiente correo electrónico como: [Urgente], [Informativo], o [Acción Requerida].

Correo: "Estimado equipo, les informo que la fecha límite para enviar los documentos de due diligence del deal Cementos Argos se adelantó al viernes 11 de abril. Necesitamos los estados financieros auditados y el informe ambiental antes de las 5:00 PM."`,
    response: `**Clasificación: [Acción Requerida]**

**Justificación:**
- Contiene una fecha límite específica (viernes 11 de abril)
- Solicita entregables concretos (estados financieros + informe ambiental)
- Indica cambio de deadline (se adelantó)
- Requiere acción inmediata del equipo`,
    when: "Tareas de clasificación, resumen, traducción, o preguntas factuales.",
    strength: 70,
  },
  {
    id: "fewshot",
    label: "Few-Shot",
    color: "#5B52D5",
    icon: "F",
    desc: "Proporcionas 2-5 ejemplos del input/output esperado. El modelo aprende el patrón de tus ejemplos.",
    prompt: `Extrae los datos clave de alertas SARLAFT y clasifica el nivel de riesgo.

Ejemplo 1:
Alerta: "Cliente Juan Pérez NIT 800123456 realizó 15 transacciones en efectivo por COP $48M cada una en 3 días."
→ Cliente: Juan Pérez | NIT: 800123456 | Monto total: COP $720M | Patrón: Fraccionamiento | Riesgo: ALTO

Ejemplo 2:
Alerta: "Empresa ABC Ltda recibió transferencia internacional por USD $2.1M desde cuenta en Panamá sin soporte documental."
→ Cliente: ABC Ltda | Origen: Panamá | Monto: USD $2.1M | Patrón: Transferencia sin soporte | Riesgo: CRÍTICO

Ahora procesa:
Alerta: "Cliente María García CC 1020334455 abrió 4 CDTs por COP $230M cada uno en sucursales diferentes durante la misma semana."`,
    response: `→ **Cliente:** María García | **CC:** 1020334455 | **Monto total:** COP $920M | **Patrón:** Fraccionamiento en múltiples sucursales (structuring) | **Riesgo:** ALTO

**Análisis adicional:**
- Apertura de CDTs en sucursales diferentes en la misma semana sugiere intento de evadir controles de operación única
- El monto total supera el umbral de reporte de operaciones sospechosas
- Recomendación: Reporte de Operación Sospechosa (ROS) a la UIAF`,
    when: "Extracción de datos, clasificación con formato específico, análisis con criterios definidos.",
    strength: 85,
  },
  {
    id: "cot",
    label: "Chain-of-Thought",
    color: "#E85A1F",
    icon: "⛓",
    desc: "Pides al modelo que razone paso a paso antes de dar la respuesta final. Mejora dramáticamente la precisión en tareas complejas.",
    prompt: `Un fondo de inversión de BTG Pactual tiene la siguiente composición:
- 40% Bonos TES (rendimiento 11.2%)
- 25% Acciones colombianas (rendimiento esperado 15.8%)
- 20% Bonos corporativos (rendimiento 9.5%)
- 15% Cash (rendimiento 4.2%)

El cliente quiere aumentar el rendimiento esperado del portafolio a 13% manteniendo máximo 35% en renta variable.

Piensa paso a paso:
1. Calcula el rendimiento actual del portafolio.
2. Determina cuánto rendimiento adicional se necesita.
3. Propón un rebalanceo que cumpla ambas restricciones.
4. Verifica que el rebalanceo cumple con la restricción de renta variable.`,
    response: `**Paso 1: Rendimiento actual del portafolio**
- TES: 40% × 11.2% = 4.48%
- Acciones: 25% × 15.8% = 3.95%
- Corp: 20% × 9.5% = 1.90%
- Cash: 15% × 4.2% = 0.63%
- **Total actual: 10.96%**

**Paso 2: Rendimiento adicional necesario**
- Objetivo: 13.0% – 10.96% = **+2.04 puntos porcentuales**

**Paso 3: Rebalanceo propuesto**
- Acciones: 25% → 35% (+10pp, máximo permitido)
- Cash: 15% → 0% (-15pp, libera capital)
- Corp: 20% → 25% (+5pp, captura spread)
- TES: 40% → 40% (sin cambio)

**Nuevo rendimiento:** 40%×11.2% + 35%×15.8% + 25%×9.5% + 0%×4.2% = **12.36%**

**Paso 4: Verificación**
- Renta variable: 35% ✓ (cumple restricción ≤35%)
- Rendimiento: 12.36% ✗ (aún falta 0.64pp)

**Ajuste:** Considerar bonos corporativos high-yield (11.5%) para cerrar la brecha, o renegociar el target a 12.5% con justificación cuantitativa.`,
    when: "Cálculos financieros, análisis multi-variable, decisiones con restricciones, problemas de optimización.",
    strength: 95,
  },
  {
    id: "selfconsistency",
    label: "Self-Consistency",
    color: "#22C55E",
    icon: "✓",
    desc: "Generas múltiples respuestas al mismo prompt y seleccionas la más consistente. Reduce alucinaciones y aumenta confianza.",
    prompt: `Genera 3 análisis independientes del riesgo de default de una empresa con estos datos:
- Revenue: COP 45B (crecimiento -8% YoY)
- EBITDA margin: 12% (vs 18% sector)
- Deuda/EBITDA: 4.2x
- Cobertura de intereses: 1.8x
- Rating actual: BBB-

Para cada análisis, usa una perspectiva diferente:
1. Análisis cuantitativo puro (ratios y benchmarks)
2. Análisis cualitativo (industria, management, macro)
3. Análisis comparativo (vs peers del sector)

Después, sintetiza: ¿hay consenso entre los 3 análisis?`,
    response: `**Análisis 1 (Cuantitativo):** Riesgo ALTO
- Deuda/EBITDA 4.2x supera benchmark de 3.0x → señal de alerta
- Cobertura 1.8x está en zona de peligro (<2.0x)
- Margen EBITDA 6pp debajo del sector → presión operativa

**Análisis 2 (Cualitativo):** Riesgo MODERADO-ALTO
- Revenue cayendo 8% sugiere pérdida de participación
- Sin visibilidad del plan de reestructuración
- Entorno macro incierto (tasas altas impactan servicio de deuda)

**Análisis 3 (Comparativo):** Riesgo ALTO
- Margen EBITDA P25 del sector (peor cuartil)
- Apalancamiento 1.4x sobre mediana del sector
- Rating BBB- en watchlist negativa implícita

**CONSENSO: 3/3 análisis coinciden en riesgo ALTO.**
Recomendación: Downgrade a BB+ justificado. Colocar en watchlist.`,
    when: "Decisiones de alto impacto, análisis de riesgo, validación de conclusiones, reducción de alucinaciones.",
    strength: 90,
  },
];

const HALLUCINATION_TYPES = [
  {
    type: "Dato fabricado",
    icon: "📊",
    color: "#E74C3C",
    example: "\"El EBITDA de Bancolombia en Q3 2025 fue de COP 4.2 billones\"",
    danger: "El modelo inventa cifras financieras con alta confianza. Nunca uses datos financieros de un LLM sin verificar la fuente.",
    fix: "Pide siempre: \"Indica la fuente de cada dato. Si no tienes la fuente exacta, dilo explícitamente.\"",
  },
  {
    type: "Regulación inexistente",
    icon: "📜",
    color: "#E85A1F",
    example: "\"Según la Circular 045/2025 de la SFC sobre IA en servicios financieros...\"",
    danger: "Inventa normas que suenan reales. Puede generar riesgo regulatorio si se toman decisiones basadas en normas que no existen.",
    fix: "Pide: \"Lista solo normas que puedas citar con número y fecha exacta. Si no estás seguro, indica que debe verificarse.\"",
  },
  {
    type: "Precedente legal falso",
    icon: "⚖️",
    color: "#D4AF4C",
    example: "\"En el caso Banco de Bogotá vs. Superfinanciera (2023), se estableció que...\"",
    danger: "Fabrica casos legales y jurisprudencia. Particularmente peligroso en due diligence y compliance.",
    fix: "Siempre verifica precedentes en fuentes primarias. Usa el LLM para estructurar argumentos, no para citar precedentes.",
  },
];

const WORKSHOP_TEMPLATES: Record<string, { label: string; color: string; system: string; user: string }> = {
  credit: {
    label: "Riesgo Crediticio",
    color: "#00E5A0",
    system: "Eres un analista de riesgo crediticio senior de BTG Pactual Colombia. Tu especialidad es evaluación de empresas del sector real para crédito corporativo. Siempre estructuras tu análisis con: (1) resumen ejecutivo, (2) análisis financiero con ratios clave, (3) factores cualitativos, (4) recomendación con condiciones. Citas las normas SFC aplicables. Formato: markdown con tablas.",
    user: "Evalúa la siguiente solicitud de crédito corporativo:\n\n- Empresa: Textiles del Valle S.A.S\n- Sector: Manufactura textil\n- Revenue 2025: COP 85,000M\n- EBITDA 2025: COP 12,750M (margen 15%)\n- Deuda actual: COP 32,000M\n- Monto solicitado: COP 20,000M (línea de crédito rotativa)\n- Garantía ofrecida: Inventario por COP 28,000M\n- Destino: Capital de trabajo y compra de maquinaria\n\nRealiza el análisis de riesgo crediticio completo.",
  },
  duediligence: {
    label: "Due Diligence",
    color: "#3A7BD5",
    system: "Eres un analista de Investment Banking de BTG Pactual especializado en M&A. Realizas due diligence documental exhaustiva. Estructuras hallazgos como: (1) Red flags, (2) Riesgos materiales, (3) Oportunidades, (4) Recomendaciones. Priorizas por impacto en valuación. Tono: profesional, directo, basado en evidencia.",
    user: "Estamos evaluando la adquisición de una fintech colombiana de lending. Estos son los datos del data room:\n\n- Cartera de créditos: COP 150,000M\n- Mora >90 días: 8.2% (sector: 4.5%)\n- Crecimiento cartera YoY: +45%\n- Fundada: 2021\n- 340 empleados, 85% contratistas\n- Sin registro ante SFC (opera bajo excepción)\n- 3 demandas activas por cobro coactivo\n- EBITDA negativo últimos 2 años\n\nIdentifica red flags y riesgos para la transacción.",
  },
  compliance: {
    label: "Compliance AML",
    color: "#E85A1F",
    system: "Eres un oficial de cumplimiento SARLAFT de BTG Pactual Colombia. Analizas alertas de operaciones sospechosas siguiendo la normativa de la Superfinanciera (Circular Básica Jurídica, Título IV) y los estándares FATF/GAFI. Clasificas riesgos como: BAJO, MEDIO, ALTO o CRÍTICO. Siempre recomiendas si se debe generar ROS (Reporte de Operación Sospechosa) a la UIAF.",
    user: "Analiza la siguiente alerta de monitoreo transaccional:\n\nCliente: Importadora Pacífico S.A.S (NIT 901.234.567-8)\n- Perfil declarado: Importación de maquinaria industrial\n- Facturación mensual promedio declarada: COP 2,500M\n\nTransacciones últimos 30 días:\n- 23 transferencias internacionales recibidas desde 4 países (Panamá, China, EAU, Turquía) por total USD 4.8M\n- 15 pagos a 8 proveedores nacionales no registrados previamente\n- 3 retiros en efectivo por COP 280M cada uno en sucursales diferentes\n- Cambio de representante legal hace 45 días\n\n¿Qué nivel de riesgo asignas? ¿Se debe generar ROS?",
  },
  wealth: {
    label: "Wealth Advisory",
    color: "#9B59B6",
    system: "Eres un asesor de Wealth Management de BTG Pactual para clientes High Net Worth (HNW) en Colombia. Proporcionas recomendaciones de inversión personalizadas considerando: perfil de riesgo, horizonte temporal, objetivos fiscales, y diversificación. Siempre incluyes disclaimers regulatorios y mencionas que las recomendaciones no constituyen asesoría financiera vinculante.",
    user: "Cliente HNW con el siguiente perfil:\n\n- Patrimonio líquido: USD 5M\n- Edad: 52 años\n- Perfil de riesgo: Moderado\n- Horizonte: 10-15 años (retiro)\n- Portafolio actual: 80% CDTs y cuentas de ahorro en COP\n- Objetivo: Diversificar, proteger contra devaluación del COP, generar renta pasiva\n- Restricciones: No quiere crypto, prefiere instrumentos regulados\n\nPropón un portafolio diversificado con justificación para cada clase de activo.",
  },
};

const WORKSHOP_RESPONSES: Record<string, string> = {
  credit: `## Análisis de Riesgo Crediticio — Textiles del Valle S.A.S

### 1. Resumen Ejecutivo
Solicitud de línea rotativa por COP 20,000M para capital de trabajo y capex. Empresa del sector textil con fundamentos financieros aceptables pero sector bajo presión competitiva. **Recomendación: APROBACIÓN CONDICIONADA.**

### 2. Análisis Financiero

| Indicador | Textiles del Valle | Benchmark Sector | Evaluación |
|---|---|---|---|
| Margen EBITDA | 15.0% | 12-14% | ✓ Superior |
| Deuda/EBITDA | 2.51x | <3.0x | ✓ Aceptable |
| Deuda+Nueva/EBITDA | 4.08x | <3.5x | ⚠ Elevado |
| Cobertura estimada | 2.4x | >2.0x | ✓ Aceptable |
| Garantía/Préstamo | 1.40x | >1.2x | ✓ Adecuada |

### 3. Factores Cualitativos
- **Positivo:** Margen EBITDA por encima del sector indica eficiencia operativa
- **Riesgo:** Sector textil expuesto a competencia asiática y TLC
- **Riesgo:** Garantía en inventario es volátil — valuación puede caer 30-40% en liquidación
- **Mitigante:** Destino productivo del crédito (maquinaria mejora capacidad)

### 4. Recomendación
**APROBACIÓN CONDICIONADA** por COP 15,000M (75% de lo solicitado)
- Plazo: 24 meses renovables
- Tasa: IBR + 450bps
- Garantía adicional: Prenda sobre maquinaria nueva
- Covenant: Deuda/EBITDA ≤ 3.5x con medición semestral`,

  duediligence: `## Due Diligence — Fintech de Lending (Confidencial)

### 🔴 RED FLAGS (Detener o renegociar)

1. **Mora >90d al 8.2% vs 4.5% sector** — Calidad de cartera significativamente inferior. Con crecimiento del 45% YoY, probablemente están relajando estándares crediticios para crecer (crecimiento tóxico).

2. **Sin registro SFC** — Opera bajo excepción regulatoria que puede ser revocada. La SFC ha endurecido supervisión de fintech en 2025-2026. Riesgo de cierre operativo o multas.

3. **85% contratistas** — Estructura laboral que implica riesgo de recaracterización. Exposición estimada: COP 15,000-25,000M en demandas laborales potenciales.

### ⚠ Riesgos Materiales

4. **EBITDA negativo 2 años** — El negocio no es rentable a nivel operativo. ¿Cuándo proyectan breakeven? ¿Cuánto runway tienen?

5. **3 demandas por cobro coactivo** — Indica prácticas de cobranza agresivas. Riesgo reputacional para BTG post-adquisición.

6. **Edad de la empresa (5 años)** — Track record limitado. No ha pasado por un ciclo económico completo.

### Recomendación
**NO PROCEDER** en condiciones actuales. Si hay interés estratégico:
- Reducir precio 35-45% por calidad de cartera
- Due diligence laboral independiente
- Condicionar a registro ante SFC pre-cierre`,

  compliance: `## Análisis SARLAFT — Importadora Pacífico S.A.S

### Nivel de Riesgo: 🔴 CRÍTICO

### Señales de Alerta Identificadas

| # | Señal | Tipología UIAF | Severidad |
|---|---|---|---|
| 1 | Transferencias desde 4 jurisdicciones de riesgo | Lavado transnacional | CRÍTICA |
| 2 | Retiros en efectivo fraccionados en sucursales diferentes | Structuring (pitufeo) | CRÍTICA |
| 3 | Volumen transaccional 2x sobre perfil declarado | Perfil inconsistente | ALTA |
| 4 | Proveedores nuevos no registrados | Empresas fachada | ALTA |
| 5 | Cambio reciente de representante legal | Posible testaferrato | MEDIA |

### Análisis de Perfil
- Facturación declarada: COP 2,500M/mes → USD ~625K/mes
- Transacciones reales último mes: USD 4.8M (recibidos) + COP 840M (retirados en efectivo)
- **Inconsistencia del 670%** entre perfil declarado y comportamiento real

### Recomendación
1. **GENERAR ROS INMEDIATO** ante la UIAF (Circular Básica Jurídica, Título IV, Capítulo IV)
2. Escalar a Oficial de Cumplimiento
3. Congelar operaciones hasta revisión enhanced due diligence
4. Solicitar actualización de documentos y justificación de operaciones`,

  wealth: `## Propuesta de Portafolio — Cliente HNW

### Perfil: Moderado | Horizonte: 10-15 años | Patrimonio: USD 5M

### Portafolio Propuesto

| Clase de Activo | Asignación | Monto USD | Justificación |
|---|---|---|---|
| Renta Fija Internacional (ETFs) | 30% | $1.5M | Protección COP, renta estable en USD |
| Acciones Globales (ETFs diversificados) | 25% | $1.25M | Apreciación de capital largo plazo |
| Bonos TES COP | 15% | $750K | Tasa real atractiva, beneficio fiscal |
| REITs / Fondos Inmobiliarios | 15% | $750K | Renta pasiva trimestral, cobertura inflación |
| Private Equity / Alternativos | 10% | $500K | Retorno superior, baja correlación |
| Cash / Money Market | 5% | $250K | Liquidez para oportunidades |

### Rendimiento Esperado
- **Escenario base:** 8.2% USD anual (nominal)
- **Renta pasiva estimada:** ~USD 180K/año (3.6% yield)
- **Valor proyectado a 12 años:** USD 12.8M (escenario base)

**Disclaimer:** Esta propuesta no constituye asesoría financiera vinculante. Las proyecciones se basan en rendimientos históricos y no garantizan resultados futuros. Sujeto a aprobación del comité de inversiones y perfil de idoneidad.`,
};

const QUIZ_QUESTIONS = [
  {
    question: "Un analista necesita que el LLM genere un modelo DCF con supuestos específicos. ¿Qué técnica es más efectiva?",
    options: [
      { id: 0, label: "Zero-shot: 'Haz un modelo DCF'" },
      { id: 1, label: "Few-shot: dar 2-3 ejemplos de DCF previos como referencia" },
      { id: 2, label: "Chain-of-thought: pedir que razone paso a paso cada supuesto" },
      { id: 3, label: "Self-consistency: generar 5 DCFs y promediar" },
    ],
    correct: 2,
    explanation: "Un DCF tiene múltiples pasos interdependientes (proyección de flujos, tasa de descuento, valor terminal). Chain-of-thought asegura que el modelo razone cada paso antes de avanzar al siguiente, reduciendo errores de cálculo y haciendo los supuestos explícitos y auditables.",
  },
  {
    question: "¿Cuál es la mayor amenaza de las alucinaciones en un contexto de banca de inversión?",
    options: [
      { id: 0, label: "Generar textos de baja calidad gramatical" },
      { id: 1, label: "Inventar cifras financieras o regulaciones con alta confianza" },
      { id: 2, label: "Responder lentamente" },
      { id: 3, label: "Usar lenguaje informal" },
    ],
    correct: 1,
    explanation: "Los LLMs pueden fabricar datos financieros, normas regulatorias o precedentes legales con un tono que sugiere total certeza. En banca de inversión, tomar decisiones basadas en datos inventados puede tener consecuencias regulatorias, legales y financieras graves. SIEMPRE verifica datos en fuentes primarias.",
  },
];

/* ────────────────────────── COMPONENT ────────────────────────── */

export default function Sesion3() {
  /* Anatomy */
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  /* Techniques */
  const [activeTechnique, setActiveTechnique] = useState<string>("zeroshot");

  /* Workshop */
  const [workshopTemplate, setWorkshopTemplate] = useState<string>("credit");
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setDisplayedText("");
    const full = WORKSHOP_RESPONSES[workshopTemplate] || WORKSHOP_RESPONSES.credit;
    let i = 0;
    const iv = setInterval(() => {
      i += 4;
      if (i >= full.length) {
        setDisplayedText(full);
        setIsGenerating(false);
        clearInterval(iv);
      } else {
        setDisplayedText(full.slice(0, i));
      }
    }, 10);
  }, [workshopTemplate]);

  const handleTemplateChange = useCallback((key: string) => {
    setWorkshopTemplate(key);
    setDisplayedText("");
  }, []);

  /* Quiz */
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  /* Copy */
  const [copiedSystem, setCopiedSystem] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);

  const copyText = useCallback((text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  }, []);

  const currentQ = QUIZ_QUESTIONS[quizIndex];
  const currentTemplate = WORKSHOP_TEMPLATES[workshopTemplate];

  return (
    <div className="min-h-screen bg-[#080C1F]">
      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden">
        <div className="hero-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_40%,rgba(0,229,160,0.07),transparent),radial-gradient(ellipse_40%_50%_at_70%_60%,rgba(91,82,213,0.06),transparent)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-4 animate-fadeUp">
            Módulo 02 &middot; Herramientas y Aplicaciones &middot; Sesión 3 de 5
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white-f leading-tight mb-6 animate-fadeUp-1">
            Prompt Engineering:{" "}
            <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
              comunicarse con la IA
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 animate-fadeUp-2">
            Técnicas avanzadas para obtener resultados de calidad profesional.
            De prompts genéricos a asistentes especializados para banca de inversión.
          </p>

          <div className="flex flex-wrap justify-center gap-6 animate-fadeUp-3">
            {[
              { val: "4", label: "Técnicas clave", icon: "◈" },
              { val: "80%", label: "Práctica", icon: "⚡" },
              { val: "4", label: "Templates BTG", icon: "◉" },
              { val: "R-C-T-F", label: "Framework", icon: "◆" },
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

      {/* ═══════════════════ 2. AGENDA ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-12">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-6">
            Agenda &middot; Sesión 3
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
            Caso de Estudio &middot; Morgan Stanley
          </p>
          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-cyan/10 to-purple/10 px-8 py-6 border-b border-white/[0.06]">
              <h2 className="text-2xl font-bold text-white-f">
                16,000 asesores financieros con IA
              </h2>
              <p className="text-muted mt-1">
                Cómo Morgan Stanley desplegó un asistente IA para todo su equipo de Wealth Management
              </p>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { val: "16,000", label: "Asesores", sub: "Acceso al asistente IA personalizado" },
                  { val: "100K+", label: "Documentos", sub: "Research, productos, regulación indexados" },
                  { val: "70%", label: "Adopción", sub: "En los primeros 6 meses de despliegue" },
                ].map((m) => (
                  <div key={m.label} className="text-center p-6 bg-[#0D1229] rounded-xl border border-white/[0.04]">
                    <p className="text-3xl font-bold text-cyan">{m.val}</p>
                    <p className="text-white-f font-semibold mt-1">{m.label}</p>
                    <p className="text-xs text-muted mt-1">{m.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-purple/20 bg-purple/5">
                  <h3 className="font-semibold text-white-f mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple" />
                    ¿Qué hicieron?
                  </h3>
                  <ul className="space-y-2 text-sm text-muted">
                    <li className="flex items-start gap-2">
                      <span className="text-purple mt-0.5">→</span>
                      <span>Construyeron un asistente con <strong className="text-white-f">GPT-4</strong> + base de conocimiento propietaria</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple mt-0.5">→</span>
                      <span>System prompts especializados por tipo de consulta: research, productos, compliance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple mt-0.5">→</span>
                      <span>Guardrails estrictos: no da recomendaciones de inversión directas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple mt-0.5">→</span>
                      <span>Prompt templates pre-construidos para los escenarios más frecuentes</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 rounded-xl border border-cyan/20 bg-cyan/5">
                  <h3 className="font-semibold text-white-f mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan animate-pulse-dot" />
                    Lección para BTG Pactual
                  </h3>
                  <ul className="space-y-2 text-sm text-muted">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan mt-0.5">✓</span>
                      <span>El <strong className="text-white-f">prompt engineering</strong> fue clave para el éxito — no la tecnología sola</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan mt-0.5">✓</span>
                      <span>Templates reutilizables <strong className="text-white-f">aceleran adopción</strong> y reducen fricción</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan mt-0.5">✓</span>
                      <span>Los guardrails se implementan via <strong className="text-white-f">system prompts</strong>, no código</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan mt-0.5">✓</span>
                      <span>Hoy BTG puede replicar esto con <strong className="text-white-f">Claude Projects + Custom GPTs</strong> sin desarrollo</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════════ 4. PROMPT ANATOMY — R-C-T-F ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">
            Framework &middot; Anatomía de un Prompt
          </p>
          <h2 className="text-2xl font-bold text-white-f mb-2">
            R-C-T-F: Las 4 capas de un prompt profesional
          </h2>
          <p className="text-muted mb-8 max-w-3xl">
            Todo prompt efectivo tiene 4 componentes. Haz clic en cada capa para ver ejemplos
            contextualizados a banca de inversión.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Layers */}
            <div className="space-y-3">
              {PROMPT_LAYERS.map((layer) => {
                const isActive = activeLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(isActive ? null : layer.id)}
                    className={`w-full text-left rounded-2xl p-6 transition-all cursor-pointer border ${
                      isActive
                        ? "scale-[1.02] shadow-lg"
                        : "border-white/[0.06] bg-[#151A3A] hover:border-white/[0.12]"
                    }`}
                    style={isActive ? {
                      background: `${layer.color}15`,
                      borderColor: `${layer.color}50`,
                    } : undefined}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0"
                        style={{ background: `${layer.color}20`, color: layer.color }}
                      >
                        {layer.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white-f">{layer.label}</p>
                        <p className="text-xs text-muted mt-1">{layer.desc}</p>
                      </div>
                      <span className="text-lg" style={{ color: layer.color }}>
                        {isActive ? "−" : "+"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Detail */}
            <div className="flex items-start">
              {activeLayer ? (
                (() => {
                  const layer = PROMPT_LAYERS.find(l => l.id === activeLayer)!;
                  return (
                    <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-8 w-full animate-fadeUp">
                      <h3 className="text-xl font-bold text-white-f mb-6 flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: layer.color }} />
                        {layer.label}
                      </h3>

                      {layer.bad && (
                        <div className="mb-4">
                          <p className="font-mono text-xs text-red mb-2">MAL EJEMPLO</p>
                          <div className="bg-red/5 border border-red/20 rounded-xl p-4">
                            <p className="text-sm text-muted font-mono">{layer.bad}</p>
                          </div>
                        </div>
                      )}

                      <div className="mb-4">
                        <p className="font-mono text-xs text-cyan mb-2">BUEN EJEMPLO</p>
                        <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4">
                          <p className="text-sm text-white-f font-mono whitespace-pre-wrap">{layer.good}</p>
                        </div>
                      </div>

                      <div className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04]">
                        <p className="font-mono text-xs text-orange mb-2">TIP</p>
                        <p className="text-sm text-muted">{layer.tip}</p>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center w-full py-20">
                  <p className="text-3xl mb-3">←</p>
                  <p className="text-muted text-sm">Haz clic en una capa para ver ejemplos</p>
                  <p className="text-muted/50 text-xs mt-2">
                    R = Rol · C = Contexto · T = Tarea · F = Formato
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Full prompt assembled */}
          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-8 mt-8">
            <p className="font-mono text-xs text-orange mb-4 uppercase tracking-widest">
              Prompt Completo — Las 4 capas ensambladas
            </p>
            <div className="space-y-3">
              {PROMPT_LAYERS.map((layer) => (
                <div key={layer.id} className="rounded-xl p-4 border" style={{
                  background: `${layer.color}08`,
                  borderColor: `${layer.color}25`,
                }}>
                  <p className="font-mono text-[0.65rem] uppercase tracking-widest mb-2" style={{ color: layer.color }}>
                    {layer.icon} — {layer.label}
                  </p>
                  <p className="text-sm text-white-f font-mono whitespace-pre-wrap">{layer.good}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════════ 5. ADVANCED TECHNIQUES ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">
            Técnicas Avanzadas &middot; Prompt Engineering
          </p>
          <h2 className="text-2xl font-bold text-white-f mb-2">
            4 técnicas para resultados profesionales
          </h2>
          <p className="text-muted mb-8 max-w-3xl">
            Cada técnica resuelve un tipo diferente de problema. Selecciona una para ver
            el prompt completo con ejemplo financiero.
          </p>

          {/* Technique selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {TECHNIQUES.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTechnique(t.id)}
                className={`rounded-xl p-4 text-left transition-all cursor-pointer border ${
                  activeTechnique === t.id
                    ? "scale-[1.02] shadow-lg"
                    : "border-white/[0.06] bg-[#151A3A] hover:border-white/[0.12]"
                }`}
                style={activeTechnique === t.id ? {
                  background: `${t.color}15`,
                  borderColor: `${t.color}50`,
                } : undefined}
              >
                <span className="text-2xl font-mono font-bold" style={{ color: t.color }}>{t.icon}</span>
                <p className="text-white-f font-semibold mt-2 text-sm">{t.label}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${t.strength}%`,
                      background: t.color,
                    }} />
                  </div>
                  <span className="font-mono text-[0.6rem] text-muted">{t.strength}%</span>
                </div>
                <p className="text-[0.6rem] text-muted mt-1">Efectividad en finanzas</p>
              </button>
            ))}
          </div>

          {/* Technique detail */}
          {(() => {
            const t = TECHNIQUES.find(x => x.id === activeTechnique)!;
            return (
              <div className="grid lg:grid-cols-2 gap-6 animate-fadeUp">
                {/* Prompt */}
                <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                    <p className="font-mono text-xs text-muted">
                      Prompt — {t.label}
                    </p>
                  </div>
                  <p className="text-sm text-muted mb-4">{t.desc}</p>
                  <div className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04] max-h-[400px] overflow-y-auto">
                    <pre className="text-sm text-white-f font-mono whitespace-pre-wrap">{t.prompt}</pre>
                  </div>
                  <div className="mt-4 bg-[#0D1229] rounded-xl p-3 border border-white/[0.04]">
                    <p className="font-mono text-[0.65rem] text-muted">
                      <strong style={{ color: t.color }}>Usar cuando:</strong> {t.when}
                    </p>
                  </div>
                </div>

                {/* Response */}
                <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-cyan animate-pulse-dot" />
                    <p className="font-mono text-xs text-muted">
                      Respuesta del modelo
                    </p>
                  </div>
                  <div className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04] max-h-[500px] overflow-y-auto">
                    <div className="text-sm text-white-f font-mono whitespace-pre-wrap leading-relaxed">
                      {t.response}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>
      </RevealSection>

      {/* ═══════════════════ 6. HALLUCINATIONS ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">
            Riesgo Crítico &middot; Alucinaciones
          </p>
          <h2 className="text-2xl font-bold text-white-f mb-2">
            Alucinaciones en contexto financiero
          </h2>
          <p className="text-muted mb-8 max-w-3xl">
            Los LLMs pueden inventar datos con total confianza. En banca de inversión,
            esto es un riesgo operativo, regulatorio y reputacional.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {HALLUCINATION_TYPES.map((h) => (
              <div key={h.type} className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{h.icon}</span>
                  <p className="font-semibold text-white-f">{h.type}</p>
                </div>

                <div className="bg-red/5 border border-red/20 rounded-xl p-3 mb-4">
                  <p className="font-mono text-xs text-red mb-1">EJEMPLO ALUCINADO</p>
                  <p className="text-sm text-muted italic">{h.example}</p>
                </div>

                <p className="text-sm text-muted mb-4">{h.danger}</p>

                <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-3">
                  <p className="font-mono text-xs text-cyan mb-1">MITIGACIÓN</p>
                  <p className="text-sm text-white-f">{h.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════════ 7. WORKSHOP — INTERACTIVE LAB ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">
            Taller Práctico &middot; Asistentes para BTG
          </p>
          <h2 className="text-2xl font-bold text-white-f mb-2">
            Construye un asistente especializado
          </h2>
          <p className="text-muted mb-8 max-w-3xl">
            Selecciona un template, revisa el system prompt y el prompt de usuario,
            y genera la respuesta simulada. Luego, copia los prompts para probarlos en
            Claude, ChatGPT o Gemini.
          </p>

          {/* Template selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {Object.entries(WORKSHOP_TEMPLATES).map(([key, t]) => (
              <button
                key={key}
                onClick={() => handleTemplateChange(key)}
                className={`rounded-xl p-4 text-center transition-all cursor-pointer border ${
                  workshopTemplate === key
                    ? "scale-[1.02]"
                    : "border-white/[0.06] bg-[#151A3A] hover:border-white/[0.12]"
                }`}
                style={workshopTemplate === key ? {
                  background: `${t.color}15`,
                  borderColor: `${t.color}50`,
                } : undefined}
              >
                <p className="font-semibold text-sm" style={{ color: workshopTemplate === key ? t.color : undefined }}>
                  {t.label}
                </p>
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Prompts */}
            <div className="space-y-6">
              <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-xs text-muted">System Prompt</p>
                  <button
                    onClick={() => copyText(currentTemplate.system, setCopiedSystem)}
                    className="px-3 py-1 rounded-lg text-xs font-mono border border-white/[0.08] text-muted hover:text-white-f hover:border-purple/40 transition-all cursor-pointer"
                  >
                    {copiedSystem ? "Copiado ✓" : "Copiar"}
                  </button>
                </div>
                <div className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04]">
                  <p className="text-sm text-white-f font-mono whitespace-pre-wrap">{currentTemplate.system}</p>
                </div>
              </div>

              <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-xs text-muted">User Prompt</p>
                  <button
                    onClick={() => copyText(currentTemplate.user, setCopiedUser)}
                    className="px-3 py-1 rounded-lg text-xs font-mono border border-white/[0.08] text-muted hover:text-white-f hover:border-purple/40 transition-all cursor-pointer"
                  >
                    {copiedUser ? "Copiado ✓" : "Copiar"}
                  </button>
                </div>
                <div className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04] max-h-[300px] overflow-y-auto">
                  <p className="text-sm text-white-f font-mono whitespace-pre-wrap">{currentTemplate.user}</p>
                </div>
              </div>
            </div>

            {/* Right: Generated response */}
            <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse-dot" />
                <p className="font-mono text-xs text-muted">
                  Respuesta simulada &middot; Claude 4.6
                </p>
              </div>

              <div className="flex-1 bg-[#0D1229] rounded-xl p-6 border border-white/[0.04] overflow-y-auto max-h-[500px] min-h-[300px]">
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

      {/* ═══════════════════ 8. CHALLENGE + QUIZ ═══════════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16 pb-32">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">
            Reto &middot; Prompt Battle
          </p>
          <h2 className="text-2xl font-bold text-white-f mb-8">
            Demuestra tu dominio de prompts
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Steps */}
            <div className="space-y-4">
              {[
                {
                  n: 1,
                  title: "Elige un escenario BTG",
                  desc: "Selecciona un caso de tu área: IB, WM, AM, S&T, o Compliance. El reto es construir el prompt perfecto.",
                },
                {
                  n: 2,
                  title: "Aplica el framework R-C-T-F",
                  desc: "Estructura tu prompt con las 4 capas: Rol, Contexto, Tarea y Formato. Usa al menos una técnica avanzada.",
                },
                {
                  n: 3,
                  title: "Prueba en 2 modelos",
                  desc: "Envía el mismo prompt a Claude y ChatGPT. Compara calidad, estructura y precisión de las respuestas.",
                },
                {
                  n: 4,
                  title: "Presenta tu mejor prompt",
                  desc: "Comparte con el grupo: prompt, output, y por qué funciona. El mejor prompt gana reconocimiento.",
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

            {/* Quiz */}
            <div className="space-y-6">
              <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-mono text-xs text-orange">
                    QUIZ — Pregunta {quizIndex + 1} de {QUIZ_QUESTIONS.length}
                  </p>
                  {QUIZ_QUESTIONS.length > 1 && (
                    <div className="flex gap-1">
                      {QUIZ_QUESTIONS.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => { setQuizIndex(i); setQuizAnswer(null); }}
                          className={`w-6 h-6 rounded-full text-xs font-mono transition-all cursor-pointer border ${
                            quizIndex === i
                              ? "border-purple bg-purple/20 text-white-f"
                              : "border-white/[0.06] text-muted hover:border-white/[0.12]"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-white-f font-semibold mb-4">{currentQ.question}</p>
                <div className="space-y-2">
                  {currentQ.options.map((opt) => {
                    const isCorrect = opt.id === currentQ.correct;
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
                        {isSelected && isCorrect && <span className="ml-2">✓ Correcto</span>}
                        {isSelected && !isCorrect && <span className="ml-2">✕ Intenta de nuevo</span>}
                      </button>
                    );
                  })}
                </div>
                {quizAnswer === currentQ.correct && (
                  <div className="mt-4 bg-cyan/5 border border-cyan/20 rounded-xl p-4 animate-fadeUp">
                    <p className="text-sm text-white-f">{currentQ.explanation}</p>
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
