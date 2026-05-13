"use client";

import { useEffect, useMemo, useState } from "react";
import RevealSection from "@/components/RevealSection";

/* ════════════════════════════ DATA ════════════════════════════ */

const AGENDA = [
  { time: "0:00–0:10", label: "Apertura · por qué la mejor IA empieza sin IA", color: "#FF6B9D" },
  { time: "0:10–0:25", label: "5 mentalidades para pensar antes de construir", color: "#5B52D5" },
  { time: "0:25–0:55", label: "Métodos creativos · divergir antes de converger", color: "#00E5A0" },
  { time: "0:55–1:20", label: "Banco de 25 preguntas · antes de pedir presupuesto", color: "#D4AF4C" },
  { time: "1:20–1:45", label: "Stack Selector · cuál herramienta BTG resuelve tu job", color: "#0F6CBD" },
  { time: "1:45–2:00", label: "10 buenas prácticas + workshop de 1 hora", color: "#E85A1F" },
];

const OBJETIVOS = [
  { icon: "◐", title: "Piensas antes de prototipar", detail: "Reconoces cuándo lanzarte a construir es trampa · cuándo merece otra ronda de divergencia." },
  { icon: "✺", title: "Operas 5 mentalidades", detail: "First principles, inversion, pre-mortem, beginner's mind y constraint-led como músculos diarios." },
  { icon: "✦", title: "Diverges con método", detail: "SCAMPER, How Might We, Crazy 8s, Reverse Brainstorm y 5 Porqués al servicio de proyectos IA en banca." },
  { icon: "?", title: "Haces las preguntas correctas", detail: "25 preguntas filtrables · tu canvas no entra al comité sin pasarlas." },
  { icon: "⚙", title: "Eliges stack con criterio", detail: "Sabes cuándo n8n, cuándo Power Platform, cuándo Copilot Studio, cuándo solo un prompt bien hecho." },
];

/* ═══ POR QUÉ ═══ */
const POR_QUE = [
  {
    n: "01",
    title: "El 73% de los pilotos IA mueren porque resuelven el problema equivocado",
    detail: "MIT Sloan + BCG ene-2026: la causa #1 de muerte de pilotos en banca no es técnica · es que nadie se tomó el tiempo de cuestionar si el problema valía la pena resolverse con IA.",
    tag: "MIT/BCG 2026",
    color: "#DC2626",
  },
  {
    n: "02",
    title: "Las mejores soluciones IA no incluyen IA",
    detail: "Patrón observado en revisiones internas de programas similares: ~40% de los problemas planteados como 'caso de uso de IA' se resuelven mejor con un cambio de proceso, un SharePoint con permisos correctos, o una macro de Excel que ya existía.",
    tag: "Patrón LATAM",
    color: "#E85A1F",
  },
  {
    n: "03",
    title: "La idea promedio dura 18 minutos en sesión creativa",
    detail: "Estudios IDEO + Stanford d.school: el primer pensamiento gana por defecto. Sin método divergente, el equipo converge a la primera idea aceptable · no a la mejor. Y en banca, 'aceptable' significa caro de revertir.",
    tag: "d.school",
    color: "#D4AF4C",
  },
  {
    n: "04",
    title: "Preguntar bien vale 100× más que responder rápido",
    detail: "El costo de un proyecto IA mal definido en banca corporativa (data engineering, licencias, change management, riesgo regulatorio) puede superar los USD 200K. El costo de 90 min de preguntas correctas: cero. La asimetría es brutal.",
    tag: "Asimetría",
    color: "#7C3AED",
  },
];

/* ═══ 5 MENTALIDADES ═══ */
const MENTALIDADES = [
  {
    id: "first",
    name: "First Principles",
    icon: "△",
    color: "#00E5A0",
    one: "Romper el problema hasta lo irreductible y reconstruir desde ahí, sin asumir cómo se hace hoy.",
    detail: "Pregunta clave: '¿Qué tendría que ser verdad para que esto funcione?' Ignora cómo lo hace la competencia, cómo lo hace el banco hoy, cómo te lo enseñaron. Empieza por físicas, economía y comportamiento humano.",
    btg: "Antes de proponer 'agente IA para due diligence', pregúntate: ¿qué hace de verdad un analyst senior con 10 años? ¿Qué señales lee? ¿Qué descarta sin mirar? ¿Eso es replicable?",
    quote: "&ldquo;Si lo razonas por analogía nunca harás algo realmente nuevo.&rdquo; — Elon Musk",
  },
  {
    id: "inversion",
    name: "Inversion · pensar al revés",
    icon: "↺",
    color: "#5B52D5",
    one: "No preguntes cómo tener éxito · pregunta cómo garantizar fracaso, y luego no hagas eso.",
    detail: "Charlie Munger: 'Invierte siempre, invierte.' Es más fácil identificar qué destruye un proyecto que qué lo hace ganar. Lista las 10 maneras seguras de matarlo, y diseña para evitar cada una.",
    btg: "¿Cómo garantizo que el agente Copilot falle en producción? Datos sucios, sin champion, sin métrica, sin permisos, sin entrenamiento, sin red flag. La lista invertida es tu plan de implementación real.",
    quote: "&ldquo;Quiero saber dónde voy a morir, para nunca ir ahí.&rdquo; — Charlie Munger",
  },
  {
    id: "premortem",
    name: "Pre-mortem · funeral del proyecto",
    icon: "✝",
    color: "#DC2626",
    one: "Imagina que el proyecto ya fracasó · escribe el obituario · diseña para evitar cada causa.",
    detail: "Gary Klein, 1989. Estudios muestran que el pre-mortem identifica 30% más razones de falla que el análisis tradicional. La distancia psicológica de 'ya falló' destraba honestidad.",
    btg: "Es enero 2027. El proyecto se canceló. Como equipo escribimos en 15 min: ¿Por qué falló? ¿Qué subestimamos? ¿Qué nadie quiso decir en la kickoff? Las respuestas son tu lista de riesgos reales.",
    quote: "&ldquo;Los equipos que hacen pre-mortem identifican 30% más causas de falla que los que solo planean.&rdquo; — HBR 2007",
  },
  {
    id: "beginner",
    name: "Beginner's Mind · 初心",
    icon: "○",
    color: "#0F6CBD",
    one: "Hablar con el problema como si fuera tu primer día · sin las certezas que dan los años en banca.",
    detail: "Shoshin (zen). El experto ve lo que espera ver. El principiante ve lo que está. Antes de cada sesión de diseño, una persona del equipo debe asumir el rol de 'idiota productivo': pregunta lo obvio, cuestiona los acrónimos, pide repetir.",
    btg: "¿Por qué tenemos que mandar el reporte el viernes? ¿Por qué Bloomberg y no otra fuente? ¿Por qué un PDF y no un Teams message? El idiota productivo desbloquea preguntas que el equipo ya naturalizó.",
    quote: "&ldquo;En la mente del principiante hay muchas posibilidades; en la del experto, pocas.&rdquo; — Shunryu Suzuki",
  },
  {
    id: "constraint",
    name: "Constraint-Led · la restricción como musa",
    icon: "▣",
    color: "#D4AF4C",
    one: "La pregunta no es '¿qué construyo?' · es '¿qué construyo con USD 5K, 2 semanas, sin tocar producción y sin licencia nueva?'",
    detail: "Las restricciones no son enemigos · son el atajo. Diseñar sin límites produce ideas grandes que mueren en presupuesto. Diseñar con límites produce ideas que se ejecutan el lunes.",
    btg: "Restricción BTG: solo data P-II o menor · stack ya pagado · 2 semanas · 1 desarrollador. ¿Qué es lo más ambicioso posible? Esa pregunta es 100× más útil que '¿qué nos imaginamos?'.",
    quote: "&ldquo;La restricción es la madre de la invención.&rdquo; — Stravinsky / Jobs",
  },
];

