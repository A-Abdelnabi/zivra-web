import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import ChatWidget from "@/components/chat/chat-widget";
import WhatsAppButton from "@/components/whatsapp-button";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "ZIVRA | Build. Launch. Manage.",
  description: "Websites, Apps & AI — All in One Place.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased pb-28`}>
        <Providers>
          {children}

          {/* Floating Widgets */}
          <WhatsAppButton />
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}