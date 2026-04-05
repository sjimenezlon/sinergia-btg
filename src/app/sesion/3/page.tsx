import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion3() {
  return (
    <ProximamentePage
      numero={3}
      titulo="Prompt engineering: comunicarse con la IA"
      subtitulo="Tecnicas avanzadas para resultados profesionales"
      modulo="M02"
      moduloNombre="Herramientas y aplicaciones"
      temas={["Rol contexto tarea formato", "Chain-of-thought", "Few-shot", "Self-consistency", "System prompts", "Alucinaciones"]}
      herramientas={["Claude Projects", "Custom GPTs", "Gemini Gems"]}
      taller="Taller para construir un asistente de analisis de riesgo crediticio"
    />
  );
}
