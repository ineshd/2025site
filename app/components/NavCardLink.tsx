import TransitionLink from "@/app/components/TransitionLink";
import SweepReveal from "@/app/components/SweepReveal";

interface NavCardLinkProps {
  href: string;
  label: string;
  viewTransitionName?: string;
}

export default function NavCardLink({
  href,
  label,
  viewTransitionName,
}: NavCardLinkProps) {
  return (
    <TransitionLink
      href={href}
      className="group relative flex-1 flex items-center justify-between text-background px-8 py-6 active:brightness-90 transition-[filter] duration-200"
    >
      {/* Slanted green tab at rest; blue sweeps across it on hover, turning the text white (matches the header nav). */}
      <span aria-hidden="true" className="absolute inset-0 -skew-x-12 bg-primary" />
      <span
        style={
          viewTransitionName
            ? ({ viewTransitionName } as React.CSSProperties)
            : undefined
        }
        className="relative text-2xl font-black"
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className="relative material-symbols-rounded text-background/60 ml-4"
      >
        arrow_forward
      </span>
      <SweepReveal skewed slant="17px" className="flex items-center justify-between px-8 py-6">
        <span className="relative text-2xl font-black">{label}</span>
        <span className="relative material-symbols-rounded text-foreground/60 ml-4">arrow_forward</span>
      </SweepReveal>
    </TransitionLink>
  );
}
