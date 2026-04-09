"use client";

import { useState, useCallback, useEffect } from "react";
import RevealSection from "@/components/RevealSection";

/* ════════════════════════════ DATA ════════════════════════════ */

const AGENDA = [
  { time: "0:00–0:15", label: "Caso: Morgan Stanley & IA", color: "#00E5A0" },
  { time: "0:15–0:35", label: "Anatomía R-C-T-F", color: "#5B52D5" },
  { time: "0:35–1:00", label: "Técnicas avanzadas", color: "#7B73E8" },
  { time: "1:00–1:20", label: "Multimodal & MCP", color: "#E85A1F" },
  { time: "1:20–1:45", label: "Taller: Asistente BTG", color: "#D4AF4C" },
  { time: "1:45–2:00", label: "Reto: Prompt Battle", color: "#22C55E" },
];

const PROMPT_LAYERS = [
  {
    id: "rol", label: "Rol", color: "#00E5A0", icon: "R",
    desc: "Define quién es el modelo. Establece expertise, tono y perspectiva.",
    bad: "Ayúdame con un análisis.",
    good: "Eres un analista senior de renta fija en BTG Pactual Colombia, especializado en emisiones de deuda corporativa en mercados emergentes.",
    tip: "Mientras más específico el rol, más contextualizada la respuesta. Incluye la empresa, el área y la especialización.",
  },
  {
    id: "contexto", label: "Contexto", color: "#3A7BD5", icon: "C",
    desc: "Proporciona la información de fondo necesaria para que el modelo entienda la situación.",
    bad: "Analiza esta empresa.",
    good: "Ecopetrol planea emitir bonos verdes por USD 1.5B a 10 años. El spread soberano de Colombia está en ~320bps sobre UST. Rating S&P actual: BB+ con perspectiva estable. EBITDA 2025: USD 12.3B.",
    tip: "Incluye datos cuantitativos, restricciones, y el estado actual. El modelo no sabe lo que tú no le dices.",
  },
  {
    id: "tarea", label: "Tarea", color: "#5B52D5", icon: "T",
    desc: "La instrucción específica de lo que quieres que haga. Clara, accionable, delimitada.",
    bad: "Dame tu opinión.",
    good: "1. Evalúa las condiciones del mercado de deuda LatAm.\n2. Identifica los 3 principales riesgos para esta emisión.\n3. Recomienda un rango de spread con justificación.\n4. Sugiere estructura óptima (tramo, moneda, covenants).",
    tip: "Numera las subtareas. Usa verbos de acción: evalúa, identifica, recomienda, compara, clasifica.",
  },
  {
    id: "formato", label: "Formato", color: "#E85A1F", icon: "F",
    desc: "Especifica cómo quieres recibir la respuesta: estructura, extensión, estilo.",
    bad: "",
    good: "Formato: Memo ejecutivo de máximo 500 palabras. Incluye tabla de comparables con columnas: Emisor, Rating, Spread, Monto, Plazo. Cierra con recomendación en bullet points.",
    tip: "Pide tablas, bullet points, headers, o formatos específicos. Si no especificas formato, el modelo decide por ti.",
  },
];

