"use client";

import { useEffect, useMemo, useState } from "react";
import RevealSection from "@/components/RevealSection";

/* ════════════════════════════ DATA ════════════════════════════ */

const AGENDA = [
  { time: "0:00–0:10", label: "Por qué la mayoría de proyectos IA en banca no llegan a producción", color: "#DC2626" },
  { time: "0:10–0:35", label: "Jobs to be Done · Christensen · Ulwick · Switch", color: "#00E5A0" },
  { time: "0:35–0:55", label: "Diseño de producto · Double Diamond aplicado a IA", color: "#5B52D5" },
  { time: "0:55–1:30", label: "Canvas Proyecto IA · BTG — los 10 bloques", color: "#D4AF4C" },
  { time: "1:30–1:50", label: "4 casos BTG completos · IB · WM · S&T · Compliance", color: "#0F6CBD" },
  { time: "1:50–2:00", label: "Antipatrones · checklist Go/No-go · plantilla", color: "#E85A1F" },
];

const OBJETIVOS = [
  { icon: "◎", title: "Hablas JTBD con fluidez", detail: "Distingues los 3 frameworks (Christensen, Ulwick, Switch) y sabes cuándo usar cada uno." },
  { icon: "◩", title: "Diseñas con Double Diamond", detail: "Pasas un proyecto por Discover → Define → Develop → Deliver sin saltarse fases." },
  { icon: "▦", title: "Llenas el Canvas BTG", detail: "Los 10 bloques se vuelven tu lengua materna · cualquier idea pasa por ahí antes de pedir aprobación." },
  { icon: "✓", title: "Decides Go/No-go con criterio", detail: "Conoces el checklist de 10 puntos · sabes cuándo matar una idea antes de gastar el primer USD." },
  { icon: "✦", title: "Reconoces antipatrones", detail: "Identificas los 8 errores típicos de proyectos IA en banca antes de comerlos en carne propia." },
];

/* ═══ POR QUÉ ═══ */
const POR_QUE = [
  {
    n: "01",
    title: "60% nunca llegan a producción",
    detail: "Estudio Gartner abr-2026: 60% de proyectos IA en banca corporativa pasan piloto pero nunca operan a escala. Causa #1: nadie definió bien el job · solucionaron lo que era fácil de hacer, no lo que importaba.",
    tag: "Gartner 2026",
    color: "#DC2626",
  },
  {
    n: "02",
    title: "El proyecto medio cuesta 4× lo presupuestado",
    detail: "BCG GenAI Banking Index abr-2026: el costo promedio supera 4× lo planeado y el time-to-value triplica el plan. Razón estructural: scope creep por no haber definido outcomes medibles desde el job.",
    tag: "BCG 2026",
    color: "#E85A1F",
  },
  {
    n: "03",
    title: "Adopción interna < 25%",
    detail: "Cuando se mide adopción real (no logins, sino ejecuciones que cambian una decisión), banca corporativa promedia 22%. La gente sigue haciendo las cosas como antes porque la herramienta no resuelve SU job, resuelve uno parecido.",
    tag: "McKinsey 2026",
    color: "#7C3AED",
  },
  {
    n: "04",
    title: "El ROI esperado se reescribe a posteriori",
    detail: "Habit común: el caso de negocio inicial se ajusta al output que se logró, no al revés. Esto destruye la capacidad organizacional de aprender de qué funciona y qué no — el portafolio de proyectos no se sabe leer.",
    tag: "Patrón observado",
    color: "#D4AF4C",
  },
];

/* ═══ JTBD ═══ */
const JTBD_FRAMEWORKS = [
  {
    id: "christensen",
    name: "Christensen · Job-Centric",
    icon: "🎯",
    color: "#00E5A0",
    one: "El usuario 'contrata' una solución para hacer un job. El job no es lo que la herramienta hace, es lo que el usuario está intentando lograr.",
    fmt: "Cuando [situación], quiero [motivación], para que [resultado esperado].",
    example: "Cuando llega un emisor nuevo a las 4 PM y necesito decisión a las 9 AM, quiero un primer dictamen estructurado, para que el comité abra la conversación con base sólida y no improvisando.",
    when: "Para descubrir necesidades latentes · validar oportunidades · pivotear features que no se usan.",
    pitfall: "Caer en 'jobs' demasiado abstractos ('quiero ser productivo') que no permiten medir éxito.",
  },
  {
    id: "ulwick",
    name: "Ulwick · Outcome-Driven",
    icon: "📐",
    color: "#5B52D5",
    one: "Cada job se descompone en 50-150 outcome statements medibles. La oportunidad está donde un outcome es importante y está mal servido.",
    fmt: "Minimizar/Maximizar [unidad de medida] de [verbo] [objeto] [contextualizadores opcionales].",
    example: "Minimizar el tiempo necesario para identificar covenants restrictivos en el prospecto de un emisor sin perderse cláusulas materiales.",
    when: "Para priorizar features · cuantificar oportunidades · diseñar métricas de éxito antes de construir.",
    pitfall: "Tomar atajos y escribir 5 outcomes en lugar de 50 — pierdes la riqueza del job.",
  },
  {
    id: "switch",
    name: "Switch · Forces of Progress",
    icon: "↔",
    color: "#D4AF4C",
    one: "El cambio se decide por 4 fuerzas: 2 que empujan hacia lo nuevo (push + pull) y 2 que retienen lo viejo (anxiety + habit).",
    fmt: "Mapa de 4 cuadrantes: PUSH (lo que duele del status quo) · PULL (lo que atrae de lo nuevo) · ANXIETY (miedos del cambio) · HABIT (lo que ya funciona y cuesta dejar).",
    example: "PUSH: el analista pierde 4h/día en tareas operativas · PULL: agente IA promete 30 min · ANXIETY: '¿y si el comité se entera que usé IA?' · HABIT: ya tengo plantillas de Excel que funcionan.",
    when: "Para entender por qué un piloto exitoso técnicamente no se adopta · diseñar onboarding y change management.",
    pitfall: "Subestimar HABIT — la mejora técnica no vence la fricción del cambio sin diseñar incentivos.",
  },
];

const JTBD_BTG_EJEMPLOS = [
  {
    role: "Banker IB",
    job: "Cuando llega un teaser nuevo de un sector que conozco poco, quiero un brief contextual de 5 páginas con peers, múltiplos y temas de negociación, para que pueda ir a la primera reunión hablando el lenguaje del cliente.",
    color: "#0F6CBD",
  },
  {
    role: "Asesor WM",
    job: "Cuando un cliente me pide rebalanceo después de movimientos fuertes del mercado, quiero proyectar 3 escenarios alineados a su perfil, para que la conversación sea sobre trade-offs y no sobre cifras que tengo que rearmar.",
    color: "#742774",
  },
  {
    role: "Trader S&T",
    job: "Cuando entra un flujo grande de un cliente institucional fuera del horario habitual, quiero verificar rápidamente impacto y compliance, para que pueda responder con quote en menos de 90 segundos sin riesgo regulatorio.",
    color: "#E85A1F",
  },
  {
    role: "Compliance",
    job: "Cuando el equipo me trae 30 contrapartes nuevas para revisar la misma semana, quiero priorizar las 5 que tienen señales de riesgo, para que mi tiempo de revisión humana se gaste donde sí cambia decisiones.",
    color: "#DC2626",
  },
];

