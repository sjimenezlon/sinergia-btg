import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion16() {
  return (
    <ProximamentePage
      numero={16}
      titulo="IA y proteccion de datos: riesgos y mitigacion"
      subtitulo="Usar IA sin comprometer informacion sensible"
      modulo="M04"
      moduloNombre="Soluciones para el negocio"
      temas={["Fugas de datos en LLMs", "DLP", "Anonimizacion", "Pseudonimizacion", "On-premise", "Purview", "Shadow AI"]}
      herramientas={["DeepSeek local", "Microsoft Purview", "Politica AUP"]}
      taller="Diseno de una politica de uso aceptable de IA por area"
    />
  );
}
