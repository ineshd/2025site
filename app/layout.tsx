import type { Metadata } from "next";
import { Asap, Montserrat, Roboto_Mono } from "next/font/google";
import { ViewTransitionProvider } from "@/app/components/ViewTransitionProvider";
import { Analytics } from "@vercel/analytics/next";
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
    // Only the footer uses it, at one weight: a static 400 file is ~13 KB vs ~33 KB for
    // the variable font. (Asap and Montserrat use 3+ weights, where the variable file wins.)
    weight: ["400"],
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
                {/* Subset to just the icons used on the site; add names here (alphabetical) as needed.
                display=block on purpose: with swap, icon names flash as text before the
                font loads. no-page-custom-font targets the pages/ router's _document; this
                root layout already applies to every page. */}
                {/* oxlint-disable-next-line next/no-page-custom-font */}
                <link
                    rel="stylesheet"
                    // oxlint-disable-next-line next/google-font-display
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
