import type {Metadata} from "next";
import {Geist, Geist_Mono, Montserrat} from "next/font/google";
import {ViewTransitionProvider} from "@/app/components/ViewTransitionProvider";
import {Analytics} from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Inesh Dey",
    description: "A good amount of the things I've done.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
        >
        <ViewTransitionProvider>
            {children}
        </ViewTransitionProvider>
        <Analytics />
        </body>
        </html>
    );
}
