"use client";

import Image, {StaticImageData} from "next/image";
import {useEffect, useState} from "react";
import pfp1 from "@/app/projects/pfp1.png";
import pfp2 from "@/app/projects/pfp2.png";
import pfp4 from "@/app/projects/pfp4.png";
import pfp5 from "@/app/projects/pfp5.png";
import pfp6 from "@/app/projects/pfp6.png";
import pfp7 from "@/app/projects/pfp7.png";

// Packaging-style color bar: profile pictures next to the site's palette,
// butted edge to edge like the print-check squares on a box.
const PFPS: StaticImageData[] = [pfp1, pfp2, pfp4, pfp5, pfp6, pfp7];
const COLORS = ["bg-foreground", "bg-primary", "bg-accent", "bg-secondary", "bg-border", "bg-background"];
// 6×2 grid: a 3×2 block of pfps on the left, a 3×2 block of colors on the right.
const SWATCHES = [
    ...PFPS.slice(0, 3), ...COLORS.slice(0, 3),
    ...PFPS.slice(3), ...COLORS.slice(3),
];

// UPC-A for "0 45454 54545 5": the two main groups read 4545454545; the
// leading 0 is the number-system digit and the trailing 5 is the check digit
// (computed, so it stays valid if the digits change).
const UPC_DIGITS = (() => {
    const data = "04545454545".split("").map(Number);
    const sum = data.reduce((acc, d, i) => acc + d * (i % 2 === 0 ? 3 : 1), 0);
    return [...data, (10 - (sum % 10)) % 10];
})();
// Left-hand (odd parity) patterns; right-hand patterns are their complements.
const UPC_L = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
const UPC_R = UPC_L.map((code) => code.replace(/./g, (bit) => (bit === "0" ? "1" : "0")));

const QUIET = 9; // quiet zone on each side, in modules; also holds the outer digits
const BAR_H = 56;
const GUARD_H = 62;

// Barcode modules (1 = bar) with whether each belongs to a guard pattern,
// which UPC draws taller than the data bars.
const upcModules = () => {
    const parts: [string, boolean][] = [
        ["101", true],
        ...UPC_DIGITS.slice(0, 6).map((d, i): [string, boolean] => [UPC_L[d], i === 0]),
        ["01010", true],
        ...UPC_DIGITS.slice(6).map((d, i): [string, boolean] => [UPC_R[d], i === 5]),
        ["101", true],
    ];
    return parts.flatMap(([bits, guard]) => bits.split("").map((bit) => ({bar: bit === "1", guard})));
};

const Barcode = ({className}: { className?: string }) => {
    const modules = upcModules();
    const width = QUIET * 2 + modules.length;
    // Digit centers: the outer two sit in the quiet zones, the middle ten under
    // their 7-module data patterns (3-module start guard, 5-module middle guard).
    const digitX = (i: number) =>
        i === 0 ? QUIET / 2
            : i === 11 ? QUIET + modules.length + QUIET / 2
                : QUIET + 3 + 7 * i + (i >= 6 ? 5 : 0) + 3.5;
    return (
        <svg viewBox={`0 0 ${width} 72`} className={className} role="img" aria-label="Barcode reading 4545454545">
            <rect width={width} height={72} className="fill-foreground"/>
            {modules.map((m, i) => m.bar && (
                <rect key={i} x={QUIET + i} y={4} width={1} height={m.guard ? GUARD_H : BAR_H} className="fill-background"/>
            ))}
            {UPC_DIGITS.map((d, i) => (
                <text key={i} x={digitX(i)} y={i === 0 || i === 11 ? 66 : 68.5} textAnchor="middle"
                      fontSize={i === 0 || i === 11 ? 6 : 8}
                      className="fill-background font-[family-name:var(--font-roboto-mono)]">
                    {d}
                </text>
            ))}
        </svg>
    );
};

const LINKS = [
    {label: "github", href: "https://github.com/ineshd"},
    {label: "linkedin", href: "https://linkedin.com/in/ineshdey"},
    {label: "substack", href: "https://somebody4545.substack.com"},
    {label: "email", href: "mailto:me@ineshd.com"},
];

