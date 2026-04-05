import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion17() {
  return (
    <ProximamentePage
      numero={17}
      titulo="Gobernanza de datos: marcos regulatorios"
      subtitulo="DORA, EU AI Act, Habeas Data y normativa SFC"
      modulo="M04"
      moduloNombre="Soluciones para el negocio"
      temas={["Resiliencia operacional", "Clasificacion de riesgo IA", "Ley 1581/2012", "DAMA-DMBOK", "Trazabilidad", "Data lineage"]}
      herramientas={["DORA", "EU AI Act", "DAMA-DMBOK", "SFC Colombia"]}
      taller="Auditoria de gobernanza de un proceso actual"
    />
  );
}
