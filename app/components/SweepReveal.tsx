import type { CSSProperties, ReactNode } from "react";

// The blue hover sweep for green buttons, together with a white copy of the button's
// content. One slanted clip-path (.sweep-reveal in globals.css) reveals both, so the
// text turns white exactly where the blue has reached. `className` must repeat the
// button's own padding/layout so the copy lines up with the original; `slant` is how
// far the leading edge leans (about 0.21 x the button height, to match -12deg).
export default function SweepReveal({ children, className = "", skewed = false, slant }: {
    children: ReactNode;
    className?: string;
    skewed?: boolean;
    slant?: string;
}) {
    return (
        <span aria-hidden="true"
            className={`sweep-reveal pointer-events-none absolute inset-0 text-foreground ${className}`}
            style={slant ? ({ "--sweep-slant": slant } as CSSProperties) : undefined}>
            <span className={`absolute inset-0 bg-secondary ${skewed ? "-skew-x-12" : ""}`} />
            {children}
        </span>
    );
}
