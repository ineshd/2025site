"use client"

import GaussianSplatViewer from "@/app/components/GaussianSplatViewer";
import Image from "next/image";
import {memo, useEffect, useRef, useState} from "react";

export const SplatContainer = memo(function SplatContainer() {
    const [splatLoaded, setSplatLoaded] = useState(false);
    return (
        <div className="[grid-area:splat] relative w-full lg:w-[40rem] h-64 sm:h-80 lg:h-[34rem] shrink-0 rounded-lg overflow-hidden">
            {splatLoaded ? (
                <GaussianSplatViewer src="/splats/splat-trained.ply" className="w-full h-full"/>
            ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                        src="/splats/splat-preview.png"
                        alt="3D model preview"
                        fill
                        sizes="(min-width: 1024px) 40rem, 100vw"
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

export const BlogPlaceholder = memo(function BlogPlaceholder() {
    const [blogLoaded, setBlogLoaded] = useState(false);
    const placeholderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = placeholderRef.current;

        if (!element || blogLoaded) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setBlogLoaded(true);
                    observer.disconnect();
                }
            },
            {rootMargin: "200px"}
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [blogLoaded]);

    if (blogLoaded) {
        return (
            <div className="mt-8 flex justify-center overflow-hidden rounded-lg">
                <iframe
                    src="https://somebody4545.substack.com/embed?embedId=somebody4545"
                    width="720"
                    height="420"
                    style={{border: "1px solid #EEE", background: "white", maxWidth: "100%"}}
                    frameBorder="0"
                    scrolling="no"
                    title="Substack embed"
                    loading="lazy"
                />
            </div>
        );
    }

    return (
        <div ref={placeholderRef} className="mt-8 mx-auto max-w-2xl rounded-lg border border-border/30 bg-muted/80 px-6 py-10 text-left backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-foreground/70">Blog</p>
            <h3 className="mt-3 text-2xl max-sm:text-xl font-black italic">Newsletter preview</h3>
            <p className="mt-4 text-foreground/80 leading-relaxed">
                Loading embed.
            </p>
        </div>
    );
});