const TECHNIQUES = [
  {
    id: "zeroshot", label: "Zero-Shot", color: "#3A7BD5", icon: "0",
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
    id: "fewshot", label: "Few-Shot", color: "#5B52D5", icon: "F",
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
- Apertura de CDTs en sucursales diferentes sugiere evasión de controles
- Monto total supera umbral de reporte de operaciones sospechosas
- Recomendación: Reporte de Operación Sospechosa (ROS) a la UIAF`,
    when: "Extracción de datos, clasificación con formato específico, análisis con criterios definidos.",
    strength: 85,
  },
  {
    id: "cot", label: "Chain-of-Thought", color: "#E85A1F", icon: "⛓",
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
- Objetivo: 13.0% – 10.96% = **+2.04pp**

**Paso 3: Rebalanceo propuesto**
- Acciones: 25% → 35% (+10pp, máximo permitido)
- Cash: 15% → 0% (-15pp)
- Corp: 20% → 25% (+5pp)
- TES: 40% → 40% (sin cambio)

**Nuevo rendimiento:** 4.48 + 5.53 + 2.38 + 0 = **12.39%**

**Paso 4:** Renta variable: 35% ✓ | Rendimiento: 12.39% ✗ (falta 0.61pp)
**Ajuste:** Bonos corp high-yield (11.5%) o renegociar target a 12.5%.`,
    when: "Cálculos financieros, análisis multi-variable, decisiones con restricciones, problemas de optimización.",
    strength: 95,
  },
  {
    id: "selfconsistency", label: "Self-Consistency", color: "#22C55E", icon: "✓",
    desc: "Generas múltiples respuestas al mismo prompt y seleccionas la más consistente. Reduce alucinaciones y aumenta confianza.",
    prompt: `Genera 3 análisis independientes del riesgo de default:
- Revenue: COP 45B (-8% YoY)
- EBITDA margin: 12% (vs 18% sector)
- Deuda/EBITDA: 4.2x
- Cobertura de intereses: 1.8x
- Rating actual: BBB-

Perspectivas: 1) Cuantitativo 2) Cualitativo 3) Comparativo
Después, sintetiza: ¿hay consenso?`,
    response: `**Análisis 1 (Cuantitativo):** Riesgo ALTO
- Deuda/EBITDA 4.2x supera benchmark 3.0x
- Cobertura 1.8x en zona de peligro (<2.0x)

**Análisis 2 (Cualitativo):** Riesgo MODERADO-ALTO
- Revenue cayendo 8% sugiere pérdida de share
- Sin plan de reestructuración visible

**Análisis 3 (Comparativo):** Riesgo ALTO
- Margen EBITDA peor cuartil del sector
- Apalancamiento 1.4x sobre mediana sectorial

**CONSENSO: 3/3 → Riesgo ALTO.** Downgrade a BB+ justificado.`,
    when: "Decisiones de alto impacto, análisis de riesgo, validación de conclusiones.",
    strength: 90,
  },
  {
    id: "metaprompt", label: "Meta-Prompting", color: "#9B59B6", icon: "M",
    desc: "Usas el LLM para que genere o mejore prompts. El modelo se optimiza a sí mismo — el prompt que escribe un LLM suele superar al que escribe un humano.",
    prompt: `Eres un experto en prompt engineering para análisis financiero.

Necesito un prompt para un analista de BTG Pactual que tiene que evaluar oportunidades de M&A en el sector de energías renovables en Colombia.

El prompt debe:
1. Seguir el framework R-C-T-F (Rol, Contexto, Tarea, Formato)
2. Usar chain-of-thought para el razonamiento
3. Incluir criterios específicos de evaluación
4. Producir un output accionable para el comité de inversiones

Genera el prompt óptimo.`,
    response: `**PROMPT GENERADO POR EL LLM:**

---
**[ROL]** Eres un VP de Investment Banking de BTG Pactual Colombia, especializado en M&A del sector energía. Tienes 12 años de experiencia en transacciones cross-border LatAm.

**[CONTEXTO]** BTG Pactual busca identificar targets de adquisición en energías renovables en Colombia. Presupuesto: USD 50-200M. La transición energética acelera (meta 2030: 20% renovables). Competidores: Brookfield, Celsia, AES.

**[TAREA]** Piensa paso a paso:
1. Mapea el ecosistema de renovables en Colombia (solar, eólico, biomasa)
2. Identifica 5 targets potenciales con justificación cuantitativa
3. Evalúa cada target en: EBITDA, capacidad instalada MW, pipeline, riesgo regulatorio
4. Clasifica por atractivo de inversión (1-10)
5. Recomienda los 2 mejores targets para due diligence

**[FORMATO]** Memo para comité de inversiones. Incluye tabla comparativa, thesis de inversión en 3 bullets por target, y next steps con timeline.
---

*Este prompt obtiene mejores resultados porque incluye seniority en el rol, restricciones cuantitativas claras, competencia, y un formato de output alineado con la audiencia real.*`,
    when: "Cuando necesitas el prompt perfecto para un caso complejo. Ideal para crear templates reutilizables para el equipo.",
    strength: 92,
  },
  {
    id: "chaining", label: "Prompt Chaining", color: "#D4AF4C", icon: "⚙",
    desc: "Divides una tarea compleja en prompts secuenciales donde el output de uno alimenta el input del siguiente. Máximo control y calidad.",
    prompt: `CADENA DE 4 PROMPTS para Due Diligence:

PROMPT 1 → Extracción:
"Lee este contrato y extrae: partes, obligaciones, plazos, penalidades, cláusulas de terminación."

PROMPT 2 → Análisis (input: output del P1):
"Con base en estas cláusulas extraídas, identifica: red flags, riesgos materiales, cláusulas no estándar, y exposición financiera estimada."

PROMPT 3 → Comparación (input: output del P2):
"Compara estos riesgos contra los estándares de mercado para transacciones M&A del sector energía en Colombia. ¿Qué está fuera de lo normal?"

PROMPT 4 → Recomendación (input: output del P3):
"Genera un memo ejecutivo para el comité: resumen de hallazgos, recomendación GO/NO-GO, condiciones para proceder, y términos a renegociar."`,
    response: `**¿Por qué funciona mejor que un solo prompt?**

| Aspecto | Prompt Único | Prompt Chaining |
|---|---|---|
| Precisión | ~65% | ~92% |
| Control de calidad | Bajo | Alto (verificas cada paso) |
| Debugging | Difícil | Fácil (sabes dónde falló) |
| Extensión | Limitada por contexto | Ilimitada |
| Costo | Menor | Mayor (4 calls) |

**Herramientas que soportan chaining nativo:**
- Claude Projects (conversación multi-turno con memoria)
- n8n (nodos secuenciales con LLM)
- LangChain / LangGraph (código)
- Custom GPTs con Actions (API calls intermedias)

En BTG, esto se implementa con n8n: cada nodo ejecuta un prompt, el pipeline completo corre automáticamente.`,
    when: "Due diligence, análisis de contratos complejos, investigaciones multi-paso, cualquier tarea que requiera más de 2000 palabras de output.",
    strength: 88,
  },
];

const MULTIMODAL_CAPABILITIES = [
  {
    id: "vision",
    label: "Visión",
    icon: "📸",
    color: "#00E5A0",
    desc: "Los modelos pueden analizar imágenes: gráficos financieros, screenshots, documentos escaneados, capturas de Bloomberg.",
    examples: [
      "Sube una captura del terminal Bloomberg → el LLM interpreta la curva de rendimiento y genera un análisis",
      "Foto de un documento firmado → extrae cláusulas clave y datos del firmante",
      "Screenshot de un dashboard Power BI → identifica anomalías y tendencias",
      "Imagen de una pizarra de trading → transcribe y organiza las posiciones",
    ],
    models: ["Claude 4.6 Opus", "GPT-5.4", "Gemini 3.1"],
  },
  {
    id: "files",
    label: "Archivos",
    icon: "📄",
    color: "#5B52D5",
    desc: "Análisis de PDFs, Excel, CSV, PowerPoint directamente. Sin copiar-pegar, sin perder formato.",
    examples: [
      "Sube 50 PDFs de contratos al Claude Project → pregunta sobre cláusulas específicas",
      "Adjunta un Excel de 10,000 filas → pide análisis estadístico y detección de anomalías",
      "Carga un pitch deck → pide feedback sobre fortalezas y debilidades del argumento",
      "Sube estados financieros en PDF → extrae ratios y genera comparables automáticamente",
    ],
    models: ["Claude 4.6 (1M tokens)", "ChatGPT (archivos)", "Gemini (Drive)"],
  },
  {
    id: "audio",
    label: "Audio & Voz",
    icon: "🎙",
    color: "#E85A1F",
    desc: "Transcripción, análisis de earnings calls, resumen de reuniones grabadas, voice-to-insight.",
    examples: [
      "Sube una earnings call de 90 minutos → resumen ejecutivo + señales clave para trading",
      "Graba una reunión con cliente → genera minuta + action items + follow-ups",
      "Audio del morning meeting → extrae posiciones y recomendaciones de cada trader",
      "Modo voz avanzado: conversa con el LLM sobre un análisis mientras manejas",
    ],
    models: ["ChatGPT Advanced Voice", "Gemini Live", "NotebookLM Audio Overview"],
  },
  {
    id: "code",
    label: "Código & Data",
    icon: "⌨",
    color: "#D4AF4C",
    desc: "Generación de código, análisis de datos, visualizaciones, modelos financieros — todo desde lenguaje natural.",
    examples: [
      "\"Crea un modelo Black-Scholes en Python con estas variables\" → código ejecutable",
      "\"Analiza este CSV de transacciones y genera un reporte de anomalías\" → pandas + gráficas",
      "\"Construye un dashboard en Streamlit para monitoreo de portafolio\" → app completa",
      "Claude Artifacts / ChatGPT Canvas: edita código en tiempo real dentro del chat",
    ],
    models: ["Claude Artifacts", "ChatGPT Canvas", "Cursor", "Claude Code"],
  },
];

