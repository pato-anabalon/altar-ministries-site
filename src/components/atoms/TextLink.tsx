import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn, externalLinkProps } from "@/lib/cn";

/**
 * TextLink = navigation inside copy and lists. The underline draws out to the right on hover and
 * redraws from the left, so the link never loses its affordance.
 */
const textLinkClasses = cn(
  "bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:100%_1px] bg-[position:0_100%] pb-0.5",
  "transition-[background-size] duration-500 ease-out-expo hover:bg-[length:0%_1px] hover:bg-[position:100%_100%]",
);

type CommonProps = { children: ReactNode; className?: string; onClick?: () => void; "data-testid"?: string };

export function TextLink(
  props: CommonProps & ({ href: ComponentProps<typeof Link>["href"]; externalHref?: never } | { externalHref: string; href?: never }),
) {
  const { children, className, ...rest } = props;
  const classes = cn(textLinkClasses, className);

  if (rest.externalHref !== undefined) {
    const { externalHref, ...anchorRest } = rest;
    return (
      <a href={externalHref} {...externalLinkProps(externalHref)} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const { href, ...linkRest } = rest;
  return (
    <Link href={href} className={classes} {...linkRest}>
      {children}
    </Link>
  );
}
