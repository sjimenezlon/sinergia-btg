import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion12() {
  return (
    <ProximamentePage
      numero={12}
      titulo="IA agentica en finanzas"
      subtitulo="Agentes autonomos para trading, compliance y experiencia de cliente"
      modulo="M03"
      moduloNombre="Automatizaciones"
      temas={["Arquitecturas multiagente", "Trading algoritmico", "KYC/AML", "Pagos agentricos", "Reporting automatico"]}
      herramientas={["Claude", "n8n", "Copilot Studio"]}
      taller="Demo de un agente de analisis de mercado"
    />
  );
}
