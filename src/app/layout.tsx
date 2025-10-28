import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "../routes/providers";
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo",
  description: "Transformasi Produktivitas Tim dengan Kanban Cerdas",
  icons: {
    icon: [
      { media: "(prefers-color-scheme: light)", url: "/icon-light.ico" },
      { media: "(prefers-color-scheme: dark)", url: "/icon-dark.ico" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body
          className={`bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600 ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster position="top-center" />
          {children}
        </body>
      </html>
    </Providers>
  );
}
