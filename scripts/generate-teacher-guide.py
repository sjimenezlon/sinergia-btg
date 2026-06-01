"""
Genera la guía del profesor (Word) para la Sesión 4 de SINERGIA BTG.
Cubre: conceptos financieros, plataformas IA, los 6 casos de la galería,
el ejemplo guiado Cementos Portales, answer key de las 5 preguntas,
y tips de facilitación.
"""
import os
from docx import Document
from docx.shared import Pt, Inches, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_ALIGN_VERTICAL
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

OUT = "/Users/santiagojl/Downloads/BTG-Sinergia-S4-guia-profesor.docx"

# ── Paleta corporativa SINERGIA / BTG
ORANGE = "E85A1F"
PURPLE = "5B52D5"
CYAN = "00E5A0"
BLUE = "3A7BD5"
GOLD = "D4AF4C"
GREEN = "22C55E"
RED = "FF5F57"
PURPLE_LIGHT = "9B59B6"
DARK_BG = "0D1229"
GRAY = "6B7280"


def set_cell_bg(cell, color):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), color)
    tcPr.append(shd)


def add_h(doc, text, level=1, color=ORANGE):
    h = doc.add_heading("", level=level)
    run = h.add_run(text)
    run.font.color.rgb = RGBColor.from_string(color)
    run.font.bold = True
    return h


def p(doc, text, bold=False, italic=False, color=None, size=None):
    para = doc.add_paragraph()
    run = para.add_run(text)
    if bold:
        run.font.bold = True
    if italic:
        run.font.italic = True
    if color:
        run.font.color.rgb = RGBColor.from_string(color)
    if size:
        run.font.size = Pt(size)
    return para


def callout(doc, label, body, color=ORANGE):
    table = doc.add_table(rows=1, cols=1)
    table.autofit = False
    cell = table.rows[0].cells[0]
    set_cell_bg(cell, color)
    cell.paragraphs[0].text = ""
    label_run = cell.paragraphs[0].add_run(label.upper())
    label_run.font.color.rgb = RGBColor.from_string("FFFFFF")
    label_run.font.bold = True
    label_run.font.size = Pt(8)
    body_para = cell.add_paragraph()
    body_run = body_para.add_run(body)
    body_run.font.color.rgb = RGBColor.from_string("FFFFFF")
    body_run.font.size = Pt(10)
    doc.add_paragraph()  # spacer


def keyterm(doc, term, definition):
    """Box for a key financial term."""
    para = doc.add_paragraph()
    run_t = para.add_run(f"⬢ {term}: ")
    run_t.font.bold = True
    run_t.font.color.rgb = RGBColor.from_string(ORANGE)
    run_t.font.size = Pt(11)
    run_d = para.add_run(definition)
    run_d.font.size = Pt(11)


def example_box(doc, title, lines):
    table = doc.add_table(rows=1, cols=1)
    cell = table.rows[0].cells[0]
    set_cell_bg(cell, "F5F5F5")
    cell.paragraphs[0].text = ""
    t_run = cell.paragraphs[0].add_run(title)
    t_run.font.bold = True
    t_run.font.color.rgb = RGBColor.from_string(PURPLE)
    t_run.font.size = Pt(10)
    for line in lines:
        para = cell.add_paragraph()
        run = para.add_run(line)
        run.font.size = Pt(10)
        run.font.color.rgb = RGBColor.from_string("333333")
    doc.add_paragraph()


def hr(doc):
    para = doc.add_paragraph()
    pPr = para._p.get_or_add_pPr()
    pBdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "6")
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), "CCCCCC")
    pBdr.append(bottom)
    pPr.append(pBdr)


def page_break(doc):
    doc.add_page_break()


# ════════════════════════════════════════════════════════════════════════════
# DOCUMENTO
# ════════════════════════════════════════════════════════════════════════════
doc = Document()

# Margins
for section in doc.sections:
    section.top_margin = Cm(2.0)
    section.bottom_margin = Cm(2.0)
    section.left_margin = Cm(2.5)
    section.right_margin = Cm(2.5)

# Default style
style = doc.styles["Normal"]
style.font.name = "Calibri"
style.font.size = Pt(11)


# ── PORTADA ──
add_h(doc, "SINERGIA · IA Generativa para Servicios Financieros", level=0, color=ORANGE)
p(doc, "BTG Pactual Colombia · NODO × Universidad EAFIT", italic=True, color=GRAY, size=12)
doc.add_paragraph()

add_h(doc, "Sesión 4 · Guía del profesor", level=1, color=PURPLE)
p(doc, "Asistentes IA para finanzas profesionales · Flujos de análisis y creación", italic=True, size=12)

doc.add_paragraph()
p(doc, "Esta guía contiene todo lo que necesitas para facilitar la sesión 4: los conceptos financieros que se asumen, las herramientas que se usan, los 6 ejercicios de la galería, el ejemplo guiado de Cementos Portales con answer key completa, y tips de facilitación. Pensada para una sesión de 2 horas (clase regular) o 2-4 horas (sesión práctica MVP).", size=11)

doc.add_paragraph()
callout(doc, "Cómo usar esta guía",
        "Léela completa antes de la sesión (toma ~45 minutos). Imprime las páginas con el answer key. "
        "Ten una pestaña abierta en cada plataforma 30 minutos antes de empezar. "
        "El éxito de la sesión depende de que tú hayas hecho el ejercicio guiado al menos una vez.",
        color=ORANGE)

p(doc, "Versión 1.0 · Mayo 2026", italic=True, color=GRAY, size=9)

page_break(doc)


# ════════════════════════════════════════════════════════════════════════════
# SECCIÓN 1 · CONCEPTOS FINANCIEROS
# ════════════════════════════════════════════════════════════════════════════
add_h(doc, "1. Conceptos financieros que necesitas dominar", level=1, color=PURPLE)
p(doc, "La sesión asume que los participantes son banqueros, traders, asesores patrimoniales o tecnólogos que trabajan en BTG. La mayoría conoce estos conceptos, pero como facilitador debes poder explicarlos con claridad si alguien pregunta. Aquí van con definición rigurosa y un ejemplo.", italic=True, size=11)

# 1.1 Due Diligence
add_h(doc, "1.1 Due Diligence (DD) en M&A", level=2, color=ORANGE)
p(doc, "Investigación profunda y estructurada que hace el comprador antes de cerrar la compra de una compañía. El objetivo es validar la tesis de inversión, identificar riesgos no revelados y refinar el precio.")

p(doc, "Las fases típicas de una transacción M&A son:", bold=True)
phases = [
    ("Teaser", "Documento de 1-2 páginas que circula el banquero del vendedor. Sin nombre del target. Filtra interesados."),
    ("CIM (Round 1)", "Confidential Information Memorandum, ~50-100 páginas con lo bueno del target. El comprador firma NDA y recibe el CIM."),
    ("NBO", "Non-Binding Offer. Oferta indicativa basada solo en el CIM. Filtro para entrar a Round 2."),
    ("Data room (Round 2)", "Acceso a documentos detallados: contratos, audits, legal, fiscal, RRHH. Aquí ocurre la DD seria."),
    ("Management presentation", "El equipo del target hace un pitch al comprador. Oportunidad para preguntas incómodas."),
    ("Binding offer", "Oferta vinculante con precio firme y condiciones. Solo si el DD soportó la tesis."),
    ("Closing", "Firma del SPA (Sale and Purchase Agreement), cierre legal y financiero."),
]
for name, desc in phases:
    keyterm(doc, name, desc)

