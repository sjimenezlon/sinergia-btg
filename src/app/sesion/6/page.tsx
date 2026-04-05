import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion6() {
  return (
    <ProximamentePage
      numero={6}
      titulo="Gemini, NotebookLM y Microsoft Copilot"
      subtitulo="Investigacion documental y ecosistema M365"
      modulo="M02"
      moduloNombre="Herramientas y aplicaciones"
      temas={["Gemini 2.5", "NotebookLM", "Audio Overview", "Copilot Word", "Copilot Excel", "Copilot PowerPoint"]}
      herramientas={["Gemini", "NotebookLM", "Copilot M365"]}
      taller="Briefing con NotebookLM y generacion de presentacion con Copilot"
    />
  );
}
