import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion9() {
  return (
    <ProximamentePage
      numero={9}
      titulo="n8n + IA: automatizacion inteligente"
      subtitulo="LLMs integrados a flujos de automatizacion"
      modulo="M03"
      moduloNombre="Automatizaciones"
      temas={["OpenAI API", "Anthropic API", "Analisis de sentimiento", "Extraccion PDF", "Clasificacion automatica", "Pipeline RSS"]}
      herramientas={["n8n", "Claude API", "Gemini API", "Docling", "Llama Parse"]}
      taller="Pipeline de research automatizado end-to-end"
    />
  );
}
