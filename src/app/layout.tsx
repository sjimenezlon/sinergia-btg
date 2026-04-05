import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "SINERGIA — IA Generativa para Servicios Financieros | BTG Pactual",
  description:
    "Programa de 38 horas para BTG Pactual Colombia. IA Generativa + Automatizaciones contextualizado a banca de inversión.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#080C1F] text-[#C5CAE0] font-[family-name:var(--font-dm-sans)]">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
