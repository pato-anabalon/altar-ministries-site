import Image from "next/image";
import { cn } from "@/lib/cn";

export type LogoTone = "ink" | "white" | "cream" | "green";

/** Trimmed from the client's transparent PNGs (6–9). 284×116: sharp up to ~140px wide on 2x screens. */
const LOGO_SIZE = { width: 284, height: 116 };

/**
 * The real logo (with the waved "A") for header and footer. For a large "ALTAR", use Wordmark:
 * live text in TAN Mon Cheri stays sharp at any size.
 */
export function Logo({ tone = "green", width = 132, priority = false, className }: { tone?: LogoTone; width?: number; priority?: boolean; className?: string }) {
  return (
    <Image
      src={`/images/logo/altar-logo-${tone}.png`}
      alt="Altar Ministries"
      width={LOGO_SIZE.width}
      height={LOGO_SIZE.height}
      priority={priority}
      sizes={`${width}px`}
      style={{ width, height: "auto" }}
      className={cn("select-none", className)}
    />
  );
}
