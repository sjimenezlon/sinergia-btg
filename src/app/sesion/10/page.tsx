import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion10() {
  return (
    <ProximamentePage
      numero={10}
      titulo="Power Platform: Power Apps + Power Automate"
      subtitulo="Aplicaciones low-code y automatización de procesos"
      modulo="M03"
      moduloNombre="Automatizaciones"
      temas={["Qué es Power Platform", "Creación de apps", "SharePoint y Dataverse", "Diseño de formularios", "Flujos de aprobación", "Comparación con n8n"]}
      herramientas={["Power Apps", "Power Automate", "SharePoint", "Dataverse", "Teams"]}
      taller="App de solicitudes internas de BTG con flujo de aprobación"
    />
  );
}