const MCP_SERVERS = [
  { name: "PostgreSQL", icon: "🗄", desc: "Consulta bases de datos con lenguaje natural. El LLM genera SQL y lee resultados.", color: "#3A7BD5" },
  { name: "Google Drive", icon: "📁", desc: "Busca, lee y analiza documentos en Drive directamente desde el chat.", color: "#22C55E" },
  { name: "Slack", icon: "💬", desc: "Lee canales, busca mensajes, envía resúmenes automáticos.", color: "#E85A1F" },
  { name: "GitHub", icon: "⚙", desc: "Lee repos, crea PRs, revisa código, gestiona issues.", color: "#9B59B6" },
  { name: "Bloomberg API", icon: "📊", desc: "Datos de mercado en tiempo real alimentando al LLM para análisis.", color: "#D4AF4C" },
  { name: "SharePoint", icon: "📋", desc: "Accede a documentos internos, políticas, normativas desde el chat.", color: "#5B52D5" },
  { name: "Salesforce", icon: "☁", desc: "CRM data: historial de clientes, pipeline, oportunidades.", color: "#00E5A0" },
  { name: "SAP", icon: "◆", desc: "Datos financieros, contabilidad, órdenes de compra desde el ERP.", color: "#3A7BD5" },
];

const HALLUCINATION_TYPES = [
  { type: "Dato fabricado", icon: "📊", color: "#E74C3C",
    example: "\"El EBITDA de Bancolombia en Q3 2025 fue de COP 4.2 billones\"",
    danger: "Inventa cifras financieras con total confianza.",
    fix: "Pide: \"Indica la fuente de cada dato. Si no la tienes, dilo explícitamente.\"" },
  { type: "Regulación inexistente", icon: "📜", color: "#E85A1F",
    example: "\"Según la Circular 045/2025 de la SFC sobre IA en servicios financieros...\"",
    danger: "Inventa normas que suenan reales. Riesgo regulatorio grave.",
    fix: "Pide: \"Cita solo normas con número y fecha exacta. Si no estás seguro, adviértelo.\"" },
  { type: "Precedente legal falso", icon: "⚖", color: "#D4AF4C",
    example: "\"En el caso Banco de Bogotá vs. Superfinanciera (2023)...\"",
    danger: "Fabrica jurisprudencia. Peligroso en due diligence.",
    fix: "Verifica SIEMPRE en fuentes primarias. Usa el LLM para estructurar, no para citar." },
  { type: "Cálculo erróneo silencioso", icon: "🧮", color: "#9B59B6",
    example: "\"El DCF arroja una valuación de USD 245M\" (con error en la tasa de descuento)",
    danger: "Errores de cálculo embebidos en análisis aparentemente correctos. Difíciles de detectar.",
    fix: "Usa Chain-of-Thought para que muestre cada paso. Verifica cálculos clave manualmente." },
];

const WORKSHOP_TEMPLATES: Record<string, { label: string; color: string; icon: string; system: string; user: string }> = {
  credit: {
    label: "Riesgo Crediticio", color: "#00E5A0", icon: "📈",
    system: "Eres un analista de riesgo crediticio senior de BTG Pactual Colombia. Tu especialidad es evaluación de empresas del sector real para crédito corporativo. Siempre estructuras tu análisis con: (1) resumen ejecutivo, (2) análisis financiero con ratios clave, (3) factores cualitativos, (4) recomendación con condiciones. Citas las normas SFC aplicables. Formato: markdown con tablas.",
    user: "Evalúa la siguiente solicitud de crédito corporativo:\n\n- Empresa: Textiles del Valle S.A.S\n- Sector: Manufactura textil\n- Revenue 2025: COP 85,000M\n- EBITDA 2025: COP 12,750M (margen 15%)\n- Deuda actual: COP 32,000M\n- Monto solicitado: COP 20,000M (línea rotativa)\n- Garantía: Inventario por COP 28,000M\n\nRealiza el análisis completo.",
  },
  duediligence: {
    label: "Due Diligence", color: "#3A7BD5", icon: "🔍",
    system: "Eres un analista de Investment Banking de BTG Pactual especializado en M&A. Realizas due diligence documental exhaustiva. Estructuras: (1) Red flags, (2) Riesgos materiales, (3) Oportunidades, (4) Recomendaciones. Priorizas por impacto en valuación.",
    user: "Evaluamos adquisición de fintech colombiana de lending:\n- Cartera: COP 150,000M\n- Mora >90d: 8.2% (sector: 4.5%)\n- Crecimiento cartera YoY: +45%\n- Fundada: 2021, 340 empleados (85% contratistas)\n- Sin registro ante SFC\n- 3 demandas activas por cobro coactivo\n- EBITDA negativo últimos 2 años\n\nIdentifica red flags y riesgos.",
  },
  compliance: {
    label: "Compliance AML", color: "#E85A1F", icon: "⚖",
    system: "Eres un oficial de cumplimiento SARLAFT de BTG Pactual Colombia. Analizas alertas de operaciones sospechosas siguiendo la normativa SFC y estándares FATF/GAFI. Clasificas riesgos como: BAJO, MEDIO, ALTO o CRÍTICO. Recomiendas si se debe generar ROS a la UIAF.",
    user: "Alerta de monitoreo transaccional:\n\nCliente: Importadora Pacífico S.A.S (NIT 901.234.567-8)\n- Perfil: Importación maquinaria industrial\n- Facturación declarada: COP 2,500M/mes\n\nÚltimos 30 días:\n- 23 transferencias internacionales desde Panamá, China, EAU, Turquía: USD 4.8M\n- 15 pagos a 8 proveedores no registrados\n- 3 retiros efectivo COP 280M c/u en sucursales diferentes\n- Cambio de representante legal hace 45 días\n\n¿Nivel de riesgo? ¿ROS?",
  },
  wealth: {
    label: "Wealth Advisory", color: "#9B59B6", icon: "💼",
    system: "Eres un asesor de Wealth Management de BTG Pactual para clientes HNW en Colombia. Recomendaciones personalizadas considerando: perfil de riesgo, horizonte, objetivos fiscales, diversificación. Incluyes disclaimers regulatorios.",
    user: "Cliente HNW:\n- Patrimonio líquido: USD 5M\n- Edad: 52 años, perfil moderado\n- Horizonte: 10-15 años (retiro)\n- Actual: 80% CDTs y ahorro en COP\n- Objetivo: Diversificar, proteger vs devaluación COP, generar renta pasiva\n- No crypto, solo instrumentos regulados\n\nPropón portafolio diversificado con justificación.",
  },
};

