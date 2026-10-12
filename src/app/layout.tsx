
import { Metadata } from "next";
import "./globals.css";
import { Provider } from "@/components";

export const metadata: Metadata = {
  title: {
    template: "%s - La | Perchita",
    default: "Tu Percha"
  },
  description: 'Tienda Virtual de Productos'
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>
        {children}
        </Provider>
      </body>
    </html>
  );
}
