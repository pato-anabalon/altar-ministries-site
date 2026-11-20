import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  /** Trailing arrow that nudges forward on hover. External links get the diagonal arrow. */
  arrow?: boolean;
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
};

type AsInternal = CommonProps & { href: ComponentProps<typeof Link>["href"]; externalHref?: never };
type AsExternal = CommonProps & { externalHref: string; href?: never } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;
type AsButton = CommonProps & { href?: never; externalHref?: never } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

/**
 * Button = an action (plan a visit, watch online, send). Colours come from the surrounding
 * surface: primary is the surface accent, secondary is an outline that fills on hover.
 * Navigation inside copy uses TextLink, not Button.
 */
export function buttonClasses(variant: Variant, size: Size, className?: string) {
  return cn(
    "group/button inline-flex items-center justify-center gap-2.5 rounded-[2px] border type-ui",
    "transition-[background-color,color,border-color] duration-300 ease-out-expo",
    "disabled:pointer-events-none disabled:opacity-45",
    size === "lg" ? "min-h-14 px-8" : "min-h-12 px-6",
    variant === "primary"
      ? "border-accent bg-accent text-on-accent hover:border-[color-mix(in_oklab,var(--s-accent)_86%,var(--s-fg))] hover:bg-[color-mix(in_oklab,var(--s-accent)_86%,var(--s-fg))]"
      : "border-fg/70 bg-transparent text-fg hover:border-accent hover:bg-accent hover:text-on-accent",
    className,
  );
}

function Arrow({ external }: { external?: boolean }) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <Icon
      aria-hidden
      strokeWidth={1.5}
      className={cn(
        "size-4 shrink-0 transition-transform duration-300 ease-out-expo",
        external ? "group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" : "group-hover/button:translate-x-1",
      )}
    />
  );
}

export function Button(props: AsInternal | AsExternal | AsButton) {
  const { variant = "primary", size = "md", arrow = false, className, children, ...rest } = props;
  const classes = buttonClasses(variant, size, className);

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkRest } = rest as Omit<AsInternal, keyof CommonProps>;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
        {arrow && <Arrow />}
      </Link>
    );
  }

  if ("externalHref" in rest && rest.externalHref !== undefined) {
    const { externalHref, ...anchorRest } = rest as Omit<AsExternal, keyof CommonProps>;
    return (
      <a href={externalHref} target="_blank" rel="noopener noreferrer" className={classes} {...anchorRest}>
        {children}
        {arrow && <Arrow external />}
      </a>
    );
  }

  const { type = "button", ...buttonRest } = rest as Omit<AsButton, keyof CommonProps>;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
