"use client";

import { useEffect, useMemo, useState } from "react";
import RevealSection from "@/components/RevealSection";

/* ════════════════════════════ DATA ════════════════════════════ */

const OBJETIVOS = [
  { icon: "◐", title: "Piensas antes de prototipar", detail: "Reconoces cuándo lanzarte a construir es trampa · cuándo merece otra ronda de divergencia." },
  { icon: "✺", title: "Operas 5 mentalidades", detail: "First principles, inversion, pre-mortem, beginner's mind y constraint-led como músculos diarios." },
  { icon: "✦", title: "Diverges con método", detail: "SCAMPER, How Might We, Crazy 8s, Reverse Brainstorm y 5 Porqués al servicio de proyectos IA en banca." },
  { icon: "?", title: "Haces las preguntas correctas", detail: "25 preguntas orientadoras con evidencia esperada · tu canvas no entra al comité sin pasarlas." },
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
    icon: "💀",
  },
  {
    n: "02",
    title: "Las mejores soluciones IA no incluyen IA",
    detail: "Patrón observado en revisiones internas de programas similares: ~40% de los problemas planteados como 'caso de uso de IA' se resuelven mejor con un cambio de proceso, un SharePoint con permisos correctos, o una macro de Excel que ya existía.",
    tag: "Patrón LATAM",
    color: "#E85A1F",
    icon: "⚠",
  },
  {
    n: "03",
    title: "La idea promedio dura 18 minutos en sesión creativa",
    detail: "Estudios IDEO + Stanford d.school: el primer pensamiento gana por defecto. Sin método divergente, el equipo converge a la primera idea aceptable · no a la mejor. Y en banca, 'aceptable' significa caro de revertir.",
    tag: "d.school",
    color: "#D4AF4C",
    icon: "⏱",
  },
  {
    n: "04",
    title: "Preguntar bien vale 100× más que responder rápido",
    detail: "El costo de un proyecto IA mal definido en banca corporativa (data engineering, licencias, change management, riesgo regulatorio) puede superar los USD 200K. El costo de 90 min de preguntas correctas: cero. La asimetría es brutal.",
    tag: "Asimetría",
    color: "#7C3AED",
    icon: "?",
  },
];

