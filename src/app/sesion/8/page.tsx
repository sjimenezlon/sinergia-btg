import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion8() {
  return (
    <ProximamentePage
      numero={8}
      titulo="n8n: automatizacion sin codigo"
      subtitulo="Conectar herramientas y eliminar trabajo manual"
      modulo="M03"
      moduloNombre="Automatizaciones"
      temas={["Nodos", "Triggers", "Credenciales", "Integraciones", "Alertas", "Errores", "Condicionales"]}
      herramientas={["n8n", "Sheets", "Teams", "Correo electronico"]}
      taller="Taller de monitoreo de noticias financieras con alertas"
    />
  );
}
