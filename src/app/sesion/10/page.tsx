import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion10() {
  return (
    <ProximamentePage
      numero={10}
      titulo="Power Platform: Power Apps + Power Automate"
      subtitulo="Aplicaciones low-code y automatizacion de procesos"
      modulo="M03"
      moduloNombre="Automatizaciones"
      temas={["Power Platform", "Power Apps", "SharePoint", "Dataverse", "Formularios", "Flujos de trabajo", "Aprobaciones"]}
      herramientas={["Power Apps", "Power Automate", "SharePoint", "Dataverse", "Teams"]}
      taller="App de solicitudes internas con flujo de aprobacion"
    />
  );
}
