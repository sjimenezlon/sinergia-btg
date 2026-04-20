import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion8() {
  return (
    <ProximamentePage
      numero={8}
      titulo="n8n + IA: automatización inteligente"
      subtitulo="LLMs integrados a flujos de automatización"
      modulo="M03"
      moduloNombre="Automatizaciones"
      temas={["Integración con OpenAI, Anthropic y Google AI", "Análisis de sentimiento", "Extracción de PDFs y correos", "Clasificación automática", "Reportes automáticos", "Pipeline RSS → LLM → resumen → Teams/Slack"]}
      herramientas={["n8n", "Claude API", "Gemini API", "Docling", "Llama Parse"]}
      taller="Pipeline de research automatizado end-to-end para el área de Asset Management"
    />
  );
}
