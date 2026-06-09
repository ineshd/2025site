"use client"
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface FullScreen4545GridProps {
    clickToFlip?: boolean;
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
const ROW_HEIGHT_PX = 48; // text-5xl with line-height: none
const FLIP_STEP_MS = 150;
const SCROLL_DURATION_S = 360;

const FullScreen4545Grid: React.FC<FullScreen4545GridProps> = ({ clickToFlip = false }) => {
    const [textIndex, setTextIndex] = useState(0);
    const [flipPhase, setFlipPhase] = useState<FlipPhase>('idle');
    const [systemInfo, setSystemInfo] = useState('');

    // Grid dimensions
    const [numRows, setNumRows] = useState(0);
    const [numCols, setNumCols] = useState(0);

    // loopWidth is an exact multiple of textWidth so repeatType:"loop" resets
    // to a visually identical position — that's what makes the scroll seamless.
    const [loopWidth, setLoopWidth] = useState(0);

    // Bumped while scaleY===0 so rows remount with the correct initial x for
    // the new loopWidth — happens invisibly, no stutter.
    const [layoutKey, setLayoutKey] = useState(0);

    const measureRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        setSystemInfo(getSystemInfo());
    }, []);

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
     *   singlePassCols = ceil(neededWidth / textWidth) + 2   (fills screen once)
     *   numCols        = singlePassCols × 2                  (doubles for seamless loop)
     *   loopWidth      = singlePassCols × textWidth          (exact tile-width multiple)
     *
     * With numCols doubled, content spans [0, 2·loopWidth].
     * Even rows animate x: 0 → -loopWidth  (content window shifts right over content)
     * Odd  rows animate x: -loopWidth → 0  (opposite direction, staggered start)
     * Because loopWidth is an integer number of text widths, the loop reset is invisible.
     */
    const calcGrid = useCallback((text: string) => {
        if (!measureRef.current) return;

        measureRef.current.textContent = text;
        const tw = measureRef.current.getBoundingClientRect().width;
        if (tw === 0) return;

        const W = window.innerWidth;
        const H = window.innerHeight;
        const rad = (ROTATION_DEG * Math.PI) / 180;

        const neededWidth  = W * Math.cos(rad) + H * Math.sin(rad);
        const neededHeight = H * Math.cos(rad) + W * Math.sin(rad);

        const singlePassCols = Math.ceil(neededWidth / tw) + 2;
        // ×3 because the div is centered: at x=-loopWidth the right edge lands
        // at numCols·tw/2 - loopWidth, which must be ≥ visibleWidth/2 ≈ loopWidth/2.
        // Solving: numCols ≥ 3 × singlePassCols.
        const cols = singlePassCols * 3;
        const rows = Math.ceil(neededHeight / ROW_HEIGHT_PX) + 2;
        const lw   = singlePassCols * tw; // exact pixel multiple of tw

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
            timer = setTimeout(() => calcGrid(currentText), 150);
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

            {numCols > 0 && loopWidth > 0 && (
                <div className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden cursor-default select-none [overflow-anchor:none]">
                    <div className="rotate-12">
                        {Array.from({ length: numRows }, (_, rowIndex) => {
                            const goesLeft = rowIndex % 2 === 0;
                            return (
                                <motion.div
                                    key={`${rowIndex}-${layoutKey}`}
                                    className={`flex ${goesLeft ? 'ml-16 even-row' : 'ml-0 odd-row'}`}
                                    initial={{ x: goesLeft ? 0 : -loopWidth }}
                                    animate={{ x: goesLeft ? -loopWidth : 0 }}
                                    transition={{
                                        duration: SCROLL_DURATION_S,
                                        ease: "linear",
                                        repeat: Infinity,
                                        repeatType: "loop",
                                    }}
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
                                        {Array.from({ length: numCols }, (_, colIndex) => (
                                            <span
                                                key={colIndex}
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
                </div>
            )}
        </>
    );
};

export default FullScreen4545Grid;
