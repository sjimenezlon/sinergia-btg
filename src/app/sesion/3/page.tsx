import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion3() {
  return (
    <ProximamentePage
      numero={3}
      titulo="Prompt engineering: comunicarse con la IA"
      subtitulo="Técnicas avanzadas para resultados profesionales"
      modulo="M02"
      moduloNombre="Herramientas y aplicaciones"
      temas={["Rol, contexto, tarea y formato", "Chain-of-thought", "Few-shot y self-consistency", "System prompts", "Plantillas reutilizables", "Alucinaciones y verificación"]}
      herramientas={["Claude Projects", "Custom GPTs", "Gemini Gems"]}
      taller="Taller para construir un asistente de análisis de riesgo crediticio para BTG Pactual"
    />
  );
}
