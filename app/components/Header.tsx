"use client"

import {RefObject, useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Menu, X} from 'lucide-react';
import TransitionLink from '@/app/components/TransitionLink';

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

const navLinks = [
    {href: '/projects', label: 'Projects'},
    {href: '/experience', label: 'Experience'},
    {href: '/experiments', label: 'Experiments'},
];

const Header = ({position = 'sticky'}: HeaderProps) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header
            className={`[view-transition-name:navbar] shadow-2xl z-50 w-screen max-w-screen bg-muted flex flex-col ${position === 'absolute' ? 'absolute' : 'sticky top-0'}`}>
            <div className="px-8 h-32 max-lg:h-24 flex-row flex items-center">
                <TransitionLink href="/" className="group">
                    <div className={"flex flex-col my-auto flex-1"}>
                        <p className={"flex items-center text-3xl max-lg:text-2xl font-black italic"}>
                            <span className="logo-texture pr-[0.1em]">
                                ineshd.com
                            </span>
                            <span aria-hidden="true"
                                  className="material-symbols-rounded text-[1em]! logo-texture opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
                                arrow_forward
                            </span>
                        </p>
                        <span className={"text-xs text-muted-foreground -mt-2"}>v1.2</span>
                    </div>
                </TransitionLink>
                <nav className="max-lg:hidden flex ml-auto mr-16 gap-3 items-center text-base font-medium">
                  {navLinks.map((link) => (
                    <TransitionLink
                      key={link.href}
                      href={link.href}
                      className="group relative px-5 py-2 text-background active:brightness-90 transition-[filter] duration-200"
                    >
                      {/* Slanted green tab at rest; blue sweeps across it on hover. */}
                      <span className="absolute inset-0 -skew-x-12 bg-primary" />
                      <span className="absolute inset-y-0 left-0 w-0 -skew-x-12 bg-secondary group-hover:w-full transition-all duration-300 ease-out" />
                      <span className="relative">
                        {link.label}
                      </span>
                    </TransitionLink>
                  ))}
                </nav>
                            <button onClick={() => setMenuOpen((open) => !open)}
                                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                                    aria-expanded={menuOpen}
                                    className="group relative hidden max-lg:flex ml-auto p-2">
                                <span className="absolute inset-y-0 left-0 w-full bg-background group-hover:w-full rounded-full group-hover:bg-primary group-active:bg-secondary transition-all duration-300 ease-out"/>
                                <span className="relative group-hover:text-background transition-colors duration-300">
                                    {menuOpen ? <X size={24}/> : <Menu size={24}/>}
                                </span>
                            </button>
                        </div>
                        <AnimatePresence initial={false}>
                            {menuOpen && (
                                <motion.nav
                                    initial={{height: 0, opacity: 0}}
                                    animate={{height: 'auto', opacity: 1}}
                                    exit={{height: 0, opacity: 0}}
                                    transition={{duration: 0.25, ease: 'easeInOut'}}
                                    className="hidden max-lg:flex flex-col overflow-hidden">
                                    {navLinks.map((link) => (
                                        <TransitionLink key={link.href} href={link.href}
                                                        onClick={() => setMenuOpen(false)}
                                                        className="group relative px-8 py-4 text-lg font-medium">
                                            <span className="absolute inset-y-0 -left-4 w-px -skew-x-12 bg-border/30 group-hover:w-[calc(100%+2rem)] group-hover:bg-primary group-active:bg-secondary transition-all duration-300 ease-out"/>
                                            <span className="relative group-hover:text-background transition-colors duration-300">
                                                {link.label}
                                            </span>
                                        </TransitionLink>
                                    ))}
                                </motion.nav>
                            )}
                        </AnimatePresence>
                    </header>
                );
            };

            export default Header;