const formatMyTime = () =>
    new Date().toLocaleTimeString("en-US", {timeZone: "America/Detroit", hour: "numeric", minute: "2-digit"}).toLowerCase();

// Checks every 15s so the minute flips close to on time. Starts null so the
// server render (in its own timezone, at build time) doesn't mismatch the client.
const useMyTime = () => {
    const [time, setTime] = useState<string | null>(null);
    useEffect(() => {
        setTime(formatMyTime());
        const id = setInterval(() => setTime(formatMyTime()), 15_000);
        return () => clearInterval(id);
    }, []);
    return time;
};

type TopTrack = { title: string; artist: string };

// Top Last.fm track of the week, via our own API route so the account stays
// private. null until loaded or when unavailable, in which case the line hides.
const useTopTrack = () => {
    const [track, setTrack] = useState<TopTrack | null>(null);
    useEffect(() => {
        fetch("/api/top-track")
            .then((res) => res.json())
            .then((data: { track: TopTrack | null }) => setTrack(data.track))
            .catch(() => {});
    }, []);
    return track;
};

const Footer = () => {
    const myTime = useMyTime();
    const topTrack = useTopTrack();

    return (
        // Sticks to the bottom of the viewport underneath <main> (z-10 in Layout),
        // so it's uncovered as the content scrolls past the end of the page. The
        // inset shadow reads as the content's edge casting onto it.
        <footer className="sticky bottom-0 z-0 overflow-hidden bg-muted text-primary p-4 flex flex-col-reverse lg:flex-row lg:justify-between gap-6
                           shadow-[inset_0_10px_12px_-10px_rgb(0_0_0/0.6)]">
            {/* Barcode in the corner like on real packaging: leftmost on wider
                screens, below the squares (flex-col-reverse) on phones. */}
            <div className="flex flex-col-reverse sm:flex-row items-center gap-4 self-center lg:self-auto">
                <Barcode className="h-24 sm:h-32 w-auto shrink-0"/>
                <div aria-hidden="true" className="grid grid-cols-6 w-fit shrink-0">
                    {SWATCHES.map((swatch, i) =>
                        typeof swatch === "string"
                            ? <div key={i} className={`size-12 sm:size-16 ${swatch}`}/>
                            : <Image key={i} src={swatch} alt="" sizes="64px" loading="eager" className="size-12 sm:size-16 object-cover"/>
                    )}
                </div>
            </div>
            {/* Side-by-side layout: a green panel with a slanted left edge, bleeding to the
                footer's top, bottom and right edges (overshoot clipped by the footer). */}
            <div className="relative flex flex-col justify-between gap-6 lg:items-end lg:-my-4 lg:-mr-4 lg:py-4 lg:pr-4 lg:pl-14 lg:text-background font-[family-name:var(--font-roboto-mono)]">
                <span aria-hidden="true" className="hidden lg:block absolute inset-y-0 left-0 -right-16 -skew-x-12 bg-primary shadow-[inset_0_10px_12px_-10px_rgb(0_0_0/0.6)]"/>
                <div className="relative flex flex-col gap-2 lg:items-end">
                    <p>my time is {myTime ?? "--:--"}</p>
                    {topTrack && <p className="text-foreground/50 lg:text-background/70 lowercase">my top track this week: {topTrack.title} by {topTrack.artist}</p>}
                    <nav className="flex flex-wrap gap-x-4 gap-y-1 text-foreground/50 lg:text-background/70">
                        {LINKS.map((link) => (
                            <a key={link.label} href={link.href}
                               target={link.href.startsWith("http") ? "_blank" : undefined}
                               rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                               className="-mx-1 px-1 hover:bg-primary hover:text-background active:bg-secondary lg:hover:bg-secondary lg:active:brightness-90 transition-colors duration-200">
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>
                <p className="relative">&copy; {new Date().getFullYear()} Inesh Dey</p>
            </div>
        </footer>
    );

};

export default Footer;
