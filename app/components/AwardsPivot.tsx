"use client";

import { PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import type { AwardGroup } from "@/app/components/AwardsWheel";

const DRAG_THRESHOLD_PX = 4;      // mouse movement before a press counts as a drag
const INERTIA_MS = 325;           // how far a fling carries: release speed x this
const VELOCITY_WINDOW_MS = 100;   // release speed is measured over the last this-much of the drag
const GLIDE_MS = 110;             // time constant of a glide to a card (taps, slow releases)
const MAX_COAST_MS = 600;         // slowest a fling's glide may settle

// Phone version of the awards menu, after the Zune "pivot": the group names sit in
// a row and slide along with the cards below, which are swiped sideways with the
// browser's own scroll-snap (smooth, and vertical swipes still scroll the page).
// The cards share a row, so they're all as tall as the tallest: nothing below moves.
export default function AwardsPivot({ groups, className = "" }: { groups: AwardGroup[]; className?: string }) {
    const scroller = useRef<HTMLDivElement>(null);
    const strip = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState(0);

    // Position the name row from the cards' scroll position: between two cards it
    // sits proportionally between their two names, so the names track your finger.
    const sync = useCallback(() => {
        const sc = scroller.current;
        const st = strip.current;
        if (!sc || !st) return;
        const cards = sc.children as HTMLCollectionOf<HTMLElement>;
        const names = st.children as HTMLCollectionOf<HTMLElement>;
        const stepPx = cards[1].offsetLeft - cards[0].offsetLeft;
        if (stepPx <= 0) return; // hidden (desktop): nothing is laid out
        const p = Math.max(0, Math.min(groups.length - 1, sc.scrollLeft / stepPx));
        const i = Math.floor(p);
        const from = names[i].offsetLeft;
        const to = names[Math.min(i + 1, groups.length - 1)].offsetLeft;
        st.style.transform = `translateX(${-(from + (to - from) * (p - i))}px)`;
        setSelected(Math.round(p));
    }, [groups.length]);

    useEffect(() => {
        sync();
        window.addEventListener("resize", sync);
        return () => window.removeEventListener("resize", sync);
    }, [sync]);

    // Glide to a card. The browser's smooth scroll always starts from rest, which
    // made a fling stall and then speed up again; this glide instead leaves at the
    // given speed (px/ms) and eases into the card, like the desktop wheel. Snapping
    // is off while it runs, since it would fight the animation.
    const frame = useRef<number | null>(null);
    const stopGlide = () => {
        if (frame.current !== null) cancelAnimationFrame(frame.current);
        frame.current = null;
    };
    useEffect(() => () => {
        if (frame.current !== null) cancelAnimationFrame(frame.current);
    }, []);
    const goTo = (i: number, v = 0) => {
        const sc = scroller.current;
        if (!sc) return;
        stopGlide();
        const cards = sc.children as HTMLCollectionOf<HTMLElement>;
        const target = Math.min(cards[i].offsetLeft - cards[0].offsetLeft, sc.scrollWidth - sc.clientWidth);
        const dist = target - sc.scrollLeft;
        // A glide's starting speed is distance / time constant, so pick the time
        // constant that makes it leave at the release speed.
        const tc = v !== 0 && Math.sign(dist) === Math.sign(v) ? Math.min(MAX_COAST_MS, Math.max(GLIDE_MS, dist / v)) : GLIDE_MS;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            sc.scrollLeft = target;
            return;
        }
        sc.style.scrollSnapType = "none";
        let pos = sc.scrollLeft;
        let last: number | null = null;
        const tick = (now: number) => {
            // The first frame moves by one typical frame (16ms), so it doesn't pause.
            pos += (target - pos) * (1 - Math.exp(-(last === null ? 16 : now - last) / tc));
            last = now;
            if (Math.abs(target - pos) < 0.5) {
                sc.scrollLeft = target;
                sc.style.scrollSnapType = "";
                frame.current = null;
                return;
            }
            sc.scrollLeft = pos;
            frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
    };

    // Touch swipes are the browser's own scrolling; a mouse (or pen) drags the cards
    // here instead. Snapping is paused while dragging, then the release flings to a
    // card: further the faster it was let go.
    const drag = useRef<{ x: number; left: number; moved: boolean; samples: { t: number; left: number }[] } | null>(null);
    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === "touch" || e.button !== 0) return;
        e.preventDefault(); // no text selection while dragging
        stopGlide();
        drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft, moved: false, samples: [] };
    };
    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const d = drag.current;
        if (!d) return;
        const sc = e.currentTarget;
        const dx = e.clientX - d.x;
        if (!d.moved) {
            if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
            d.moved = true;
            sc.setPointerCapture(e.pointerId);
            sc.style.scrollSnapType = "none";
        }
        sc.scrollLeft = d.left - dx;
        const now = e.timeStamp; // same clock as performance.now()
        d.samples.push({ t: now, left: sc.scrollLeft });
        while (d.samples.length > 2 && now - d.samples[0].t > VELOCITY_WINDOW_MS) d.samples.shift();
    };
    const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
        const d = drag.current;
        drag.current = null;
        if (!d?.moved) return;
        const sc = e.currentTarget;
        const now = e.timeStamp;
        const first = d.samples[0];
        const last = d.samples[d.samples.length - 1];
        const v = last && now - last.t < 50 && last.t > first.t ? (last.left - first.left) / (last.t - first.t) : 0;
        const cards = sc.children as HTMLCollectionOf<HTMLElement>;
        const step = cards[1].offsetLeft - cards[0].offsetLeft;
        if (step <= 0) return;
        const i = Math.max(0, Math.min(groups.length - 1, Math.round((sc.scrollLeft + v * INERTIA_MS) / step)));
        goTo(i, v);
    };

    return (
        <div className={className}>
            <div className="overflow-hidden">
                <div ref={strip} className="relative flex gap-6 whitespace-nowrap will-change-transform">
                    {groups.map((g, i) => (
                        <button key={g.name} type="button" onClick={() => goTo(i)}
                            aria-current={i === selected || undefined}
                            className={`text-2xl font-black transition-colors duration-150 ${i === selected ? "text-primary" : "text-foreground/25"}`}>
                            {g.name}
                        </button>
                    ))}
                </div>
            </div>
            <div ref={scroller} onScroll={sync}
                onPointerDown={onPointerDown} onPointerMove={onPointerMove}
                onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
                className="relative mt-3 flex gap-6 cursor-grab active:cursor-grabbing overflow-x-auto snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {groups.map((g, i) => (
                    <article key={g.name} aria-hidden={i !== selected || undefined}
                        className="w-[88%] shrink-0 snap-start snap-always">
                        {/* The name is already above; this adds the spelled-out name and details. */}
                        <p className="text-sm text-foreground/40 tracking-wide mb-1">
                            {g.fullName ? `${g.fullName} · ${g.meta}` : g.meta}
                        </p>
                        <ul className="divide-y divide-border/20">
                            {g.items.map((item, j) => (
                                <li key={j} className="py-2.5">
                                    <p className="font-bold leading-snug">{item.title}</p>
                                    {item.detail && <p className="text-sm text-foreground/50 leading-relaxed mt-0.5">{item.detail}</p>}
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
                {/* Room for the last card to snap to the left edge like the others. */}
                <div aria-hidden="true" className="w-[calc(12%-1.5rem)] shrink-0" />
            </div>
        </div>
    );
}
