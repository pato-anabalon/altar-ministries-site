import { cn } from "@/lib/cn";

/**
 * Large "ALTAR" as live text in TAN Mon Cheri (the logo face, without the waved "A" for now).
 * Size it with a font-size class; MINISTRIES scales with it.
 */
export function Wordmark({ withMinistries = true, className }: { withMinistries?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex flex-col items-center font-display leading-[0.85]", className)}>
      <span>ALTAR</span>
      {withMinistries && (
        <span className="mt-[0.12em] font-sans text-[0.115em] font-normal leading-none tracking-[0.55em] [margin-right:-0.55em]">
          MINISTRIES
        </span>
      )}
    </span>
  );
}
