import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WalletBalance from "@/components/WalletBalance";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hiuri | ecommerce store website",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider> {/* ✅ Wrap everything inside */}
          <Navbar />
          {/* <WalletBalance /> */}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