p(doc, "Tipos de DD que se hacen en paralelo:", bold=True)
p(doc, "Financiero (KPMG, EY) · Legal (Brigard Urrutia, Posse) · Comercial (consultoras) · Fiscal · Ambiental · Tecnológico · ESG · Reputacional. Para esta sesión, nos concentramos en el DD financiero.")

# 1.2 CIM e IC Memo
add_h(doc, "1.2 CIM vs IC Memo: qué los diferencia", level=2, color=ORANGE)
keyterm(doc, "CIM (Confidential Information Memorandum)",
        "Lo escribe el banquero del VENDEDOR. Es un pitch en favor del target. Cuenta la historia bonita, "
        "menciona riesgos pero los minimiza. Debes leerlo crítico, no devotamente.")
keyterm(doc, "IC Memo (Investment Committee Memo)",
        "Lo escribe el equipo del COMPRADOR. Es un análisis para la junta. Debe ser frío, "
        "balanceado, con riesgos honestos. Si tu IC memo suena al CIM, lo hiciste mal.")

example_box(doc, "Estructura típica de un IC memo BTG:", [
    "1. Tesis de inversión (3 bullets)",
    "2. Mercado y posición competitiva",
    "3. Performance financiero histórico y proyectado",
    "4. Riesgos identificados y mitigaciones",
    "5. Comparables y rango de valoración",
    "6. Estructura propuesta de la transacción",
    "7. Recomendación y próximos pasos",
])

# 1.3 Red flags
add_h(doc, "1.3 Red flags: qué buscar en un data room", level=2, color=ORANGE)
p(doc, "Un red flag es una señal de alerta material. No mata el deal por sí solo, pero obliga a profundizar y suele justificar ajuste de precio. Los más comunes en LatAm:")

red_flags = [
    ("DSO deteriorando", "Days Sales Outstanding = (Cuentas por cobrar / Ventas) × 365. Si subió de 45 a 78 días, hay problema: o están vendiendo a clientes de bajo rating, o no están cobrando, o hicieron channel stuffing."),
    ("Covenant tight", "Si el ratio Net Debt/EBITDA está a 0.1x del covenant, una caída pequeña de EBITDA detona aceleración de deuda. Riesgo material."),
    ("Contingencias no provisionadas", "Demandas, ajustes fiscales (DIAN), pasivos ambientales. Si no aparecen en EEFF auditados pero hay correspondencia legal, es bandera roja."),
    ("Customer concentration", "Si los top 5 clientes concentran > 30% de ventas, riesgo de pérdida brusca."),
    ("Working capital trends", "Inventarios subiendo más rápido que ventas = problema de demanda o de obsolescencia."),
    ("Cambios de auditor", "Tres auditores en cinco años usually means trouble. KPMG entra y sale, algo pasó."),
    ("Aging de inventarios", "Inventarios > 6 meses sin rotar: write-off pendiente."),
    ("Provisiones extraordinariamente bajas", "Si la cobertura de provisiones cae súbitamente, podría ser maquillaje pre-venta."),
]
for term, desc in red_flags:
    keyterm(doc, term, desc)

# 1.4 Covenants
add_h(doc, "1.4 Covenants y stress testing", level=2, color=ORANGE)
p(doc, "Un covenant es un compromiso financiero que el deudor pacta con el banco. Si lo rompe, el banco puede exigir pago anticipado (aceleración).")

p(doc, "Covenants más comunes:", bold=True)
keyterm(doc, "Net Debt / EBITDA",
        "El más usado. Mide cuántos años de EBITDA necesita la empresa para pagar la deuda neta. "
        "Niveles típicos: < 2.0x conservador, 2-3x razonable, 3-4x ajustado, > 4x peligroso.")
keyterm(doc, "Interest Coverage Ratio (ICR)",
        "EBITDA / Gastos financieros. Mide cuántas veces los intereses están cubiertos por la generación operativa. > 4x es saludable.")
keyterm(doc, "DSCR (Debt Service Coverage Ratio)",
        "Flujo de caja operativo / (Intereses + Amortización del año). Más estricto que ICR. > 1.2x es típico mínimo.")

example_box(doc, "Stress test del covenant: ejemplo Cementos Portales", [
    "Datos al cierre 2025:",
    "  · EBITDA: COP 104 mil millones",
    "  · Net Debt: COP 356 mil millones",
    "  · Net Debt/EBITDA: 3.42x (covenant: 3.50x → margen 0.08x)",
    "",
    "Escenario: EBITDA cae 10% en 2026.",
    "  · Nuevo EBITDA: 104 × 0.90 = 93.6",
    "  · Asumiendo Net Debt constante: 356 / 93.6 = 3.80x",
    "  · 3.80x > 3.50x → COVENANT BREACH",
    "",
    "Implicación: el banco puede acelerar la deuda. La empresa tendría que renegociar o pagar.",
    "Si el comprador no negocia un waiver con Bancolombia ANTES del closing, hereda el problema.",
])

# 1.5 DCF
add_h(doc, "1.5 DCF: valoración por flujo de caja descontado", level=2, color=ORANGE)
p(doc, "El método estándar para valorar empresas. Proyecta los flujos de caja libres futuros y los trae a valor presente con una tasa de descuento.")

example_box(doc, "Fórmula básica del DCF", [
    "Enterprise Value = Σ(FCF_t / (1 + WACC)^t) + Terminal Value / (1 + WACC)^n",
    "",
    "Donde:",
    "  · FCF_t = Free Cash Flow del año t",
    "  · WACC = Weighted Average Cost of Capital",
    "  · n    = año del último flujo proyectado (típicamente 5)",
    "  · Terminal Value = FCF_(n+1) / (WACC - g)  ← Modelo de Gordon",
    "  · g    = crecimiento perpetuo (típicamente 2.5-3%)",
])

p(doc, "Componentes que hay que estimar:", bold=True)
keyterm(doc, "FCF (Free Cash Flow)",
        "EBITDA − Impuestos sobre EBIT − Capex − Cambio en working capital. Lo que efectivamente queda para los proveedores de capital (deuda + equity).")
keyterm(doc, "WACC",
        "Tasa de descuento ponderada. WACC = (E/V) × Re + (D/V) × Rd × (1−T). Para LatAm corporates: típicamente 9-13%. Para bancos: 10-12%. Más alto el riesgo, más alto el WACC.")
keyterm(doc, "g terminal",
        "Asunción de crecimiento perpetuo. Regla: nunca asumir g > crecimiento PIB de largo plazo. Para Colombia: 2.5-3.5%.")
keyterm(doc, "Terminal Value",
        "Suele representar el 60-80% del EV total. Por eso las sensibilidades son críticas: pequeños cambios en WACC o g mueven la valoración significativamente.")

# 1.6 Sensibilidades
add_h(doc, "1.6 Matriz de sensibilidades y tornado chart", level=2, color=ORANGE)
p(doc, "Como el DCF depende de muchas asunciones (sobre todo WACC y g), nunca se reporta un solo número. Se reportan rangos.")

