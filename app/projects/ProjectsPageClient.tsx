"use client"

import Layout from "@/app/components/Layout";
import FullScreen4545Grid from "@/app/components/FullScreen4545Grid";
import Link from "next/link";
import {Link2} from "lucide-react";

const projects = [
    {
        name: "TSA Webmaster 2025",
        period: "Winter 2025",
        description: "1st place at Washington TSA State 2025, then went on to win at the TSA National Conference. Full-stack Next.js competition site built and presented under contest conditions.",
        tags: ["TypeScript", "Next.js"],
        href: "https://github.com/ineshd/TSA-Webmaster-2025",
    },
    {
        name: "Smart Garden Pi",
        period: "Summer 2025",
        description: "IoT smart garden controller on Raspberry Pi. Automated watering, sensor data logging, and a web dashboard.",
        tags: ["TypeScript", "Raspberry Pi", "IoT"],
        href: "https://github.com/ineshd/Smart-Garden-Pi",
    },
    {
        name: "EcoCollab",
        period: "Winter 2024",
        description: "Hackathon project for EmP Hackfest SmartHack 2024. Won the \"Outstanding Code\" award sponsored by AoPS.",
        tags: ["Hackathon", "TypeScript"],
        href: "https://devpost.com/software/restoration-hub",
    },
    {
        name: "Teen Mental Health in WA",
        period: "Spring 2024",
        description: "Data visualization project for the WTN Youth Science Contest exploring teen mental health trends in Washington State. Placed 2nd in Science Communication.",
        tags: ["Python", "Data Viz"],
        href: "https://wtn-project.vercel.app/",
    },
    {
        name: "Multi Monitor Tools",
        period: "Fall 2023",
        description: "Python utility for matching brightness across monitors and a software-based dynamic contrast ratio implementation.",
        tags: ["Python", "DCR"],
        href: "https://github.com/ineshd/multimonitortools",
    },
    {
        name: "Raspberry Pi Stripe Demo",
        period: "Summer 2023",
        description: "Stripe payment integration on a Raspberry Pi using Flask, the Stripe API, and uWSGI. A low-stakes experiment in self-hosted e-commerce.",
        tags: ["Python", "Flask", "Stripe", "Raspberry Pi"],
        href: "https://github.com/ineshd/Raspberry-Pi-Stripe-Demo",
    },
];

export default function ProjectsPageClient() {
    return (
        <Layout>

            <section className="relative px-16 max-lg:px-8 z-10">
                <div className="max-w-5xl mx-auto bg-background shadow-2xl min-h-screen px-10 py-28 max-lg:px-6">
                    <h1 className="[view-transition-name:projects-heading] text-5xl max-lg:text-4xl max-sm:text-3xl font-black italic mb-14">
                        Projects
                    </h1>
                    <div className="flex flex-col gap-16">
                        {projects.map((project) => (
                            <Link key={project.name} href={project.href} target="_blank"
                                  className="group flex items-center gap-12 max-lg:flex-col max-lg:items-stretch">
                                {/* TODO: project preview image / 3D model goes here, e.g.
                                <div className="w-full lg:w-80 h-52 shrink-0 rounded-lg bg-blue-950/60 border border-blue-400/10 group-hover:border-primary/40 transition-colors duration-200"/>
                                */}
                                <div className="flex-1">
                                    <h3 className="text-2xl max-sm:text-xl font-bold mb-1 group-hover:text-primary transition-colors duration-200">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-foreground/30 tracking-wide mb-3">{project.period}</p>
                                    <p className="text-base text-foreground/50 leading-relaxed">
                                        {project.description}
                                    </p>
                                    <p className="flex items-center gap-1.5 text-sm text-foreground/30 tracking-wide mt-3 truncate group-hover:text-primary/60 transition-colors duration-200">
                                        <Link2 size={14} className="shrink-0"/>
                                        {project.href.replace(/^https?:\/\//, "")}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <div aria-hidden="true" className="max-lg:hidden fixed inset-0 overflow-hidden opacity-10 pointer-events-none z-0">
                <FullScreen4545Grid/>
            </div>
        </Layout>
    );
}