import type {Metadata} from "next";
import {Toaster} from "@/components/ui/toaster"
import "./globals.css";
import {Inter} from 'next/font/google'
import {NextFont} from "next/dist/compiled/@next/font"
import React from "react";
import AuthProvider from "@/components/providers/AuthProvider";
import type { Viewport } from 'next';

const inter: NextFont = Inter({subsets: ['latin'], display: 'swap'});
export const viewport: Viewport = {
    themeColor: 'black',
    maximumScale: 1,
    initialScale: 1,
    width: 'device-width',
    viewportFit: 'cover',
}

export const metadata: Metadata = {
    title: "SIM RSU UMM",
    description: "Sistem Manajemen Rumah Sakit Umum Universitas Muhammadiyah Malang",
    generator: "Next.js",
    manifest: "/manifest.json",
    icons: [
        { rel: "apple-touch-icon", url: "/icons/ummhospital-128.png" },
        { rel: "icon", url: "/icons/ummhospital-128.png" },
    ],
};

export default function RootLayout({children
}: Readonly<{children: React.ReactNode }>) {
    return (
        <html lang="id">
        <body
            className={`${inter.className} antialiased overflow-hidden`}
        >
        <AuthProvider>
            {children}
            <Toaster/>
        </AuthProvider>
        </body>
        </html>
    );
}