/* ═══ METODOS CREATIVOS ═══ */
const METODOS = [
  {
    id: "scamper",
    name: "SCAMPER",
    icon: "⚒",
    color: "#FF6B9D",
    one: "7 lentes para transformar un proceso o producto existente · cada letra fuerza un cambio.",
    pasos: [
      { k: "S · Substituir", v: "¿Qué elemento del proceso reemplazaríamos por un agente IA?" },
      { k: "C · Combinar", v: "¿Qué pasos podemos fusionar en un solo flujo Copilot?" },
      { k: "A · Adaptar", v: "¿Qué hace otra industria (legal, salud) que podríamos copiar?" },
      { k: "M · Modificar/Magnificar", v: "¿Qué pasaría si hiciéramos esto 10× más rápido o 100× más barato?" },
      { k: "P · Poner en otro uso", v: "¿Qué pasa si el agente de IB sirve también a wealth management?" },
      { k: "E · Eliminar", v: "¿Qué paso podríamos eliminar completamente?" },
      { k: "R · Reordenar/Invertir", v: "¿Qué pasa si invertimos el orden de validación y revisión?" },
    ],
    when: "Cuando ya tienes un proceso conocido y buscas 7 ángulos para mejorarlo.",
    output: "Lista de 20-30 ideas concretas en 25 min con un equipo de 4-6.",
  },
  {
    id: "hmw",
    name: "How Might We · HMW",
    icon: "?",
    color: "#00E5A0",
    one: "Reformular un dolor en una invitación a la creatividad · cambia el verbo y cambias todo.",
    pasos: [
      { k: "Empezar", v: "Lista el dolor en una frase plana: 'Los analystas pierden 4h prep cada reunión.'" },
      { k: "Reformular en HMW", v: "'¿Cómo podríamos eliminar la sensación de empezar de cero cada reunión?'" },
      { k: "Variar el alcance", v: "Una HMW debe estar entre 'tan amplio que paraliza' y 'tan estrecho que ya es solución'." },
      { k: "Test del HMW", v: "Si la respuesta es obvia, el HMW está mal calibrado." },
      { k: "Generar 5", v: "Reformular el mismo dolor en 5 HMWs distintos cambiando alcance, sujeto, métrica." },
      { k: "Elegir 1-2", v: "El equipo vota qué HMWs vale la pena explorar 30 min cada uno." },
    ],
    when: "Cuando el equipo está estancado en 'la solución' · necesitas reabrir el problema.",
    output: "1-2 HMW bien calibrados · 15-30 ideas por HMW.",
  },
  {
    id: "crazy8",
    name: "Crazy 8s",
    icon: "⚡",
    color: "#5B52D5",
    one: "8 ideas en 8 minutos por persona · forzar cantidad para destrabar la primera idea obvia.",
    pasos: [
      { k: "Setup", v: "Hoja A4 doblada en 8 cuadrados · timer de 8 minutos · sin hablar entre ellos." },
      { k: "Regla 1", v: "Cada minuto: 1 idea dibujada (no escrita) en un cuadrado." },
      { k: "Regla 2", v: "Cantidad sobre calidad · ideas tontas obligatorias en cuadros 3, 6 y 8." },
      { k: "Regla 3", v: "Prohibido editar lo ya dibujado · solo avanzar." },
      { k: "Cierre", v: "Cada persona presenta sus 8 en 2 min · el equipo dot-vota las 3 más interesantes." },
      { k: "Por qué funciona", v: "Las 3-4 primeras ideas son las obvias · las ideas 5-8 son donde aparece lo no-pensado." },
    ],
    when: "Inicio de sesión · necesitas romper el silencio del 'tengo una idea de Copilot'.",
    output: "32-48 ideas en 10 min (4 personas) · 3-6 destacadas para iterar.",
  },
  {
    id: "reverse",
    name: "Reverse Brainstorm",
    icon: "↺",
    color: "#DC2626",
    one: "En lugar de '¿cómo lo resolvemos?', preguntar '¿cómo lo hacemos peor?' · y luego invertir cada respuesta.",
    pasos: [
      { k: "Reformulación", v: "'¿Cómo garantizamos que el comité de inversión odie nuestro agente IA?'" },
      { k: "Brainstorm liberado", v: "Respuestas: que alucine, que sea lento, que no cite fuentes, que tape errores, que solo funcione lunes." },
      { k: "Inversión", v: "Cada respuesta se invierte: validación contra fuente, latencia <3s, citas obligatorias, transparencia de errores, disponibilidad 24/7." },
      { k: "Aprendizaje", v: "La lista invertida es tu spec de producto real." },
      { k: "Bonus", v: "Es 3× más divertido · gente que no participa en brainstorm tradicional sí participa aquí." },
    ],
    when: "Equipos políticamente sensibles · cuando hay que decir verdades incómodas sin parecer crítico.",
    output: "Lista de 15-20 anti-patrones + sus inversiones · semilla de spec.",
  },
  {
    id: "fiveWhy",
    name: "5 Porqués",
    icon: "?5",
    color: "#0EA5E9",
    one: "El primer 'por qué' nunca es la causa real · sigue preguntando hasta llegar al sistema.",
    pasos: [
      { k: "Problema", v: "'Los reportes se entregan tarde.'" },
      { k: "¿Por qué? · 1", v: "Porque cada analyst hace su parte sin coordinación." },
      { k: "¿Por qué? · 2", v: "Porque no hay un único formato consolidado." },
      { k: "¿Por qué? · 3", v: "Porque cada área quiso preservar sus métricas legadas." },
      { k: "¿Por qué? · 4", v: "Porque el incentivo individual está sobre las métricas legadas." },
      { k: "¿Por qué? · 5", v: "Porque el bonus se calcula por área, no por proyecto." },
      { k: "Diagnóstico", v: "El problema NO se soluciona con IA · se soluciona con incentivos. Esta es la lección más valiosa de los 5 porqués." },
    ],
    when: "Antes de proponer cualquier solución · valida que el problema percibido no es síntoma.",
    output: "Cadena causal explícita · 30% de los problemas terminan sin necesidad de IA.",
  },
];

