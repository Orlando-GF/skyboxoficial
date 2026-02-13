import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google"; // Fonte wide/display
import { Toaster } from "sonner";
import AgeGate from "@/components/AgeGate";
import CartDrawer from "@/components/CartDrawer";
import CartFab from "@/components/CartFab";
import Footer from "@/components/Footer";
import ConditionalLayout from "@/components/ConditionalLayout";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tabacaria Skybox | Catálogo Online",
  description: "Os melhores kits de sessão você encontra aqui. Narguiles, Essências e Acessórios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${orbitron.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ConditionalLayout>
          <AgeGate />
          <CartDrawer />
          <CartFab />
        </ConditionalLayout>

        {children}

        <ConditionalLayout>
          <Footer />
        </ConditionalLayout>

        <Toaster position="top-center" richColors theme="dark" />
      </body>
    </html>
  );
}