keyterm(doc, "Matriz de sensibilidad",
        "Tabla 5×5 (o más) que muestra el EV variando WACC en filas (típicamente ±200 bps del base) y g en columnas (típicamente 2-4%). Permite ver el rango de valoración honesto.")
keyterm(doc, "Tornado chart",
        "Gráfico horizontal que ranquea los drivers de valor por cuánto mueven el EV. Le dice al MD cuáles asunciones merecen más rigor en DD.")

example_box(doc, "Drivers típicos del tornado chart en una valoración:", [
    "1. WACC (siempre el #1 o #2)",
    "2. g terminal",
    "3. EBITDA margin del año 5",
    "4. Capex como % de ventas",
    "5. Tasa de impuestos efectiva",
    "6. Tasa de crecimiento de ventas año 1-3",
    "7. Working capital como % de ventas",
    "8. Inflación / FX si aplica",
])

# 1.7 Comparables
add_h(doc, "1.7 Valoración por comparables (comps)", level=2, color=ORANGE)
p(doc, "Método complementario al DCF. Usa múltiplos de empresas similares (cotizadas o transaccionadas) para inferir el valor del target.")

p(doc, "Múltiplos más usados en banca de inversión:", bold=True)
keyterm(doc, "EV/EBITDA",
        "El rey en M&A. Independiente de estructura de capital. Rangos típicos LatAm: cementeras 5-9x, bancos 5-7x, energía 4-7x, retail 8-12x, tech 15-30x.")
keyterm(doc, "P/E (Price/Earnings)",
        "Más usado en equity research que en M&A. Sensible a apalancamiento y depreciación. Útil para acciones públicas.")
keyterm(doc, "EV/Sales",
        "Cuando el EBITDA está distorsionado o es negativo (high-growth, pre-IPO).")
keyterm(doc, "P/BV (Price/Book Value)",
        "Estándar para bancos. Rangos LatAm: 0.8-1.5x para bancos maduros, > 2x para fintechs en crecimiento.")
keyterm(doc, "EV/Producción",
        "Específico para energía y minería: USD por barril, USD por tonelada.")

# 1.8 IQR
add_h(doc, "1.8 IQR: cómo limpiar outliers en comps", level=2, color=ORANGE)
p(doc, "Cuando tienes 8-15 comparables, casi siempre hay 1-2 outliers que distorsionan la mediana. El método estándar para excluirlos es IQR (Interquartile Range).")

example_box(doc, "Algoritmo IQR 1.5x", [
    "1. Ordenar los datos de menor a mayor.",
    "2. Calcular Q1 (percentil 25) y Q3 (percentil 75).",
    "3. IQR = Q3 − Q1",
    "4. Límite inferior = Q1 − 1.5 × IQR",
    "5. Límite superior = Q3 + 1.5 × IQR",
    "6. Excluir cualquier punto fuera de esos límites.",
    "",
    "Un buen prompt a una IA debe pedir: 'aplica regla IQR 1.5x para excluir outliers antes de calcular la mediana'.",
])

# 1.9 KPIs bancarios
add_h(doc, "1.9 KPIs bancarios (para el caso 04 · Banco Andino)", level=2, color=ORANGE)
p(doc, "El transcript de earnings de Banco Andino menciona muchas métricas. Aquí las que importan:")

bank_kpis = [
    ("ROE (Return on Equity)", "Utilidad neta / Patrimonio promedio. Bancos LatAm sólidos: 14-18%. Top performers: > 18%."),
    ("NIM (Net Interest Margin)", "Ingreso neto por intereses / Activos productivos promedio. Bancos colombianos: 5-7%."),
    ("Mora 90+", "Cartera vencida ≥ 90 días / Cartera total. Saludable: < 3%. Estresado: > 5%."),
    ("Cobertura de provisiones", "Provisiones / Cartera vencida. Conservador: > 130%. Mediano: 100-130%."),
    ("Costo de riesgo", "Provisiones del periodo / Cartera promedio. Saludable: 1.5-2.5%."),
    ("Eficiencia (cost-to-income)", "Gastos operacionales / Ingresos totales. Bancos eficientes: 35-45%. Ineficientes: > 55%."),
    ("CET1 (Common Equity Tier 1)", "Capital ordinario / Activos ponderados por riesgo. Mínimo regulatorio Colombia: 7%. Saludable: > 10%."),
    ("LCR (Liquidity Coverage Ratio)", "Activos líquidos / Salidas estresadas 30 días. Mínimo regulatorio: 100%. Saludable: > 130%."),
    ("NSFR (Net Stable Funding Ratio)", "Fondeo estable / Activos que requieren fondeo estable. Mínimo: 100%."),
    ("VaR diario", "Valor en Riesgo de mercado para un día con 99% de confianza."),
]
for term, desc in bank_kpis:
    keyterm(doc, term, desc)

# 1.10 Wealth
add_h(doc, "1.10 Wealth Management: glossary mínimo", level=2, color=ORANGE)
keyterm(doc, "AuM (Assets under Management)",
        "Activos bajo gestión. Métrica de tamaño de WM. BTG WM Colombia: ~COP 28 billones según el CIM sintético del caso 06.")
keyterm(doc, "Cliente premium",
        "En Colombia, típicamente patrimonio invertible > USD 1M. En BTG, segmentación interna define rangos.")
keyterm(doc, "Asset allocation",
        "Distribución por clases: renta variable, renta fija, alternativos (PE, hedge, real estate), commodities, cash.")
keyterm(doc, "Suitability",
        "Adecuación del producto al perfil del cliente. Regulación SFC obliga a evaluar perfil de riesgo antes de cualquier recomendación.")
keyterm(doc, "Disclaimer regulatorio",
        "Toda comunicación a cliente de WM debe llevar disclaimer: 'esta información es educativa, las decisiones requieren análisis del perfil de riesgo'. Críticas para el caso 06.")

page_break(doc)


# ════════════════════════════════════════════════════════════════════════════
# SECCIÓN 2 · LAS PLATAFORMAS
# ════════════════════════════════════════════════════════════════════════════
add_h(doc, "2. Las 7 plataformas que se usan en clase", level=1, color=PURPLE)
p(doc, "Todas son accesibles desde el navegador, sin instalaciones, en su mayoría con cuenta gratuita o tier free generoso. Estado mayo 2026.", italic=True)

doc.add_paragraph()
table = doc.add_table(rows=8, cols=4)
table.style = "Light Grid Accent 1"
hdr = table.rows[0].cells
for i, t in enumerate(["Plataforma", "Tier", "Contexto", "Sweet spot"]):
    hdr[i].text = t

tools_data = [
    ("Claude (Anthropic)", "Free · Pro $20", "200K (1M Pro)", "Documentos largos, Projects, Artifacts, citas confiables"),
    ("ChatGPT (OpenAI)", "Free · Plus $20", "128K", "Code Interpreter, Custom GPTs, ecosistema más amplio"),
    ("Gemini (Google)", "Free · Adv. $20", "1M", "Deep Research, Workspace, multimodalidad nativa, Gems"),
    ("NotebookLM (Google)", "Free", "50 fuentes", "Research multi-fuente, citas literales, Audio Overview"),
    ("DeepSeek", "Free", "128K", "Razonamiento cuantitativo, sin paywall, segunda opinión"),
    ("Mistral · Le Chat", "Free · Pro €15", "128K", "Modelo europeo, code execution, interfaz limpia"),
    ("Kimi (Moonshot)", "Free", "2M", "Documentos voluminosos, transcripts largos, data rooms"),
]
for i, row in enumerate(tools_data, start=1):
    for j, v in enumerate(row):
        table.rows[i].cells[j].text = v

