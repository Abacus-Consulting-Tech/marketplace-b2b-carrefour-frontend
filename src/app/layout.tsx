import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carrefour B2B Marketplace",
  description:
    "Plataforma privada para franquiciados Carrefour — contratación y compra de productos y servicios para la operación de establecimientos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
