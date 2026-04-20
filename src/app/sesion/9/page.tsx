import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion9() {
  return (
    <ProximamentePage
      numero={9}
      titulo="Power Platform: Power Apps + Power Automate"
      subtitulo="Aplicaciones low-code y automatización de procesos"
      modulo="M03"
      moduloNombre="Automatizaciones"
      temas={["Qué es Power Platform", "Creación de apps", "Conexión con SharePoint, Excel, Dataverse y SQL", "Diseño de formularios", "Flujos de trabajo, aprobaciones y notificaciones", "Comparación con n8n"]}
      herramientas={["Power Apps", "Power Automate", "SharePoint", "Dataverse", "Teams"]}
      taller="App de solicitudes internas de BTG con flujo de aprobación"
    />
  );
}