/* ═══ DOUBLE DIAMOND ═══ */
const DD_FASES = [
  {
    id: "discover",
    name: "Discover",
    diamond: "Descubrimiento",
    icon: "🔍",
    color: "#00E5A0",
    do: "Entrevistar al job-doer · sombras de un día · mapear forces of progress · revisar herramientas actuales (Excel, correo, sistemas).",
    dont: "Saltar a 'tengo una idea de IA' · entrevistar al jefe en vez del que hace el trabajo · diseñar features sin observar.",
    output: "Job statement validado · 5-8 entrevistas · mapa de outcomes · galería de 'momentos de dolor' con video o foto.",
    days: "5-7 días",
  },
  {
    id: "define",
    name: "Define",
    diamond: "Definición",
    icon: "🎯",
    color: "#5B52D5",
    do: "Sintetizar outcomes · priorizar oportunidades · escribir hipótesis testeable · definir métrica de éxito ANTES de construir.",
    dont: "Saltarse la priorización · empezar con tecnología · escribir métricas vagas tipo 'mejorar la experiencia'.",
    output: "1 problema bien definido · 1 hipótesis · 3 métricas (1 leading, 2 lagging) · diagrama de la solución en 1 servilleta.",
    days: "3-5 días",
  },
  {
    id: "develop",
    name: "Develop",
    diamond: "Desarrollo",
    icon: "🛠",
    color: "#D4AF4C",
    do: "Construir el MVP más chico que prueba la hipótesis · 2 semanas máximo · usar lo que ya está pagado en BTG (Power Platform, Copilot M365).",
    dont: "Construir la versión 'completa' · meter 5 modelos diferentes · hacer infra cuando una Sheet alcanza para validar.",
    output: "MVP funcional · 5 usuarios reales lo usaron · datos de uso · qué falló · qué quieren más.",
    days: "10-14 días",
  },
  {
    id: "deliver",
    name: "Deliver",
    diamond: "Entrega",
    icon: "🚀",
    color: "#E85A1F",
    do: "Decidir Go/No-go con datos · si Go: rollout escalonado con champion + métricas continuas · si No-go: documentar aprendizajes.",
    dont: "Lanzar 'a todo el banco' · ignorar métricas · tratar el rollout como evento en lugar de proceso.",
    output: "Decisión documentada · si Go: plan de adopción 3 meses · si No-go: post-mortem de 1 página.",
    days: "Continuo",
  },
];

/* ═══ CANVAS BTG · 10 BLOQUES ═══ */
const CANVAS_BLOQUES = [
  {
    n: 1,
    title: "Job principal",
    icon: "🎯",
    color: "#00E5A0",
    prompt: "Cuando [situación], quiero [motivación], para que [resultado].",
    why: "Si no puedes escribirlo en una frase, no entiendes el job · estás resolviendo síntomas.",
    example: "Cuando recibo un teaser de un sector nuevo, quiero un brief contextual en 5 páginas, para llegar a la primera reunión con vocabulario del cliente.",
    danger: "'Productividad general' o 'mejorar workflows' no son jobs · son síntomas.",
  },
  {
    n: 2,
    title: "Job-doer",
    icon: "👤",
    color: "#5B52D5",
    prompt: "Rol específico, área, seniority, % de tiempo en el job.",
    why: "Una solución diseñada para 'todos' termina sirviéndole a nadie. El job-doer concreto te ayuda a priorizar.",
    example: "Analyst-Associate de IB, 20-30 años, 25% del tiempo en preparación de reuniones nuevas.",
    danger: "'Todo el equipo IB' es demasiado amplio · diferentes seniorities tienen jobs distintos.",
  },
  {
    n: 3,
    title: "Outcomes medibles",
    icon: "📐",
    color: "#3A7BD5",
    prompt: "5-10 outcomes en formato Ulwick: minimizar/maximizar [unidad] de [verbo] [objeto].",
    why: "Sin outcomes medibles, el éxito es opinión. Y la opinión cambia según quién apruebe el proyecto.",
    example: "Minimizar tiempo de preparación previa a primera reunión · Minimizar errores de información de peers · Maximizar % de reuniones donde el cliente percibe expertise.",
    danger: "Outcomes sin unidad de medida ('mejor calidad') no son outcomes, son aspiraciones.",
  },
  {
    n: 4,
    title: "Forces of Progress",
    icon: "↔",
    color: "#D4AF4C",
    prompt: "Mapa de 4 cuadrantes: Push (dolor actual) · Pull (atractor del cambio) · Anxiety (miedo) · Habit (resistencia).",
    why: "Mapeas adopción antes de construir. Sin esto, una solución técnicamente perfecta puede no usarse.",
    example: "Push: 4h/día en research manual · Pull: brief de calidad en 10 min · Anxiety: ¿se notará que usé IA? · Habit: ya tengo mis carpetas de research.",
    danger: "Olvidarte de Habit · es la fuerza más subestimada y la que mata más pilotos.",
  },
  {
    n: 5,
    title: "Restricciones BTG",
    icon: "🛡",
    color: "#DC2626",
    prompt: "Clasificación de data (P-I/II/III/IV) · regulación aplicable (SFC, Habeas Data) · licencias disponibles · perímetro tecnológico.",
    why: "Antes de pensar 'qué construir' tienes que saber 'qué te dejan construir'. Restricciones no son enemigos, son guardrails.",
    example: "Data del cliente: P-III · regulación: Ley 1581 + SFC CBJ Cap. IV · licencias: M365 E5 + Power Platform + ADA · perímetro: tenant Azure BTG.",
    danger: "Diseñar primero y validar restricciones después · te toca rediseñar el 80% del proyecto.",
  },
  {
    n: 6,
    title: "Hipótesis IA",
    icon: "💡",
    color: "#7C3AED",
    prompt: "Si [acción IA], entonces [outcome del bloque 3]. Cuál herramienta del stack BTG lo materializa.",
    why: "Una hipótesis no es 'usar IA' · es una predicción específica que puedes probar.",
    example: "Si un agente Copilot Studio con knowledge curado de Bloomberg + research interno genera un brief de 5pp en <10 min, entonces el tiempo de prep cae de 4h a 30 min sin pérdida de calidad percibida.",
    danger: "Hipótesis sin métrica · 'mejorará el research' no es hipótesis testeable.",
  },
  {
    n: 7,
    title: "MVP de 2 semanas",
    icon: "🚧",
    color: "#E85A1F",
    prompt: "La versión más pequeña que prueba la hipótesis. ¿Qué construyes en 10 días con 2 personas?",
    why: "Si tu MVP toma > 2 semanas, no es MVP · es proyecto. Probabilidad de aprendizaje cae con el tiempo invertido.",
    example: "Power App canvas + Copilot Studio agente + knowledge SharePoint con 50 reportes recientes. 5 brokers reales lo usan 1 semana · medimos tiempo de prep y NPS.",
    danger: "Querer 'que funcione todo' antes de exponerlo a un usuario · perfeccionismo disfrazado.",
  },
  {
    n: 8,
    title: "Métricas de éxito",
    icon: "📊",
    color: "#0EA5E9",
    prompt: "1 métrica leading (cambia rápido) · 2 lagging (cambian en 30-60 días) · cómo se miden cada una.",
    why: "Las métricas se diseñan ANTES de construir, no después. Si las defines después, las acomodas a tu output.",
    example: "Leading: % de bankers que usan el agente al menos 3 veces/semana. Lagging: tiempo medio de prep · % reuniones con feedback positivo del cliente.",
    danger: "Métricas vanity (uses, logins) sin métricas de cambio de comportamiento o resultado.",
  },
  {
    n: 9,
    title: "Riesgos IA específicos",
    icon: "⚠",
    color: "#F59E0B",
    prompt: "De los modos de falla del lab S7, cuáles aplican aquí. Mitigación concreta para cada uno.",
    why: "Cada caso IA tiene riesgos distintos. No es una checklist genérica · es por proyecto.",
    example: "Alucinación de cifras (mitigación: grounding obligatorio) · Sycophancy en aprobaciones (mitigación: humano final) · Prompt injection vía teasers externos (mitigación: sanitización Docling).",
    danger: "Marcar 'todos los riesgos aplican' · diluye la atención · prioriza los 2-3 que de verdad pueden romper el caso.",
  },
  {
    n: 10,
    title: "Decisión Go/No-go",
    icon: "🚦",
    color: "#22C55E",
    prompt: "Criterios CUANTITATIVOS para Go (umbral mínimo de outcomes) y CUALITATIVOS para No-go (red flags).",
    why: "Decidir si seguir invirtiendo no debe depender del humor del comité · debe ser un proceso predefinido.",
    example: "GO si: ≥ 4/5 bankers vuelven a usarlo sin recordatorio + tiempo de prep cae ≥ 50%. NO-GO si: cualquier alucinación material en cifras de comité, o adopción < 30% en semana 2.",
    danger: "Definir solo criterios de Go · sin red flags claros, los proyectos se prolongan eternamente.",
  },
];

