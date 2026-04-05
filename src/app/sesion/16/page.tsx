import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion16() {
  return (
    <ProximamentePage
      numero={16}
      titulo="IA y protección de datos: riesgos y mitigación"
      subtitulo="Usar IA sin comprometer información sensible"
      modulo="M04"
      moduloNombre="Soluciones para el negocio"
      temas={["Fugas de datos en LLMs", "Políticas de información no compartible", "DLP", "Anonimización y pseudonimización", "Uso on-premise", "Purview y Shadow AI"]}
      herramientas={["DeepSeek local", "Microsoft Purview", "Política AUP"]}
      taller="Diseño de una política de uso aceptable de IA por área de BTG Pactual"
    />
  );
}
