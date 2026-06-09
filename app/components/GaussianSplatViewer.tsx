"use client"

import {useEffect, useRef} from "react";
import * as THREE from "three";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";

export default function GaussianSplatViewer({src, className}: { src: string; className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 1.2, 5);
        camera.lookAt(0, 0, 0);

        // Render at a fraction of the container's CSS size (canvas is upscaled via CSS) to keep
        // the splat sort/raster cost down — gaussian splatting is fill-rate heavy.
        const RENDER_SCALE = 0.5;
        const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(container.clientWidth * RENDER_SCALE, container.clientHeight * RENDER_SCALE, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        container.appendChild(renderer.domElement);

        const splatViewer = new GaussianSplats3D.DropInViewer({
            'gpuAcceleratedSort': false,
            'sharedMemoryForWorkers': false,
        });
        scene.add(splatViewer);
        splatViewer.addSplatScene(src, {
            'splatAlphaRemovalThreshold': 5,
            'showLoadingUI': false,
            // Source data is upside down relative to Three.js' Y-up convention; flip 180° about Z
            // and nudge it down since it renders a bit high by default.
            'rotation': [0, 0, 1, 0],
            'position': [0, 0.5, 0],
        }).catch(() => {});

        // Smoothly-tracked rotation target driven by mouse position (desktop) or device tilt (mobile)
        const target = {x: 0, y: 0};
        const current = {x: 0, y: 0};

        const handlePointerMove = (e: PointerEvent) => {
            const rect = container.getBoundingClientRect();
            const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
            target.x = THREE.MathUtils.clamp(ny, -1, 1) * 0.35;
            target.y = THREE.MathUtils.clamp(nx, -1, 1) * 0.6;
        };

        const handleOrientation = (e: DeviceOrientationEvent) => {
            const gamma = e.gamma ?? 0; // left-right tilt, roughly [-90, 90]
            const beta = e.beta ?? 0;   // front-back tilt, roughly [0, 180] when held upright
            target.y = THREE.MathUtils.clamp(gamma / 45, -1, 1) * 0.6;
            target.x = THREE.MathUtils.clamp((beta - 45) / 45, -1, 1) * 0.35;
        };

        window.addEventListener("pointermove", handlePointerMove);

        const enableOrientation = () => window.addEventListener("deviceorientation", handleOrientation);
        const requestPermission = (window.DeviceOrientationEvent as unknown as {
            requestPermission?: () => Promise<"granted" | "denied">
        } | undefined)?.requestPermission;

        let removeTapListener: (() => void) | undefined;
        if (typeof requestPermission === "function") {
            const onTap = () => {
                requestPermission().then((state) => {
                    if (state === "granted") enableOrientation();
                }).catch(() => {});
            };
            container.addEventListener("pointerdown", onTap, {once: true});
            removeTapListener = () => container.removeEventListener("pointerdown", onTap);
        } else if (typeof window.DeviceOrientationEvent !== "undefined") {
            enableOrientation();
        }

        let frameId = 0;
        let disposed = false;
        const animate = () => {
            if (disposed) return;
            frameId = requestAnimationFrame(animate);
            current.x += (target.x - current.x) * 0.06;
            current.y += (target.y - current.y) * 0.06;
            splatViewer.rotation.x = current.x;
            splatViewer.rotation.y = current.y;
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            const {clientWidth, clientHeight} = container;
            if (clientWidth === 0 || clientHeight === 0) return;
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(clientWidth * RENDER_SCALE, clientHeight * RENDER_SCALE, false);
        };
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);

        return () => {
            disposed = true;
            cancelAnimationFrame(frameId);
            resizeObserver.disconnect();
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("deviceorientation", handleOrientation);
            removeTapListener?.();
            splatViewer.viewer.dispose();
            renderer.dispose();
            if (renderer.domElement.parentElement === container) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [src]);

    return <div ref={containerRef} className={className}/>;
}
