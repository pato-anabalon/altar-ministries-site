import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SurfaceName = "cream" | "white" | "green" | "ink";
type Spacing = "default" | "compact" | "none";

const spacingClasses: Record<Spacing, string> = {
  default: "py-20 sm:py-28 lg:py-36",
  compact: "py-12 sm:py-16 lg:py-20",
  none: "",
};

/**
 * A page band. `surface` sets data-surface, which re-maps the colour roles (fg, muted, accent,
 * on-accent, rule) for everything inside, so components never need a light/dark variant.
 */
export function Section({
  children,
  surface = "cream",
  spacing = "default",
  as: Tag = "section",
  id,
  className,
  "aria-labelledby": labelledBy,
  "aria-label": label,
}: {
  children: ReactNode;
  surface?: SurfaceName;
  spacing?: Spacing;
  as?: "section" | "div" | "header" | "footer" | "aside";
  id?: string;
  className?: string;
  "aria-labelledby"?: string;
  /** For a band without a visible heading of its own. */
  "aria-label"?: string;
}) {
  return (
    <Tag id={id} data-surface={surface} aria-labelledby={labelledBy} aria-label={label} className={cn(spacingClasses[spacing], className)}>
      {children}
    </Tag>
  );
}
