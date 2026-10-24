"use client"

import Layout from "@/app/components/Layout";
import FullScreen4545Grid from "@/app/components/FullScreen4545Grid";
import { Link2 } from "lucide-react";
import type { ReactNode } from "react";

type Experience = {
    org: string;
    role: string;
    period: string;
    desc?: string;
    hasModel?: boolean;
    href?: string;
};

const experience: Experience[] = [
    {
        org: "UMich NERS, RHE Lab",
        role: "Undergraduate Research Assistant",
        period: "Oct 2026 – Present",
        href: "https://ners.engin.umich.edu/",
    },
    {
        org: "Michigan Autonomous Aerial Vehicles",
        role: "Member, Software Subteam",
        period: "Sep 2026 – Present",
        href: "https://maavumich.org/",
    },
    {
        org: "UM Autonomous Robotic Vehicle",
        role: "Member, Computer Vision Subteam",
        period: "Sep 2026 – Present",
        href: "https://www.umarv.com/",
    },
    {
        org: "USC i-MAPS",
        role: "Research Intern",
        period: "Apr 2026 – Sep 2026",
        desc: "Accessible digital twins and physics-based neural networks at the University of South Carolina.",
        hasModel: true,
        href: "https://sc.edu/study/colleges_schools/engineering_and_computing/research/research_directory/banerjee_imaps.php",
    },
    {
        org: "SUAS @STEM",
        role: "Software Subsystem Lead, Field Ops Member, & Lead Web Developer",
        period: "Oct 2025 – Jun 2026",
        desc: "2nd place among first-time US teams at the collegiate AUVSI SUAS competition. Drone control and automated imaging with Ardupilot + YOLO. Custom ground control systems. Team website design and development.",
        hasModel: true,
        href: "https://www.suasstem.org/",
    },
    {
        org: "Tesla STEM TSA",
        role: "Vice President",
        period: "Jun 2025 – May 2026",
        desc: "Events and management site for a 200+ member club, over a third of the student body.",
        hasModel: true,
        href: "https://tesla.lwsd.org/activities/asb",
    },
    {
        org: "Uttoron",
        role: "Software Application Developer",
        period: "Mar 2025 – Jan 2026",
        desc: "React-based site for blog post and event/member management at uttoron.org.",
        hasModel: true,
        href: "https://uttoron.org/",
    },
    {
        org: "Rove (YC W24)",
        role: "Software Engineer Intern",
        period: "May – Dec 2024",
        desc: "Built a points redeeming system and taught 20 high school students React.js fundamentals in the process.",
        hasModel: true,
        href: "https://rove.com/",
    },
    {
        org: "FTC 19669 Systematic Chaos",
        role: "Programmer",
        period: "Sep 2024 – Feb 2025",
        desc: "Autonomous and driver control with Roadrunner PID and image detection. Made states.",
        hasModel: true,
        href: "https://ftcscout.org/teams/19669?season=2024",
    },
];

const itemClassName = "group relative flex items-center gap-12 max-lg:flex-col max-lg:items-stretch";

function ExperienceItem({ href, children }: { href?: string; children: ReactNode }) {
    return href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={itemClassName}>{children}</a>
    ) : (
        <div className={itemClassName}>{children}</div>
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
                    <div className="flex flex-col gap-16">
                        {experience.map((item) => (
                            <ExperienceItem key={item.org} href={item.href}>
                                {/* TODO: org logo / 3D model goes here when item.hasModel, e.g.
                                {item.hasModel && (
                                    <div className="w-full lg:w-80 h-52 shrink-0 rounded-lg bg-blue-950/60 border border-blue-400/10 group-hover:border-primary/40 transition-colors duration-200"/>
                                )}
                                */}
                                {item.href && <p className="hidden sm:flex absolute top-6 right-8 items-center gap-1.5 text-sm text-foreground/30 tracking-wide truncate max-w-[40%] group-hover:text-primary/60 transition-colors duration-200">
                                    <Link2 size={14} className="shrink-0"/>
                                    {item.href}
                                </p>}
                                <div className="flex-1">
                                    <h3 className="text-2xl max-sm:text-xl font-bold mb-1 group-hover:text-primary transition-colors duration-200">
                                        {item.org}
                                    </h3>
                                    <p className="text-sm text-foreground/30 tracking-wide mb-3">{item.period}</p>
                                    <p className="text-base text-foreground/50 leading-relaxed mb-2">
                                        {item.role}
                                    </p>
                                    {item.desc && <p className="text-base text-foreground/50 leading-relaxed">
                                        {item.desc}
                                    </p>}
                                    {item.href && <p className="sm:hidden mt-4 flex items-center gap-1.5 text-xs text-foreground/30 tracking-wide truncate break-all group-hover:text-primary/60 transition-colors duration-200">
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