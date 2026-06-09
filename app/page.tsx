"use client"

import Layout from "@/app/components/Layout";
import GaussianSplatViewer from "@/app/components/GaussianSplatViewer";
import FullScreen4545Grid from "@/app/components/FullScreen4545Grid";
import TransitionLink from "@/app/components/TransitionLink";
import Link from "next/link";
import Image from "next/image";
import {Github, Linkedin, Mail} from "lucide-react";
import {memo, useState} from "react";

// Isolated so that re-renders of Home (triggered by FullScreen4545Grid's flip
// state updates) never touch this subtree — preventing the WebGL context from
// being disposed mid-session.
const SplatContainer = memo(function SplatContainer() {
    const [splatLoaded, setSplatLoaded] = useState(false);
    return (
        <div className="[grid-area:splat] relative w-full lg:w-[40rem] h-[34rem] shrink-0 rounded-lg overflow-hidden">
            {splatLoaded ? (
                <GaussianSplatViewer src="/splats/splat-trained.ply" className="w-full h-full"/>
            ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                        src="/splats/splat-preview.png"
                        alt="3D model preview"
                        fill
                        className="object-contain"
                        priority={false}
                    />
                    <button
                        type="button"
                        onClick={(e) => { e.currentTarget.blur(); setSplatLoaded(true); }}
                        className="relative z-10 px-8 py-4 border border-border/20 rounded-lg text-foreground/70 hover:border-primary/40 hover:text-foreground bg-background/60 backdrop-blur-sm transition-colors duration-200"
                    >
                        Load 3D model
                    </button>
                </div>
            )}
        </div>
    );
});

export default function Home() {
    return (
        <Layout headerPosition="absolute">

            {/* Hero */}
            <section className="[view-transition-name:hero] relative h-screen flex flex-col justify-center items-center text-center px-8 lg:items-start lg:justify-end lg:text-left lg:px-20 lg:pb-24">
                <div aria-hidden="true" className="opacity-10 absolute inset-0 overflow-hidden [overflow-anchor:none]">
                    <FullScreen4545Grid clickToFlip/>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-5 lg:items-start pointer-events-none">
                    <h1 className="text-6xl max-lg:text-4xl max-sm:text-3xl font-black italic pointer-events-auto">
                        Inesh Dey
                    </h1>
                    <p className="text-2xl max-lg:text-xl text-accent pointer-events-auto">
                        University of Michigan CoE '30 | Computer Science & Engineering
                    </p>
                    <p className="text-xl max-lg:text-base max-w-lg leading-relaxed pointer-events-auto">
                        I like installing software, meeting people, and winning competitions :)
                    </p>
                    <p className="text-md tracking-wide pointer-events-auto">
                        try clicking the background
                    </p>
                    <div className="flex gap-6 mt-4 text-foreground/50 pointer-events-auto">
                        <Link href="https://github.com/somebody4545" target="_blank" aria-label="GitHub"
                              className="hover:text-primary transition-colors duration-200">
                            <Github size={28}/>
                        </Link>
                        <Link href="https://linkedin.com/in/ineshdey" target="_blank" aria-label="LinkedIn"
                              className="hover:text-primary transition-colors duration-200">
                            <Linkedin size={28}/>
                        </Link>
                        <Link href="mailto:ineshdey@hotmail.com" aria-label="Email"
                              className="hover:text-primary transition-colors duration-200">
                            <Mail size={28}/>
                        </Link>
                    </div>
                </div>
                <p className="absolute bottom-12 inset-x-0 text-center text-xl text-foreground/50 tracking-wide shadow-lg pointer-events-none"><span>scroll</span></p>
            </section>

            {/* About */}
            <section className="px-16 max-lg:px-8 pt-16 pb-28">
                <div className="max-w-5xl mx-auto grid gap-x-16 gap-y-6 items-center
                                grid-cols-1 [grid-template-areas:'heading'_'description'_'splat'_'actions']
                                lg:grid-cols-[1fr_40rem] lg:[grid-template-areas:'heading_splat'_'description_splat'_'actions_splat']">
                    <h2 className="[grid-area:heading] text-4xl max-sm:text-3xl font-black italic max-lg:text-center">About Me</h2>
                    <p className="[grid-area:description] text-lg text-foreground/50 leading-relaxed max-w-md max-lg:mx-auto max-lg:text-center">
                        I'm a CS &amp; Engineering student from Redmond, WA, who dabbles in 3D graphics, web development, and machine learning, using them creatively on everything from a TSA Nationals winning website or a history class. I find the same fascination in designing a UI, debugging, or tweaking a neural network at 3 AM till it works. <br/><br></br>I try to work on a variety of projects with the newest tech, and love talking about it too. I'm always down to chat; feel free to reach out!
                    </p>
                    <SplatContainer />
                    <div className="[grid-area:actions] flex flex-col sm:flex-row gap-6 w-full">
                        <TransitionLink href="/projects"
                                        className="group flex-1 flex items-center justify-between border border-border/20 rounded-lg px-8 py-6 hover:border-primary/40 transition-colors duration-200">
                            <span className="[view-transition-name:projects-heading] text-2xl font-black italic group-hover:text-primary transition-colors duration-200">
                                Projects
                            </span>
                            <span className="text-foreground/30 group-hover:text-primary transition-colors duration-200">→</span>
                        </TransitionLink>
                        <TransitionLink href="/experience"
                                        className="group flex-1 flex items-center justify-between border border-border/20 rounded-lg px-8 py-6 hover:border-primary/40 transition-colors duration-200">
                            <span className="[view-transition-name:experience-heading] text-2xl font-black italic group-hover:text-primary transition-colors duration-200">
                                Experience
                            </span>
                            <span className="text-foreground/30 group-hover:text-primary transition-colors duration-200">→</span>
                        </TransitionLink>
                    </div>
                </div>
            </section>

            {/* Blog */}
            <section className="px-16 max-lg:px-8 pb-28">
                <div className="max-w-5xl mx-auto border border-border/20 rounded-lg px-10 py-16 text-center">
                    <h2 className="text-3xl max-sm:text-2xl font-black italic mb-3">Blog</h2>
                    <p className="text-lg text-foreground/50 leading-relaxed">
                        Soon™ since 2024, might do it on Substack since that's more convenient for both of us.
                    </p>
                </div>
            </section>

        </Layout>
    );
}