doc.add_paragraph()
add_h(doc, "Reglas de selección rápida (úsalas en clase)", level=2, color=BLUE)
keyterm(doc, "Si > 80 páginas → Kimi",
        "Tiene 2M de contexto y es gratis. Supera a Claude (1M Pro) y Gemini (1M) en puro tamaño. Único viable para libros enteros, transcripts largos o data rooms grandes.")
keyterm(doc, "Si necesitas correr código → ChatGPT o Mistral",
        "Code Interpreter en ChatGPT (Free limitado, Plus generoso). Mistral Le Chat también tiene code execution. Excel + Python sin salir del chat.")
keyterm(doc, "Para citas verificables → NotebookLM",
        "Cita literal del párrafo o página. Para research académico o regulatorio donde la fuente importa.")
keyterm(doc, "Para asistentes reusables → Gems (Gemini)",
        "Gratis y compartibles. Custom GPTs requieren Plus. Claude Projects requiere Pro.")
keyterm(doc, "Para segunda opinión → DeepSeek + Mistral",
        "Cuando la decisión es material, corre el mismo prompt en 2-3 modelos. Si convergen, alta confianza. Si divergen, profundiza.")
keyterm(doc, "Para audio (research escuchable) → NotebookLM",
        "Audio Overview convierte 30 fuentes en un podcast de 12-15 min. Único en su clase.")

page_break(doc)


# ════════════════════════════════════════════════════════════════════════════
# SECCIÓN 3 · LOS 6 CASOS DE LA GALERÍA
# ════════════════════════════════════════════════════════════════════════════
add_h(doc, "3. Los 6 casos de la galería · qué enseñar en cada uno", level=1, color=PURPLE)
p(doc, "Cada caso tiene un archivo descargable, un prompt copiable y una plataforma recomendada. Aquí va la lectura de profesor: por qué importa, qué deben aprender, qué responde la IA, dónde se traban.", italic=True)

cases = [
    {
        "num": "01",
        "title": "Análisis express de un data room M&A",
        "color": ORANGE,
        "tool": "Claude (Pro recomendado · Free funciona)",
        "file": "01-cementos-portales-cim.docx",
        "purpose": "Mostrar que un asistente bien instruido puede leer un CIM en minutos y devolver red flags con cita a sección. La gran diferencia versus búsqueda manual: el modelo cruza secciones (financials con legal con management discussion).",
        "expected": (
            "Claude debería identificar los 3 red flags principales: "
            "DSO deteriorando (45→78 días), covenant Bancolombia tight (3.42x vs 3.50x), "
            "y contingencia DIAN COP 8.2bn no provisionada. "
            "Si el equipo cita la sección o tabla del CIM, el ejercicio salió bien. "
            "Si solo dice 'el target tiene riesgos' sin números → prompt incompleto, regresar al system prompt."
        ),
        "stuck": (
            "El equipo se traba si: (a) no entiende qué es un covenant breach, (b) no sabe qué es DSO. "
            "En esos casos, devuélvelos a la sección 1.3 y 1.4 de esta guía."
        ),
    },
    {
        "num": "02",
        "title": "Valoración DCF con sensibilidades",
        "color": BLUE,
        "tool": "ChatGPT (Plus para Code Interpreter sin límite)",
        "file": "02-dcf-emisores-colcap.xlsx",
        "purpose": "Mostrar que el modelo no solo conversa: ejecuta Python en sandbox, calcula matrices y genera gráficos. Excel hecho por IA, no copy-paste de IA al Excel.",
        "expected": (
            "ChatGPT debería: (1) proyectar EBITDA 5 años con CAGR sectorial (5-8% típico), "
            "(2) calcular FCF, (3) construir matriz 5×5 de EV variando WACC y g, "
            "(4) generar tornado chart. "
            "Output esperado: Excel descargable con 3 hojas (Resumen, Sensibilidad, Tornado). "
            "Para CEMARGOS (Net Debt/EBITDA 2.65x, sensitivity al WACC alta) debería salir como el más sensible."
        ),
        "stuck": (
            "Common stuck: el modelo asume cosas sin decirlo. Buen prompt PIDE explicitud. "
            "Si la respuesta no incluye 'asumí X porque Y', el equipo debe re-promptear pidiendo trazabilidad de asunciones."
        ),
    },
    {
        "num": "03",
        "title": "Briefing sectorial con podcast (NotebookLM)",
        "color": "7B61FF",
        "tool": "NotebookLM (free)",
        "file": "03-fuentes-telco-latam.docx",
        "purpose": "Demostrar que NotebookLM no alucina: cita la fuente literal. Y que Audio Overview convierte 18 fuentes en un podcast escuchable. Caso de uso fuerte: research preparado para un viaje en taxi al cliente.",
        "expected": (
            "NotebookLM debería identificar: tesis dominante de consolidación (towers, "
            "spin-offs), divergencia en arpu recovery (Itaú espera +2.5% en H2; otros más conservadores), "
            "y catalysts: subasta 5G Q3-2026 + expansión WOM. "
            "El Audio Overview suele durar 12-15 min y suena como dos hosts conversando."
        ),
        "stuck": (
            "Algunos equipos esperan que NotebookLM 'opine'. NO opina, parafrasea con fuente. "
            "Si quieren opinión sectorial, hay que pasar la salida a Claude o ChatGPT como segundo paso."
        ),
    },
    {
        "num": "04",
        "title": "Lectura de earnings call ultra-largo",
        "color": "1D8278",
        "tool": "Kimi (free · 2M ctx)",
        "file": "04-banco-andino-earnings-call.docx",
        "purpose": "Romper la creencia de que solo Claude o ChatGPT manejan docs largos. Kimi K2 es gratis, asiático, con 2M de contexto. Para transcripts de earnings, libros enteros o data rooms voluminosos, es la opción más económica.",
        "expected": (
            "Kimi debería: (1) tabla con KPIs financieros (NIM 6.85%, ROE proyectado 14.5-15.5%, "
            "mora total 2.83%, costo de riesgo 1.72%, CET1 11.4%, LCR 168%), "
            "(2) detectar tensión en tarjetas (mora 5.12% vs 4.85% trimestre anterior), "
            "(3) flagear que el CFO mencionó la cosecha 2H-2024 con criterios laxos. "
            "Pregunta evasiva común: cuándo normaliza el costo de riesgo de tarjetas (Diana dijo 2T pero el guidance del año mantiene 1.8-2.0%)."
        ),
        "stuck": (
            "Kimi puede tardar más en responder con docs grandes. "
            "Si el equipo se desespera, dile que mientras tanto puede correr el mismo prompt en Claude para comparar."
        ),
    },
    {
        "num": "05",
        "title": "Triangulación multi-modelo de comps",
        "color": "FF7000",
        "tool": "Mistral + DeepSeek + Claude (los 3 free)",
        "file": "05-comps-cementeras-latam.xlsx",
        "purpose": "Enseñar que ningún modelo es perfecto. La diferencia entre alguien que usa IA y alguien que confía ciegamente en IA es: el primero triangula. Caso real: cuando una decisión vale millones, correr el mismo prompt en 3 modelos cuesta 0 y filtra alucinaciones.",
        "expected": (
            "Los 3 modelos deberían converger en mediana EV/EBITDA ~ 5.5x (excluyendo outliers via IQR). "
            "Diferencias esperadas: Mistral suele ser veloz pero menos detallado; "
            "DeepSeek hace mejor el cálculo cuantitativo paso a paso; "
            "Claude tiende a ser más conservador y explícito sobre asunciones. "
            "Para Cementos Portales (EBITDA USD 26M, Net Debt USD 89M): "
            "EV implícito mediana 5.5x = USD 143M; rango 4-7x = USD 104-182M. "
            "Equity value mediana = 143-89 = USD 54M (asumiendo 100% del equity)."
        ),
        "stuck": (
            "El aprendizaje real es la divergencia. Si los equipos reportan que los 3 modelos respondieron "
            "EXACTAMENTE igual, sospecha — probablemente solo copiaron del primero. "
            "Pídeles screenshots de las 3 conversaciones."
        ),
    },
    {
        "num": "06",
        "title": "Asistente reusable de Wealth Management",
        "color": PURPLE_LIGHT,
        "tool": "Gemini Gem (free) · Claude Project (Pro) · Custom GPT (Plus)",
        "file": "06-portafolio-wealth-modelo.xlsx",
        "purpose": "Mostrar que un asistente compartido entre asesores resuelve un problema real: consistency. Cada asesor explica el portafolio modelo distinto. Un Gem con instructions claras + portfolio cargado garantiza la misma narrativa.",
        "expected": (
            "El Gem debería responder preguntas tipo: '¿qué le digo a un cliente conservador sobre Ecopetrol?' con: "
            "(1) tres frases simples del activo, (2) métrica clave (peso en portafolio 4.2%, retorno YTD 8.5%), "
            "(3) un riesgo a mencionar (volatilidad 28.4%), "
            "(4) disclaimer obligatorio. "
            "Si el Gem da recomendación de comprar/vender, FALLÓ — el system prompt prohíbe eso explícitamente."
        ),
        "stuck": (
            "El issue regulatorio es REAL. Si el asistente pasa por encima del rol explicativo y empieza a recomendar, "
            "es un problema de compliance. Usa esto para enseñar la importancia de las 'reglas duras' en el system prompt."
        ),
    },
]

