import ProximamentePage from "@/components/ProximamentePage";

export default function Sesion7() {
  return (
    <ProximamentePage
      numero={7}
      titulo="n8n: automatización sin código"
      subtitulo="Conectar herramientas y eliminar trabajo manual"
      modulo="M03"
      moduloNombre="Automatizaciones"
      temas={["Nodos, triggers y credenciales", "Integraciones con correo y Teams", "Hojas de cálculo y bases de datos", "Primer flujo de alertas", "Errores y condicionales", "Seguridad cloud vs. self-hosted"]}
      herramientas={["n8n", "Sheets", "Teams", "Correo electrónico"]}
      taller="Taller de monitoreo de noticias financieras con alertas para el equipo de research"
    />
  );
}
