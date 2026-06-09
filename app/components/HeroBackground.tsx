"use client"

import {useEffect, useRef} from "react";
import FullScreen4545Grid from "@/app/components/FullScreen4545Grid";

// Renders the live animated grid for steady-state, plus a hidden static
// stand-in. Around a view transition the two are swapped (via direct DOM, so
// it's synchronous and lands before the snapshot is captured): the heavy
// animated grid is hidden and the cheap static one is shown, so the browser
// never rasterizes hundreds of live framer-motion nodes into the hero's
// named-group snapshot — which is what stalled Safari leaving the home page.
export default function HeroBackground() {
    const animatedRef = useRef<HTMLDivElement>(null);
    const staticRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // visibility (not display) so the hidden static grid keeps its layout
        // box — it measures text width via getBoundingClientRect on mount, which
        // would return 0 under display:none and render the grid blank.
        const showStatic = () => {
            if (animatedRef.current) animatedRef.current.style.visibility = "hidden";
            if (staticRef.current) staticRef.current.style.visibility = "visible";
        };
        const showAnimated = () => {
            if (animatedRef.current) animatedRef.current.style.visibility = "visible";
            if (staticRef.current) staticRef.current.style.visibility = "hidden";
        };
        document.addEventListener("hero-capture:start", showStatic);
        document.addEventListener("hero-capture:end", showAnimated);
        return () => {
            document.removeEventListener("hero-capture:start", showStatic);
            document.removeEventListener("hero-capture:end", showAnimated);
        };
    }, []);

    return (
        <>
            <div ref={animatedRef} aria-hidden="true"
                 className="opacity-10 absolute inset-0 overflow-hidden [overflow-anchor:none]">
                <FullScreen4545Grid clickToFlip/>
            </div>
            <div ref={staticRef} aria-hidden="true" style={{visibility: "hidden"}}
                 className="opacity-10 absolute inset-0 overflow-hidden [overflow-anchor:none]">
                <FullScreen4545Grid animate={false}/>
            </div>
        </>
    );
}
