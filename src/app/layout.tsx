
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";

import { Inter} from 'next/font/google'
import {NextFont} from "next/dist/compiled/@next/font"
import React from "react";

const inter: NextFont = Inter({ subsets: ['latin'], display: 'swap'});

export const metadata: Metadata = {
  title: "SIM RSU UMM",
  description: "Sistem Manajemen Rumah Sakit Umum Universitas Muhammadiyah Malang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;

}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased overflow-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
