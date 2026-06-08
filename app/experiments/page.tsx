"use client"

import Layout from "@/app/components/Layout";
import TransitionLink from "@/app/components/TransitionLink";
import Link from "next/link";
import {Link2} from "lucide-react";

const experiments = [
    {
        name: "Finding New Fixtures",
        description: "A look at discovering and visualizing lighting fixtures — a small experiment in data and design.",
        href: "/find-new-fixtures",
        external: false,
    },
    {
        name: "3D Glass Thingy",
        description: "A Three.js experiment with real-time 3D rendering, custom materials, and WebGL shader effects running entirely in the browser.",
        href: "https://github.com/somebody4545/3dglassthingy",
        external: true,
    },
    {
        name: "s4545.eu.org",
        description: "My old personal website, also very fun.",
        href: "https://s4545.eu.org",
        external: true,
    },
];

const cardClassName = "group relative block border border-border/20 rounded-lg px-8 py-6 hover:border-primary/40 transition-colors duration-200";

export default function ExperimentsPage() {
    return (
        <Layout>
            <section className="px-16 max-lg:px-8 py-28">
                <h1 className="text-5xl max-lg:text-4xl max-sm:text-3xl font-black italic mb-4">
                    Experiments
                </h1>
                <h2 className="text-xl text-foreground/50 mb-8">
                    Unpolished stuff that's cool enough to share.
                </h2>
                <div className="flex flex-col gap-8">
                    {experiments.map((item) => {
                        const url = item.href.replace(/^https?:\/\//, "");
                        const content = (
                            <>
                                <p className="hidden sm:flex absolute top-6 right-8 items-center gap-1.5 text-sm text-foreground/30 tracking-wide truncate max-w-[40%] group-hover:text-primary/60 transition-colors duration-200">
                                    <Link2 size={14} className="shrink-0"/>
                                    {url}
                                </p>
                                <h3 className="text-2xl font-bold mb-1 pr-4 group-hover:text-primary transition-colors duration-200">
                                    {item.name}
                                </h3>
                                <p className="text-base text-foreground/50 leading-relaxed">
                                    {item.description}
                                </p>
                                <p className="flex sm:hidden items-center gap-1.5 text-sm text-foreground/30 tracking-wide mt-3 truncate group-hover:text-primary/60 transition-colors duration-200">
                                    <Link2 size={14} className="shrink-0"/>
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
            </section>
        </Layout>
    );
}
