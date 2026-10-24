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
      className="rounded-full group flex-1 flex items-center justify-between border border-border/20 px-8 py-6 hover:bg-primary hover:border-primary/40 transition-colors duration-200"
    >
      <span
        style={
          viewTransitionName
            ? ({ viewTransitionName } as React.CSSProperties)
            : undefined
        }
        className="text-2xl font-black group-hover:text-background transition-colors duration-200"
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className="material-symbols-rounded text-foreground/30 group-hover:text-background transition-colors duration-200 ml-4"
      >
        arrow_forward
      </span>
    </TransitionLink>
  );
}