/* ═══ CASOS BTG COMPLETOS ═══ */
const CASOS = [
  {
    id: "ib",
    title: "Brief contextual de emisor · IB",
    icon: "🏢",
    color: "#0F6CBD",
    job: "Cuando recibo un teaser de un sector nuevo, quiero un brief de 5 páginas con peers, múltiplos y temas de negociación, para llegar a la primera reunión hablando como del cliente.",
    doer: "Analyst-Associate IB · 25% tiempo en prep nueva · 12-14 reuniones nuevas/mes",
    outcomes: [
      "Min tiempo de prep previo a primera reunión",
      "Min errores de identificación de peers comparables",
      "Max % reuniones donde cliente percibe expertise",
    ],
    forces: { push: "4h/día en research manual fragmentado", pull: "Brief de calidad en 10 min", anxiety: "¿se notará que es IA?", habit: "Carpetas de research por sector" },
    constraints: "Data interna P-II · Bloomberg via licencia · regulación Chinese Wall · stack: Power Platform + Copilot Studio + ADA",
    hypothesis: "Si Copilot Studio + knowledge Bloomberg + research interno genera el brief en <10 min, prep baja de 4h a 30 min sin pérdida de calidad.",
    mvp: "Canvas Power App + Copilot Studio · 50 reportes en knowledge · 5 analysts lo usan 2 semanas",
    metrics: "Leading: uso ≥ 3 veces/sem · Lagging: tiempo prep · NPS bankers",
    risks: "Alucinación de múltiplos (grounding obligatorio) · sesgo Chinese Wall (knowledge segmentado) · prompt injection en teaser PDF (Docling)",
    decision: "GO si ≥ 4/5 vuelven sin recordatorio + tiempo cae ≥ 50% · NO-GO si alucinación material o adopción < 30% sem 2",
  },
  {
    id: "wm",
    title: "Rebalanceo escenarios · WM",
    icon: "💼",
    color: "#742774",
    job: "Cuando el cliente pide rebalanceo tras movimientos fuertes, quiero proyectar 3 escenarios alineados a su perfil, para que la conversación sea sobre trade-offs y no sobre rearmar cifras.",
    doer: "Asesor WM Senior · 80-150 clientes · 8-12 conversaciones de rebalanceo/mes en períodos volátiles",
    outcomes: [
      "Min tiempo de generación de escenarios",
      "Max % de conversaciones que cierran con decisión en la primera reunión",
      "Min errores de proyección vs límites de riesgo del cliente",
    ],
    forces: { push: "Excel de rebalanceo toma 2h por cliente", pull: "3 escenarios listos en 5 min", anxiety: "Cliente puede notar que es estandarizado", habit: "Plantilla Excel propia perfeccionada por años" },
    constraints: "Data del cliente P-III · perfil de riesgo en Dataverse · cumplimiento ICT 4 · stack: Power Apps + AI Builder + Power BI",
    hypothesis: "Si una Canvas App genera 3 escenarios desde el perfil + holdings actuales + supuestos macro en <5 min, las conversaciones cierran 30% más rápido.",
    mvp: "Power App con cálculo en Excel Online + Power BI embebido · 8 asesores · 4 semanas",
    metrics: "Leading: tiempo de generación · Lagging: % cierre primera reunión · NPS cliente",
    risks: "Aritmética financiera frágil (oráculo Excel) · sycophancy en escenario favorito (3 escenarios obligatorios) · privacidad cross-cliente (RBAC en Dataverse)",
    decision: "GO si tiempo cae ≥ 60% + cierre primera reunión sube ≥ 15% · NO-GO si ≥ 2 errores materiales en proyecciones",
  },
  {
    id: "snt",
    title: "Quote rápido fuera de horario · S&T",
    icon: "⚡",
    color: "#E85A1F",
    job: "Cuando entra un flujo grande institucional fuera de horario, quiero verificar impacto + compliance + dar quote en <90s, para responder antes que la competencia sin riesgo regulatorio.",
    doer: "Trader senior · cobertura cross-asset · 4-6 flujos fuera de horario por semana",
    outcomes: [
      "Min tiempo de respuesta al cliente con quote",
      "Min errores de validación regulatoria (límites, listas)",
      "Max % flujos fuera de horario capturados vs perdidos",
    ],
    forces: { push: "Verificación manual toma 5-10 min · cliente espera", pull: "Quote en 90s con todos los checks ok", anxiety: "Si me equivoco con OFAC me cae compliance", habit: "Flujo: WhatsApp con compliance + Excel de límites" },
    constraints: "Data P-III · listas OFAC/Clinton · límites internos · regulación SFC · stack: Power Automate + Custom Connector + alertas Teams",
    hypothesis: "Si Power Automate valida límites + listas + impacto VaR en paralelo y publica resultado en Teams, time-to-quote baja a <90s.",
    mvp: "Cloud flow + Custom Connector a sistema interno de límites + AI Builder text classification para flagging · 3 traders · 2 semanas",
    metrics: "Leading: tiempo de validación · Lagging: % flujos capturados · 0 violaciones regulatorias",
    risks: "Falso positivo OFAC (matching estricto + 1 reviewer humano si flag) · privilegio escalado del agente (sandbox sin tool de ejecutar trade) · audit trail (logs inmutables)",
    decision: "GO si tiempo de validación < 60s + 0 violaciones · NO-GO si cualquier violación regulatoria o false negative en OFAC",
  },
  {
    id: "compliance",
    title: "Triage de contrapartes · Compliance",
    icon: "⚖",
    color: "#DC2626",
    job: "Cuando el equipo trae 30 contrapartes nuevas en una semana, quiero priorizar las 5 con señales de riesgo, para gastar mi tiempo de revisión humana donde sí cambia decisiones.",
    doer: "Oficial de Cumplimiento · 25-35 nuevas contrapartes/semana en pico · 60-80% del tiempo en revisiones rutinarias",
    outcomes: [
      "Max % de tiempo humano gastado en casos de alto riesgo",
      "Min false negatives (riesgos no detectados)",
      "Min tiempo de turnaround de revisión por contraparte",
    ],
    forces: { push: "Cuello de botella · backlog crece en pico", pull: "Revisar 5 críticas en lugar de 30 rutinarias", anxiety: "Si la IA filtra mal, soy yo quien firma", habit: "Hoja de revisión con 18 campos manual" },
    constraints: "Data P-IV (PII de directivos) · Habeas Data · CBJ Cap. IV · auditoría SARLAFT · stack: AI Builder text classification + Power Automate + revisión humana obligatoria",
    hypothesis: "Si AI Builder clasifica contrapartes en 4 buckets (rojo/amarillo/verde/auto-aprobable) basado en señales públicas + listas, el humano se concentra en rojo/amarillo y procesa 3× más casos.",
    mvp: "AI Builder Text Classification entrenado con histórico de últimos 6 meses · Power Automate orquesta · 1 oficial 4 semanas",
    metrics: "Leading: % tiempo en casos rojo/amarillo · Lagging: false negatives en auditoría trimestral",
    risks: "Sesgo en clasificación (revisión obligatoria + audit muestreo aleatorio 10%) · alucinación en racional (knowledge curado, no generación libre) · Habeas Data (anonimización en logs)",
    decision: "GO si % tiempo en alto riesgo > 70% + false negatives = 0 en muestra · NO-GO si false negative material en auditoría",
  },
];

