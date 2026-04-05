import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion5() {
  return (
    <ProximamentePage
      numero={5}
      titulo="Asistentes IA para finanzas"
      subtitulo="Flujos profesionales de análisis y creación"
      modulo="M02"
      moduloNombre="Herramientas y aplicaciones"
      temas={["Claude Projects y Artifacts", "Análisis de documentos", "Code Interpreter", "Custom GPTs y DALL·E", "Modelación DCF asistida", "Integración con PDF y Excel"]}
      herramientas={["Claude Projects", "Artifacts", "Custom GPTs", "Code Interpreter"]}
      taller="Taller para construir un asistente de due diligence para operaciones M&A"
    />
  );
}
