"use client"

import Link from "next/link";
import {useRouter} from "next/navigation";
import {AnchorHTMLAttributes, MouseEvent, useEffect} from "react";
import {useViewTransitionNavigate} from "@/app/components/ViewTransitionProvider";

interface TransitionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
}

export default function TransitionLink({href, children, onClick, ...rest}: TransitionLinkProps) {
    const router = useRouter();
    const navigate = useViewTransitionNavigate();

    useEffect(() => {
        router.prefetch(href);
    }, [router, href]);

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        e.preventDefault();
        navigate(href);
    };

    return (
        <Link href={href} onClick={handleClick} {...rest}>
            {children}
        </Link>
    );
}