/* ═══ ANTIPATRONES ═══ */
const ANTIPATRONES = [
  { n: 1, name: "Solución busca problema", desc: "'Tengo un caso de uso para Copilot Studio' · empezar por la herramienta y forzar un job que la justifique. Cuesta 6 meses descubrir que nadie lo usa.", color: "#DC2626" },
  { n: 2, name: "Job demasiado amplio", desc: "'Mejorar la productividad' no es un job. Es síntoma. Sin un job concreto y medible, no hay forma de saber si ganaste.", color: "#E85A1F" },
  { n: 3, name: "Saltarse Discover", desc: "Brincar a Define con suposiciones · sin entrevistar al job-doer real. La hipótesis sale del primer cliente real que te diga 'eso no es lo que necesito'.", color: "#F59E0B" },
  { n: 4, name: "MVP que no es MVP", desc: "Piloto de 4 meses con 8 features no es MVP. Es proyecto. Si no expones algo a un usuario en 2 semanas, perdiste el juego.", color: "#D4AF4C" },
  { n: 5, name: "Métrica diseñada después", desc: "Construir, lanzar, y luego buscar 'qué métrica nos hace ver bien'. Imposible aprender sistémicamente del portafolio si las métricas se acomodan post-hoc.", color: "#7C3AED" },
  { n: 6, name: "Ignorar Habit", desc: "'Es obviamente mejor' — no importa, el usuario tiene un flujo que ya le funciona. Sin diseñar el switch (incentivos, champions, momentum), Habit gana.", color: "#0EA5E9" },
  { n: 7, name: "Riesgos genéricos", desc: "Marcar todos los riesgos del checklist sin priorizar. Diluye la atención. Mejor: los 2-3 riesgos materiales para ESTE caso · con mitigación concreta.", color: "#3A7BD5" },
  { n: 8, name: "Sin red flag de No-go", desc: "Solo definir criterios de éxito · nunca de cancelación. Resultado: proyectos zombi que nadie mata aunque no funcionen.", color: "#22C55E" },
];

/* ═══ CHECKLIST GO/NO-GO ═══ */
const CHECKLIST = [
  "Job statement en formato Christensen escrito en 1 frase",
  "Job-doer concreto con rol, área y % de tiempo en el job",
  "≥ 5 outcomes Ulwick con unidad de medida explícita",
  "Mapa Forces of Progress con los 4 cuadrantes llenos",
  "Restricciones BTG identificadas: P-level, regulación, licencias, perímetro",
  "Hipótesis IA en formato 'si X entonces Y' con métrica",
  "MVP construible en ≤ 2 semanas con 2 personas",
  "1 métrica leading + 2 lagging con método de medición definido",
  "≥ 3 riesgos IA específicos con mitigación concreta",
  "Criterios cuantitativos de Go + red flags cualitativos de No-go",
];

/* ════════════════════════════ COMPONENT ════════════════════════════ */

