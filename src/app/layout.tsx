
import { Metadata } from "next";
import "./globals.css";
import { Provider } from "@/components";

// URL pública de la tienda: necesaria para que la imagen al compartir el enlace sea absoluta.
// En Vercel se toma sola (y pasa al dominio propio cuando se configure).
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

const description = 'Prendas escogidas con cariño para que te veas auténtico todos los días. Encuentra tu favorita y pídela directo por WhatsApp.';

// La imagen al compartir (opengraph-image.png) y los íconos (icon.png, apple-icon.png,
// favicon.ico) están en src/app y Next.js los agrega automáticamente.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | Tu Perchita",
    default: "Tu Perchita | Tienda de ropa"
  },
  description,
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: 'Tu Perchita',
    title: 'Tu Perchita | Tienda de ropa',
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tu Perchita | Tienda de ropa',
    description,
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Provider>
        {children}
        </Provider>
      </body>
    </html>
  );
}
