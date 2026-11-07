"use client"
import React, { useEffect, useState, useRef, useCallback, useMemo, useSyncExternalStore } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';

interface FullScreen4545GridProps {
    clickToFlip?: boolean;
    // When false, render a cheap non-animated single-pass grid. Used as the
    // view-transition snapshot stand-in so the browser never has to rasterize
    // the hundreds of live framer-motion nodes into a named-group snapshot.
    animate?: boolean;
}

const getSystemInfo = (): string => {
    if (typeof navigator === 'undefined') return '';
    const ua = navigator.userAgent;

    let os = 'Unknown OS';
    if (/Windows/.test(ua)) os = 'Windows';
    else if (/Mac OS X/.test(ua)) os = 'macOS';
    else if (/Android/.test(ua)) os = 'Android';
    else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
    else if (/Linux/.test(ua)) os = 'Linux';

    let browser = 'Unknown Browser';
    if (/Edg\//.test(ua)) browser = 'Edge';
    else if (/Firefox\//.test(ua)) browser = 'Firefox';
    else if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) browser = 'Chrome';
    else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) browser = 'Safari';

    return `${os} · ${browser} · `;
};

const noopSubscribe = () => () => { };

const FLIP_TEXTS = [
    'cool background ',
    '!!!!',
    '⚽️',
    '🏎️ ',
    '😬',
    `${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · `,
];

type FlipPhase = 'idle' | 'compressing' | 'expanding';

const ROTATION_DEG = 12;
const FLIP_STEP_MS = 150;
const SCROLL_DURATION_S = 720;
const SCROLL_BOOST = 0.4;
const SCROLL_BOOST_DECAY = 3;
const SCROLL_BLUR_PER_PX = 35;
const SCROLL_BLUR_MAX_PX = 8;
const SCROLL_BLUR_STEP_PX = 0.25; // only re-apply the blur when it changes by this much

