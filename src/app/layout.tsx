import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Header from "@/app/ui/layout/Header";
import Footer from "@/app/ui/layout/Footer";
import Providers from "@/app/ui/layout/Providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Handshake",
  description: "Securely sign and store chat-based agreements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body className={`flex flex-col min-h-screen ${inter.className}`}>
          <Header />
          <main className="flex grow flex-col px-10 py-5">{children}</main>
          <Footer />
          <Toaster />
        </body>
      </html>
    </Providers>
  );
}
