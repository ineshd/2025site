import TransitionLink from "@/app/components/TransitionLink";

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
      className="group flex-1 flex items-center justify-between border border-border/20 rounded-lg px-8 py-6 hover:border-primary/40 transition-colors duration-200"
    >
      <span
        style={
          viewTransitionName
            ? ({ viewTransitionName } as React.CSSProperties)
            : undefined
        }
        className="text-2xl font-black italic group-hover:text-primary transition-colors duration-200"
      >
        {label}
      </span>
      <span className="text-foreground/30 group-hover:text-primary transition-colors duration-200 pl-4">
        →
      </span>
    </TransitionLink>
  );
}
