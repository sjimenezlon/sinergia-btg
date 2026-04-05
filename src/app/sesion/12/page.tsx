import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion12() {
  return (
    <ProximamentePage
      numero={12}
      titulo="IA agéntica en finanzas"
      subtitulo="Agentes autónomos para trading, compliance y experiencia de cliente"
      modulo="M03"
      moduloNombre="Automatizaciones"
      temas={["Arquitecturas multiagente", "Trading algorítmico", "KYC/AML automatizado", "Protocolos de comercio y pagos", "Reporting automático", "Riesgos de decisiones autónomas"]}
      herramientas={["Claude", "n8n", "Copilot Studio"]}
      taller="Demo de un agente de análisis de mercado para el área de S&T de BTG"
    />
  );
}
