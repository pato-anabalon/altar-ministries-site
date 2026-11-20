import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Width = "default" | "narrow";

/** Horizontal rhythm for every section: 16px gutter on phones, wider on larger screens. */
export function Container({ children, width = "default", className }: { children: ReactNode; width?: Width; className?: string }) {
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-8 lg:px-12", width === "narrow" ? "max-w-4xl" : "max-w-[90rem]", className)}>
      {children}
    </div>
  );
}
