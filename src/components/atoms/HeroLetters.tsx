import { cn } from "@/lib/cn";

/**
 * "ALTAR" set letter by letter, shared by the preloader and the home hero so the two line up
 * exactly at the hand-off. Sits over the arch window (the cross behind it is aligned to the T);
 * on phones it is nudged down to the window's centre. Decorative: the logo and the H1 carry the
 * name for assistive tech.
 */
export const heroLettersLayout = "pointer-events-none absolute inset-0 flex justify-center items-center portrait:pt-[14svh]";

export function HeroLetters({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div aria-hidden className={cn(heroLettersLayout, className)}>
      <div className="relative">
        <span className="flex pt-[0.2em] font-display text-[clamp(5rem,17vw,17rem)] leading-none portrait:text-[21vw]">
          {["A", "L", "T", "A", "R"].map((letter, index) => (
            <span key={index} data-letter={index} className="inline-block will-change-transform">
              {letter}
            </span>
          ))}
        </span>
        {/* Out of flow, so extra lines (the preloader's MINISTRIES) never shift ALTAR off the hero's position. */}
        {children && <div className="absolute inset-x-0 top-full flex justify-center">{children}</div>}
      </div>
    </div>
  );
}
