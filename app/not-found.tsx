import type { Metadata } from "next";
import Layout from "@/app/components/Layout";
import FullScreen4545Grid from "@/app/components/FullScreen4545Grid";
import TransitionLink from "@/app/components/TransitionLink";
import SweepReveal from "@/app/components/SweepReveal";

export const metadata: Metadata = {
    title: "Not found",
};

export default function NotFound() {
    return (
        <Layout>
            <section className="relative flex items-center justify-center min-h-[calc(100svh-8rem)] max-lg:min-h-[calc(100svh-6rem)] px-8 py-16">
                {/* "404 404 404…" fills the screen, running up behind the header too. */}
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -top-32 max-lg:-top-24 overflow-hidden pointer-events-none opacity-10">
                    <FullScreen4545Grid text="404 " />
                </div>
                <div className="relative flex flex-col items-center gap-10 text-center">
                    <h1 className="max-w-4xl text-5xl max-lg:text-4xl max-sm:text-3xl font-black leading-tight text-balance">
                        this is not where you&apos;re supposed to be
                    </h1>
                    <TransitionLink href="/"
                        className="group relative flex flex-col items-center px-8 py-4 text-background text-xl font-black active:brightness-90 transition-[filter] duration-200">
                        <span aria-hidden="true" className="absolute inset-0 -skew-x-12 bg-primary" />
                        <span className="relative">take me home</span>
                        <span className="relative text-sm font-medium text-background/60">country roads??</span>
                        <SweepReveal skewed slant="17px" className="flex flex-col items-center px-8 py-4">
                            <span className="relative">take me home</span>
                            <span className="relative text-sm font-medium text-foreground/70">country roads??</span>
                        </SweepReveal>
                    </TransitionLink>
                </div>
            </section>
        </Layout>
    );
}
