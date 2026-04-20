import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion15() {
  return (
    <ProximamentePage
      numero={15}
      titulo="Gestión del riesgo tecnológico y compliance IA"
      subtitulo="DORA, EU AI Act, Habeas Data, SFC y confianza institucional"
      modulo="M04"
      moduloNombre="Soluciones para el negocio"
      temas={["Resiliencia operacional digital (DORA)", "Clasificación de riesgo de IA (EU AI Act)", "Ley 1581/2012 y normativa SFC", "DAMA-DMBOK, trazabilidad y data lineage", "Model Risk Management y RegTech", "Auditoría de explicabilidad, sesgo y degradación"]}
      herramientas={["DORA", "EU AI Act", "DAMA-DMBOK", "SFC Colombia", "Risk Assessment", "Checklist"]}
      taller="Auditoría de gobernanza de un proceso actual y checklist de riesgo para implementar IA en BTG"
    />
  );
}
