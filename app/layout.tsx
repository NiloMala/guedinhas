import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { StoreProvider } from "@/services/store";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Guedinhas | Moda e Acessorios",
  description: "Loja virtual de roupas e acessorios Guedinhas."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <StoreProvider>
          <Header />
          <main className="pb-16 md:pb-0">{children}</main>
          <Footer />
          <MobileTabBar />
        </StoreProvider>
      </body>
    </html>
  );
}
