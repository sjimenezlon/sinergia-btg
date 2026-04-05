import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion5() {
  return (
    <ProximamentePage
      numero={5}
      titulo="Asistentes IA para finanzas"
      subtitulo="Flujos profesionales de analisis y creacion"
      modulo="M02"
      moduloNombre="Herramientas y aplicaciones"
      temas={["Claude Projects", "Artifacts", "Code Interpreter", "Custom GPTs", "DALL-E", "Modelacion DCF", "Due diligence"]}
      herramientas={["Claude Projects", "Artifacts", "Custom GPTs", "Code Interpreter"]}
      taller="Taller para construir un asistente de due diligence"
    />
  );
}
