"use client";

import { KeyboardEvent, PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import AwardsPivot from "@/app/components/AwardsPivot";

export type AwardGroup = {
    // Short name for the wheel; long names would wrap into each other there.
    name: string;
    // Full name (abbreviations spelled out) for the details panel.
    fullName?: string;
    meta: string;
    items: { title: string; detail?: string }[];
};

// Zune-style vertical menu: the selected group name stays centred and the others
// sit above and below it, shrinking and fading with distance. It wraps like a
// circle. The selected group's awards show beside the menu.
//
// Movement is driven by one continuous position (in names) that glides toward a
// target each animation frame; every name is placed from it, with no per-name CSS
// transitions. A name only wraps from one end to the other once it has fully
// faded out past the edge, so nothing ever visibly jumps across the list, and
// rapid clicks just move the target.
const SPACING_REM = 7;            // vertical distance between neighbouring names (fits two-line names)
const VISIBLE_SIDE = 2;           // names shown above and below the selection
const FADE_END = VISIBLE_SIDE + 0.6; // fully transparent by here, before a name wraps at n/2
const GLIDE_MS = 110;             // time constant of the glide toward the target
const HOLD_DELAY_MS = 350;        // hold a button this long before it starts repeating
const HOLD_REPEAT_MS = 140;       // then step this often while held
const DRAG_THRESHOLD_PX = 4;      // mouse movement before a press counts as a drag
const INERTIA_MS = 325;           // how far a fling coasts: release speed x this
const VELOCITY_WINDOW_MS = 100;   // release speed is measured over the last this-much of the drag
const MAX_COAST_MS = 600;         // slowest a fling's glide may settle

// Wrap x into [-n/2, n/2): distance around the circle.
const wrap = (x: number, n: number) => {
    const r = ((x % n) + n) % n;
    return r >= n / 2 ? r - n : r;
};
const mod = (x: number, n: number) => ((Math.round(x) % n) + n) % n;

const nameOpacity = (dist: number) => {
    const a = Math.abs(dist);
    if (a <= 1) return 1 - 0.65 * a;
    if (a <= VISIBLE_SIDE) return 0.35 - 0.12 * (a - 1);
    if (a < FADE_END) return 0.23 * (1 - (a - VISIBLE_SIDE) / (FADE_END - VISIBLE_SIDE));
    return 0;
};

export default function AwardsWheel({ groups }: { groups: AwardGroup[] }) {
    const n = groups.length;
    const [pos, setPos] = useState(0);        // rendered position, in names (unbounded)
    const posRef = useRef(0);
    const target = useRef(0);                 // where the wheel is gliding to
    const frame = useRef<number | null>(null);
    const glideMs = useRef(GLIDE_MS);         // time constant of the current glide
    const reducedMotion = useRef(false);

    useEffect(() => {
        reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        return () => {
            if (frame.current !== null) cancelAnimationFrame(frame.current);
        };
    }, []);

    const setPosition = useCallback((p: number) => {
        posRef.current = p;
        setPos(p);
    }, []);

    const glide = useCallback(() => {
        if (frame.current !== null) return;
        let last = performance.now();
        const tick = (now: number) => {
            const diff = target.current - posRef.current;
            if (Math.abs(diff) < 0.001) {
                setPosition(target.current);
                frame.current = null;
                return;
            }
            setPosition(posRef.current + diff * (1 - Math.exp(-(now - last) / glideMs.current)));
            last = now;
            frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
    }, [setPosition]);

    const moveTo = useCallback((t: number, timeConstant = GLIDE_MS) => {
        target.current = t;
        glideMs.current = timeConstant;
        if (reducedMotion.current) {
            if (frame.current !== null) cancelAnimationFrame(frame.current);
            frame.current = null;
            setPosition(t);
        } else {
            glide();
        }
    }, [glide, setPosition]);

    const step = useCallback((delta: number) => moveTo(Math.round(target.current) + delta), [moveTo]);

    // Click and hold an arrow button to keep spinning.
    const holdTimer = useRef<number | null>(null);
    const stopHold = useCallback(() => {
        if (holdTimer.current !== null) clearTimeout(holdTimer.current);
        holdTimer.current = null;
    }, []);
    useEffect(() => stopHold, [stopHold]);
    const startHold = (delta: number) => (e: PointerEvent) => {
        if (e.button !== 0) return;
        e.preventDefault();
        stopHold();
        step(delta);
        const repeat = () => {
            step(delta);
            holdTimer.current = window.setTimeout(repeat, HOLD_REPEAT_MS);
        };
        holdTimer.current = window.setTimeout(repeat, HOLD_DELAY_MS);
    };

    // Drag the list with a mouse/pen to spin it (not touch, so swiping still
    // scrolls the page); on release it snaps to a name.
    // Releasing mid-drag flings it: it coasts on in that direction and settles on a name.
    const drag = useRef<{ y: number; pos: number; moved: boolean; samples: { t: number; p: number }[] } | null>(null);
    const suppressClick = useRef(false);
    const slotPx = () => SPACING_REM * parseFloat(getComputedStyle(document.documentElement).fontSize);
    const onListPointerDown = (e: PointerEvent<HTMLUListElement>) => {
        suppressClick.current = false;
        if (e.pointerType === "touch" || e.button !== 0) return;
        drag.current = { y: e.clientY, pos: posRef.current, moved: false, samples: [] };
    };
    const onListPointerMove = (e: PointerEvent<HTMLUListElement>) => {
        const d = drag.current;
        if (!d) return;
        const dy = e.clientY - d.y;
        if (!d.moved) {
            if (Math.abs(dy) < DRAG_THRESHOLD_PX) return;
            d.moved = true;
            // Only capture once it's a drag, so plain clicks still reach the names.
            e.currentTarget.setPointerCapture(e.pointerId);
            if (frame.current !== null) cancelAnimationFrame(frame.current);
            frame.current = null;
        }
        const p = d.pos - dy / slotPx();
        const now = performance.now();
        d.samples.push({ t: now, p });
        while (d.samples.length > 2 && now - d.samples[0].t > VELOCITY_WINDOW_MS) d.samples.shift();
        target.current = p;
        setPosition(p);
    };
    const onListPointerUp = () => {
        const d = drag.current;
        drag.current = null;
        if (d?.moved) {
            suppressClick.current = true;
            // Release speed in names/ms, or 0 if the pointer had stopped before letting go.
            const now = performance.now();
            const first = d.samples[0];
            const last = d.samples[d.samples.length - 1];
            const v = last && now - last.t < 50 && last.t > first.t ? (last.p - first.p) / (last.t - first.t) : 0;
            const from = posRef.current;
            const to = Math.round(from + v * INERTIA_MS);
            // Pick the glide's time constant so it leaves at the release speed (the
            // glide's starting speed is distance / time constant): no jolt on letting go.
            const tc = v !== 0 && Math.sign(to - from) === Math.sign(v) ? (to - from) / v : GLIDE_MS;
            moveTo(to, Math.min(MAX_COAST_MS, Math.max(GLIDE_MS, tc)));
        }
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowDown") step(1);
        else if (e.key === "ArrowUp") step(-1);
        else return;
        e.preventDefault();
    };

    // The selection follows the wheel's live position, so dragging or flinging
    // shows each name's awards as it passes the centre, not just where it stops.
    const selected = mod(pos, n);
    const arrowClass = "size-10 grid place-items-center bg-primary text-background hover:bg-secondary active:brightness-90 transition-colors duration-200 select-none touch-manipulation";

    return (
        <section aria-roledescription="carousel" aria-label="Awards">
            {/* Phones get a sideways-swiping pivot instead of the vertical wheel. */}
            <AwardsPivot groups={groups} className="lg:hidden" />
            <div className="max-lg:hidden grid grid-cols-2 gap-x-12 items-center">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-3">
                        <button type="button" aria-label="Previous award group" className={arrowClass}
                            onPointerDown={startHold(-1)} onPointerUp={stopHold} onPointerLeave={stopHold}
                            onPointerCancel={stopHold} onContextMenu={(e) => e.preventDefault()} onKeyDown={onKeyDown}
                            onClick={(e) => e.detail === 0 && step(-1) /* keyboard activation */}>
                            <span aria-hidden="true" className="material-symbols-rounded">arrow_upward</span>
                        </button>
                        <button type="button" aria-label="Next award group" className={arrowClass}
                            onPointerDown={startHold(1)} onPointerUp={stopHold} onPointerLeave={stopHold}
                            onPointerCancel={stopHold} onContextMenu={(e) => e.preventDefault()} onKeyDown={onKeyDown}
                            onClick={(e) => e.detail === 0 && step(1) /* keyboard activation */}>
                            <span aria-hidden="true" className="material-symbols-rounded">arrow_downward</span>
                        </button>
                    </div>
                    <ul onPointerDown={onListPointerDown} onPointerMove={onListPointerMove}
                        onPointerUp={onListPointerUp} onPointerCancel={onListPointerUp}
                        className="relative flex-1 h-[34rem] overflow-hidden select-none cursor-grab active:cursor-grabbing">
                        {groups.map((g, i) => {
                            const dist = wrap(i - pos, n);
                            const opacity = nameOpacity(dist);
                            const isSelected = i === selected;
                            return (
                                <li key={g.name} className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                                    <button type="button" tabIndex={-1} aria-current={isSelected || undefined}
                                        onClick={() => {
                                            if (suppressClick.current) return;
                                            const t = Math.round(target.current);
                                            moveTo(t + wrap(i - t, n));
                                        }}
                                        style={{
                                            transform: `translateY(calc(${dist.toFixed(4)} * ${SPACING_REM}rem)) scale(${Math.max(0.5, 1 - 0.15 * Math.abs(dist)).toFixed(4)})`,
                                            opacity,
                                        }}
                                        className={`block w-full text-left text-3xl max-sm:text-2xl font-black leading-tight origin-left
                                                        transition-colors duration-100
                                                        ${opacity === 0 ? "pointer-events-none" : ""}
                                                        ${isSelected ? "text-primary" : "text-foreground"}`}>
                                        {g.name}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Every group's details sit stacked in one grid cell, with only the selected one
                    visible, so the panel is always as tall as the longest group and spinning never
                    changes the section's height. The selected one fades in each time it gets the
                    animation classes. */}
                <div aria-live="polite" className="grid">
                    {groups.map((g, i) => (
                        <div key={g.name}
                            className={`[grid-area:1/1] ${i === selected ? "animate-in fade-in slide-in-from-bottom-2 duration-200" : "invisible"}`}>
                            <h3 className="text-xl font-bold leading-tight">{g.fullName ?? g.name}</h3>
                            <p className="text-sm text-foreground/30 tracking-wide mt-1 mb-2">
                                {g.meta}
                            </p>
                            <ul className="divide-y divide-border/20">
                                {g.items.map((item, j) => (
                                    <li key={j} className="py-3">
                                        <p className="text-lg font-bold">{item.title}</p>
                                        {item.detail && <p className="text-foreground/50 leading-relaxed">{item.detail}</p>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
