import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion12() {
  return (
    <ProximamentePage
      numero={12}
      titulo="Ecosistema FinTech 2026: mapa de fuerzas"
      subtitulo="Del open banking a los agentes financieros autónomos"
      modulo="M03"
      moduloNombre="Automatizaciones"
      temas={["Panorama FinTech global y LATAM", "Open Finance", "Pagos en tiempo real", "CBDC y stablecoins", "Neobancos y casos en Colombia", "Rol de BTG como puente entre banca y tecnología"]}
      herramientas={["NotebookLM", "Claude"]}
      taller="Mapeo de cinco oportunidades FinTech para el área de cada participante en BTG"
    />
  );
}