/* ═══ BANCO DE PREGUNTAS ═══ */
const PREGUNTAS = [
  { id: 1, cat: "job", t: "¿Puedo escribir el job en una frase Cuando-Quiero-Para que sin mencionar IA ni tecnología?" },
  { id: 2, cat: "job", t: "¿Quién es el job-doer concreto (rol + área + seniority + % de tiempo en este job)?" },
  { id: 3, cat: "job", t: "¿He hablado con al menos 5 job-doers reales antes de proponer la solución?" },
  { id: 4, cat: "job", t: "¿Este job ocurre con qué frecuencia y cuánto tiempo cuesta hoy?" },
  { id: 5, cat: "job", t: "¿Qué hace el job-doer hoy cuando no tiene la solución? ¿Funciona?" },
  { id: 6, cat: "datos", t: "¿Existen los datos que necesito? ¿Dónde viven? ¿Quién los gobierna?" },
  { id: 7, cat: "datos", t: "¿Cuál es la clasificación P-I/II/III/IV de cada dataset que usaré?" },
  { id: 8, cat: "datos", t: "¿Los datos tienen la calidad suficiente, o el proyecto real es de limpieza de datos?" },
  { id: 9, cat: "datos", t: "¿Hay PII, secreto bancario, o data del cliente? ¿Qué controles aplica Habeas Data / SFC?" },
  { id: 10, cat: "datos", t: "¿Los datos son representativos del caso real o solo del histórico cómodo?" },
  { id: 11, cat: "riesgo", t: "¿Qué pasa si el modelo alucina en este caso? ¿Quién paga el costo?" },
  { id: 12, cat: "riesgo", t: "¿Esto cae bajo EU AI Act high-risk, SARLAFT, DORA, alguna CBJ de la SFC?" },
  { id: 13, cat: "riesgo", t: "¿Cuál es el plan si el proveedor del modelo cambia de precio, política o desaparece?" },
  { id: 14, cat: "riesgo", t: "¿Hay vector de prompt injection desde inputs externos (clientes, contrapartes, papers)?" },
  { id: 15, cat: "riesgo", t: "¿El log de qué decidió el modelo es auditable a 7 años?" },
  { id: 16, cat: "costo", t: "¿Cuánto cuesta operar esto al mes (tokens, licencias, infra) por usuario?" },
  { id: 17, cat: "costo", t: "¿El cost-per-decision es menor que el tiempo humano que reemplaza?" },
  { id: 18, cat: "costo", t: "¿El stack tecnológico ya está pagado en BTG o necesito licencia nueva?" },
  { id: 19, cat: "costo", t: "¿Cuánto cuesta NO hacer este proyecto durante 12 meses?" },
  { id: 20, cat: "costo", t: "¿El ROI esperado es defendible con números, o es un cuento?" },
  { id: 21, cat: "adopcion", t: "¿Quién es el champion concreto que va a defenderlo en su equipo cada semana?" },
  { id: 22, cat: "adopcion", t: "¿Qué tendría que dejar de hacer un usuario para que esto le ahorre tiempo de verdad?" },
  { id: 23, cat: "adopcion", t: "¿Cómo se mide la adopción? ¿Logins, ejecuciones, o cambio de comportamiento?" },
  { id: 24, cat: "adopcion", t: "¿El cambio de proceso requiere actualizar manuales, formación, KPIs individuales?" },
  { id: 25, cat: "adopcion", t: "¿Hay un grupo de 5-8 usuarios que YA pidió esto, o estoy empujando algo que nadie pidió?" },
];

const CATEGORIAS = [
  { id: "all", name: "Todas", icon: "✦", color: "#FF6B9D", count: 25 },
  { id: "job", name: "Job & Usuario", icon: "◎", color: "#00E5A0", count: 5 },
  { id: "datos", name: "Datos", icon: "▦", color: "#5B52D5", count: 5 },
  { id: "riesgo", name: "Riesgo & Compliance", icon: "⚠", color: "#DC2626", count: 5 },
  { id: "costo", name: "Costo & ROI", icon: "$", color: "#D4AF4C", count: 5 },
  { id: "adopcion", name: "Adopción", icon: "↗", color: "#0EA5E9", count: 5 },
];

/* ═══ STACK SELECTOR ═══ */
const STACK_PREGUNTAS = [
  {
    id: "freq",
    q: "¿Con qué frecuencia ocurre el job?",
    options: [
      { v: "raro", label: "Pocas veces al mes · ad-hoc" },
      { v: "semanal", label: "Varias veces por semana" },
      { v: "diario", label: "Diario · alto volumen" },
    ],
  },
  {
    id: "data",
    q: "¿Qué clase de datos involucra?",
    options: [
      { v: "publica", label: "Pública / no sensible (P-I)" },
      { v: "interna", label: "Interna no regulada (P-II)" },
      { v: "sensible", label: "Cliente / regulada (P-III / P-IV)" },
    ],
  },
  {
    id: "usuario",
    q: "¿Quién es el usuario final?",
    options: [
      { v: "yo", label: "Yo mismo · 1 persona" },
      { v: "equipo", label: "Mi equipo · 5-20 personas" },
      { v: "banco", label: "Múltiples áreas BTG · >50 personas" },
    ],
  },
  {
    id: "tarea",
    q: "¿Qué tipo de tarea es?",
    options: [
      { v: "redaccion", label: "Análisis, redacción, resumen, comparación" },
      { v: "orquestar", label: "Mover datos entre sistemas · disparar acciones" },
      { v: "app", label: "Interfaz nueva con formularios · flujo de aprobación" },
      { v: "agente", label: "Conversación o acción autónoma con cliente/interno" },
    ],
  },
  {
    id: "deadline",
    q: "¿Cuándo necesitas tener algo funcionando?",
    options: [
      { v: "hoy", label: "Hoy mismo o esta semana" },
      { v: "mes", label: "2-4 semanas" },
      { v: "trimestre", label: "1-3 meses" },
    ],
  },
];

type Answer = { freq?: string; data?: string; usuario?: string; tarea?: string; deadline?: string };

