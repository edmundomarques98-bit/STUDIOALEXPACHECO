import type { Metadata, Viewport } from "next";
import "./globals.css";
import "../public/alex-profile.css";
import { EvolutionController } from "./evolution-controller";

export const metadata: Metadata = {
  title: "Studio Alex Pacheco | Treinamento funcional em Cascavel–CE",
  description: "Programas de treinamento funcional de 3 a 5 dias por semana, com opções individuais e para casal em Cascavel–CE.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body><EvolutionController />{children}</body>
    </html>
  );
}
