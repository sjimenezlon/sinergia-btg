import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion4() {
  return (
    <ProximamentePage
      numero={4}
      titulo="Ecosistema de herramientas IA"
      subtitulo="Mapa y seleccion estrategica"
      modulo="M02"
      moduloNombre="Herramientas y aplicaciones"
      temas={["Taxonomia de asistentes", "Criterios de seleccion", "Ecosistema Microsoft", "Ecosistema Google", "Configuracion del entorno"]}
      herramientas={["Claude", "ChatGPT", "Gemini", "Copilot", "Cursor", "n8n", "NotebookLM"]}
      taller="Autodiagnostico y definicion de ruta personalizada por participante"
    />
  );
}
