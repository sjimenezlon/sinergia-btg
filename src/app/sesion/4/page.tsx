import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion4() {
  return (
    <ProximamentePage
      numero={4}
      titulo="Ecosistema de herramientas IA: mapa y selección estratégica"
      subtitulo="Criterios para elegir la herramienta correcta según el rol"
      modulo="M02"
      moduloNombre="Herramientas y aplicaciones"
      temas={["Taxonomía de asistentes", "Criterios de selección", "Ecosistema Microsoft", "Ecosistema Google", "Herramientas especializadas", "Configuración del entorno"]}
      herramientas={["Claude", "ChatGPT", "Gemini", "Copilot", "Power Platform", "Cursor", "n8n", "NotebookLM", "DBeaver", "ADA"]}
      taller="Autodiagnóstico y definición de ruta personalizada por participante"
    />
  );
}
