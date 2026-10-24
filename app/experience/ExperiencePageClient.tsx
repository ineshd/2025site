"use client"

import Layout from "@/app/components/Layout";
import FullScreen4545Grid from "@/app/components/FullScreen4545Grid";
import { Link2 } from "lucide-react";
import type { ReactNode } from "react";
import type { StaticImageData } from "next/image";
import { EntryHoverFill, EntryPreviewImage, EntryPreviewLogo } from "@/app/components/EntryPreview";
import systematicChaos from "@/app/experience/systematic-chaos.webp";
import suasStem from "@/app/experience/suas-stem.jpg";
import teslaStemTsa from "@/app/experience/tesla-stem-tsa.webp";
import uscImaps from "@/app/experience/usc-imaps.png";
import umarv from "@/app/experience/umarv.png";
import maav from "@/app/experience/maav.webp";
import roveLogo from "@/app/experience/rove-logo.png";
import uttoronLogo from "@/app/experience/uttoron-logo.png";

type Experience = {
    org: string;
    role: string;
    period: string;
    desc?: string;
    image?: StaticImageData;
    // Where the resting square crops a wide image; defaults to its left edge.
    imageFocus?: "left" | "center";
    // A logo, shown whole in a square like the 3D models (instead of an image).
    logo?: StaticImageData;
    hasModel?: boolean;
    href?: string;
};

const experience: Experience[] = [
    {
        org: "UMich NERS, RHE Lab",
        role: "Undergraduate Research Assistant",
        period: "Oct 2026 – Present",
        desc: "Merged the Radiation Weather Stations public site and a dashboard for up to 10 Raspberry Pi stations into one Next.js app on a Flask + MySQL API, matching the prior API on 390/390 test requests. Hardened the API against SQL injection and added a TTL cache with in-flight request de-duplication.",
        href: "https://ners.engin.umich.edu/",
    },
    {
        org: "Michigan Autonomous Aerial Vehicles",
        role: "Member, Software Subteam",
        period: "Sep 2026 – Present",
        desc: "Working on computer vision for autonomous aerial vehicles through the team's new-member software cohort.",
        href: "https://maavumich.org/",
        image: maav,
        imageFocus: "center",
    },
    {
        org: "UM Autonomous Robotic Vehicle",
        role: "Member, Computer Vision Subteam",
        period: "Sep 2026 – Present",
        desc: "Built a synthetic data pipeline in Blender in one week to generate training data for the vehicle's computer vision models.",
        href: "https://www.umarv.com/",
        image: umarv,
        imageFocus: "center",
    },
    {
        org: "USC i-MAPS",
        role: "Research Intern",
        period: "Apr 2026 – Sep 2026",
        desc: "Developed Hamiltonian physics-informed neural networks for predictive maintenance of machining tools, reaching 90% status-classification and 60% severity-classification accuracy on limited training data. Built an accessible Next.js/Three.js digital twin of the machining setup, demoed to i-MAPS researchers.",
        hasModel: true,
        href: "https://sc.edu/study/colleges_schools/engineering_and_computing/research/research_directory/banerjee_imaps.php",
        image: uscImaps,
    },
    {
        org: "SUAS @STEM",
        role: "Software Subsystem Lead, Field Ops Member, & Lead Web Developer",
        period: "Oct 2025 – Jun 2026",
        desc: "2nd place among first-time US teams and 26th overall at AUVSI SUAS 2026 Internationals, a field dominated by university teams. Drone control and automated imaging with Ardupilot + YOLO. Custom ground control systems. Team website design and development.",
        hasModel: true,
        href: "https://www.suasstem.org/",
        image: suasStem,
    },
    {
        org: "Tesla STEM TSA",
        role: "Vice President",
        period: "Jun 2025 – May 2026",
        desc: "Events and management site for a 200+ member club, over a third of the student body.",
        hasModel: true,
        href: "https://tesla.lwsd.org/activities/asb",
        image: teslaStemTsa,
    },
    {
        org: "Uttoron",
        role: "Software Application Developer",
        period: "Mar 2025 – Jan 2026",
        desc: "React-based site for blog post and event/member management at uttoron.org.",
        hasModel: true,
        href: "https://uttoron.org/",
        logo: uttoronLogo,
    },
    {
        org: "Rove (YC W24)",
        role: "Software Engineer Intern",
        period: "May – Dec 2024",
        desc: "Built a points redeeming system and taught 20 high school students React.js fundamentals in the process.",
        hasModel: true,
        href: "https://rove.com/",
        logo: roveLogo,
    },
    {
        org: "FTC 19669 Systematic Chaos",
        role: "Programmer",
        period: "Sep 2024 – Feb 2025",
        desc: "Autonomous and driver control with Roadrunner PID and image detection. Made states.",
        hasModel: true,
        href: "https://ftcscout.org/teams/19669?season=2024",
        image: systematicChaos,
    },
];

const itemClassName = "group relative isolate flex items-center gap-12 max-lg:flex-col max-lg:items-stretch -mx-6 px-6 py-6";

function ExperienceItem({ href, expands, children }: { href?: string; expands: boolean; children: ReactNode }) {
    return href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={itemClassName}>
            <EntryHoverFill expands={expands}/>
            {children}
        </a>
    ) : (
        <div className={itemClassName}>
            <EntryHoverFill expands={expands}/>
            {children}
        </div>
    );
}

export default function ExperiencePageClient() {
    return (
        <Layout>

            <section className="relative px-16 max-lg:px-8 z-10">
                <div className="max-w-5xl mx-auto bg-background shadow-2xl min-h-screen px-10 py-28 max-lg:px-6">
                    <h1 className="[view-transition-name:experience-heading] text-5xl max-lg:text-4xl max-sm:text-3xl font-black mb-14">
                        Experience
                    </h1>
                    <div className="flex flex-col gap-4">
                        {experience.map((item) => (
                            <ExperienceItem key={item.org} href={item.href} expands={!!item.image}>
                                {item.image && <EntryPreviewImage image={item.image} alt={`${item.org} preview`} focus={item.imageFocus}/>}
                                {item.logo && <EntryPreviewLogo image={item.logo} alt={`${item.org} logo`}/>}
                                {/* The corner link would sit on the preview, so entries with an image show it under the text instead. */}
                                {item.href && !item.image && !item.logo && <p className="hidden sm:flex absolute top-6 right-8 items-center gap-1.5 text-sm text-foreground/30 tracking-wide truncate max-w-[40%] group-hover:text-background/70 transition-colors duration-200">
                                    <Link2 size={14} className="shrink-0"/>
                                    {item.href}
                                </p>}
                                <div className="flex-1">
                                    <h3 className="text-2xl max-sm:text-xl font-bold mb-1 group-hover:text-background transition-colors duration-200">
                                        {item.org}
                                    </h3>
                                    <p className="text-sm text-foreground/30 tracking-wide mb-3 group-hover:text-background/70">{item.period}</p>
                                    <p className="text-base text-foreground/50 leading-relaxed mb-2 group-hover:text-background/80">
                                        {item.role}
                                    </p>
                                    {item.desc && <p className="text-base text-foreground/50 leading-relaxed group-hover:text-background/80">
                                        {item.desc}
                                    </p>}
                                    {item.href && <p className={`${item.image || item.logo ? "" : "sm:hidden "}mt-4 flex items-center gap-1.5 text-xs text-foreground/30 tracking-wide truncate break-all group-hover:text-background/70 transition-colors duration-200`}>
                                        <Link2 size={12} className="shrink-0"/>
                                        {item.href}
                                    </p>}
                                </div>
                            </ExperienceItem>
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