function recomendarStack(a: Answer): { tool: string; reason: string; color: string; alt?: string } {
  // No IA needed
  if (a.freq === "raro" && a.tarea === "redaccion" && a.deadline === "hoy") {
    return { tool: "Solo un prompt bien hecho (Claude / Copilot M365)", reason: "Frecuencia baja + tarea de pensamiento + deadline corto = no necesitas infra. Un prompt bien diseñado y guardado en tu OneDrive resuelve el job sin construir nada.", color: "#00E5A0", alt: "Si lo repites más de 3 veces, considera un Copilot Custom Agent" };
  }
  // Data sensible
  if (a.data === "sensible" && a.usuario === "banco") {
    return { tool: "Power Platform + Copilot Studio (tenant BTG)", reason: "Data regulada + escala enterprise exige permanecer dentro del perímetro Azure BTG. Copilot Studio con knowledge curado + Dataverse + Power Apps cumple SFC y permite gobernanza por DLP.", color: "#5B52D5", alt: "Para casos de muy alto riesgo: complementa con AI Builder on-tenant o modelo Azure OpenAI con private endpoint" };
  }
  // Agente conversacional
  if (a.tarea === "agente") {
    return { tool: "Copilot Studio · agente con knowledge curado", reason: "Conversación o acción autónoma se modela como agente con topics, knowledge y triggers. Si la audiencia es interna, Copilot Studio nativo. Si es externo, evalúa Custom Engine Agent.", color: "#0F6CBD", alt: "Si requiere orquestación compleja con APIs externas, usa Copilot Studio + Power Automate como tool" };
  }
  // Orquestar datos
  if (a.tarea === "orquestar") {
    const tool = a.data === "sensible" ? "Power Automate · cloud flow" : "n8n · self-hosted o cloud";
    const reason = a.data === "sensible"
      ? "Mover datos sensibles entre sistemas BTG = Power Automate dentro del tenant + DLP policies. Connector certificados + audit trail nativo."
      : "Orquestación rápida, conectores comunitarios, sin compromiso de licencia M365. Ideal para pilotos antes de promoverlos a Power Automate.";
    return { tool, reason, color: "#E85A1F", alt: "Si el flujo madura y va a producción interna, migra a Power Automate para gobernanza enterprise" };
  }
  // App con formulario
  if (a.tarea === "app") {
    return { tool: "Power Apps Canvas + Dataverse", reason: "Formularios, flujos de aprobación, lista de items con CRUD = Power Apps Canvas. Conecta a Dataverse para gobernanza, o a SharePoint si es ligero. Power Automate para los workflows.", color: "#D4AF4C", alt: "Para apps móviles dedicadas usa Power Apps Mobile. Para portales externos a clientes evalúa Power Pages" };
  }
  // Por defecto: análisis con asistente
  if (a.usuario === "yo" || a.usuario === "equipo") {
    return { tool: "Copilot M365 + Custom Agent en Copilot Studio", reason: "Análisis, redacción y research individual o de equipo chico se resuelve con Copilot M365 ya pagado. Si el caso se repite, encapsúlalo en un Custom Agent compartible por Teams.", color: "#7C3AED", alt: "Para análisis profundo con archivos privados usa Claude Projects con permisos de equipo" };
  }
  return { tool: "Power Platform full stack · App + Automate + Studio + AI Builder", reason: "Escala enterprise + tarea compleja recomienda el stack completo Power Platform. Empieza con un módulo (App o Studio) y crece según adopción real.", color: "#0EA5E9" };
}

/* ═══ BUENAS PRÁCTICAS ═══ */
const PRACTICAS = [
  { n: 1, t: "Empieza por el dolor, no por la tecnología", d: "Si tu primera frase incluye 'Copilot', 'agente IA', 'RAG' o 'embedding' — empezaste mal. La frase debe empezar con un job humano observable.", c: "#FF6B9D" },
  { n: 2, t: "Habla con 5 personas antes de escribir 1 línea de código", d: "Discovery vale más que producto. 5 entrevistas de 30 min destraban más decisiones que 5 sprints de construcción.", c: "#00E5A0" },
  { n: 3, t: "Si no puedes medirlo, no lo construyas", d: "Define la métrica antes que la solución. 'Mejorar la experiencia' no es métrica. 'Reducir tiempo de prep de 4h a 30 min en >70% de bankers' sí.", c: "#5B52D5" },
  { n: 4, t: "El primer MVP es de papel, no de código", d: "Antes de Power Apps, hazlo en Miro / PowerPoint. Si nadie usa el prototipo de papel, nadie usará el de código.", c: "#D4AF4C" },
  { n: 5, t: "Restricciones primero, ideación después", d: "Restricciones BTG (P-level, licencias, regulación, perímetro) se levantan en 30 min · ahorran 3 meses de rediseño. No es burocracia · es atajo.", c: "#0F6CBD" },
  { n: 6, t: "Diseña el rollback antes del rollout", d: "¿Cómo apagamos esto si sale mal? Si no tienes respuesta clara en 1 línea, no lo lances. Pre-condición no negociable.", c: "#DC2626" },
  { n: 7, t: "El humano final siempre tiene veto", d: "Si la IA decide algo material (aprobación, monto, dictamen regulatorio) · el humano final firma. La IA propone · el humano dispone. Sin excepción en banca.", c: "#7C3AED" },
  { n: 8, t: "Documenta como si te fueras mañana", d: "Prompts, knowledge sources, esquema de datos, decisión de modelo: todo en un README. Tu yo de dentro de 6 meses te lo agradecerá. La persona que te reemplace también.", c: "#0EA5E9" },
  { n: 9, t: "Mide adopción, no logins", d: "Logins son vanity. Pregúntate: ¿cambió el comportamiento del usuario? ¿Reemplazó realmente un flujo anterior? Si no, no estás siendo adoptado · te están dando like.", c: "#E85A1F" },
  { n: 10, t: "Diseña la salida desde el día 1", d: "Cuándo y cómo se apaga el proyecto: por cambio de regulación, por costo, por mejor alternativa. Sin clausula de salida los proyectos se vuelven zombis.", c: "#22C55E" },
];

/* ═══ WORKSHOP 1H ═══ */
const WORKSHOP = [
  { time: "00-05", title: "Reglas + setup", desc: "Pizarra/Miro, 4-6 personas, timer visible, 1 facilitador. Prohibido criticar ideas en bloques 2, 3, 4. Solo divergir.", color: "#FF6B9D" },
  { time: "05-15", title: "5 Porqués sobre el dolor", desc: "Una persona declara el problema · el grupo pregunta '¿por qué?' 5 veces en cadena. Producto: cadena causal documentada.", color: "#0EA5E9" },
  { time: "15-25", title: "HMW + reformulación", desc: "Convertir el problema en 5 'How Might We' distintos · variar alcance y sujeto. Votar 1-2 para explorar.", color: "#00E5A0" },
  { time: "25-35", title: "Crazy 8s individual", desc: "8 min · 8 ideas por persona · sin hablar. Después, cada uno presenta sus 8 en 2 min sin justificar.", color: "#5B52D5" },
  { time: "35-45", title: "Dot-voting + SCAMPER sobre top 3", desc: "Equipo vota 3 ideas con dots · aplican 7 lentes SCAMPER sobre cada una. Filtro: idea sobrevive al lente o muere.", color: "#D4AF4C" },
  { time: "45-55", title: "Pre-mortem · funeral del proyecto", desc: "Asumir que la idea fracasó en enero 2027 · escribir las 5 razones más probables. Esa lista es el plan de riesgos.", color: "#DC2626" },
  { time: "55-60", title: "Próximos pasos · 3 commitments", desc: "Quién habla con qué job-doer en los próximos 7 días · quién valida P-level y licencias · quién hace MVP de papel.", color: "#E85A1F" },
];

