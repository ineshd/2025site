"use client"

import {RefObject, useEffect, useRef} from 'react';
import {motion} from 'framer-motion';
import Link from 'next/link';

interface AnimatedTextProps {
    text: string;
}

const AnimatedText = ({text}: AnimatedTextProps) => {
    const textRef: RefObject<HTMLSpanElement | null> = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        if (!textRef.current) return;

        const letters = textRef.current.querySelectorAll('.letter');
        letters.forEach((letter: Element) => {
            letter.addEventListener('mouseenter', () => {
                letter.classList.add('hovered');
            });
            letter.addEventListener('mouseleave', () => {
                letter.classList.remove('hovered');
            });
        });

        return () => {
            letters.forEach((letter: Element) => {
                letter.removeEventListener('mouseenter', () => {});
                letter.removeEventListener('mouseleave', () => {});
            });
        };
    }, []);

    return (
        <span ref={textRef}>
            {text.split('').map((char: string, index: number) => (
                <motion.span
                    key={index}
                    className="letter inline-block"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
};

interface HeaderProps {
    position?: 'absolute' | 'sticky';
}

const Header = ({position = 'sticky'}: HeaderProps) => {
    return (
        <header
            className={`z-50 overflow-hidden w-screen max-w-screen px-8 h-32 max-lg:h-24 bg-muted flex-row flex items-center ${position === 'absolute' ? 'absolute' : 'sticky top-0'}`}>
            <Link href="/">
                <p className={"text-primary text-3xl max-lg:text-2xl font-black my-auto italic flex-1"}>
                    <AnimatedText text="4545"/>
                </p>
            </Link>
            <div className={"flex ml-auto mr-16"}>
                <ul>
                    <li>
                        <Link href={"/find-new-fixtures"}>Finding New Fixtures</Link>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Header;