/* ═══ 5 MENTALIDADES ═══ */
const MENTALIDADES = [
  {
    id: "first",
    name: "First Principles",
    iconText: "△",
    color: "#00E5A0",
    one: "Romper el problema hasta lo irreductible y reconstruir desde ahí, sin asumir cómo se hace hoy.",
    detail: "Pregunta clave: '¿Qué tendría que ser verdad para que esto funcione?' Ignora cómo lo hace la competencia, cómo lo hace el banco hoy, cómo te lo enseñaron. Empieza por físicas, economía y comportamiento humano.",
    btg: "Antes de proponer 'agente IA para due diligence', pregúntate: ¿qué hace de verdad un analyst senior con 10 años? ¿Qué señales lee? ¿Qué descarta sin mirar? ¿Eso es replicable?",
    quote: "&ldquo;Si lo razonas por analogía nunca harás algo realmente nuevo.&rdquo; — Elon Musk",
  },
  {
    id: "inversion",
    name: "Inversion · pensar al revés",
    iconText: "↺",
    color: "#5B52D5",
    one: "No preguntes cómo tener éxito · pregunta cómo garantizar fracaso, y luego no hagas eso.",
    detail: "Charlie Munger: 'Invierte siempre, invierte.' Es más fácil identificar qué destruye un proyecto que qué lo hace ganar. Lista las 10 maneras seguras de matarlo, y diseña para evitar cada una.",
    btg: "¿Cómo garantizo que el agente Copilot falle en producción? Datos sucios, sin champion, sin métrica, sin permisos, sin entrenamiento, sin red flag. La lista invertida es tu plan de implementación real.",
    quote: "&ldquo;Quiero saber dónde voy a morir, para nunca ir ahí.&rdquo; — Charlie Munger",
  },
  {
    id: "premortem",
    name: "Pre-mortem · funeral del proyecto",
    iconText: "✝",
    color: "#DC2626",
    one: "Imagina que el proyecto ya fracasó · escribe el obituario · diseña para evitar cada causa.",
    detail: "Gary Klein, 1989. Estudios muestran que el pre-mortem identifica 30% más razones de falla que el análisis tradicional. La distancia psicológica de 'ya falló' destraba honestidad.",
    btg: "Es enero 2027. El proyecto se canceló. Como equipo escribimos en 15 min: ¿Por qué falló? ¿Qué subestimamos? ¿Qué nadie quiso decir en la kickoff? Las respuestas son tu lista de riesgos reales.",
    quote: "&ldquo;Los equipos que hacen pre-mortem identifican 30% más causas de falla que los que solo planean.&rdquo; — HBR 2007",
  },
  {
    id: "beginner",
    name: "Beginner's Mind · 初心",
    iconText: "○",
    color: "#0F6CBD",
    one: "Hablar con el problema como si fuera tu primer día · sin las certezas que dan los años en banca.",
    detail: "Shoshin (zen). El experto ve lo que espera ver. El principiante ve lo que está. Antes de cada sesión de diseño, una persona del equipo debe asumir el rol de 'idiota productivo': pregunta lo obvio, cuestiona los acrónimos, pide repetir.",
    btg: "¿Por qué tenemos que mandar el reporte el viernes? ¿Por qué Bloomberg y no otra fuente? ¿Por qué un PDF y no un Teams message? El idiota productivo desbloquea preguntas que el equipo ya naturalizó.",
    quote: "&ldquo;En la mente del principiante hay muchas posibilidades; en la del experto, pocas.&rdquo; — Shunryu Suzuki",
  },
  {
    id: "constraint",
    name: "Constraint-Led · la restricción como musa",
    iconText: "▣",
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
    iconText: "⚒",
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
    iconText: "?",
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
    iconText: "⚡",
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
    iconText: "↺",
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
    iconText: "5",
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

/* ═══ BANCO DE PREGUNTAS · ORIENTADORAS ═══ */
type Pregunta = { id: number; cat: string; t: string; why: string; evidence: string; tip: string };

const PREGUNTAS: Pregunta[] = [
  {
    id: 1, cat: "job",
    t: "¿Puedo escribir el job en una frase Cuando-Quiero-Para que sin mencionar IA ni tecnología?",
    why: "Si necesitas mencionar la tecnología en el job, estás vendiéndola, no resolviendo un problema.",
    evidence: "Una frase escrita textual que pase el test de leerla a un banker sin contexto y que diga: 'sí, eso es mi vida diaria'.",
    tip: "Test rápido: dale tu frase a un colega que NO esté en el proyecto · si pregunta '¿y qué hace eso?' la frase está mal.",
  },
  {
    id: 2, cat: "job",
    t: "¿Quién es el job-doer concreto (rol + área + seniority + % de tiempo en este job)?",
    why: "Soluciones diseñadas para 'todo el equipo' no sirven a nadie. Un junior y un MD viven jobs distintos.",
    evidence: "Nombre y apellido de 3 personas reales · su rol exacto · su % de tiempo en el job · sus calendarios típicos.",
    tip: "Si tu job-doer es 'el área de IB' está mal. Si es 'analyst-associate de IB con <3 años en M&A' está bien.",
  },
  {
    id: 3, cat: "job",
    t: "¿He hablado con al menos 5 job-doers reales antes de proponer la solución?",
    why: "El sesgo de imaginar al usuario es la primera causa de productos que nadie usa.",
    evidence: "Notas de 5 entrevistas de 30 min mínimo · grabadas o transcritas · con preguntas abiertas, no de encuesta.",
    tip: "Pregunta abiertas: 'cuéntame del último teaser que viste' · NO 'usarías una IA para ayudarte?'",
  },
  {
    id: 4, cat: "job",
    t: "¿Este job ocurre con qué frecuencia y cuánto tiempo cuesta hoy?",
    why: "Sin volumen × tiempo no hay ROI · y sin ROI no hay caso de negocio.",
    evidence: "Tabla: frecuencia mensual del job · tiempo promedio actual · tiempo objetivo · # personas afectadas.",
    tip: "Si ocurre <4 veces al mes y toma <2h, probablemente no merece IA dedicada. Considera un prompt guardado.",
  },
  {
    id: 5, cat: "job",
    t: "¿Qué hace el job-doer hoy cuando no tiene la solución? ¿Funciona?",
    why: "Si ya funciona el workaround actual, tu IA debe ser dramáticamente mejor para vencer la inercia.",
    evidence: "Descripción del flujo actual paso a paso · qué herramienta usa hoy · cuáles son sus 'plantillas mágicas'.",
    tip: "Pídele que te haga un walk-through grabado · vas a ver atajos y workarounds que jamás verbaliza.",
  },
  {
    id: 6, cat: "datos",
    t: "¿Existen los datos que necesito? ¿Dónde viven? ¿Quién los gobierna?",
    why: "El 60% de los proyectos IA termina siendo un proyecto de data engineering disfrazado.",
    evidence: "Lista de fuentes con: ubicación (sistema, ruta), dueño (área, persona), volumen aprox, frecuencia de actualización.",
    tip: "Si la respuesta es 'creo que están en SharePoint pero no estoy seguro', tu primer mes es discovery de datos, no IA.",
  },
  {
    id: 7, cat: "datos",
    t: "¿Cuál es la clasificación P-I/II/III/IV de cada dataset que usaré?",
    why: "El nivel P determina qué stack puedes usar, qué controles aplican y si necesitas aprobación de DPO.",
    evidence: "Tabla por dataset con P-level, criterio de clasificación y aprobador. Validada por área de seguridad.",
    tip: "P-III/P-IV obliga a tenant Azure interno con private endpoint. P-II permite Copilot M365. P-I permite herramientas externas.",
  },
  {
    id: 8, cat: "datos",
    t: "¿Los datos tienen la calidad suficiente, o el proyecto real es de limpieza de datos?",
    why: "Garbage in = garbage out. Y en banca, garbage out = sanción regulatoria.",
    evidence: "Análisis exploratorio: % de campos vacíos, % de duplicados, distribuciones, casos atípicos identificados.",
    tip: "Si el data steward del área te dice 'esos datos no los usamos para decidir', no los uses para entrenar agentes que sí decidan.",
  },
  {
    id: 9, cat: "datos",
    t: "¿Hay PII, secreto bancario, o data del cliente? ¿Qué controles aplica Habeas Data / SFC?",
    why: "Tratamiento de datos personales sin base de tratamiento clara puede llevar a multa SIC y sanción reputacional.",
    evidence: "Mapa de datos personales con base de tratamiento (consentimiento, contrato, obligación legal) · firma DPO.",
    tip: "Pregunta clave al DPO: '¿este uso entra en la finalidad declarada en el aviso de privacidad?' Si no, hay que actualizarlo antes.",
  },
  {
    id: 10, cat: "datos",
    t: "¿Los datos son representativos del caso real o solo del histórico cómodo?",
    why: "Si solo entrenas con casos exitosos, el modelo no aprende a reconocer fraude · solo a reconocer no-fraude.",
    evidence: "Confirmación de que el dataset cubre: casos positivos y negativos, períodos volátiles y tranquilos, perfiles diversos.",
    tip: "Pide al data scientist hacer un análisis de drift histórico · si los últimos 6 meses se ven distintos al año pasado, riesgo.",
  },
  {
    id: 11, cat: "riesgo",
    t: "¿Qué pasa si el modelo alucina en este caso? ¿Quién paga el costo?",
    why: "El costo de una alucinación va desde 'una conversación incómoda' hasta 'multa SFC + portada de prensa'.",
    evidence: "Tabla de modos de falla con: tipo de error, probabilidad estimada, impacto (USD o categórico), mitigación, dueño.",
    tip: "Categorías de impacto: bajo (rehacer 30 min) · medio (reproceso 1 día) · alto (decisión equivocada que afecta cliente) · crítico (regulatorio).",
  },
  {
    id: 12, cat: "riesgo",
    t: "¿Esto cae bajo EU AI Act high-risk, SARLAFT, DORA, alguna CBJ de la SFC?",
    why: "Caer en una categoría regulada cambia el costo del proyecto en 3-10×. Saberlo desde el día 1 evita rediseños.",
    evidence: "Mapeo regulatorio firmado por Legal/Compliance · listado de obligaciones específicas (transparencia, auditoría, log, etc).",
    tip: "EU AI Act high-risk si afecta acceso a servicios financieros, scoring crediticio o detección de fraude · revisa Anexo III.",
  },
  {
    id: 13, cat: "riesgo",
    t: "¿Cuál es el plan si el proveedor del modelo cambia de precio, política o desaparece?",
    why: "Anthropic, OpenAI, Microsoft cambian precios y políticas cada 6-12 meses · sin plan B tienes lock-in caro.",
    evidence: "Documento de exit strategy: modelo alternativo, costo de migración, tiempo estimado, criterios de activación.",
    tip: "Diseña tu prompt y tu pipeline para ser portables · evita features propietarios profundos hasta validar caso de negocio.",
  },
  {
    id: 14, cat: "riesgo",
    t: "¿Hay vector de prompt injection desde inputs externos (clientes, contrapartes, papers)?",
    why: "Un PDF de un cliente puede contener instrucciones que reescriben el comportamiento del agente.",
    evidence: "Pipeline de sanitización documentado · pruebas adversariales con 10+ ataques conocidos · log de intentos detectados.",
    tip: "Si tu agente lee documentos externos y tiene tools (Excel, email, APIs), tu riesgo es alto. Sanitiza con Docling o similar.",
  },
  {
    id: 15, cat: "riesgo",
    t: "¿El log de qué decidió el modelo es auditable a 7 años?",
    why: "SFC y Habeas Data exigen poder reproducir la decisión años después · sin log, no hay defensa en auditoría.",
    evidence: "Esquema de log con: input completo, output, modelo usado, versión, timestamp, usuario, contexto · retención 7 años mínimo.",
    tip: "Log inmutable (write-once) en blob storage con políticas de retención · evita logs en memoria o efímeros.",
  },
  {
    id: 16, cat: "costo",
    t: "¿Cuánto cuesta operar esto al mes (tokens, licencias, infra) por usuario?",
    why: "Proyectos exitosos crecen · si el costo unitario no escala, el éxito te quiebra.",
    evidence: "Modelo de costos: tokens/usuario/mes × precio + licencias + infra · estimación pesimista (3× el promedio).",
    tip: "Mide el costo en pesos por decisión tomada, no en USD/mes. Si la decisión cuesta más que el tiempo humano que ahorra, redesign.",
  },
  {
    id: 17, cat: "costo",
    t: "¿El cost-per-decision es menor que el tiempo humano que reemplaza?",
    why: "Si una decisión cuesta USD 5 al modelo y USD 3 en tiempo humano, no estás automatizando · estás encareciendo.",
    evidence: "Comparativo: tiempo × costo hora-equivalente vs costo por inferencia. ROI claro con sensibilidad ±30%.",
    tip: "Calcula con caso pesimista: 50% más tokens que estimado + salario hora total (no solo bruto · incluye carga prestacional).",
  },
  {
    id: 18, cat: "costo",
    t: "¿El stack tecnológico ya está pagado en BTG o necesito licencia nueva?",
    why: "Usar lo que ya está pagado evita comité de compras, reduce time-to-value y entra por gobierno existente.",
    evidence: "Mapeo de cada componente con: licencia disponible (sí/no), # de seats consumidos, costo marginal de añadir.",
    tip: "Antes de proponer Claude API, valida que Copilot M365 / Power Platform / Azure OpenAI ya pagados no lo resuelven.",
  },
  {
    id: 19, cat: "costo",
    t: "¿Cuánto cuesta NO hacer este proyecto durante 12 meses?",
    why: "El costo de la inacción es lo que justifica el proyecto · sin ese número, defender presupuesto es opinión.",
    evidence: "Costo anual del status quo: horas × salario × volumen + errores actuales × costo del error + oportunidades perdidas.",
    tip: "Si no puedes calcular este número, probablemente el problema no duele lo suficiente para invertir.",
  },
  {
    id: 20, cat: "costo",
    t: "¿El ROI esperado es defendible con números, o es un cuento?",
    why: "Comités aprueban casos defendibles · no inspiraciones. Y a 6 meses te van a pedir las cifras prometidas.",
    evidence: "Caso de negocio con 3 escenarios (pesimista, base, optimista), payback period, supuestos explícitos por cada cifra.",
    tip: "Para cada cifra del caso de negocio, fuente: 'tiempo actual: medición de 5 personas durante 1 semana de junio 2026'.",
  },
  {
    id: 21, cat: "adopcion",
    t: "¿Quién es el champion concreto que va a defenderlo en su equipo cada semana?",
    why: "Sin un humano específico con piel en el juego, los proyectos IA mueren en el primer mes de bajos uses.",
    evidence: "Nombre del champion · su rol · su KPI 2026 alineado con el éxito del proyecto · su commitment de 4h/semana mínimo.",
    tip: "El champion ideal: es un job-doer respetado, no su jefe. Lidera por uso, no por mandato.",
  },
  {
    id: 22, cat: "adopcion",
    t: "¿Qué tendría que dejar de hacer un usuario para que esto le ahorre tiempo de verdad?",
    why: "Sumar IA encima del trabajo existente no ahorra tiempo · solo lo redistribuye y agrega cognitive load.",
    evidence: "Mapa actual vs futuro del flujo del usuario: qué pasos desaparecen, cuáles se reemplazan, cuáles aparecen.",
    tip: "Test del día 60: pregunta al usuario '¿qué dejaste de hacer?' Si responde 'nada, pero lo uso a veces', no estás cambiando comportamiento.",
  },
  {
    id: 23, cat: "adopcion",
    t: "¿Cómo se mide la adopción? ¿Logins, ejecuciones, o cambio de comportamiento?",
    why: "Logins son vanity · cambio de comportamiento es lo único que mueve la aguja.",
    evidence: "1 métrica leading (uso semanal por usuario) + 1 lagging (cambio en el flujo actual) + cohorte para comparar.",
    tip: "Métrica de oro: % de tareas X que se hacen con el agente vs sin el agente, semana a semana. Si crece, ganaste.",
  },
  {
    id: 24, cat: "adopcion",
    t: "¿El cambio de proceso requiere actualizar manuales, formación, KPIs individuales?",
    why: "Si los KPIs siguen midiendo el flujo viejo, el equipo seguirá haciendo el flujo viejo. Sin alineación, no hay adopción.",
    evidence: "Lista de artefactos a actualizar: manuales, training, KPIs del equipo, evaluación de desempeño · con dueño y fecha.",
    tip: "RR.HH. tiene que entrar en el proyecto desde el día 1. Si entra al mes 6 a 'ayudar con el rollout', perdiste.",
  },
  {
    id: 25, cat: "adopcion",
    t: "¿Hay un grupo de 5-8 usuarios que YA pidió esto, o estoy empujando algo que nadie pidió?",
    why: "Demanda pull existe → proyecto saca tracción solo. Demanda push artificial → mueres luchando contra resistencia.",
    evidence: "5+ correos, mensajes Teams o quotes de entrevistas donde usuarios reales piden algo cercano a tu propuesta.",
    tip: "Si tienes que convencer a la gente de que necesita esto, probablemente no lo necesita. Cambia de job o de área.",
  },
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
  if (a.freq === "raro" && a.tarea === "redaccion" && a.deadline === "hoy") {
    return { tool: "Solo un prompt bien hecho (Claude / Copilot M365)", reason: "Frecuencia baja + tarea de pensamiento + deadline corto = no necesitas infra. Un prompt bien diseñado y guardado en tu OneDrive resuelve el job sin construir nada.", color: "#00E5A0", alt: "Si lo repites más de 3 veces, considera un Copilot Custom Agent" };
  }
  if (a.data === "sensible" && a.usuario === "banco") {
    return { tool: "Power Platform + Copilot Studio (tenant BTG)", reason: "Data regulada + escala enterprise exige permanecer dentro del perímetro Azure BTG. Copilot Studio con knowledge curado + Dataverse + Power Apps cumple SFC y permite gobernanza por DLP.", color: "#5B52D5", alt: "Para casos de muy alto riesgo: complementa con AI Builder on-tenant o modelo Azure OpenAI con private endpoint" };
  }
  if (a.tarea === "agente") {
    return { tool: "Copilot Studio · agente con knowledge curado", reason: "Conversación o acción autónoma se modela como agente con topics, knowledge y triggers. Si la audiencia es interna, Copilot Studio nativo. Si es externo, evalúa Custom Engine Agent.", color: "#0F6CBD", alt: "Si requiere orquestación compleja con APIs externas, usa Copilot Studio + Power Automate como tool" };
  }
  if (a.tarea === "orquestar") {
    const tool = a.data === "sensible" ? "Power Automate · cloud flow" : "n8n · self-hosted o cloud";
    const reason = a.data === "sensible"
      ? "Mover datos sensibles entre sistemas BTG = Power Automate dentro del tenant + DLP policies. Connector certificados + audit trail nativo."
      : "Orquestación rápida, conectores comunitarios, sin compromiso de licencia M365. Ideal para pilotos antes de promoverlos a Power Automate.";
    return { tool, reason, color: "#E85A1F", alt: "Si el flujo madura y va a producción interna, migra a Power Automate para gobernanza enterprise" };
  }
  if (a.tarea === "app") {
    return { tool: "Power Apps Canvas + Dataverse", reason: "Formularios, flujos de aprobación, lista de items con CRUD = Power Apps Canvas. Conecta a Dataverse para gobernanza, o a SharePoint si es ligero. Power Automate para los workflows.", color: "#D4AF4C", alt: "Para apps móviles dedicadas usa Power Apps Mobile. Para portales externos a clientes evalúa Power Pages" };
  }
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
  { time: "00-05", title: "Reglas + setup", desc: "Pizarra/Miro, 4-6 personas, timer visible, 1 facilitador. Prohibido criticar ideas en bloques 2, 3, 4. Solo divergir.", color: "#FF6B9D", minutos: 5 },
  { time: "05-15", title: "5 Porqués sobre el dolor", desc: "Una persona declara el problema · el grupo pregunta '¿por qué?' 5 veces en cadena. Producto: cadena causal documentada.", color: "#0EA5E9", minutos: 10 },
  { time: "15-25", title: "HMW + reformulación", desc: "Convertir el problema en 5 'How Might We' distintos · variar alcance y sujeto. Votar 1-2 para explorar.", color: "#00E5A0", minutos: 10 },
  { time: "25-35", title: "Crazy 8s individual", desc: "8 min · 8 ideas por persona · sin hablar. Después, cada uno presenta sus 8 en 2 min sin justificar.", color: "#5B52D5", minutos: 10 },
  { time: "35-45", title: "Dot-voting + SCAMPER sobre top 3", desc: "Equipo vota 3 ideas con dots · aplican 7 lentes SCAMPER sobre cada una. Filtro: idea sobrevive al lente o muere.", color: "#D4AF4C", minutos: 10 },
  { time: "45-55", title: "Pre-mortem · funeral del proyecto", desc: "Asumir que la idea fracasó en enero 2027 · escribir las 5 razones más probables. Esa lista es el plan de riesgos.", color: "#DC2626", minutos: 10 },
  { time: "55-60", title: "Próximos pasos · 3 commitments", desc: "Quién habla con qué job-doer en los próximos 7 días · quién valida P-level y licencias · quién hace MVP de papel.", color: "#E85A1F", minutos: 5 },
];

/* ════════════════════════════ SVG VISUALES ════════════════════════════ */

function MentalidadSVG({ id, color }: { id: string; color: string }) {
  const stroke = color;
  const wrap = "w-full h-full";
  switch (id) {
    case "first":
      return (
        <svg viewBox="0 0 100 100" className={wrap} fill="none">
          <polygon points="50,15 85,80 15,80" stroke={stroke} strokeWidth="2" />
          <line x1="50" y1="15" x2="50" y2="80" stroke={stroke} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
          <line x1="15" y1="80" x2="85" y2="80" stroke={stroke} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
          <circle cx="50" cy="80" r="3" fill={stroke} />
          <text x="50" y="92" textAnchor="middle" fontSize="6" fill={stroke} opacity="0.7" fontFamily="monospace">irreducible</text>
        </svg>
      );
    case "inversion":
      return (
        <svg viewBox="0 0 100 100" className={wrap} fill="none">
          <path d="M 20 30 Q 50 10 80 30" stroke={stroke} strokeWidth="2" />
          <polygon points="78,25 84,30 78,35" fill={stroke} />
          <path d="M 80 70 Q 50 90 20 70" stroke={stroke} strokeWidth="2" strokeDasharray="2 3" opacity="0.7" />
          <polygon points="22,75 16,70 22,65" fill={stroke} opacity="0.7" />
          <text x="50" y="55" textAnchor="middle" fontSize="7" fill={stroke} fontFamily="monospace" opacity="0.8">↺</text>
        </svg>
      );
    case "premortem":
      return (
        <svg viewBox="0 0 100 100" className={wrap} fill="none">
          <rect x="35" y="40" width="30" height="42" rx="2" stroke={stroke} strokeWidth="2" />
          <circle cx="50" cy="34" r="5" stroke={stroke} strokeWidth="2" />
          <line x1="35" y1="50" x2="65" y2="50" stroke={stroke} strokeWidth="1" opacity="0.5" />
          <text x="50" y="60" textAnchor="middle" fontSize="6" fill={stroke} fontFamily="monospace">2027</text>
          <text x="50" y="71" textAnchor="middle" fontSize="5" fill={stroke} opacity="0.7" fontFamily="monospace">RIP</text>
          <line x1="20" y1="84" x2="80" y2="84" stroke={stroke} strokeWidth="1" opacity="0.3" />
        </svg>
      );
    case "beginner":
      return (
        <svg viewBox="0 0 100 100" className={wrap} fill="none">
          <circle cx="50" cy="50" r="32" stroke={stroke} strokeWidth="2" />
          <circle cx="50" cy="50" r="2" fill={stroke} />
          <circle cx="50" cy="50" r="20" stroke={stroke} strokeWidth="1" opacity="0.4" />
          <circle cx="50" cy="50" r="10" stroke={stroke} strokeWidth="1" opacity="0.6" />
        </svg>
      );
    case "constraint":
      return (
        <svg viewBox="0 0 100 100" className={wrap} fill="none">
          <rect x="20" y="20" width="60" height="60" stroke={stroke} strokeWidth="2" rx="3" />
          <rect x="32" y="32" width="36" height="36" stroke={stroke} strokeWidth="1" opacity="0.5" rx="2" />
          <rect x="44" y="44" width="12" height="12" fill={stroke} opacity="0.8" rx="1" />
          <text x="50" y="92" textAnchor="middle" fontSize="5.5" fill={stroke} opacity="0.7" fontFamily="monospace">2 sem · P-II</text>
        </svg>
      );
    default:
      return null;
  }
}

function MetodoSVG({ id, color }: { id: string; color: string }) {
  const stroke = color;
  switch (id) {
    case "scamper":
      return (
        <svg viewBox="0 0 280 60" className="w-full h-full" fill="none">
          {["S", "C", "A", "M", "P", "E", "R"].map((l, i) => (
            <g key={l} transform={`translate(${10 + i * 38},10)`}>
              <rect width="32" height="40" rx="6" stroke={stroke} strokeWidth="1.5" />
              <text x="16" y="26" textAnchor="middle" fontSize="16" fontWeight="bold" fill={stroke}>{l}</text>
            </g>
          ))}
        </svg>
      );
    case "hmw":
      return (
        <svg viewBox="0 0 280 80" className="w-full h-full" fill="none">
          <text x="140" y="48" textAnchor="middle" fontSize="36" fontWeight="bold" fill={stroke}>?</text>
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2;
            const cx = 140 + Math.cos(a) * 60;
            const cy = 40 + Math.sin(a) * 28;
            return <circle key={i} cx={cx} cy={cy} r="7" stroke={stroke} strokeWidth="1.5" opacity={0.4 + i * 0.1} />;
          })}
        </svg>
      );
    case "crazy8":
      return (
        <svg viewBox="0 0 280 80" className="w-full h-full" fill="none">
          {Array.from({ length: 8 }).map((_, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            return (
              <g key={i} transform={`translate(${10 + col * 68},${5 + row * 38})`}>
                <rect width="60" height="32" rx="3" stroke={stroke} strokeWidth="1.5" opacity={0.4 + i * 0.07} />
                <text x="30" y="22" textAnchor="middle" fontSize="13" fontWeight="bold" fill={stroke} opacity="0.6">{i + 1}</text>
              </g>
            );
          })}
        </svg>
      );
    case "reverse":
      return (
        <svg viewBox="0 0 280 80" className="w-full h-full" fill="none">
          <text x="60" y="48" textAnchor="middle" fontSize="14" fill={stroke}>resolverlo</text>
          <line x1="115" y1="42" x2="165" y2="42" stroke={stroke} strokeWidth="2" />
          <polygon points="163,38 170,42 163,46" fill={stroke} />
          <text x="225" y="38" textAnchor="middle" fontSize="14" fill={stroke}>romperlo</text>
          <line x1="165" y1="56" x2="115" y2="56" stroke={stroke} strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
          <polygon points="117,52 110,56 117,60" fill={stroke} opacity="0.7" />
          <text x="225" y="68" textAnchor="middle" fontSize="9" fill={stroke} opacity="0.7" fontFamily="monospace">invertir</text>
        </svg>
      );
    case "fiveWhy":
      return (
        <svg viewBox="0 0 280 80" className="w-full h-full" fill="none">
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(${20 + i * 55},20)`}>
              <circle cx="20" cy="20" r="16" stroke={stroke} strokeWidth="1.5" opacity={0.5 + i * 0.1} />
              <text x="20" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill={stroke}>?</text>
              {i < 4 && <line x1="40" y1="20" x2="55" y2="20" stroke={stroke} strokeWidth="1.5" opacity="0.6" />}
            </g>
          ))}
          <text x="140" y="70" textAnchor="middle" fontSize="9" fill={stroke} opacity="0.7" fontFamily="monospace">→ causa raíz</text>
        </svg>
      );
    default:
      return null;
  }
}

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
  const [expandedQ, setExpandedQ] = useState<number | null>(1);
  const [answeredQ, setAnsweredQ] = useState<Set<number>>(new Set());
  const toggleAnswered = (i: number, e: React.MouseEvent) => {
    e.stopPropagation();
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
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden">
        <div className="hero-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_50%,rgba(255,107,157,0.12),transparent),radial-gradient(ellipse_40%_50%_at_75%_60%,rgba(0,229,160,0.08),transparent)] pointer-events-none" />

        {/* Orbiting decorative dots */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
          <div className="relative w-[480px] h-[480px]">
            {[
              { c: "#FF6B9D", r: 220, t: 16 },
              { c: "#00E5A0", r: 180, t: 22 },
              { c: "#5B52D5", r: 140, t: 28 },
              { c: "#D4AF4C", r: 100, t: 18 },
            ].map((o, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full animate-orbit"
                style={{
                  background: o.c,
                  boxShadow: `0 0 12px ${o.c}`,
                  ["--orbit-r" as string]: `${o.r}px`,
                  ["--orbit-t" as string]: `${o.t}s`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="font-mono text-[0.6rem] uppercase tracking-widest px-3 py-1 rounded-full bg-gradient-to-r from-[#FF6B9D]/20 to-[#00E5A0]/20 border border-[#FF6B9D]/40 text-[#FF6B9D]">
              Sesión 9 · M03 · Automatizaciones
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white-f leading-tight mb-6 animate-fadeUp-1">
            <span className="text-white-f">Antes de construir,</span>{" "}
            <span className="bg-gradient-to-r from-[#FF6B9D] via-[#5B52D5] to-[#00E5A0] bg-clip-text text-transparent">piensa con método</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-8 animate-fadeUp-2">
            Creatividad, jobs to be done, preguntas orientadoras y buenas prácticas para diseñar proyectos IA en BTG que sí lleguen a producción · y que valgan la pena llegar.
          </p>

          {/* Diagrama 3 capas */}
          <div className="max-w-2xl mx-auto mb-8 animate-fadeUp-2">
            <svg viewBox="0 0 600 110" className="w-full">
              <defs>
                <linearGradient id="hl1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6B9D" />
                  <stop offset="100%" stopColor="#5B52D5" />
                </linearGradient>
                <linearGradient id="hl2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#5B52D5" />
                  <stop offset="100%" stopColor="#00E5A0" />
                </linearGradient>
                <linearGradient id="hl3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00E5A0" />
                  <stop offset="100%" stopColor="#D4AF4C" />
                </linearGradient>
              </defs>
              {/* Capas */}
              <g transform="translate(20,15)">
                <rect width="160" height="60" rx="12" fill="rgba(255,107,157,0.10)" stroke="url(#hl1)" strokeWidth="1.5" />
                <text x="80" y="28" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#FF6B9D" letterSpacing="2">PENSAR</text>
                <text x="80" y="46" textAnchor="middle" fontSize="11" fill="#f0f2f8" fontWeight="600">mentalidades</text>
              </g>
              <g transform="translate(220,15)">
                <rect width="160" height="60" rx="12" fill="rgba(91,82,213,0.10)" stroke="url(#hl2)" strokeWidth="1.5" />
                <text x="80" y="28" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#7B73E8" letterSpacing="2">DIVERGIR</text>
                <text x="80" y="46" textAnchor="middle" fontSize="11" fill="#f0f2f8" fontWeight="600">métodos creativos</text>
              </g>
              <g transform="translate(420,15)">
                <rect width="160" height="60" rx="12" fill="rgba(0,229,160,0.10)" stroke="url(#hl3)" strokeWidth="1.5" />
                <text x="80" y="28" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#00E5A0" letterSpacing="2">DECIDIR</text>
                <text x="80" y="46" textAnchor="middle" fontSize="11" fill="#f0f2f8" fontWeight="600">preguntas + stack</text>
              </g>
              {/* Flechas */}
              <g>
                <line x1="180" y1="45" x2="220" y2="45" stroke="#7A82A0" strokeWidth="1.5" opacity="0.6" />
                <polygon points="217,41 224,45 217,49" fill="#7A82A0" opacity="0.6" />
                <line x1="380" y1="45" x2="420" y2="45" stroke="#7A82A0" strokeWidth="1.5" opacity="0.6" />
                <polygon points="417,41 424,45 417,49" fill="#7A82A0" opacity="0.6" />
              </g>
              {/* Pie */}
              <text x="300" y="100" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#7A82A0" letterSpacing="2">3 capas · 1 proyecto</text>
            </svg>
          </div>

          <div className="h-10 flex items-center justify-center mb-6 animate-fadeUp-3">
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
              { val: heroN >= 3 ? "25" : "—", label: "Preguntas orientadoras", icon: "?", color: "#D4AF4C" },
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

      {/* ═══════════ 2. OBJETIVOS ═══════════ */}
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
              <div key={f.n} className="bg-[#0D1229] border rounded-2xl p-5 flex flex-col relative overflow-hidden" style={{ borderColor: `${f.color}30` }}>
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-[0.07]" style={{ background: f.color }} />
                <div className="flex items-center justify-between mb-3 relative">
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
                <button key={m.id} onClick={() => setActiveMent(m.id)} className="text-left rounded-xl p-3 border transition-all flex flex-col items-center" style={{
                  background: active ? `linear-gradient(135deg, ${m.color}28, ${m.color}08)` : "#0D1229",
                  borderColor: active ? m.color : `${m.color}30`,
                }}>
                  <div className="w-16 h-16 mb-2">
                    <MentalidadSVG id={m.id} color={m.color} />
                  </div>
                  <p className="text-[0.74rem] font-bold text-white-f leading-tight text-center">{m.name}</p>
                </button>
              );
            })}
          </div>

          <div className="bg-[#0D1229] border rounded-2xl p-6 grid md:grid-cols-[180px_1fr_1fr] gap-6 items-start" style={{ borderColor: `${currentMent.color}40` }}>
            {/* SVG grande */}
            <div className="w-full aspect-square rounded-xl border flex items-center justify-center p-4" style={{ borderColor: `${currentMent.color}40`, background: `linear-gradient(135deg, ${currentMent.color}18, transparent)` }}>
              <div className="w-full h-full">
                <MentalidadSVG id={currentMent.id} color={currentMent.color} />
              </div>
            </div>
            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-1.5" style={{ color: currentMent.color }}>▸ La idea en una frase</p>
              <p className="text-[0.95rem] text-white-f/95 italic leading-relaxed mb-4">{currentMent.one}</p>

              <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-1.5 text-cyan">▸ Cómo se usa</p>
              <p className="text-[0.82rem] text-white-f/85 leading-relaxed">{currentMent.detail}</p>
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
                <button key={m.id} onClick={() => setActiveMet(m.id)} className="text-left rounded-xl p-3 border transition-all flex flex-col items-center" style={{
                  background: active ? `linear-gradient(135deg, ${m.color}28, ${m.color}08)` : "#0D1229",
                  borderColor: active ? m.color : `${m.color}30`,
                }}>
                  <div className="w-16 h-10 mb-1.5">
                    <svg viewBox="0 0 60 36" className="w-full h-full" fill="none">
                      <text x="30" y="26" textAnchor="middle" fontSize="22" fontWeight="bold" fill={m.color}>{m.iconText}</text>
                    </svg>
                  </div>
                  <p className="text-[0.74rem] font-bold text-white-f leading-tight text-center">{m.name}</p>
                </button>
              );
            })}
          </div>

          <div className="bg-[#0D1229] border rounded-2xl overflow-hidden" style={{ borderColor: `${currentMet.color}40` }}>
            <div className="px-6 py-5 border-b" style={{ background: `linear-gradient(135deg, ${currentMet.color}18, ${currentMet.color}06)`, borderColor: `${currentMet.color}25` }}>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-mono text-[0.55rem] uppercase tracking-widest" style={{ color: currentMet.color }}>Método creativo</p>
                  <h3 className="text-2xl font-bold text-white-f">{currentMet.name}</h3>
                  <p className="text-[0.78rem] text-muted italic max-w-md mt-1">{currentMet.one}</p>
                </div>
                <div className="w-[280px] h-[80px] shrink-0 hidden md:block">
                  <MetodoSVG id={currentMet.id} color={currentMet.color} />
                </div>
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
          <p className="font-mono text-[0.72rem] text-[#D4AF4C] uppercase tracking-widest mb-3">Parte 3 · Preguntas orientadoras</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white-f leading-tight mb-5">
            25 preguntas <span className="bg-gradient-to-r from-[#D4AF4C] to-[#FF6B9D] bg-clip-text text-transparent">que tu canvas debe responder</span>
          </h2>
          <p className="text-lg text-muted max-w-3xl mb-3 leading-relaxed">
            Cada pregunta viene con: <strong className="text-white-f">por qué importa</strong> · <strong className="text-white-f">qué evidencia mostrar</strong> · <strong className="text-white-f">pista BTG concreta</strong>. Click en cualquiera para expandir.
          </p>
          <p className="text-[0.85rem] text-muted/80 max-w-3xl mb-8 leading-relaxed">
            Marca cada pregunta que ya respondiste con evidencia real (botón ✓ a la derecha). Cuando llegues a 25/25 estás listo para pitch al comité.
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
              const expanded = expandedQ === p.id;
              return (
                <div
                  key={p.id}
                  className="rounded-xl border overflow-hidden transition-all"
                  style={{
                    background: done ? `${cat.color}10` : "rgba(255,255,255,0.02)",
                    borderColor: expanded ? cat.color : done ? `${cat.color}55` : "rgba(255,255,255,0.06)",
                  }}
                >
                  <button
                    onClick={() => setExpandedQ(expanded ? null : p.id)}
                    className="w-full text-left flex items-start gap-3 px-4 py-3"
                  >
                    <div className="w-7 h-7 rounded-md grid place-items-center shrink-0 font-mono text-[0.7rem]" style={{
                      background: done ? cat.color : `${cat.color}22`,
                      color: done ? "#080C1F" : cat.color,
                      border: done ? `1px solid ${cat.color}` : `1px solid ${cat.color}40`,
                    }}>
                      {done ? "✓" : p.id}
                    </div>
                    <div className="flex-1">
                      <p className={`text-[0.88rem] leading-snug ${done ? "text-white-f/70" : "text-white-f/95"} font-medium`}>{p.t}</p>
                    </div>
                    <span className="font-mono text-[0.55rem] uppercase tracking-widest px-2 py-0.5 rounded shrink-0 hidden md:inline-block" style={{ background: `${cat.color}15`, color: cat.color, border: `1px solid ${cat.color}35` }}>
                      {cat.name}
                    </span>
                    <button
                      onClick={(e) => toggleAnswered(p.id, e)}
                      className="w-7 h-7 rounded-md grid place-items-center shrink-0 transition-all hover:scale-110"
                      style={{
                        background: done ? "rgba(34,197,94,0.20)" : "rgba(255,255,255,0.04)",
                        border: done ? "1px solid rgba(34,197,94,0.6)" : "1px solid rgba(255,255,255,0.15)",
                        color: done ? "#22C55E" : "rgba(255,255,255,0.4)",
                      }}
                      title={done ? "Marcar como pendiente" : "Marcar como respondida con evidencia"}
                    >
                      <span className="text-xs">✓</span>
                    </button>
                    <span className="font-mono text-muted text-xs shrink-0 transition-transform" style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}>▸</span>
                  </button>

                  {expanded && (
                    <div className="px-4 pb-4 pt-1 border-t mt-1" style={{ borderColor: `${cat.color}25` }}>
                      <div className="grid md:grid-cols-3 gap-3 mt-3">
                        <div className="bg-[#0F1438]/60 border border-white/[0.06] rounded-lg p-3">
                          <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1.5 flex items-center gap-1.5" style={{ color: cat.color }}>
                            <span className="w-1 h-1 rounded-full" style={{ background: cat.color }} />
                            Por qué importa
                          </p>
                          <p className="text-[0.78rem] text-white-f/85 leading-relaxed">{p.why}</p>
                        </div>
                        <div className="bg-[#0F1438]/60 border border-[#0EA5E9]/25 rounded-lg p-3">
                          <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1.5 text-[#0EA5E9] flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-[#0EA5E9]" />
                            Evidencia esperada
                          </p>
                          <p className="text-[0.78rem] text-white-f/85 leading-relaxed">{p.evidence}</p>
                        </div>
                        <div className="bg-[#D4AF4C]/8 border border-[#D4AF4C]/30 rounded-lg p-3">
                          <p className="font-mono text-[0.55rem] uppercase tracking-widest mb-1.5 text-gold flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-gold" />
                            Pista BTG
                          </p>
                          <p className="text-[0.78rem] text-white-f/85 leading-relaxed">{p.tip}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
              {STACK_PREGUNTAS.map((sq, idx) => {
                const answered = !!(answers as Record<string, string | undefined>)[sq.id];
                return (
                  <div key={sq.id} className="bg-[#0D1229] border rounded-xl p-4 transition-all" style={{ borderColor: answered ? "rgba(0,229,160,0.30)" : "rgba(255,255,255,0.08)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-7 h-7 rounded-full grid place-items-center font-mono text-[0.72rem] font-bold transition-all" style={{
                        background: answered ? "rgba(0,229,160,0.20)" : "rgba(15,108,189,0.20)",
                        color: answered ? "#00E5A0" : "#0F6CBD",
                        border: answered ? "1px solid rgba(0,229,160,0.5)" : "1px solid rgba(15,108,189,0.4)",
                      }}>
                        {answered ? "✓" : idx + 1}
                      </span>
                      <p className="text-[0.88rem] font-semibold text-white-f">{sq.q}</p>
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
                );
              })}
            </div>

            {/* Resultado */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-gradient-to-br from-[#0F1438] via-[#0D1229] to-[#080C1F] border rounded-2xl p-6 min-h-[420px] flex flex-col relative overflow-hidden" style={{ borderColor: stackResult ? `${stackResult.color}40` : "rgba(255,255,255,0.08)" }}>
                {stackResult && (
                  <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full opacity-[0.08]" style={{ background: stackResult.color }} />
                )}
                <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-3 relative" style={{ color: stackResult?.color ?? "#7A82A0" }}>▸ Recomendación heurística</p>

                {stackResult ? (
                  <div className="relative">
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
                      className="mt-2 font-mono text-[0.65rem] uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.10] text-muted hover:text-white-f hover:bg-white/[0.10]"
                    >
                      ↻ Reiniciar
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <svg viewBox="0 0 80 80" className="w-20 h-20 mb-3 opacity-30">
                      <circle cx="40" cy="40" r="18" stroke="#7A82A0" strokeWidth="2" fill="none" />
                      <circle cx="40" cy="40" r="3" fill="#7A82A0" />
                      {Array.from({ length: 12 }).map((_, i) => {
                        const a = (i / 12) * Math.PI * 2;
                        return (
                          <line key={i} x1={40 + Math.cos(a) * 22} y1={40 + Math.sin(a) * 22} x2={40 + Math.cos(a) * 28} y2={40 + Math.sin(a) * 28} stroke="#7A82A0" strokeWidth="2" />
                        );
                      })}
                    </svg>
                    <p className="text-[0.85rem] text-muted italic max-w-xs">Responde las 5 preguntas a la izquierda · la recomendación aparece aquí con su justificación.</p>
                    <div className="w-full max-w-[180px] bg-white/[0.05] rounded-full h-1.5 overflow-hidden mt-4">
                      <div className="h-full bg-gradient-to-r from-[#0F6CBD] to-[#00E5A0] transition-all duration-500" style={{ width: `${(Object.keys(answers).length / 5) * 100}%` }} />
                    </div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted/60 mt-2">{Object.keys(answers).length} / 5 respondidas</p>
                  </div>
                )}
              </div>

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
              <div key={p.n} className="bg-[#0D1229] border rounded-xl p-4 flex gap-3 hover:border-white/[0.20] transition-all relative overflow-hidden" style={{ borderColor: `${p.c}30` }}>
                <div className="absolute top-0 left-0 w-1 h-full" style={{ background: p.c }} />
                <div className="w-12 h-12 rounded-lg grid place-items-center font-mono text-lg font-bold shrink-0 ml-1" style={{ background: `${p.c}22`, color: p.c, border: `1px solid ${p.c}50` }}>
                  {String(p.n).padStart(2, "0")}
                </div>
                <div className="flex-1">
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
          <p className="text-lg text-muted max-w-3xl mb-8 leading-relaxed">
            60 minutos · 4-6 personas · 1 problema. Esta agenda es la versión condensada de toda la sesión · diseñada para ejecutarla con tu equipo sin facilitador externo.
          </p>

          {/* Timeline visual */}
          <div className="mb-6">
            <div className="flex items-stretch h-3 rounded-full overflow-hidden">
              {WORKSHOP.map((w, i) => (
                <div
                  key={i}
                  className="relative group transition-all hover:opacity-90"
                  style={{ flexGrow: w.minutos, background: w.color }}
                  title={`${w.time} · ${w.title}`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1 font-mono text-[0.55rem] text-muted">
              <span>00 min</span>
              <span>30 min</span>
              <span>60 min</span>
            </div>
          </div>

          <div className="grid md:grid-cols-7 gap-2">
            {WORKSHOP.map((w, i) => (
              <div key={i} className="bg-[#0D1229] border rounded-xl p-4 flex flex-col relative overflow-hidden" style={{ borderColor: `${w.color}40` }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: w.color }} />
                <div className="flex items-center justify-between mb-2">
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest" style={{ color: w.color }}>{w.time}</p>
                  <span className="font-mono text-[0.55rem] px-1.5 py-0.5 rounded" style={{ background: `${w.color}22`, color: w.color }}>{w.minutos}'</span>
                </div>
                <p className="text-[0.82rem] font-bold text-white-f leading-tight mb-2">{w.title}</p>
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
                { k: "Decisión", v: "25 preguntas orientadoras + Stack Selector + 10 buenas prácticas", c: "#D4AF4C" },
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