/* ════════════════════════════ COMPONENT ════════════════════════════ */

export default function Sesion9() {
  const [activeMent, setActiveMent] = useState<string>("first");
  const currentMent = useMemo(() => MENTALIDADES.find((m) => m.id === activeMent)!, [activeMent]);

  const [activeMet, setActiveMet] = useState<string>("scamper");
  const currentMet = useMemo(() => METODOS.find((m) => m.id === activeMet)!, [activeMet]);

  const [catFilter, setCatFilter] = useState<string>("all");
  const filteredPreguntas = useMemo(
    () => catFilter === "all" ? PREGUNTAS : PREGUNTAS.filter((p) => p.cat === catFilter),
    [catFilter]
  );
  const [answeredQ, setAnsweredQ] = useState<Set<number>>(new Set());
  const toggleQ = (i: number) => {
    setAnsweredQ((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const [answers, setAnswers] = useState<Answer>({});
  const setA = (k: keyof Answer, v: string) => setAnswers((a) => ({ ...a, [k]: v }));
  const stackComplete = Object.keys(answers).length === 5;
  const stackResult = useMemo(() => stackComplete ? recomendarStack(answers) : null, [answers, stackComplete]);

  const [heroN, setHeroN] = useState(0);
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => { i++; setHeroN(i); if (i >= 5) clearInterval(iv); }, 220);
    return () => clearInterval(iv);
  }, []);

  const [mantraIdx, setMantraIdx] = useState(0);
  const mantras = useMemo(() => [
    "&ldquo;La mejor IA empieza sin IA.&rdquo;",
    "&ldquo;Preguntar bien vale 100× responder rápido.&rdquo;",
    "&ldquo;La restricción no es enemiga · es el atajo.&rdquo;",
    "&ldquo;Diverge antes de converger · siempre.&rdquo;",
    "&ldquo;Si no puedes medirlo, no lo construyas.&rdquo;",
  ], []);
  useEffect(() => {
    const iv = setInterval(() => setMantraIdx((i) => (i + 1) % mantras.length), 3500);
    return () => clearInterval(iv);
  }, [mantras.length]);

  return (
    <div className="min-h-screen bg-[#080C1F]">
      {/* ═══════════ 1. HERO ═══════════ */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden">
        <div className="hero-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_50%,rgba(255,107,157,0.12),transparent),radial-gradient(ellipse_40%_50%_at_75%_60%,rgba(0,229,160,0.08),transparent)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="font-mono text-[0.6rem] uppercase tracking-widest px-3 py-1 rounded-full bg-gradient-to-r from-[#FF6B9D]/20 to-[#00E5A0]/20 border border-[#FF6B9D]/40 text-[#FF6B9D]">
              Sesión 9 · M03 · Automatizaciones
            </span>
            <span className="font-mono text-[0.6rem] text-muted">2 horas · taller</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white-f leading-tight mb-6 animate-fadeUp-1">
            <span className="text-white-f">Antes de construir,</span>{" "}
            <span className="bg-gradient-to-r from-[#FF6B9D] via-[#5B52D5] to-[#00E5A0] bg-clip-text text-transparent">piensa con método</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-6 animate-fadeUp-2">
            Creatividad, jobs to be done, preguntas y buenas prácticas para diseñar proyectos IA en BTG que sí lleguen a producción · y que valgan la pena llegar.
          </p>

          <div className="h-12 flex items-center justify-center mb-6 animate-fadeUp-3">
            <p
              key={mantraIdx}
              className="text-[0.95rem] md:text-base italic text-[#FF6B9D]/90 animate-fadeUp"
              dangerouslySetInnerHTML={{ __html: mantras[mantraIdx] }}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3 animate-fadeUp-3">
            {[
              { val: heroN >= 1 ? "5" : "—", label: "Mentalidades", icon: "✺", color: "#5B52D5" },
              { val: heroN >= 2 ? "5" : "—", label: "Métodos creativos", icon: "✦", color: "#00E5A0" },
              { val: heroN >= 3 ? "25" : "—", label: "Preguntas pre-build", icon: "?", color: "#D4AF4C" },
              { val: heroN >= 4 ? "5×3" : "—", label: "Stack selector", icon: "⚙", color: "#0F6CBD" },
              { val: heroN >= 5 ? "10" : "—", label: "Buenas prácticas", icon: "▣", color: "#E85A1F" },
            ].map((s) => (
              <div key={s.label} className="bg-[#151A3A] border rounded-2xl px-4 py-3 min-w-[110px] transition-all hover:scale-105" style={{ borderColor: `${s.color}25` }}>
                <span className="text-lg" style={{ color: s.color }}>{s.icon}</span>
                <p className="text-xl font-bold text-white-f mt-1">{s.val}</p>
                <p className="text-[0.6rem] text-muted">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[0.6rem] font-mono text-muted mt-4 opacity-60">* Complementa Sesión PLUS (JTBD + Canvas) con foco en creatividad divergente y selección de stack BTG.</p>
        </div>
      </section>

      {/* ═══════════ 2. AGENDA ═══════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-12">
          <p className="font-mono text-[0.72rem] text-[#FF6B9D] uppercase tracking-widest mb-6">Agenda · Sesión 9</p>
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
          <p className="font-mono text-[0.72rem] text-[#FF6B9D] uppercase tracking-widest mb-3">Objetivos</p>
          <h2 className="text-2xl md:text-4xl font-bold text-white-f leading-tight mb-8">
            Sales con un workshop ejecutable el lunes <span className="bg-gradient-to-r from-[#FF6B9D] to-[#00E5A0] bg-clip-text text-transparent">y un vocabulario común con tu equipo</span>
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
          <p className="font-mono text-[0.72rem] text-[#DC2626] uppercase tracking-widest mb-3">El problema · por qué creatividad antes que tecnología</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            La trampa de <span className="bg-gradient-to-r from-[#DC2626] to-[#FF6B9D] bg-clip-text text-transparent">brincar a construir</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            Cuando aparece una herramienta nueva la tentación es probarla con cualquier excusa. En banca esa tentación cuesta caro: pilotos que mueren, capital de credibilidad gastado, equipos cansados. Diseñar primero es la palanca con el ROI más alto del programa.
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

      {/* ═══════════ 5. MENTALIDADES ═══════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#5B52D5] uppercase tracking-widest mb-3">Parte 1 · Mentalidades</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            5 mentalidades · <span className="bg-gradient-to-r from-[#5B52D5] to-[#00E5A0] bg-clip-text text-transparent">músculos que entrenas</span> antes de cualquier proyecto IA
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            No son frameworks · son ángulos de pensamiento. Cada uno te protege de un fallo típico. Combinados, te dan el reflejo de cuestionar antes de construir.
          </p>

          <div className="grid md:grid-cols-5 gap-2 mb-6">
            {MENTALIDADES.map((m) => {
              const active = activeMent === m.id;
              return (
                <button key={m.id} onClick={() => setActiveMent(m.id)} className="text-left rounded-xl p-3 border transition-all" style={{
                  background: active ? `linear-gradient(135deg, ${m.color}28, ${m.color}08)` : "#0D1229",
                  borderColor: active ? m.color : `${m.color}30`,
                }}>
                  <div className="text-2xl mb-1.5" style={{ color: m.color }}>{m.icon}</div>
                  <p className="text-[0.78rem] font-bold text-white-f leading-tight">{m.name}</p>
                </button>
              );
            })}
          </div>

          <div className="bg-[#0D1229] border rounded-2xl p-6 grid md:grid-cols-2 gap-6" style={{ borderColor: `${currentMent.color}40` }}>
            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-1.5" style={{ color: currentMent.color }}>▸ La idea en una frase</p>
              <p className="text-[0.95rem] text-white-f/95 italic leading-relaxed mb-4">{currentMent.one}</p>

              <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-1.5 text-cyan">▸ Cómo se usa</p>
              <p className="text-[0.82rem] text-white-f/85 leading-relaxed mb-4">{currentMent.detail}</p>
            </div>
            <div className="space-y-3">
              <div className="bg-white/[0.03] border border-[#D4AF4C]/30 rounded-lg p-4">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1.5 text-gold">▸ Aplicado a BTG</p>
                <p className="text-[0.8rem] text-white-f/90 leading-relaxed">{currentMent.btg}</p>
              </div>
              <div className="bg-gradient-to-br from-[#5B52D5]/10 to-transparent border border-[#5B52D5]/20 rounded-lg p-4">
                <p
                  className="text-[0.85rem] text-white-f/80 italic leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: currentMent.quote }}
                />
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════ 6. METODOS CREATIVOS ═══════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#00E5A0] uppercase tracking-widest mb-3">Parte 2 · Métodos creativos</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            5 técnicas para <span className="bg-gradient-to-r from-[#00E5A0] to-[#FF6B9D] bg-clip-text text-transparent">divergir con disciplina</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            Cantidad antes de calidad · cantidad obliga a salirse de la primera idea cómoda. Cada técnica es una receta de 20-40 minutos con producto concreto · no es teoría, es ejecutable este viernes.
          </p>

          <div className="grid md:grid-cols-5 gap-2 mb-6">
            {METODOS.map((m) => {
              const active = activeMet === m.id;
              return (
                <button key={m.id} onClick={() => setActiveMet(m.id)} className="text-left rounded-xl p-3 border transition-all" style={{
                  background: active ? `linear-gradient(135deg, ${m.color}28, ${m.color}08)` : "#0D1229",
                  borderColor: active ? m.color : `${m.color}30`,
                }}>
                  <div className="text-xl mb-1" style={{ color: m.color }}>{m.icon}</div>
                  <p className="text-[0.78rem] font-bold text-white-f leading-tight">{m.name}</p>
                </button>
              );
            })}
          </div>

          <div className="bg-[#0D1229] border rounded-2xl overflow-hidden" style={{ borderColor: `${currentMet.color}40` }}>
            <div className="px-6 py-4 border-b flex items-center gap-4" style={{ background: `linear-gradient(135deg, ${currentMet.color}18, ${currentMet.color}06)`, borderColor: `${currentMet.color}25` }}>
              <div className="w-14 h-14 rounded-xl grid place-items-center text-2xl" style={{ background: `${currentMet.color}22`, border: `1px solid ${currentMet.color}50`, color: currentMet.color }}>
                {currentMet.icon}
              </div>
              <div>
                <p className="font-mono text-[0.55rem] uppercase tracking-widest" style={{ color: currentMet.color }}>Método creativo</p>
                <h3 className="text-2xl font-bold text-white-f">{currentMet.name}</h3>
                <p className="text-[0.78rem] text-muted italic">{currentMet.one}</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
                  <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1 text-cyan">▸ Cuándo usarlo</p>
                  <p className="text-[0.78rem] text-white-f/85 leading-relaxed">{currentMet.when}</p>
                </div>
                <div className="bg-white/[0.03] border border-[#D4AF4C]/30 rounded-lg p-3">
                  <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1 text-gold">▸ Producto esperado</p>
                  <p className="text-[0.78rem] text-white-f/85 leading-relaxed">{currentMet.output}</p>
                </div>
              </div>

              <div>
                <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-2" style={{ color: currentMet.color }}>▸ Pasos</p>
                <div className="space-y-2">
                  {currentMet.pasos.map((p, i) => (
                    <div key={i} className="flex gap-3 bg-[#0F1438] border border-white/[0.06] rounded-lg p-3">
                      <div className="w-6 h-6 rounded grid place-items-center text-[0.68rem] font-mono font-bold shrink-0" style={{ background: `${currentMet.color}22`, color: currentMet.color }}>
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-mono text-[0.62rem] uppercase tracking-widest mb-0.5" style={{ color: currentMet.color }}>{p.k}</p>
                        <p className="text-[0.78rem] text-white-f/85 leading-relaxed">{p.v}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════ 7. BANCO DE PREGUNTAS ═══════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#D4AF4C] uppercase tracking-widest mb-3">Parte 3 · Banco de preguntas</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            25 preguntas que <span className="bg-gradient-to-r from-[#D4AF4C] to-[#FF6B9D] bg-clip-text text-transparent">tu canvas debe responder</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-8 leading-relaxed">
            Filtra por categoría · marca cada una que ya tienes respondida con evidencia. Cuando llegues a 25/25 estás listo para pitch al comité. Si te quedan ≤10, vuelve a discovery.
          </p>

          {/* Filtros categoría */}
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIAS.map((c) => {
              const active = catFilter === c.id;
              return (
                <button key={c.id} onClick={() => setCatFilter(c.id)} className="text-left rounded-lg px-3 py-2 border transition-all flex items-center gap-2" style={{
                  background: active ? `${c.color}22` : "rgba(255,255,255,0.02)",
                  borderColor: active ? c.color : "rgba(255,255,255,0.08)",
                }}>
                  <span style={{ color: c.color }}>{c.icon}</span>
                  <span className="text-[0.78rem] font-semibold text-white-f">{c.name}</span>
                  <span className="font-mono text-[0.6rem] text-muted">{c.count}</span>
                </button>
              );
            })}
          </div>

          {/* Progreso */}
          <div className="bg-gradient-to-br from-[#0F1438] via-[#0D1229] to-[#080C1F] border border-[#D4AF4C]/30 rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-gold">Tu progreso global</p>
              <p className="text-2xl font-bold font-mono">
                <span className="text-gold">{answeredQ.size}</span>
                <span className="text-muted"> / 25</span>
              </p>
            </div>
            <div className="w-full bg-white/[0.05] rounded-full h-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#FF6B9D] via-[#D4AF4C] to-[#00E5A0] transition-all duration-500" style={{ width: `${(answeredQ.size / 25) * 100}%` }} />
            </div>
          </div>

          {/* Lista de preguntas */}
          <div className="space-y-2">
            {filteredPreguntas.map((p) => {
              const cat = CATEGORIAS.find((c) => c.id === p.cat)!;
              const done = answeredQ.has(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggleQ(p.id)}
                  className="w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg border transition-all"
                  style={{
                    background: done ? `${cat.color}10` : "rgba(255,255,255,0.02)",
                    borderColor: done ? `${cat.color}55` : "rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="w-7 h-7 rounded-md grid place-items-center shrink-0 font-mono text-[0.7rem]" style={{
                    background: done ? cat.color : "rgba(255,255,255,0.05)",
                    border: done ? `1px solid ${cat.color}` : "1px solid rgba(255,255,255,0.10)",
                    color: done ? "#080C1F" : "rgba(255,255,255,0.5)",
                  }}>
                    {done ? "✓" : p.id}
                  </div>
                  <div className="flex-1">
                    <p className={`text-[0.85rem] leading-snug ${done ? "text-white-f/70 line-through" : "text-white-f/95"}`}>{p.t}</p>
                  </div>
                  <span className="font-mono text-[0.55rem] uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: `${cat.color}15`, color: cat.color, border: `1px solid ${cat.color}35` }}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>

          {answeredQ.size === 25 && (
            <div className="mt-5 bg-gradient-to-r from-[#00E5A0]/15 to-[#D4AF4C]/10 border border-[#00E5A0]/40 rounded-lg p-4 flex items-center gap-3 animate-fadeUp">
              <span className="text-3xl">🏆</span>
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[#00E5A0] mb-1">Las 25 respondidas con evidencia</p>
                <p className="text-[0.85rem] text-white-f/95 leading-relaxed">Tu proyecto está defendible · agenda 30 min con tu líder de área + manda canvas + define fecha de Discover. Estás en el 27% de proyectos IA en banca que llegan a producción.</p>
              </div>
            </div>
          )}
        </section>
      </RevealSection>

      {/* ═══════════ 8. STACK SELECTOR ═══════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#0F6CBD] uppercase tracking-widest mb-3">Parte 4 · Stack Selector</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            5 preguntas · <span className="bg-gradient-to-r from-[#0F6CBD] to-[#00E5A0] bg-clip-text text-transparent">una recomendación de stack BTG</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            No todo problema necesita Copilot Studio · no todo problema necesita n8n. Responde las 5 preguntas y obtén una recomendación heurística del stack más probable, con su alternativa.
          </p>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Preguntas */}
            <div className="space-y-4">
              {STACK_PREGUNTAS.map((sq, idx) => (
                <div key={sq.id} className="bg-[#0D1229] border border-white/[0.08] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded grid place-items-center font-mono text-[0.7rem] font-bold bg-[#0F6CBD]/22 text-[#0F6CBD] border border-[#0F6CBD]/40">
                      {idx + 1}
                    </span>
                    <p className="text-[0.85rem] font-semibold text-white-f">{sq.q}</p>
                  </div>
                  <div className="space-y-1.5">
                    {sq.options.map((o) => {
                      const selected = (answers as Record<string, string | undefined>)[sq.id] === o.v;
                      return (
                        <button
                          key={o.v}
                          onClick={() => setA(sq.id as keyof Answer, o.v)}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg border transition-all"
                          style={{
                            background: selected ? "rgba(15,108,189,0.15)" : "rgba(255,255,255,0.02)",
                            borderColor: selected ? "rgba(15,108,189,0.50)" : "rgba(255,255,255,0.06)",
                          }}
                        >
                          <div className="w-4 h-4 rounded-full grid place-items-center shrink-0" style={{
                            background: selected ? "#0F6CBD" : "transparent",
                            border: selected ? "1px solid #0F6CBD" : "1px solid rgba(255,255,255,0.20)",
                          }}>
                            {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <p className={`text-[0.78rem] ${selected ? "text-white-f" : "text-white-f/80"}`}>{o.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Resultado */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-gradient-to-br from-[#0F1438] via-[#0D1229] to-[#080C1F] border rounded-2xl p-6 min-h-[400px] flex flex-col" style={{ borderColor: stackResult ? `${stackResult.color}40` : "rgba(255,255,255,0.08)" }}>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-3" style={{ color: stackResult?.color ?? "#7A82A0" }}>▸ Recomendación heurística</p>

                {stackResult ? (
                  <>
                    <div className="mb-4">
                      <p className="text-[0.65rem] font-mono uppercase tracking-widest text-muted mb-1">Stack sugerido</p>
                      <h3 className="text-2xl font-bold text-white-f leading-tight">{stackResult.tool}</h3>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4 mb-3">
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1 text-cyan">▸ Por qué</p>
                      <p className="text-[0.82rem] text-white-f/90 leading-relaxed">{stackResult.reason}</p>
                    </div>
                    {stackResult.alt && (
                      <div className="bg-[#D4AF4C]/8 border border-[#D4AF4C]/30 rounded-lg p-3 mb-4">
                        <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1 text-gold">▸ Alternativa / escalado</p>
                        <p className="text-[0.78rem] text-white-f/85 leading-relaxed">{stackResult.alt}</p>
                      </div>
                    )}
                    <button
                      onClick={() => setAnswers({})}
                      className="mt-auto self-start font-mono text-[0.65rem] uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.10] text-muted hover:text-white-f hover:bg-white/[0.10]"
                    >
                      ↻ Reiniciar
                    </button>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <p className="text-5xl mb-3 opacity-30">⚙</p>
                    <p className="text-[0.85rem] text-muted italic max-w-xs">Responde las 5 preguntas a la izquierda · la recomendación aparece aquí con su justificación.</p>
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted/60 mt-4">{Object.keys(answers).length} / 5 respondidas</p>
                  </div>
                )}
              </div>

              {/* Aviso */}
              <p className="text-[0.65rem] text-muted/70 italic mt-3 leading-relaxed">
                * Recomendación heurística basada en las 4 preguntas más discriminantes · siempre valida con tu líder técnico y con tu DPO antes de comprometer presupuesto.
              </p>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════ 9. BUENAS PRACTICAS ═══════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#E85A1F] uppercase tracking-widest mb-3">Parte 5 · Buenas prácticas</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            10 reglas que <span className="bg-gradient-to-r from-[#E85A1F] to-[#FF6B9D] bg-clip-text text-transparent">los proyectos que sobreviven</span> tienen en común
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            No son opiniones · son patrones observados en pilotos exitosos en banca corporativa LATAM y EMEA durante 2024-2026. Si tu canvas las viola, tienes el riesgo de unirte al 73%.
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            {PRACTICAS.map((p) => (
              <div key={p.n} className="bg-[#0D1229] border rounded-xl p-4 flex gap-3 hover:border-white/[0.20] transition-all" style={{ borderColor: `${p.c}30` }}>
                <div className="w-10 h-10 rounded-lg grid place-items-center font-mono text-sm font-bold shrink-0" style={{ background: `${p.c}22`, color: p.c, border: `1px solid ${p.c}50` }}>
                  {p.n}
                </div>
                <div>
                  <p className="text-[0.92rem] font-bold text-white-f mb-1">{p.t}</p>
                  <p className="text-[0.76rem] text-white-f/80 leading-relaxed">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════ 10. WORKSHOP ═══════════ */}
      <RevealSection>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[0.72rem] text-[#FF6B9D] uppercase tracking-widest mb-3">Workshop · 1 hora antes de pedir aprobación</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            La sesión que <span className="bg-gradient-to-r from-[#FF6B9D] to-[#5B52D5] bg-clip-text text-transparent">sí o sí ahorras un mes</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-10 leading-relaxed">
            60 minutos · 4-6 personas · 1 problema. Esta agenda es la versión condensada de todo lo de la sesión · diseñada para ejecutarla con tu equipo sin facilitador externo.
          </p>

          <div className="grid md:grid-cols-7 gap-2">
            {WORKSHOP.map((w, i) => (
              <div key={i} className="bg-[#0D1229] border rounded-xl p-4 flex flex-col" style={{ borderColor: `${w.color}40` }}>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-1" style={{ color: w.color }}>{w.time} min</p>
                <p className="text-[0.85rem] font-bold text-white-f leading-tight mb-2">{w.title}</p>
                <p className="text-[0.7rem] text-white-f/75 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-br from-[#FF6B9D]/12 to-[#5B52D5]/8 border border-[#FF6B9D]/30 rounded-2xl p-6">
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[#FF6B9D] mb-2">▸ Output esperado del workshop</p>
            <ul className="grid md:grid-cols-2 gap-2 text-[0.82rem] text-white-f/90">
              <li className="flex items-start gap-2"><span className="text-[#FF6B9D]">▪</span>Cadena de 5 porqués documentada con causa raíz identificada</li>
              <li className="flex items-start gap-2"><span className="text-[#FF6B9D]">▪</span>2 HMWs bien calibrados con votos del equipo</li>
              <li className="flex items-start gap-2"><span className="text-[#FF6B9D]">▪</span>~30 ideas dibujadas en Crazy 8s · top-3 votadas</li>
              <li className="flex items-start gap-2"><span className="text-[#FF6B9D]">▪</span>Top-3 pasadas por 7 lentes SCAMPER · 1-2 supervivientes</li>
              <li className="flex items-start gap-2"><span className="text-[#FF6B9D]">▪</span>5 razones de falla del pre-mortem · plan de riesgos inicial</li>
              <li className="flex items-start gap-2"><span className="text-[#FF6B9D]">▪</span>3 commitments con dueño y fecha para los próximos 7 días</li>
            </ul>
          </div>
        </section>
      </RevealSection>

      {/* ═══════════ 11. CIERRE ═══════════ */}
      <RevealSection>
        <section className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,107,157,0.08),transparent)] pointer-events-none" />

          <div className="relative bg-gradient-to-br from-[#0F1438] via-[#0D1229] to-[#080C1F] border border-white/[0.08] rounded-3xl p-8 md:p-12">
            <p className="font-mono text-[0.72rem] text-[#FF6B9D] uppercase tracking-widest mb-3">Cierre · sesión 9</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
              Lo que sale contigo · <span className="bg-gradient-to-r from-[#FF6B9D] via-[#5B52D5] to-[#00E5A0] bg-clip-text text-transparent">y la primera tarea</span>
            </h2>
            <p className="text-lg text-muted max-w-3xl mb-8 leading-relaxed">
              Esta sesión no se aprueba con asistencia · se aprueba con un workshop ejecutado en tu área. La diferencia entre quien construye lo correcto y quien construye lo cómodo está en estos 60 minutos de pensar antes.
            </p>

            <div className="grid md:grid-cols-3 gap-3 mb-8">
              {[
                { k: "Mentalidad", v: "First principles · inversión · pre-mortem · beginner's · constraint-led", c: "#5B52D5" },
                { k: "Método", v: "SCAMPER · HMW · Crazy 8s · Reverse Brainstorm · 5 Porqués", c: "#00E5A0" },
                { k: "Decisión", v: "25 preguntas + Stack Selector + 10 buenas prácticas", c: "#D4AF4C" },
              ].map((s) => (
                <div key={s.k} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                  <p className="font-mono text-[0.58rem] uppercase tracking-widest mb-1.5" style={{ color: s.c }}>{s.k}</p>
                  <p className="text-[0.85rem] font-bold text-white-f leading-snug">{s.v}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/[0.06]">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[#FF6B9D] mb-2">Primera tarea · 7 días</p>
              <p className="text-[0.88rem] text-white-f/90 italic leading-relaxed">
                &ldquo;Agenda 60 minutos con 4-6 personas de tu área. Lleva un dolor real (no inventado) y corre el workshop tal cual está descrito. Llegas a Sesión 10 con: cadena de 5 porqués, 2 HMW votados, 30+ ideas, top-3 cribadas por SCAMPER, pre-mortem y 3 commitments. Ese es el material que entra al Canvas BTG la siguiente sesión PLUS · y la materia prima de tu proyecto integrador.&rdquo;
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/sesion/plus" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5A0]/20 to-[#D4AF4C]/20 border border-[#00E5A0]/40 text-[#00E5A0] font-semibold text-[0.78rem] hover:from-[#00E5A0]/30 hover:to-[#D4AF4C]/30 transition-all">
                → Sesión PLUS · llenar el Canvas BTG
              </a>
              <a href="/sesion/8" className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white-f font-semibold text-[0.78rem] hover:bg-white/10 transition-all">
                ← Sesión 8 · Copilot Studio
              </a>
              <a href="/" className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-muted font-semibold text-[0.78rem] hover:bg-white/10 transition-all">
                Volver al mapa
              </a>
            </div>
          </div>
        </section>
      </RevealSection>
    </div>
  );
}
