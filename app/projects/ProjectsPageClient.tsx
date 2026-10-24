"use client"

import Layout from "@/app/components/Layout";
import FullScreen4545Grid from "@/app/components/FullScreen4545Grid";
import Link from "next/link";
import {StaticImageData} from "next/image";
import {EntryHoverFill, EntryPreviewImage} from "@/app/components/EntryPreview";
import {Link2} from "lucide-react";
import SplineScene from "@/app/components/SplineScene";
import tsaWebmaster from "@/app/projects/tsa-webmaster.webp";
import smartGardenPi from "@/app/projects/smart-garden-pi.jpg";
import ecoCollab from "@/app/projects/ecocollab.webp";

type Project = {
    name: string;
    period: string;
    description: string;
    tags: string[];
    href: string;
    image?: StaticImageData;
    // Exported Spline scene (.splinecode URL), shown in place of an image.
    splineScene?: string;
};

const projects: Project[] = [
    {
        name: "TSA Webmaster 2025",
        period: "Winter 2025",
        description: "1st place at Washington TSA State 2025, then went on to win at the TSA National Conference. Full-stack Next.js competition site built and presented under contest conditions.",
        tags: ["TypeScript", "Next.js"],
        href: "https://github.com/ineshd/TSA-Webmaster-2025",
        image: tsaWebmaster,
    },
    {
        name: "Smart Garden Pi",
        period: "Summer 2025",
        description: "Raspberry Pi controller reading 7 sensors over I2C, 1-Wire, and ADC that runs a relay pump whenever moisture drops below a threshold, with a Flask API, Pi Camera time-lapse, and a Next.js dashboard. Ran unattended for 2 months.",
        tags: ["TypeScript", "Raspberry Pi", "IoT"],
        href: "https://github.com/ineshd/Smart-Garden-Pi",
        image: smartGardenPi,
    },
    {
        name: "EcoCollab",
        period: "Winter 2024",
        description: "Hackathon project for EmP Hackfest SmartHack 2024. Won the \"Outstanding Code\" award sponsored by AoPS.",
        tags: ["Hackathon", "TypeScript"],
        href: "https://devpost.com/software/restoration-hub",
        image: ecoCollab,
    },
    {
        name: "Teen Mental Health in WA",
        period: "Spring 2024",
        description: "Data visualization project for the WTN Youth Science Contest exploring teen mental health trends in Washington State. Placed 2nd in Science Communication.",
        tags: ["Python", "Data Viz"],
        href: "https://wtn-project.vercel.app/",
        // WTN model, carried over from website2.0.
        splineScene: "https://prod.spline.design/7lAeN9hBP1jPBLq2/scene.splinecode",
    },
    {
        name: "Multi Monitor Tools",
        period: "Fall 2023",
        description: "Python utility for matching brightness across monitors and a software-based dynamic contrast ratio implementation.",
        tags: ["Python", "DCR"],
        href: "https://github.com/ineshd/multimonitortools",
        // DCR model, carried over from website2.0.
        splineScene: "https://prod.spline.design/rTg1TthgVaxRD4sO/scene.splinecode",
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
                    <h1 className="[view-transition-name:projects-heading] text-5xl max-lg:text-4xl max-sm:text-3xl font-black mb-14">
                        Projects
                    </h1>
                    <div className="flex flex-col gap-4">
                        {projects.map((project) => (
                            <Link key={project.name} href={project.href} target="_blank"
                                  className="group relative isolate flex items-center gap-12 max-lg:flex-col max-lg:items-stretch -mx-6 px-6 py-6">
                                <EntryHoverFill expands={!!project.image}/>
                                {project.image && <EntryPreviewImage image={project.image} alt={`${project.name} preview`}/>}
                                {project.splineScene && (
                                    // preventDefault so interacting with the model doesn't open the project link.
                                    <div onClick={(e) => e.preventDefault()} className="relative w-full aspect-video lg:aspect-auto lg:size-48 shrink-0 lg:order-last">
                                        {/* absolute so the runtime's own canvas sizing can't stretch the slot */}
                                        <SplineScene scene={project.splineScene} label={`${project.name} 3D model`}
                                                     className="absolute inset-0 block w-full h-full"/>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="text-2xl max-sm:text-xl font-bold mb-1 group-hover:text-background transition-colors duration-200">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-foreground/30 tracking-wide mb-3 group-hover:text-background/70">{project.period}</p>
                                    <p className="text-base text-foreground/50 leading-relaxed group-hover:text-background/80">
                                        {project.description}
                                    </p>
                                    <p className="flex items-center gap-1.5 text-sm text-foreground/30 tracking-wide mt-3 truncate group-hover:text-background/70 transition-colors duration-200">
                                        <Link2 size={14} className="shrink-0"/>
                                        {project.href.replace(/^https?:\/\//, "")}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            {/* Pinned while scrolling but ends with the page content (not fixed),
                so it never shows behind the footer or in overscroll. */}
            <div aria-hidden="true" className="max-lg:hidden absolute inset-0 pointer-events-none z-0">
                <div className="sticky top-0 h-screen overflow-hidden opacity-10">
                    <FullScreen4545Grid/>
                </div>
            </div>
        </Layout>
    );
}