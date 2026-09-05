import type { Metadata } from "next";
import "./globals.css";
import { EvolutionController } from "./evolution-controller";

export const metadata: Metadata = {
  title: "Studio Alex Pacheco",
  description: "Programas de treinamento funcional de 3 a 5 dias por semana, com opções individuais e para casal em Acopiara.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body><EvolutionController />{children}</body>
    </html>
  );
}
