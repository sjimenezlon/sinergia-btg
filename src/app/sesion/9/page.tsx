import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion9() {
  return (
    <ProximamentePage
      numero={9}
      titulo="n8n + IA: automatización inteligente"
      subtitulo="LLMs integrados a flujos de automatización"
      modulo="M03"
      moduloNombre="Automatizaciones"
      temas={["Integración con OpenAI y Anthropic", "Google AI", "Análisis de sentimiento", "Extracción de PDFs y correos", "Clasificación automática", "Pipeline RSS → LLM → resumen"]}
      herramientas={["n8n", "Claude API", "Gemini API", "Docling", "Llama Parse"]}
      taller="Pipeline de research automatizado end-to-end para el área de Asset Management"
    />
  );
}
