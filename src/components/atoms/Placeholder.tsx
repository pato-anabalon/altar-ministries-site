import { cn } from "@/lib/cn";

/**
 * Stand-in for material the client has not supplied yet (photos, bios, video). Keeps the final
 * aspect ratio so the real asset drops in 1:1, and says what goes there. Never ship invented
 * content instead of this.
 */
export function Placeholder({
  label,
  ratio = "4/5",
  className,
}: {
  /** What belongs here, e.g. "Photo: Senior Leaders". */
  label: string;
  /** CSS aspect-ratio, e.g. "16/9", "4/5", "1/1". */
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      style={{ aspectRatio: ratio }}
      className={cn(
        "relative flex w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-[2px] border border-dashed border-rule",
        "bg-[color-mix(in_oklab,var(--s-accent)_7%,var(--s-bg))] text-muted",
        className,
      )}
    >
      <svg aria-hidden viewBox="0 0 40 56" className="h-12 w-auto opacity-60" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M2 55V26C2 12 11 3 20 1c9 2 18 11 18 25v29" />
        <path d="M8 55V28c0-10 5.5-17 12-19 6.5 2 12 9 12 19v27" />
      </svg>
      <span className="max-w-[24ch] px-4 text-center type-small">{label}</span>
    </div>
  );
}
