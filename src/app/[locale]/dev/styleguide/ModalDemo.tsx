"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button";
import { Placeholder } from "@/components/atoms/Placeholder";
import { Modal } from "@/components/molecules/Modal";

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("common");

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open ministry modal
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Youth Ministry" closeLabel={t("close")}>
        <div className="grid gap-6">
          <Placeholder label="Photo: Youth Ministry" ratio="16/9" />
          <p className="type-body measure">
            Placeholder copy: team description, meeting details and contact arrive with the client&apos;s material. The
            modal keeps its own URL in milestone 6, so this exact view can be shared.
          </p>
          <div>
            <Button href="/contact" arrow>
              Contact the team
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
