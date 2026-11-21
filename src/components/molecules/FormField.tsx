import type { ComponentProps, ReactNode } from "react";
import { ChevronDown, CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

/** Shared look of text inputs, selects and textareas on any surface. */
export const controlClasses = cn(
  "min-h-14 w-full rounded-[2px] border border-rule bg-[color-mix(in_oklab,var(--s-bg)_70%,var(--color-white))] px-4 py-3 type-body text-fg",
  "transition-[border-color,box-shadow] duration-300 placeholder:text-muted",
  "hover:border-[color-mix(in_oklab,var(--s-fg)_45%,transparent)]",
  "focus-visible:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
  "aria-invalid:border-fg aria-invalid:ring-1 aria-invalid:ring-fg",
);

/** A select with the shared look; its own chevron keeps the same inset as the text (the native arrow hugs the border). */
export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select {...props} className={cn(controlClasses, "cursor-pointer appearance-none pr-12", className)} />
      <ChevronDown aria-hidden strokeWidth={1.5} className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-fg" />
    </div>
  );
}

/**
 * A labelled form control with an optional hint and an error that is announced and tied to the
 * control (aria-describedby). Errors carry an icon and words, not colour alone.
 */
export function FormField({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: ReactNode;
  hint?: string;
  error?: string;
  children: (describedBy: string | undefined) => ReactNode;
}) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    // content-start: a field beside a taller one (with an error) keeps its label and control together.
    <div className="grid content-start gap-2">
      <label htmlFor={id} className="type-ui">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="type-small text-muted">
          {hint}
        </p>
      )}
      {children(describedBy)}
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-2 type-small">
          <CircleAlert aria-hidden strokeWidth={1.5} className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