for case in cases:
    add_h(doc, f"Caso {case['num']} · {case['title']}", level=2, color=case["color"])
    p(doc, f"Plataforma: {case['tool']}", italic=True, color=GRAY, size=10)
    p(doc, f"Archivo: {case['file']}", italic=True, color=GRAY, size=10)
    doc.add_paragraph()

    p(doc, "Por qué importa este caso:", bold=True, color=case["color"])
    p(doc, case["purpose"])

    p(doc, "Output esperado de la IA:", bold=True, color=case["color"])
    p(doc, case["expected"])

    p(doc, "Dónde se suelen trabar los equipos:", bold=True, color=case["color"])
    p(doc, case["stuck"], italic=True)
    hr(doc)

page_break(doc)


# ════════════════════════════════════════════════════════════════════════════
# SECCIÓN 4 · EJEMPLO GUIADO · CEMENTOS PORTALES
# ════════════════════════════════════════════════════════════════════════════
add_h(doc, "4. Ejemplo guiado · Cementos Portales en 4 plataformas", level=1, color=PURPLE)
p(doc, "Este es el ejercicio donde TODOS construyen el mismo asistente DD. Tu rol es facilitar, no resolver. Cada equipo abre las 4 plataformas (ChatGPT, Claude, Gemini, DeepSeek), pega el mismo prompt, hace las mismas 5 preguntas, y compara resultados. Aquí está el answer key completo.", italic=True)

doc.add_paragraph()
add_h(doc, "4.1 El system prompt: por qué cada regla", level=2, color=ORANGE)
p(doc, "El prompt tiene 5 reglas duras. Entender por qué están ahí te permite responder cuando un participante diga 'le quité una regla y vi qué pasaba'.")

prompt_rules = [
    ("Regla 1: NUNCA inventes cifras",
     "Sin esta regla, las IAs llenan el vacío con humo. Es la #1 fuente de errores en finanzas. "
     "El test: pregunta algo que NO está en el CIM (ej: 'cuál fue el Capex 2021?'). "
     "Modelo bueno: 'no disponible en el data room'. Modelo malo: inventa un número plausible."),
    ("Regla 2: CITA siempre",
     "Una recomendación sin cita es inválida. La cita permite auditar. "
     "Si el modelo dice 'el covenant es 3.50x', debe agregar 'según sección 3 del CIM'. "
     "Las 4 plataformas hacen esto, pero Claude y NotebookLM lo hacen mejor."),
    ("Regla 3: Estructura fija (TESIS · RIESGOS · COMPS · NEXT STEPS)",
     "Sin estructura, las respuestas son monolitos difíciles de leer. "
     "Con estructura, el MD escanea en 30 segundos. La IA aprende del prompt qué orden seguir."),
    ("Regla 4: Sé crítico",
     "Por default, las IAs son cheerleaders. Hay que pedirles explícitamente que duden. "
     "Si quitas esta regla, las respuestas se vuelven optimistas y poco accionables."),
    ("Regla 5: Habla como analista, no como IA",
     "Elimina los disclaimers innecesarios ('como modelo de lenguaje no puedo...'). "
     "El analyst senior no abre con disclaimers; va directo al análisis. "
     "El score de confianza al final es un anclaje útil — obliga al modelo a auto-evaluarse."),
]
for rule, why in prompt_rules:
    keyterm(doc, rule, why)


add_h(doc, "4.2 Las 5 preguntas: answer key del profesor", level=2, color=ORANGE)
p(doc, "Estas son las respuestas que un equipo bien guiado debería producir. Si te alejan mucho de esto, es señal de prompt débil o uso incorrecto de la plataforma.", italic=True)

# Q1
add_h(doc, "Q1 · Top 3 red flags", level=3, color=BLUE)
example_box(doc, "Respuesta esperada", [
    "1. DSO deteriorando: 45 días en 2022 → 78 días en 2025 (+73%). Sección 2 del CIM.",
    "   Implicación: liquidez estructural comprometida o venta a clientes de bajo rating.",
    "",
    "2. Covenant Bancolombia tight: Net Debt/EBITDA = 3.42x al cierre 2025 vs covenant 3.50x.",
    "   Margen de solo 0.08x. Sección 3, riesgo financiero del CIM.",
    "   Implicación: una caída del 3% en EBITDA gatilla aceleración de deuda.",
    "",
    "3. Contingencia DIAN no provisionada: COP 8,200 millones notificada el 12-feb-2026.",
    "   Sección 3, riesgo regulatorio. Equivale a 7.9% del EBITDA 2025.",
    "   Implicación: o desorden de gobernanza, o intento de ocultar pasivos antes de la venta.",
])
p(doc, "Bonus que el modelo bueno también detecta: demanda colectiva en Loja por COP 1,500M (sección 3), planta Cundinamarca con eficiencia 18% bajo pares (sección 3), exposición geográfica a Perú con caída demanda residencial 12% YoY (sección 3).", italic=True, color=GRAY, size=10)