const WORKSHOP_RESPONSES: Record<string, string> = {
  credit: `## Análisis de Riesgo Crediticio — Textiles del Valle S.A.S

### 1. Resumen Ejecutivo
Línea rotativa COP 20,000M para capital de trabajo y capex. Sector textil bajo presión competitiva pero empresa con fundamentos aceptables. **Recomendación: APROBACIÓN CONDICIONADA.**

### 2. Análisis Financiero

| Indicador | Textiles del Valle | Benchmark | Eval |
|---|---|---|---|
| Margen EBITDA | 15.0% | 12-14% | ✓ |
| Deuda/EBITDA | 2.51x | <3.0x | ✓ |
| (Deuda+Nueva)/EBITDA | 4.08x | <3.5x | ⚠ |
| Cobertura estimada | 2.4x | >2.0x | ✓ |
| Garantía/Préstamo | 1.40x | >1.2x | ✓ |

### 3. Recomendación
**APROBACIÓN CONDICIONADA** por COP 15,000M
- Tasa: IBR + 450bps
- Covenant: Deuda/EBITDA ≤ 3.5x semestral
- Garantía adicional: Prenda sobre maquinaria nueva`,

  duediligence: `## Due Diligence — Fintech Lending (Confidencial)

### RED FLAGS

1. **Mora >90d al 8.2% vs 4.5% sector** — Crecimiento tóxico: relajan estándares para crecer
2. **Sin registro SFC** — SFC ha endurecido supervisión fintech 2025-2026
3. **85% contratistas** — Riesgo recaracterización: COP 15-25B en demandas laborales potenciales

### RIESGOS MATERIALES
4. **EBITDA negativo 2 años** — ¿Cuándo breakeven? ¿Cuánto runway?
5. **3 demandas cobro coactivo** — Riesgo reputacional para BTG

### RECOMENDACIÓN
**NO PROCEDER** en condiciones actuales. Si hay interés:
- Reducir precio 35-45% por calidad de cartera
- Due diligence laboral independiente
- Condicionar a registro SFC pre-cierre`,

  compliance: `## Análisis SARLAFT — Importadora Pacífico S.A.S

### Nivel de Riesgo: CRÍTICO

| # | Señal | Tipología UIAF | Severidad |
|---|---|---|---|
| 1 | Transferencias 4 jurisdicciones riesgo | Lavado transnacional | CRÍTICA |
| 2 | Retiros fraccionados en sucursales | Structuring | CRÍTICA |
| 3 | Volumen 2x perfil declarado | Perfil inconsistente | ALTA |
| 4 | Proveedores nuevos no registrados | Empresas fachada | ALTA |

**Inconsistencia del 670%** entre perfil y comportamiento real.

### RECOMENDACIÓN: GENERAR ROS INMEDIATO (UIAF)
Congelar operaciones. Enhanced due diligence.`,

  wealth: `## Portafolio Propuesto — Cliente HNW

### Perfil: Moderado | Horizonte: 10-15 años | USD 5M

| Clase de Activo | % | USD | Justificación |
|---|---|---|---|
| Renta Fija Internacional | 30% | $1.5M | Protección COP |
| Acciones Globales ETFs | 25% | $1.25M | Apreciación LP |
| Bonos TES COP | 15% | $750K | Tasa real atractiva |
| REITs/Inmobiliario | 15% | $750K | Renta pasiva |
| Private Equity | 10% | $500K | Retorno superior |
| Cash | 5% | $250K | Liquidez |

**Rendimiento esperado:** 8.2% USD anual
**Renta pasiva:** ~USD 180K/año (3.6% yield)

Disclaimer: No constituye asesoría financiera vinculante.`,
};

const QUIZ_QUESTIONS = [
  {
    question: "Un analista necesita que el LLM genere un modelo DCF con supuestos específicos. ¿Qué técnica es más efectiva?",
    options: [
      { id: 0, label: "Zero-shot: 'Haz un modelo DCF'" },
      { id: 1, label: "Few-shot: dar 2-3 ejemplos de DCF previos" },
      { id: 2, label: "Chain-of-thought: razonar paso a paso cada supuesto" },
      { id: 3, label: "Self-consistency: generar 5 DCFs y promediar" },
    ],
    correct: 2,
    explanation: "Un DCF tiene pasos interdependientes (flujos, tasa de descuento, valor terminal). Chain-of-thought asegura que el modelo razone cada paso, reduciendo errores y haciendo los supuestos auditables.",
  },
  {
    question: "¿Cuál es la ventaja principal de Meta-Prompting sobre escribir prompts manualmente?",
    options: [
      { id: 0, label: "Es más barato en tokens" },
      { id: 1, label: "El LLM conoce patrones de prompts efectivos que un humano no considera" },
      { id: 2, label: "Siempre produce respuestas más largas" },
      { id: 3, label: "No requiere conocimiento del tema" },
    ],
    correct: 1,
    explanation: "El LLM ha procesado millones de interacciones y conoce qué estructuras de prompt producen mejores resultados. Un meta-prompt aprovecha ese conocimiento implícito para generar prompts más efectivos que los que un humano escribiría intuitivamente.",
  },
  {
    question: "¿Qué es MCP (Model Context Protocol) y por qué es revolucionario en 2026?",
    options: [
      { id: 0, label: "Un nuevo lenguaje de programación para IA" },
      { id: 1, label: "Un protocolo que permite al LLM conectarse a herramientas externas (BD, APIs, archivos) en tiempo real" },
      { id: 2, label: "Un método de cifrado para datos sensibles" },
      { id: 3, label: "Una técnica de fine-tuning de modelos" },
    ],
    correct: 1,
    explanation: "MCP es el estándar abierto de Anthropic (ahora adoptado por la industria) que permite a los LLMs conectarse directamente a bases de datos, APIs, y herramientas. En lugar de copiar-pegar datos, el modelo accede a la fuente en tiempo real — eliminando alucinaciones y manteniendo datos actualizados.",
  },
];

