import type {Metadata} from "next";
import {Geist, Geist_Mono, Montserrat} from "next/font/google";
import {ViewTransitionProvider} from "@/app/components/ViewTransitionProvider";
import {Analytics} from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    ?? "https://ineshd.com";

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
    metadataBase: new URL(siteUrl),
    title: {
        default: "Inesh Dey",
        template: "%s | Inesh Dey",
    },
    description: "Inesh Dey's portfolio featuring computer science, 3D graphics, web development, machine learning, projects, and experience.",
    openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "Inesh Dey",
        title: "Inesh Dey",
        description: "Inesh Dey's portfolio featuring computer science, 3D graphics, web development, machine learning, projects, and experience.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Inesh Dey",
        description: "Inesh Dey's portfolio featuring computer science, 3D graphics, web development, machine learning, projects, and experience.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
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
