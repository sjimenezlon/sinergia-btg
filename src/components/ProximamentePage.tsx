import Link from "next/link";

interface Props {
  numero: number;
  titulo: string;
  subtitulo: string;
  modulo: string;
  moduloNombre: string;
  temas: string[];
  herramientas: string[];
  taller: string;
}

export default function ProximamentePage({
  numero,
  titulo,
  subtitulo,
  modulo,
  moduloNombre,
  temas,
  herramientas,
  taller,
}: Props) {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-cyan mb-4">
        {modulo} &middot; {moduloNombre}
      </div>
      <div className="text-[0.85rem] font-mono text-muted mb-2">
        Sesion {String(numero).padStart(2, "0")}
      </div>
      <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-bold text-white leading-tight mb-3 max-w-2xl">
        {titulo}
      </h1>
      <p className="text-muted text-lg mb-8 max-w-lg">{subtitulo}</p>

      <div className="bg-[#151A3A] border border-white/[0.06] rounded-2xl p-8 max-w-2xl w-full text-left mb-8">
        <h3 className="text-sm font-bold text-white mb-4">Temas de esta sesion</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {temas.map((t) => (
            <span
              key={t}
              className="font-mono text-[0.65rem] px-3 py-1 bg-[rgba(91,82,213,0.12)] text-[#7B73E8] border border-[rgba(91,82,213,0.2)] rounded-sm"
            >
              {t}
            </span>
          ))}
        </div>

        <h3 className="text-sm font-bold text-white mb-3">Taller / Dinamica</h3>
        <p className="text-[0.85rem] text-[#C5CAE0] mb-6">{taller}</p>

        <h3 className="text-sm font-bold text-white mb-3">Herramientas</h3>
        <div className="flex flex-wrap gap-2">
          {herramientas.map((h) => (
            <span
              key={h}
              className="font-mono text-[0.65rem] px-3 py-1 bg-[rgba(0,229,160,0.12)] text-[#00E5A0] border border-[rgba(0,229,160,0.15)] rounded-sm"
            >
              {h}
            </span>
          ))}
        </div>
      </div>

      <div className="inline-flex items-center gap-2 bg-[rgba(232,90,31,0.1)] border border-[rgba(232,90,31,0.2)] rounded-full px-6 py-3 text-[0.82rem] text-[#FF7A42] font-medium mb-8">
        <span className="text-lg">🚧</span> Contenido en construccion — Proximamente
      </div>

      <Link
        href="/"
        className="text-[0.82rem] text-muted hover:text-white transition-colors"
      >
        &larr; Volver al programa
      </Link>
    </div>
  );
}