/* ════════════════════════════ COMPONENT ════════════════════════════ */

export default function Sesion3() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [activeTechnique, setActiveTechnique] = useState<string>("zeroshot");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [workshopTemplate, setWorkshopTemplate] = useState<string>("credit");
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [copiedSystem, setCopiedSystem] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);

  /* Animated counter for hero stats */
  const [heroCount, setHeroCount] = useState(0);
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => { i += 1; setHeroCount(i); if (i >= 6) clearInterval(iv); }, 200);
    return () => clearInterval(iv);
  }, []);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setDisplayedText("");
    const full = WORKSHOP_RESPONSES[workshopTemplate] || WORKSHOP_RESPONSES.credit;
    let i = 0;
    const iv = setInterval(() => {
      i += 4;
      if (i >= full.length) { setDisplayedText(full); setIsGenerating(false); clearInterval(iv); }
      else setDisplayedText(full.slice(0, i));
    }, 10);
  }, [workshopTemplate]);

  const handleTemplateChange = useCallback((key: string) => {
    setWorkshopTemplate(key);
    setDisplayedText("");
  }, []);

  const copyText = useCallback((text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  }, []);

  const currentQ = QUIZ_QUESTIONS[quizIndex];
  const currentTemplate = WORKSHOP_TEMPLATES[workshopTemplate];

  return (
    <div className="min-h-screen bg-[#080C1F]">
      {/* ═══════════════ 1. HERO ═══════════════ */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden">
        <div className="hero-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_40%,rgba(0,229,160,0.07),transparent),radial-gradient(ellipse_40%_50%_at_70%_60%,rgba(91,82,213,0.06),transparent)] pointer-events-none" />

        {/* Orbiting elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none">
          {["R","C","T","F","⛓","M"].map((letter, i) => (
            <div key={i} className="absolute top-1/2 left-1/2 animate-orbit" style={{
              "--orbit-r": `${180 + i * 15}px`,
              "--orbit-t": `${20 + i * 4}s`,
              animationDelay: `${i * -3}s`,
            } as React.CSSProperties}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{
                background: `${PROMPT_LAYERS[i % 4]?.color || "#9B59B6"}20`,
                color: PROMPT_LAYERS[i % 4]?.color || "#9B59B6",
                border: `1px solid ${PROMPT_LAYERS[i % 4]?.color || "#9B59B6"}30`,
              }}>
                {letter}
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-4 animate-fadeUp">
            Módulo 02 &middot; Herramientas &middot; Sesión 3 de 5
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white-f leading-tight mb-6 animate-fadeUp-1">
            Prompt Engineering:{" "}
            <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
              comunicarse con la IA
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 animate-fadeUp-2">
            De prompts genéricos a asistentes especializados.
            6 técnicas, multimodalidad, MCP y prompt chaining para banca de inversión.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fadeUp-3">
            {[
              { val: heroCount >= 1 ? "6" : "—", label: "Técnicas", icon: "◈", color: "#5B52D5" },
              { val: heroCount >= 2 ? "4" : "—", label: "Modalidades", icon: "◉", color: "#E85A1F" },
              { val: heroCount >= 3 ? "8" : "—", label: "MCP Servers", icon: "⚙", color: "#00E5A0" },
              { val: heroCount >= 4 ? "R-C-T-F" : "—", label: "Framework", icon: "◆", color: "#3A7BD5" },
              { val: heroCount >= 5 ? "4" : "—", label: "Templates BTG", icon: "◷", color: "#D4AF4C" },
              { val: heroCount >= 6 ? "80%" : "—", label: "Práctica", icon: "⚡", color: "#22C55E" },
            ].map((s) => (
              <div key={s.label} className="bg-[#151A3A] border border-white/[0.06] rounded-2xl px-5 py-3 min-w-[110px] transition-all hover:scale-105" style={{ borderColor: `${s.color}20` }}>
                <span className="text-lg" style={{ color: s.color }}>{s.icon}</span>
                <p className="text-xl font-bold text-white-f mt-1">{s.val}</p>
                <p className="text-[0.65rem] text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 2. AGENDA ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-12">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-6">Agenda &middot; Sesión 3</p>
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
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-6">Caso de Estudio &middot; Morgan Stanley</p>
          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-cyan/10 to-purple/10 px-8 py-6 border-b border-white/[0.06]">
              <h2 className="text-2xl font-bold text-white-f">16,000 asesores financieros con IA</h2>
              <p className="text-muted mt-1">Cómo Morgan Stanley desplegó un asistente IA para todo su equipo de Wealth Management</p>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                {[
                  { val: "16K", label: "Asesores", sub: "con acceso al asistente IA" },
                  { val: "100K+", label: "Documentos", sub: "research, productos, regulación" },
                  { val: "70%", label: "Adopción", sub: "en los primeros 6 meses" },
                  { val: "3x", label: "Velocidad", sub: "en preparación de reuniones" },
                ].map((m) => (
                  <div key={m.label} className="text-center p-5 bg-[#0D1229] rounded-xl border border-white/[0.04]">
                    <p className="text-2xl font-bold text-cyan">{m.val}</p>
                    <p className="text-white-f font-semibold mt-1 text-sm">{m.label}</p>
                    <p className="text-xs text-muted mt-1">{m.sub}</p>
                  </div>
                ))}
              </div>

              {/* Visual flow */}
              <div className="bg-[#0D1229] rounded-xl p-6 border border-white/[0.04] mb-6">
                <p className="font-mono text-xs text-muted mb-4">Arquitectura del asistente Morgan Stanley:</p>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
                  {[
                    { label: "System Prompt\n(Rol + Guardrails)", color: "#00E5A0", icon: "R" },
                    { label: "Knowledge Base\n(100K+ docs)", color: "#3A7BD5", icon: "C" },
                    { label: "Query del Asesor\n(Pregunta natural)", color: "#5B52D5", icon: "T" },
                    { label: "Templates\n(Formatos estándar)", color: "#E85A1F", icon: "F" },
                    { label: "Respuesta\ncontextualizada", color: "#22C55E", icon: "✓" },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center flex-1 w-full sm:w-auto">
                      <div className="flex-1 rounded-xl p-3 text-center border border-white/[0.06] hover:scale-105 transition-transform" style={{
                        background: `linear-gradient(135deg, ${step.color}15, ${step.color}05)`,
                        borderColor: `${step.color}30`,
                      }}>
                        <span className="text-xl font-bold font-mono" style={{ color: step.color }}>{step.icon}</span>
                        <p className="text-[0.65rem] text-white-f mt-1 font-medium whitespace-pre-line">{step.label}</p>
                      </div>
                      {i < 4 && <span className="text-muted/30 text-xl mx-1 hidden sm:block">→</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4">
                <p className="text-sm text-white-f">
                  <strong className="text-cyan">Lección:</strong> El éxito de Morgan Stanley no fue la tecnología — fue el <strong>prompt engineering</strong>.
                  System prompts con guardrails + templates reutilizables + knowledge base indexada. BTG puede replicar esto con <strong>Claude Projects</strong> hoy, sin desarrollo.
                </p>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 4. R-C-T-F FRAMEWORK ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">Framework &middot; Anatomía de un Prompt</p>
          <h2 className="text-2xl font-bold text-white-f mb-2">R-C-T-F: Las 4 capas de un prompt profesional</h2>
          <p className="text-muted mb-8 max-w-3xl">Todo prompt efectivo tiene 4 componentes. Haz clic en cada capa para ver el contraste entre un prompt amateur y uno profesional.</p>

          {/* Visual prompt flow */}
          <div className="bg-[#0D1229] rounded-2xl p-6 border border-white/[0.04] mb-8">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              {PROMPT_LAYERS.map((layer, i) => (
                <button key={layer.id} onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
                  className={`flex-1 rounded-xl p-5 transition-all cursor-pointer border text-center ${
                    activeLayer === layer.id ? "scale-[1.03] glow-purple" : "hover:scale-[1.02]"
                  }`}
                  style={{
                    background: activeLayer === layer.id ? `${layer.color}20` : `${layer.color}08`,
                    borderColor: activeLayer === layer.id ? `${layer.color}60` : `${layer.color}20`,
                  }}>
                  <div className="w-14 h-14 rounded-xl mx-auto flex items-center justify-center text-2xl font-bold mb-3" style={{
                    background: `${layer.color}25`, color: layer.color,
                  }}>
                    {layer.icon}
                  </div>
                  <p className="font-semibold text-white-f text-sm">{layer.label}</p>
                  <p className="text-[0.6rem] text-muted mt-1">{layer.desc.split(".")[0]}</p>
                  {i < 3 && <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 text-muted/20 text-2xl">→</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          {activeLayer && (() => {
            const layer = PROMPT_LAYERS.find(l => l.id === activeLayer)!;
            return (
              <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-8 animate-fadeUp">
                <h3 className="text-xl font-bold text-white-f mb-6 flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: layer.color }} />
                  {layer.label} — Comparación
                </h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {layer.bad && (
                    <div className="rounded-xl border border-red/20 bg-red/5 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-red" />
                        <p className="font-mono text-xs text-red">PROMPT AMATEUR</p>
                      </div>
                      <p className="text-sm text-muted font-mono bg-[#0D1229] rounded-lg p-3 border border-white/[0.04]">{layer.bad}</p>
                    </div>
                  )}
                  <div className="rounded-xl border border-cyan/20 bg-cyan/5 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan animate-pulse-dot" />
                      <p className="font-mono text-xs text-cyan">PROMPT PROFESIONAL</p>
                    </div>
                    <p className="text-sm text-white-f font-mono whitespace-pre-wrap bg-[#0D1229] rounded-lg p-3 border border-white/[0.04]">{layer.good}</p>
                  </div>
                </div>
                <div className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04]">
                  <p className="font-mono text-xs text-orange mb-1">PRO TIP</p>
                  <p className="text-sm text-muted">{layer.tip}</p>
                </div>
              </div>
            );
          })()}

          {/* Full assembled prompt */}
          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-8 mt-8">
            <p className="font-mono text-xs text-orange mb-4 uppercase tracking-widest">Prompt Completo — Las 4 capas ensambladas</p>
            <div className="space-y-2">
              {PROMPT_LAYERS.map((layer) => (
                <div key={layer.id} className="rounded-xl p-4 border transition-all hover:scale-[1.005]" style={{
                  background: `${layer.color}08`, borderColor: `${layer.color}25`,
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

      {/* ═══════════════ 5. ADVANCED TECHNIQUES ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">Técnicas Avanzadas &middot; Prompt Engineering 2026</p>
          <h2 className="text-2xl font-bold text-white-f mb-2">6 técnicas para resultados profesionales</h2>
          <p className="text-muted mb-8 max-w-3xl">Incluye las técnicas de vanguardia: meta-prompting y prompt chaining. Selecciona una para ver el ejemplo completo.</p>

          {/* Technique selector with effectiveness bars */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {TECHNIQUES.map((t) => (
              <button key={t.id} onClick={() => setActiveTechnique(t.id)}
                className={`rounded-xl p-4 text-left transition-all cursor-pointer border ${
                  activeTechnique === t.id ? "scale-[1.03]" : "border-white/[0.06] bg-[#151A3A] hover:border-white/[0.12]"
                }`}
                style={activeTechnique === t.id ? { background: `${t.color}15`, borderColor: `${t.color}50` } : undefined}>
                <span className="text-2xl font-mono font-bold" style={{ color: t.color }}>{t.icon}</span>
                <p className="text-white-f font-semibold mt-2 text-xs">{t.label}</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex-1 h-1 rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full transition-all" style={{ width: `${t.strength}%`, background: t.color }} />
                  </div>
                  <span className="font-mono text-[0.5rem] text-muted">{t.strength}%</span>
                </div>
              </button>
            ))}
          </div>

          {/* Technique detail */}
          {(() => {
            const t = TECHNIQUES.find(x => x.id === activeTechnique)!;
            return (
              <div className="grid lg:grid-cols-2 gap-6 animate-fadeUp">
                <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                    <p className="font-mono text-xs text-muted">Prompt — {t.label}</p>
                  </div>
                  <p className="text-sm text-muted mb-4">{t.desc}</p>
                  <div className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04] max-h-[400px] overflow-y-auto">
                    <pre className="text-sm text-white-f font-mono whitespace-pre-wrap">{t.prompt}</pre>
                  </div>
                  <div className="mt-3 bg-[#0D1229] rounded-xl p-3 border border-white/[0.04]">
                    <p className="font-mono text-[0.65rem] text-muted"><strong style={{ color: t.color }}>Usar cuando:</strong> {t.when}</p>
                  </div>
                </div>
                <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-cyan animate-pulse-dot" />
                    <p className="font-mono text-xs text-muted">Respuesta del modelo</p>
                  </div>
                  <div className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04] max-h-[500px] overflow-y-auto">
                    <div className="text-sm text-white-f font-mono whitespace-pre-wrap leading-relaxed">{t.response}</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>
      </RevealSection>

      {/* ═══════════════ 6. MULTIMODAL PROMPTING ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">Vanguardia 2026 &middot; Prompting Multimodal</p>
          <h2 className="text-2xl font-bold text-white-f mb-2">
            Más allá del texto: <span className="text-cyan">visión, audio, archivos y código</span>
          </h2>
          <p className="text-muted mb-8 max-w-3xl">En 2026 los LLMs procesan cualquier tipo de input. El prompt ya no es solo texto — es imagen, audio, PDF, Excel, código.</p>

          <div className="grid md:grid-cols-2 gap-6">
            {MULTIMODAL_CAPABILITIES.map((cap) => (
              <div key={cap.id}
                className={`bg-[#151A3A] border rounded-2xl p-6 transition-all cursor-pointer ${
                  activeModal === cap.id ? "glow-cyan" : "border-white/[0.06] hover:border-white/[0.12]"
                }`}
                style={activeModal === cap.id ? { borderColor: `${cap.color}50` } : undefined}
                onClick={() => setActiveModal(activeModal === cap.id ? null : cap.id)}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{
                    background: `${cap.color}20`,
                  }}>
                    {cap.icon}
                  </div>
                  <div>
                    <p className="text-white-f font-semibold">{cap.label}</p>
                    <div className="flex gap-1 mt-1">
                      {cap.models.map((m, i) => (
                        <span key={i} className="text-[0.55rem] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-muted">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted mb-4">{cap.desc}</p>
                {activeModal === cap.id && (
                  <div className="space-y-2 animate-fadeUp">
                    {cap.examples.map((ex, i) => (
                      <div key={i} className="bg-[#0D1229] rounded-lg p-3 border border-white/[0.04] flex items-start gap-2">
                        <span className="text-cyan mt-0.5 shrink-0">→</span>
                        <p className="text-xs text-white-f">{ex}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 7. MCP — MODEL CONTEXT PROTOCOL ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">Revolución 2026 &middot; Model Context Protocol</p>
          <h2 className="text-2xl font-bold text-white-f mb-2">
            MCP: el LLM conectado a <span className="text-cyan">todo</span>
          </h2>
          <p className="text-muted mb-8 max-w-3xl">
            MCP (Anthropic, 2024 — ahora estándar de la industria) permite al LLM acceder directamente a bases de datos, APIs y herramientas.
            En lugar de copiar-pegar datos, el modelo consulta la fuente en tiempo real.
          </p>

          {/* Visual: LLM in center, MCP servers orbiting */}
          <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-8 mb-6">
            <div className="relative mx-auto" style={{ height: "380px", maxWidth: "600px" }}>
              {/* Center node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-2xl bg-gradient-to-br from-purple/30 to-cyan/30 border border-purple/40 flex flex-col items-center justify-center z-10 glow-purple">
                <span className="text-3xl font-bold text-white-f">LLM</span>
                <span className="text-[0.5rem] font-mono text-cyan mt-1">+ MCP Client</span>
              </div>

              {/* Connection lines + server nodes */}
              {MCP_SERVERS.map((server, i) => {
                const angle = (i * 360 / MCP_SERVERS.length) * (Math.PI / 180);
                const r = 150;
                const x = 50 + Math.cos(angle) * (r / 3);
                const y = 50 + Math.sin(angle) * (r / 3);
                return (
                  <div key={i} className="absolute animate-float" style={{
                    left: `${x}%`, top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                    animationDelay: `${i * 0.4}s`,
                  }}>
                    <div className="w-20 h-20 rounded-xl border flex flex-col items-center justify-center text-center p-2 transition-all hover:scale-110" style={{
                      background: `${server.color}12`,
                      borderColor: `${server.color}30`,
                    }}>
                      <span className="text-lg">{server.icon}</span>
                      <p className="text-[0.55rem] font-semibold text-white-f mt-1 leading-tight">{server.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MCP servers grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {MCP_SERVERS.map((server) => (
              <div key={server.name} className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04] hover:border-white/[0.08] transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{server.icon}</span>
                  <p className="text-white-f font-semibold text-sm">{server.name}</p>
                </div>
                <p className="text-[0.65rem] text-muted">{server.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-cyan/5 border border-cyan/20 rounded-xl p-4">
            <p className="text-sm text-white-f">
              <strong className="text-cyan">Para BTG:</strong> Con MCP, un analista puede preguntar <em>&quot;¿Cuál fue el volumen de operaciones de renta fija esta semana?&quot;</em>
              y el LLM consulta directamente la base de datos interna, sin que el analista toque SQL ni exporte nada. Datos reales, en tiempo real, sin alucinaciones.
            </p>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 8. HALLUCINATIONS ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">Riesgo Crítico &middot; Alucinaciones</p>
          <h2 className="text-2xl font-bold text-white-f mb-8">4 tipos de alucinación en contexto financiero</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {HALLUCINATION_TYPES.map((h) => (
              <div key={h.type} className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">{h.icon}</span>
                  <p className="font-semibold text-white-f text-sm">{h.type}</p>
                  <span className="ml-auto px-2 py-0.5 rounded text-[0.55rem] font-mono" style={{ background: `${h.color}20`, color: h.color }}>PELIGRO</span>
                </div>
                <div className="bg-red/5 border border-red/15 rounded-lg p-3 mb-3">
                  <p className="text-xs text-muted italic font-mono">{h.example}</p>
                </div>
                <p className="text-xs text-muted mb-3">{h.danger}</p>
                <div className="bg-cyan/5 border border-cyan/15 rounded-lg p-3">
                  <p className="text-xs text-white-f"><strong className="text-cyan">Fix:</strong> {h.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 9. WORKSHOP ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">Taller Práctico &middot; Asistentes para BTG</p>
          <h2 className="text-2xl font-bold text-white-f mb-2">Construye un asistente especializado</h2>
          <p className="text-muted mb-8 max-w-3xl">Selecciona un template, revisa system + user prompt, genera la respuesta. Copia los prompts para probarlos en Claude, ChatGPT o Gemini.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {Object.entries(WORKSHOP_TEMPLATES).map(([key, t]) => (
              <button key={key} onClick={() => handleTemplateChange(key)}
                className={`rounded-xl p-4 text-center transition-all cursor-pointer border ${
                  workshopTemplate === key ? "scale-[1.02]" : "border-white/[0.06] bg-[#151A3A] hover:border-white/[0.12]"
                }`}
                style={workshopTemplate === key ? { background: `${t.color}15`, borderColor: `${t.color}50` } : undefined}>
                <span className="text-xl">{t.icon}</span>
                <p className="font-semibold text-sm mt-1" style={{ color: workshopTemplate === key ? t.color : undefined }}>{t.label}</p>
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-xs text-muted">System Prompt</p>
                  <button onClick={() => copyText(currentTemplate.system, setCopiedSystem)}
                    className="px-3 py-1 rounded-lg text-xs font-mono border border-white/[0.08] text-muted hover:text-white-f transition-all cursor-pointer">
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
                  <button onClick={() => copyText(currentTemplate.user, setCopiedUser)}
                    className="px-3 py-1 rounded-lg text-xs font-mono border border-white/[0.08] text-muted hover:text-white-f transition-all cursor-pointer">
                    {copiedUser ? "Copiado ✓" : "Copiar"}
                  </button>
                </div>
                <div className="bg-[#0D1229] rounded-xl p-4 border border-white/[0.04] max-h-[250px] overflow-y-auto">
                  <p className="text-sm text-white-f font-mono whitespace-pre-wrap">{currentTemplate.user}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse-dot" />
                <p className="font-mono text-xs text-muted">Respuesta simulada &middot; Claude 4.6 Opus</p>
              </div>
              <div className="flex-1 bg-[#0D1229] rounded-xl p-6 border border-white/[0.04] overflow-y-auto max-h-[450px] min-h-[300px]">
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
              <button onClick={handleGenerate} disabled={isGenerating}
                className={`mt-4 w-full py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                  isGenerating ? "bg-purple/30 text-muted cursor-wait" : "bg-gradient-to-r from-purple to-purple-dark text-white-f hover:shadow-lg hover:shadow-purple/20 hover:scale-[1.01]"
                }`}>
                {isGenerating ? "Generando..." : "Generar respuesta"}
              </button>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════ 10. QUIZ + CHALLENGE ═══════════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-16 pb-32">
          <p className="font-mono text-[0.72rem] text-orange uppercase tracking-widest mb-2">Reto &middot; Prompt Battle</p>
          <h2 className="text-2xl font-bold text-white-f mb-8">Demuestra tu dominio de prompts</h2>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[
                { n: 1, title: "Elige un escenario BTG", desc: "IB, WM, AM, S&T, o Compliance. Construye el prompt perfecto con R-C-T-F." },
                { n: 2, title: "Aplica una técnica avanzada", desc: "Usa Chain-of-Thought, Meta-Prompting o Prompt Chaining. Justifica tu elección." },
                { n: 3, title: "Prueba en 2 modelos", desc: "Claude vs ChatGPT. Compara calidad, estructura y precisión." },
                { n: 4, title: "Presenta tu mejor prompt", desc: "Prompt + output + justificación. El mejor prompt gana reconocimiento." },
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

            <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-xs text-orange">QUIZ — {quizIndex + 1}/{QUIZ_QUESTIONS.length}</p>
                <div className="flex gap-1">
                  {QUIZ_QUESTIONS.map((_, i) => (
                    <button key={i} onClick={() => { setQuizIndex(i); setQuizAnswer(null); }}
                      className={`w-6 h-6 rounded-full text-xs font-mono cursor-pointer border ${
                        quizIndex === i ? "border-purple bg-purple/20 text-white-f" : "border-white/[0.06] text-muted"
                      }`}>{i + 1}</button>
                  ))}
                </div>
              </div>
              <p className="text-white-f font-semibold mb-4 text-sm">{currentQ.question}</p>
              <div className="space-y-2">
                {currentQ.options.map((opt) => {
                  const isCorrect = opt.id === currentQ.correct;
                  const isSelected = quizAnswer === opt.id;
                  return (
                    <button key={opt.id} onClick={() => setQuizAnswer(opt.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs transition-all cursor-pointer border ${
                        isSelected ? isCorrect ? "border-cyan bg-cyan/10 text-cyan" : "border-red bg-red/10 text-red"
                          : "border-white/[0.06] text-muted hover:border-white/[0.12]"
                      }`}>
                      {opt.label}
                      {isSelected && isCorrect && <span className="ml-2">✓</span>}
                      {isSelected && !isCorrect && <span className="ml-2">✕</span>}
                    </button>
                  );
                })}
              </div>
              {quizAnswer === currentQ.correct && (
                <div className="mt-4 bg-cyan/5 border border-cyan/20 rounded-xl p-4 animate-fadeUp">
                  <p className="text-xs text-white-f">{currentQ.explanation}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </RevealSection>
    </div>
  );
}
