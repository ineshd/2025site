"use client";

import {KeyboardEvent, PointerEvent, useCallback, useEffect, useRef, useState} from "react";

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

export default function AwardsWheel({groups}: { groups: AwardGroup[] }) {
    const n = groups.length;
    const [pos, setPos] = useState(0);        // rendered position, in names (unbounded)
    const posRef = useRef(0);
    const target = useRef(0);                 // where the wheel is gliding to
    const [selected, setSelected] = useState(0);
    const frame = useRef<number | null>(null);
    const reducedMotion = useRef(false);

    useEffect(() => {
        reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        return () => {
            if (frame.current !== null) cancelAnimationFrame(frame.current);
        };
    }, []);

    const setPosition = (p: number) => {
        posRef.current = p;
        setPos(p);
    };

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
            setPosition(posRef.current + diff * (1 - Math.exp(-(now - last) / GLIDE_MS)));
            last = now;
            frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
    }, []);

    const moveTo = useCallback((t: number) => {
        target.current = t;
        setSelected(mod(t, n));
        if (reducedMotion.current) {
            if (frame.current !== null) cancelAnimationFrame(frame.current);
            frame.current = null;
            setPosition(t);
        } else {
            glide();
        }
    }, [glide, n]);

    const step = useCallback((delta: number) => moveTo(Math.round(target.current) + delta), [moveTo]);

    // Click and hold an arrow button to keep spinning.
    const holdTimer = useRef<number | null>(null);
    const stopHold = () => {
        if (holdTimer.current !== null) clearTimeout(holdTimer.current);
        holdTimer.current = null;
    };
    useEffect(() => stopHold, []);
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
    // scrolls the page); it snaps to the nearest name on release.
    const drag = useRef<{ y: number; pos: number; moved: boolean } | null>(null);
    const suppressClick = useRef(false);
    const slotPx = () => SPACING_REM * parseFloat(getComputedStyle(document.documentElement).fontSize);
    const onListPointerDown = (e: PointerEvent<HTMLUListElement>) => {
        suppressClick.current = false;
        if (e.pointerType === "touch" || e.button !== 0) return;
        drag.current = {y: e.clientY, pos: posRef.current, moved: false};
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
        target.current = p;
        setPosition(p);
        setSelected(mod(p, n));
    };
    const onListPointerUp = () => {
        const d = drag.current;
        drag.current = null;
        if (d?.moved) {
            suppressClick.current = true;
            moveTo(Math.round(posRef.current));
        }
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowDown") step(1);
        else if (e.key === "ArrowUp") step(-1);
        else return;
        e.preventDefault();
    };

    const group = groups[selected];
    const arrowClass = "size-10 grid place-items-center bg-primary text-background hover:bg-secondary active:brightness-90 transition-colors duration-200 select-none touch-manipulation";

    return (
        <div role="region" aria-roledescription="carousel" aria-label="Awards" tabIndex={0} onKeyDown={onKeyDown}
             className="grid lg:grid-cols-2 gap-x-12 gap-y-6 items-center outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <div className="flex items-center gap-4">
                <div className="flex flex-col gap-3">
                    <button type="button" aria-label="Previous award group" className={arrowClass}
                            onPointerDown={startHold(-1)} onPointerUp={stopHold} onPointerLeave={stopHold}
                            onPointerCancel={stopHold} onContextMenu={(e) => e.preventDefault()}
                            onClick={(e) => e.detail === 0 && step(-1) /* keyboard activation */}>
                        <span aria-hidden="true" className="material-symbols-rounded">arrow_upward</span>
                    </button>
                    <button type="button" aria-label="Next award group" className={arrowClass}
                            onPointerDown={startHold(1)} onPointerUp={stopHold} onPointerLeave={stopHold}
                            onPointerCancel={stopHold} onContextMenu={(e) => e.preventDefault()}
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
                                                    transition-colors duration-300
                                                    ${opacity === 0 ? "pointer-events-none" : ""}
                                                    ${isSelected ? "text-primary" : "text-foreground"}`}>
                                    {g.name}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Keyed on the selection so the details fade in fresh each time. */}
            <div key={group.name} aria-live="polite" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h3 className="text-xl font-bold leading-tight">{group.fullName ?? group.name}</h3>
                <p className="text-sm text-foreground/30 tracking-wide mt-1 mb-2">
                    {group.meta} · {selected + 1} / {n}
                </p>
                <ul className="divide-y divide-border/20">
                    {group.items.map((item, j) => (
                        <li key={j} className="py-3">
                            <p className="text-lg font-bold">{item.title}</p>
                            {item.detail && <p className="text-foreground/50 leading-relaxed">{item.detail}</p>}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
