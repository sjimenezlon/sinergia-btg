"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/sesion/1", label: "Sesion 1" },
  { href: "/sesion/2", label: "Sesion 2" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 h-16 bg-[#080C1F]/92 backdrop-blur-xl border-b border-white/[0.06]">
      <Link href="/" className="flex items-center gap-3">
        <div className="relative w-9 h-9 bg-purple rounded-lg grid place-items-center text-white font-extrabold text-lg">
          S
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-orange rounded-full" />
        </div>
        <span className="font-extrabold text-white-f tracking-tight text-sm">
          SINERGIA
        </span>
        <span className="hidden md:inline text-[0.6rem] font-mono text-cyan bg-cyan-dim px-2 py-0.5 rounded-sm tracking-widest uppercase">
          NODO &middot; EAFIT
        </span>
      </Link>

      <div className="flex items-center gap-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
              pathname === l.href
                ? "text-white bg-purple/20"
                : "text-muted hover:text-white hover:bg-white/5"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-3 text-[0.68rem] text-muted">
        <span className="px-2 py-0.5 bg-cyan-dim text-cyan font-mono text-[0.6rem] rounded-sm">
          BTG PACTUAL
        </span>
        <span>20 sesiones &middot; 38h</span>
      </div>
    </nav>
  );
}
