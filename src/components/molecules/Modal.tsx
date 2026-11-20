"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SurfaceName } from "@/components/atoms/Section";

/**
 * Native <dialog> modal: focus trap, Escape and inert background come from the platform.
 * Used by ministries (grid → modal with its own URL): `onClose` is where the caller navigates back.
 * Entry/exit motion lives in globals.css (.altar-modal) and collapses under reduced motion.
 */
export function Modal({
  open,
  onClose,
  title,
  closeLabel,
  surface = "cream",
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  /** Rendered as the dialog's heading and accessible name. */
  title: ReactNode;
  /** Translated label for the close button, e.g. "Close" / "Cerrar". */
  closeLabel: string;
  surface?: SurfaceName;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      data-surface={surface}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      // Keeps state in sync if the dialog closes any other way (form method="dialog", script).
      onClose={() => {
        if (open) onClose();
      }}
      onClick={(event) => {
        // A click on the dialog element itself (not its content) is a click on the backdrop.
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "altar-modal m-auto max-h-[min(88svh,56rem)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto overscroll-contain rounded-[2px] p-0",
        "shadow-[0_24px_60px_-12px_rgb(0_0_0/0.45)]",
        className,
      )}
    >
      <div className="relative p-6 sm:p-10">
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute top-3 right-3 grid size-11 place-items-center rounded-full text-fg transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--s-accent)_10%,transparent)] sm:top-5 sm:right-5"
        >
          <X aria-hidden strokeWidth={1.5} className="size-5" />
        </button>
        <h2 id={titleId} className="pr-12 type-h2">
          {title}
        </h2>
        <div className="mt-6">{children}</div>
      </div>
    </dialog>
  );
}
