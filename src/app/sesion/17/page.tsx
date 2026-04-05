import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion17() {
  return (
    <ProximamentePage
      numero={17}
      titulo="Gobernanza de datos: marcos regulatorios"
      subtitulo="DORA, EU AI Act, Habeas Data y normativa SFC"
      modulo="M04"
      moduloNombre="Soluciones para el negocio"
      temas={["Resiliencia operacional digital", "Clasificación de riesgo de IA", "Ley 1581/2012", "DAMA-DMBOK", "Trazabilidad y data lineage", "Calidad de datos como base para IA"]}
      herramientas={["DORA", "EU AI Act", "DAMA-DMBOK", "SFC Colombia"]}
      taller="Auditoría de gobernanza de un proceso actual de BTG Pactual"
    />
  );
}
