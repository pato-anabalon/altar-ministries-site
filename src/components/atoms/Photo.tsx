import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * A congregation photo at its 4:5 source ratio (provisional Instagram crops; same ratio as the
 * originals expected, so they replace 1:1). `sizes` should describe the rendered width.
 */
export function Photo({ src, alt, sizes, className }: { src: string; alt: string; sizes: string; className?: string }) {
  return (
    <div className={cn("relative aspect-[4/5] overflow-hidden rounded-[2px] bg-[color-mix(in_oklab,var(--s-accent)_8%,var(--s-bg))]", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}
