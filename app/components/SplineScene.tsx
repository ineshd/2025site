"use client";

import {useEffect, useRef} from "react";

// Renders an exported Spline scene (.splinecode URL) into a canvas. The runtime
// is imported and the scene created only once the canvas scrolls near the
// viewport, so it doesn't weigh down the page, and disposed on unmount so each
// mount doesn't leak a WebGL/WebGPU context.
export default function SplineScene({scene, className, label}: {
    scene: string;
    className?: string;
    label: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        let app: { dispose(): void } | null = null;
        let cancelled = false;

        const observer = new IntersectionObserver(async (entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            observer.disconnect();
            const {Application} = await import("@splinetool/runtime");
            if (cancelled) return;
            const spline = new Application(canvas);
            app = spline;
            await spline.load(scene);
        }, {rootMargin: "200px"});
        observer.observe(canvas);

        return () => {
            cancelled = true;
            observer.disconnect();
            app?.dispose();
        };
    }, [scene]);

    return <canvas ref={canvasRef} role="img" aria-label={label} className={className}/>;
}
