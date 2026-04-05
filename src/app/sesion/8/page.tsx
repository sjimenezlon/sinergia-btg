import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion8() {
  return (
    <ProximamentePage
      numero={8}
      titulo="n8n: automatización sin código"
      subtitulo="Conectar herramientas y eliminar trabajo manual"
      modulo="M03"
      moduloNombre="Automatizaciones"
      temas={["Nodos y triggers", "Credenciales", "Integraciones con correo y Teams", "Hojas de cálculo y bases de datos", "Flujo de alertas", "Errores y condicionales"]}
      herramientas={["n8n", "Sheets", "Teams", "Correo electrónico"]}
      taller="Taller de monitoreo de noticias financieras con alertas para el equipo de research"
    />
  );
}