export default function SesionPlus() {
  const [activeFW, setActiveFW] = useState<string>("christensen");
  const currentFW = useMemo(() => JTBD_FRAMEWORKS.find((f) => f.id === activeFW)!, [activeFW]);

  const [activeFase, setActiveFase] = useState<string>("discover");
  const currentFase = useMemo(() => DD_FASES.find((f) => f.id === activeFase)!, [activeFase]);

  const [activeBloque, setActiveBloque] = useState(0);
  const currentBloque = CANVAS_BLOQUES[activeBloque];

  const [activeCaso, setActiveCaso] = useState<string>("ib");
  const currentCaso = useMemo(() => CASOS.find((c) => c.id === activeCaso)!, [activeCaso]);

  const [checked, setChecked] = useState<Set<number>>(new Set());
  const toggleCheck = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  // JTBD interactive builder
  const [situ, setSitu] = useState("");
  const [moti, setMoti] = useState("");
  const [resu, setResu] = useState("");

  const [heroN, setHeroN] = useState(0);
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => { i++; setHeroN(i); if (i >= 6) clearInterval(iv); }, 200);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen bg-[#080C1F]">
      {/* ═══════════ 1. HERO ═══════════ */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden">
        <div className="hero-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_25%_50%,rgba(0,229,160,0.10),transparent),radial-gradient(ellipse_40%_50%_at_75%_60%,rgba(212,175,76,0.08),transparent)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="font-mono text-[0.6rem] uppercase tracking-widest px-3 py-1 rounded-full bg-gradient-to-r from-[#00E5A0]/20 to-[#D4AF4C]/20 border border-[#00E5A0]/40 text-[#00E5A0]">
              Sesión PLUS · transversal
            </span>
            <span className="font-mono text-[0.6rem] text-muted">complementaria a M01-M05</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white-f leading-tight mb-6 animate-fadeUp-1">
            <span className="text-white-f">Marco para definir</span>{" "}
            <span className="bg-gradient-to-r from-[#00E5A0] via-[#5B52D5] to-[#D4AF4C] bg-clip-text text-transparent">proyectos IA en BTG</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 animate-fadeUp-2">
            Jobs to be Done + Diseño de producto + un canvas propio de 10 bloques. La diferencia entre ideas que mueren en piloto y proyectos que cambian la operación está en cómo los pensaste el primer día.
          </p>

          <div className="flex flex-wrap justify-center gap-3 animate-fadeUp-3">
            {[
              { val: heroN >= 1 ? "3" : "—", label: "Frameworks JTBD", icon: "◎", color: "#00E5A0" },
              { val: heroN >= 2 ? "4" : "—", label: "Fases Double Diamond", icon: "◇", color: "#5B52D5" },
              { val: heroN >= 3 ? "10" : "—", label: "Bloques del Canvas BTG", icon: "▦", color: "#D4AF4C" },
              { val: heroN >= 4 ? "4" : "—", label: "Casos completos", icon: "🏦", color: "#0F6CBD" },
              { val: heroN >= 5 ? "8" : "—", label: "Antipatrones", icon: "⚠", color: "#DC2626" },
              { val: heroN >= 6 ? "10" : "—", label: "Checklist Go/No-go", icon: "✓", color: "#22C55E" },
            ].map((s) => (
              <div key={s.label} className="bg-[#151A3A] border rounded-2xl px-4 py-3 min-w-[110px] transition-all hover:scale-105" style={{ borderColor: `${s.color}25` }}>
                <span className="text-lg" style={{ color: s.color }}>{s.icon}</span>
                <p className="text-xl font-bold text-white-f mt-1">{s.val}</p>
                <p className="text-[0.6rem] text-muted">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[0.6rem] font-mono text-muted mt-4 opacity-60">* Frameworks: Christensen (HBR 2016) · Ulwick (ODI Strategyn) · Switch (Heath 2018) · Double Diamond (Design Council) · Datos a jul-2026</p>
        </div>
      </section>

      {/* ═══════════ 2. AGENDA ═══════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-12">
          <p className="font-mono text-[0.72rem] text-[#00E5A0] uppercase tracking-widest mb-6">Agenda · Sesión PLUS</p>
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

      {/* ═══════════ 3. OBJETIVOS ═══════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-12">
          <p className="font-mono text-[0.72rem] text-[#00E5A0] uppercase tracking-widest mb-3">Objetivos</p>
          <h2 className="text-2xl md:text-4xl font-bold text-white-f leading-tight mb-8">
            Sales con un canvas llenado, una decisión Go/No-go en mano <span className="bg-gradient-to-r from-[#00E5A0] to-[#D4AF4C] bg-clip-text text-transparent">y un vocabulario común con tu equipo</span>
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

      {/* ═══════════ 4. POR QUÉ ═══════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#DC2626] uppercase tracking-widest mb-3">El problema · proyectos IA en banca · julio 2026</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            Por qué la mayoría <span className="bg-gradient-to-r from-[#DC2626] to-[#E85A1F] bg-clip-text text-transparent">no llegan a producción</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            No es por falta de talento ni de presupuesto. Es por cómo se piensa el proyecto en la primera semana. Cuando el job no está bien definido, todo lo que viene después se vuelve carísimo.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {POR_QUE.map((f) => (
              <div key={f.n} className="bg-[#0D1229] border rounded-2xl p-5 flex flex-col" style={{ borderColor: `${f.color}30` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[2.2rem] font-bold leading-none" style={{ color: f.color }}>{f.n}</span>
                  <span className="font-mono text-[0.55rem] uppercase tracking-widest px-2 py-0.5 rounded" style={{ background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}35` }}>
                    {f.tag}
                  </span>
                </div>
                <p className="text-base font-bold text-white-f leading-tight mb-2">{f.title}</p>
                <p className="text-[0.75rem] text-white-f/75 leading-relaxed">{f.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════ 5. JTBD · 3 FRAMEWORKS ═══════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#00E5A0] uppercase tracking-widest mb-3">Parte 1 · Jobs to be Done</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            3 frameworks · <span className="bg-gradient-to-r from-[#00E5A0] to-[#5B52D5] bg-clip-text text-transparent">cuándo usar cada uno</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            JTBD no es un framework, son tres con propósitos distintos. Christensen para descubrir el job · Ulwick para descomponerlo en outcomes medibles · Switch para entender por qué la gente cambia (o no).
          </p>

          <div className="grid md:grid-cols-3 gap-2 mb-6">
            {JTBD_FRAMEWORKS.map((f) => {
              const active = activeFW === f.id;
              return (
                <button key={f.id} onClick={() => setActiveFW(f.id)} className="text-left rounded-xl p-4 border transition-all" style={{
                  background: active ? `linear-gradient(135deg, ${f.color}28, ${f.color}08)` : "#0D1229",
                  borderColor: active ? f.color : `${f.color}30`,
                }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-2xl">{f.icon}</span>
                    <p className="text-sm font-bold text-white-f">{f.name}</p>
                  </div>
                  <p className="text-[0.74rem] text-white-f/75 leading-snug">{f.one}</p>
                </button>
              );
            })}
          </div>

          <div className="bg-[#0D1229] border rounded-2xl p-6 grid md:grid-cols-2 gap-6" style={{ borderColor: `${currentFW.color}40` }}>
            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-1.5" style={{ color: currentFW.color }}>▸ Formato</p>
              <p className="text-[0.85rem] text-white-f/95 font-mono bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 mb-4">{currentFW.fmt}</p>

              <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-1.5 text-gold">▸ Ejemplo BTG</p>
              <p className="text-[0.82rem] text-white-f/85 italic leading-relaxed">&ldquo;{currentFW.example}&rdquo;</p>
            </div>
            <div className="space-y-3">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1 text-cyan">▸ Cuándo usarlo</p>
                <p className="text-[0.78rem] text-white-f/85 leading-relaxed">{currentFW.when}</p>
              </div>
              <div className="bg-[#DC2626]/8 border border-[#DC2626]/30 rounded-lg p-3">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1 text-[#DC2626]">⚠ Pitfall</p>
                <p className="text-[0.78rem] text-white-f/85 leading-relaxed">{currentFW.pitfall}</p>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════ 6. JTBD INTERACTIVO ═══════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#00E5A0] uppercase tracking-widest mb-3">Demo · escribe tu job statement</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            Tu primer <span className="bg-gradient-to-r from-[#00E5A0] to-[#5B52D5] bg-clip-text text-transparent">job statement</span> en vivo
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            Piensa en un proceso recurrente de tu área que toma más de 4 horas/semana · llena los 3 campos abajo · obtienes un job statement formato Christensen listo para tu canvas.
          </p>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="font-mono text-[0.6rem] uppercase tracking-widest text-[#00E5A0] mb-1.5 block">▸ Situación · cuando...</label>
                <input
                  type="text"
                  value={situ}
                  onChange={(e) => setSitu(e.target.value)}
                  placeholder="ej: llega un teaser de un sector que conozco poco"
                  className="w-full bg-[#0D1229] border border-white/[0.10] rounded-lg px-4 py-2.5 text-[0.88rem] text-white-f placeholder:text-muted focus:outline-none focus:border-[#00E5A0]"
                />
              </div>
              <div>
                <label className="font-mono text-[0.6rem] uppercase tracking-widest text-[#5B52D5] mb-1.5 block">▸ Motivación · quiero...</label>
                <input
                  type="text"
                  value={moti}
                  onChange={(e) => setMoti(e.target.value)}
                  placeholder="ej: un brief de 5 páginas con peers y múltiplos"
                  className="w-full bg-[#0D1229] border border-white/[0.10] rounded-lg px-4 py-2.5 text-[0.88rem] text-white-f placeholder:text-muted focus:outline-none focus:border-[#5B52D5]"
                />
              </div>
              <div>
                <label className="font-mono text-[0.6rem] uppercase tracking-widest text-[#D4AF4C] mb-1.5 block">▸ Resultado · para que...</label>
                <input
                  type="text"
                  value={resu}
                  onChange={(e) => setResu(e.target.value)}
                  placeholder="ej: pueda llegar a la primera reunión hablando del cliente"
                  className="w-full bg-[#0D1229] border border-white/[0.10] rounded-lg px-4 py-2.5 text-[0.88rem] text-white-f placeholder:text-muted focus:outline-none focus:border-[#D4AF4C]"
                />
              </div>

              {situ && moti && resu && (
                <button
                  onClick={() => navigator.clipboard?.writeText(`Cuando ${situ}, quiero ${moti}, para que ${resu}.`)}
                  className="font-mono text-[0.65rem] uppercase tracking-widest px-4 py-2 rounded-lg bg-[#00E5A0]/15 border border-[#00E5A0]/40 text-[#00E5A0] hover:scale-105 transition-all"
                >
                  📋 Copiar job statement
                </button>
              )}
            </div>

            <div className="bg-gradient-to-br from-[#0F1438] via-[#0D1229] to-[#080C1F] border border-[#00E5A0]/30 rounded-2xl p-6 flex flex-col">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[#00E5A0] mb-3">▸ Tu job statement</p>
              {situ || moti || resu ? (
                <p className="text-[1rem] text-white-f leading-relaxed">
                  Cuando <span className="bg-[#00E5A0]/15 px-1 rounded">{situ || "[situación]"}</span>,
                  quiero <span className="bg-[#5B52D5]/15 px-1 rounded">{moti || "[motivación]"}</span>,
                  para que <span className="bg-[#D4AF4C]/15 px-1 rounded">{resu || "[resultado]"}</span>.
                </p>
              ) : (
                <p className="text-[0.85rem] text-muted italic">Llena los 3 campos a la izquierda · tu job statement aparecerá aquí en vivo.</p>
              )}

              <div className="mt-auto pt-4 border-t border-white/[0.06]">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1.5 text-gold">▸ Test rápido de calidad</p>
                <ul className="text-[0.72rem] text-white-f/80 space-y-1">
                  <li>• La situación es específica (no 'cuando trabajo')</li>
                  <li>• La motivación describe QUÉ quieres, no CÓMO</li>
                  <li>• El resultado es medible o al menos observable</li>
                  <li>• No menciona la palabra 'IA' ni una herramienta</li>
                </ul>
              </div>
            </div>
          </div>

          {/* JTBD ejemplos BTG */}
          <div className="mt-10">
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted mb-3">▾ Ejemplos por área BTG</p>
            <div className="grid md:grid-cols-2 gap-3">
              {JTBD_BTG_EJEMPLOS.map((e, i) => (
                <div key={i} className="bg-[#0D1229] border rounded-xl p-4" style={{ borderColor: `${e.color}30` }}>
                  <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1.5" style={{ color: e.color }}>{e.role}</p>
                  <p className="text-[0.82rem] text-white-f/90 italic leading-relaxed">&ldquo;{e.job}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════ 7. DOUBLE DIAMOND ═══════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#5B52D5] uppercase tracking-widest mb-3">Parte 2 · Diseño de producto</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            Double Diamond aplicado a IA · <span className="bg-gradient-to-r from-[#5B52D5] to-[#E85A1F] bg-clip-text text-transparent">no te saltes ninguna fase</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            Diverger · convergir · diverger · convergir. La fase más subestimada es Discover · la mayoría de equipos brincan a Develop con suposiciones y pagan en producción.
          </p>

          {/* Fases tabs */}
          <div className="grid md:grid-cols-4 gap-2 mb-6">
            {DD_FASES.map((f, i) => {
              const active = activeFase === f.id;
              return (
                <button key={f.id} onClick={() => setActiveFase(f.id)} className="text-left rounded-xl p-4 border transition-all relative" style={{
                  background: active ? `linear-gradient(135deg, ${f.color}28, ${f.color}08)` : "#0D1229",
                  borderColor: active ? f.color : `${f.color}30`,
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{f.icon}</span>
                    <span className="font-mono text-[0.5rem] uppercase tracking-widest" style={{ color: f.color }}>{f.days}</span>
                  </div>
                  <p className="text-sm font-bold text-white-f leading-tight">{f.name}</p>
                  <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted">{f.diamond}</p>
                  {i < DD_FASES.length - 1 && <span className="hidden md:block absolute top-1/2 -right-2 -translate-y-1/2 text-muted pointer-events-none z-10">→</span>}
                </button>
              );
            })}
          </div>

          <div className="bg-[#0D1229] border rounded-2xl p-6" style={{ borderColor: `${currentFase.color}40` }}>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-[#22C55E]/8 border border-[#22C55E]/30 rounded-lg p-4">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1.5 text-[#22C55E]">✓ Hacé</p>
                <p className="text-[0.78rem] text-white-f/90 leading-relaxed">{currentFase.do}</p>
              </div>
              <div className="bg-[#DC2626]/8 border border-[#DC2626]/30 rounded-lg p-4">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1.5 text-[#DC2626]">✗ No hagas</p>
                <p className="text-[0.78rem] text-white-f/90 leading-relaxed">{currentFase.dont}</p>
              </div>
              <div className="bg-white/[0.03] border border-[#D4AF4C]/30 rounded-lg p-4">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1.5 text-gold">▸ Output</p>
                <p className="text-[0.78rem] text-white-f/90 leading-relaxed">{currentFase.output}</p>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════ 8. CANVAS BTG · 10 BLOQUES ═══════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#D4AF4C] uppercase tracking-widest mb-3">Parte 3 · Canvas Proyecto IA · BTG</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            Los <span className="bg-gradient-to-r from-[#D4AF4C] to-[#E85A1F] bg-clip-text text-transparent">10 bloques</span> que toda idea pasa antes de aprobarse
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            Si no puedes llenarlos los 10 en 90 minutos, no estás listo para pedir presupuesto. Cada bloque tiene un prompt para guiarte, un ejemplo BTG, y la trampa más común.
          </p>

          {/* Grid 10 bloques */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
            {CANVAS_BLOQUES.map((b, i) => {
              const active = activeBloque === i;
              return (
                <button key={b.n} onClick={() => setActiveBloque(i)} className="text-left rounded-xl p-3 border transition-all relative" style={{
                  background: active ? `linear-gradient(135deg, ${b.color}28, ${b.color}08)` : "#0D1229",
                  borderColor: active ? b.color : `${b.color}30`,
                }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl">{b.icon}</span>
                    <span className="font-mono text-[0.5rem] font-bold" style={{ color: b.color }}>#{b.n}</span>
                  </div>
                  <p className="text-[0.72rem] font-bold text-white-f leading-tight">{b.title}</p>
                </button>
              );
            })}
          </div>

          {/* Detalle bloque */}
          <div className="bg-[#0D1229] border rounded-2xl overflow-hidden" style={{ borderColor: `${currentBloque.color}40` }}>
            <div className="px-6 py-4 border-b flex items-center gap-4" style={{ background: `linear-gradient(135deg, ${currentBloque.color}18, ${currentBloque.color}06)`, borderColor: `${currentBloque.color}25` }}>
              <div className="w-14 h-14 rounded-xl grid place-items-center text-2xl" style={{ background: `${currentBloque.color}22`, border: `1px solid ${currentBloque.color}50` }}>
                {currentBloque.icon}
              </div>
              <div>
                <p className="font-mono text-[0.55rem] uppercase tracking-widest" style={{ color: currentBloque.color }}>Bloque #{currentBloque.n} de 10</p>
                <h3 className="text-2xl font-bold text-white-f">{currentBloque.title}</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1.5" style={{ color: currentBloque.color }}>▸ Prompt para llenar</p>
                <p className="text-[0.85rem] text-white-f/95 font-mono">{currentBloque.prompt}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-[#0F1438] border border-white/[0.06] rounded-lg p-4">
                  <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1 text-cyan">▸ Por qué importa</p>
                  <p className="text-[0.78rem] text-white-f/85 leading-relaxed">{currentBloque.why}</p>
                </div>
                <div className="bg-white/[0.03] border border-[#D4AF4C]/30 rounded-lg p-4">
                  <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1 text-gold">▸ Ejemplo BTG</p>
                  <p className="text-[0.78rem] text-white-f/85 italic leading-relaxed">&ldquo;{currentBloque.example}&rdquo;</p>
                </div>
              </div>
              <div className="bg-[#DC2626]/8 border border-[#DC2626]/30 rounded-lg p-4">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1 text-[#DC2626]">⚠ Trampa típica</p>
                <p className="text-[0.78rem] text-white-f/90 leading-relaxed">{currentBloque.danger}</p>
              </div>

              {/* Navegación */}
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <button onClick={() => setActiveBloque((i) => Math.max(0, i - 1))} disabled={activeBloque === 0} className="font-mono text-[0.65rem] uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.10] text-white-f hover:bg-white/[0.10] disabled:opacity-30">← Bloque anterior</button>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">{activeBloque + 1} / 10</p>
                <button onClick={() => setActiveBloque((i) => Math.min(9, i + 1))} disabled={activeBloque === 9} className="font-mono text-[0.65rem] uppercase tracking-widest px-3 py-1.5 rounded-lg text-white disabled:opacity-30" style={{ background: currentBloque.color }}>Siguiente bloque →</button>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════ 9. CASOS COMPLETOS ═══════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#0F6CBD] uppercase tracking-widest mb-3">4 casos · Canvas completo</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            Lo mismo que vas a hacer tú · <span className="bg-gradient-to-r from-[#0F6CBD] to-[#742774] bg-clip-text text-transparent">en 4 áreas BTG</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            IB · WM · S&T · Compliance. Cada caso con los 10 bloques llenos. No son hipotéticos · son adaptaciones de proyectos reales que están corriendo en pares de BTG en otros bancos LATAM.
          </p>

          <div className="grid md:grid-cols-4 gap-2 mb-6">
            {CASOS.map((c) => {
              const active = activeCaso === c.id;
              return (
                <button key={c.id} onClick={() => setActiveCaso(c.id)} className="text-left rounded-xl p-3 border transition-all" style={{
                  background: active ? `linear-gradient(135deg, ${c.color}28, ${c.color}08)` : "#0D1229",
                  borderColor: active ? c.color : `${c.color}30`,
                }}>
                  <div className="text-2xl mb-1">{c.icon}</div>
                  <p className="text-[0.78rem] font-bold text-white-f leading-tight">{c.title}</p>
                </button>
              );
            })}
          </div>

          <div className="bg-[#0D1229] border rounded-2xl p-6 space-y-4" style={{ borderColor: `${currentCaso.color}40` }}>
            {/* Job + doer */}
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1" style={{ color: currentCaso.color }}>1 · Job</p>
                <p className="text-[0.78rem] text-white-f/95 italic leading-relaxed">&ldquo;{currentCaso.job}&rdquo;</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1" style={{ color: currentCaso.color }}>2 · Job-doer</p>
                <p className="text-[0.78rem] text-white-f/85 leading-relaxed">{currentCaso.doer}</p>
              </div>
            </div>

            {/* Outcomes */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4">
              <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-2" style={{ color: currentCaso.color }}>3 · Outcomes</p>
              <ul className="space-y-1">
                {currentCaso.outcomes.map((o, i) => (
                  <li key={i} className="text-[0.74rem] text-white-f/85 flex items-start gap-2">
                    <span className="text-[#3A7BD5]">▪</span>{o}
                  </li>
                ))}
              </ul>
            </div>

            {/* Forces */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4">
              <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-2" style={{ color: currentCaso.color }}>4 · Forces of Progress</p>
              <div className="grid grid-cols-2 gap-2 text-[0.7rem]">
                <div><span className="font-mono text-[#22C55E]">PUSH:</span> <span className="text-white-f/85">{currentCaso.forces.push}</span></div>
                <div><span className="font-mono text-[#0EA5E9]">PULL:</span> <span className="text-white-f/85">{currentCaso.forces.pull}</span></div>
                <div><span className="font-mono text-[#F59E0B]">ANXIETY:</span> <span className="text-white-f/85">{currentCaso.forces.anxiety}</span></div>
                <div><span className="font-mono text-[#7C3AED]">HABIT:</span> <span className="text-white-f/85">{currentCaso.forces.habit}</span></div>
              </div>
            </div>

            {/* Constraints + Hypothesis */}
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1" style={{ color: currentCaso.color }}>5 · Restricciones BTG</p>
                <p className="text-[0.74rem] text-white-f/85 leading-relaxed">{currentCaso.constraints}</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1" style={{ color: currentCaso.color }}>6 · Hipótesis IA</p>
                <p className="text-[0.74rem] text-white-f/85 leading-relaxed">{currentCaso.hypothesis}</p>
              </div>
            </div>

            {/* MVP + Metrics */}
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1" style={{ color: currentCaso.color }}>7 · MVP 2 semanas</p>
                <p className="text-[0.74rem] text-white-f/85 leading-relaxed">{currentCaso.mvp}</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1" style={{ color: currentCaso.color }}>8 · Métricas</p>
                <p className="text-[0.74rem] text-white-f/85 leading-relaxed">{currentCaso.metrics}</p>
              </div>
            </div>

            {/* Risks */}
            <div className="bg-[#F59E0B]/8 border border-[#F59E0B]/30 rounded-lg p-4">
              <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1 text-[#F59E0B]">9 · Riesgos IA</p>
              <p className="text-[0.74rem] text-white-f/90 leading-relaxed">{currentCaso.risks}</p>
            </div>

            {/* Decision */}
            <div className="bg-[#22C55E]/8 border border-[#22C55E]/30 rounded-lg p-4">
              <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1 text-[#22C55E]">10 · Decisión Go/No-go</p>
              <p className="text-[0.74rem] text-white-f/90 leading-relaxed">{currentCaso.decision}</p>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════ 10. ANTIPATRONES ═══════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#DC2626] uppercase tracking-widest mb-3">Antipatrones · 8 errores típicos</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            Lo que <span className="bg-gradient-to-r from-[#DC2626] to-[#E85A1F] bg-clip-text text-transparent">mata proyectos IA en banca</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            Cada antipatrón es responsable de matar un porcentaje del 60% que nunca llega a producción. Reconocerlos a tiempo es la skill más valiosa que sales con esta sesión.
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            {ANTIPATRONES.map((a) => (
              <div key={a.n} className="bg-[#0D1229] border rounded-xl p-4 flex gap-3" style={{ borderColor: `${a.color}30` }}>
                <div className="w-10 h-10 rounded-lg grid place-items-center font-mono text-sm font-bold shrink-0" style={{ background: `${a.color}22`, color: a.color, border: `1px solid ${a.color}50` }}>
                  {a.n}
                </div>
                <div>
                  <p className="text-[0.88rem] font-bold text-white-f mb-1">{a.name}</p>
                  <p className="text-[0.72rem] text-white-f/80 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════ 11. CHECKLIST ═══════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#22C55E] uppercase tracking-widest mb-3">Checklist · 10 puntos antes de pitchear</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            Si tu canvas pasa <span className="bg-gradient-to-r from-[#22C55E] to-[#D4AF4C] bg-clip-text text-transparent">los 10 puntos</span>, estás listo
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            Marca cada punto · cuando llegues a 10/10 tu canvas está defendible ante el comité de digitalización BTG. Si te quedan dudas en alguno, vuelve al bloque correspondiente.
          </p>

          <div className="bg-gradient-to-br from-[#0F1438] via-[#0D1229] to-[#080C1F] border border-[#22C55E]/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[#22C55E]">Tu progreso</p>
              <p className="text-2xl font-bold font-mono">
                <span className="text-[#22C55E]">{checked.size}</span>
                <span className="text-muted"> / 10</span>
              </p>
            </div>
            <div className="w-full bg-white/[0.05] rounded-full h-3 overflow-hidden mb-6">
              <div className="h-full bg-gradient-to-r from-[#00E5A0] via-[#22C55E] to-[#D4AF4C] transition-all duration-500" style={{ width: `${(checked.size / 10) * 100}%` }} />
            </div>

            <div className="space-y-2">
              {CHECKLIST.map((item, i) => {
                const done = checked.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleCheck(i)}
                    className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all"
                    style={{
                      background: done ? "rgba(34,197,94,0.10)" : "rgba(255,255,255,0.02)",
                      borderColor: done ? "rgba(34,197,94,0.40)" : "rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="w-6 h-6 rounded-md grid place-items-center shrink-0 font-mono text-[0.7rem]" style={{
                      background: done ? "#22C55E" : "rgba(255,255,255,0.05)",
                      border: done ? "1px solid #22C55E" : "1px solid rgba(255,255,255,0.10)",
                    }}>
                      {done ? "✓" : i + 1}
                    </div>
                    <p className={`text-[0.85rem] flex-1 ${done ? "text-white-f line-through opacity-60" : "text-white-f/90"}`}>{item}</p>
                  </button>
                );
              })}
            </div>

            {checked.size === 10 && (
              <div className="mt-5 bg-gradient-to-r from-[#22C55E]/15 to-[#D4AF4C]/10 border border-[#22C55E]/40 rounded-lg p-4 flex items-center gap-3 animate-fadeUp">
                <span className="text-3xl">🏆</span>
                <div>
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[#22C55E] mb-1">Canvas defendible</p>
                  <p className="text-[0.85rem] text-white-f/95 leading-relaxed">Tu canvas pasa los 10 puntos · estás listo para pitch al comité de digitalización BTG. Próximos pasos: agenda 30 min con tu líder de área + manda el canvas + define fecha de Discover.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════ 12. CIERRE ═══════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,229,160,0.08),transparent)] pointer-events-none" />

          <div className="relative bg-gradient-to-br from-[#0F1438] via-[#0D1229] to-[#080C1F] border border-white/[0.08] rounded-3xl p-8 md:p-12">
            <p className="font-mono text-[0.72rem] text-[#00E5A0] uppercase tracking-widest mb-3">Cierre · sesión PLUS</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
              Lo que sale contigo · <span className="bg-gradient-to-r from-[#00E5A0] via-[#5B52D5] to-[#D4AF4C] bg-clip-text text-transparent">y la primera tarea</span>
            </h2>
            <p className="text-lg text-muted max-w-3xl mb-8 leading-relaxed">
              Esta sesión no se aprueba con asistencia · se aprueba con un canvas llenado para un proyecto real de tu área. La diferencia entre quienes hacen pitch y los que ejecutan está en tomarse las 90 minutos de hoy en serio.
            </p>

            <div className="grid md:grid-cols-3 gap-3 mb-8">
              {[
                { k: "Lenguaje", v: "JTBD + Forces of Progress + Outcomes Ulwick", c: "#00E5A0" },
                { k: "Marco", v: "Double Diamond + Canvas BTG 10 bloques", c: "#5B52D5" },
                { k: "Decisión", v: "Checklist Go/No-go + 8 antipatrones a evitar", c: "#D4AF4C" },
              ].map((s) => (
                <div key={s.k} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                  <p className="font-mono text-[0.58rem] uppercase tracking-widest mb-1.5" style={{ color: s.c }}>{s.k}</p>
                  <p className="text-[0.85rem] font-bold text-white-f leading-snug">{s.v}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/[0.06]">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-orange mb-2">Primera tarea · 7 días</p>
              <p className="text-[0.88rem] text-white-f/90 italic leading-relaxed">
                &ldquo;Identifica un job recurrente en tu área que tome más de 4 horas/semana. Llena los 10 bloques del Canvas BTG para ese job · cumple los 10 puntos del checklist · agenda 30 minutos con tu líder de área para defender el canvas. Si pasa, reservás 2 semanas para el MVP. Si no pasa, sales con feedback específico de qué bloque mejorar. Ambos resultados son éxito.&rdquo;
              </p>
            </div>
          </div>
        </section>
      </RevealSection>
    </div>
  );
}