# Q2
add_h(doc, "Q2 · Stress test del covenant", level=3, color=BLUE)
example_box(doc, "Respuesta esperada (cálculo paso a paso)", [
    "Datos al cierre 2025:",
    "  · EBITDA: COP 104,000 MM",
    "  · Net Debt: COP 356,000 MM",
    "  · Net Debt/EBITDA actual: 3.42x",
    "  · Covenant: 3.50x",
    "",
    "Escenario: EBITDA cae 10% en 2026.",
    "  · Nuevo EBITDA: 104,000 × 0.90 = 93,600 MM",
    "  · Asumiendo Net Debt constante en 356,000 MM:",
    "    Nuevo Net Debt/EBITDA = 356,000 / 93,600 = 3.80x",
    "",
    "  · 3.80x > 3.50x → COVENANT BREACH",
    "  · El banco puede acelerar la deuda → riesgo material",
    "",
    "Punto crítico: ¿qué caída de EBITDA gatilla el breach exacto?",
    "  · 356,000 / 3.50 = 101,714 MM = EBITDA mínimo",
    "  · Caída tolerable: 1 - (101,714 / 104,000) = 2.2%",
    "  · Es decir, una caída de SOLO 2.2% en EBITDA rompe el covenant.",
    "",
    "Implicación para la transacción: el comprador debe negociar waiver con Bancolombia",
    "ANTES del closing, o exigir que el vendor lo haga como condición precedente.",
])

# Q3
add_h(doc, "Q3 · Rango de Enterprise Value", level=3, color=BLUE)
example_box(doc, "Respuesta esperada", [
    "EBITDA 2025: COP 104,000 MM (~USD 26M al FX 4,000)",
    "",
    "Múltiplos sectoriales LatAm cementeras (rango típico 5x – 9x):",
    "",
    "  Múltiplo 5.0x: EV = 520,000 MM COP",
    "  Múltiplo 6.0x: EV = 624,000 MM COP",
    "  Múltiplo 7.0x: EV = 728,000 MM COP (mediana sectorial típica)",
    "  Múltiplo 8.0x: EV = 832,000 MM COP",
    "  Múltiplo 9.0x: EV = 936,000 MM COP",
    "",
    "Rango EV: COP 520-936 MM (USD 130-234 M)",
    "",
    "Ajustes para llegar a Equity Value (lo que paga el comprador):",
    "  − Net Debt: 356,000 MM",
    "  − Provisión adicional DIAN: 8,200 MM (no provisionado en EEFF)",
    "  − Provisión adicional Loja: 1,500 MM",
    "",
    "Equity Value rango:",
    "  Bajo (5x):  520,000 - 365,700 = 154,300 MM COP (~USD 39M)",
    "  Medio (7x): 728,000 - 365,700 = 362,300 MM COP (~USD 91M)",
    "  Alto (9x):  936,000 - 365,700 = 570,300 MM COP (~USD 143M)",
    "",
    "Familia Portales (62% del equity):",
    "  Bajo: 95,700 MM COP (~USD 24M)",
    "  Alto: 353,600 MM COP (~USD 88M)",
    "",
    "Discount sugerido por riesgos: 15-20% del valor mediano (covenant + DIAN + DSO).",
])

# Q4
add_h(doc, "Q4 · 5 preguntas incómodas para el CEO", level=3, color=BLUE)
example_box(doc, "Respuesta esperada", [
    "1. La DIAN notificó ajuste fiscal por COP 8,200 MM hace casi 3 meses (12-feb-2026).",
    "   ¿Por qué no aparece en sus EEFF auditados? ¿Cuándo van a provisionar?",
    "",
    "2. Si el EBITDA cae 2.2% el próximo año, rompemos el covenant Bancolombia.",
    "   ¿Cuál es el plan B y han abierto conversación con el banco?",
    "",
    "3. El DSO subió de 45 a 78 días. ¿Es presión comercial, deterioro de calidad de cliente,",
    "   o channel stuffing pre-venta? Necesitamos aging detail por cliente top 20.",
    "",
    "4. La planta de Cundinamarca opera con horno de 1996 con eficiencia energética 18%",
    "   bajo pares. ¿Plan de retrofit o de cierre? ¿Costo y timing?",
    "",
    "5. ¿Por qué la Familia Portales vende AHORA? Las macro de cemento mejorarían en 2027",
    "   con baja de tasas. ¿Hay urgencia que no aparece en el CIM?",
])

# Q5
add_h(doc, "Q5 · Recomendación binaria", level=3, color=BLUE)
example_box(doc, "Respuesta esperada — opción AVANZAR (con condiciones)", [
    "AVANZAR a Round 2 con condiciones precedentes claras.",
    "",
    "Justificación:",
    "  · Múltiplos sectoriales sugieren EV razonable (~7x EBITDA ~ COP 728B).",
    "  · Posición competitiva sólida con 3 plantas y presencia regional.",
    "  · Los 3 red flags (covenant, DIAN, DSO) son materiales pero MANEJABLES",
    "    si se trasladan al precio o a las reps & warranties del SPA.",
    "",
    "Condiciones a negociar antes del binding offer:",
    "  · Waiver pre-closing del covenant Bancolombia con un buffer mínimo de 0.5x.",
    "  · Provisión completa de la contingencia DIAN en EEFF antes del cierre.",
    "  · Indemnity cap en caso de exposición DIAN > COP 10,000 MM (cobertura 2x).",
    "  · Discount al EV de 15-20% versus valoración mediana sectorial.",
    "",
    "Si el vendor rechaza estas condiciones → DECLINAR.",
])

example_box(doc, "Respuesta esperada — opción DECLINAR", [
    "DECLINAR la oportunidad.",
    "",
    "Justificación:",
    "  · Margen de covenant peligrosamente tight (0.08x = 2.2% de cushion).",
    "    No es un riesgo manejable, es una bomba de tiempo.",
    "  · La contingencia DIAN no provisionada implica desorden o intención.",
    "    Cualquiera de las dos es señal de gobernanza débil.",
    "  · DSO trend (45→78 días) sugiere problemas estructurales en cobranza,",
    "    no un fenómeno cíclico. Implica capital de trabajo creciente para sostener.",
    "  · Mejor revisar el target en 12 meses con resultados saneados",
    "    o esperar a una transacción más limpia en el sector.",
])

p(doc, "Mensaje al equipo: ambas respuestas son válidas. La calidad de la recomendación está en la solidez de la justificación, no en el lado del binario que escojas. Penaliza fuerte el 'avanzar a Round 2 sin condiciones específicas' — eso es ingenuidad.", italic=True, color=ORANGE)

page_break(doc)


# 4.3 Tips por plataforma
add_h(doc, "4.3 Cómo se comporta cada plataforma · qué esperar", level=2, color=ORANGE)
p(doc, "Después de facilitar este ejercicio varias veces, estos son los patrones que vas a observar. Compártelos con el grupo después del primer round.")

