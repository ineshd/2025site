"use client"

import Layout from "@/app/components/Layout";
import TransitionLink from "@/app/components/TransitionLink";
import Link from "next/link";
import FullScreen4545Grid from "@/app/components/FullScreen4545Grid";
import { Link2 } from "lucide-react";

const experiments = [
    {
        name: "Finding New Fixtures",
        description: "Tracking down the water-hungry fixtures in our house and finding efficient swaps, saved about 554 gallons a week.",
        href: "/find-new-fixtures",
        external: false,
    },
    {
        name: "3D Glass Thingy",
        description: "A Three.js experiment with real-time 3D rendering, custom materials, and WebGL shader effects running entirely in the browser.",
        href: "https://github.com/ineshd/3dglassthingy",
        external: true,
    },
    {
        name: "s4545.eu.org",
        description: "My old personal website, also very fun.",
        href: "https://s4545.eu.org",
        external: true,
    },
];

const cardClassName = "group relative block rounded-lg px-8 py-6 hover:bg-primary hover:border-primary active:bg-secondary active:border-secondary transition-colors duration-200";

export default function ExperimentsPageClient() {
    return (
        <Layout>
            <section className="relative px-16 max-lg:px-8 z-10">
                <div className="max-w-5xl mx-auto bg-background shadow-2xl min-h-screen px-10 py-28 lg:-mt-32 lg:pt-60 max-lg:px-6">
                    <h1 className="text-5xl max-lg:text-4xl max-sm:text-3xl font-black mb-4">
                        Experiments
                    </h1>
                    <h2 className="text-xl text-foreground/50 mb-8">
                        Some unpolished projects.
                    </h2>
                    <div className="flex flex-col gap-8">
                        {experiments.map((item) => {
                            const url = item.href.replace(/^https?:\/\//, "");
                            const content = (
                                <>
                                    <p className="hidden sm:flex absolute top-6 right-8 items-center gap-1.5 text-sm text-foreground/30 tracking-wide truncate max-w-[40%] group-hover:text-background/70 transition-colors duration-200">
                                        <Link2 size={14} className="shrink-0" />
                                        {url}
                                    </p>
                                    <h3 className="text-2xl font-bold mb-1 pr-4 group-hover:text-background transition-colors duration-200">
                                        {item.name}
                                    </h3>
                                    <p className="text-base text-foreground/50 leading-relaxed group-hover:text-background/80">
                                        {item.description}
                                    </p>
                                    <p className="flex sm:hidden items-center gap-1.5 text-sm text-foreground/30 tracking-wide mt-3 truncate group-hover:text-background/70 transition-colors duration-200">
                                        <Link2 size={14} className="shrink-0" />
                                        {url}
                                    </p>
                                </>
                            );

                            return item.external ? (
                                <Link key={item.name} href={item.href} target="_blank" className={cardClassName}>
                                    {content}
                                </Link>
                            ) : (
                                <TransitionLink key={item.name} href={item.href} className={cardClassName}>
                                    {content}
                                </TransitionLink>
                            );
                        })}
                    </div>
                </div>
            </section>
            {/* Pinned while scrolling but ends with the page content (not fixed),
                so it never shows behind the footer or in overscroll. */}
            <div aria-hidden="true" className="max-lg:hidden absolute inset-x-0 bottom-0 -top-32 pointer-events-none z-0">
                <div className="sticky top-0 h-screen overflow-hidden opacity-10">
                    <FullScreen4545Grid text="experiments " />
                </div>
            </div>
        </Layout>
    );
}
