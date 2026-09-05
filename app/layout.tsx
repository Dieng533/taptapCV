import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TAP TAP CV – Créez votre CV professionnel en ligne",
  description:
    "Créez facilement votre CV professionnel en ligne avec TAP TAP CV. Choisissez un modèle, personnalisez-le et téléchargez votre CV en PDF.",
  openGraph: {
    title: "TAP TAP CV",
    description: "Créez votre CV. Tapez, personnalisez, téléchargez.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