platforms = [
    ("ChatGPT (con archivo subido)", BLUE,
     "Lo bueno: Code Interpreter activado automáticamente. En Q2 (stress test) y Q3 (valoración), "
     "suele mostrar los cálculos en bloques de Python ejecutados — verificable y auditable. "
     "Lo malo: a veces se enreda en explicar conceptos cuando le pides una respuesta directa. "
     "Tip a los participantes: 'Salta la teoría, ve al resultado' funciona."),
    ("Claude (con archivo subido)", ORANGE,
     "Lo bueno: el más prolijo en estructura y citas. Suele citar sección o tabla del CIM literalmente. "
     "En Q4 (preguntas para CEO) genera las preguntas más afiladas. "
     "Si pides Artifact al final, te entrega el memo IC editable. "
     "Lo malo: tier free tiene límite estricto de mensajes diarios — los equipos deben ser eficientes."),
    ("Gemini (Gem creado o chat con archivo)", BLUE,
     "Lo bueno: 1M de contexto te permite cargar el CIM + 5 PDFs adicionales. "
     "Deep Research (si lo activan) cruza con datos públicos del sector cemento. "
     "Lo malo: a veces es más verboso que necesario. "
     "Tip a los participantes: 'limita la respuesta a 200 palabras' funciona."),
    ("DeepSeek (con archivo)", "4D6BFE",
     "Lo bueno: el más fuerte en cuantitativo. En Q2 (stress test) y Q3 (valoración) suele dar "
     "el cálculo más detallado paso a paso. Activar 'Deep Think' mejora razonamiento. "
     "Lo malo: tendency a dar respuestas largas. UI un poco más cruda. "
     "Tip a los participantes: 'responde en máximo 5 bullets' funciona bien."),
]
for name, color, desc in platforms:
    keyterm(doc, name, desc)


# 4.4 Bonus Lovable
add_h(doc, "4.4 Bonus · Lovable / v0.dev", level=2, color=ORANGE)
p(doc, "Para los equipos que terminan rápido. Toman las 4 respuestas, copian el prompt para Lovable que está en la página, y generan una landing page que compara las 4 plataformas. Click en Publish, queda live.")

p(doc, "Por qué incluirlo:", bold=True)
p(doc, "Cierra el loop completo del workflow real: input → análisis multi-modelo → packaging visual para el MD. "
       "Lovable y v0.dev son tools nuevas (2025) que cambian cómo se construyen demos internos en BTG. "
       "Vale la pena que vean qué tan rápido se hace una página corporativa.", italic=True)

p(doc, "Tips para esta parte:", bold=True)
keyterm(doc, "No insistir si están atrasados",
        "Lovable es bonus. Si algún equipo no llegó al ejercicio principal completo, no los presiones a entrar acá.")
keyterm(doc, "Mostrar tu propio Lovable como referencia",
        "Antes de la sesión, corre tú el prompt en Lovable y guarda la URL. Si nadie llega al bonus, muestra el tuyo. "
        "Si llegan, compáralos con el tuyo y refuerza qué tan rápido se hace.")
keyterm(doc, "v0.dev como alternativa",
        "v0.dev es de Vercel, genera Next.js limpio, integra deploy con un click. "
        "Lovable es más visual y para no-coders. Ambos free. Equipo decide.")

page_break(doc)


# ════════════════════════════════════════════════════════════════════════════
# SECCIÓN 5 · TIPS DE FACILITACIÓN
# ════════════════════════════════════════════════════════════════════════════
add_h(doc, "5. Tips de facilitación · cómo correr la sesión", level=1, color=PURPLE)

add_h(doc, "5.1 Antes de la sesión", level=2, color=ORANGE)
p(doc, "30 minutos antes:", bold=True)
checklist = [
    "Abre las 4 plataformas en pestañas separadas: chatgpt.com · claude.ai · gemini.google.com · chat.deepseek.com",
    "Verifica que el archivo CIM (01-cementos-portales-cim.docx) está accesible en sinergia-btg.vercel.app/sesion-4/01-cementos-portales-cim.docx",
    "Corre TÚ el ejercicio guiado en al menos 2 plataformas. Tendrás respuestas reales para mostrar si el grupo se traba.",
    "Ten Lovable.dev y v0.dev abiertos por si llegan al bonus.",
    "Prepara una pizarra/post-it digital para anotar la tabla comparativa que llenarán los equipos.",
]
for item in checklist:
    p(doc, "☐ " + item)

doc.add_paragraph()
p(doc, "Antes de empezar, pregunta:", bold=True)
p(doc, "'¿Quién ya usa una IA para trabajo más allá de chatear?' Te da el nivel del grupo. "
       "Si la mayoría dice no, dedica más tiempo a las plataformas (sección 10B). "
       "Si la mayoría sí, salta directo al ejercicio guiado.")

add_h(doc, "5.2 Durante la sesión", level=2, color=ORANGE)
p(doc, "Estructura sugerida (2 horas regular o 4 horas práctica):", bold=True)

doc.add_paragraph()
table = doc.add_table(rows=7, cols=3)
table.style = "Light Grid Accent 1"
table.rows[0].cells[0].text = "Tiempo"
table.rows[0].cells[1].text = "Bloque"
table.rows[0].cells[2].text = "Qué hace el facilitador"

agenda = [
    ("0:00–0:15", "Apertura · caso entrada", "Mostrar el split antes/ahora · validar nivel del grupo"),
    ("0:15–0:35", "Plataformas + galería", "Tour rápido por las 7 plataformas · mostrar 2 casos de la galería"),
    ("0:35–1:35", "Ejemplo guiado", "Equipos de 2-3 abren plataformas · aplican prompt + 5 preguntas"),
    ("1:35–1:55", "Comparación", "Cada equipo llena la tabla 5×4 · socializa 2 hallazgos"),
    ("1:55–2:15", "Bonus Lovable", "Solo si hay tiempo · genera la landing comparativa"),
    ("2:15–2:30", "Cierre", "Las 8 preguntas orientadoras · qué hacen el lunes"),
]
for i, row in enumerate(agenda, start=1):
    for j, v in enumerate(row):
        table.rows[i].cells[j].text = v

doc.add_paragraph()
p(doc, "Para versión 4 horas (sesión práctica MVP), dedica 1.5 horas adicionales al build sprint donde cada equipo profundiza en un track de los 5 disponibles.", italic=True)

add_h(doc, "5.3 Bloqueos comunes y cómo desbloquear", level=2, color=ORANGE)

blockers = [
    ("Equipo no tiene cuenta en alguna plataforma",
     "Que usen DeepSeek (no requiere registro extenso). O en parejas, donde uno tiene Plus/Pro y otro free. "
     "El objetivo no es que cada uno tenga las 4 cuentas; es que el equipo pruebe las 4."),
    ("La IA inventa cifras",
     "Es señal de que NO leyó bien el CIM o que el prompt no fue claro. Pídeles que: (1) verifiquen que el archivo se subió bien, "
     "(2) refuerza la regla 'NUNCA inventes cifras' en el prompt, (3) hagan la pregunta más específica."),
    ("La IA da respuestas muy largas",
     "Limita explícitamente: 'Responde en máximo 200 palabras' o 'usa solo 3 bullets'. "
     "Casi todas las plataformas obedecen este tipo de constraint."),
    ("La IA da disclaimers innecesarios",
     "Si dice 'como modelo de lenguaje no puedo dar consejos financieros', recuerda al equipo "
     "que la regla 5 del system prompt explícitamente prohíbe disclaimers. Re-prompt."),
    ("Una plataforma está caída",
     "Pasa. Continúa con las otras 3. Si Claude falla, redirigir a Kimi (también de 1M ctx). "
     "Si ChatGPT falla, redirigir a Mistral Le Chat (también con code execution)."),
    ("El equipo cuestiona la valoración del answer key",
     "Excelente. La valoración no es exacta — es un rango con asunciones. "
     "Aprovecha para enseñar que en finanzas el rigor está en la justificación, no en el número."),
    ("El grupo es muy mixto (algunos junior, algunos senior)",
     "Mezcla los equipos: cada uno con 1 senior + 1-2 juniors. Senior aporta contexto de negocio, junior aporta velocidad con la IA."),
]
for problem, solution in blockers:
    keyterm(doc, problem, solution)

