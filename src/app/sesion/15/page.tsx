import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion15() {
  return (
    <ProximamentePage
      numero={15}
      titulo="IA aplicada a lineas de negocio de BTG Pactual"
      subtitulo="Aplicaciones en IB, WM, AM, S&T, operaciones, compliance"
      modulo="M04"
      moduloNombre="Soluciones para el negocio"
      temas={["Deal sourcing", "Due diligence", "Reporting", "Scoring ESG", "Pricing", "Riesgo", "AML", "Matriz impacto"]}
      herramientas={["JTBD Canvas", "Claude", "FigJam"]}
      taller="Taller para identificar el caso de uso mas valioso por area"
    />
  );
}
