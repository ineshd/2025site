"use client"
import React, { useEffect, useState } from 'react';
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
    `${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · `,
];

type FlipPhase = 'idle' | 'compressing' | 'expanding';

const FullScreen4545Grid: React.FC<FullScreen4545GridProps> = ({ clickToFlip = false }) => {
    const numRows = 50;
    const numCols = 50;

    const [textIndex, setTextIndex] = useState(0);
    const [flipPhase, setFlipPhase] = useState<FlipPhase>('idle');
    const [systemInfo, setSystemInfo] = useState('');

    useEffect(() => {
        setSystemInfo(getSystemInfo());
    }, []);

    const flipTexts = systemInfo ? [...FLIP_TEXTS, systemInfo] : FLIP_TEXTS;

    const FLIP_STEP_MS = 150;

    const handleClick = () => {
        if (!clickToFlip || flipPhase !== 'idle') return;
        setFlipPhase('compressing');
        setTimeout(() => {
            setTextIndex((prev) => (prev + 1) % flipTexts.length);
            setFlipPhase('expanding');
            setTimeout(() => setFlipPhase('idle'), FLIP_STEP_MS);
        }, FLIP_STEP_MS);
    };

    const text = flipTexts[textIndex % flipTexts.length];

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden cursor-default select-none">
            <div className="rotate-12">
                {Array.from({ length: numRows }, (_, rowIndex) => (
                    <motion.div
                        key={rowIndex}
                        className={`flex ${rowIndex % 2 === 0 ? 'ml-16 even-row' : 'ml-0 odd-row'}`}
                        animate={{ x: rowIndex % 2 === 0 ? 1000 : -1000 }}
                        transition={{ duration: 90, ease: "linear", repeat: Infinity }}
                    >
                        <motion.div
                            className="flex"
                            style={{ transformOrigin: '50% 50%' }}
                            animate={{ scaleY: flipPhase === 'compressing' ? 0 : 1 }}
                            transition={{ duration: FLIP_STEP_MS / 1000, ease: flipPhase === 'compressing' ? 'easeIn' : 'easeOut' }}
                        >
                            {Array.from({ length: numCols }, (_, colIndex) => (
                                <span key={colIndex}
                                    onClick={handleClick}
                                    className={`text-5xl/none font-bold text-text italic spacing-1 hover:text-primary transition-colors text-nowrap ${clickToFlip ? 'cursor-pointer' : ''}`}>
                                    {text}
                                </span>
                            ))}
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FullScreen4545Grid;