const FullScreen4545Grid: React.FC<FullScreen4545GridProps> = ({ clickToFlip = false, animate = true }) => {
    const [textIndex, setTextIndex] = useState(0);
    const [flipPhase, setFlipPhase] = useState<FlipPhase>('idle');
    // Read on the client only (empty during server render); it never changes, so there's nothing to subscribe to.
    const systemInfo = useSyncExternalStore(noopSubscribe, getSystemInfo, () => '');
    // Grid dimensions
    const [numRows, setNumRows] = useState(0);
    const [numCols, setNumCols] = useState(0);

    // loopWidth is an exact multiple of textWidth so wrapping the row position
    // at loopWidth lands on a visually identical spot — that's what makes the
    // scroll seamless.
    const [loopWidth, setLoopWidth] = useState(0);

    // Bumped while scaleY===0 so rows remount with the correct initial x for
    // the new loopWidth — happens invisibly, no stutter.
    const [layoutKey, setLayoutKey] = useState(0);

    const measureRef = useRef<HTMLSpanElement>(null);

    // Shared scroll position for every row, in [0, loopWidth). Even rows sit at
    // x = loopWidth/2 - progress and odd rows at x = progress - loopWidth/2, so each
    // row loops within ±loopWidth/2 of centre (which is what lets a row be only
    // 2·loopWidth wide); scrolling can push the speed up or reverse it.
    const progress = useRef(0);
    const scrollBoost = useRef(0);
    const evenX = useMotionValue(0);
    const oddX = useMotionValue(0);
    const blurFilter = useMotionValue('none');
    const lastBlur = useRef(0);
    // Full-screen blur is expensive on phone GPUs, and motion-sensitive visitors
    // don't need it: skip it for touch-first devices and reduced motion.
    const blurEnabled = useRef(true);
    useEffect(() => {
        blurEnabled.current = !window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches;
    }, []);

    useEffect(() => {
        if (!animate) return;
        let lastY = window.scrollY;
        const onScroll = () => {
            scrollBoost.current += (window.scrollY - lastY) * SCROLL_BOOST;
            lastY = window.scrollY;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [animate]);

    useAnimationFrame((_, deltaMs) => {
        if (!animate || loopWidth === 0) return;
        const dt = deltaMs / 1000;
        const speed = loopWidth / SCROLL_DURATION_S + scrollBoost.current;
        scrollBoost.current *= Math.exp(-SCROLL_BOOST_DECAY * dt);
        // Double modulo keeps it in range when the speed is negative.
        progress.current = ((progress.current + speed * dt) % loopWidth + loopWidth) % loopWidth;
        evenX.set(loopWidth / 2 - progress.current);
        oddX.set(progress.current - loopWidth / 2);
        if (!blurEnabled.current) return;
        // Quantised so the filter is only re-applied on a visible change, and
        // 'none' at rest (not blur(0px)) so the filter layer is dropped entirely.
        const raw = Math.min(SCROLL_BLUR_MAX_PX, Math.abs(scrollBoost.current) / SCROLL_BLUR_PER_PX);
        const blur = Math.round(raw / SCROLL_BLUR_STEP_PX) * SCROLL_BLUR_STEP_PX;
        if (blur === lastBlur.current) return;
        lastBlur.current = blur;
        blurFilter.set(blur === 0 ? 'none' : `blur(${blur}px)`);
    });

    const flipTexts = useMemo(
        () => systemInfo ? [...FLIP_TEXTS, systemInfo] : FLIP_TEXTS,
        [systemInfo]
    );

    /**
     * Measure the rendered width of `text`, then derive:
     *
     *   neededWidth  = W·cos(θ) + H·sin(θ)   — rotated viewport coverage
     *   neededHeight = H·cos(θ) + W·sin(θ)
     *
     *   singlePassCols = ceil(neededWidth / textWidth) + 2   (fills screen once, plus margin)
     *   numCols        = singlePassCols × 2                  (doubles for seamless loop)
     *   loopWidth      = singlePassCols × textWidth          (exact tile-width multiple)
     *   numRows        = ceil(neededHeight / rowHeight) + 2  (rowHeight measured, not assumed)
     *
     * A row is 2·loopWidth wide, centred. Rows move within x ∈ [-loopWidth/2, loopWidth/2],
     * so either edge stays ≥ loopWidth/2 ≥ neededWidth/2 + textWidth from centre: the
     * screen is always covered. Even rows move left, odd rows right.
     * Because loopWidth is an integer number of text widths, the loop reset is invisible.
     */
    const calcGrid = useCallback((text: string) => {
        if (!measureRef.current) return;

        measureRef.current.textContent = text;
        const {width: tw, height: rowHeight} = measureRef.current.getBoundingClientRect();
        if (tw === 0 || rowHeight === 0) return;

        const W = window.innerWidth;
        const H = window.innerHeight;
        const rad = (ROTATION_DEG * Math.PI) / 180;

        const neededWidth = W * Math.cos(rad) + H * Math.sin(rad);
        const neededHeight = H * Math.cos(rad) + W * Math.sin(rad);

        const singlePassCols = Math.ceil(neededWidth / tw) + 2;
        const cols = singlePassCols * 2;
        const rows = Math.ceil(neededHeight / rowHeight) + 2;
        const lw = singlePassCols * tw; // exact pixel multiple of tw

        setNumCols(cols);
        setNumRows(rows);
        setLoopWidth(lw);
    }, []);

    // Recalculate on mount and on resize (debounced)
    useEffect(() => {
        const currentText = flipTexts[textIndex % flipTexts.length];
        calcGrid(currentText);

        let timer: ReturnType<typeof setTimeout>;
        const onResize = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                calcGrid(currentText);
                setLayoutKey(k => k + 1);
            }, 150);
        };

        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
            clearTimeout(timer);
        };
    }, [calcGrid, flipTexts, textIndex]);

    const handleClick = () => {
        if (!clickToFlip || flipPhase !== 'idle') return;

        const nextIndex = (textIndex + 1) % flipTexts.length;
        const savedScroll = window.scrollY;

        setFlipPhase('compressing');

        setTimeout(() => {
            // scaleY is 0 here — resize, remount, and text swap are all invisible
            calcGrid(flipTexts[nextIndex]);
            setLayoutKey(k => k + 1);
            setTextIndex(nextIndex);
            setFlipPhase('expanding');
            // Restore scroll position after React flushes the DOM changes
            requestAnimationFrame(() => window.scrollTo({ top: savedScroll, behavior: 'instant' }));
            setTimeout(() => setFlipPhase('idle'), FLIP_STEP_MS);
        }, FLIP_STEP_MS);
    };

    const text = flipTexts[textIndex % flipTexts.length];

    return (
        <>
            {/* Hidden span — sole purpose is measuring rendered text width */}
            <span
                ref={measureRef}
                aria-hidden="true"
                className="text-5xl/none font-bold italic spacing-1 text-nowrap"
                style={{ position: 'fixed', visibility: 'hidden', pointerEvents: 'none', top: -9999, left: -9999 }}
            />

            {/* Static stand-in: single-pass coverage, no motion, no handlers, and one
                text node per row (no per-word hover needed). Cheap for the browser to
                rasterize into a snapshot. */}
            {!animate && numCols > 0 && (
                <div className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden cursor-default select-none [overflow-anchor:none] [contain:strict]">
                    <div className="rotate-12">
                        {Array.from({ length: numRows }, (_row, rowIndex) => (
                            <div key={rowIndex} className={`flex justify-center ${rowIndex % 2 === 0 ? 'ml-16' : 'ml-0'}`}>
                                <span className="text-5xl/none font-bold text-text italic spacing-1 text-nowrap">
                                    {text.repeat(numCols / 2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {animate && numCols > 0 && loopWidth > 0 && (
                <motion.div className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden cursor-default select-none [overflow-anchor:none] [contain:strict]" style={{ filter: blurFilter }}>
                    <div className="rotate-12">
                        {Array.from({ length: numRows }, (_, rowIndex) => {
                            const goesLeft = rowIndex % 2 === 0;
                            return (
                                <motion.div
                                    key={`${rowIndex}-${layoutKey}`}
                                    // Own GPU layer: moving the row then never repaints its text.
                                    className={`flex will-change-transform ${goesLeft ? 'ml-16 even-row' : 'ml-0 odd-row'}`}
                                    style={{ x: goesLeft ? evenX : oddX }}
                                >
                                    <motion.div
                                        className="flex"
                                        style={{ transformOrigin: '50% 50%' }}
                                        initial={{ scaleY: flipPhase === 'expanding' ? 0 : 1 }}
                                        animate={{ scaleY: flipPhase === 'compressing' ? 0 : 1 }}
                                        transition={{
                                            duration: FLIP_STEP_MS / 1000,
                                            ease: flipPhase === 'compressing' ? 'easeIn' : 'easeOut',
                                        }}
                                    >
                                        {Array.from({ length: numCols }, (_col, colIndex) => (
                                            // Decorative easter egg inside an aria-hidden background.
                                            <span
                                                key={colIndex}
                                                role="presentation"
                                                onClick={handleClick}
                                                className={`text-5xl/none font-bold text-text italic spacing-1 hover:text-primary transition-colors text-nowrap ${clickToFlip ? 'cursor-pointer' : ''}`}
                                            >
                                                {text}
                                            </span>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default FullScreen4545Grid;
