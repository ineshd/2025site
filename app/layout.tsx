import type {Metadata} from "next";
import {Asap, Montserrat, Roboto_Mono} from "next/font/google";
import {ViewTransitionProvider} from "@/app/components/ViewTransitionProvider";
import {Analytics} from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    ?? "https://ineshd.com";

const asap = Asap({
    variable: "--font-asap",
    subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
    variable: "--font-roboto-mono",
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
        <head>
            {/* Subset to just the icons used on the site; add names here (alphabetical) as needed. */}
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=arrow_downward,arrow_forward,arrow_upward&display=block"
            />
        </head>
        <body
            className={`${asap.variable} ${robotoMono.variable} ${montserrat.variable} antialiased`}
        >
        <ViewTransitionProvider>
            {children}
        </ViewTransitionProvider>
        <Analytics />
        </body>
        </html>
    );
}