add_h(doc, "5.4 Cierre · qué llevarse el lunes", level=2, color=ORANGE)
p(doc, "Las últimas 15 minutos importan tanto como las primeras. Cada participante debe salir con:")
p(doc, "1. Una herramienta favorita escogida (la que mejor le funcionó para SU rol).", bold=True)
p(doc, "2. Una cuenta abierta y configurada (no posponer al lunes).", bold=True)
p(doc, "3. Un caso real de su área donde aplicaría el flujo aprendido.", bold=True)
p(doc, "4. Un compromiso público con el equipo: 'la próxima vez que reciba un X, voy a usar Y'.", bold=True)

doc.add_paragraph()
callout(doc, "La frase que cierra bien la sesión",
        "\"En 6 meses van a ser indispensables las personas que sepan operar 4-5 de estas herramientas. "
        "El gap no es entre los que usan IA y los que no — es entre los que la usan a un nivel y los que la usan al siguiente.\"",
        color=PURPLE)


# ════════════════════════════════════════════════════════════════════════════
# SECCIÓN 6 · FAQ y reservas
# ════════════════════════════════════════════════════════════════════════════
page_break(doc)
add_h(doc, "6. FAQ del facilitador", level=1, color=PURPLE)

faqs = [
    ("¿Y si un participante quiere subir data real de BTG en clase?",
     "PARALA inmediatamente. Reglas claras: solo data sintética entregada en clase. "
     "Esto no es paranoia — los términos de servicio de las plataformas free pueden permitir "
     "que los datos se usen para entrenar modelos. Para producción real con data sensible, "
     "BTG necesita versiones enterprise con zero-retention contractualmente garantizada."),
    ("¿Cómo manejo la diferencia entre Pro/Plus y Free?",
     "Reconoce la diferencia abiertamente. Si la mayoría tiene free, enseña con free. "
     "Las plataformas Pro/Plus desbloquean Custom GPTs, Projects, Code Interpreter sin límite, "
     "Gemini 1M de contexto, etc. Pero el 80% de la utilidad del curso se consigue con free + Gemini Gems."),
    ("¿Qué hago si los modelos dan respuestas distintas en Q3 (valoración)?",
     "DEBEN dar respuestas distintas. Esa es la lección. La valoración no es matemática pura, "
     "es matemática + asunciones. Dos modelos pueden hacer las mismas matemáticas con diferentes "
     "asunciones de múltiplo y dar EVs diferentes. Eso es exactamente lo que enseña la triangulación."),
    ("¿Esto reemplaza al analyst junior?",
     "No. Reemplaza la PARTE más mecánica del trabajo del analyst (lectura, extracción, primer draft). "
     "Libera al analyst para pensar la tesis, hacer preguntas afiladas al CEO, y construir relaciones. "
     "El analyst que rechace estas herramientas va a quedar en desventaja. El que las domine va a producir más, no menos."),
    ("¿Por qué incluir DeepSeek si es chino?",
     "Por dos razones: (1) técnicamente es muy fuerte en razonamiento cuantitativo, "
     "(2) la lección sobre triangulación multi-modelo solo funciona si los modelos vienen de proveedores distintos. "
     "Si un participante tiene preocupación geopolítica, está bien que use DeepSeek en este ejercicio educativo "
     "(con data sintética) y no para casos reales sensibles."),
    ("¿Y si la valoración del answer key está mal?",
     "Probablemente lo está, en algún detalle. Las cifras del CIM son sintéticas; los múltiplos sectoriales "
     "son aproximados. La intención no es entrenar valuadores, es entrenar usuarios de IA en finanzas. "
     "Si un participante encuentra error: agradécelo, ajusta, sigue."),
    ("¿Cómo evalúo la sesión sin rúbrica?",
     "El producto del Demo Day es la evaluación. Si el equipo construye algo demostrable y útil, "
     "aprendieron. Si presentan un PowerPoint con teoría, no aprendieron. La rúbrica está implícita en: "
     "'¿lo usarías el lunes en tu trabajo?' Si la respuesta es sí, ganaron."),
]
for q, a in faqs:
    keyterm(doc, "P: " + q, "R: " + a)


page_break(doc)
add_h(doc, "Apéndice · Cifras clave del CIM Cementos Portales", level=1, color=PURPLE)
p(doc, "Para que las tengas a mano sin consultar el documento durante la facilitación:", italic=True)

doc.add_paragraph()
table = doc.add_table(rows=8, cols=5)
table.style = "Light Grid Accent 1"
table.rows[0].cells[0].text = "KPI"
table.rows[0].cells[1].text = "2022"
table.rows[0].cells[2].text = "2023"
table.rows[0].cells[3].text = "2024"
table.rows[0].cells[4].text = "2025"

financials = [
    ("Ingresos (COP B)", "612", "684", "729", "751"),
    ("EBITDA (COP B)", "98", "108", "112", "104"),
    ("Margen EBITDA", "16.0%", "15.8%", "15.4%", "13.8%"),
    ("Net Debt (COP B)", "298", "312", "336", "356"),
    ("Net Debt / EBITDA", "3.04x", "2.89x", "3.00x", "3.42x"),
    ("DSO (días)", "45", "52", "65", "78"),
    ("Capex (COP B)", "32", "41", "38", "29"),
]
for i, row in enumerate(financials, start=1):
    for j, v in enumerate(row):
        table.rows[i].cells[j].text = v

doc.add_paragraph()
p(doc, "Otros datos clave:", bold=True)
key_data = [
    "Capacidad instalada: 2.4 Mt/año · Utilización 2025: 71%",
    "Plantas: 3 (Colombia, Perú, Ecuador) · 14 centros distribución",
    "Familia Portales: 62% accionario controlante",
    "Covenant Bancolombia: Net Debt/EBITDA ≤ 3.50x",
    "Contingencia DIAN: COP 8,200 MM · notificada 12-feb-2026 · NO provisionada",
    "Demanda colectiva Loja (Ecuador): provisión COP 1,500 MM",
    "Planta Cundinamarca: horno 1996 · eficiencia 18% bajo pares",
    "Cronograma transacción: NBO 01-jul-2026 · Binding 30-ago-2026 · Closing 30-nov-2026",
]
for d in key_data:
    p(doc, "• " + d)

doc.add_paragraph()
hr(doc)
p(doc, "Fin de la guía. Buena sesión.", italic=True, color=GRAY)
p(doc, f"Versión 1.0 · Mayo 2026 · BTG Pactual Colombia × NODO × Universidad EAFIT", italic=True, color=GRAY, size=9)


# ════════════════════════════════════════════════════════════════════════════
doc.save(OUT)
print(f"✓ Guía generada: {OUT}")
print(f"  Tamaño: {os.path.getsize(OUT) / 1024:.1f} KB")
