import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Film Öneri Uygulaması",
  description: "Kişiselleştirilmiş film önerileri al",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
