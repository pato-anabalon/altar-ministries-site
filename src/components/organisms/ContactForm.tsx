"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button";
import { TextLink } from "@/components/atoms/TextLink";
import { controlClasses, FormField, Select } from "@/components/molecules/FormField";
import { CONTACT_TOPICS, contactSchema, fieldErrors, HONEYPOT, type ContactInput, type FormResult } from "@/lib/forms";
import { site } from "@/lib/site";
import { useFormErrors } from "@/lib/useFormErrors";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Contact form. Validates with the same schema as /api/contact, shows errors inline and moves
 * focus to the first one; success replaces the form with a thank-you. `?about=` and `?topic=` (set
 * by the "Ask about this team/event" buttons) carry the context to the church; `defaultTopic` presets
 * the topic where the page already says it (Plan your visit).
 */
export function ContactForm({ defaultTopic }: { defaultTopic?: (typeof CONTACT_TOPICS)[number] } = {}) {
  const t = useTranslations("forms");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const about = searchParams.get("about")?.slice(0, 120) ?? "";
  const presetTopic = CONTACT_TOPICS.find((topic) => topic === searchParams.get("topic")) ?? defaultTopic ?? "";
  const id = useId();
  const form = useRef<HTMLFormElement>(null);
  // Raw values; the schema decides what is valid.
  const read = (target: HTMLFormElement) => {
    const data = new FormData(target);
    return {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      topic: String(data.get("topic") ?? ""),
      message: String(data.get("message") ?? ""),
      about,
      consent: data.get("consent") === "on",
    };
  };
  const { errors, setErrors, onChange } = useFormErrors<ContactInput>((target) => {
    const parsed = contactSchema.safeParse(read(target));
    return parsed.success ? {} : fieldErrors(parsed.error);
  });
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState<string>("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = contactSchema.safeParse(read(event.currentTarget));
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...parsed.data, locale, [HONEYPOT]: String(data.get(HONEYPOT) ?? "") }),
      });
      const result = (await response.json()) as FormResult;
      if (result.ok) return setStatus("sent");
      setFailure(result.error === "rate_limited" ? t("errorRate") : t("errorGeneric", { email: site.email }));
    } catch {
      setFailure(t("errorGeneric", { email: site.email }));
    }
    setStatus("error");
  }

  if (status === "sent") {
    return (
      <div role="status" className="grid gap-3 border-t border-rule pt-8">
        <p className="type-h2">{t("sentTitle")}</p>
        <p className="type-lead text-muted">{t("sentText")}</p>
      </div>
    );
  }

  const error = (field: keyof ContactInput) => (errors[field] ? t(`errors.${errors[field]}`) : undefined);

  return (
    <form ref={form} noValidate onSubmit={submit} onChange={onChange} className="grid gap-6">
      {about && <p className="type-ui">{t("about", { about })}</p>}

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField id={`${id}-name`} label={t("name")} error={error("name")}>
          {(describedBy) => (
            <input id={`${id}-name`} name="name" autoComplete="name" className={controlClasses} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy} />
          )}
        </FormField>
        <FormField id={`${id}-email`} label={t("email")} error={error("email")}>
          {(describedBy) => (
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              className={controlClasses}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describedBy}
            />
          )}
        </FormField>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField id={`${id}-phone`} label={t("phone")} error={error("phone")}>
          {(describedBy) => (
            <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" className={controlClasses} aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy} />
          )}
        </FormField>
        <FormField id={`${id}-topic`} label={t("topic")} error={error("topic")}>
          {(describedBy) => (
            <Select
              id={`${id}-topic`}
              name="topic"
              defaultValue={presetTopic}
              aria-invalid={Boolean(errors.topic)}
              aria-describedby={describedBy}
            >
              <option value="" disabled>
                {t("topicPlaceholder")}
              </option>
              {CONTACT_TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {t(`topics.${topic}`)}
                </option>
              ))}
            </Select>
          )}
        </FormField>
      </div>

      <FormField id={`${id}-message`} label={t("message")} error={error("message")}>
        {(describedBy) => (
          <textarea id={`${id}-message`} name="message" rows={6} className={controlClasses} aria-invalid={Boolean(errors.message)} aria-describedby={describedBy} />
        )}
      </FormField>

      {/* Honeypot: off-screen and out of the tab order; people never fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-${HONEYPOT}`}>Website</label>
        <input id={`${id}-${HONEYPOT}`} name={HONEYPOT} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-2">
        <label className="flex items-start gap-3 type-body">
          <input
            name="consent"
            type="checkbox"
            className="mt-1.5 size-4 shrink-0 accent-[var(--s-accent)]"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
          />
          <span>
            {t("consentContact")} <TextLink href="/resources/policies">{t("policiesLink")}</TextLink>
          </span>
        </label>
        {errors.consent && (
          <p id={`${id}-consent-error`} className="type-small">
            {error("consent")}
          </p>
        )}
      </div>

      <div aria-live="polite" className="grid gap-4">
        {status === "error" && <p className="type-body">{failure}</p>}
        <div>
          <Button type="submit" disabled={status === "sending"} arrow>
            {status === "sending" ? t("sending") : t("send")}
          </Button>
        </div>
      </div>
    </form>
  );
}
