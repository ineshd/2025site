"use client"

import {createContext, ReactNode, useContext, useEffect, useRef} from "react";
import {usePathname, useRouter} from "next/navigation";

type NavigateFn = (href: string) => void;

const ViewTransitionContext = createContext<NavigateFn | null>(null);

export function ViewTransitionProvider({children}: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const pending = useRef<{ href: string; resolve: () => void } | null>(null);

    // Persists across route changes (lives in the root layout), so it can
    // reliably observe the pathname update that signals the new page has
    // committed — unlike a per-link effect, which unmounts mid-navigation.
    useEffect(() => {
        if (pending.current && pending.current.href === pathname) {
            pending.current.resolve();
            pending.current = null;
        }
    }, [pathname]);

    const navigate: NavigateFn = (href) => {
        // A link back to the current page never changes the pathname, so the
        // update-callback promise below would never resolve naturally — skip
        // the view transition entirely and let it act as a no-op/refresh.
        if (href === pathname) {
            router.push(href);
            return;
        }

        if (typeof document === "undefined" || !document.startViewTransition) {
            router.push(href);
            return;
        }

        // The hero group exists in both directions, so its slide-in animation
        // would also run (wrongly) when leaving home. Tag only the navigation
        // *to* home so the CSS can scope the slide to that direction; otherwise
        // the hero just uses the default crossfade out.
        document.documentElement.classList.toggle("vt-to-home", href === "/");

        // Swap the home hero's animated grid for its cheap static stand-in
        // *before* the old state is captured, so the snapshot doesn't have to
        // rasterize hundreds of live framer-motion nodes. No-op off the home page.
        document.dispatchEvent(new CustomEvent("hero-capture:start"));

        const transition = document.startViewTransition(() => {
            // Old state is captured by now — restore the live grid.
            document.dispatchEvent(new CustomEvent("hero-capture:end"));
            router.push(href);
            return new Promise<void>((resolve) => {
                pending.current = {href, resolve};
                // Fallback in case the route never commits (e.g. a failed
                // navigation), so the transition doesn't hang indefinitely.
                setTimeout(resolve, 5000);
            });
        });
        transition.ready.catch(() => {
        });
        transition.finished
            .finally(() => document.documentElement.classList.remove("vt-to-home"))
            .catch(() => {
            });
    };

    return (
        <ViewTransitionContext.Provider value={navigate}>
            {children}
        </ViewTransitionContext.Provider>
    );
}

export function useViewTransitionNavigate(): NavigateFn {
    const ctx = useContext(ViewTransitionContext);
    if (!ctx) {
        throw new Error("useViewTransitionNavigate must be used within a ViewTransitionProvider");
    }
    return ctx;
}
