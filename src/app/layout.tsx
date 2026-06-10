import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Barber Gang MX",
  description: "Barbería premium urbana en Poza Rica, Veracruz.",
  metadataBase: new URL("https://barbergang.mx"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
